package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/aegis-agent-id/backend/internal/engine"
	"github.com/aegis-agent-id/backend/internal/identity"
	"github.com/aegis-agent-id/backend/internal/middleware"
	"github.com/aegis-agent-id/backend/internal/server"
	"github.com/aegis-agent-id/backend/internal/store"
)

const (
	httpPort    = ":8080"
	dbPath      = "aegis.db"
	trustDomain = "aegis.io"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)
	fmt.Println(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║     █████╗ ███████╗ ██████╗ ██╗███████╗                  ║
    ║    ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝                  ║
    ║    ███████║█████╗  ██║  ███╗██║███████╗                   ║
    ║    ██╔══██║██╔══╝  ██║   ██║██║╚════██║                   ║
    ║    ██║  ██║███████╗╚██████╔╝██║███████║                   ║
    ║    ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝                   ║
    ║                                                           ║
    ║    Agent ID — Zero-Trust Identity Control Plane           ║
    ║    v1.0.0                                                 ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
	`)

	// === Initialize Database ===
	log.Println("[INIT] Opening database:", dbPath)
	db, err := store.NewDB(dbPath)
	if err != nil {
		log.Fatalf("[FATAL] Database initialization failed: %v", err)
	}
	defer db.Close()

	// === Initialize SPIFFE Identity Provider ===
	log.Printf("[INIT] Initializing SPIFFE provider (trust domain: %s)", trustDomain)
	idProvider, err := identity.NewSPIFFEProvider(trustDomain)
	if err != nil {
		log.Fatalf("[FATAL] SPIFFE provider initialization failed: %v", err)
	}
	log.Println("[INIT] ✓ Root CA generated (ECDSA P-256)")
	log.Printf("[INIT] ✓ Trust domain: spiffe://%s", trustDomain)

	// === Initialize OPA Policy Engine ===
	log.Println("[INIT] Initializing OPA policy engine")
	opaEngine := engine.NewOPAEngine()
	log.Println("[INIT] ✓ OPA engine ready (embedded mode)")

	// === Create API Server ===
	apiServer := server.NewAPIServer(db, opaEngine, idProvider)

	// === Seed Database ===
	apiServer.SeedData()

	// === Apply Middleware ===
	handler := middleware.Recovery(
		middleware.Logger(
			middleware.CORS(
				apiServer.Handler(),
			),
		),
	)

	// === Start HTTP Server ===
	httpServer := &http.Server{
		Addr:    httpPort,
		Handler: handler,
	}

	// Graceful shutdown
	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		log.Println("[SHUTDOWN] Received signal, shutting down...")
		httpServer.Close()
	}()

	log.Println("")
	log.Println("════════════════════════════════════════════════════")
	log.Printf("  REST API server listening on http://localhost%s", httpPort)
	log.Println("  Endpoints:")
	log.Println("    GET  /api/v1/health              Health check")
	log.Println("    GET  /api/v1/dashboard/metrics    Dashboard KPIs")
	log.Println("    GET  /api/v1/dashboard/activity   Activity chart data")
	log.Println("    GET  /api/v1/agents               List agents")
	log.Println("    POST /api/v1/agents               Register agent")
	log.Println("    GET  /api/v1/policies             List policies")
	log.Println("    POST /api/v1/policies/{id}/evaluate  Evaluate policy (OPA)")
	log.Println("    GET  /api/v1/audit/events         Audit trail")
	log.Println("    GET  /api/v1/trust-graph/nodes    Trust graph nodes")
	log.Println("    GET  /api/v1/trust-graph/edges    Trust graph edges")
	log.Println("    POST /api/v1/identity/issue-svid  Issue SPIFFE SVID")
	log.Println("    GET  /api/v1/identity/trust-bundle Trust bundle")
	log.Println("════════════════════════════════════════════════════")
	log.Println("")

	if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("[FATAL] Server error: %v", err)
	}

	log.Println("[SHUTDOWN] Server stopped gracefully")
}
