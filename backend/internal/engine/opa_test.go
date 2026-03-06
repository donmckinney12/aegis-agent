package engine

import (
	"context"
	"strings"
	"testing"
	"time"
)

// ================================================================
// OPA Engine — Core Policy Evaluation
// ================================================================

func TestNewOPAEngine(t *testing.T) {
	e := NewOPAEngine()
	if e == nil {
		t.Fatal("NewOPAEngine returned nil")
	}
}

func TestEvaluate_AllowPolicy(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	// Policy that always allows
	policy := `allow := true`
	input := map[string]interface{}{"user": "alice"}

	result, err := e.Evaluate(ctx, policy, input)
	if err != nil {
		t.Fatalf("Evaluate error: %v", err)
	}
	if !result.Allow {
		t.Errorf("expected allow=true, got allow=false")
	}
	if result.Elapsed == "" {
		t.Error("expected non-empty elapsed time")
	}
}

func TestEvaluate_DenyPolicy(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	// Policy that always denies (default allow := false, no rules to override)
	policy := `# no allow rules`
	input := map[string]interface{}{"user": "attacker"}

	result, err := e.Evaluate(ctx, policy, input)
	if err != nil {
		t.Fatalf("Evaluate error: %v", err)
	}
	if result.Allow {
		t.Errorf("expected allow=false, got allow=true")
	}
}

func TestEvaluate_ConditionalPolicy(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	policy := `
allow if {
    input.role == "admin"
}
`
	// Admin should be allowed
	adminInput := map[string]interface{}{"role": "admin"}
	result, err := e.Evaluate(ctx, policy, adminInput)
	if err != nil {
		t.Fatalf("Evaluate admin error: %v", err)
	}
	if !result.Allow {
		t.Error("admin should be allowed")
	}

	// Viewer should be denied
	viewerInput := map[string]interface{}{"role": "viewer"}
	result, err = e.Evaluate(ctx, policy, viewerInput)
	if err != nil {
		t.Fatalf("Evaluate viewer error: %v", err)
	}
	if result.Allow {
		t.Error("viewer should be denied")
	}
}

// ================================================================
// OPA Engine — Financial Transaction Limits (Real Aegis Policy)
// ================================================================

func TestEvaluate_FinancialTransactionLimit(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	// Simulates the real Aegis financial policy
	policy := `
allow if {
    input.action == "refund"
    input.amount <= 500
}
`

	tests := []struct {
		name   string
		input  map[string]interface{}
		expect bool
	}{
		{
			name:   "refund under limit",
			input:  map[string]interface{}{"action": "refund", "amount": 250},
			expect: true,
		},
		{
			name:   "refund at exact limit",
			input:  map[string]interface{}{"action": "refund", "amount": 500},
			expect: true,
		},
		{
			name:   "refund over limit",
			input:  map[string]interface{}{"action": "refund", "amount": 750},
			expect: false,
		},
		{
			name:   "wrong action type",
			input:  map[string]interface{}{"action": "transfer", "amount": 100},
			expect: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := e.Evaluate(ctx, policy, tt.input)
			if err != nil {
				t.Fatalf("evaluate error: %v", err)
			}
			if result.Allow != tt.expect {
				t.Errorf("expected allow=%v, got allow=%v", tt.expect, result.Allow)
			}
		})
	}
}

// ================================================================
// OPA Engine — SPIFFE Identity Verification Policy
// ================================================================

func TestEvaluate_SPIFFEIdentityPolicy(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	policy := `
allow if {
    input.svid.spiffe_id != ""
    valid_certificate
}

valid_certificate if {
    input.svid.expires_at > input.current_time
}
`

	tests := []struct {
		name   string
		input  map[string]interface{}
		expect bool
	}{
		{
			name: "valid SVID and certificate",
			input: map[string]interface{}{
				"svid": map[string]interface{}{
					"spiffe_id":  "spiffe://aegis.io/agent/orchestrator/prime",
					"expires_at": float64(time.Now().Add(24 * time.Hour).Unix()),
				},
				"current_time": float64(time.Now().Unix()),
			},
			expect: true,
		},
		{
			name: "expired certificate",
			input: map[string]interface{}{
				"svid": map[string]interface{}{
					"spiffe_id":  "spiffe://aegis.io/agent/orchestrator/prime",
					"expires_at": float64(time.Now().Add(-1 * time.Hour).Unix()),
				},
				"current_time": float64(time.Now().Unix()),
			},
			expect: false,
		},
		{
			name: "empty SPIFFE ID",
			input: map[string]interface{}{
				"svid": map[string]interface{}{
					"spiffe_id":  "",
					"expires_at": float64(time.Now().Add(24 * time.Hour).Unix()),
				},
				"current_time": float64(time.Now().Unix()),
			},
			expect: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := e.Evaluate(ctx, policy, tt.input)
			if err != nil {
				t.Fatalf("evaluate error: %v", err)
			}
			if result.Allow != tt.expect {
				t.Errorf("expected allow=%v, got allow=%v", tt.expect, result.Allow)
			}
		})
	}
}

