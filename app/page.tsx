"use client";

import { useEffect, useRef, useState } from "react";
import { trackConversion } from "../lib/conversion-analytics";
import { SHOW_PILOT_PROGRAM, PILOT_PROGRAM_OPTION } from "../lib/pilot-program";
import { PilotProgramBanner } from "./components/PilotProgram";
import ContactForm from "./components/ContactForm";
import { snelStrategy } from "../lib/snel-strategy";

const contact = {
  whatsapp: "https://wa.me/243838318812",
  email: "contact@manasse-mukendi.com",
  socials: {
    LinkedIn: "https://www.linkedin.com/in/manass%C3%A9-mukendi-75412b295/",
    Instagram: "https://www.instagram.com/sir_manasse_mukendi/?hl=fr",
    Facebook: "https://www.facebook.com/manasse.mkd",
  },
};

const services = [
  ["01", "Social Media Management", "Confiez vos réseaux sociaux à un interlocuteur qui relie chaque publication à vos objectifs. Je planifie les contenus, pilote leur diffusion et suis les performances pour ajuster votre communication."],
  ["02", "Stratégie digitale", "Sachez quoi dire, à qui et sur quels canaux. Je définis une direction et des priorités pour concentrer vos efforts sur les actions utiles à votre entreprise."],
  ["03", "Communication de marque", "Aidez vos clients à comprendre ce que vous faites et ce qui vous distingue. Je travaille vos messages, votre ton et la cohérence de vos prises de parole."],
  ["04", "Création de contenu", "Donnez à votre audience une raison de s’intéresser à votre offre. Je transforme votre savoir-faire, vos services et vos actualités en textes et visuels adaptés à vos canaux."],
  ["05", "Publicité digitale", "Faites connaître votre offre auprès des publics que vous souhaitez toucher. Je conçois et suis vos campagnes selon un objectif défini, un budget convenu et des indicateurs de performance."],
];

type Project = {
  name: string; client: string; type: string; sector: string;
  context: string; intervention: string; result: string; image: string;
  approach?: string; measured?: boolean; cover?: boolean;
  role?: string; resultLabel?: string; confidentiality?: string;
};

