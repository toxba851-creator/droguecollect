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

// ─── CARTE SÉNÉGAL ────────────────────────────────────────────────────────────
const SENEGAL_REGIONS = [
  { name:"Saint-Louis", path:"M 0,0 L 255,0 L 255,128 L 155,140 L 80,140 L 30,115 L 0,75 Z", lx:110, ly:65 },
  { name:"Louga",       path:"M 255,0 L 445,0 L 440,45 L 425,140 L 295,140 L 255,128 Z",      lx:340, ly:68 },
  { name:"Matam",       path:"M 445,0 L 500,0 L 500,180 L 425,140 L 440,45 Z",                lx:466, ly:88 },
  { name:"Dakar",       path:"M 0,165 L 35,155 L 50,175 L 38,207 L 0,212 Z",                  lx:18,  ly:186 },
  { name:"Thiès",       path:"M 35,155 L 105,140 L 155,140 L 140,192 L 92,207 L 50,207 L 38,207 L 50,175 Z", lx:95, ly:172 },
  { name:"Diourbel",    path:"M 155,140 L 255,128 L 255,142 L 245,207 L 175,222 L 140,192 Z", lx:197, ly:177 },
  { name:"Fatick",      path:"M 92,207 L 140,192 L 175,222 L 160,257 L 98,267 L 68,242 L 75,217 Z", lx:115, ly:232 },
  { name:"Kaolack",     path:"M 175,222 L 245,207 L 282,232 L 270,277 L 205,282 L 160,257 Z", lx:217, ly:247 },
  { name:"Kaffrine",    path:"M 245,207 L 425,140 L 422,257 L 337,282 L 282,232 Z",           lx:340, ly:222 },
  { name:"Tambacounda", path:"M 422,257 L 500,180 L 500,367 L 432,382 L 367,327 L 337,282 Z", lx:432, ly:295 },
  { name:"Kédougou",    path:"M 432,382 L 500,367 L 500,400 L 432,400 Z",                     lx:462, ly:392 },
  { name:"Kolda",       path:"M 270,277 L 337,282 L 367,327 L 352,372 L 282,377 L 247,337 L 247,307 Z", lx:307, ly:327 },
  { name:"Sédhiou",     path:"M 160,257 L 205,282 L 247,307 L 247,337 L 197,362 L 140,347 L 120,307 Z", lx:187, ly:317 },
  { name:"Ziguinchor",  path:"M 68,242 L 98,267 L 120,307 L 140,347 L 100,377 L 48,372 L 28,347 L 48,297 Z", lx:82, ly:327 },
];