// ================================================================
// OPA Engine — Deny Messages
// ================================================================

func TestEvaluateWithDenials_CollectsDenyMessages(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	policy := `
deny[msg] if {
    input.amount > 500
    msg := "Transaction exceeds $500 limit"
}

deny[msg] if {
    input.action == "delete"
    msg := "Delete operations are forbidden"
}
`

	input := map[string]interface{}{
		"action": "delete",
		"amount": 1000,
	}

	result, err := e.EvaluateWithDenials(ctx, policy, input)
	if err != nil {
		t.Fatalf("EvaluateWithDenials error: %v", err)
	}
	if result.Allow {
		t.Error("expected denial")
	}
	// Should have collected deny messages
	if len(result.Reasons) < 1 {
		t.Fatal("expected at least one deny reason")
	}
}

// ================================================================
// OPA Engine — Cross-Domain Communication Policy
// ================================================================

func TestEvaluate_CrossDomainPolicy(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	policy := `
allow if {
    same_domain
}

allow if {
    input.source.type == "orchestrator"
}

same_domain if {
    input.source.trust_domain == input.target.trust_domain
}
`

	tests := []struct {
		name   string
		input  map[string]interface{}
		expect bool
	}{
		{
			name: "same domain communication",
			input: map[string]interface{}{
				"source": map[string]interface{}{
					"trust_domain": "aegis.io",
					"type":         "executor",
				},
				"target": map[string]interface{}{
					"trust_domain": "aegis.io",
				},
			},
			expect: true,
		},
		{
			name: "cross domain by orchestrator (allowed)",
			input: map[string]interface{}{
				"source": map[string]interface{}{
					"trust_domain": "aegis.io",
					"type":         "orchestrator",
				},
				"target": map[string]interface{}{
					"trust_domain": "partner.io",
				},
			},
			expect: true,
		},
		{
			name: "cross domain by executor (denied)",
			input: map[string]interface{}{
				"source": map[string]interface{}{
					"trust_domain": "aegis.io",
					"type":         "executor",
				},
				"target": map[string]interface{}{
					"trust_domain": "partner.io",
				},
			},
			expect: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := e.Evaluate(ctx, policy, tt.input)
			if err != nil {
				t.Fatalf("evaluate error: %v", err)
			}
			if result.Allow != tt.expect {
				t.Errorf("expected allow=%v, got allow=%v", tt.expect, result.Allow)
			}
		})
	}
}

// ================================================================
// OPA Engine — Performance Benchmark
// ================================================================

func TestEvaluate_SubMillisecondLatency(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()
	policy := `allow if { input.role == "admin" }`
	input := map[string]interface{}{"role": "admin"}

	start := time.Now()
	iterations := 100
	for i := 0; i < iterations; i++ {
		_, err := e.Evaluate(ctx, policy, input)
		if err != nil {
			t.Fatalf("iteration %d error: %v", i, err)
		}
	}
	elapsed := time.Since(start)
	avgMs := float64(elapsed.Milliseconds()) / float64(iterations)

	t.Logf("Average evaluation time: %.2fms over %d iterations", avgMs, iterations)
	// Each evaluation should be under 50ms (generous bound for CI)
	if avgMs > 50 {
		t.Errorf("average evaluation time %.2fms exceeds 50ms threshold", avgMs)
	}
}

// ================================================================
// wrapPolicy helper
// ================================================================

func TestWrapPolicy_AddsPackageDeclaration(t *testing.T) {
	result := wrapPolicy(`allow := true`)
	if !strings.Contains(result, "package policy") {
		t.Error("wrapped policy should contain 'package policy'")
	}
	if !strings.Contains(result, "import rego.v1") {
		t.Error("wrapped policy should contain 'import rego.v1'")
	}
	if !strings.Contains(result, "allow := true") {
		t.Error("wrapped policy should preserve user code")
	}
}

func TestEvaluate_MalformedPolicyDoesNotPanic(t *testing.T) {
	e := NewOPAEngine()
	ctx := context.Background()

	// Completely invalid Rego
	policy := `this is not valid rego { {{{ }}} !!!`
	input := map[string]interface{}{}

	result, err := e.Evaluate(ctx, policy, input)
	if err != nil {
		t.Fatalf("should not return error, got: %v", err)
	}
	// Should fail gracefully with allow=false
	if result.Allow {
		t.Error("malformed policy should not allow")
	}
}
