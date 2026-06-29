"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

function kmhToMinKm(kmh: number): string {
  if (!kmh || kmh <= 0) return "--"
  const minPerKm = 60 / kmh
  const min = Math.floor(minPerKm)
  const sec = Math.round((minPerKm - min) * 60)
  return `${min}'${sec.toString().padStart(2, "0")}"/km`
}

function calculerAllures(vma: number) {
  return [
    { nom: "Endurance fondamentale", couleur: "#0e9aa7", pourcentage: "65–75%", vitesseMin: vma * 0.65, vitesseMax: vma * 0.75, description: "Allure Bleue — footing tranquille" },
    { nom: "SV1 — Seuil Ventilatoire 1", couleur: "#4caf50", pourcentage: "75–85%", vitesseMin: vma * 0.75, vitesseMax: vma * 0.85, description: "Allure Verte — effort contrôlé" },
    { nom: "SV2 — Seuil Ventilatoire 2", couleur: "#f47920", pourcentage: "85–95%", vitesseMin: vma * 0.85, vitesseMax: vma * 0.95, description: "Allure Orange — effort soutenu" },
    { nom: "VMA — Vitesse Maximale Aérobie", couleur: "#e53935", pourcentage: "95–105%", vitesseMin: vma * 0.95, vitesseMax: vma * 1.05, description: "Allure Rouge — effort maximal" },
  ]
}