const projects: Project[] = [
  { name: "Simplifier le parcours client", client: "ZOOM TECH", type: "Social Media", sector: "Technologie", context: "Sensibiliser les entreprises à l’importance d’un suivi client rapide, clair et accessible.", intervention: "Conception éditoriale et visuelle d’un contenu pédagogique reliant la digitalisation à une meilleure expérience client.", approach: "Partir d’une difficulté concrète — un client sans nouvelles — puis relier la solution à la digitalisation. Le visuel hiérarchise le problème, l’explication et l’appel à l’action.", result: "Un visuel pédagogique sur le suivi des demandes clients, avec un appel à l’action et les coordonnées de Zoom Tech.", image: "/images/projects/zoom-tech-semaine.webp" },
  { name: "Événement de la semaine", client: "EVANTURA", type: "Social Media", sector: "Événementiel", context: "Rendre l’offre événementielle immédiatement compréhensible et attractive.", intervention: "Direction artistique et conception d’un visuel de promotion pour la plateforme.", approach: "Associer une question simple à un aperçu de l’application : le public comprend l’usage du service avant de découvrir les moyens d’y accéder.", result: "Un visuel de découverte de l’offre événementielle, présentant l’application et ses points d’accès.", image: "/images/projects/evantura-evenement-semaine.webp" },
  { name: "Septembre, c’est la rentrée", client: "SAFIA BELLA", type: "Social Media", sector: "Marque personnelle", context: "Faire de la rentrée une occasion de prendre la parole dans l’univers de Safia Bella : clarté, identité et guérison.", intervention: "Direction artistique, composition graphique et adaptation du message pour les réseaux sociaux.", result: "Un visuel de rentrée qui associe un message de motivation, le portrait de Safia Bella et ses codes de marque.", image: "/images/projects/safia-bella-rentree.webp" },
  { name: "Contenu immobilier", client: "IMMO KONNECT", type: "Social Media", sector: "Immobilier", context: "Présenter l’offre immobilière aux personnes qui la découvrent sur les réseaux sociaux.", intervention: "Création de contenus promotionnels adaptés aux réseaux sociaux.", result: "Des contenus promotionnels qui mettent en avant l’offre et l’identité d’Immo Konnect.", image: "/images/projects/immo-konnect.jpeg" },
  { name: "Hello Monday — Garder le cap", client: "SAFIA BELLA", type: "Social Media", sector: "Marque personnelle", context: "Une prise de parole du lundi autour de la clarté et de l’attention.", intervention: "Composition d’un visuel pour les réseaux sociaux, associant photographie, message et identité Safia Bella.", result: "Un visuel Hello Monday daté du 28 septembre 2026, conçu autour du message « Protège ton attention et garde le cap ».", image: "/images/projects/safia-bella-hello-monday.webp" },
  { name: "Campagne de trafic FLMDA", client: "FLMDA RDC", type: "Publicité", sector: "Événementiel", context: "Faire connaître l’événement auprès d’un public plus large grâce à la communication digitale.", intervention: "Stratégie éditoriale, création de contenus, gestion des canaux et suivi de la communication.", measured: true, result: "29 992 personnes touchées lors de la campagne FLMDA. Ce chiffre mesure la portée, pas les ventes ni les inscriptions.", image: "/images/projects/flmda-campaign.jpeg" },
  { name: "Couverture du FLMDA 2026", client: "FESTIVAL DES LANGUES MATERNELLES", type: "Communication", sector: "Événementiel", context: "Permettre à la communauté de suivre les temps forts du festival, même à distance.", intervention: "Couverture en direct, rédaction et publication de contenus événementiels.", result: "Des publications en direct pour raconter le déroulement du festival et partager ses temps forts.", image: "/images/projects/flmda-live.jpeg" },
  { name: "Votre image parle avant vous", client: "LE COMMUNITY MANAGER", type: "Social Media", sector: "Marque personnelle", context: "Expliquer le rôle de l’image dans la manière dont une marque personnelle est perçue.", intervention: "Conception éditoriale et visuelle de contenus de sensibilisation.", result: "Un contenu de sensibilisation qui relie l’image de marque à la perception du public.", image: "/images/projects/le-community-manager.webp" },
  snelStrategy,
  { name: "Fête du travail — SNEL SA", client: "SNEL SA", type: "Communication", sector: "Institutionnel", context: "Prendre la parole à l’occasion du 1er mai tout en valorisant les agents et techniciens de l’entreprise.", intervention: "Conception d’un visuel institutionnel aligné avec les codes de marque et adapté aux réseaux sociaux.", result: "Un visuel institutionnel qui met à l’honneur les équipes et leur contribution à la continuité du service électrique.", image: "/images/projects/snel-fete-travail.jpg" },
];

const certifications = [
  "Community Management",
  "Social Media",
  "Publicité digitale",
  "Stratégie de contenu",
];

const partnerLogos = [
  ["Clinique Ruth", "/images/logos/clinique-ruth.png"],
  ["Afromadia", "/images/logos/afromadia.png"],
  ["Afrika Connect", "/images/logos/afrika-connect.png"],
  ["Evantura", "/images/logos/evantura.png"],
  ["Immo Konnect", "/images/logos/immo-konnect.png"],
  ["Amal Holding", "/images/logos/amal-holding.png"],
  ["Zoom Tech", "/images/logos/zoom-tech.png"],
];

const navigation = [
  { label: "Accueil", target: "accueil" },
  { label: "À propos", target: "a-propos" },
  { label: "Services", target: "services" },
  { label: "Réalisations", target: "realisations" },
  { label: "Contact", target: "contact" },
];

