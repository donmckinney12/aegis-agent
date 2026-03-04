package engine

import (
	"context"
	"fmt"
	"time"

	"github.com/open-policy-agent/opa/rego"
)

// OPAEngine provides an embedded OPA/Rego policy evaluation engine.
// Policies are evaluated in-process for sub-millisecond latency.
type OPAEngine struct{}

func NewOPAEngine() *OPAEngine {
	return &OPAEngine{}
}

// EvalResult represents the result of a policy evaluation
type EvalResult struct {
	Allow   bool     `json:"allow"`
	Reasons []string `json:"reasons"`
	Elapsed string   `json:"elapsed"`
}

// Evaluate runs a Rego policy against the provided input
func (e *OPAEngine) Evaluate(ctx context.Context, regoCode string, input map[string]interface{}) (*EvalResult, error) {
	start := time.Now()

	// Create a new Rego query for evaluation
	r := rego.New(
		rego.Query("data.policy.allow"),
		rego.Module("policy.rego", wrapPolicy(regoCode)),
		rego.Input(input),
	)

	rs, err := r.Eval(ctx)
	if err != nil {
		// If the policy has errors, return a structured denial
		return &EvalResult{
			Allow:   false,
			Reasons: []string{fmt.Sprintf("Policy evaluation error: %v", err)},
			Elapsed: time.Since(start).String(),
		}, nil
	}

	elapsed := time.Since(start)

	// Parse result
	allow := false
	if len(rs) > 0 && len(rs[0].Expressions) > 0 {
		if val, ok := rs[0].Expressions[0].Value.(bool); ok {
			allow = val
		}
	}

	reasons := []string{}
	if allow {
		reasons = append(reasons, "Policy evaluation passed")
	} else {
		reasons = append(reasons, "Policy evaluation denied the request")
	}

	return &EvalResult{
		Allow:   allow,
		Reasons: reasons,
		Elapsed: elapsed.String(),
	}, nil
}

// EvaluateWithDenials runs a Rego policy and collects deny messages
func (e *OPAEngine) EvaluateWithDenials(ctx context.Context, regoCode string, input map[string]interface{}) (*EvalResult, error) {
	start := time.Now()

	// Evaluate allow
	allowResult, _ := e.Evaluate(ctx, regoCode, input)

	// Also try to collect deny messages
	r := rego.New(
		rego.Query("data.policy.deny"),
		rego.Module("policy.rego", wrapPolicy(regoCode)),
		rego.Input(input),
	)

	rs, err := r.Eval(ctx)
	elapsed := time.Since(start)

	reasons := []string{}
	if err == nil && len(rs) > 0 && len(rs[0].Expressions) > 0 {
		if msgs, ok := rs[0].Expressions[0].Value.([]interface{}); ok {
			for _, msg := range msgs {
				reasons = append(reasons, fmt.Sprintf("%v", msg))
			}
		}
	}

	if len(reasons) == 0 {
		reasons = allowResult.Reasons
	}

	return &EvalResult{
		Allow:   allowResult.Allow,
		Reasons: reasons,
		Elapsed: elapsed.String(),
	}, nil
}

// wrapPolicy ensures the Rego code is in the correct package
func wrapPolicy(code string) string {
	// If the code already has a package declaration, rewrite it to our expected package
	return fmt.Sprintf("package policy\n\nimport rego.v1\n\n# User policy rules\ndefault allow := false\n\n%s", code)
}
