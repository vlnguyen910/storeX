import { APP_NAME, type ApiResponse } from "@storex/shared";

export default function Home() {
  const status: ApiResponse<{ status: string }> = {
    success: true,
    message: "Frontend is ready!",
    data: { status: "operational" },
    timestamp: new Date().toISOString(),
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "2rem 3rem",
          backgroundColor: "var(--card)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--primary)" }}>
          {APP_NAME}
        </h1>
        <p style={{ marginBottom: "1.5rem", color: "#888" }}>Fullstack Monorepo Template</p>

        <div style={{ textAlign: "left", display: "grid", gap: "0.75rem", fontSize: "0.95rem" }}>
          <p>
            🚀 <strong>Frontend:</strong> Next.js + React (TypeScript)
          </p>
          <p>
            ⚡ <strong>Backend:</strong> Fastify + Node.js (TypeScript)
          </p>
          <p>
            📦 <strong>Package Manager:</strong> Bun
          </p>
          <p>
            🏎️ <strong>Monorepo Tool:</strong> Turborepo
          </p>
          <p>
            🧹 <strong>Linter & Formatter:</strong> Biome
          </p>
          <p>
            🐶 <strong>Git Hooks:</strong> Husky (pre-commit)
          </p>
          <p>
            🔗 <strong>Shared Package:</strong> <code>@storex/shared</code> ({status.data?.status})
          </p>
        </div>
      </div>
    </main>
  );
}
