package identity

import (
	"crypto/x509"
	"encoding/pem"
	"strings"
	"testing"
	"time"
)

// ================================================================
// SPIFFE Provider — Initialization
// ================================================================

func TestNewSPIFFEProvider(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("NewSPIFFEProvider error: %v", err)
	}
	if p == nil {
		t.Fatal("provider is nil")
	}
	if p.TrustDomain() != "aegis.io" {
		t.Errorf("expected trust domain 'aegis.io', got '%s'", p.TrustDomain())
	}
}

func TestNewSPIFFEProvider_RootCAIsValid(t *testing.T) {
	p, err := NewSPIFFEProvider("test.aegis.io")
	if err != nil {
		t.Fatalf("NewSPIFFEProvider error: %v", err)
	}

	if p.rootCA == nil {
		t.Fatal("root CA certificate is nil")
	}
	if !p.rootCA.IsCA {
		t.Error("root certificate should be a CA")
	}
	if p.rootCA.MaxPathLen != 1 {
		t.Errorf("expected MaxPathLen=1, got %d", p.rootCA.MaxPathLen)
	}
	if p.rootCA.Subject.CommonName != "Aegis Root CA - test.aegis.io" {
		t.Errorf("unexpected CN: %s", p.rootCA.Subject.CommonName)
	}
}

// ================================================================
// SPIFFE Provider — SVID Issuance
// ================================================================

func TestIssueSVID_ValidCertificate(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	svid, err := p.IssueSVID("orchestrator", "prime", 24*time.Hour)
	if err != nil {
		t.Fatalf("IssueSVID error: %v", err)
	}

	// Verify SPIFFE ID format
	expectedID := "spiffe://aegis.io/agent/orchestrator/prime"
	if svid.SpiffeID != expectedID {
		t.Errorf("expected SPIFFE ID '%s', got '%s'", expectedID, svid.SpiffeID)
	}

	// Verify certificate is valid PEM
	block, _ := pem.Decode([]byte(svid.Certificate))
	if block == nil {
		t.Fatal("certificate is not valid PEM")
	}
	if block.Type != "CERTIFICATE" {
		t.Errorf("expected PEM type CERTIFICATE, got %s", block.Type)
	}

	// Parse and validate the X.509 certificate
	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		t.Fatalf("parse certificate: %v", err)
	}

	// Verify SPIFFE URI SAN
	if len(cert.URIs) != 1 {
		t.Fatalf("expected 1 URI SAN, got %d", len(cert.URIs))
	}
	if cert.URIs[0].String() != expectedID {
		t.Errorf("URI SAN mismatch: %s", cert.URIs[0].String())
	}

	// Verify not expired
	if time.Now().After(cert.NotAfter) {
		t.Error("certificate is already expired")
	}

	// Verify signed by root CA
	roots := x509.NewCertPool()
	roots.AddCert(p.rootCA)
	opts := x509.VerifyOptions{
		Roots:     roots,
		KeyUsages: []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth},
	}
	if _, err := cert.Verify(opts); err != nil {
		t.Errorf("certificate verification failed: %v", err)
	}
}

func TestIssueSVID_ValidPrivateKey(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	svid, err := p.IssueSVID("executor", "finbot", 1*time.Hour)
	if err != nil {
		t.Fatalf("IssueSVID error: %v", err)
	}

	// Verify private key is valid PEM
	block, _ := pem.Decode([]byte(svid.PrivateKey))
	if block == nil {
		t.Fatal("private key is not valid PEM")
	}
	if block.Type != "EC PRIVATE KEY" {
		t.Errorf("expected PEM type 'EC PRIVATE KEY', got '%s'", block.Type)
	}

	_, err = x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		t.Fatalf("invalid EC private key: %v", err)
	}
}

func TestIssueSVID_UniqueSerialsAndCerts(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	svid1, err := p.IssueSVID("executor", "agent-a", 1*time.Hour)
	if err != nil {
		t.Fatalf("issue SVID 1: %v", err)
	}

	svid2, err := p.IssueSVID("executor", "agent-b", 1*time.Hour)
	if err != nil {
		t.Fatalf("issue SVID 2: %v", err)
	}

	// Serial numbers must be unique
	if svid1.Serial == svid2.Serial {
		t.Error("serial numbers should be unique")
	}

	// Certificates must be different
	if svid1.Certificate == svid2.Certificate {
		t.Error("certificates should be unique")
	}

	// Private keys must be different
	if svid1.PrivateKey == svid2.PrivateKey {
		t.Error("private keys should be unique")
	}
}

func TestIssueSVID_TTLRespected(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	ttl := 2 * time.Hour
	svid, err := p.IssueSVID("llm", "claude", ttl)
	if err != nil {
		t.Fatalf("IssueSVID error: %v", err)
	}

	// ExpiresAt should be approximately now + TTL (within 10s tolerance)
	expectedExpiry := time.Now().Add(ttl)
	diff := svid.ExpiresAt.Sub(expectedExpiry)
	if diff < -10*time.Second || diff > 10*time.Second {
		t.Errorf("expiry time off by %v", diff)
	}
}