function BrandGlyph({ className = "" }: { className?: string }) {
  return <span className={`brand-glyph ${className}`.trim()} aria-hidden="true"><span></span><span></span><span></span><span></span></span>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [requestedService, setRequestedService] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("accueil");
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
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
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }),
      { threshold: 0.12, rootMargin: "-4% 0px -8% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".hero-copy > h1, .hero-copy > .intro, .hero-copy > .actions, .section-head, .about-copy, .why-head, .work-head, .trust-copy, .testimonial-heading, .service-disclosure, .consistent-projects .project, .why-grid article, .testimonial-card"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("motion-in", entry.isIntersecting);
      });
    }, { threshold: 0.08 });
    items.forEach((item, index) => {
      item.style.setProperty("--entry-delay", `${index % 2 * 70}ms`);
      item.classList.add("motion-ready");
      observer.observe(item);
    });
    return () => {
      observer.disconnect();
    };
  }, [showAllProjects]);
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
  useEffect(() => {
    if (!selectedProject) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
      if (event.key === "Tab") {
        const controls = document.querySelectorAll<HTMLElement>(".project-modal button, .project-modal a[href]");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);
    modalCloseRef.current?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [selectedProject]);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);
  return <main className="public-site">
    <div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${scrollProgress})` }}></div>
    <header className={`nav ${scrollProgress > .015 ? "scrolled" : ""}`}><a className="brand brand-logo" href="#accueil" aria-label="Accueil — Manassé Mukendi"><img src="/images/brand/logo-mm.png" alt="Manassé Mukendi"/></a><nav className={menu ? "open" : ""}>{navigation.map(({ label, target }) => <a aria-current={activeSection === target ? "page" : undefined} className={activeSection === target ? "active" : ""} onClick={() => setMenu(false)} href={`#${target}`} key={target}>{label}</a>)}</nav><a className="nav-cta" href="#contact">Échangeons <BrandGlyph className="compact"/></a><button className="menu" aria-expanded={menu} aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMenu(!menu)}>{menu ? "×" : "☰"}</button></header>

    <section className="hero" id="accueil"><div className="hero-copy"><p className="eyebrow light">MANASSÉ MUKENDI <span>/</span> MARKETING ET COMMUNICATION DIGITALE</p><h1><span className="headline-lead">La communication</span> qui <em>déplace</em> les marques.</h1><p className="intro">Votre entreprise a du savoir-faire. Faisons-le savoir. Je clarifie vos messages, crée vos contenus et pilote vos réseaux sociaux pour rendre votre offre plus visible, plus compréhensible et plus convaincante.</p><div className="actions"><a className="button white" href="#contact">Parlons de votre projet <BrandGlyph/></a><a className="button button-ghost" href="#realisations">Voir mes réalisations <BrandGlyph/></a></div></div><div className="orbit" aria-hidden="true"><div className="orbit-ring"></div><div className="orbit-core"><span>digital</span><strong>impact</strong></div><span className="tag t1">STRATÉGIE</span><span className="tag t2">SOCIAL</span><span className="tag t3">CONTENU</span><span className="dot d1"></span><span className="dot d2"></span></div><div className="hero-foot"><span>Stratégie · Contenus · Réseaux sociaux</span><span>PROJETS LOCAUX &amp; INTERNATIONAUX <b>●</b></span></div></section>

    {SHOW_PILOT_PROGRAM && <PilotProgramBanner onApply={() => setRequestedService(PILOT_PROGRAM_OPTION)} icon={<BrandGlyph className="compact"/>}/>}

    <section className="about about-short" id="a-propos">
      <div className="portrait"><div className="portrait-photo" role="img" aria-label="Portrait de Manassé Mukendi, consultant en marketing et communication digitale"></div><div className="portrait-note">MANASSÉ<br/>MUKENDI <BrandGlyph className="outline"/></div></div>
      <div className="about-copy">
        <p className="eyebrow">01 / À PROPOS</p><h2>Votre ambition.<br/>Une direction <em>claire.</em></h2>
        <div className="bio editorial-bio">
          <p className="about-lead">Je suis Manassé Mukendi, Social Media Manager et consultant en marketing et communication digitale. Je relie la stratégie à sa mise en œuvre.</p>
          <p>Depuis 2024, j’accompagne des entreprises, des institutions et des marques personnelles, en RDC et à l’international.</p>
          <p>Avant de publier, je cherche à comprendre votre activité, vos clients et vos objectifs. Je définis ensuite les messages et les canaux adaptés, puis je crée les contenus et pilote vos réseaux sociaux.</p>
        </div>
        <dl className="about-references">
          <div><dt>QUELQUES RÉFÉRENCES</dt><dd>Zoom Tech, Evantura, FLMDA : des projets de stratégie, de contenu et de communication événementielle à découvrir dans mes réalisations.</dd></div>
          <div><dt>COMMENT COLLABORER</dt><dd>Une mission ciblée ou un accompagnement mensuel, à distance ou sur le terrain, selon vos besoins.</dd></div>
        </dl>
      </div>
    </section>

    <section className="section services" id="services">
      <div className="section-head"><p className="eyebrow">02 / SERVICES</p><h2>Vos objectifs.<br/>Les bonnes <em>actions.</em></h2><p className="section-intro">Clarifier votre offre, prendre la parole avec régularité ou faire connaître un lancement : partons de votre besoin.</p></div>
      <div className="service-list">{services.map(([n,t,d]) => <details className="service-disclosure" key={n}>
        <summary><span className="service-number">{n}</span><h3>{t}</h3><span className="disclosure-sign" aria-hidden="true">+</span></summary>
        <div className="service-description"><p>{d}</p><a className="service-cta" href="#contact" aria-label={`Parler de ce besoin : ${t}`} onClick={() => { setRequestedService(t); trackConversion("Service selected"); }}>Parler de ce besoin <BrandGlyph className="compact"/></a></div>
      </details>)}</div>
      <details className="engagement-options"><summary>Un besoin ponctuel ou un suivi mensuel ? <span aria-hidden="true">+</span></summary><p>Je peux intervenir sur une stratégie, des contenus ou une campagne, ou assurer un suivi régulier de vos réseaux sociaux. Nous définissons le périmètre, les livrables, le calendrier et le budget avant de démarrer.</p></details>
    </section>

    <section className="section why"><div className="why-head"><p className="eyebrow">COMMENT TRAVAILLER ENSEMBLE</p><h2>Un cadre clair.<br/>À chaque <em>étape.</em></h2></div><div className="why-grid">{[["01","Comprendre","Nous faisons le point sur votre activité, vos publics et ce que vous voulez améliorer."],["02","Structurer","Je propose une direction, des livrables, un calendrier et un budget à valider ensemble."],["03","Créer et déployer","Je réalise les contenus et les actions convenus, avec des points de validation définis."],["04","Faire le point","Nous examinons le travail réalisé et, selon la mission, les performances pour décider de la suite."]].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section className="work" id="realisations">
      <div className="work-head"><div><p className="eyebrow light">03 / RÉALISATIONS</p><h2>De la stratégie<br/>aux <em>réalisations.</em></h2></div><p>Le besoin de départ, mon intervention et le travail réalisé : voici une sélection de mes projets. D’autres exemples peuvent être présentés selon votre secteur.</p></div>
      <div className="project-grid consistent-projects" id="project-list">
        {visibleProjects.map((p,i) => <article className="project case-study" key={p.name}>
          <div className={`project-art${p.cover ? " project-document" : ""}`}>
            <img src={p.image} alt={`${p.cover ? "Couverture — " : ""}${p.name} — ${p.client}`} loading="lazy" decoding="async"/>
            {!p.cover && <><div className="project-topline"><span>{p.type}</span><BrandGlyph className="card-glyph light"/></div><b>{String(i+1).padStart(2,"0")}</b></>}
          </div>
          <div className="project-info">
            <p className="case-client">CLIENT <strong>{p.client}</strong> <span>/ {p.sector}</span></p><h3>{p.name}</h3>
            <div className="case-details">
              <div className="case-detail"><small>CONTEXTE</small><p>{p.context}</p></div>
              <div className="case-detail"><small>INTERVENTION</small><p>{p.intervention}</p></div>
              <div className="case-result"><small>{p.resultLabel ?? (p.measured ? "PORTÉE DE LA CAMPAGNE" : "CE QUI A ÉTÉ RÉALISÉ")}</small><strong>{p.result}</strong></div>
            </div>
            <button className="project-view-button" onClick={() => { setSelectedProject(p); trackConversion("Project opened"); }}>Découvrir le projet <BrandGlyph className="compact"/></button>
          </div>
        </article>)}
      </div>
      <div className="work-actions">{projects.length > 4 && <button className="button project-toggle" aria-expanded={showAllProjects} aria-controls="project-list" onClick={() => setShowAllProjects(!showAllProjects)}>{showAllProjects ? "Réduire la sélection" : `Voir ${projects.length - 4} autres projets`} <span aria-hidden="true">{showAllProjects ? "−" : "+"}</span></button>}</div>
    </section>


    <section className="trust-compact partners-return" aria-labelledby="trust-title"><div className="trust-copy"><p className="eyebrow">CONFIANCE &amp; EXPERTISE</p><h2 id="trust-title">Des collaborations <em>réelles.</em></h2><div className="certification-chips">{certifications.map((certificate) => <span key={certificate}>{certificate}</span>)}</div></div><div className="partner-marquee partner-marquee-green" aria-label="Marques et organisations accompagnées"><div className="partner-track"><div className="partner-row">{partnerLogos.map(([name, logo]) => <div className="partner-card" key={name}><img src={logo} alt={name} loading="lazy" decoding="async"/></div>)}</div><div className="partner-row" aria-hidden="true">{partnerLogos.map(([name, logo]) => <div className="partner-card" key={`duplicate-${name}`}><img src={logo} alt="" loading="lazy" decoding="async"/></div>)}</div></div></div></section>

    <section className="testimonial-section" id="temoignages" aria-labelledby="testimonial-title">
      <div className="testimonial-heading"><p className="eyebrow">TÉMOIGNAGE</p><h2 id="testimonial-title">La confiance,<br/><em>dans leurs mots.</em></h2></div>
      <figure className="testimonial-card">
        <figcaption className="testimonial-author">
          <img src="/images/peter-ngoyi.png" alt="Peter Ngoyi N." width="1120" height="1109" loading="lazy" decoding="async"/>
          <div><h3>Peter Ngoyi N.</h3><p>Stratège en communication &amp; écrivain</p><p className="testimonial-specialties">Marques d’entreprise · Personal branding · RSE</p></div>
        </figcaption>
        <div className="testimonial-content">
          <blockquote className="testimonial-highlight"><p>« Il sait combiner simplicité, créativité, rapidité et efficacité quand vous travaillez avec lui dans des projets. »</p></blockquote>
          <details className="testimonial-details">
            <summary>Lire le témoignage complet <span aria-hidden="true">+</span></summary>
            <blockquote>
              <p>Manassé Mukendi est un professionnel tel qu’on n’en trouve pas tous les jours.</p>
              <p>Il sait combiner simplicité, créativité, rapidité et efficacité quand vous travaillez avec lui dans des projets.</p>
              <p>Je l’ai connu comme client (parce qu’il devait acheter un de mes livres), et très vite nous sommes devenus partenaires.</p>
              <p>Je suis satisfait de collaborer avec lui, et je n’ai que de bons retours partout où je recommande ses services.</p>
              <p>Si vous voulez du sérieux pour votre projet, en matière de design graphique et de communication digitale : prenez dès maintenant les services de Manassé Mukendi.</p>
            </blockquote>
          </details>
        </div>
      </figure>
    </section>



    <section className="contact section" id="contact"><div className="section-head"><p className="eyebrow">04 / CONTACT</p><h2>Votre prochain projet<br/>commence par un <em>échange.</em></h2><p>Présentez-moi votre entreprise et ce que vous souhaitez améliorer. Je vous recontacte personnellement pour préciser votre besoin et voir comment vous accompagner.</p><a className="mail" href={`mailto:${contact.email}`}>{contact.email} <span className="link-dot" aria-hidden="true"></span></a><a className="whatsapp-link contact-whatsapp" href={contact.whatsapp} onClick={() => trackConversion("WhatsApp clicked")} target="_blank" rel="noreferrer">Échanger sur WhatsApp <span className="link-dot" aria-hidden="true"></span></a></div><ContactForm service={requestedService} onServiceChange={setRequestedService} icon={<BrandGlyph/>}/></section>

    <footer><div><a className="brand footer-mark" href="#accueil" aria-label="Retour à l'accueil"><img src="/images/brand/icon-mm.png" alt="Manassé Mukendi"/></a><p>Marketing &amp; communication digitale<br/>Stratégie · Contenus · Social Media Management</p></div><p className="motto">Comprendre.<br/><em>Créer.</em><br/>Faire avancer.</p><div className="footer-links"><p className="footer-availability">Un interlocuteur pour votre stratégie et vos réseaux sociaux. Missions ponctuelles ou suivi mensuel, en RDC et à l’international.</p><div className="footer-social-actions"><p>Retrouvez mes publications</p><div>{Object.entries(contact.socials).map(([n,l]) => <a key={n} href={l} target="_blank" rel="noreferrer" aria-label={`Ouvrir mon profil ${n}`}>{n} <BrandGlyph className="compact"/></a>)}</div></div></div><small>© 2026 Manassé Mukendi. Tous droits réservés.</small></footer>

    {selectedProject && <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={() => setSelectedProject(null)}>
      <article className="project-modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <div className="project-modal-toolbar"><button ref={modalCloseRef} className="project-modal-close" onClick={() => setSelectedProject(null)} aria-label="Fermer le projet">×</button></div>
        <div className={`project-modal-visual${selectedProject.cover ? " project-document" : ""}`}><img src={selectedProject.image} alt={`${selectedProject.cover ? "Couverture — " : ""}${selectedProject.name} — ${selectedProject.client}`}/></div>
        <div className="project-modal-copy">
          <p className="eyebrow">{selectedProject.client} / {selectedProject.sector}</p><h2 id="project-modal-title">{selectedProject.name}</h2>
          <div><small>CONTEXTE</small><p>{selectedProject.context}</p></div>
          {selectedProject.role && <div><small>MON RÔLE</small><p>{selectedProject.role}</p></div>}
          <div><small>INTERVENTION</small><p>{selectedProject.intervention}</p></div>
          {selectedProject.approach && <div><small>LE PARTI PRIS</small><p>{selectedProject.approach}</p></div>}
          <div className="project-modal-result"><small>{selectedProject.resultLabel ?? (selectedProject.measured ? "PORTÉE DE LA CAMPAGNE" : "CE QUI A ÉTÉ RÉALISÉ")}</small><strong>{selectedProject.result}</strong></div>
          {selectedProject.confidentiality && <p className="project-confidentiality">{selectedProject.confidentiality}</p>}
          <a className="button dark" href="#contact" onClick={() => setSelectedProject(null)}>Parler d’un projet similaire <BrandGlyph/></a>
        </div>
      </article>
    </div>}
  </main>;
}
