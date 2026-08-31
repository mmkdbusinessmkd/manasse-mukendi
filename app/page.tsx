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
  ["01", "Community Management", "Créer une relation active avec votre communauté et renforcer la confiance autour de votre marque."],
  ["02", "Social Media Management", "Construire une présence régulière, cohérente et adaptée à votre audience."],
  ["03", "Stratégie digitale", "Donner une direction claire à votre communication."],
  ["04", "Création de contenu", "Transformer vos idées, vos offres et vos actualités en contenus qui parlent réellement à votre audience."],
  ["05", "Publicité digitale", "Accélérer votre visibilité et toucher les bonnes personnes avec un budget maîtrisé."],
  ["06", "Communication de marque", "Travailler la manière dont votre entreprise se présente, parle et est perçue."],
];

const projects = [
  { name: "Votre image parle avant vous", client: "LE COMMUNITY MANAGER", type: "Social Media", sector: "Personal branding", context: "Renforcer la perception d’expertise autour de la marque personnelle.", intervention: "Conception éditoriale et visuelle de contenus de sensibilisation.", result: "Une communication plus claire, cohérente et identifiable.", image: "/images/projects/le-community-manager.webp" },
  { name: "Septembre, c’est la rentrée", client: "SAFIA BELLA", type: "Social Media", sector: "Personal branding", context: "Créer une prise de parole de rentrée alignée avec l’univers personnel de Safia Bella.", intervention: "Direction artistique, composition graphique et adaptation du message pour les réseaux sociaux.", result: "Un contenu de saison expressif, cohérent et immédiatement identifiable.", image: "/images/projects/safia-bella-rentree.webp" },
  { name: "Contenu immobilier", client: "IMMO KONNECT", type: "Social Media", sector: "Immobilier", context: "Valoriser l’offre immobilière et soutenir sa visibilité en ligne.", intervention: "Création de contenus promotionnels adaptés aux réseaux sociaux.", result: "Des messages plus lisibles et une présence visuelle plus professionnelle.", image: "/images/projects/immo-konnect.jpeg" },
  { name: "Couverture du FLMDA 2026", client: "FESTIVAL DES LANGUES MATERNELLES", type: "Communication", sector: "Événementiel", context: "Faire vivre l’événement en temps réel auprès de la communauté.", intervention: "Couverture en direct, rédaction et publication de contenus événementiels.", result: "Une actualité continue et une meilleure visibilité des temps forts.", image: "/images/projects/flmda-live.jpeg" },
  { name: "Campagne trafic FLMDA", client: "FLMDA RDC", type: "Publicité", sector: "Événementiel", context: "Renforcer la visibilité digitale de l’événement.", intervention: "Stratégie éditoriale, création de contenus, gestion des canaux et suivi de la communication.", result: "29 992 personnes touchées, progression de la communauté et forte production de contenus.", image: "/images/projects/flmda-campaign.jpeg" },
  { name: "Événement de la semaine", client: "EVANTURA", type: "Social Media", sector: "Événementiel", context: "Rendre l’offre événementielle immédiatement compréhensible et attractive.", intervention: "Direction artistique et conception de visuels de campagne sur Photoshop.", result: "Une campagne visuelle cohérente avec l’univers et l’offre de la plateforme.", image: "/images/projects/evantura-evenement-semaine.webp" },
  { name: "Identité visuelle", client: "AMAL HOLDING", type: "Branding", sector: "Holding", context: "Installer une identité visuelle claire pour un groupe en développement.", intervention: "Conception du logo principal et de ses déclinaisons.", result: "Une identité cohérente, polyvalente et prête à être déployée.", image: "/images/projects/amal-holding.jpeg" },
];

const steps = [["01", "Comprendre", "Votre activité, vos objectifs et votre audience."], ["02", "Structurer", "Le positionnement, les messages et la stratégie."], ["03", "Créer", "Les contenus, campagnes et supports."], ["04", "Mesurer", "Ce qui fonctionne, ce qui doit évoluer et les prochaines actions."]];

const certifications = [
  "Community Management",
  "Social Media",
  "Publicité digitale",
  "Stratégie de contenu",
];

const sectors = ["Santé", "Immobilier", "Événementiel", "Technologie", "Institutionnel", "Commerce"];

const navigation = [
  { label: "Accueil", target: "accueil" },
  { label: "Services", target: "services" },
  { label: "À propos", target: "a-propos" },
  { label: "Réalisations", target: "realisations" },
  { label: "Contact", target: "contact" },
];

