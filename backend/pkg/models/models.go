package models

import "time"

// Agent types and statuses
type AgentStatus string
type TrustLevel string
type AgentType string
type PolicyStatus string
type EventSeverity string

const (
	AgentStatusActive       AgentStatus = "active"
	AgentStatusInactive     AgentStatus = "inactive"
	AgentStatusSuspended    AgentStatus = "suspended"
	AgentStatusProvisioning AgentStatus = "provisioning"

	TrustLevelVerified    TrustLevel = "verified"
	TrustLevelConditional TrustLevel = "conditional"
	TrustLevelUntrusted   TrustLevel = "untrusted"
	TrustLevelRevoked     TrustLevel = "revoked"

	AgentTypeLLM          AgentType = "llm"
	AgentTypeTool         AgentType = "tool"
	AgentTypeOrchestrator AgentType = "orchestrator"
	AgentTypeRetriever    AgentType = "retriever"
	AgentTypeExecutor     AgentType = "executor"

	PolicyStatusActive   PolicyStatus = "active"
	PolicyStatusDraft    PolicyStatus = "draft"
	PolicyStatusViolated PolicyStatus = "violated"
	PolicyStatusArchived PolicyStatus = "archived"

	SeverityInfo     EventSeverity = "info"
	SeverityWarning  EventSeverity = "warning"
	SeverityCritical EventSeverity = "critical"
	SeveritySuccess  EventSeverity = "success"
)

type AgentMetrics struct {
	RequestsToday int     `json:"requestsToday"`
	AvgLatencyMs  float64 `json:"avgLatencyMs"`
	ErrorRate     float64 `json:"errorRate"`
}

type Agent struct {
	ID                string       `json:"id"`
	Name              string       `json:"name"`
	SpiffeID          string       `json:"spiffeId"`
	Type              AgentType    `json:"type"`
	Status            AgentStatus  `json:"status"`
	TrustLevel        TrustLevel   `json:"trustLevel"`
	Description       string       `json:"description"`
	Owner             string       `json:"owner"`
	LastActive        time.Time    `json:"lastActive"`
	CreatedAt         time.Time    `json:"createdAt"`
	CertificateExpiry time.Time    `json:"certificateExpiry"`
	Policies          []string     `json:"policies"`
	Tags              []string     `json:"tags"`
	Metrics           AgentMetrics `json:"metrics"`
}

type Policy struct {
	ID             string       `json:"id"`
	Name           string       `json:"name"`
	Description    string       `json:"description"`
	Status         PolicyStatus `json:"status"`
	RegoCode       string       `json:"regoCode"`
	AssignedAgents int          `json:"assignedAgents"`
	LastModified   time.Time    `json:"lastModified"`
	CreatedBy      string       `json:"createdBy"`
	Violations     int          `json:"violations"`
	Category       string       `json:"category"`
}

type AuditEvent struct {
	ID          string            `json:"id"`
	Timestamp   time.Time         `json:"timestamp"`
	AgentID     string            `json:"agentId"`
	AgentName   string            `json:"agentName"`
	EventType   string            `json:"eventType"`
	Severity    EventSeverity     `json:"severity"`
	Description string            `json:"description"`
	SourceIP    string            `json:"sourceIp"`
	TraceID     string            `json:"traceId"`
	Metadata    map[string]string `json:"metadata"`
}

type TrustGraphNode struct {
	ID         string      `json:"id"`
	AgentName  string      `json:"agentName"`
	SpiffeID   string      `json:"spiffeId"`
	Type       AgentType   `json:"type"`
	Status     AgentStatus `json:"status"`
	TrustLevel TrustLevel  `json:"trustLevel"`
}

type TrustGraphEdge struct {
	ID             string     `json:"id"`
	Source         string     `json:"source"`
	Target         string     `json:"target"`
	TrustLevel     TrustLevel `json:"trustLevel"`
	Protocol       string     `json:"protocol"`
	RequestsPerMin int        `json:"requestsPerMin"`
}

type DashboardMetrics struct {
	TotalAgents      int     `json:"totalAgents"`
	ActiveSessions   int     `json:"activeSessions"`
	PolicyViolations int     `json:"policyViolations"`
	TrustScore       float64 `json:"trustScore"`
	AgentsChange     float64 `json:"agentsChange"`
	SessionsChange   float64 `json:"sessionsChange"`
	ViolationsChange float64 `json:"violationsChange"`
	TrustScoreChange float64 `json:"trustScoreChange"`
}

type ActivityDataPoint struct {
	Date             string `json:"date"`
	Authentications  int    `json:"authentications"`
	PolicyChecks     int    `json:"policyChecks"`
	Violations       int    `json:"violations"`
}

// SPIFFE Identity Types
type SVIDInfo struct {
	SpiffeID    string    `json:"spiffeId"`
	Certificate string    `json:"certificate"`
	PrivateKey  string    `json:"privateKey"`
	ExpiresAt   time.Time `json:"expiresAt"`
	IssuedAt    time.Time `json:"issuedAt"`
	Serial      string    `json:"serial"`
}

type TrustBundle struct {
	TrustDomain string `json:"trustDomain"`
	RootCA      string `json:"rootCa"`
}

// Policy Evaluation
type PolicyEvalRequest struct {
	PolicyID string                 `json:"policyId"`
	Input    map[string]interface{} `json:"input"`
}

type PolicyEvalResult struct {
	Allow   bool     `json:"allow"`
	Reasons []string `json:"reasons"`
	Elapsed string   `json:"elapsed"`
}
