package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/aegis-agent-id/backend/internal/engine"
	"github.com/aegis-agent-id/backend/internal/identity"
	"github.com/aegis-agent-id/backend/internal/store"
	"github.com/aegis-agent-id/backend/pkg/models"
)

// APIServer is the HTTP REST API server
type APIServer struct {
	db       *store.DB
	opa      *engine.OPAEngine
	identity *identity.SPIFFEProvider
	mux      *http.ServeMux
}

func NewAPIServer(db *store.DB, opa *engine.OPAEngine, id *identity.SPIFFEProvider) *APIServer {
	s := &APIServer{
		db:       db,
		opa:      opa,
		identity: id,
		mux:      http.NewServeMux(),
	}
	s.routes()
	return s
}

func (s *APIServer) Handler() http.Handler {
	return s.mux
}

func (s *APIServer) routes() {
	// Dashboard
	s.mux.HandleFunc("GET /api/v1/dashboard/metrics", s.getDashboardMetrics)
	s.mux.HandleFunc("GET /api/v1/dashboard/activity", s.getDashboardActivity)

	// Agents
	s.mux.HandleFunc("GET /api/v1/agents", s.listAgents)
	s.mux.HandleFunc("GET /api/v1/agents/{id}", s.getAgent)
	s.mux.HandleFunc("POST /api/v1/agents", s.registerAgent)
	s.mux.HandleFunc("PATCH /api/v1/agents/{id}/status", s.updateAgentStatus)
	s.mux.HandleFunc("DELETE /api/v1/agents/{id}", s.deleteAgent)

	// Policies
	s.mux.HandleFunc("GET /api/v1/policies", s.listPolicies)
	s.mux.HandleFunc("GET /api/v1/policies/{id}", s.getPolicy)
	s.mux.HandleFunc("POST /api/v1/policies", s.createPolicy)
	s.mux.HandleFunc("PUT /api/v1/policies/{id}", s.updatePolicy)
	s.mux.HandleFunc("POST /api/v1/policies/{id}/evaluate", s.evaluatePolicy)

	// Audit
	s.mux.HandleFunc("GET /api/v1/audit/events", s.listAuditEvents)

	// Trust Graph
	s.mux.HandleFunc("GET /api/v1/trust-graph/nodes", s.getTrustGraphNodes)
	s.mux.HandleFunc("GET /api/v1/trust-graph/edges", s.getTrustGraphEdges)

	// Identity
	s.mux.HandleFunc("POST /api/v1/identity/issue-svid", s.issueSVID)
	s.mux.HandleFunc("GET /api/v1/identity/trust-bundle", s.getTrustBundle)
	s.mux.HandleFunc("POST /api/v1/identity/revoke", s.revokeCertificate)

	// Health
	s.mux.HandleFunc("GET /api/v1/health", s.healthCheck)
}

// ================================================================
// Dashboard Handlers
// ================================================================

func (s *APIServer) getDashboardMetrics(w http.ResponseWriter, r *http.Request) {
	agentCount := s.db.GetAgentCount()
	activeCount := s.db.GetActiveSessionCount()
	violations := s.db.GetViolationCount()

	var trustScore float64
	agents, _ := s.db.ListAgents("", "")
	if len(agents) > 0 {
		verified := 0
		for _, a := range agents {
			if a.TrustLevel == models.TrustLevelVerified {
				verified++
			}
		}
		trustScore = float64(verified) / float64(len(agents)) * 100
	}

	metrics := models.DashboardMetrics{
		TotalAgents:      agentCount,
		ActiveSessions:   activeCount,
		PolicyViolations: violations,
		TrustScore:       roundTo(trustScore, 1),
		AgentsChange:     12.5,
		SessionsChange:   -3.1,
		ViolationsChange: -40,
		TrustScoreChange: 1.8,
	}
	writeJSON(w, http.StatusOK, metrics)
}

