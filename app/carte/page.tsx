"use client"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const DISTANCE_TOTALE = 700

const ETAPES = [
  { nom: "Lyon", lat: 45.748, lng: 4.847 },
  { nom: "Dijon", lat: 47.322, lng: 5.041 },
  { nom: "Nancy", lat: 48.692, lng: 6.184 },
  { nom: "Luxembourg", lat: 49.611, lng: 6.132 },
  { nom: "Liège", lat: 50.633, lng: 5.567 },
  { nom: "Bruxelles", lat: 50.846, lng: 4.352 },
  { nom: "Anvers", lat: 51.221, lng: 4.400 },
  { nom: "Amsterdam", lat: 52.370, lng: 4.895 },
]

function latLngToSVG(lat: number, lng: number): { x: number; y: number } {
  const minLat = 44.5, maxLat = 53.5
  const minLng = 2.5, maxLng = 8.0
  const x = ((lng - minLng) / (maxLng - minLng)) * 600 + 20
  const y = ((maxLat - lat) / (maxLat - minLat)) * 400 + 10
  return { x, y }
}

function getPointOnPath(progress: number): { lat: number; lng: number } {
  if (progress <= 0) return ETAPES[0]
  if (progress >= 1) return ETAPES[ETAPES.length - 1]
  const totalSegments = ETAPES.length - 1
  const segment = progress * totalSegments
  const segIndex = Math.floor(segment)
  const segProgress = segment - segIndex
  const from = ETAPES[Math.min(segIndex, ETAPES.length - 1)]
  const to = ETAPES[Math.min(segIndex + 1, ETAPES.length - 1)]
  return {
    lat: from.lat + (to.lat - from.lat) * segProgress,
    lng: from.lng + (to.lng - from.lng) * segProgress,
  }
}