export default function Profil() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get("id")
  const [autorise, setAutorise] = useState(false)
  const [age, setAge] = useState("")
  const [vma, setVma] = useState("")
  const [seancesParSemaine, setSeancesParSemaine] = useState("")
  const [sauvegarde, setSauvegarde] = useState(false)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const sessionId = sessionStorage.getItem("coureur_id")
    if (!sessionId || sessionId !== id) {
      router.push("/login")
    } else {
      setAutorise(true)
      chargerProfil()
    }
  }, [id])

  const chargerProfil = async () => {
    const { data, error } = await supabase
      .from("profil")
      .select("*")
      .eq("coureur_id", id)
      .single()
    if (!error && data) {
      setAge(data.age?.toString() || "")
      setVma(data.vma?.toString() || "")
      setSeancesParSemaine(data.seances_par_semaine?.toString() || "")
    }
    setChargement(false)
  }

  const handleSave = async () => {
    const { error } = await supabase.from("profil").upsert({
      coureur_id: id,
      age: parseInt(age) || null,
      vma: parseFloat(vma) || null,
      seances_par_semaine: parseInt(seancesParSemaine) || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "coureur_id" })
    if (!error) {
      setSauvegarde(true)
      setTimeout(() => setSauvegarde(false), 2000)
    }
  }

  if (!autorise) return null

  const vmaNum = parseFloat(vma)
  const allures = vmaNum > 0 ? calculerAllures(vmaNum) : null

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: FONT, color: "#ffffff" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .input-field { transition: border-color 0.2s ease; }
        .input-field:focus { border-bottom-color: #d4f044 !important; outline: none; }
        .btn-save { transition: all 0.3s ease; }
        .btn-save:hover { opacity: 0.85; transform: translateY(-1px); }
        .allure-card { transition: transform 0.2s ease; }
        .allure-card:hover { transform: translateX(4px); }
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <svg width="140" height="28" viewBox="0 0 140 28" style={{ cursor: "pointer" }} onClick={() => router.push(`/dashboard?id=${id}`)}>
          <text y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="24" fontWeight="700" letterSpacing="0.2em">
            <tspan fill="#ffffff">CAR</tspan><tspan fill="#d4f044">RUN</tspan>
          </text>
        </svg>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => router.push(`/dashboard?id=${id}`)}
            style={{ background: "none", border: "1px solid #333", color: "#999", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            ← Programme
          </button>
          <button onClick={() => { sessionStorage.removeItem("coureur_id"); router.push("/login") }}
            style={{ background: "none", border: "1px solid #333", color: "#666", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Hero image */}
      <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
        <img src="/trail.jpg" alt="Trail running"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.97) 100%)" }} />
        <div style={{ position: "absolute", bottom: "32px", left: "40px" }}>
          <p style={{ fontSize: "11px", color: "#d4f044", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
            Mon profil
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#ffffff" }}>
            Mes informations.
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 40px" }}>

        {chargement ? (
          <p style={{ color: "#555", fontSize: "14px", textAlign: "center" }}>Chargement...</p>
        ) : (
          <>
            {/* Formulaire */}
            <div style={{ marginBottom: "60px", animation: "fadeUp 0.6s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid #1a1a1a" }}>
                <div style={{ width: "4px", height: "20px", background: "#d4f044", borderRadius: "2px" }} />
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Informations générales
                </p>
              </div>

              {/* Grille infos */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
                <div>
                  <label style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Âge
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="Ex : 32"
                    style={{ width: "100%", padding: "14px 0", background: "transparent", border: "none", borderBottom: "1px solid #2a2a2a", color: "#ffffff", fontSize: "20px", fontWeight: 700, boxSizing: "border-box", fontFamily: FONT }}
                  />
                </div>
                <div>
                  <label style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Séances / semaine
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    value={seancesParSemaine}
                    onChange={e => setSeancesParSemaine(e.target.value)}
                    placeholder="Ex : 3"
                    style={{ width: "100%", padding: "14px 0", background: "transparent", border: "none", borderBottom: "1px solid #2a2a2a", color: "#ffffff", fontSize: "20px", fontWeight: 700, boxSizing: "border-box", fontFamily: FONT }}
                  />
                </div>
              </div>

              {/* VMA */}
              <div style={{ marginBottom: "40px" }}>
                <label style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  VMA (km/h)
                </label>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <input
                    className="input-field"
                    type="number"
                    value={vma}
                    onChange={e => setVma(e.target.value)}
                    placeholder="Ex : 14"
                    style={{ width: "120px", padding: "14px 0", background: "transparent", border: "none", borderBottom: "1px solid #2a2a2a", color: "#d4f044", fontSize: "36px", fontWeight: 700, boxSizing: "border-box", fontFamily: FONT }}
                  />
                  <span style={{ fontSize: "14px", color: "#555" }}>km/h</span>
                  {vmaNum > 0 && (
                    <span style={{ fontSize: "13px", color: "#555", marginLeft: "8px" }}>
                      soit <span style={{ color: "#fff" }}>{kmhToMinKm(vmaNum)}</span>
                    </span>
                  )}
                </div>
                <p style={{ color: "#333", fontSize: "12px", marginTop: "10px", lineHeight: 1.6 }}>
                  Ta Vitesse Maximale Aérobie — un test de 6 minutes sur piste permet de la calculer.
                </p>
              </div>

              {/* Bouton save */}
              <button
                className="btn-save"
                onClick={handleSave}
                style={{
                  padding: "16px 40px",
                  background: sauvegarde ? "#1a1a1a" : "#d4f044",
                  color: sauvegarde ? "#d4f044" : "#0a0a0a",
                  border: sauvegarde ? "1px solid #d4f044" : "none",
                  borderRadius: "2px",
                  fontSize: "12px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {sauvegarde ? "✓ Sauvegardé" : "Sauvegarder"}
              </button>
            </div>

            {/* Tableau allures */}
            {allures && (
              <div style={{ animation: "fadeUp 0.6s ease 0.1s both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #1a1a1a" }}>
                  <div style={{ width: "4px", height: "20px", background: "#d4f044", borderRadius: "2px" }} />
                  <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Mes allures personnalisées
                  </p>
                </div>
                <p style={{ color: "#444", fontSize: "13px", marginBottom: "32px" }}>
                  Calculées à partir de ta VMA de <span style={{ color: "#d4f044", fontWeight: 700 }}>{vma} km/h</span>
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {allures.map((a, i) => (
                    <div key={i} className="allure-card"
                      style={{ borderLeft: `4px solid ${a.couleur}`, background: "#111", borderRadius: "2px", padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, background: `${a.couleur}06`, pointerEvents: "none" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                          <p style={{ fontSize: "10px", color: a.couleur, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                            {a.pourcentage} VMA
                          </p>
                          <h3 style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "2px" }}>{a.nom}</h3>
                          <p style={{ fontSize: "12px", color: "#555" }}>{a.description}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: "22px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                            {kmhToMinKm(a.vitesseMin)}
                          </p>
                          <p style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>→ {kmhToMinKm(a.vitesseMax)}</p>
                          <p style={{ fontSize: "10px", color: "#333", marginTop: "2px" }}>
                            {a.vitesseMin.toFixed(1)} – {a.vitesseMax.toFixed(1)} km/h
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!allures && (
              <div style={{ border: "1px solid #1a1a1a", borderRadius: "2px", padding: "40px", textAlign: "center" }}>
                <p style={{ color: "#d4f044", fontSize: "24px", marginBottom: "12px" }}>⚡</p>
                <p style={{ color: "#555", fontSize: "13px", letterSpacing: "0.05em" }}>
                  Renseigne ta VMA pour voir tes allures personnalisées.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}