func (s *APIServer) getDashboardActivity(w http.ResponseWriter, r *http.Request) {
	// Return last 7 days of simulated activity
	data := []models.ActivityDataPoint{
		{Date: "Feb 25", Authentications: 12400, PolicyChecks: 34200, Violations: 2},
		{Date: "Feb 26", Authentications: 13100, PolicyChecks: 36800, Violations: 5},
		{Date: "Feb 27", Authentications: 11800, PolicyChecks: 33100, Violations: 1},
		{Date: "Feb 28", Authentications: 14200, PolicyChecks: 39500, Violations: 8},
		{Date: "Mar 01", Authentications: 15600, PolicyChecks: 42100, Violations: 3},
		{Date: "Mar 02", Authentications: 14800, PolicyChecks: 40200, Violations: 2},
		{Date: "Mar 03", Authentications: 13500, PolicyChecks: 37800, Violations: 3},
	}
	writeJSON(w, http.StatusOK, data)
}

// ================================================================
// Agent Handlers
// ================================================================

func (s *APIServer) listAgents(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	agentType := r.URL.Query().Get("type")
	agents, err := s.db.ListAgents(status, agentType)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to list agents: "+err.Error())
		return
	}
	if agents == nil {
		agents = []models.Agent{}
	}
	writeJSON(w, http.StatusOK, agents)
}

func (s *APIServer) getAgent(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	agent, err := s.db.GetAgent(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if agent == nil {
		writeError(w, http.StatusNotFound, "Agent not found")
		return
	}
	writeJSON(w, http.StatusOK, agent)
}

func (s *APIServer) registerAgent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string   `json:"name"`
		Type        string   `json:"type"`
		Description string   `json:"description"`
		Owner       string   `json:"owner"`
		Tags        []string `json:"tags"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Generate SPIFFE ID and SVID
	agentPath := strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))
	svid, err := s.identity.IssueSVID(req.Type, agentPath, 24*time.Hour)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to issue SVID: "+err.Error())
		return
	}

	now := time.Now()
	agentID := fmt.Sprintf("agent-%03d", now.UnixMilli()%10000)
	agent := &models.Agent{
		ID:                agentID,
		Name:              req.Name,
		SpiffeID:          svid.SpiffeID,
		Type:              models.AgentType(req.Type),
		Status:            models.AgentStatusProvisioning,
		TrustLevel:        models.TrustLevelUntrusted,
		Description:       req.Description,
		Owner:             req.Owner,
		LastActive:        now,
		CreatedAt:         now,
		CertificateExpiry: svid.ExpiresAt,
		Policies:          []string{},
		Tags:              req.Tags,
		Metrics:           models.AgentMetrics{},
	}

	if err := s.db.CreateAgent(agent); err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to create agent: "+err.Error())
		return
	}

	// Store certificate
	s.db.StoreCertificate(svid.Serial, svid.SpiffeID, agentID, svid.Certificate, svid.IssuedAt, svid.ExpiresAt)

	// Log audit event
	s.db.CreateAuditEvent(&models.AuditEvent{
		ID:          fmt.Sprintf("evt-%d", now.UnixMilli()),
		Timestamp:   now,
		AgentID:     agentID,
		AgentName:   req.Name,
		EventType:   "agent.registered",
		Severity:    models.SeveritySuccess,
		Description: fmt.Sprintf("Agent %s registered with SPIFFE ID %s", req.Name, svid.SpiffeID),
		SourceIP:    r.RemoteAddr,
		TraceID:     fmt.Sprintf("trace-%x", now.UnixNano()%0xFFFFFFFF),
		Metadata:    map[string]string{"cert_serial": svid.Serial, "ttl": "24h"},
	})

	log.Printf("[IDENTITY] Issued SVID for %s: %s", req.Name, svid.SpiffeID)
	writeJSON(w, http.StatusCreated, agent)
}

func (s *APIServer) updateAgentStatus(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req struct {
		Status     string `json:"status"`
		TrustLevel string `json:"trustLevel"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := s.db.UpdateAgentStatus(id, models.AgentStatus(req.Status), models.TrustLevel(req.TrustLevel)); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	agent, _ := s.db.GetAgent(id)
	writeJSON(w, http.StatusOK, agent)
}

