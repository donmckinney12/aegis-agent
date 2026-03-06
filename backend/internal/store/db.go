package store

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/aegis-agent-id/backend/pkg/models"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	pool *pgxpool.Pool
}

func NewDB(connString string) (*DB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}
	db := &DB{pool: pool}
	if err := db.migrate(); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return db, nil
}

func (db *DB) Close() error {
	db.pool.Close()
	return nil
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
			last_active TIMESTAMP,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			certificate_expiry TIMESTAMP,
			policies TEXT DEFAULT '[]',
			tags TEXT DEFAULT '[]',
			requests_today INTEGER DEFAULT 0,
			avg_latency_ms DOUBLE PRECISION DEFAULT 0,
			error_rate DOUBLE PRECISION DEFAULT 0
		)`,
		`CREATE TABLE IF NOT EXISTS policies (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT DEFAULT '',
			status TEXT NOT NULL DEFAULT 'draft',
			rego_code TEXT DEFAULT '',
			assigned_agents INTEGER DEFAULT 0,
			last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			created_by TEXT DEFAULT '',
			violations INTEGER DEFAULT 0,
			category TEXT DEFAULT ''
		)`,
		`CREATE TABLE IF NOT EXISTS audit_events (
			id TEXT PRIMARY KEY,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
			issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			expires_at TIMESTAMP NOT NULL,
			revoked INTEGER DEFAULT 0,
			revoked_at TIMESTAMP
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
	ctx := context.Background()
	for _, m := range migrations {
		if _, err := db.pool.Exec(ctx, m); err != nil {
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
	paramIdx := 1

	if statusFilter != "" && statusFilter != "all" {
		query += fmt.Sprintf(" AND status = $%d", paramIdx)
		args = append(args, statusFilter)
		paramIdx++
	}
	if typeFilter != "" && typeFilter != "all" {
		query += fmt.Sprintf(" AND type = $%d", paramIdx)
		args = append(args, typeFilter)
		paramIdx++
	}
	query += " ORDER BY last_active DESC"

	ctx := context.Background()
	rows, err := db.pool.Query(ctx, query, args...)
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
	ctx := context.Background()
	row := db.pool.QueryRow(ctx, "SELECT id, name, spiffe_id, type, status, trust_level, description, owner, last_active, created_at, certificate_expiry, policies, tags, requests_today, avg_latency_ms, error_rate FROM agents WHERE id = $1", id)
	a, err := scanAgentRow(row)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (db *DB) CreateAgent(a *models.Agent) error {
	policiesJSON, _ := json.Marshal(a.Policies)
	tagsJSON, _ := json.Marshal(a.Tags)
	ctx := context.Background()
	_, err := db.pool.Exec(ctx,
		`INSERT INTO agents (id, name, spiffe_id, type, status, trust_level, description, owner, last_active, created_at, certificate_expiry, policies, tags, requests_today, avg_latency_ms, error_rate)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
		a.ID, a.Name, a.SpiffeID, a.Type, a.Status, a.TrustLevel, a.Description, a.Owner,
		a.LastActive, a.CreatedAt, a.CertificateExpiry,
		string(policiesJSON), string(tagsJSON),
		a.Metrics.RequestsToday, a.Metrics.AvgLatencyMs, a.Metrics.ErrorRate,
	)
	return err
}

func (db *DB) UpdateAgentStatus(id string, status models.AgentStatus, trustLevel models.TrustLevel) error {
	ctx := context.Background()
	_, err := db.pool.Exec(ctx, "UPDATE agents SET status = $1, trust_level = $2, last_active = $3 WHERE id = $4",
		status, trustLevel, time.Now(), id)
	return err
}

func (db *DB) DeleteAgent(id string) error {
	ctx := context.Background()
	_, err := db.pool.Exec(ctx, "DELETE FROM agents WHERE id = $1", id)
	return err
}

func scanAgent(rows pgx.Rows) (models.Agent, error) {
	var a models.Agent
	var policiesStr, tagsStr string
	var lastActive, createdAt, certExpiry *time.Time

	err := rows.Scan(
		&a.ID, &a.Name, &a.SpiffeID, &a.Type, &a.Status, &a.TrustLevel,
		&a.Description, &a.Owner, &lastActive, &createdAt, &certExpiry,
		&policiesStr, &tagsStr,
		&a.Metrics.RequestsToday, &a.Metrics.AvgLatencyMs, &a.Metrics.ErrorRate,
	)
	if err != nil {
		return a, err
	}
	if lastActive != nil {
		a.LastActive = *lastActive
	}
	if createdAt != nil {
		a.CreatedAt = *createdAt
	}
	if certExpiry != nil {
		a.CertificateExpiry = *certExpiry
	}
	json.Unmarshal([]byte(policiesStr), &a.Policies)
	json.Unmarshal([]byte(tagsStr), &a.Tags)
	return a, nil
}

func scanAgentRow(row pgx.Row) (models.Agent, error) {
	var a models.Agent
	var policiesStr, tagsStr string
	var lastActive, createdAt, certExpiry *time.Time

	err := row.Scan(
		&a.ID, &a.Name, &a.SpiffeID, &a.Type, &a.Status, &a.TrustLevel,
		&a.Description, &a.Owner, &lastActive, &createdAt, &certExpiry,
		&policiesStr, &tagsStr,
		&a.Metrics.RequestsToday, &a.Metrics.AvgLatencyMs, &a.Metrics.ErrorRate,
	)
	if err != nil {
		return a, err
	}
	if lastActive != nil {
		a.LastActive = *lastActive
	}
	if createdAt != nil {
		a.CreatedAt = *createdAt
	}
	if certExpiry != nil {
		a.CertificateExpiry = *certExpiry
	}
	json.Unmarshal([]byte(policiesStr), &a.Policies)
	json.Unmarshal([]byte(tagsStr), &a.Tags)
	return a, nil
}

// ================================================================
// Policy Store
// ================================================================

func (db *DB) ListPolicies() ([]models.Policy, error) {
	ctx := context.Background()
	rows, err := db.pool.Query(ctx, "SELECT id, name, description, status, rego_code, assigned_agents, last_modified, created_by, violations, category FROM policies ORDER BY last_modified DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var policies []models.Policy
	for rows.Next() {
		var p models.Policy
		var lastMod *time.Time
		err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Status, &p.RegoCode, &p.AssignedAgents, &lastMod, &p.CreatedBy, &p.Violations, &p.Category)
		if err != nil {
			return nil, err
		}
		if lastMod != nil {
			p.LastModified = *lastMod
		}
		policies = append(policies, p)
	}
	return policies, nil
}

func (db *DB) GetPolicy(id string) (*models.Policy, error) {
	var p models.Policy
	var lastMod *time.Time
	ctx := context.Background()
	err := db.pool.QueryRow(ctx, "SELECT id, name, description, status, rego_code, assigned_agents, last_modified, created_by, violations, category FROM policies WHERE id = $1", id).
		Scan(&p.ID, &p.Name, &p.Description, &p.Status, &p.RegoCode, &p.AssignedAgents, &lastMod, &p.CreatedBy, &p.Violations, &p.Category)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	if lastMod != nil {
		p.LastModified = *lastMod
	}
	return &p, nil
}

func (db *DB) CreatePolicy(p *models.Policy) error {
	ctx := context.Background()
	_, err := db.pool.Exec(ctx,
		`INSERT INTO policies (id, name, description, status, rego_code, assigned_agents, last_modified, created_by, violations, category)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		p.ID, p.Name, p.Description, p.Status, p.RegoCode, p.AssignedAgents, p.LastModified, p.CreatedBy, p.Violations, p.Category,
	)
	return err
}

func (db *DB) UpdatePolicy(p *models.Policy) error {
	ctx := context.Background()
	_, err := db.pool.Exec(ctx,
		`UPDATE policies SET name=$1, description=$2, status=$3, rego_code=$4, assigned_agents=$5, last_modified=$6, violations=$7, category=$8 WHERE id=$9`,
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
	paramIdx := 1

	if severityFilter != "" && severityFilter != "all" {
		query += fmt.Sprintf(" AND severity = $%d", paramIdx)
		args = append(args, severityFilter)
		paramIdx++
	}
	if typeFilter != "" && typeFilter != "all" {
		query += fmt.Sprintf(" AND event_type = $%d", paramIdx)
		args = append(args, typeFilter)
		paramIdx++
	}
	query += " ORDER BY timestamp DESC LIMIT 100"

	ctx := context.Background()
	rows, err := db.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.AuditEvent
	for rows.Next() {
		var e models.AuditEvent
		var ts *time.Time
		var metaStr string
		err := rows.Scan(&e.ID, &ts, &e.AgentID, &e.AgentName, &e.EventType, &e.Severity, &e.Description, &e.SourceIP, &e.TraceID, &metaStr)
		if err != nil {
			return nil, err
		}
		if ts != nil {
			e.Timestamp = *ts
		}
		json.Unmarshal([]byte(metaStr), &e.Metadata)
		events = append(events, e)
	}
	return events, nil
}

func (db *DB) CreateAuditEvent(e *models.AuditEvent) error {
	metaJSON, _ := json.Marshal(e.Metadata)
	ctx := context.Background()
	_, err := db.pool.Exec(ctx,
		`INSERT INTO audit_events (id, timestamp, agent_id, agent_name, event_type, severity, description, source_ip, trace_id, metadata)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		e.ID, e.Timestamp, e.AgentID, e.AgentName, e.EventType, e.Severity, e.Description, e.SourceIP, e.TraceID, string(metaJSON),
	)
	return err
}

// ================================================================
// Trust Graph Store
// ================================================================

func (db *DB) ListTrustEdges() ([]models.TrustGraphEdge, error) {
	ctx := context.Background()
	rows, err := db.pool.Query(ctx, "SELECT id, source, target, trust_level, protocol, requests_per_min FROM trust_edges")
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
	ctx := context.Background()
	// Postgres uses INSERT ... ON CONFLICT instead of SQLite INSERT OR REPLACE
	_, err := db.pool.Exec(ctx,
		`INSERT INTO trust_edges (id, source, target, trust_level, protocol, requests_per_min) 
		 VALUES ($1, $2, $3, $4, $5, $6)
		 ON CONFLICT (id) DO UPDATE SET 
		 source=$2, target=$3, trust_level=$4, protocol=$5, requests_per_min=$6`,
		e.ID, e.Source, e.Target, e.TrustLevel, e.Protocol, e.RequestsPerMin,
	)
	return err
}

// ================================================================
// Certificate Store
// ================================================================

func (db *DB) StoreCertificate(serial, spiffeID, agentID, certPEM string, issuedAt, expiresAt time.Time) error {
	ctx := context.Background()
	_, err := db.pool.Exec(ctx,
		"INSERT INTO certificates (serial, spiffe_id, agent_id, certificate, issued_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6)",
		serial, spiffeID, agentID, certPEM, issuedAt, expiresAt,
	)
	return err
}

func (db *DB) RevokeCertificate(serial string) error {
	ctx := context.Background()
	_, err := db.pool.Exec(ctx, "UPDATE certificates SET revoked = 1, revoked_at = $1 WHERE serial = $2", time.Now(), serial)
	return err
}

func (db *DB) GetAgentCount() int {
	var count int
	ctx := context.Background()
	db.pool.QueryRow(ctx, "SELECT COUNT(*) FROM agents").Scan(&count)
	return count
}

func (db *DB) GetActiveSessionCount() int {
	var count int
	ctx := context.Background()
	db.pool.QueryRow(ctx, "SELECT COUNT(*) FROM agents WHERE status = 'active'").Scan(&count)
	return count
}

func (db *DB) GetViolationCount() int {
	var count int
	ctx := context.Background()
	err := db.pool.QueryRow(ctx, "SELECT COALESCE(SUM(violations), 0) FROM policies").Scan(&count)
	if err != nil {
		return 0
	}
	return count
}