function BrandGlyph({ className = "" }: { className?: string }) {
  return <span className={`brand-glyph ${className}`.trim()} aria-hidden="true"><span></span><span></span><span></span><span></span></span>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("Tous");
  const [formMessage, setFormMessage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("accueil");
  useEffect(() => {
    if (window.location.hostname === "manasse-mukendi.vercel.app") {
      window.location.replace(`https://www.manasse-mukendi.com${window.location.pathname}${window.location.search}${window.location.hash}`);
    }
  }, []);
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
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (hash && target !== hash && document.getElementById(target)) {
      history.replaceState(null, "", `#${target}`);
      document.getElementById(target)?.scrollIntoView();
    }
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
  useEffect(() => {
    const targets = navigation.map(({ target }) => target)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    targets.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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
  return <main>
    <div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${scrollProgress})` }}></div>
    <header className={`nav ${scrollProgress > .015 ? "scrolled" : ""}`}><a className="brand brand-logo" href="#accueil" aria-label="Accueil — Manassé Mukendi"><img src="/images/brand/logo-mm.png" alt="Manassé Mukendi"/></a><nav className={menu ? "open" : ""}>{navigation.map(({ label, target }) => <a aria-current={activeSection === target ? "page" : undefined} className={activeSection === target ? "active" : ""} onClick={() => setMenu(false)} href={`#${target}`} key={target}>{label}</a>)}</nav><a className="nav-cta" href="#contact">Échangeons <BrandGlyph className="compact"/></a><button className="menu" aria-expanded={menu} aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMenu(!menu)}>{menu ? "×" : "☰"}</button></header>

    <section className="hero" id="accueil"><div className="hero-copy"><p className="eyebrow light">MANASSÉ MUKENDI <span>/</span> KINSHASA, RDC</p><h1><span className="headline-lead">La communication</span> qui <em>déplace</em> les marques.</h1><p className="intro">J’aide les entreprises à mieux structurer leur image, leur communication et leur présence digitale pour être mieux comprises, mieux perçues et mieux choisies.</p><div className="actions"><a className="button white" href="#services">Découvrir mes services <BrandGlyph/></a><a className="button button-ghost" href="#contact">Parler de votre projet <span className="button-dot" aria-hidden="true"></span></a></div></div><div className="orbit" aria-hidden="true"><div className="orbit-ring"></div><div className="orbit-core"><span>digital</span><strong>impact</strong></div><span className="tag t1">STRATÉGIE</span><span className="tag t2">SOCIAL</span><span className="tag t3">CONTENU</span><span className="dot d1"></span><span className="dot d2"></span></div><div className="hero-foot"><span>Community Manager · Social Media Manager · Marketeur Digital</span><span>Disponible pour des projets en RDC et à l’international <b>●</b></span></div></section>

    <section className="section services" id="services"><div className="section-head"><p className="eyebrow">01 / EXPERTISE</p><h2>Ce que je peux faire<br/>pour votre marque.</h2></div><div className="service-grid">{services.map(([n,t,d]) => <article className="service" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><BrandGlyph className="card-glyph"/></article>)}</div></section>

    <section className="about" id="a-propos"><div className="portrait"><div className="portrait-photo" role="img" aria-label="Portrait créatif de Manassé Mukendi dans l’univers du marketing digital"></div><div className="portrait-note">MANASSÉ<br/>MUKENDI <BrandGlyph className="outline"/></div></div><div className="about-copy"><p className="eyebrow">02 / À PROPOS</p><h2>Je ne commence jamais<br/>par <em>publier.</em></h2><div className="bio editorial-bio"><p className="about-lead">Je commence par comprendre.</p><p>Votre marque, vos objectifs, votre audience, votre positionnement et la perception que vous souhaitez construire.</p><p>C’est cette compréhension qui me permet ensuite de proposer une communication cohérente, utile et pensée pour durer.</p></div></div></section>

    <section className="credentials credentials-compact" id="certifications"><div className="credential-intro"><p className="eyebrow light">CERTIFICATIONS / COMPÉTENCES</p><h2>Une expertise nourrie<br/>par la <em>pratique.</em></h2><p>Certifié en Community Management, Social Media, publicité digitale et stratégie de contenu.</p></div><div className="credential-list compact-list">{certifications.map((certificate, index) => <div className="credential-item" key={certificate}><span className="credential-number">0{index + 1}</span><strong>{certificate}</strong><span className="credential-check" aria-hidden="true">✓</span></div>)}</div></section>

    <section className="section method" id="methode"><div className="section-head"><p className="eyebrow">03 / PROCESSUS</p><h2>Une méthode simple.<br/>De la compréhension<br/>aux <em>résultats.</em></h2></div><div className="timeline">{steps.map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><b className="timeline-progress" aria-hidden="true"><span></span></b></article>)}</div></section>

    <section className="section sectors" aria-labelledby="sectors-title"><div className="section-head compact-head"><p className="eyebrow">SECTEURS ACCOMPAGNÉS</p><h2 id="sectors-title">Des contextes différents.<br/>Une même exigence de <em>clarté.</em></h2></div><div className="sector-grid">{sectors.map((sector, index) => <div className="sector-item" key={sector}><span>0{index + 1}</span><strong>{sector}</strong></div>)}</div></section>

    <section className="work" id="realisations"><div className="work-head"><div><p className="eyebrow light">04 / RÉALISATIONS</p><h2>Des projets pensés<br/>comme des <em>réponses.</em></h2></div><p>Au-delà des livrables : le contexte, l’intervention et ce que chaque collaboration a permis de construire.</p></div><div className="filters" aria-label="Filtrer les réalisations">{["Tous", "Social Media", "Branding", "Campagnes", "Communication"].map(x => <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div><div className="project-grid">{visible.map((p,i) => <article className={`project case-study ${i === 0 ? "featured" : ""}`} key={`${filter}-${p.name}`}><div className="project-art"><img src={p.image} alt={`${p.name} — ${p.client}`} loading="lazy" decoding="async"/><div className="project-topline"><span>{i === 0 ? `Cas client · ${p.type}` : p.type}</span><BrandGlyph className="card-glyph light"/></div><b>{String(i+1).padStart(2,"0")}</b>{i === 0 && <p className="project-caption">Étude de cas sélectionnée</p>}</div><div className="project-info"><p className="case-client">CLIENT <strong>{p.client}</strong> <span>/ {p.sector}</span></p><h3>{p.name}</h3><div className="case-details"><div className="case-detail"><small>CONTEXTE</small><p>{p.context}</p></div><div className="case-detail"><small>INTERVENTION</small><p>{p.intervention}</p></div><div className="case-result"><small>RÉSULTAT</small><strong>{p.result}</strong></div></div></div></article>)}</div></section>

    <section className="reasons"><p className="eyebrow">05 / APPROCHE</p><h2>Pas seulement publier.<br/>Construire une <em>présence.</em></h2><div>{[["Une vision stratégique", "Chaque action s’inscrit dans une direction claire."], ["Des contenus pour votre audience", "Des idées utiles, adaptées aux personnes que vous voulez toucher."], ["Une communication cohérente", "Votre marque reste reconnaissable à chaque point de contact."], ["Une approche orientée résultats", "L’attention est un début : les objectifs sont la destination."]].map(([t,d],i) => <article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section className="cta"><p className="eyebrow light">PROCHAINE ÉTAPE</p><h2>Votre communication<br/>peut faire <em>mieux.</em></h2><p>Parlons de votre image, de votre présence digitale et de ce que vous souhaitez construire.</p><div className="actions"><a className="button white" href="#contact">Parler de mon projet <BrandGlyph/></a></div><a className="whatsapp-link" href={contact.whatsapp} target="_blank" rel="noreferrer">Préférez un message rapide ? WhatsApp <span className="link-dot" aria-hidden="true"></span></a></section>

    <section className="contact section" id="contact"><div className="section-head"><p className="eyebrow">06 / CONTACT</p><h2>Parlons de<br/>votre <em>projet.</em></h2><p>Quatre informations suffisent pour commencer. Décrivez-moi votre besoin, je vous répondrai dans les meilleurs délais.</p><a className="mail" href={`mailto:${contact.email}`}>{contact.email} <span className="link-dot" aria-hidden="true"></span></a></div><form onSubmit={submit}><input className="honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off"/><input type="hidden" name="_subject" value="Nouvelle demande — site Manassé Mukendi"/><input type="hidden" name="_template" value="table"/>{[["Nom", "text", "name", "Votre nom"], ["Email", "email", "email", "votre@email.com"], ["Téléphone / WhatsApp", "tel", "phone", "+243 ..."]].map(([p,t,n,placeholder]) => <label key={p}><span>{p}</span><input name={n} required type={t} placeholder={placeholder}/></label>)}<label><span>Service recherché</span><select name="service" required defaultValue=""><option disabled value="">Choisir un service</option>{services.map(x => <option key={x[1]}>{x[1]}</option>)}</select></label><label className="full"><span>Votre besoin</span><textarea name="message" required placeholder="Parlez-moi de votre projet, de vos objectifs et de ce que vous attendez..."></textarea></label><div className="form-end"><p>{formMessage || "Tous les champs sont nécessaires. Votre numéro sert uniquement à vous recontacter."}</p><button className="button dark">Envoyer ma demande <BrandGlyph/></button></div></form></section>

    <footer><div><a className="brand footer-mark" href="#accueil" aria-label="Retour à l'accueil"><img src="/images/brand/icon-mm.png" alt="Manassé Mukendi"/></a><p>Community Manager · Social Media Manager<br/>Marketeur Digital</p></div><p className="motto">Stratégie.<br/><em>Créativité.</em><br/>Résultats.</p><div className="footer-links"><p className="footer-availability">Disponible pour des missions ponctuelles, des accompagnements mensuels et des collaborations à distance.</p>{Object.entries(contact.socials).map(([n,l]) => <a key={n} href={l}>{n} <span className="link-dot" aria-hidden="true"></span></a>)}</div><small>© 2026 Manassé Mukendi. Tous droits réservés.</small></footer>
  </main>;
}