func (s *APIServer) deleteAgent(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := s.db.DeleteAgent(id); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"deleted": id})
}

// ================================================================
// Policy Handlers
// ================================================================

func (s *APIServer) listPolicies(w http.ResponseWriter, r *http.Request) {
	policies, err := s.db.ListPolicies()
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if policies == nil {
		policies = []models.Policy{}
	}
	writeJSON(w, http.StatusOK, policies)
}

func (s *APIServer) getPolicy(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	policy, err := s.db.GetPolicy(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if policy == nil {
		writeError(w, http.StatusNotFound, "Policy not found")
		return
	}
	writeJSON(w, http.StatusOK, policy)
}

func (s *APIServer) createPolicy(w http.ResponseWriter, r *http.Request) {
	var p models.Policy
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	p.ID = fmt.Sprintf("pol-%03d", time.Now().UnixMilli()%10000)
	p.LastModified = time.Now()
	if p.Status == "" {
		p.Status = models.PolicyStatusDraft
	}

	if err := s.db.CreatePolicy(&p); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, p)
}

func (s *APIServer) updatePolicy(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var p models.Policy
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	p.ID = id
	if err := s.db.UpdatePolicy(&p); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	updated, _ := s.db.GetPolicy(id)
	writeJSON(w, http.StatusOK, updated)
}

func (s *APIServer) evaluatePolicy(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var req models.PolicyEvalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Get the policy
	policy, err := s.db.GetPolicy(id)
	if err != nil || policy == nil {
		writeError(w, http.StatusNotFound, "Policy not found")
		return
	}

	// Evaluate with embedded OPA
	result, err := s.opa.EvaluateWithDenials(r.Context(), policy.RegoCode, req.Input)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Evaluation failed: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, result)
}

// ================================================================
// Audit Handlers
// ================================================================

func (s *APIServer) listAuditEvents(w http.ResponseWriter, r *http.Request) {
	severity := r.URL.Query().Get("severity")
	eventType := r.URL.Query().Get("type")
	events, err := s.db.ListAuditEvents(severity, eventType)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if events == nil {
		events = []models.AuditEvent{}
	}
	writeJSON(w, http.StatusOK, events)
}

// ================================================================
// Trust Graph Handlers
// ================================================================

func (s *APIServer) getTrustGraphNodes(w http.ResponseWriter, r *http.Request) {
	agents, err := s.db.ListAgents("", "")
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	nodes := make([]models.TrustGraphNode, len(agents))
	for i, a := range agents {
		nodes[i] = models.TrustGraphNode{
			ID:         a.ID,
			AgentName:  a.Name,
			SpiffeID:   a.SpiffeID,
			Type:       a.Type,
			Status:     a.Status,
			TrustLevel: a.TrustLevel,
		}
	}
	writeJSON(w, http.StatusOK, nodes)
}

func (s *APIServer) getTrustGraphEdges(w http.ResponseWriter, r *http.Request) {
	edges, err := s.db.ListTrustEdges()
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if edges == nil {
		edges = []models.TrustGraphEdge{}
	}
	writeJSON(w, http.StatusOK, edges)
}

// ================================================================
// Identity Handlers
// ================================================================

