"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

function extraireDuree(seance: string): number {
  const match = seance.match(/(\d+)['']/)
  return match ? parseInt(match[1]) : 30
}

const programmes: Record<string, { nom: string; semaines: { jour: string; seance: string; couleur: string }[][] }> = {
  "1001": {
    nom: "Magda",
    semaines: [
      [ // S1
        { jour: "Lundi", seance: "5'M - 10x1'C (R: 1') - 5'M", couleur: "#0e9aa7" },
        { jour: "Mercredi", seance: "5'M - 10x1'C (R: 1') - 5'M", couleur: "#0e9aa7" },
        { jour: "Samedi", seance: "10'M - 5x2'C (R: 1') - 10'M", couleur: "#0e9aa7" },
      ],
      [ // S2
        { jour: "Lundi", seance: "5'M - 10x1'C (R: 30'') - 5'M", couleur: "#4caf50" },
        { jour: "Mercredi", seance: "5'M - 10x1'C (R: 30'') - 5'M", couleur: "#4caf50" },
        { jour: "Samedi", seance: "10'M - 5x2' (R: 30'') - 10'M", couleur: "#4caf50" },
      ],
      [ // S3
        { jour: "Lundi", seance: "5'C - 10x1'C (R: 1') - 5'C", couleur: "#0e9aa7" },
        { jour: "Mercredi", seance: "5'C - 5x2'C (R: 1') - 5'C", couleur: "#f47920" },
        { jour: "Samedi", seance: "20'C", couleur: "#4caf50" },
      ],
      [ // S4
        { jour: "Lundi", seance: "5'C - 5x2'C (R: 30'') - 5'C", couleur: "#f47920" },
        { jour: "Mercredi", seance: "5'C - 6x3'C (R: 1'30) - 5'C", couleur: "#f47920" },
        { jour: "Samedi", seance: "20'C", couleur: "#4caf50" },
      ],
      [ // S5
        { jour: "Lundi", seance: "5'C - 6x3'C (R: 30'') - 5'C", couleur: "#e53935" },
        { jour: "Mercredi", seance: "5'C - 6x3'C (R: 1') - 5'C", couleur: "#e53935" },
        { jour: "Samedi", seance: "25'C", couleur: "#4caf50" },
      ],
      [ // S6
        { jour: "Lundi", seance: "10'C - 10x1'C (R: 1') - 5'C", couleur: "#0e9aa7" },
        { jour: "Mercredi", seance: "10'C - 5x2'C (R: 1') - 5'C", couleur: "#0e9aa7" },
        { jour: "Samedi", seance: "25'C", couleur: "#4caf50" },
      ],
      [ // S7
        { jour: "Lundi", seance: "20'C - 10'M", couleur: "#4caf50" },
        { jour: "Mercredi", seance: "10'C - 5x2'C (R: 1') - 10'C", couleur: "#f47920" },
        { jour: "Samedi", seance: "30'C", couleur: "#4caf50" },
      ],
      [ // S8
        { jour: "Lundi", seance: "10'C - 2x(10x30''C (R: 1')) - 5'C", couleur: "#e53935" },
        { jour: "Mercredi", seance: "25'C", couleur: "#4caf50" },
        { jour: "Samedi", seance: "30'C", couleur: "#4caf50" },
      ],
      [ // S9
        { jour: "Lundi", seance: "10'C - 2x5'C (R: 2') - 10'C", couleur: "#f47920" },
        { jour: "Mercredi", seance: "10'C - 6x3'C (R: 1'30) - 10'C", couleur: "#f47920" },
        { jour: "Samedi", seance: "40'C", couleur: "#4caf50" },
      ],
    ],
  },
  "1002": {
    nom: "Julie",
    semaines: [
      [{ jour: "Mardi", seance: "20' C", couleur: "#4caf50" }, { jour: "Jeudi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "10'C - 15x30''/30'' - 5'C", couleur: "#e53935" }],
      [{ jour: "Mardi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "15'C - 6x2'30 C r : 1'30", couleur: "#f47920" }],
      [{ jour: "Mardi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "40' C", couleur: "#4caf50" }],
      [{ jour: "Mardi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "15' C - 15x30''/30'' - 10'C", couleur: "#e53935" }],
      [{ jour: "Mardi", seance: "30' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "40' C", couleur: "#4caf50" }, { jour: "Samedi", seance: "40' C", couleur: "#0e9aa7" }],
      [{ jour: "Mardi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "15' C - 10x2' C r : 1' - 5' C", couleur: "#f47920" }],
      [{ jour: "Mardi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "15'C - 5x4' (progressif de 1 à 4) r : 2' - 5' C", couleur: "#f47920" }],
      [{ jour: "Mardi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "40' C", couleur: "#4caf50" }],
      [{ jour: "Mardi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Jeudi", seance: "40' C", couleur: "#0e9aa7" }, { jour: "Samedi", seance: "20' C - 4x5' C r : 2'30 - 10' C", couleur: "#f47920" }],
    ],
  },
}

export default function Dashboard() {
  const params = useSearchParams()
  const router = useRouter()
  const id = params.get("id")
  const coureur = programmes[id || ""]
  const [autorise, setAutorise] = useState(false)
  const [semaine, setSemaine] = useState(0)
  const [faites, setFaites] = useState<Record<number, number[]>>({})
  const [rpe, setRpe] = useState<Record<string, number>>({})
  const [km, setKm] = useState<Record<string, string>>({})
  const [minutes, setMinutes] = useState<Record<string, string>>({})
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const sessionId = sessionStorage.getItem("coureur_id")
    if (!sessionId || sessionId !== id) {
      router.push("/login")
      return
    }
    setAutorise(true)
    chargerTout()
  }, [id])

  const chargerTout = async () => {
    const [progRes, rpeRes, kmRes] = await Promise.all([
      supabase.from("progression").select("semaine, seance_index").eq("coureur_id", id),
      supabase.from("rpe").select("semaine, seance_index, valeur").eq("coureur_id", id),
      supabase.from("kilometres").select("semaine, seance_index, km, minutes").eq("coureur_id", id),
    ])

    if (!progRes.error && progRes.data) {
      const result: Record<number, number[]> = {}
      progRes.data.forEach(({ semaine, seance_index }: any) => {
        if (!result[semaine]) result[semaine] = []
        result[semaine].push(seance_index)
      })
      setFaites(result)
    }

    if (!rpeRes.error && rpeRes.data) {
      const result: Record<string, number> = {}
      rpeRes.data.forEach(({ semaine, seance_index, valeur }: any) => {
        result[`${semaine}_${seance_index}`] = valeur
      })
      setRpe(result)
    }

    if (!kmRes.error && kmRes.data) {
      const kmResult: Record<string, string> = {}
      const minResult: Record<string, string> = {}
      kmRes.data.forEach(({ semaine, seance_index, km, minutes }: any) => {
        const key = `${semaine}_${seance_index}`
        if (km !== null && km !== undefined) kmResult[key] = km.toString()
        if (minutes !== null && minutes !== undefined) minResult[key] = minutes.toString()
      })
      setKm(kmResult)
      setMinutes(minResult)
    }

    setChargement(false)
  }

  const toggleSeance = async (index: number) => {
    const current = faites[semaine] || []
    const dejaCochee = current.includes(index)
    if (dejaCochee) {
      const { error } = await supabase.from("progression").delete()
        .eq("coureur_id", id).eq("semaine", semaine).eq("seance_index", index)
      if (!error) setFaites({ ...faites, [semaine]: current.filter(i => i !== index) })
    } else {
      const { error } = await supabase.from("progression").upsert({
        coureur_id: id, semaine, seance_index: index
      })
      if (!error) setFaites({ ...faites, [semaine]: [...current, index] })
    }
  }

  const setRpeValue = async (key: string, value: number) => {
    const [semaineStr, indexStr] = key.split("_")
    const semaineNum = parseInt(semaineStr)
    const indexNum = parseInt(indexStr)
    if (value === 0) {
      const { error } = await supabase.from("rpe").delete()
        .eq("coureur_id", id).eq("semaine", semaineNum).eq("seance_index", indexNum)
      if (!error) {
        const updated = { ...rpe }
        delete updated[key]
        setRpe(updated)
      }
    } else {
const { error } = await supabase.from("rpe").upsert({
  coureur_id: id, semaine: semaineNum, seance_index: indexNum, valeur: value,
}, { onConflict: "coureur_id,semaine,seance_index" })
      if (!error) setRpe({ ...rpe, [key]: value })
    }
  }

const sauvegarderKilometres = async (key: string, kmVal: string, minVal: string) => {
  const [semaineStr, indexStr] = key.split("_")
  const payload = {
    coureur_id: id,
    semaine: parseInt(semaineStr),
    seance_index: parseInt(indexStr),
    km: parseFloat(kmVal) || null,
    minutes: parseFloat(minVal) || null,
  }
  console.log("Sauvegarde:", payload)
  const { data, error } = await supabase
    .from("kilometres")
    .upsert(payload, { onConflict: "coureur_id,semaine,seance_index" })
    .select()
  console.log("Résultat:", data, "Erreur:", error)
}

  const setKmValue = (key: string, val: string) => {
    const newKm = { ...km, [key]: val }
    setKm(newKm)
    sauvegarderKilometres(key, val, minutes[key] || "")
  }

  const setMinValue = (key: string, val: string) => {
    const newMin = { ...minutes, [key]: val }
    setMinutes(newMin)
    sauvegarderKilometres(key, km[key] || "", val)
  }

  if (!autorise) return null

  if (!coureur) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", fontFamily: FONT }}>
        <p style={{ color: "#666", fontSize: "14px" }}>Identifiant inconnu.</p>
        <button onClick={() => { sessionStorage.removeItem("coureur_id"); router.push("/login") }}
          style={{ padding: "14px 32px", background: "#d4f044", color: "#0a0a0a", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
          Retour
        </button>
      </main>
    )
  }

  const seancesDuJour = coureur.semaines[semaine]
  const faitesSemaine = faites[semaine] || []
  const progression = Math.round((faitesSemaine.length / seancesDuJour.length) * 100)
  const totalSeances = coureur.semaines.reduce((acc, s) => acc + s.length, 0)
  const totalFaites = Object.values(faites).reduce((acc, arr) => acc + arr.length, 0)
  const progressionGlobale = Math.round((totalFaites / totalSeances) * 100)

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: FONT, color: "#ffffff" }}>

      <style>{`
        .input-min:focus { border-bottom-color: #d4f044 !important; }
        .rpe-btn:hover { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <svg width="140" height="28" viewBox="0 0 140 28">
          <text y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="24" fontWeight="700" letterSpacing="0.2em">
            <tspan fill="#ffffff">CAR</tspan><tspan fill="#d4f044">RUN</tspan>
          </text>
        </svg>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push(`/profil?id=${id}`)}
            style={{ background: "none", border: "1px solid #333", color: "#999", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Mon profil
          </button>
          <button onClick={() => router.push(`/charge?id=${id}`)}
            style={{ background: "none", border: "1px solid #333", color: "#999", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Charge
          </button>
          <button onClick={() => router.push(`/carte?id=${id}`)}
            style={{ background: "none", border: "1px solid #333", color: "#999", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Ma carte
          </button>
          <button onClick={() => router.push("/allures")}
            style={{ background: "none", border: "1px solid #333", color: "#999", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Les allures
          </button>
          <button onClick={() => { sessionStorage.removeItem("coureur_id"); router.push("/login") }}
            style={{ background: "none", border: "1px solid #333", color: "#666", padding: "8px 16px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Bandeau image */}
      <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.4), rgba(10,10,10,0.95))" }} />
        <div style={{ position: "absolute", bottom: "24px", left: "40px" }}>
          <p style={{ fontSize: "11px", color: "#d4f044", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>Plan 9 semaines</p>
          <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Bonjour, {coureur.nom}.</h1>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 40px" }}>
        {chargement ? (
          <p style={{ color: "#555", fontSize: "14px", textAlign: "center" }}>Chargement...</p>
        ) : (
          <>
            {/* Progression globale */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Progression globale</span>
                <span style={{ fontSize: "11px", color: "#d4f044", fontWeight: 700 }}>{progressionGlobale}%</span>
              </div>
              <div style={{ height: "2px", background: "#1a1a1a", borderRadius: "1px", overflow: "hidden" }}>
                <div style={{ width: `${progressionGlobale}%`, height: "100%", background: "#d4f044", transition: "width 0.4s ease" }} />
              </div>
            </div>

            {/* Navigation semaines */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "48px", flexWrap: "wrap" }}>
              {coureur.semaines.map((s, i) => {
                const f = faites[i] || []
                const done = f.length === s.length
                const active = i === semaine
                return (
                  <button key={i} onClick={() => setSemaine(i)}
                    style={{ padding: "8px 14px", background: active ? "#d4f044" : done ? "#1a1a1a" : "transparent", color: active ? "#0a0a0a" : done ? "#d4f044" : "#555", border: active ? "1px solid #d4f044" : done ? "1px solid #d4f044" : "1px solid #2a2a2a", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                    S{i + 1}{done && !active ? " ✓" : ""}
                  </button>
                )
              })}
            </div>

            {/* Titre semaine */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em" }}>Semaine {semaine + 1}</h2>
              <span style={{ fontSize: "11px", color: progression === 100 ? "#d4f044" : "#555", fontWeight: 600 }}>{progression}% réalisé</span>
            </div>

            <div style={{ height: "2px", background: "#1a1a1a", borderRadius: "1px", overflow: "hidden", marginBottom: "32px" }}>
              <div style={{ width: `${progression}%`, height: "100%", background: "#d4f044", transition: "width 0.4s ease" }} />
            </div>

            {/* Séances */}
            {seancesDuJour.map((s, index) => {
              const key = `${semaine}_${index}`
              const coche = faitesSemaine.includes(index)
              const rpeVal = rpe[key] || 0
              const dureeEstimee = extraireDuree(s.seance)
              const dureeReelle = parseFloat(minutes[key]) || dureeEstimee
              const charge = rpeVal > 0 ? Math.round(rpeVal * dureeReelle) : 0

              return (
                <div key={index} style={{ marginBottom: "12px" }}>

                  {/* Ligne séance */}
                  <div
                    onClick={() => toggleSeance(index)}
                    style={{
                      display: "flex", alignItems: "center", gap: "20px",
                      padding: "20px 24px",
                      background: coche ? "#111" : s.couleur,
                      borderRadius: coche ? "4px 4px 0 0" : "4px",
                      border: coche ? "1px solid #2a2a2a" : "none",
                      borderBottom: coche ? "none" : undefined,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity: 1,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <div style={{
                      width: "20px", height: "20px", flexShrink: 0,
                      border: coche ? "2px solid #d4f044" : "2px solid rgba(255,255,255,0.6)",
                      borderRadius: "50%",
                      background: coche ? "#d4f044" : "transparent",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {coche && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "10px", color: coche ? "#555" : "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                        {s.jour}
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: coche ? "#555" : "#ffffff", textDecoration: coche ? "line-through" : "none", transition: "all 0.2s" }}>
                        {s.seance}
                      </p>
                    </div>
                    <span style={{ fontSize: "11px", color: coche ? "#333" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>0{index + 1}</span>
                  </div>

                  {/* Panel RPE + km + min */}
                  {coche && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ background: "#111", border: "1px solid #2a2a2a", borderTop: "1px solid #1a1a1a", borderRadius: "0 0 4px 4px", padding: "20px 24px" }}
                    >
                      {/* RPE */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <p style={{ fontSize: "10px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            RPE {rpeVal > 0 ? `— ${rpeVal}/10` : ""}
                          </p>
                          {charge > 0 && (
                            <span style={{ fontSize: "12px", color: "#d4f044", fontWeight: 700 }}>
                              Charge : {charge}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                            <button
                              key={val}
                              className="rpe-btn"
                              onClick={e => {
                                e.stopPropagation()
                                setRpeValue(key, val === rpeVal ? 0 : val)
                              }}
                              style={{
                                flex: 1, padding: "9px 0",
                                background: rpeVal >= val
                                  ? val <= 3 ? "#0e9aa7"
                                  : val <= 5 ? "#4caf50"
                                  : val <= 7 ? "#f47920"
                                  : "#e53935"
                                  : "#1a1a1a",
                                border: "none", borderRadius: "2px",
                                color: rpeVal >= val ? "#fff" : "#333",
                                fontSize: "11px", fontWeight: 700,
                                cursor: "pointer", transition: "all 0.15s",
                              }}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                          <span style={{ fontSize: "10px", color: "#333" }}>Très facile</span>
                          <span style={{ fontSize: "10px", color: "#333" }}>Maximal</span>
                        </div>
                      </div>

                      {/* Km + Minutes */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div>
                          <label style={{ fontSize: "10px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                            Kilomètres
                          </label>
                          <input
                            className="input-min"
                            type="number"
                            value={km[key] || ""}
                            onChange={e => {
                              e.stopPropagation()
                              setKmValue(key, e.target.value)
                            }}
                            onClick={e => e.stopPropagation()}
                            placeholder="0.0"
                            style={{ width: "100%", padding: "8px 0", background: "transparent", border: "none", borderBottom: "1px solid #333", color: "#fff", fontSize: "16px", fontWeight: 700, outline: "none", boxSizing: "border-box", fontFamily: FONT, transition: "border-color 0.2s" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                            Minutes
                          </label>
                          <input
                            className="input-min"
                            type="number"
                            value={minutes[key] || ""}
                            onChange={e => {
                              e.stopPropagation()
                              setMinValue(key, e.target.value)
                            }}
                            onClick={e => e.stopPropagation()}
                            placeholder="0"
                            style={{ width: "100%", padding: "8px 0", background: "transparent", border: "none", borderBottom: "1px solid #333", color: "#fff", fontSize: "16px", fontWeight: 700, outline: "none", boxSizing: "border-box", fontFamily: FONT, transition: "border-color 0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Message semaine complétée */}
            {faitesSemaine.length === seancesDuJour.length && (
              <div style={{ marginTop: "40px", padding: "28px", border: "1px solid #d4f044", borderRadius: "2px", textAlign: "center" }}>
                <p style={{ color: "#d4f044", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
                  Semaine {semaine + 1} complétée{semaine < 8 ? ` — Passe à la semaine ${semaine + 2}` : " — Plan terminé, bravo !"}
                </p>
              </div>
            )}

            {/* Navigation bas */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "48px" }}>
              <button onClick={() => setSemaine(s => Math.max(0, s - 1))} disabled={semaine === 0}
                style={{ background: "none", border: "1px solid #2a2a2a", color: semaine === 0 ? "#2a2a2a" : "#666", padding: "12px 24px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: semaine === 0 ? "default" : "pointer" }}>
                ← Semaine précédente
              </button>
              <button onClick={() => setSemaine(s => Math.min(8, s + 1))} disabled={semaine === 8}
                style={{ background: "none", border: "1px solid #2a2a2a", color: semaine === 8 ? "#2a2a2a" : "#666", padding: "12px 24px", borderRadius: "2px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: semaine === 8 ? "default" : "pointer" }}>
                Semaine suivante →
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}