function CarteInner() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get("id")
  const [autorise, setAutorise] = useState(false)
  const [km, setKm] = useState<Record<string, string>>({})
  const [minutes, setMinutes] = useState<Record<string, string>>({})
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const sessionId = sessionStorage.getItem("coureur_id")
    if (!sessionId || sessionId !== id) {
      router.push("/login")
    } else {
      setAutorise(true)
      chargerKm()
    }
  }, [id])

  const chargerKm = async () => {
    const { data, error } = await supabase
      .from("kilometres")
      .select("semaine, seance_index, km, minutes")
      .eq("coureur_id", id)

    if (!error && data) {
      const kmResult: Record<string, string> = {}
      const minResult: Record<string, string> = {}
      data.forEach(({ semaine, seance_index, km, minutes }: any) => {
        const key = `${semaine}_${seance_index}`
        if (km) kmResult[key] = km.toString()
        if (minutes) minResult[key] = minutes.toString()
      })
      setKm(kmResult)
      setMinutes(minResult)
    }
    setChargement(false)
  }

  if (!autorise) return null

  const totalKm = Object.values(km).reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalMin = Object.values(minutes).reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
  const totalH = Math.floor(totalMin / 60)
  const restMin = Math.round(totalMin % 60)
  const progression = Math.min(totalKm / DISTANCE_TOTALE, 1)
  const posActuelle = getPointOnPath(progression)
  const etapeActuelle = ETAPES[Math.min(Math.floor(progression * (ETAPES.length - 1)), ETAPES.length - 1)]
  const etapesSVG = ETAPES.map(e => latLngToSVG(e.lat, e.lng))
  const pathD = etapesSVG.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const posActuelleSVG = latLngToSVG(posActuelle.lat, posActuelle.lng)

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: FONT, color: "#ffffff" }}>
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

      <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1502224562085-639556652f33?w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.95))" }} />
        <div style={{ position: "absolute", bottom: "24px", left: "40px" }}>
          <p style={{ fontSize: "11px", color: "#d4f044", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>Mon aventure</p>
          <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em" }}>Lyon → Amsterdam.</h1>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 40px" }}>
        {chargement ? (
          <p style={{ color: "#555", fontSize: "14px", textAlign: "center" }}>Chargement...</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
              {[
                { label: "Kilomètres", valeur: `${totalKm.toFixed(1)} km` },
                { label: "Temps total", valeur: `${totalH}h${restMin.toString().padStart(2, "0")}` },
                { label: "Progression", valeur: `${Math.round(progression * 100)}%` },
              ].map((s, i) => (
                <div key={i} style={{ background: "#111", padding: "20px", borderRadius: "2px", borderBottom: "2px solid #d4f044" }}>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{s.valeur}</p>
                  <p style={{ fontSize: "10px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#555", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Progression du trajet</p>
                  <p style={{ fontSize: "13px", color: "#888" }}>
                    Actuellement à <span style={{ color: "#d4f044", fontWeight: 700 }}>{etapeActuelle.nom}</span>
                  </p>
                </div>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "#d4f044", letterSpacing: "-0.02em" }}>
                  {Math.round(progression * 100)}%
                </p>
              </div>

              <div style={{ position: "relative", height: "12px", background: "#1a1a1a", borderRadius: "6px", marginBottom: "20px" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${progression * 100}%`,
                  background: "linear-gradient(to right, #0e9aa7, #4caf50, #d4f044)",
                  borderRadius: "6px", transition: "width 0.8s ease",
                  boxShadow: "0 0 12px rgba(212,240,68,0.3)",
                }} />
                {progression > 0 && (
                  <div style={{
                    position: "absolute", top: "50%", left: `${progression * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: "20px", height: "20px",
                    background: "#d4f044", borderRadius: "50%",
                    border: "3px solid #0a0a0a",
                    boxShadow: "0 0 0 3px rgba(212,240,68,0.3)",
                    transition: "left 0.8s ease", zIndex: 2,
                  }} />
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {ETAPES.map((e, i) => {
                  const pos = i / (ETAPES.length - 1)
                  const passed = progression >= pos
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: passed ? "#d4f044" : "#2a2a2a", transition: "background 0.4s" }} />
                      <span style={{ fontSize: "9px", color: passed ? "#d4f044" : "#333", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {e.nom}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", color: "#555", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                Carte du trajet
              </p>
              <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid #1a1a1a" }}>
                <img
                  src="https://staticmap.openstreetmap.de/staticmap.php?center=49.0,5.2&zoom=6&size=640x420&maptype=mapnik"
                  alt="Carte Lyon Amsterdam"
                  style={{ width: "100%", height: "420px", objectFit: "cover", display: "block", filter: "invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.8)" }}
                />
                <svg viewBox="0 0 640 420"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                  <defs>
                    <linearGradient id="trailGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#0e9aa7" />
                      <stop offset="50%" stopColor="#4caf50" />
                      <stop offset="100%" stopColor="#d4f044" />
                    </linearGradient>
                  </defs>
                  <path d={pathD} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeDasharray="6 4" />
                  {progression > 0 && (
                    <path
                      d={etapesSVG.slice(0, Math.min(Math.ceil(progression * (ETAPES.length - 1)) + 1, ETAPES.length)).map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
                      fill="none" stroke="url(#trailGrad)" strokeWidth="4" strokeLinecap="round"
                    />
                  )}
                  {etapesSVG.map((p, i) => {
                    const pos = i / (ETAPES.length - 1)
                    const passed = progression >= pos
                    return (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="5" fill={passed ? "#d4f044" : "#333"} stroke={passed ? "#0a0a0a" : "#555"} strokeWidth="1.5" />
                        <text x={p.x + 8} y={p.y + 4} fill={passed ? "#d4f044" : "#666"} fontSize="9" fontFamily={FONT} fontWeight="700">
                          {ETAPES[i].nom}
                        </text>
                      </g>
                    )
                  })}
                  {progression > 0 && (
                    <g>
                      <circle cx={posActuelleSVG.x} cy={posActuelleSVG.y} r="10" fill="#d4f044" opacity="0.2">
                        <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={posActuelleSVG.x} cy={posActuelleSVG.y} r="6" fill="#d4f044" stroke="#0a0a0a" strokeWidth="2" />
                      <rect x={posActuelleSVG.x - 22} y={posActuelleSVG.y - 28} width="44" height="16" rx="3" fill="#0a0a0a" stroke="#d4f044" strokeWidth="1" opacity="0.95" />
                      <text x={posActuelleSVG.x} y={posActuelleSVG.y - 16} textAnchor="middle" fill="#d4f044" fontSize="9" fontFamily={FONT} fontWeight="700">
                        {totalKm.toFixed(0)} km
                      </text>
                    </g>
                  )}
                </svg>
              </div>
              <p style={{ fontSize: "11px", color: "#333", marginTop: "8px", textAlign: "center" }}>
                © OpenStreetMap contributors
              </p>
            </div>

            {progression >= 1 && (
              <div style={{ padding: "32px", border: "1px solid #d4f044", borderRadius: "2px", textAlign: "center" }}>
                <p style={{ fontSize: "24px", marginBottom: "8px" }}>🎉</p>
                <p style={{ color: "#d4f044", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
                  Amsterdam atteint ! Félicitations !
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function Carte() {
  return (
    <Suspense fallback={<div style={{ background: "#0a0a0a", minHeight: "100vh" }} />}>
      <CarteInner />
    </Suspense>
  )
}