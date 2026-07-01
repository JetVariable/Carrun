"use client"

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

const allures = [
  {
    nom: "Allure Bleue",
    couleur: "#0e9aa7",
    bg: "#0e9aa710",
    description: "Je suis capable d'inspirer uniquement par le nez, je peux raconter ma journée tranquillement sans avoir besoin de reprendre mon souffle.",
    sensation: "Facile, en aisance",
    usage: "Course continue, échauffement, retour au calme",
    intensite: 1,
  },
  {
    nom: "Allure Verte",
    couleur: "#4caf50",
    bg: "#4caf5010",
    description: "Je ne peux plus inspirer uniquement par le nez, je peux raconter ma journée tranquillement mais j'ai besoin de reprendre mon souffle.",
    sensation: "Je contrôle mon effort",
    usage: "Intervalles longs (2' à 5'), efforts progressifs",
    intensite: 2,
  },
  {
    nom: "Allure Orange",
    couleur: "#f47920",
    bg: "#f4792010",
    description: "Je peux dire quelques mots mais je suis obligé(e) de reprendre mon souffle. Mon inspiration et mon expiration sont fortes. Je suis concentré(e) sur mon effort.",
    sensation: "L'effort est soutenu",
    usage: "Intervalles courts (30''/30''), fractions intensives",
    intensite: 3,
  },
  {
    nom: "Allure Rouge",
    couleur: "#e53935",
    bg: "#e5393510",
    description: "La dernière chose que j'ai envie de faire c'est de raconter une histoire même si elle est très drôle. Le manque d'air se fait ressentir. Ma fréquence respiratoire est élevée.",
    sensation: "L'effort est difficile et maximal",
    usage: "Dernières répétitions d'un effort progressif, effort maximal",
    intensite: 4,
  },
]

export default function Allures() {
  const router = useRouter()

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: FONT, color: "#ffffff" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .allure-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .allure-card:hover {
          transform: translateY(-3px);
        }
        .btn-back {
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-back:hover {
          border-color: #d4f044 !important;
          color: #d4f044 !important;
        }
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <svg width="140" height="28" viewBox="0 0 140 28" style={{ cursor: "pointer" }} onClick={() => router.back()}>
          <text y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="24" fontWeight="700" letterSpacing="0.2em">
            <tspan fill="#ffffff">CAR</tspan><tspan fill="#d4f044">RUN</tspan>
          </text>
        </svg>
        <button className="btn-back" onClick={() => router.back()}
          style={{ background: "none", border: "1px solid #333", color: "#666", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
          ← Retour
        </button>
      </header>

      {/* Bandeau image */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1544899489-a083461b088c?w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center 60%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.2), rgba(10,10,10,0.97))" }} />
        <div style={{ position: "absolute", bottom: "32px", left: "40px" }}>
          <p style={{ fontSize: "11px", color: "#d4f044", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Guide</p>
          <h1 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Tableau des allures.</h1>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 40px" }}>

        {/* Intro */}
        <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, marginBottom: "48px", animation: "fadeUp 0.6s ease both" }}>
          4 allures pour calibrer ton effort à l'entraînement. Écoute tes sensations — c'est ton meilleur indicateur de performance.
        </p>

        {/* Récap rapide */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "56px", animation: "fadeUp 0.6s ease 0.1s both" }}>
          {allures.map((a, i) => (
            <div key={i} style={{
              background: a.bg,
              border: `1px solid ${a.couleur}30`,
              borderTop: `3px solid ${a.couleur}`,
              borderRadius: "2px",
              padding: "16px 12px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: a.couleur, letterSpacing: "0.08em", marginBottom: "6px" }}>
                {a.nom}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginBottom: "6px" }}>
                {[1, 2, 3, 4].map(level => (
                  <div key={level} style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: level <= a.intensite ? a.couleur : "#2a2a2a",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: "10px", color: "#555", letterSpacing: "0.06em" }}>
                {a.sensation.split(",")[0]}
              </p>
            </div>
          ))}
        </div>

        {/* Cards détaillées */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {allures.map((a, i) => (
            <div key={i} className="allure-card"
              style={{
                background: "#111",
                borderLeft: `4px solid ${a.couleur}`,
                borderRadius: "2px",
                overflow: "hidden",
                animation: `fadeUp 0.6s ease ${0.1 + i * 0.08}s both`,
              }}
            >
              {/* Header card */}
              <div style={{
                background: a.bg,
                padding: "20px 24px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <p style={{ fontSize: "12px", color: a.couleur, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2px" }}>
                    {a.nom}
                  </p>
                  <p style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{a.sensation}</p>
                </div>
                {/* Indicateur intensité */}
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} style={{
                      width: level <= a.intensite ? "10px" : "6px",
                      height: level <= a.intensite ? "10px" : "6px",
                      borderRadius: "50%",
                      background: level <= a.intensite ? a.couleur : "#2a2a2a",
                      transition: "all 0.2s",
                    }} />
                  ))}
                </div>
              </div>

              {/* Body card */}
              <div style={{ padding: "24px" }}>
                <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.8, marginBottom: "20px" }}>
                  {a.description}
                </p>

                {/* Usage */}
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  background: "#0a0a0a", padding: "12px 16px", borderRadius: "2px",
                  borderLeft: `2px solid ${a.couleur}`,
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: a.couleur, flexShrink: 0, marginTop: "5px" }} />
                  <div>
                    <p style={{ fontSize: "10px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>
                      Utilisée pour
                    </p>
                    <p style={{ fontSize: "13px", color: "#777" }}>{a.usage}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA retour */}
        <div style={{ marginTop: "60px", textAlign: "center", animation: "fadeUp 0.6s ease 0.5s both" }}>
          <button onClick={() => router.back()}
            style={{
              padding: "16px 48px",
              background: "#d4f044", color: "#0a0a0a",
              border: "none", borderRadius: "2px",
              fontSize: "12px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Retour au programme
          </button>
        </div>
      </div>
    </main>
  )
}