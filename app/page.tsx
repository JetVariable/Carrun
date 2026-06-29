"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

export default function Home() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setVisible(true), 100)

    // Parallax au scroll
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: FONT, color: "#ffffff", display: "flex", flexDirection: "column" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        .stat-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: #d4f044 !important;
        }
        .point-card {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .point-card:hover {
          transform: translateX(6px);
        }
        .btn-primary {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .btn-primary:hover {
          opacity: 0.85 !important;
          transform: translateY(-2px);
        }
        .btn-outline {
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .btn-outline:hover {
          border-color: #d4f044 !important;
          color: #d4f044 !important;
          transform: translateY(-1px);
        }
        .nav-logo {
          transition: opacity 0.2s ease;
        }
        .nav-logo:hover { opacity: 0.7; }
      `}</style>

      {/* Header fixe */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 40px",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        background: scrollY > 50 ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(16px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <svg className="nav-logo" width="140" height="28" viewBox="0 0 140 28" style={{ cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <text y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="24" fontWeight="700" letterSpacing="0.2em">
            <tspan fill="#ffffff">CAR</tspan><tspan fill="#d4f044">RUN</tspan>
          </text>
        </svg>
        <button className="btn-outline" onClick={() => router.push("/login")}
          style={{ background: "none", border: "1px solid #333", color: "#999", padding: "8px 20px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
          Connexion
        </button>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>

        {/* Image parallax */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1502224562085-639556652f33?w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: `center ${30 + scrollY * 0.3}%`,
          transform: `scale(1.05)`,
          transition: "background-position 0.1s ease",
        }} />

        {/* Dégradé */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.97) 100%)" }} />

        {/* Contenu hero */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "680px", margin: "0 auto", padding: "80px 40px", width: "100%" }}>

          {visible && <>
            <p style={{
              color: "#d4f044", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em",
              textTransform: "uppercase", marginBottom: "24px",
              animation: "slideIn 0.6s ease forwards",
            }}>
              Coaching course à pied
            </p>

            <h1 style={{
              fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "32px",
              animation: "fadeUp 0.8s ease 0.1s both",
            }}>
              Courir mieux.<br />
              <span style={{ color: "#d4f044" }}>Semaine après<br />semaine.</span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1.8,
              maxWidth: "420px", marginBottom: "48px",
              animation: "fadeUp 0.8s ease 0.2s both",
            }}>
              Un programme personnalisé, conçu pour progresser à ton rythme. Chaque séance compte. Chaque kilomètre construit la suite.
            </p>

            <div style={{ animation: "fadeUp 0.8s ease 0.3s both" }}>
              <button className="btn-primary" onClick={() => router.push("/login")}
                style={{ padding: "18px 40px", background: "#d4f044", color: "#0a0a0a", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                Accéder à mon programme
              </button>
            </div>
          </>}
        </div>

        {/* Scroll indicator */}
        {visible && (
          <div style={{
            position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            animation: "fadeIn 1s ease 1s both",
          }}>
            <span style={{ fontSize: "10px", color: "#444", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Défiler</span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #444, transparent)", animation: "pulse 2s ease infinite" }} />
          </div>
        )}
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #1a1a1a", padding: "80px 40px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { valeur: "9", label: "Semaines de programme", delay: "0s" },
            { valeur: "3", label: "Séances par semaine", delay: "0.1s" },
            { valeur: "100%", label: "Personnalisé", delay: "0.2s" },
          ].map((stat, i) => (
            <div key={i} className="stat-card"
              style={{ background: "#111", padding: "28px", borderRadius: "2px", borderBottom: "2px solid #1a1a1a", animation: `fadeUp 0.6s ease ${stat.delay} both` }}>
              <p style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "-0.03em", color: "#d4f044", marginBottom: "8px", lineHeight: 1 }}>{stat.valeur}</p>
              <p style={{ fontSize: "11px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

{/* Coach */}
<section style={{ borderTop: "1px solid #1a1a1a", padding: "80px 40px" }}>
  <div style={{ maxWidth: "680px", margin: "0 auto" }}>
    <p style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "48px" }}>
      Ton coach
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "40px", alignItems: "start" }}>

      {/* Photo */}
      <div style={{ position: "relative" }}>
        <img src="/jean.jpeg" alt="Jean Carruel"
          style={{ width: "140px", height: "180px", objectFit: "cover", objectPosition: "center top", borderRadius: "2px", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "2px", border: "1px solid #2a2a2a" }} />
        <div style={{ position: "absolute", bottom: "-8px", right: "-8px", width: "140px", height: "180px", border: "1px solid #d4f044", borderRadius: "2px", zIndex: -1 }} />
      </div>

      <div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "4px", animation: "fadeUp 0.6s ease 0.1s both" }}>
          Jean Carruel
        </h2>
        <p style={{ fontSize: "11px", color: "#d4f044", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>
          Professeur d'EPS · Licence Entraînement Sportif
        </p>
        <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.8, marginBottom: "24px" }}>
          Passionné de course à pied et de trail, j'aime sillonner les sentiers pour découvrir de nouveaux paysages. Le plaisir de se mouvoir est au cœur de ma philosophie.
        </p>
        <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.8, marginBottom: "32px" }}>
          Mon passé de nageur m'a transmis le goût de la performance et du processus d'entraînement — voir ses progrès se construire semaine après semaine, c'est ce qui me passionne et que je transmets à mes coureurs.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            "Professeur d'EPS & coach certifié",
            "Spécialiste trail et course sur route",
            "Méthode basée sur les sensations et la progression",
          ].map((point, i) => (
            <div key={i} className="point-card"
              style={{ display: "flex", alignItems: "center", gap: "14px", animation: `fadeUp 0.6s ease ${0.3 + i * 0.1}s both` }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d4f044", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", color: "#888" }}>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid #1a1a1a", padding: "120px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Fond décoratif */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(212,240,68,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: "480px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "16px", animation: "fadeUp 0.6s ease both" }}>
            Prêt à courir ?
          </h2>
          <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.8, marginBottom: "48px", animation: "fadeUp 0.6s ease 0.1s both" }}>
            Connecte-toi pour accéder à ton programme personnalisé et suivre ta progression semaine après semaine.
          </p>
          <div style={{ animation: "fadeUp 0.6s ease 0.2s both" }}>
            <button className="btn-primary" onClick={() => router.push("/login")}
              style={{ padding: "18px 48px", background: "#d4f044", color: "#0a0a0a", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
              Accéder à mon programme
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <svg width="110" height="22" viewBox="0 0 110 22">
          <text y="17" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.2em">
            <tspan fill="#ffffff">CAR</tspan><tspan fill="#d4f044">RUN</tspan>
          </text>
        </svg>
        <span style={{ fontSize: "11px", color: "#333", letterSpacing: "0.05em" }}>© 2025</span>
      </footer>

    </main>
  )
}