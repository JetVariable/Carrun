"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const NB_SEMAINES = 9

function extraireDuree(seance: string): number {
  const match = seance.match(/(\d+)['']/)
  return match ? parseInt(match[1]) : 30
}

const seancesParSemaine = [
  [{ jour: "Lundi", seance: "5'M - 10x1'C (R: 1') - 5'M" }, { jour: "Mercredi", seance: "5'M - 10x1'C (R: 1') - 5'M" }, { jour: "Samedi", seance: "10'M - 5x2'C (R: 1') - 10'M" }],
  [{ jour: "Lundi", seance: "5'M - 10x1'C (R: 30'') - 5'M" }, { jour: "Mercredi", seance: "5'M - 10x1'C (R: 30'') - 5'M" }, { jour: "Samedi", seance: "10'M - 5x2' (R: 30'') - 10'M" }],
  [{ jour: "Lundi", seance: "5'C - 10x1'C (R: 1') - 5'C" }, { jour: "Mercredi", seance: "5'C - 5x2'C (R: 1') - 5'C" }, { jour: "Samedi", seance: "20'C" }],
  [{ jour: "Lundi", seance: "5'C - 5x2'C (R: 30'') - 5'C" }, { jour: "Mercredi", seance: "5'C - 6x3'C (R: 1'30) - 5'C" }, { jour: "Samedi", seance: "20'C" }],
  [{ jour: "Lundi", seance: "5'C - 6x3'C (R: 30'') - 5'C" }, { jour: "Mercredi", seance: "5'C - 6x3'C (R: 1') - 5'C" }, { jour: "Samedi", seance: "25'C" }],
  [{ jour: "Lundi", seance: "10'C - 10x1'C (R: 1') - 5'C" }, { jour: "Mercredi", seance: "10'C - 5x2'C (R: 1') - 5'C" }, { jour: "Samedi", seance: "25'C" }],
  [{ jour: "Lundi", seance: "20'C - 10'M" }, { jour: "Mercredi", seance: "10'C - 5x2'C (R: 1') - 10'C" }, { jour: "Samedi", seance: "30'C" }],
  [{ jour: "Lundi", seance: "10'C - 2x(10x30''C (R: 1')) - 5'C" }, { jour: "Mercredi", seance: "25'C" }, { jour: "Samedi", seance: "30'C" }],
  [{ jour: "Lundi", seance: "10'C - 2x5'C (R: 2') - 10'C" }, { jour: "Mercredi", seance: "10'C - 6x3'C (R: 1'30) - 10'C" }, { jour: "Samedi", seance: "40'C" }],
]

function couleurCharge(charge: number): string {
  if (charge === 0) return "#2a2a2a"
  if (charge < 200) return "#0e9aa7"
  if (charge < 450) return "#4caf50"
  return "#e53935"
}

function niveauCharge(charge: number): string {
  if (charge === 0) return "—"
  if (charge < 200) return "Faible"
  if (charge < 450) return "Optimale"
  return "Surentraînement"
}

