package store

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/aegis-agent-id/backend/pkg/models"
	_ "modernc.org/sqlite"
)

type DB struct {
	conn *sql.DB
}

func NewDB(path string) (*DB, error) {
	conn, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}
	// Enable WAL mode for better concurrent reads
	if _, err := conn.Exec("PRAGMA journal_mode=WAL"); err != nil {
		return nil, fmt.Errorf("set WAL: %w", err)
	}
	db := &DB{conn: conn}
	if err := db.migrate(); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return db, nil
}

func (db *DB) Close() error {
	return db.conn.Close()
}

func (db *DB) migrate() error {
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS agents (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			spiffe_id TEXT UNIQUE NOT NULL,
			type TEXT NOT NULL,
			status TEXT NOT NULL DEFAULT 'provisioning',
			trust_level TEXT NOT NULL DEFAULT 'untrusted',
			description TEXT DEFAULT '',
			owner TEXT DEFAULT '',
			last_active DATETIME,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			certificate_expiry DATETIME,
			policies TEXT DEFAULT '[]',
			tags TEXT DEFAULT '[]',
			requests_today INTEGER DEFAULT 0,
			avg_latency_ms REAL DEFAULT 0,
			error_rate REAL DEFAULT 0
		)`,
		`CREATE TABLE IF NOT EXISTS policies (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT DEFAULT '',
			status TEXT NOT NULL DEFAULT 'draft',
			rego_code TEXT DEFAULT '',
			assigned_agents INTEGER DEFAULT 0,
			last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
			created_by TEXT DEFAULT '',
			violations INTEGER DEFAULT 0,
			category TEXT DEFAULT ''
		)`,
		`CREATE TABLE IF NOT EXISTS audit_events (
			id TEXT PRIMARY KEY,
			timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
			agent_id TEXT,
			agent_name TEXT,
			event_type TEXT NOT NULL,
			severity TEXT NOT NULL DEFAULT 'info',
			description TEXT DEFAULT '',
			source_ip TEXT DEFAULT '',
			trace_id TEXT DEFAULT '',
			metadata TEXT DEFAULT '{}'
		)`,
		`CREATE TABLE IF NOT EXISTS certificates (
			serial TEXT PRIMARY KEY,
			spiffe_id TEXT NOT NULL,
			agent_id TEXT,
			certificate TEXT NOT NULL,
			issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			expires_at DATETIME NOT NULL,
			revoked INTEGER DEFAULT 0,
			revoked_at DATETIME
		)`,
		`CREATE TABLE IF NOT EXISTS trust_edges (
			id TEXT PRIMARY KEY,
			source TEXT NOT NULL,
			target TEXT NOT NULL,
			trust_level TEXT NOT NULL DEFAULT 'untrusted',
			protocol TEXT DEFAULT 'gRPC/mTLS',
			requests_per_min INTEGER DEFAULT 0
		)`,
		`CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status)`,
		`CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(type)`,
		`CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events(timestamp DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_audit_agent ON audit_events(agent_id)`,
		`CREATE INDEX IF NOT EXISTS idx_audit_severity ON audit_events(severity)`,
		`CREATE INDEX IF NOT EXISTS idx_certs_spiffe ON certificates(spiffe_id)`,
	}
	for _, m := range migrations {
		if _, err := db.conn.Exec(m); err != nil {
			return fmt.Errorf("migration: %w\nSQL: %s", err, m)
		}
	}
	log.Println("[DB] Migrations complete")
	return nil
}

// ================================================================
// Agent Store
// ================================================================

func (db *DB) ListAgents(statusFilter, typeFilter string) ([]models.Agent, error) {
	query := "SELECT id, name, spiffe_id, type, status, trust_level, description, owner, last_active, created_at, certificate_expiry, policies, tags, requests_today, avg_latency_ms, error_rate FROM agents WHERE 1=1"
	args := []interface{}{}

	if statusFilter != "" && statusFilter != "all" {
		query += " AND status = ?"
		args = append(args, statusFilter)
	}
	if typeFilter != "" && typeFilter != "all" {
		query += " AND type = ?"
		args = append(args, typeFilter)
	}
	query += " ORDER BY last_active DESC"

	rows, err := db.conn.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var agents []models.Agent
	for rows.Next() {
		a, err := scanAgent(rows)
		if err != nil {
			return nil, err
		}
		agents = append(agents, a)
	}
	return agents, nil
}

func (db *DB) GetAgent(id string) (*models.Agent, error) {
	row := db.conn.QueryRow("SELECT id, name, spiffe_id, type, status, trust_level, description, owner, last_active, created_at, certificate_expiry, policies, tags, requests_today, avg_latency_ms, error_rate FROM agents WHERE id = ?", id)
	a, err := scanAgentRow(row)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (db *DB) CreateAgent(a *models.Agent) error {
	policiesJSON, _ := json.Marshal(a.Policies)
	tagsJSON, _ := json.Marshal(a.Tags)
	_, err := db.conn.Exec(
		`INSERT INTO agents (id, name, spiffe_id, type, status, trust_level, description, owner, last_active, created_at, certificate_expiry, policies, tags, requests_today, avg_latency_ms, error_rate)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		a.ID, a.Name, a.SpiffeID, a.Type, a.Status, a.TrustLevel, a.Description, a.Owner,
		a.LastActive, a.CreatedAt, a.CertificateExpiry,
		string(policiesJSON), string(tagsJSON),
		a.Metrics.RequestsToday, a.Metrics.AvgLatencyMs, a.Metrics.ErrorRate,
	)
	return err
}