func (s *APIServer) issueSVID(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AgentType string `json:"agentType"`
		AgentPath string `json:"agentPath"`
		TTLHours  int    `json:"ttlHours"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	if req.TTLHours == 0 {
		req.TTLHours = 24
	}

	svid, err := s.identity.IssueSVID(req.AgentType, req.AgentPath, time.Duration(req.TTLHours)*time.Hour)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, svid)
}

func (s *APIServer) getTrustBundle(w http.ResponseWriter, r *http.Request) {
	bundle := s.identity.GetTrustBundle()
	writeJSON(w, http.StatusOK, bundle)
}

func (s *APIServer) revokeCertificate(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Serial string `json:"serial"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	s.identity.RevokeCertificate(req.Serial)
	s.db.RevokeCertificate(req.Serial)
	writeJSON(w, http.StatusOK, map[string]string{"revoked": req.Serial})
}

// ================================================================
// Health
// ================================================================

func (s *APIServer) healthCheck(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":      "healthy",
		"version":     "1.0.0",
		"trustDomain": s.identity.TrustDomain(),
		"timestamp":   time.Now().UTC(),
	})
}

// ================================================================
// Helpers
// ================================================================

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func roundTo(val float64, places int) float64 {
	p := 1.0
	for i := 0; i < places; i++ {
		p *= 10
	}
	return float64(int(val*p+0.5)) / p
}