export default function Charge() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get("id")
  const [autorise, setAutorise] = useState(false)
  const [rpe, setRpe] = useState<Record<string, number>>({})
  const [minutes, setMinutes] = useState<Record<string, number>>({})
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const sessionId = sessionStorage.getItem("coureur_id")
    if (!sessionId || sessionId !== id) {
      router.push("/login")
    } else {
      setAutorise(true)
      chargerDonnees()
    }
  }, [id])

  const chargerDonnees = async () => {
    const [rpeRes, kmRes] = await Promise.all([
      supabase.from("rpe").select("semaine, seance_index, valeur").eq("coureur_id", id),
      supabase.from("kilometres").select("semaine, seance_index, minutes").eq("coureur_id", id),
    ])

    if (!rpeRes.error && rpeRes.data) {
      const result: Record<string, number> = {}
      rpeRes.data.forEach(({ semaine, seance_index, valeur }: any) => {
        result[`${semaine}_${seance_index}`] = valeur
      })
      setRpe(result)
    }

    if (!kmRes.error && kmRes.data) {
      const result: Record<string, number> = {}
      kmRes.data.forEach(({ semaine, seance_index, minutes }: any) => {
        if (minutes) result[`${semaine}_${seance_index}`] = minutes
      })
      setMinutes(result)
    }

    setChargement(false)
  }

  if (!autorise) return null

  const chargesParSemaine = seancesParSemaine.map((seances, si) =>
    seances.reduce((total, s, ji) => {
      const key = `${si}_${ji}`
      const rpeVal = rpe[key] || 0
      const dureeReelle = minutes[key] || extraireDuree(s.seance)
      return total + rpeVal * dureeReelle
    }, 0)
  )

  const chargeTotal = chargesParSemaine.reduce((a, b) => a + b, 0)
  const maxCharge = Math.max(...chargesParSemaine, 500)

  const W = 560
  const H = 220
  const PAD = { top: 20, right: 20, bottom: 30, left: 48 }
  const graphW = W - PAD.left - PAD.right
  const graphH = H - PAD.top - PAD.bottom
  const maxY = Math.max(maxCharge * 1.2, 600)

  const points = chargesParSemaine.map((charge, i) => ({
    x: PAD.left + (i / (NB_SEMAINES - 1)) * graphW,
    y: PAD.top + graphH - (charge / maxY) * graphH,
    charge,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + graphH} L ${points[0].x} ${PAD.top + graphH} Z`
  const valToY = (val: number) => PAD.top + graphH - (val / maxY) * graphH

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: FONT, color: "#ffffff" }}>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <svg width="140" height="28" viewBox="0 0 140 28">
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

      {/* Bandeau image */}
      <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1527956041665-d7a1b380c460?w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center 50%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.95))" }} />
        <div style={{ position: "absolute", bottom: "24px", left: "40px" }}>
          <p style={{ fontSize: "11px", color: "#d4f044", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>Suivi</p>
          <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em" }}>Charge d'entraînement.</h1>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 40px" }}>

        {chargement ? (
          <p style={{ color: "#555", fontSize: "14px", textAlign: "center" }}>Chargement...</p>
        ) : (
          <>
            {/* Stats globales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
              {[
                { label: "Charge totale", valeur: chargeTotal.toString() },
                { label: "Semaine max", valeur: Math.max(...chargesParSemaine).toString() },
                { label: "Moyenne / semaine", valeur: Math.round(chargeTotal / NB_SEMAINES).toString() },
              ].map((s, i) => (
                <div key={i} style={{ background: "#111", padding: "20px", borderRadius: "2px", borderBottom: "2px solid #d4f044" }}>
                  <p style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{s.valeur}</p>
                  <p style={{ fontSize: "10px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Légende plages */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[
                { label: "Charge faible", couleur: "#0e9aa7" },
                { label: "Charge optimale", couleur: "#4caf50" },
                { label: "Surentraînement", couleur: "#e53935" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "24px", height: "4px", borderRadius: "2px", background: p.couleur }} />
                  <span style={{ fontSize: "11px", color: "#555", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* Graphique courbe SVG */}
            <div style={{ background: "#0d1117", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "16px", marginBottom: "48px", overflowX: "auto" }}>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>

                {/* Plage surentraînement */}
                <rect x={PAD.left} y={valToY(450)} width={graphW} height={Math.max(0, PAD.top - valToY(450) + graphH + PAD.bottom - (H - valToY(450)))} fill="#e53935" opacity="0.06" />
                {/* Plage optimale */}
                <rect x={PAD.left} y={valToY(450)} width={graphW} height={valToY(200) - valToY(450)} fill="#4caf50" opacity="0.06" />
                {/* Plage faible */}
                <rect x={PAD.left} y={valToY(200)} width={graphW} height={valToY(0) - valToY(200)} fill="#0e9aa7" opacity="0.06" />

                {/* Lignes de seuil */}
                <line x1={PAD.left} y1={valToY(450)} x2={PAD.left + graphW} y2={valToY(450)} stroke="#e53935" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                <line x1={PAD.left} y1={valToY(200)} x2={PAD.left + graphW} y2={valToY(200)} stroke="#0e9aa7" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

                {/* Labels seuils */}
                <text x={PAD.left - 4} y={valToY(450) + 4} textAnchor="end" fill="#e53935" fontSize="9" fontFamily={FONT} opacity="0.7">450</text>
                <text x={PAD.left - 4} y={valToY(200) + 4} textAnchor="end" fill="#0e9aa7" fontSize="9" fontFamily={FONT} opacity="0.7">200</text>

                {/* Grille horizontale */}
                {[0, 100, 200, 300, 400, 500].map(val => (
                  <line key={val} x1={PAD.left} y1={valToY(val)} x2={PAD.left + graphW} y2={valToY(val)} stroke="#1a1a1a" strokeWidth="1" />
                ))}

                {/* Aire sous la courbe */}
                {chargeTotal > 0 && (
                  <path d={areaPath} fill="#d4f044" opacity="0.04" />
                )}

                {/* Courbe */}
                {chargeTotal > 0 && (
                  <path d={linePath} fill="none" stroke="#d4f044" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Points */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4"
                      fill={p.charge > 0 ? couleurCharge(p.charge) : "#2a2a2a"}
                      stroke="#0a0a0a" strokeWidth="1.5" />
                    <text x={p.x} y={PAD.top + graphH + 18} textAnchor="middle" fill="#555" fontSize="9" fontFamily={FONT} fontWeight="600">S{i + 1}</text>
                    {p.charge > 0 && (
                      <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#d4f044" fontSize="9" fontFamily={FONT} fontWeight="700">{Math.round(p.charge)}</text>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Tableau récap */}
            <div>
              <p style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" }}>
                Récapitulatif par semaine
              </p>
              {chargesParSemaine.map((charge, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ fontSize: "11px", color: "#555", fontWeight: 700, width: "32px", flexShrink: 0 }}>S{i + 1}</span>
                  <div style={{ flex: 1, height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: charge > 0 ? `${(charge / maxY) * 100}%` : "0%", height: "100%", background: couleurCharge(charge), transition: "width 0.4s ease" }} />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", width: "56px", textAlign: "right", flexShrink: 0 }}>{Math.round(charge)}</span>
                  <span style={{ fontSize: "11px", color: couleurCharge(charge), fontWeight: 600, width: "120px", textAlign: "right", flexShrink: 0 }}>{niveauCharge(charge)}</span>
                </div>
              ))}
            </div>

            {/* Message si pas de données */}
            {chargeTotal === 0 && (
              <div style={{ marginTop: "40px", padding: "32px", border: "1px solid #1a1a1a", borderRadius: "2px", textAlign: "center" }}>
                <p style={{ color: "#333", fontSize: "13px" }}>
                  Coche tes séances et renseigne le RPE et les minutes dans le programme pour voir ta charge ici.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}