func (db *DB) UpdateAgentStatus(id string, status models.AgentStatus, trustLevel models.TrustLevel) error {
	_, err := db.conn.Exec("UPDATE agents SET status = ?, trust_level = ?, last_active = ? WHERE id = ?",
		status, trustLevel, time.Now(), id)
	return err
}

func (db *DB) DeleteAgent(id string) error {
	_, err := db.conn.Exec("DELETE FROM agents WHERE id = ?", id)
	return err
}

func scanAgent(rows *sql.Rows) (models.Agent, error) {
	var a models.Agent
	var policiesStr, tagsStr string
	var lastActive, createdAt, certExpiry sql.NullTime

	err := rows.Scan(
		&a.ID, &a.Name, &a.SpiffeID, &a.Type, &a.Status, &a.TrustLevel,
		&a.Description, &a.Owner, &lastActive, &createdAt, &certExpiry,
		&policiesStr, &tagsStr,
		&a.Metrics.RequestsToday, &a.Metrics.AvgLatencyMs, &a.Metrics.ErrorRate,
	)
	if err != nil {
		return a, err
	}
	if lastActive.Valid {
		a.LastActive = lastActive.Time
	}
	if createdAt.Valid {
		a.CreatedAt = createdAt.Time
	}
	if certExpiry.Valid {
		a.CertificateExpiry = certExpiry.Time
	}
	json.Unmarshal([]byte(policiesStr), &a.Policies)
	json.Unmarshal([]byte(tagsStr), &a.Tags)
	return a, nil
}

func scanAgentRow(row *sql.Row) (models.Agent, error) {
	var a models.Agent
	var policiesStr, tagsStr string
	var lastActive, createdAt, certExpiry sql.NullTime

	err := row.Scan(
		&a.ID, &a.Name, &a.SpiffeID, &a.Type, &a.Status, &a.TrustLevel,
		&a.Description, &a.Owner, &lastActive, &createdAt, &certExpiry,
		&policiesStr, &tagsStr,
		&a.Metrics.RequestsToday, &a.Metrics.AvgLatencyMs, &a.Metrics.ErrorRate,
	)
	if err != nil {
		return a, err
	}
	if lastActive.Valid {
		a.LastActive = lastActive.Time
	}
	if createdAt.Valid {
		a.CreatedAt = createdAt.Time
	}
	if certExpiry.Valid {
		a.CertificateExpiry = certExpiry.Time
	}
	json.Unmarshal([]byte(policiesStr), &a.Policies)
	json.Unmarshal([]byte(tagsStr), &a.Tags)
	return a, nil
}

// ================================================================
// Policy Store
// ================================================================

func (db *DB) ListPolicies() ([]models.Policy, error) {
	rows, err := db.conn.Query("SELECT id, name, description, status, rego_code, assigned_agents, last_modified, created_by, violations, category FROM policies ORDER BY last_modified DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var policies []models.Policy
	for rows.Next() {
		var p models.Policy
		var lastMod sql.NullTime
		err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Status, &p.RegoCode, &p.AssignedAgents, &lastMod, &p.CreatedBy, &p.Violations, &p.Category)
		if err != nil {
			return nil, err
		}
		if lastMod.Valid {
			p.LastModified = lastMod.Time
		}
		policies = append(policies, p)
	}
	return policies, nil
}

func (db *DB) GetPolicy(id string) (*models.Policy, error) {
	var p models.Policy
	var lastMod sql.NullTime
	err := db.conn.QueryRow("SELECT id, name, description, status, rego_code, assigned_agents, last_modified, created_by, violations, category FROM policies WHERE id = ?", id).
		Scan(&p.ID, &p.Name, &p.Description, &p.Status, &p.RegoCode, &p.AssignedAgents, &lastMod, &p.CreatedBy, &p.Violations, &p.Category)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	if lastMod.Valid {
		p.LastModified = lastMod.Time
	}
	return &p, nil
}