// SeedData populates the database with initial data for development
func (s *APIServer) SeedData() {
	// Check if data already exists
	if s.db.GetAgentCount() > 0 {
		log.Println("[SEED] Database already has data, skipping seed")
		return
	}

	log.Println("[SEED] Populating database with initial data...")

	now := time.Now()
	ctx := context.Background()
	_ = ctx

	// Seed agents with real SPIFFE SVIDs
	agentDefs := []struct {
		id, name, agentType, agentPath, desc, owner string
		status                                      models.AgentStatus
		trust                                       models.TrustLevel
		tags                                        []string
		policies                                    []string
		metrics                                     models.AgentMetrics
	}{
		{"agent-001", "GPT-Orchestrator-Prime", "orchestrator", "prime", "Primary orchestration agent for multi-step workflow coordination across all business units.", "Platform Team", models.AgentStatusActive, models.TrustLevelVerified, []string{"production", "tier-1", "critical"}, []string{"pol-001", "pol-002", "pol-005"}, models.AgentMetrics{14523, 2.3, 0.001}},
		{"agent-002", "FinBot-Refund-Handler", "executor", "finbot-refund", "Handles automated refund processing up to $500. Requires human approval for amounts above threshold.", "Finance Ops", models.AgentStatusActive, models.TrustLevelVerified, []string{"production", "pci-compliant", "finance"}, []string{"pol-001", "pol-003"}, models.AgentMetrics{892, 45.2, 0.003}},
		{"agent-003", "RAG-Knowledge-Retriever", "retriever", "rag-knowledge", "Retrieval-Augmented Generation agent that queries the enterprise knowledge base for context enrichment.", "AI Platform", models.AgentStatusActive, models.TrustLevelVerified, []string{"production", "data-access", "tier-2"}, []string{"pol-001", "pol-004"}, models.AgentMetrics{28451, 8.7, 0.0005}},
		{"agent-004", "Claude-Code-Reviewer", "llm", "claude-reviewer", "AI code review agent that analyzes PRs for security vulnerabilities, style issues, and performance.", "Engineering", models.AgentStatusActive, models.TrustLevelConditional, []string{"production", "code-access", "engineering"}, []string{"pol-001", "pol-006"}, models.AgentMetrics{342, 1200, 0.01}},
		{"agent-005", "Sentinel-Threat-Monitor", "tool", "sentinel-threat", "Continuous threat monitoring agent that scans network traffic and agent communications for anomalies.", "Security Team", models.AgentStatusActive, models.TrustLevelVerified, []string{"production", "security", "tier-1", "critical"}, []string{"pol-001", "pol-002", "pol-007"}, models.AgentMetrics{98234, 0.4, 0.0001}},
		{"agent-006", "DataPipeline-ETL-Runner", "executor", "etl-runner", "Scheduled ETL pipeline executor for nightly data warehouse updates and transformation jobs.", "Data Engineering", models.AgentStatusInactive, models.TrustLevelVerified, []string{"production", "batch", "data"}, []string{"pol-001", "pol-008"}, models.AgentMetrics{0, 3200, 0.005}},
		{"agent-007", "Customer-Support-Bot", "llm", "support-bot", "Customer-facing support agent handling tier-1 inquiries, ticket routing, and FAQ responses.", "Customer Success", models.AgentStatusActive, models.TrustLevelVerified, []string{"production", "customer-facing", "pii-access"}, []string{"pol-001", "pol-009"}, models.AgentMetrics{5621, 850, 0.002}},
		{"agent-008", "Compliance-Auditor-v2", "tool", "compliance-auditor", "Next-generation compliance auditing agent currently in provisioning. Pending security review.", "Legal & Compliance", models.AgentStatusProvisioning, models.TrustLevelUntrusted, []string{"staging", "compliance", "pending-review"}, []string{}, models.AgentMetrics{12, 150, 0.1}},
		{"agent-009", "Legacy-Inventory-Sync", "executor", "inventory-sync", "SUSPENDED: Certificate revoked due to policy violation. Attempted unauthorized access to PII database.", "Supply Chain", models.AgentStatusSuspended, models.TrustLevelRevoked, []string{"suspended", "investigation", "legacy"}, []string{"pol-001"}, models.AgentMetrics{0, 0, 0}},
		{"agent-010", "Gemini-Research-Analyst", "llm", "gemini-research", "Research analysis agent that synthesizes market data, competitive intelligence, and trend reports.", "Strategy", models.AgentStatusActive, models.TrustLevelVerified, []string{"production", "data-access", "research"}, []string{"pol-001", "pol-004", "pol-010"}, models.AgentMetrics{156, 2100, 0.008}},
	}

	for _, def := range agentDefs {
		svid, err := s.identity.IssueSVID(def.agentType, def.agentPath, 24*time.Hour)
		if err != nil {
			log.Printf("[SEED] WARN: Failed to issue SVID for %s: %v", def.name, err)
			continue
		}

		agent := &models.Agent{
			ID:                def.id,
			Name:              def.name,
			SpiffeID:          svid.SpiffeID,
			Type:              models.AgentType(def.agentType),
			Status:            def.status,
			TrustLevel:        def.trust,
			Description:       def.desc,
			Owner:             def.owner,
			LastActive:        now.Add(-time.Duration(len(def.id)) * time.Minute),
			CreatedAt:         now.Add(-30 * 24 * time.Hour),
			CertificateExpiry: svid.ExpiresAt,
			Policies:          def.policies,
			Tags:              def.tags,
			Metrics:           def.metrics,
		}
		if err := s.db.CreateAgent(agent); err != nil {
			log.Printf("[SEED] WARN: Failed to create agent %s: %v", def.name, err)
		}
		s.db.StoreCertificate(svid.Serial, svid.SpiffeID, def.id, svid.Certificate, svid.IssuedAt, svid.ExpiresAt)
	}

	// Seed policies
	policyDefs := []models.Policy{
		{ID: "pol-001", Name: "Global Identity Verification", Description: "All agents must present a valid SPIFFE SVID before any API call.", Status: "active", RegoCode: "allow if {\n    input.svid.spiffe_id != \"\"\n    time.now_ns() < input.svid.expires_at\n}", AssignedAgents: 10, CreatedBy: "Security Team", Violations: 0, Category: "Identity"},
		{ID: "pol-002", Name: "Cross-Domain Communication", Description: "Restrict agent communication to authorized trust domains only.", Status: "active", RegoCode: "allow if {\n    input.source.trust_domain == input.target.trust_domain\n}", AssignedAgents: 12, CreatedBy: "Platform Team", Violations: 0, Category: "Communication"},
		{ID: "pol-003", Name: "Financial Transaction Limits", Description: "Executor agents handling financial operations are limited to $500 per transaction.", Status: "active", RegoCode: "allow if {\n    input.action == \"refund\"\n    input.amount <= 500\n}", AssignedAgents: 3, CreatedBy: "Finance Ops", Violations: 1, Category: "Financial"},
		{ID: "pol-004", Name: "Data Access Classification", Description: "Agents can only access data at or below their clearance level.", Status: "active", RegoCode: "allow if {\n    input.agent.clearance >= input.resource.level\n}", AssignedAgents: 18, CreatedBy: "Data Governance", Violations: 2, Category: "Data Access"},
		{ID: "pol-005", Name: "Rate Limiting & Throttling", Description: "Enforce per-agent rate limits to prevent resource exhaustion.", Status: "active", RegoCode: "allow if {\n    input.requests_per_minute <= input.limit\n}", AssignedAgents: 10, CreatedBy: "Platform Team", Violations: 0, Category: "Performance"},
		{ID: "pol-006", Name: "Code Repository Access", Description: "LLM agents may only access repositories they are explicitly assigned to.", Status: "draft", RegoCode: "allow if {\n    input.action in [\"read\", \"review\"]\n    input.repository in input.allowed_repos\n}", AssignedAgents: 2, CreatedBy: "Engineering", Violations: 0, Category: "Code Access"},
	}
	for i := range policyDefs {
		policyDefs[i].LastModified = now.Add(-time.Duration(i) * 24 * time.Hour)
		if err := s.db.CreatePolicy(&policyDefs[i]); err != nil {
			log.Printf("[SEED] WARN: Failed to create policy %s: %v", policyDefs[i].Name, err)
		}
	}

	// Seed audit events
	eventDefs := []models.AuditEvent{
		{ID: "evt-001", AgentID: "agent-005", AgentName: "Sentinel-Threat-Monitor", EventType: "threat.detected", Severity: "critical", Description: "Anomalous traffic pattern detected from agent-009. Possible credential stuffing attempt blocked.", SourceIP: "10.0.42.15", TraceID: "trace-7f3a2b1c", Metadata: map[string]string{"threat_type": "credential_stuffing", "blocked": "true"}},
		{ID: "evt-002", AgentID: "agent-007", AgentName: "Customer-Support-Bot", EventType: "auth.success", Severity: "info", Description: "Certificate renewed and SVID rotated successfully.", SourceIP: "10.0.12.88", TraceID: "trace-4e8d9c2f", Metadata: map[string]string{"ttl": "24h"}},
		{ID: "evt-003", AgentID: "agent-003", AgentName: "RAG-Knowledge-Retriever", EventType: "data.access", Severity: "info", Description: "Accessed knowledge base index 'enterprise-docs-v3'. 847 document chunks retrieved.", SourceIP: "10.0.8.201", TraceID: "trace-1a5f7e3d", Metadata: map[string]string{"index": "enterprise-docs-v3", "chunks": "847"}},
		{ID: "evt-004", AgentID: "agent-001", AgentName: "GPT-Orchestrator-Prime", EventType: "workflow.initiated", Severity: "info", Description: "Multi-agent workflow 'quarterly-report-gen' initiated. Coordinating 4 sub-agents.", SourceIP: "10.0.1.10", TraceID: "trace-9b2c4d6e", Metadata: map[string]string{"workflow": "quarterly-report-gen", "sub_agents": "4"}},
		{ID: "evt-005", AgentID: "agent-002", AgentName: "FinBot-Refund-Handler", EventType: "policy.violation", Severity: "warning", Description: "Attempted refund of $750 exceeds $500 policy limit. Transaction blocked.", SourceIP: "10.0.22.44", TraceID: "trace-5f1a8c3b", Metadata: map[string]string{"amount": "$750", "limit": "$500", "policy": "pol-003"}},
		{ID: "evt-006", AgentID: "agent-010", AgentName: "Gemini-Research-Analyst", EventType: "api.call", Severity: "info", Description: "External API call to market-data-provider. Response received in 1.8s.", SourceIP: "10.0.30.77", TraceID: "trace-2d7e9f4a", Metadata: map[string]string{"api": "market-data-provider", "status": "200"}},
		{ID: "evt-007", AgentID: "agent-004", AgentName: "Claude-Code-Reviewer", EventType: "code.review", Severity: "success", Description: "Completed code review for PR #4821. Found 2 security issues.", SourceIP: "10.0.15.33", TraceID: "trace-8c3b1d5e", Metadata: map[string]string{"pr": "#4821", "issues_found": "2"}},
		{ID: "evt-008", AgentID: "agent-009", AgentName: "Legacy-Inventory-Sync", EventType: "auth.revoked", Severity: "critical", Description: "Certificate revoked by Security Team. Agent suspended pending investigation.", SourceIP: "10.0.50.12", TraceID: "trace-6a9d2c7f", Metadata: map[string]string{"reason": "unauthorized_pii_access"}},
		{ID: "evt-009", AgentID: "agent-008", AgentName: "Compliance-Auditor-v2", EventType: "provision.started", Severity: "info", Description: "Agent provisioning initiated. Awaiting security review.", SourceIP: "10.0.5.100", TraceID: "trace-3f8a1b4c", Metadata: map[string]string{"stage": "security_review"}},
		{ID: "evt-010", AgentID: "agent-001", AgentName: "GPT-Orchestrator-Prime", EventType: "trust.verified", Severity: "success", Description: "Trust verification completed for cross-domain communication.", SourceIP: "10.0.1.10", TraceID: "trace-7d4e2a9b", Metadata: map[string]string{"remote_domain": "partner-domain.io", "protocol": "mTLS"}},
	}
	for i := range eventDefs {
		eventDefs[i].Timestamp = now.Add(-time.Duration(i*5) * time.Minute)
		if err := s.db.CreateAuditEvent(&eventDefs[i]); err != nil {
			log.Printf("[SEED] WARN: Failed to create event %s: %v", eventDefs[i].ID, err)
		}
	}

	// Seed trust graph edges
	edgeDefs := []models.TrustGraphEdge{
		{ID: "edge-1", Source: "agent-001", Target: "agent-002", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 45},
		{ID: "edge-2", Source: "agent-001", Target: "agent-003", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 120},
		{ID: "edge-3", Source: "agent-001", Target: "agent-004", TrustLevel: "conditional", Protocol: "gRPC/mTLS", RequestsPerMin: 8},
		{ID: "edge-4", Source: "agent-001", Target: "agent-005", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 200},
		{ID: "edge-5", Source: "agent-001", Target: "agent-007", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 35},
		{ID: "edge-6", Source: "agent-001", Target: "agent-010", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 12},
		{ID: "edge-7", Source: "agent-003", Target: "agent-010", TrustLevel: "verified", Protocol: "REST/TLS", RequestsPerMin: 25},
		{ID: "edge-8", Source: "agent-005", Target: "agent-001", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 300},
		{ID: "edge-9", Source: "agent-005", Target: "agent-009", TrustLevel: "revoked", Protocol: "BLOCKED", RequestsPerMin: 0},
		{ID: "edge-10", Source: "agent-007", Target: "agent-003", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 55},
		{ID: "edge-11", Source: "agent-002", Target: "agent-001", TrustLevel: "verified", Protocol: "gRPC/mTLS", RequestsPerMin: 10},
		{ID: "edge-12", Source: "agent-004", Target: "agent-003", TrustLevel: "conditional", Protocol: "REST/TLS", RequestsPerMin: 5},
	}
	for _, e := range edgeDefs {
		s.db.CreateTrustEdge(&e)
	}

	log.Printf("[SEED] Created %d agents, %d policies, %d events, %d edges", len(agentDefs), len(policyDefs), len(eventDefs), len(edgeDefs))
}
