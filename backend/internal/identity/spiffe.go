package identity

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"net/url"
	"sync"
	"time"

	"github.com/aegis-agent-id/backend/pkg/models"
)

// SPIFFEProvider manages a self-contained SPIFFE-compatible CA.
// It issues X.509 SVIDs with proper spiffe:// URIs — functionally
// identical to SPIRE but runs without external infrastructure.
type SPIFFEProvider struct {
	trustDomain string
	rootCA      *x509.Certificate
	rootKey     *ecdsa.PrivateKey
	rootPEM     string
	serial      int64
	mu          sync.Mutex
	revoked     map[string]time.Time // serial -> revoked time
}

func NewSPIFFEProvider(trustDomain string) (*SPIFFEProvider, error) {
	// Generate Root CA
	rootKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("generate root key: %w", err)
	}

	serialNumber, err := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 128))
	if err != nil {
		return nil, fmt.Errorf("generate serial: %w", err)
	}

	rootTemplate := &x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			CommonName:   fmt.Sprintf("Aegis Root CA - %s", trustDomain),
			Organization: []string{"Aegis Agent ID"},
		},
		NotBefore:             time.Now().Add(-1 * time.Hour),
		NotAfter:              time.Now().Add(10 * 365 * 24 * time.Hour), // 10 year CA
		KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageCRLSign,
		BasicConstraintsValid: true,
		IsCA:                  true,
		MaxPathLen:            1,
	}

	rootCertDER, err := x509.CreateCertificate(rand.Reader, rootTemplate, rootTemplate, &rootKey.PublicKey, rootKey)
	if err != nil {
		return nil, fmt.Errorf("create root cert: %w", err)
	}

	rootCert, err := x509.ParseCertificate(rootCertDER)
	if err != nil {
		return nil, fmt.Errorf("parse root cert: %w", err)
	}

	rootPEM := string(pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: rootCertDER}))

	return &SPIFFEProvider{
		trustDomain: trustDomain,
		rootCA:      rootCert,
		rootKey:     rootKey,
		rootPEM:     rootPEM,
		serial:      1,
		revoked:     make(map[string]time.Time),
	}, nil
}

// IssueSVID creates a new X.509 SVID for an agent
func (p *SPIFFEProvider) IssueSVID(agentType, agentPath string, ttl time.Duration) (*models.SVIDInfo, error) {
	p.mu.Lock()
	p.serial++
	serial := p.serial
	p.mu.Unlock()

	spiffeID := fmt.Sprintf("spiffe://%s/agent/%s/%s", p.trustDomain, agentType, agentPath)

	spiffeURI, err := url.Parse(spiffeID)
	if err != nil {
		return nil, fmt.Errorf("parse SPIFFE ID: %w", err)
	}

	// Generate leaf key
	leafKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("generate leaf key: %w", err)
	}

	now := time.Now()
	leafTemplate := &x509.Certificate{
		SerialNumber: big.NewInt(serial),
		Subject: pkix.Name{
			CommonName:   agentPath,
			Organization: []string{"Aegis Agent ID"},
		},
		URIs:      []*url.URL{spiffeURI},
		NotBefore: now.Add(-5 * time.Minute), // Clock skew tolerance
		NotAfter:  now.Add(ttl),
		KeyUsage:  x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage: []x509.ExtKeyUsage{
			x509.ExtKeyUsageClientAuth,
			x509.ExtKeyUsageServerAuth,
		},
	}

	leafCertDER, err := x509.CreateCertificate(rand.Reader, leafTemplate, p.rootCA, &leafKey.PublicKey, p.rootKey)
	if err != nil {
		return nil, fmt.Errorf("create leaf cert: %w", err)
	}

	certPEM := string(pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: leafCertDER}))
	keyDER, err := x509.MarshalECPrivateKey(leafKey)
	if err != nil {
		return nil, fmt.Errorf("marshal key: %w", err)
	}
	keyPEM := string(pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: keyDER}))

	serialStr := fmt.Sprintf("AEG-2026-%04d", serial)

	return &models.SVIDInfo{
		SpiffeID:    spiffeID,
		Certificate: certPEM,
		PrivateKey:  keyPEM,
		ExpiresAt:   now.Add(ttl),
		IssuedAt:    now,
		Serial:      serialStr,
	}, nil
}

// RevokeCertificate marks a certificate as revoked
func (p *SPIFFEProvider) RevokeCertificate(serial string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.revoked[serial] = time.Now()
}

// IsRevoked checks if a certificate serial is revoked
func (p *SPIFFEProvider) IsRevoked(serial string) bool {
	p.mu.Lock()
	defer p.mu.Unlock()
	_, ok := p.revoked[serial]
	return ok
}

// GetTrustBundle returns the root CA trust bundle
func (p *SPIFFEProvider) GetTrustBundle() *models.TrustBundle {
	return &models.TrustBundle{
		TrustDomain: p.trustDomain,
		RootCA:      p.rootPEM,
	}
}

// TrustDomain returns the configured trust domain
func (p *SPIFFEProvider) TrustDomain() string {
	return p.trustDomain
}
