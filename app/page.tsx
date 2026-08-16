"use client";

import { FormEvent, useEffect, useState } from "react";

const contact = {
  whatsapp: "https://wa.me/243838318812",
  email: "mnssmukendi0@gmail.com",
  socials: {
    LinkedIn: "https://www.linkedin.com/in/manass%C3%A9-mukendi-75412b295/",
    Instagram: "https://www.instagram.com/sir_manasse_mukendi/?hl=fr",
    Facebook: "https://www.facebook.com/manasse.mkd",
  },
};

const services = [
  ["01", "Community Management", "Gestion quotidienne de vos réseaux sociaux, animation de communauté, modération et développement de votre présence digitale."],
  ["02", "Social Media Management", "Planification éditoriale, stratégie de contenu, calendrier de publication et optimisation de vos réseaux sociaux."],
  ["03", "Stratégie Digitale", "Je construis une stratégie adaptée à vos objectifs, votre audience et votre marché."],
  ["04", "Création de contenu", "Conception de contenus pensés pour informer, engager et convertir votre audience."],
  ["05", "Publicité digitale", "Création et optimisation de campagnes Meta pour atteindre les bonnes audiences et maximiser les performances."],
  ["06", "Communication de marque", "J’aide les entreprises et organisations à structurer leur communication et une image cohérente."],
];

const projects = [
  { name: "Contenu immobilier", client: "IMMO KONNECT", type: "Social Media", sector: "Immobilier", mission: "Création de contenu", result: "Visuel promotionnel", image: "/images/projects/immo-konnect.jpeg" },
  { name: "Couverture du FLMDA 2026", client: "FESTIVAL DES LANGUES MATERNELLES", type: "Communication", sector: "Événementiel", mission: "Couverture en direct", result: "Publication événementielle", image: "/images/projects/flmda-live.jpeg" },
  { name: "Campagne trafic FLMDA", client: "FLMDA RDC", type: "Publicité", sector: "Événementiel", mission: "Campagne Meta Ads", result: "29 992 personnes touchées", image: "/images/projects/flmda-campaign.jpeg" },
  { name: "Billetterie connectée", client: "EVANTURA", type: "Social Media", sector: "Événementiel", mission: "Création de contenu", result: "Visuel promotionnel", image: "/images/projects/evantura.jpeg" },
  { name: "Identité visuelle", client: "AMAL HOLDING", type: "Branding", sector: "Holding", mission: "Logo & déclinaisons", result: "Brand guidelines 2026", image: "/images/projects/amal-holding.jpeg" },
];