function SenegalMap({ regionData, total }) {
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  // Construire un dictionnaire count par région
  const countMap = {};
  regionData.forEach(r => { countMap[r.region] = r.count; });
  const maxCount = Math.max(...regionData.map(r => r.count), 1);

  const getColor = (name) => {
    const count = countMap[name] || 0;
    if (count === 0) return "#e0f2fe";
    const intensity = count / maxCount;
    if (intensity > 0.75) return "#0369a1";
    if (intensity > 0.5)  return "#0ea5e9";
    if (intensity > 0.25) return "#38bdf8";
    return "#bfdbfe";
  };

  const getPct = (name) => {
    const count = countMap[name] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const hov = hovered ? SENEGAL_REGIONS.find(r => r.name === hovered) : null;

  return (
    <GlassCard style={{ marginBottom: 20 }}>
      <style>{`
        .map-region { transition: all 0.4s cubic-bezier(.4,0,.2,1); cursor: pointer; }
        .map-region:hover { filter: brightness(1.15) drop-shadow(0 4px 12px rgba(14,165,233,0.4)); }
        @keyframes mapFadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .map-appear { animation: mapFadeIn 0.6s ease forwards; }
        @keyframes pulse-dot { 0%,100%{r:5;opacity:1} 50%{r:8;opacity:0.7} }
      `}</style>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <h3 style={{ fontWeight:700, color:"#0f172a", fontSize:15 }}>🗺️ Carte des régions — Sénégal</h3>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {[["#bfdbfe","Faible"],["#38bdf8","Moyen"],["#0ea5e9","Élevé"],["#0369a1","Très élevé"]].map(([color, label]) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:color }}/>
              <span style={{ fontSize:10, color:"#64748b" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"start" }}>
        {/* Carte SVG */}
        <div style={{ position:"relative", width:"100%" }}>
          <svg
            viewBox="0 0 500 400"
            style={{ width:"100%", maxWidth:500, height:"auto", filter:"drop-shadow(0 8px 24px rgba(14,165,233,0.15))" }}
            className={animated ? "map-appear" : ""}
          >
            {/* Fond océan */}
            <rect width="500" height="400" fill="#f0f9ff" rx="12"/>

            {/* Gambie (bande blanche) */}
            <path d="M 48,275 L 247,275 L 247,307 L 245,315 L 205,282 L 160,257 L 98,267 L 68,260 Z"
              fill="white" opacity="0.7" stroke="#bfdbfe" strokeWidth="1"/>
            <text x="148" y="292" fontSize="7" fill="#94a3b8" textAnchor="middle" fontWeight="600">GAMBIE</text>

            {/* Régions */}
            {SENEGAL_REGIONS.map((region, i) => {
              const count = countMap[region.name] || 0;
              const pct = getPct(region.name);
              const isHov = hovered === region.name;
              return (
                <g key={region.name}
                  onMouseEnter={() => setHovered(region.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setHovered(isHov ? null : region.name)}
                  className="map-region"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <path
                    d={region.path}
                    fill={getColor(region.name)}
                    stroke="white"
                    strokeWidth={isHov ? "2.5" : "1.5"}
                    strokeLinejoin="round"
                    opacity={animated ? 1 : 0}
                    style={{
                      transition: `fill 0.3s ease, stroke-width 0.2s ease`,
                      filter: isHov ? "brightness(1.1)" : "none",
                    }}
                  />
                  {/* Point animé si données */}
                  {count > 0 && (
                    <circle cx={region.lx} cy={region.ly - 14} r="5" fill="white" opacity="0.9"
                      style={{ animation: "pulse-dot 2s ease infinite" }}/>
                  )}
                  {/* Label région */}
                  <text
                    x={region.lx} y={region.ly}
                    textAnchor="middle" fontSize={region.name.length > 10 ? "7" : "8"}
                    fontWeight="700" fill={countMap[region.name] > 0 ? "white" : "#64748b"}
                    style={{ pointerEvents:"none", userSelect:"none" }}
                  >
                    {region.name}
                  </text>
                  {/* Pourcentage */}
                  {pct > 0 && (
                    <text x={region.lx} y={region.ly + 11} textAnchor="middle" fontSize="8"
                      fontWeight="800" fill="white" opacity="0.95" style={{ pointerEvents:"none" }}>
                      {pct}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Trait côtier décoratif */}
            <path d="M 0,0 L 0,75 L 30,115 L 0,165 L 0,212 L 0,400" stroke="#bfdbfe" strokeWidth="2" fill="none" opacity="0.5"/>
          </svg>

          {/* Tooltip hover */}
          {hov && (
            <div style={{
              position:"absolute", top:8, left:8,
              background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
              borderRadius:14, padding:"12px 16px", boxShadow:"0 8px 24px rgba(14,165,233,0.2)",
              border:"1px solid #e0f2fe", minWidth:160, zIndex:10,
              animation:"mapFadeIn 0.2s ease",
            }}>
              <div style={{ fontWeight:800, fontSize:14, color:"#0f172a", marginBottom:6 }}>{hov.name}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:16 }}>
                  <span style={{ fontSize:12, color:"#64748b" }}>Soumissions</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#0ea5e9" }}>{countMap[hov.name] || 0}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", gap:16 }}>
                  <span style={{ fontSize:12, color:"#64748b" }}>Pourcentage</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#0369a1" }}>{getPct(hov.name)}%</span>
                </div>
                <div style={{ marginTop:6, background:"#e0f2fe", borderRadius:99, height:6, overflow:"hidden" }}>
                  <div style={{ width:`${getPct(hov.name)}%`, height:"100%", background:"linear-gradient(90deg,#38bdf8,#0369a1)", borderRadius:99, transition:"width 0.5s ease" }}/>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Classement régions */}
        <div style={{ minWidth:160, maxWidth:200 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#0369a1", marginBottom:10 }}>🏆 Top régions</div>
          {regionData.length === 0 ? (
            <div style={{ fontSize:12, color:"#94a3b8" }}>Aucune donnée</div>
          ) : regionData.slice(0, 8).map((r, i) => (
            <div key={r.region} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:20, height:20, borderRadius:6, background:i===0?"linear-gradient(135deg,#fbbf24,#f59e0b)":i===1?"linear-gradient(135deg,#94a3b8,#64748b)":i===2?"linear-gradient(135deg,#cd7c5a,#b45309)":"#e0f2fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:i<3?"white":"#0369a1", flexShrink:0 }}>
                {i+1}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.region}</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>{r.count} · {Math.round((r.count/total)*100)}%</div>
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