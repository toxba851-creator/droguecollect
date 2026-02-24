import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from './supabaseClient';
import emailjs from '@emailjs/browser';

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE  = 'service_euqbqsg';
const EMAILJS_TEMPLATE = 'template_74j0hhg';
const EMAILJS_KEY      = 'SOv-Z1lbJvOU85lI5';

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
const LOGO_B64 = "data:image/png;base64,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AAPJ7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z";

// ─── BACKGROUND LÉGER ─────────────────────────────────────────────────────────
function LiquidBlobs() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 70%, #eff6ff 100%)",
    }}>
      <div style={{ position:"absolute", top:"-10%", left:"-5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)", willChange:"transform", animation:"blobA 20s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)", willChange:"transform", animation:"blobB 25s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", top:"40%", left:"45%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(186,230,253,0.2) 0%, transparent 70%)", willChange:"transform", animation:"blobA 18s ease-in-out infinite reverse" }}/>
      <style>{`
        @keyframes blobA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-30px)} }
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
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: "0 4px 16px rgba(14,165,233,0.08), 0 1px 4px rgba(0,0,0,0.04)",
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
      background: selected ? "linear-gradient(135deg,#e0f2fe,#bfdbfe)" : "rgba(255,255,255,0.9)",
      color: selected ? "#0369a1" : "#475569",
      fontWeight: selected ? 700 : 500, cursor: "pointer",
      fontSize: 14,
      transition: "border-color 0.15s ease, background 0.15s ease, color 0.15s ease",
      boxShadow: selected ? "0 2px 8px rgba(14,165,233,0.2)" : "none",
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
        <div style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src={LOGO_B64} alt="DrogueCollect" style={{ height: 36, width: "auto", display: "block", objectFit: "contain" }} />
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
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src={LOGO_B64} alt="DrogueCollect" style={{ height: 72, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 16px rgba(14,165,233,0.3))" }} />
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
      // ─── Envoyer la notification email ───────────────────────────────────
      try {
        const now = new Date();
        await emailjs.send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          {
            region:     answers.region     || "Non renseignée",
            age:        answers.age        || "Non renseigné",
            substances: (answers.substances || []).join(", ") || "Non renseignées",
            date:       now.toLocaleDateString("fr-FR") + " à " + now.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" }),
          },
          EMAILJS_KEY
        );
        console.log("Email de notification envoyé !");
      } catch (emailErr) {
        console.warn("Email non envoyé :", emailErr);
      }
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
        *, *::before, *::after { box-sizing: border-box; }
        body { -webkit-text-size-adjust: 100%; text-rendering: optimizeSpeed; }
        .glass-card { will-change: auto; contain: layout style; }
        button { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 768px) {
          .glass-card { border-radius: 18px !important; padding: 18px 16px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
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