const steps = [["01", "Analyser", "Comprendre votre marque, votre marché, votre audience et vos objectifs."], ["02", "Stratégiser", "Définir le positionnement, les messages et la stratégie adaptée."], ["03", "Créer", "Produire des contenus cohérents, pertinents et engageants."], ["04", "Diffuser", "Publier et promouvoir les contenus auprès des bonnes audiences."], ["05", "Mesurer", "Analyser les performances et optimiser continuellement la stratégie."]];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("Tous");
  const [formMessage, setFormMessage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section:not(.hero), main > footer"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    sections.forEach((section) => section.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? window.scrollY / height : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);
  const visible = filter === "Tous" ? projects : projects.filter((p) => p.type === filter || (filter === "Campagnes" && p.type === "Publicité"));
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setFormMessage("Envoi en cours...");
    try {
      const response = await fetch("https://formsubmit.co/ajax/mnssmukendi0@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setFormMessage("Merci, votre demande a bien été envoyée.");
    } catch {
      setFormMessage("L’envoi a échoué. Veuillez réessayer ou me contacter par WhatsApp.");
    }
  };
  const nav = ["Services", "À propos", "Méthode", "Réalisations", "Contact"];
  return <main>
    <div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${scrollProgress})` }}></div>
    <header className={`nav ${scrollProgress > .015 ? "scrolled" : ""}`}><a className="brand" href="#accueil">MM<span>·</span></a><nav className={menu ? "open" : ""}>{nav.map(x => <a onClick={() => setMenu(false)} href={`#${x.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(" ", "-")}`} key={x}>{x}</a>)}</nav><a className="nav-cta" href="#contact">Échangeons <i>↗</i></a><button className="menu" aria-label="Ouvrir le menu" onClick={() => setMenu(!menu)}>{menu ? "×" : "☰"}</button></header>

    <section className="hero" id="accueil"><div className="hero-copy"><p className="eyebrow light">MANASSÉ MUKENDI <span>/</span> KINSHASA, RDC</p><h1>La communication qui <em>déplace</em> les marques.</h1><p className="intro">Stratégie, contenu, réseaux sociaux et publicité digitale : j’aide les marques à mieux communiquer, attirer leur audience et obtenir des résultats.</p><div className="actions"><a className="button white" href="#contact">Travaillons ensemble <b>↗</b></a><a className="text-link" href="#realisations">Voir mes réalisations <b>↓</b></a></div></div><div className="orbit" aria-hidden="true"><div className="orbit-ring"></div><div className="orbit-core"><span>digital</span><strong>impact</strong></div><span className="tag t1">STRATÉGIE</span><span className="tag t2">SOCIAL</span><span className="tag t3">CONTENU</span><span className="dot d1"></span><span className="dot d2"></span></div><div className="hero-foot"><span>Community Manager · Social Media Manager · Marketeur Digital</span><span>Disponible pour des projets en RDC et à l’international <b>●</b></span></div></section>

    <section className="section services" id="services"><div className="section-head"><p className="eyebrow">01 / EXPERTISE</p><h2>Ce que je peux faire<br/>pour votre marque.</h2></div><div className="service-grid">{services.map(([n,t,d]) => <article className="service" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><i>↗</i></article>)}</div></section>

    <section className="about" id="a-propos"><div className="portrait"><div className="portrait-photo" role="img" aria-label="Portrait créatif de Manassé Mukendi dans l'univers du marketing digital"></div><div className="portrait-note">MANASSÉ<br/>MUKENDI <b>↗</b></div></div><div className="about-copy"><p className="eyebrow">02 / À PROPOS</p><h2>Derrière la stratégie,<br/>il y a une <em>vision.</em></h2><div className="bio"><p>Je suis Manassé Mukendi, Community Manager, Social Media Manager et Marketeur Digital basé à Kinshasa.</p><p>Mon travail ne consiste pas simplement à publier du contenu. Je cherche à comprendre une marque, son audience, ses objectifs et son environnement afin de construire une communication qui a du sens.</p><p>Ma vision est simple : une bonne communication ne doit pas seulement attirer l’attention. Elle doit créer de la confiance et contribuer aux objectifs de l’entreprise.</p></div><div className="stats">{["Projets réalisés", "Marques accompagnées", "Campagnes", "Années d’expérience"].map(s => <div key={s}><strong>—</strong><span>{s}</span></div>)}</div></div></section>

    <section className="section method" id="methode"><div className="section-head"><p className="eyebrow">03 / PROCESSUS</p><h2>Une méthode simple.<br/>Une stratégie pensée<br/>pour les <em>résultats.</em></h2></div><div className="timeline">{steps.map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><b>↘</b></article>)}</div></section>

    <section className="work" id="realisations"><div className="work-head"><div><p className="eyebrow light">04 / RÉALISATIONS</p><h2>Quelques projets<br/><em>en mouvement.</em></h2></div><p>Une sélection de collaborations. Chaque projet est une réponse unique à un enjeu de marque.</p></div><div className="filters">{["Tous", "Social Media", "Branding", "Campagnes", "Communication", "Publicité"].map(x => <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div><div className="project-grid">{visible.map((p,i) => <article className="project" key={p.name}><div className="project-art"><img src={p.image} alt={`${p.name} — ${p.client}`}/><span>{p.type}</span><b>{String(i+1).padStart(2,"0")}</b><i>↗</i></div><div className="project-info"><p>{p.client} <span>/ {p.sector}</span></p><h3>{p.name}</h3><div><small>MISSION<br/><b>{p.mission}</b></small><small>RÉSULTAT<br/><b>{p.result}</b></small></div></div></article>)}</div></section>

    <section className="reasons"><p className="eyebrow">05 / APPROCHE</p><h2>Pas seulement publier.<br/>Construire une <em>présence.</em></h2><div>{[["Une vision stratégique", "Chaque action s’inscrit dans une direction claire."], ["Des contenus pour votre audience", "Des idées utiles, adaptées aux personnes que vous voulez toucher."], ["Une communication cohérente", "Votre marque reste reconnaissable à chaque point de contact."], ["Une approche orientée résultats", "L’attention est un début : les objectifs sont la destination."]].map(([t,d],i) => <article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section className="cta"><p className="eyebrow light">UN PROJET EN TÊTE ?</p><h2>Votre prochaine étape<br/>commence <em>ici.</em></h2><p>Vous avez un projet, une marque à développer ou une communication à repenser ? Parlons-en.</p><div className="actions"><a className="button white" href="#contact">Remplir le formulaire <b>↗</b></a></div><a className="whatsapp-link" href={contact.whatsapp} target="_blank" rel="noreferrer">Préférez un message rapide ? WhatsApp ↗</a></section>

    <section className="contact section" id="contact"><div className="section-head"><p className="eyebrow">06 / CONTACT</p><h2>Parlons de<br/>votre <em>projet.</em></h2><p>Décrivez-moi votre besoin. Je vous répondrai dans les meilleurs délais.</p><a className="mail" href={`mailto:${contact.email}`}>{contact.email} ↗</a></div><form onSubmit={submit}><input className="honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off"/><input type="hidden" name="_subject" value="Nouvelle demande — site Manassé Mukendi"/><input type="hidden" name="_template" value="table"/>{[["Nom", "text", "name"], ["Email", "email", "email"], ["Téléphone", "tel", "phone"], ["Entreprise", "text", "company"]].map(([p,t,n]) => <label key={p}><span>{p}</span><input name={n} required={p === "Nom" || p === "Email"} type={t} placeholder={p === "Nom" ? "Votre nom" : ""}/></label>)}<label><span>Service recherché</span><select name="service" defaultValue=""><option disabled value="">Choisir un service</option>{services.map(x => <option key={x[1]}>{x[1]}</option>)}</select></label><label><span>Budget</span><select name="budget" defaultValue=""><option disabled value="">Votre budget estimatif</option><option>À définir ensemble</option><option>Moins de 500 $</option><option>500 $ – 1 500 $</option><option>Plus de 1 500 $</option></select></label><label className="full"><span>Message</span><textarea name="message" required placeholder="Parlez-moi de votre projet..."></textarea></label><div className="form-end"><p>{formMessage || "Les champs marqués sont nécessaires."}</p><button className="button dark">Envoyer ma demande <b>↗</b></button></div></form></section>

    <footer><div><a className="brand" href="#accueil">MM<span>·</span></a><p>Community Manager · Social Media Manager<br/>Marketeur Digital</p></div><p className="motto">Stratégie.<br/><em>Créativité.</em><br/>Résultats.</p><div className="footer-links">{Object.entries(contact.socials).map(([n,l]) => <a key={n} href={l}>{n} ↗</a>)}</div><small>© 2026 Manassé Mukendi. Tous droits réservés.</small></footer>
  </main>;
}
