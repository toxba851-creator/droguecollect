import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from './supabaseClient';

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const T = {
  fr: {
    appName: "DrogueCollect",
    tagline: "Votre santé, en toute confidentialité",
    subtitle: "Contribuez anonymement à la recherche en santé publique au Sénégal",
    start: "Commencer",
    guestMode: "Mode invité (sans compte)",
    login: "Se connecter",
    register: "Créer un compte",
    pseudo: "Pseudonyme",
    email: "Email (optionnel)",
    password: "Mot de passe",
    pseudoHint: "Aucun nom réel requis",
    continueBtn: "Continuer",
    backBtn: "Retour",
    submitBtn: "Soumettre",
    step: "Étape",
    of: "sur",
    history: "Mon historique",
    resources: "Ressources",
    dashboard: "Tableau de bord",
    logout: "Déconnexion",
    questionnaire: "Questionnaire",
    home: "Accueil",
    lang: "Wolof",
    privacyNote: "Toutes les données sont anonymes et chiffrées. Aucune donnée identifiable n'est collectée.",
    q1: "Quelle est votre tranche d'âge ?",
    q2: "Quelle est votre région ?",
    q3: "Quel est votre sexe ? (optionnel)",
    q4: "Quelles substances avez-vous consommées ?",
    q5: "Quelle est votre fréquence de consommation ?",
    q6: "Quel est le mode de consommation ?",
    q7: "Quelles sont les raisons de consommation ?",
    q8: "Quels effets avez-vous ressentis ?",
    q9: "Depuis combien de temps consommez-vous ?",
    q10: "Dans quel lieu consommez-vous principalement ?",
    q11: "Avez-vous accès aux soins de santé ?",
    q12: "Souhaitez-vous arrêter ou réduire votre consommation ?",
    ageRanges: ["Moins de 18 ans", "18-25 ans", "26-35 ans", "36-45 ans", "46-55 ans", "Plus de 55 ans"],
    regions: ["Dakar", "Thiès", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Louga", "Saint-Louis", "Matam", "Tambacounda", "Kédougou", "Kolda", "Sédhiou", "Ziguinchor"],
    genders: ["Homme", "Femme", "Non-binaire", "Préfère ne pas répondre"],
    substances: ["Cannabis / Yamba", "Alcool", "Tabac", "Cocaïne / Crack", "Héroïne", "Médicaments (détournement)", "Solvants / Inhalants", "Stimulants", "Autre"],
    frequencies: ["Occasionnellement (1x/mois)", "Hebdomadaire (1-3x/semaine)", "Fréquent (4-6x/semaine)", "Quotidien", "Plusieurs fois par jour"],
    modes: ["Inhalation / Fumée", "Injection", "Ingestion orale", "Sniff / Intranasal", "Autre"],
    reasons: ["Stress / Anxiété", "Douleur physique", "Loisir / Plaisir", "Pression sociale", "Dépression", "Insomnie", "Curiosité", "Dépendance", "Autre"],
    effects: ["Euphorie", "Relaxation", "Anxiété", "Troubles du sommeil", "Problèmes de santé", "Problèmes sociaux", "Dépendance ressentie", "Aucun effet notable"],
    durations: ["Moins de 6 mois", "6 mois à 1 an", "1 à 3 ans", "3 à 5 ans", "Plus de 5 ans"],
    places: ["À domicile", "Dans la rue", "Entre amis", "En boîte / Bar", "Lieu de travail", "Autre"],
    accessOptions: ["Oui, facilement", "Oui, mais difficilement", "Non, pas accès", "Je ne cherche pas de soins"],
    stopOptions: ["Oui, je veux arrêter", "Oui, je veux réduire", "Non, je ne veux pas changer", "Je ne sais pas"],
    thankYou: "Merci pour votre contribution !",
    thankYouSub: "Vos données aident à améliorer la santé publique au Sénégal.",
    noHistory: "Aucune soumission pour le moment.",
    submittedOn: "Soumis le",
    viewDetails: "Voir détails",
    adminTitle: "Tableau de Bord Administrateur",
    adminSub: "Données agrégées et anonymisées",
    totalSubmissions: "Soumissions totales",
    thisMonth: "Ce mois",
    regions_stat: "Régions couvertes",
    substances_stat: "Substances répertoriées",
    exportCSV: "Exporter CSV",
    ageDistrib: "Distribution par âge",
    substanceDistrib: "Substances consommées",
    regionDistrib: "Par région",
    trendsTitle: "Tendances temporelles",
    centerTitle: "Centres d'aide",
    centerSub: "Trouver un centre près de vous",
    filterRegion: "Filtrer par région",
    allRegions: "Toutes les régions",
    emergencyTitle: "Numéros d'urgence",
    riskReduction: "Réduction des risques",
    riskText: "Informations pratiques pour réduire les risques liés à la consommation de substances.",
    adminLogin: "Accès Administrateur",
    adminCode: "Code d'accès",
    geoConsent: "Partager ma localisation approximative pour des ressources proches",
    geoConsentSub: "Votre position exacte n'est jamais stockée.",
    skip: "Passer",
    saveProgress: "Sauvegarder et reprendre plus tard",
    saved: "Progression sauvegardée !",
    welcome: "Bienvenue",
  },
  wo: {
    appName: "DrogueCollect",
    tagline: "Sa wer-gi, ci àddina ak jàmm",
    subtitle: "Dëkk ci xam-xam bu njëkk ci Senegaal",
    start: "Tambali",
    guestMode: "Jaamu bopam (benn compte rekk)",
    login: "Dugg",
    register: "Samp compte",
    pseudo: "Tur bi nga bëgg",
    email: "Email (diggël bu nekk)",
    password: "Xibaaril",
    pseudoHint: "Tur bi du tur bu dëkk",
    continueBtn: "Ñëw ci kanam",
    backBtn: "Dëkk",
    submitBtn: "Yónni",
    step: "Cet",
    of: "ci",
    history: "Sama tariix",
    resources: "Seen ressource",
    dashboard: "Tableau de bord",
    logout: "Génn",
    questionnaire: "Farmaas bi",
    home: "Kër",
    lang: "Français",
    privacyNote: "Données yi dañu encrypt. Benn xeeti mbir bu yëgël ku am du jël.",
    q1: "Fan la nga ànd ak at yi ?",
    q2: "Fan la nga dëkk ?",
    q3: "Jikko yi ? (diggël bu nekk)",
    q4: "Lan la nga jëm ?",
    q5: "Waxtu bu baax na fanaan ?",
    q6: "Lan lay def ak dëkk ?",
    q7: "Lu tax la nga jëm ?",
    q8: "Lan la nga xam ci kàddu ?",
    q9: "Ba fan na nga jëm ?",
    q10: "Fan la nga ci jëm ci kanam ?",
    q11: "Yëgël na soins bu wer ?",
    q12: "Bëgg na nga déglu walla dimi jëm ?",
    ageRanges: ["18 at ak kanam", "18-25 at", "26-35 at", "36-45 at", "46-55 at", "55 at ak kanam"],
    regions: ["Dakar", "Thiès", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Louga", "Saint-Louis", "Matam", "Tambacounda", "Kédougou", "Kolda", "Sédhiou", "Ziguinchor"],
    genders: ["Góor", "Jigéen", "Non-binaire", "Bëgg du wax"],
    substances: ["Cannabis / Yamba", "Alkol", "Tabaa", "Cocaïne / Crack", "Héroïne", "Médicaments (détournement)", "Solvants", "Stimulants", "Yeneen"],
    frequencies: ["Diggël (1x/weeru)", "Ci aada (1-3x/aada)", "Dëgër (4-6x/aada)", "Bu bés bu nekk", "Maas ci bés"],
    modes: ["Fum", "Piqûre", "Dëkk", "Sniff", "Yeneen"],
    reasons: ["Stress", "Yàq", "Jàmm ak xelam", "Pression sociale", "Dépression", "Insomnie", "Curiosité", "Dépendance", "Yeneen"],
    effects: ["Euphorie", "Jàmm", "Wer-gi bu baax", "Xel bu baax", "Dëgër yi", "Problèmes sociaux", "Dépendance", "Dara amul"],
    durations: ["6 weeru ak kanam", "6 weeru - 1 at", "1-3 at", "3-5 at", "5 at ak kanam"],
    places: ["Kër", "Yoon wi", "Xarit yi", "Boîte / Bar", "Liggéey", "Yeneen"],
    accessOptions: ["Waaw, yomb na", "Waaw, dafa sore", "Déedéet, amul", "Du ma des soins"],
    stopOptions: ["Waaw, bëgg naa déglu", "Waaw, bëgg naa dimi", "Déedéet", "Xam du ma"],
    thankYou: "Jërejëf !",
    thankYouSub: "Sa mbir dafa dëkk ci wer yi Senegaal.",
    noHistory: "Dara amul ci kanam.",
    submittedOn: "Yónnees ci",
    viewDetails: "Xool",
    adminTitle: "Tableau de Bord",
    adminSub: "Données yi dañu anonymiser",
    totalSubmissions: "Totaal",
    thisMonth: "Ci weeru si",
    regions_stat: "Région yi",
    substances_stat: "Substances yi",
    exportCSV: "Jël CSV",
    ageDistrib: "At yi",
    substanceDistrib: "Substances yi",
    regionDistrib: "Région yi",
    trendsTitle: "Tendances",
    centerTitle: "Seen woto",
    centerSub: "Gis benn centre ci sa géej",
    filterRegion: "Seet ci région",
    allRegions: "Yëp région yi",
    emergencyTitle: "Ndeyu télép",
    riskReduction: "Dimi risque",
    riskText: "Xam-xam yu jàpp ci dimi risque ci jëm substances yi.",
    adminLogin: "Accès Administrateur",
    adminCode: "Code bi",
    geoConsent: "Yón sa xeet ci seen ressource ci sa géej",
    geoConsentSub: "Sa xeet bu dëkk du jël ci kanam.",
    skip: "Xaar",
    saveProgress: "Sàq ak seetu ci kanam",
    saved: "Sàq na !",
    welcome: "Dalal ak jàmm",
  }
};

// ─── MOCK DATA (supprimées - données réelles depuis Supabase) ─────────────────
const centers = [
  { name: "CILD - Comité Interministériel de Lutte contre la Drogue", city: "Dakar", region: "Dakar", phone: "+221 33 849 00 00", address: "Dakar, Sénégal" },
  { name: "Centre de Santé Mentale de Fann", city: "Dakar", region: "Dakar", phone: "+221 33 824 55 54", address: "Hôpital de Fann, Dakar" },
  { name: "Association de Réduction des Risques (ARR)", city: "Dakar", region: "Dakar", phone: "+221 77 123 45 67", address: "Médina, Dakar" },
  { name: "Centre Hospitalier Régional de Thiès", city: "Thiès", region: "Thiès", phone: "+221 33 951 10 50", address: "Thiès, Sénégal" },
  { name: "Centre de Santé de Ziguinchor", city: "Ziguinchor", region: "Ziguinchor", phone: "+221 33 991 11 88", address: "Ziguinchor, Sénégal" },
  { name: "Hôpital Régional de Saint-Louis", city: "Saint-Louis", region: "Saint-Louis", phone: "+221 33 961 10 10", address: "Saint-Louis, Sénégal" },
];
const COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#0284c7", "#0369a1", "#075985"];

// ─── LIQUID BLOB BACKGROUND ───────────────────────────────────────────────────
function LiquidBlobs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="blur1"><feGaussianBlur stdDeviation="60" /></filter>
          <filter id="blur2"><feGaussianBlur stdDeviation="80" /></filter>
          <filter id="blur3"><feGaussianBlur stdDeviation="50" /></filter>
        </defs>
        <g filter="url(#blur1)">
          <ellipse className="blob1" cx="200" cy="200" rx="300" ry="250" fill="#bfdbfe" opacity="0.5" />
        </g>
        <g filter="url(#blur2)">
          <ellipse className="blob2" cx="1200" cy="600" rx="350" ry="300" fill="#93c5fd" opacity="0.4" />
        </g>
        <g filter="url(#blur3)">
          <ellipse className="blob3" cx="720" cy="450" rx="280" ry="220" fill="#60a5fa" opacity="0.3" />
        </g>
        <g filter="url(#blur1)">
          <ellipse className="blob4" cx="1100" cy="100" rx="200" ry="180" fill="#dbeafe" opacity="0.5" />
        </g>
      </svg>
      <style>{`
        .blob1 { animation: float1 12s ease-in-out infinite; }
        .blob2 { animation: float2 15s ease-in-out infinite; }
        .blob3 { animation: float3 10s ease-in-out infinite; }
        .blob4 { animation: float4 18s ease-in-out infinite; }
        @keyframes float1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(60px,40px) scale(1.1); }
          66% { transform: translate(-40px,60px) scale(0.95); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-80px,-50px) scale(1.15); }
        }
        @keyframes float3 {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(50px,-30px) scale(1.05); }
          75% { transform: translate(-50px,40px) scale(0.9); }
        }
        @keyframes float4 {
          0%,100% { transform: translate(0,0) scale(1); }
          60% { transform: translate(40px,60px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, color: "#0ea5e9" }}>Étape {current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ background: "#e0f2fe", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #0ea5e9)", borderRadius: 99, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

// ─── GLASS CARD ──────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, onClick, className = "" }) {
  return (
    <div onClick={onClick} className={`glass-card ${className}`} style={{
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "0 8px 32px rgba(14,165,233,0.10), 0 2px 8px rgba(0,0,0,0.06)",
      padding: 28,
      ...style
    }}>
      {children}
    </div>
  );
}

// ─── CHOICE BUTTON ───────────────────────────────────────────────────────────
function Choice({ label, selected, onClick, multi }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "10px 18px", borderRadius: 14, margin: "5px 4px",
      border: selected ? "2px solid #0ea5e9" : "2px solid #e0f2fe",
      background: selected ? "linear-gradient(135deg,#e0f2fe,#bfdbfe)" : "rgba(255,255,255,0.8)",
      color: selected ? "#0369a1" : "#475569",
      fontWeight: selected ? 700 : 500, cursor: "pointer",
      fontSize: 14, transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
      boxShadow: selected ? "0 4px 16px rgba(14,165,233,0.25)" : "none",
      transform: selected ? "scale(1.03)" : "scale(1)",
    }}>
      {multi && <span style={{
        width: 18, height: 18, borderRadius: 5, border: `2px solid ${selected ? "#0ea5e9" : "#94a3b8"}`,
        background: selected ? "#0ea5e9" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {selected && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>}
      {label}
    </button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, setUser, lang, setLang, t }) {
  const navItems = [
    { key: "home", label: t.home, icon: "🏠" },
    { key: "questionnaire", label: t.questionnaire, icon: "📋" },
    { key: "history", label: t.history, icon: "📊" },
    { key: "resources", label: t.resources, icon: "🆘" },
  ];
  if (user?.role === "admin") navItems.push({ key: "admin", label: t.dashboard, icon: "🔒" });

  return (
    <>
      <style>{`
        .desktop-nav { display: flex !important; }
        .hamburger-btns { display: none !important; }
        .bottom-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btns { display: flex !important; }
          .bottom-nav { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(14,165,233,0.15)",
        boxShadow: "0 2px 20px rgba(14,165,233,0.08)",
        padding: "0 16px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(14,165,233,0.35)", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" /></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#0ea5e9", letterSpacing: "-0.5px" }}>{t.appName}</span>
        </div>

        {/* Desktop: liens + langue + login */}
        <div className="desktop-nav" style={{ gap: 4, alignItems: "center" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setPage(item.key)} style={{
              padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: page === item.key ? "linear-gradient(135deg,#e0f2fe,#bfdbfe)" : "transparent",
              color: page === item.key ? "#0369a1" : "#64748b",
              fontWeight: page === item.key ? 700 : 500, fontSize: 13, transition: "all 0.2s",
            }}>{item.label}</button>
          ))}
          <button onClick={() => setLang(lang === "fr" ? "wo" : "fr")} style={{
            padding: "6px 12px", borderRadius: 10, border: "2px solid #e0f2fe",
            background: "white", color: "#0369a1", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>{t.lang}</button>
          {user ? (
            <button onClick={() => { setUser(null); setPage("home"); }} style={{
              padding: "6px 12px", borderRadius: 10, border: "none",
              background: "#fff1f2", color: "#e11d48", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>{t.logout}</button>
          ) : (
            <button onClick={() => setPage("auth")} style={{
              padding: "6px 16px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
              color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(14,165,233,0.3)",
            }}>{t.login}</button>
          )}
        </div>

        {/* Mobile: bouton langue + connexion */}
        <div className="hamburger-btns" style={{ alignItems: "center", gap: 8 }}>
          <button onClick={() => setLang(lang === "fr" ? "wo" : "fr")} style={{
            padding: "5px 10px", borderRadius: 8, border: "2px solid #e0f2fe",
            background: "white", color: "#0369a1", fontWeight: 700, fontSize: 11, cursor: "pointer",
          }}>{t.lang}</button>
          {user ? (
            <button onClick={() => { setUser(null); setPage("home"); }} style={{
              padding: "5px 10px", borderRadius: 8, border: "none",
              background: "#fff1f2", color: "#e11d48", fontWeight: 600, fontSize: 11, cursor: "pointer",
            }}>{t.logout}</button>
          ) : (
            <button onClick={() => setPage("auth")} style={{
              padding: "5px 12px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
              color: "white", fontWeight: 700, fontSize: 11, cursor: "pointer",
            }}>{t.login}</button>
          )}
        </div>
      </nav>

      {/* ── Barre de navigation en bas — mobile uniquement ── */}
      <div className="bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(14,165,233,0.15)",
        boxShadow: "0 -4px 20px rgba(14,165,233,0.1)",
        height: 68, alignItems: "center", justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setPage(item.key)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "6px 8px", borderRadius: 12, border: "none", cursor: "pointer",
            background: page === item.key ? "linear-gradient(135deg,#e0f2fe,#bfdbfe)" : "transparent",
            color: page === item.key ? "#0369a1" : "#94a3b8",
            fontWeight: page === item.key ? 700 : 500,
            transition: "all 0.2s", minWidth: 52, flex: 1,
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 10, whiteSpace: "nowrap" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage, t }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  return (
    <div className="mobile-pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 20px 40px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        .fade-up { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(.4,0,.2,1); }
        .fade-up.vis { opacity: 1; transform: translateY(0); }
        .pulse-ring { animation: pulse-ring 3s ease infinite; }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
          70% { box-shadow: 0 0 0 20px rgba(14,165,233,0); }
          100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
        }
        .liquid-btn { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
        .liquid-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 12px 30px rgba(14,165,233,0.45) !important; }
        .stat-card { transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(14,165,233,0.15) !important; }
        /* ── RESPONSIVE MOBILE ── */
        @media (max-width: 768px) {
          .mobile-pad { padding: 75px 14px 90px !important; }
          .mobile-card { padding: 18px 14px !important; border-radius: 18px !important; }
          .mobile-grid-1 { grid-template-columns: 1fr !important; }
          .mobile-grid-2 { grid-template-columns: 1fr 1fr !important; }
          .mobile-text-sm { font-size: 13px !important; }
          .mobile-hide { display: none !important; }
          .mobile-full { width: 100% !important; }
          .mobile-col { flex-direction: column !important; }
          .mobile-table { font-size: 11px !important; }
          .mobile-table th, .mobile-table td { padding: 7px 6px !important; }
        }
      `}</style>

      <div className={`fade-up ${vis ? "vis" : ""}`} style={{ textAlign: "center", maxWidth: 600, transitionDelay: "0.1s" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#38bdf8,#0369a1)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(14,165,233,0.45)" }} className="pulse-ring">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white" /></svg>
        </div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, marginBottom: 16 }}>
          <span style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.tagline}</span>
        </h1>
        <p style={{ fontSize: "clamp(1rem,2vw,1.15rem)", color: "#64748b", lineHeight: 1.7, marginBottom: 10 }}>{t.subtitle}</p>
      </div>

      <div className={`fade-up ${vis ? "vis" : ""} mobile-col`} style={{ transitionDelay: "0.25s", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 28, marginBottom: 16, width: "100%", maxWidth: 400 }}>
        <button onClick={() => setPage("auth")} className="liquid-btn" style={{
          padding: "14px 36px", borderRadius: 16, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#38bdf8,#0369a1)",
          color: "white", fontWeight: 700, fontSize: 16, width: "100%",
          boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
        }}>{t.start}</button>
        <button onClick={() => setPage("questionnaire")} className="liquid-btn" style={{
          padding: "14px 28px", borderRadius: 16, border: "2px solid #bfdbfe",
          background: "rgba(255,255,255,0.85)", color: "#0369a1", fontWeight: 600, fontSize: 15, cursor: "pointer", width: "100%",
          boxShadow: "0 4px 16px rgba(14,165,233,0.1)",
        }}>{t.guestMode}</button>
      </div>

      <div className={`fade-up ${vis ? "vis" : ""}`} style={{ transitionDelay: "0.4s", marginTop: 16, padding: "12px 20px", borderRadius: 12, background: "rgba(14,165,233,0.07)", border: "1px solid #bfdbfe", maxWidth: 500, textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>🔒 {t.privacyNote}</p>
      </div>

      <div className={`fade-up ${vis ? "vis" : ""} mobile-grid-2`} style={{ transitionDelay: "0.55s", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginTop: 36, width: "100%", maxWidth: 700 }}>
        {[
          { icon: "🔒", label: "100% Anonyme", sub: "Aucune donnée identifiable" },
          { icon: "📊", label: "Impact Réel", sub: "Contribuez à la recherche" },
          { icon: "🆘", label: "Aide Locale", sub: "Ressources au Sénégal" },
          { icon: "🌍", label: "Multilingue", sub: "Français & Wolof" },
        ].map((s, i) => (
          <GlassCard key={i} className="stat-card" style={{ padding: "20px 16px", textAlign: "center", cursor: "default" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{s.sub}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ setPage, setUser, t }) {
  const [mode, setMode] = useState("login");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handle = () => {
    if (isAdmin && adminCode === "admin123") {
      setUser({ pseudo: "Admin", role: "admin" });
      setPage("admin");
    } else if (pseudo.trim()) {
      setUser({ pseudo: pseudo.trim(), role: "user" });
      setPage("questionnaire");
    }
  };

  return (
    <div className="mobile-pad" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 20px 40px" }}>
      <GlassCard style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#38bdf8,#0369a1)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5.8 1.29 6 3.75C16.6 17.48 14.4 18.5 12 18.5s-4.6-1.02-6-2.75C6.2 13.29 9.3 12 12 12zm0-2a4 4 0 100-8 4 4 0 000 8z" fill="white" /></svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 6 }}>{isAdmin ? t.adminLogin : (mode === "login" ? t.login : t.register)}</h2>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>{t.pseudoHint}</p>
        </div>

        {!isAdmin ? (
          <>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>{t.pseudo}</label>
            <input value={pseudo} onChange={e => setPseudo(e.target.value)} placeholder="ex: utilisateur42"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e0f2fe", fontSize: 14, outline: "none", marginBottom: 16, background: "rgba(255,255,255,0.9)", color: "#0f172a", boxSizing: "border-box" }} />
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>{t.password}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e0f2fe", fontSize: 14, outline: "none", marginBottom: 20, background: "rgba(255,255,255,0.9)", color: "#0f172a", boxSizing: "border-box" }} />
          </>
        ) : (
          <>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>{t.adminCode}</label>
            <input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="••••••••"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e0f2fe", fontSize: 14, outline: "none", marginBottom: 20, background: "rgba(255,255,255,0.9)", color: "#0f172a", boxSizing: "border-box" }} />
          </>
        )}

        <button onClick={handle} style={{
          width: "100%", padding: "13px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#38bdf8,#0369a1)",
          color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer",
          boxShadow: "0 6px 20px rgba(14,165,233,0.35)", marginBottom: 14,
        }}>{t.continueBtn}</button>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <button onClick={() => setIsAdmin(!isAdmin)} style={{ background: "none", border: "none", color: "#0ea5e9", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
            {isAdmin ? "← Mode utilisateur" : "🔒 Accès administrateur"}
          </button>
          <button onClick={() => { setUser({ pseudo: "Invité", role: "guest" }); setPage("questionnaire"); }} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
            {t.guestMode}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── QUESTIONNAIRE PAGE ───────────────────────────────────────────────────────
const STEPS = (t) => [
  { q: t.q1, key: "age", type: "single", options: t.ageRanges },
  { q: t.q2, key: "region", type: "single", options: t.regions },
  { q: t.q3, key: "gender", type: "single", options: t.genders, optional: true },
  { q: t.q4, key: "substances", type: "multi", options: t.substances },
  { q: t.q5, key: "frequency", type: "single", options: t.frequencies },
  { q: t.q6, key: "mode", type: "multi", options: t.modes },
  { q: t.q7, key: "reasons", type: "multi", options: t.reasons },
  { q: t.q8, key: "effects", type: "multi", options: t.effects },
  { q: t.q9, key: "duration", type: "single", options: t.durations },
  { q: t.q10, key: "place", type: "single", options: t.places },
  { q: t.q11, key: "access", type: "single", options: t.accessOptions },
  { q: t.q12, key: "stop", type: "single", options: t.stopOptions },
];

function QuestionnairePage({ setPage, t, addHistory }) {
  const steps = STEPS(t);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [geoAsked, setGeoAsked] = useState(false);

  const cur = steps[step];
  const total = steps.length;

  const toggle = (key, val, multi) => {
    if (multi) {
      const cur2 = answers[key] || [];
      setAnswers({ ...answers, [key]: cur2.includes(val) ? cur2.filter(v => v !== val) : [...cur2, val] });
    } else {
      setAnswers({ ...answers, [key]: val });
    }
  };

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else {
      if (!geoAsked) { setGeoAsked(true); return; }
      addHistory(answers);
      setDone(true);
    }
  };
  const back = () => step > 0 && setStep(step - 1);
  const saveProgress = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  if (geoAsked && !done) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 20px 40px" }}>
      <GlassCard style={{ maxWidth: 440, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
        <h3 style={{ fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>{t.geoConsent}</h3>
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 24 }}>{t.geoConsentSub}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => { addHistory(answers); setDone(true); }} style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#38bdf8,#0369a1)", color: "white", fontWeight: 700, cursor: "pointer" }}>Autoriser</button>
          <button onClick={() => { addHistory(answers); setDone(true); }} style={{ padding: "12px 28px", borderRadius: 14, border: "2px solid #e0f2fe", background: "transparent", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>{t.skip}</button>
        </div>
      </GlassCard>
    </div>
  );

  if (done) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 20px 40px" }}>
      <GlassCard style={{ maxWidth: 420, textAlign: "center" }}>
        <div style={{ width: 70, height: 70, borderRadius: 22, background: "linear-gradient(135deg,#38bdf8,#0369a1)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(14,165,233,0.4)", animation: "pop 0.5s cubic-bezier(.4,0,.2,1)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <style>{`@keyframes pop { 0% { transform:scale(0); } 70% { transform:scale(1.1); } 100% { transform:scale(1); } }`}</style>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 10 }}>{t.thankYou}</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>{t.thankYouSub}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setDone(false); setStep(0); setAnswers({}); setGeoAsked(false); }} style={{ padding: "11px 22px", borderRadius: 13, border: "2px solid #e0f2fe", background: "transparent", color: "#0369a1", fontWeight: 600, cursor: "pointer" }}>Nouveau questionnaire</button>
          <button onClick={() => setPage("resources")} style={{ padding: "11px 22px", borderRadius: 13, border: "none", background: "linear-gradient(135deg,#38bdf8,#0369a1)", color: "white", fontWeight: 700, cursor: "pointer" }}>{t.resources} →</button>
        </div>
      </GlassCard>
    </div>
  );

  const isMulti = cur.type === "multi";
  const selected = answers[cur.key];
  const canNext = cur.optional || (isMulti ? (selected && selected.length > 0) : !!selected);

  return (
    <div className="mobile-pad" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 20px 40px" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <ProgressBar current={step + 1} total={total} />
        <GlassCard>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(1.1rem,3vw,1.35rem)", color: "#0f172a", marginBottom: 20, lineHeight: 1.4 }}>{cur.q}</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {cur.options.map(opt => (
              <Choice key={opt} label={opt} multi={isMulti}
                selected={isMulti ? (selected || []).includes(opt) : selected === opt}
                onClick={() => toggle(cur.key, opt, isMulti)} />
            ))}
          </div>
          {cur.optional && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>* Optionnel – vous pouvez passer cette question</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
            <button onClick={back} disabled={step === 0} style={{
              padding: "10px 20px", borderRadius: 12, border: "2px solid #e0f2fe",
              background: "transparent", color: step === 0 ? "#cbd5e1" : "#0369a1",
              fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", fontSize: 14,
            }}>← {t.backBtn}</button>
            <button onClick={saveProgress} style={{
              padding: "8px 14px", borderRadius: 10, border: "1px solid #e0f2fe",
              background: saved ? "#dcfce7" : "transparent", color: saved ? "#16a34a" : "#94a3b8",
              fontSize: 12, cursor: "pointer", transition: "all 0.3s",
            }}>💾 {saved ? t.saved : t.saveProgress}</button>
            <button onClick={next} disabled={!canNext} style={{
              padding: "10px 24px", borderRadius: 12, border: "none",
              background: canNext ? "linear-gradient(135deg,#38bdf8,#0369a1)" : "#e2e8f0",
              color: canNext ? "white" : "#94a3b8", fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed",
              fontSize: 14, boxShadow: canNext ? "0 6px 18px rgba(14,165,233,0.3)" : "none",
              transition: "all 0.3s",
            }}>{step === total - 1 ? t.submitBtn : t.continueBtn + " →"}</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage({ t, history }) {
  return (
    <div className="mobile-pad" style={{ padding: "90px 20px 40px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontWeight: 800, fontSize: 26, color: "#0f172a", marginBottom: 6 }}>{t.history}</h1>
      <p style={{ color: "#94a3b8", marginBottom: 28 }}>Suivi de vos soumissions anonymes</p>
      {history.length === 0 ? (
        <GlassCard style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ color: "#94a3b8" }}>{t.noHistory}</p>
        </GlassCard>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {history.map((item, i) => (
            <GlassCard key={i} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>#{i + 1} — {t.submittedOn} {item.date || new Date().toLocaleDateString("fr-FR")}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {item.age && <span style={{ padding: "3px 10px", borderRadius: 99, background: "#e0f2fe", color: "#0369a1", fontSize: 12, fontWeight: 600 }}>{item.age}</span>}
                    {item.region && <span style={{ padding: "3px 10px", borderRadius: 99, background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 600 }}>📍 {item.region}</span>}
                    {(item.substances || item.substance) && (
                      <span style={{ padding: "3px 10px", borderRadius: 99, background: "#fef3c7", color: "#d97706", fontSize: 12, fontWeight: 600 }}>
                        {Array.isArray(item.substances) ? item.substances.join(", ") : item.substance}
                      </span>
                    )}
                  </div>
                </div>
                <button style={{ padding: "6px 14px", borderRadius: 10, border: "2px solid #e0f2fe", background: "white", color: "#0ea5e9", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.viewDetails}</button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
      {history.length > 0 && (
        <GlassCard style={{ marginTop: 28 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a" }}>📈 Évolution de vos soumissions</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={history.map((h, i) => ({ name: `#${i + 1}`, value: i + 1 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: "#0ea5e9", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  );
}

// ─── RESOURCES PAGE ───────────────────────────────────────────────────────────
function ResourcesPage({ t }) {
  const [filterRegion, setFilterRegion] = useState("all");
  const filtered = filterRegion === "all" ? centers : centers.filter(c => c.region === filterRegion);
  return (
    <div className="mobile-pad" style={{ padding: "90px 20px 40px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontWeight: 800, fontSize: 26, color: "#0f172a", marginBottom: 6 }}>{t.centerTitle}</h1>
      <p style={{ color: "#94a3b8", marginBottom: 24 }}>{t.centerSub}</p>

      <GlassCard style={{ marginBottom: 24, padding: "14px 18px", background: "linear-gradient(135deg,rgba(14,165,233,0.08),rgba(3,105,161,0.06))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 22 }}>🚨</span>
          <div>
            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>{t.emergencyTitle}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap" }}>
              {[["SAMU", "15"], ["Police", "17"], ["CILD", "+221 33 849 00 00"]].map(([name, num]) => (
                <span key={name} style={{ fontSize: 13, color: "#0369a1", fontWeight: 700 }}>{name}: <a href={`tel:${num}`} style={{ color: "#0ea5e9" }}>{num}</a></span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginRight: 10 }}>{t.filterRegion} :</label>
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "2px solid #e0f2fe", background: "white", color: "#0f172a", fontSize: 13, cursor: "pointer" }}>
          <option value="all">{t.allRegions}</option>
          {[...new Set(centers.map(c => c.region))].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map((c, i) => (
          <GlassCard key={i} style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6, fontSize: 15 }}>{c.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 99, background: "#e0f2fe", color: "#0369a1", fontSize: 12, fontWeight: 600 }}>📍 {c.city}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 99, background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 600 }}>📞 {c.phone}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{c.address}</div>
              </div>
              <a href={`tel:${c.phone}`} style={{
                padding: "9px 18px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#38bdf8,#0369a1)", color: "white",
                fontWeight: 700, fontSize: 13, textDecoration: "none",
                boxShadow: "0 4px 14px rgba(14,165,233,0.3)", whiteSpace: "nowrap",
              }}>Appeler</a>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ marginTop: 28, background: "linear-gradient(135deg,rgba(14,165,233,0.05),rgba(3,105,161,0.03))" }}>
        <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>💊 {t.riskReduction}</h3>
        <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{t.riskText}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 16 }}>
          {[
            { icon: "💉", title: "Ne jamais partager le matériel", desc: "Aiguilles, pailles – chaque usage unique" },
            { icon: "🧪", title: "Tester les substances", desc: "Kits de test disponibles dans les centres" },
            { icon: "👥", title: "Ne jamais consommer seul", desc: "Présence d'un tiers en cas d'urgence" },
            { icon: "📞", title: "Numéro d'écoute anonyme", desc: "Disponible 24h/24 sans jugement" },
          ].map((tip, i) => (
            <div key={i} style={{ padding: "14px", borderRadius: 14, background: "rgba(255,255,255,0.7)", border: "1px solid rgba(14,165,233,0.1)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{tip.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{tip.desc}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── IMAGE BASE64 DE LA CARTE DU SÉNÉGAL ────────────────────────────────────
const MAP_IMG = "data:image/jpeg;base64,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";

// Zones cliquables sur la carte (coordonnées en % de la largeur/hauteur de l'image)
// L'image fait environ 820x560 pixels
const REGION_ZONES = [
  { name:"Saint-Louis",  shape:"poly", coords:"22,2, 68,2, 68,28, 52,32, 35,26, 22,14",   lx:"45", ly:"14" },
  { name:"Louga",        shape:"poly", coords:"22,28, 52,28, 65,28, 68,52, 55,55, 34,55, 20,50, 18,38", lx:"40", ly:"42" },
  { name:"Matam",        shape:"poly", coords:"68,2, 100,2, 100,55, 82,58, 68,52, 68,28", lx:"83", ly:"28" },
  { name:"Dakar",        shape:"poly", coords:"0,42, 10,38, 14,44, 12,52, 6,56, 0,54",    lx:"6",  ly:"47" },
  { name:"Thiès",        shape:"poly", coords:"10,38, 22,32, 34,34, 32,50, 22,52, 14,52, 12,52, 14,44", lx:"22", ly:"44" },
  { name:"Diourbel",     shape:"poly", coords:"34,34, 52,30, 55,40, 50,52, 38,54, 32,50", lx:"43", ly:"43" },
  { name:"Fatick",       shape:"poly", coords:"14,52, 32,50, 38,54, 36,66, 28,70, 18,68, 12,62", lx:"24", ly:"61" },
  { name:"Kaolack",      shape:"poly", coords:"32,50, 50,52, 56,58, 52,70, 40,72, 36,66, 38,54", lx:"44", ly:"62" },
  { name:"Kaffrine",     shape:"poly", coords:"50,52, 68,52, 82,58, 80,76, 64,80, 52,70, 56,58", lx:"65", ly:"65" },
  { name:"Tambacounda",  shape:"poly", coords:"82,58, 100,55, 100,90, 88,92, 72,82, 64,80, 80,76", lx:"86", ly:"74" },
  { name:"Kédougou",     shape:"poly", coords:"88,90, 100,90, 100,100, 88,100",            lx:"94", ly:"95" },
  { name:"Kolda",        shape:"poly", coords:"52,84, 88,90, 88,100, 52,100",              lx:"70", ly:"93" },
  { name:"Sédhiou",      shape:"poly", coords:"30,84, 52,84, 52,100, 30,100",              lx:"41", ly:"93" },
  { name:"Ziguinchor",   shape:"poly", coords:"5,84, 30,84, 30,100, 5,100",               lx:"18", ly:"93" },
];

function SenegalMap({ regionData, total }) {
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);

  const countMap = {};
  regionData.forEach(r => { countMap[r.region] = r.count; });
  const maxCount = Math.max(...regionData.map(r => r.count), 1);

  const getPct = (name) => {
    const count = countMap[name] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Couleur de surbrillance selon l'intensité
  const getOverlayColor = (name) => {
    const count = countMap[name] || 0;
    if (count === 0) return "rgba(14,165,233,0)";
    const intensity = count / maxCount;
    if (intensity > 0.75) return "rgba(3,105,161,0.55)";
    if (intensity > 0.5)  return "rgba(14,165,233,0.48)";
    if (intensity > 0.25) return "rgba(56,189,248,0.42)";
    return "rgba(125,211,252,0.38)";
  };

  // Zones SVG cliquables (viewBox 820x560 = taille approx de l'image)
  // Polygones tracés sur la carte réelle fournie par l'utilisateur
  const ZONES = [
    { name:"Saint-Louis",  pts:"162,8 200,5 365,5 415,8 455,8 460,55 455,95 418,170 380,162 348,182 305,195 252,174 214,148 162,132",      lx:310, ly:85  },
    { name:"Louga",        pts:"162,132 214,148 252,174 305,195 348,182 380,162 418,170 412,238 398,275 345,282 290,288 255,270 215,274 186,256 182,228 212,218", lx:285, ly:218 },
    { name:"Matam",        pts:"455,8 510,10 580,18 642,28 665,58 680,110 678,178 675,268 648,275 598,285 558,294 518,288 478,274 438,260 412,238 418,170 455,95", lx:558, ly:152 },
    { name:"Dakar",        pts:"48,220 88,208 100,222 108,232 102,246 88,256 70,262 50,256 46,240", lx:76, ly:238 },
    { name:"Thiès",        pts:"88,208 162,182 214,148 212,218 182,228 172,250 160,274 140,287 116,287 96,275 88,256 102,246 108,232 100,222", lx:148, ly:242 },
    { name:"Diourbel",     pts:"212,218 252,174 268,174 275,202 298,202 302,222 292,250 268,270 238,270 215,254 182,228", lx:248, ly:228 },
    { name:"Fatick",       pts:"116,287 140,287 160,274 172,250 215,254 238,270 232,300 218,328 192,355 162,362 132,352 108,328 100,300", lx:170, ly:320 },
    { name:"Kaolack",      pts:"215,254 238,270 268,270 292,250 310,268 314,298 300,328 278,350 248,362 218,362 192,355 218,328 232,300", lx:252, ly:314 },
    { name:"Kaffrine",     pts:"292,250 290,288 345,282 398,275 412,238 438,260 440,310 428,362 392,385 345,390 305,382 278,350 300,328 314,298 310,268", lx:360, ly:320 },
    { name:"Tambacounda",  pts:"438,260 478,274 518,288 558,294 598,285 648,275 675,268 678,300 678,440 645,455 588,462 554,425 490,418 448,410 428,384 440,310", lx:562, ly:358 },
    { name:"Kédougou",     pts:"554,425 588,462 645,455 678,440 678,510 554,510",          lx:622, ly:472 },
    { name:"Kolda",        pts:"305,418 448,410 490,418 554,425 554,510 305,510",          lx:435, ly:468 },
    { name:"Sédhiou",      pts:"202,418 305,418 305,510 202,510",                          lx:252, ly:468 },
    { name:"Ziguinchor",   pts:"60,418 202,418 202,510 60,510",                            lx:130, ly:468 },
  ];

  return (
    <GlassCard style={{ marginBottom: 20 }}>
      <style>{`
        @keyframes mapIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
        @keyframes pulsePin { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }
        .map-zone { transition: all 0.25s ease; cursor:pointer; }
        .map-zone:hover { opacity:0.85 !important; }
        .map-pin { animation: pulsePin 1.8s ease-in-out infinite; }
      `}</style>

      {/* En-tête */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <h3 style={{ fontWeight:800, color:"#0f172a", fontSize:15 }}>🗺️ Carte des régions — Sénégal</h3>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[["rgba(125,211,252,0.5)","Faible"],["rgba(56,189,248,0.55)","Moyen"],["rgba(14,165,233,0.6)","Élevé"],["rgba(3,105,161,0.7)","Très élevé"]].map(([c,l])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:c, border:"1px solid #bfdbfe" }}/>
              <span style={{ fontSize:10, color:"#64748b" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>

        {/* Carte image + overlay SVG */}
        <div style={{ flex:"1 1 300px", position:"relative", borderRadius:14, overflow:"hidden", boxShadow:"0 4px 20px rgba(14,165,233,0.12)", animation: animated ? "mapIn 0.7s ease forwards" : "none" }}>

          {/* L'image réelle de la carte */}
          <img
            src={MAP_IMG}
            alt="Carte du Sénégal"
            style={{ width:"100%", height:"auto", display:"block" }}
          />

          {/* SVG overlay transparent par-dessus l'image */}
          <svg
            viewBox="0 0 820 560"
            preserveAspectRatio="none"
            style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%" }}
          >
            {ZONES.map((zone, i) => {
              const count  = countMap[zone.name] || 0;
              const pct    = getPct(zone.name);
              const isHov  = hovered === zone.name;
              const color  = getOverlayColor(zone.name);
              const pts    = zone.pts;

              return (
                <g key={zone.name}
                  className="map-zone"
                  onMouseEnter={() => setHovered(zone.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setHovered(isHov ? null : zone.name)}
                >
                  {/* Zone colorée */}
                  <polygon
                    points={pts}
                    fill={isHov ? color.replace(/[\d.]+\)$/, "0.72)") : color}
                    stroke={isHov ? "#0369a1" : "rgba(255,255,255,0.3)"}
                    strokeWidth={isHov ? "2" : "1"}
                    strokeLinejoin="round"
                  />

                  {/* Point animé si données */}
                  {count > 0 && (
                    <circle
                      cx={zone.lx} cy={zone.ly - 16} r="6"
                      fill="#0369a1" stroke="white" strokeWidth="2"
                      className="map-pin"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  )}

                  {/* Badge pourcentage */}
                  {pct > 0 && (
                    <g>
                      <rect
                        x={zone.lx - 18} y={zone.ly - 2}
                        width="36" height="16" rx="8"
                        fill="rgba(3,105,161,0.88)"
                      />
                      <text x={zone.lx} y={zone.ly + 10}
                        textAnchor="middle" fontSize="9" fontWeight="800" fill="white"
                        style={{ pointerEvents:"none", userSelect:"none" }}>
                        {pct}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hovered && (
            <div style={{
              position:"absolute", top:8, right:8,
              background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
              borderRadius:14, padding:"12px 16px", boxShadow:"0 8px 28px rgba(14,165,233,0.25)",
              border:"1.5px solid #bfdbfe", minWidth:165, zIndex:30,
              animation:"mapIn 0.2s ease",
            }}>
              <div style={{ fontWeight:800, fontSize:14, color:"#0f172a", marginBottom:8 }}>📍 {hovered}</div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"#64748b" }}>Soumissions</span>
                <span style={{ fontSize:13, fontWeight:800, color:"#0ea5e9" }}>{countMap[hovered] || 0}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:12, color:"#64748b" }}>Pourcentage</span>
                <span style={{ fontSize:13, fontWeight:800, color:"#0369a1" }}>{getPct(hovered)}%</span>
              </div>
              <div style={{ background:"#e0f2fe", borderRadius:99, height:7, overflow:"hidden" }}>
                <div style={{ width:`${getPct(hovered)}%`, height:"100%", background:"linear-gradient(90deg,#38bdf8,#0369a1)", borderRadius:99, transition:"width 0.6s ease" }}/>
              </div>
            </div>
          )}
        </div>

        {/* Classement régions */}
        <div style={{ flex:"0 0 162px" }}>
          <div style={{ fontSize:12, fontWeight:800, color:"#0369a1", marginBottom:12 }}>🏆 Classement</div>
          {regionData.length === 0 ? (
            <div style={{ fontSize:12, color:"#94a3b8", textAlign:"center", padding:"20px 0" }}>Aucune donnée<br/>pour l'instant</div>
          ) : regionData.slice(0, 10).map((r, i) => (
            <div key={r.region}
              style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9, cursor:"pointer", borderRadius:10, padding:"4px 6px", background: hovered===r.region?"#e0f2fe":"transparent", transition:"background 0.2s" }}
              onMouseEnter={()=>setHovered(r.region)} onMouseLeave={()=>setHovered(null)}
            >
              <div style={{ width:22, height:22, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800,
                background: i===0?"linear-gradient(135deg,#fbbf24,#f59e0b)":i===1?"linear-gradient(135deg,#9ca3af,#6b7280)":i===2?"linear-gradient(135deg,#cd7c5a,#b45309)":"#e0f2fe",
                color: i<3?"white":"#0369a1"
              }}>{i+1}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.region}</div>
                <div style={{ height:4, background:"#e0f2fe", borderRadius:99, marginTop:3, overflow:"hidden" }}>
                  <div style={{ width:`${Math.round((r.count/maxCount)*100)}%`, height:"100%", background:"linear-gradient(90deg,#38bdf8,#0369a1)", borderRadius:99 }}/>
                </div>
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{r.count} · {Math.round((r.count/total)*100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminPage({ t }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger toutes les soumissions depuis Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setSubmissions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Calculer les statistiques depuis les vraies données
  const total = submissions.length;

  const thisMonth = submissions.filter(s => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const uniqueRegions = [...new Set(submissions.map(s => s.region).filter(Boolean))];
  const uniqueSubstances = [...new Set(submissions.flatMap(s => s.substances || []).filter(Boolean))];

  // Données pour graphique par âge
  const ageCount = {};
  submissions.forEach(s => { if (s.age_range) ageCount[s.age_range] = (ageCount[s.age_range] || 0) + 1; });
  const ageData = Object.entries(ageCount).map(([name, value]) => ({ name, value }));

  // Données pour graphique par substance
  const substanceCount = {};
  submissions.forEach(s => (s.substances || []).forEach(sub => {
    substanceCount[sub] = (substanceCount[sub] || 0) + 1;
  }));
  const substanceData = Object.entries(substanceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Données pour graphique par région
  const regionCount = {};
  submissions.forEach(s => { if (s.region) regionCount[s.region] = (regionCount[s.region] || 0) + 1; });
  const regionData = Object.entries(regionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([region, count]) => ({ region, count }));

  // Données pour graphique des tendances par mois
  const monthCount = {};
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  submissions.forEach(s => {
    const d = new Date(s.created_at);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthCount[key] = (monthCount[key] || 0) + 1;
  });
  const trendData = Object.entries(monthCount)
    .slice(-6)
    .map(([month, submissions]) => ({ month, submissions }));

  // ── Export PDF via impression navigateur ─────────────────────────────────
  const exportPDF = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    const ageTotal = ageData.reduce((a, b) => a + b.value, 0);
    const subTotal = substanceData.reduce((a, b) => a + b.value, 0);
    const regTotal = regionData.reduce((a, b) => a + b.count, 0);

    const barHTML = (items, keyName, valName, total) => items.map((row, i) => {
      const pct = total > 0 ? Math.round((row[valName] / total) * 100) : 0;
      const colors = ["#0ea5e9","#38bdf8","#0284c7","#0369a1","#075985","#7dd3fc"];
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="width:130px;font-size:12px;color:#475569;flex-shrink:0">${row[keyName]}</span>
          <div style="flex:1;background:#e0f2fe;border-radius:99px;height:10px;overflow:hidden">
            <div style="width:${pct}%;background:${colors[i%6]};height:100%;border-radius:99px"></div>
          </div>
          <span style="font-size:12px;font-weight:700;color:#0369a1;width:60px;text-align:right">${row[valName]} (${pct}%)</span>
        </div>`;
    }).join("");

    const rowsHTML = submissions.map((s, i) => `
      <tr style="background:${i % 2 === 0 ? "#f0f9ff" : "white"}">
        <td>${new Date(s.created_at).toLocaleDateString("fr-FR")}</td>
        <td>${s.age_range || "—"}</td>
        <td>${s.region || "—"}</td>
        <td>${(s.substances || []).join(", ") || "—"}</td>
        <td>${s.frequency || "—"}</td>
        <td>${(s.consumption_mode || []).join(", ") || "—"}</td>
        <td>${s.duration || "—"}</td>
        <td>${s.stop_intention || "—"}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>DrogueCollect — Rapport ${dateStr}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Sora', sans-serif; }
    body { background: white; color: #0f172a; }
    .header { background: linear-gradient(135deg,#0ea5e9,#0369a1); color: white; padding: 28px 32px 20px; }
    .header h1 { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
    .header p { font-size: 13px; opacity: 0.85; }
    .header .date { float: right; font-size: 12px; opacity: 0.8; margin-top: -36px; }
    .content { padding: 28px 32px; }
    .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e0f2fe; }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 8px; }
    .stat-card { background: #f0f9ff; border-radius: 14px; padding: 16px 12px; text-align: center; border-left: 5px solid #0ea5e9; }
    .stat-card.purple { border-left-color: #8b5cf6; }
    .stat-card.green  { border-left-color: #10b981; }
    .stat-card.orange { border-left-color: #f59e0b; }
    .stat-card .val { font-size: 30px; font-weight: 800; color: #0ea5e9; }
    .stat-card.purple .val { color: #8b5cf6; }
    .stat-card.green  .val { color: #10b981; }
    .stat-card.orange .val { color: #f59e0b; }
    .stat-card .lbl { font-size: 11px; color: #94a3b8; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #0ea5e9; color: white; padding: 9px 8px; text-align: left; font-weight: 700; }
    td { padding: 8px; color: #475569; border-bottom: 1px solid #f0f9ff; }
    .footer { margin-top: 32px; padding: 14px 32px; background: #f8fafc; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e0f2fe; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>🔵 DrogueCollect</h1>
    <p>Rapport de données — Collecte anonyme au Sénégal</p>
    <div class="date">Généré le ${dateStr}</div>
  </div>

  <div class="content">

    <div class="section-title">📊 Résumé statistique</div>
    <div class="stats-grid">
      <div class="stat-card"><div class="val">${total}</div><div class="lbl">Total soumissions</div></div>
      <div class="stat-card purple"><div class="val">${thisMonth}</div><div class="lbl">Ce mois-ci</div></div>
      <div class="stat-card green"><div class="val">${uniqueRegions.length}</div><div class="lbl">Régions couvertes</div></div>
      <div class="stat-card orange"><div class="val">${uniqueSubstances.length}</div><div class="lbl">Substances répertoriées</div></div>
    </div>

    ${ageData.length > 0 ? `
    <div class="section-title">👥 Répartition par tranche d'âge</div>
    ${barHTML(ageData, "name", "value", ageTotal)}` : ""}

    ${substanceData.length > 0 ? `
    <div class="section-title">🧪 Substances les plus consommées</div>
    ${barHTML(substanceData, "name", "value", subTotal)}` : ""}

    ${regionData.length > 0 ? `
    <div class="section-title">🗺️ Répartition par région</div>
    ${barHTML(regionData, "region", "count", regTotal)}` : ""}

    <div class="section-title">📋 Toutes les soumissions (${total})</div>
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Tranche d'âge</th><th>Région</th><th>Substances</th>
          <th>Fréquence</th><th>Mode</th><th>Durée</th><th>Veut arrêter</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>

  </div>

  <div class="footer">
    DrogueCollect — Données anonymes et confidentielles — Sénégal — ${dateStr}
  </div>

  <div class="no-print" style="text-align:center;padding:20px;background:#f0f9ff">
    <p style="font-size:14px;color:#0369a1;margin-bottom:12px;font-weight:600">
      ✅ Cliquez sur le bouton ci-dessous pour sauvegarder en PDF
    </p>
    <button onclick="window.print()" style="padding:12px 28px;background:linear-gradient(135deg,#38bdf8,#0369a1);color:white;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer">
      🖨️ Sauvegarder en PDF
    </button>
  </div>

  <script>
    // Impression automatique après chargement
    window.onload = () => setTimeout(() => window.print(), 800);
  <\/script>
</body>
</html>`;

    // Ouvrir dans un nouvel onglet
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "4px solid #e0f2fe", borderTopColor: "#0ea5e9", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#94a3b8", fontWeight: 600 }}>Chargement des données...</p>
      </div>
    </div>
  );

  return (
    <div className="mobile-pad" style={{ padding: "90px 20px 40px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: 26, color: "#0f172a", marginBottom: 6 }}>{t.adminTitle}</h1>
        <p style={{ color: "#94a3b8" }}>{t.adminSub}</p>
      </div>

      {/* Statistiques globales */}
      <div className="mobile-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: t.totalSubmissions, value: total, icon: "📋", color: "#0ea5e9" },
          { label: t.thisMonth, value: thisMonth, icon: "📅", color: "#8b5cf6" },
          { label: t.regions_stat, value: uniqueRegions.length, icon: "🗺️", color: "#10b981" },
          { label: t.substances_stat, value: uniqueSubstances.length, icon: "🧪", color: "#f59e0b" },
        ].map((s, i) => (
          <GlassCard key={i} style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {total === 0 ? (
        <GlassCard style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
          <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Aucune soumission pour l'instant</h3>
          <p style={{ color: "#94a3b8" }}>Les données apparaîtront ici dès qu'un utilisateur soumettra le questionnaire.</p>
        </GlassCard>
      ) : (
        <>
          {/* Graphiques */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, marginBottom: 20 }}>
            {ageData.length > 0 && (
              <GlassCard>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a", fontSize: 14 }}>{t.ageDistrib}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ageData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e0f2fe" }} />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                      {ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            )}

            {substanceData.length > 0 && (
              <GlassCard>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a", fontSize: 14 }}>{t.substanceDistrib}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={substanceData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {substanceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(val, name) => [val, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, marginBottom: 20 }}>
            {trendData.length > 0 && (
              <GlassCard>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a", fontSize: 14 }}>{t.trendsTitle}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e0f2fe" }} />
                    <Line type="monotone" dataKey="submissions" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: "#0ea5e9", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            )}

            {regionData.length > 0 && (
              <GlassCard>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a", fontSize: 14 }}>{t.regionDistrib}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={regionData} layout="vertical" barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 12 }} />
                    <Bar dataKey="count" fill="#38bdf8" radius={[0, 6, 6, 0]}>
                      {regionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            )}
          </div>

          {/* Carte du Sénégal */}
          <SenegalMap regionData={regionData} total={total} />

          {/* Tableau des dernières entrées */}
          <GlassCard style={{ marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 16, fontSize: 15 }}>
              📋 Dernières soumissions ({total})
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table className="mobile-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e0f2fe" }}>
                    {["Date", "Tranche d'âge", "Région", "Substances", "Fréquence", "Veut arrêter"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#0369a1", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 20).map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f0f9ff", background: i % 2 === 0 ? "rgba(240,249,255,0.5)" : "transparent" }}>
                      <td style={{ padding: "10px 12px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(s.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 99, background: "#e0f2fe", color: "#0369a1", fontSize: 12, fontWeight: 600 }}>
                          {s.age_range || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#475569" }}>{s.region || "—"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(s.substances || []).slice(0, 2).map((sub, j) => (
                            <span key={j} style={{ padding: "2px 8px", borderRadius: 99, background: "#fef3c7", color: "#d97706", fontSize: 11, fontWeight: 600 }}>
                              {sub}
                            </span>
                          ))}
                          {(s.substances || []).length > 2 && (
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>+{s.substances.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#475569", fontSize: 12 }}>{s.frequency || "—"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{
                          padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                          background: s.stop_intention?.includes("arrêter") ? "#dcfce7" : "#fee2e2",
                          color: s.stop_intention?.includes("arrêter") ? "#16a34a" : "#dc2626",
                        }}>
                          {s.stop_intention || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {total > 20 && (
                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 12 }}>
                  Affichage des 20 dernières sur {total} soumissions — exportez le PDF pour tout voir
                </p>
              )}
            </div>
          </GlassCard>
        </>
      )}

      {/* Bouton export PDF */}
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <button onClick={exportPDF} disabled={total === 0} style={{
          padding: "13px 28px", borderRadius: 14, border: "none",
          background: total === 0 ? "#e2e8f0" : "linear-gradient(135deg,#38bdf8,#0369a1)",
          color: total === 0 ? "#94a3b8" : "white",
          fontWeight: 700, cursor: total === 0 ? "not-allowed" : "pointer",
          boxShadow: total === 0 ? "none" : "0 6px 20px rgba(14,165,233,0.35)",
          fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Exporter le rapport PDF
        </button>
        {total === 0 && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Aucune donnée à exporter pour l'instant.</p>}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function DrogueCollect() {
  const [lang, setLang] = useState("fr");

  const [page, setPage] = useState(() => {
    return localStorage.getItem("droguecollect_page") || "home";
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("droguecollect_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState([]);

  // Sauvegarder l'utilisateur dans le navigateur
  useEffect(() => {
    if (user) localStorage.setItem("droguecollect_user", JSON.stringify(user));
    else localStorage.removeItem("droguecollect_user");
  }, [user]);

  // Sauvegarder la page active dans le navigateur
  useEffect(() => {
    localStorage.setItem("droguecollect_page", page);
  }, [page]);

  const t = T[lang];

  const addHistory = async (answers) => {
    const { error } = await supabase
      .from("submissions")
      .insert({
        age_range: answers.age,
        region: answers.region,
        gender: answers.gender,
        substances: answers.substances || [],
        frequency: answers.frequency,
        consumption_mode: answers.mode || [],
        reasons: answers.reasons || [],
        effects: answers.effects || [],
        duration: answers.duration,
        place: answers.place,
        health_access: answers.access,
        stop_intention: answers.stop,
      });

    if (error) {
      console.error("Erreur envoi données:", error);
    } else {
      console.log("Données envoyées avec succès !");
    }

    setHistory(prev => [{
      ...answers,
      date: new Date().toLocaleDateString("fr-FR"),
      id: Date.now(),
    }, ...prev]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 40%,#dbeafe 100%)", position: "relative", WebkitTextSizeAdjust: "100%" }}>
      <style>{`
        @media (max-width: 768px) {
          .glass-card { border-radius: 18px !important; padding: 18px 16px !important; }
          body { -webkit-text-size-adjust: 100%; }
        }
      `}</style>
      <LiquidBlobs />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav page={page} setPage={setPage} user={user} setUser={setUser} lang={lang} setLang={setLang} t={t} />
        {page === "home" && <HomePage setPage={setPage} t={t} />}
        {page === "auth" && <AuthPage setPage={setPage} setUser={setUser} t={t} />}
        {page === "questionnaire" && <QuestionnairePage setPage={setPage} t={t} addHistory={addHistory} />}
        {page === "history" && <HistoryPage t={t} history={history} />}
        {page === "resources" && <ResourcesPage t={t} />}
        {page === "admin" && <AdminPage t={t} />}
      </div>
    </div>
  );
}