func (db *DB) CreatePolicy(p *models.Policy) error {
	_, err := db.conn.Exec(
		`INSERT INTO policies (id, name, description, status, rego_code, assigned_agents, last_modified, created_by, violations, category)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		p.ID, p.Name, p.Description, p.Status, p.RegoCode, p.AssignedAgents, p.LastModified, p.CreatedBy, p.Violations, p.Category,
	)
	return err
}

func (db *DB) UpdatePolicy(p *models.Policy) error {
	_, err := db.conn.Exec(
		`UPDATE policies SET name=?, description=?, status=?, rego_code=?, assigned_agents=?, last_modified=?, violations=?, category=? WHERE id=?`,
		p.Name, p.Description, p.Status, p.RegoCode, p.AssignedAgents, time.Now(), p.Violations, p.Category, p.ID,
	)
	return err
}

// ================================================================
// Audit Event Store
// ================================================================

func (db *DB) ListAuditEvents(severityFilter, typeFilter string) ([]models.AuditEvent, error) {
	query := "SELECT id, timestamp, agent_id, agent_name, event_type, severity, description, source_ip, trace_id, metadata FROM audit_events WHERE 1=1"
	args := []interface{}{}

	if severityFilter != "" && severityFilter != "all" {
		query += " AND severity = ?"
		args = append(args, severityFilter)
	}
	if typeFilter != "" && typeFilter != "all" {
		query += " AND event_type = ?"
		args = append(args, typeFilter)
	}
	query += " ORDER BY timestamp DESC LIMIT 100"

	rows, err := db.conn.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.AuditEvent
	for rows.Next() {
		var e models.AuditEvent
		var ts sql.NullTime
		var metaStr string
		err := rows.Scan(&e.ID, &ts, &e.AgentID, &e.AgentName, &e.EventType, &e.Severity, &e.Description, &e.SourceIP, &e.TraceID, &metaStr)
		if err != nil {
			return nil, err
		}
		if ts.Valid {
			e.Timestamp = ts.Time
		}
		json.Unmarshal([]byte(metaStr), &e.Metadata)
		events = append(events, e)
	}
	return events, nil
}

func (db *DB) CreateAuditEvent(e *models.AuditEvent) error {
	metaJSON, _ := json.Marshal(e.Metadata)
	_, err := db.conn.Exec(
		`INSERT INTO audit_events (id, timestamp, agent_id, agent_name, event_type, severity, description, source_ip, trace_id, metadata)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		e.ID, e.Timestamp, e.AgentID, e.AgentName, e.EventType, e.Severity, e.Description, e.SourceIP, e.TraceID, string(metaJSON),
	)
	return err
}

// ================================================================
// Trust Graph Store
// ================================================================

func (db *DB) ListTrustEdges() ([]models.TrustGraphEdge, error) {
	rows, err := db.conn.Query("SELECT id, source, target, trust_level, protocol, requests_per_min FROM trust_edges")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var edges []models.TrustGraphEdge
	for rows.Next() {
		var e models.TrustGraphEdge
		if err := rows.Scan(&e.ID, &e.Source, &e.Target, &e.TrustLevel, &e.Protocol, &e.RequestsPerMin); err != nil {
			return nil, err
		}
		edges = append(edges, e)
	}
	return edges, nil
}

func (db *DB) CreateTrustEdge(e *models.TrustGraphEdge) error {
	_, err := db.conn.Exec(
		"INSERT OR REPLACE INTO trust_edges (id, source, target, trust_level, protocol, requests_per_min) VALUES (?, ?, ?, ?, ?, ?)",
		e.ID, e.Source, e.Target, e.TrustLevel, e.Protocol, e.RequestsPerMin,
	)
	return err
}

// ================================================================
// Certificate Store
// ================================================================

func (db *DB) StoreCertificate(serial, spiffeID, agentID, certPEM string, issuedAt, expiresAt time.Time) error {
	_, err := db.conn.Exec(
		"INSERT INTO certificates (serial, spiffe_id, agent_id, certificate, issued_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
		serial, spiffeID, agentID, certPEM, issuedAt, expiresAt,
	)
	return err
}

func (db *DB) RevokeCertificate(serial string) error {
	_, err := db.conn.Exec("UPDATE certificates SET revoked = 1, revoked_at = ? WHERE serial = ?", time.Now(), serial)
	return err
}

func (db *DB) GetAgentCount() int {
	var count int
	db.conn.QueryRow("SELECT COUNT(*) FROM agents").Scan(&count)
	return count
}

func (db *DB) GetActiveSessionCount() int {
	var count int
	db.conn.QueryRow("SELECT COUNT(*) FROM agents WHERE status = 'active'").Scan(&count)
	return count
}

func (db *DB) GetViolationCount() int {
	var count int
	db.conn.QueryRow("SELECT SUM(violations) FROM policies").Scan(&count)
	return count
}