func TestIssueSVID_SPIFFEIDFormat(t *testing.T) {
	p, err := NewSPIFFEProvider("company.aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	tests := []struct {
		agentType string
		agentPath string
		expected  string
	}{
		{"orchestrator", "prime", "spiffe://company.aegis.io/agent/orchestrator/prime"},
		{"executor", "finbot-refund", "spiffe://company.aegis.io/agent/executor/finbot-refund"},
		{"llm", "claude-reviewer", "spiffe://company.aegis.io/agent/llm/claude-reviewer"},
		{"retriever", "rag-knowledge", "spiffe://company.aegis.io/agent/retriever/rag-knowledge"},
		{"tool", "sentinel-threat", "spiffe://company.aegis.io/agent/tool/sentinel-threat"},
	}

	for _, tt := range tests {
		t.Run(tt.agentType+"/"+tt.agentPath, func(t *testing.T) {
			svid, err := p.IssueSVID(tt.agentType, tt.agentPath, 1*time.Hour)
			if err != nil {
				t.Fatalf("IssueSVID error: %v", err)
			}
			if svid.SpiffeID != tt.expected {
				t.Errorf("expected '%s', got '%s'", tt.expected, svid.SpiffeID)
			}
			if !strings.HasPrefix(svid.SpiffeID, "spiffe://") {
				t.Error("SPIFFE ID must start with 'spiffe://'")
			}
		})
	}
}

// ================================================================
// SPIFFE Provider — Certificate Revocation
// ================================================================

func TestRevokeCertificate(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	svid, err := p.IssueSVID("executor", "malicious-agent", 24*time.Hour)
	if err != nil {
		t.Fatalf("IssueSVID error: %v", err)
	}

	// Should not be revoked initially
	if p.IsRevoked(svid.Serial) {
		t.Error("newly issued SVID should not be revoked")
	}

	// Revoke it
	p.RevokeCertificate(svid.Serial)

	// Should now be revoked
	if !p.IsRevoked(svid.Serial) {
		t.Error("revoked SVID should be marked as revoked")
	}
}

func TestIsRevoked_UnknownSerial(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	if p.IsRevoked("NONEXISTENT-SERIAL") {
		t.Error("unknown serial should not be revoked")
	}
}

func TestRevokeCertificate_MultipleRevocations(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	serials := make([]string, 5)
	for i := 0; i < 5; i++ {
		svid, err := p.IssueSVID("executor", "agent", 1*time.Hour)
		if err != nil {
			t.Fatalf("issue %d error: %v", i, err)
		}
		serials[i] = svid.Serial
	}

	// Revoke only even-indexed
	p.RevokeCertificate(serials[0])
	p.RevokeCertificate(serials[2])
	p.RevokeCertificate(serials[4])

	// Verify correct revocation state
	if !p.IsRevoked(serials[0]) {
		t.Error("serial 0 should be revoked")
	}
	if p.IsRevoked(serials[1]) {
		t.Error("serial 1 should NOT be revoked")
	}
	if !p.IsRevoked(serials[2]) {
		t.Error("serial 2 should be revoked")
	}
	if p.IsRevoked(serials[3]) {
		t.Error("serial 3 should NOT be revoked")
	}
	if !p.IsRevoked(serials[4]) {
		t.Error("serial 4 should be revoked")
	}
}

// ================================================================
// SPIFFE Provider — Trust Bundle
// ================================================================

func TestGetTrustBundle(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	bundle := p.GetTrustBundle()
	if bundle == nil {
		t.Fatal("trust bundle is nil")
	}
	if bundle.TrustDomain != "aegis.io" {
		t.Errorf("expected trust domain 'aegis.io', got '%s'", bundle.TrustDomain)
	}
	if !strings.Contains(bundle.RootCA, "BEGIN CERTIFICATE") {
		t.Error("root CA should be PEM encoded")
	}
	if !strings.Contains(bundle.RootCA, "END CERTIFICATE") {
		t.Error("root CA PEM should have END marker")
	}

	// Verify the PEM is parseable
	block, _ := pem.Decode([]byte(bundle.RootCA))
	if block == nil {
		t.Fatal("trust bundle root CA is not valid PEM")
	}
	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		t.Fatalf("parse trust bundle cert: %v", err)
	}
	if !cert.IsCA {
		t.Error("trust bundle certificate should be a CA")
	}
}

// ================================================================
// SPIFFE Provider — Concurrent Safety
// ================================================================

func TestIssueSVID_ConcurrentSafety(t *testing.T) {
	p, err := NewSPIFFEProvider("aegis.io")
	if err != nil {
		t.Fatalf("provider error: %v", err)
	}

	const goroutines = 20
	results := make(chan string, goroutines)
	errors := make(chan error, goroutines)

	for i := 0; i < goroutines; i++ {
		go func() {
			svid, err := p.IssueSVID("executor", "concurrent-agent", 1*time.Hour)
			if err != nil {
				errors <- err
				return
			}
			results <- svid.Serial
		}()
	}

	seen := make(map[string]bool)
	for i := 0; i < goroutines; i++ {
		select {
		case err := <-errors:
			t.Fatalf("concurrent issue error: %v", err)
		case serial := <-results:
			if seen[serial] {
				t.Errorf("duplicate serial: %s", serial)
			}
			seen[serial] = true
		}
	}

	if len(seen) != goroutines {
		t.Errorf("expected %d unique serials, got %d", goroutines, len(seen))
	}
}
