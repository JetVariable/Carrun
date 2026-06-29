"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

const COUREURS: Record<string, string> = {
  "1001": "nena2003",
  "1002": "julie2024",
}

export default function Login() {
  const [id, setId] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    if (!COUREURS[id.trim()]) {
      setErreur("Identifiant inconnu.")
      return
    }
    if (COUREURS[id.trim()] !== motDePasse) {
      setErreur("Mot de passe incorrect.")
      return
    }
    sessionStorage.setItem("coureur_id", id.trim())
    router.push(`/dashboard?id=${id.trim()}`)
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: FONT,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .input-field:focus {
          border-bottom-color: #d4f044 !important;
        }
        .btn-login {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .btn-login:hover {
          opacity: 0.85 !important;
          transform: translateY(-2px);
        }
        .btn-back {
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .btn-back:hover {
          color: #d4f044 !important;
          border-color: #d4f044 !important;
        }
        .logo-link {
          transition: opacity 0.2s ease;
          cursor: pointer;
        }
        .logo-link:hover {
          opacity: 0.7;
        }
      `}</style>

      {/* Image de fond subtile */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1502224562085-639556652f33?w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.08,
        zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 40px",
        borderBottom: "1px solid #1a1a1a",
        animation: "fadeIn 0.6s ease both",
      }}>
        {/* Logo cliquable */}
        <svg className="logo-link" width="140" height="28" viewBox="0 0 140 28"
          onClick={() => router.push("/")}>
          <text y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="24" fontWeight="700" letterSpacing="0.2em">
            <tspan fill="#ffffff">CAR</tspan><tspan fill="#d4f044">RUN</tspan>
          </text>
        </svg>

        {/* Bouton retour */}
        <button className="btn-back" onClick={() => router.push("/")}
          style={{ background: "none", border: "1px solid #333", color: "#666", padding: "8px 20px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
          ← Accueil
        </button>
      </header>

      {/* Contenu centré */}
      <div style={{
        position: "relative", zIndex: 10,
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px",
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>

          {/* Titre */}
          <div style={{ marginBottom: "48px", animation: "fadeUp 0.6s ease 0.1s both" }}>
            <p style={{ color: "#d4f044", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
              Espace coureur
            </p>
            <h1 style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Connexion
            </h1>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.7 }}>
              Accède à ton programme d'entraînement personnalisé.
            </p>
          </div>

          {/* Formulaire */}
          <div style={{ animation: "fadeUp 0.6s ease 0.2s both" }}>

            {/* Identifiant */}
            <label style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              Identifiant
            </label>
            <input
              className="input-field"
              type="text"
              value={id}
              onChange={(e) => { setId(e.target.value); setErreur("") }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Ex : 1001"
              style={{
                width: "100%", padding: "14px 0", background: "transparent",
                border: "none", borderBottom: erreur ? "1px solid #ef4444" : "1px solid #2a2a2a",
                color: "#ffffff", fontSize: "16px", outline: "none",
                boxSizing: "border-box", marginBottom: "32px",
                transition: "border-color 0.2s", fontFamily: FONT,
              }}
            />

            {/* Mot de passe */}
            <label style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              Mot de passe
            </label>
            <div style={{ position: "relative", marginBottom: erreur ? "8px" : "48px" }}>
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                value={motDePasse}
                onChange={(e) => { setMotDePasse(e.target.value); setErreur("") }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "14px 60px 14px 0", background: "transparent",
                  border: "none", borderBottom: erreur ? "1px solid #ef4444" : "1px solid #2a2a2a",
                  color: "#ffffff", fontSize: "16px", outline: "none",
                  boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: FONT,
                }}
              />
              <button onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {showPassword ? "Masquer" : "Voir"}
              </button>
            </div>

            {/* Erreur */}
            {erreur && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "32px", marginTop: "8px" }}>
                {erreur}
              </p>
            )}

            {/* Bouton */}
            <button className="btn-login" onClick={handleLogin}
              style={{ width: "100%", padding: "16px", background: "#d4f044", color: "#0a0a0a", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
              Accéder au programme
            </button>
          </div>
        </div>
      </div>

      {/* Footer discret */}
      <footer style={{
        position: "relative", zIndex: 10,
        padding: "20px 40px", borderTop: "1px solid #1a1a1a",
        display: "flex", justifyContent: "center",
        animation: "fadeIn 0.6s ease 0.4s both",
      }}>
        <span style={{ fontSize: "11px", color: "#2a2a2a", letterSpacing: "0.05em" }}>© 2025 Carrun</span>
      </footer>

    </main>
  )
}