"use client";

import { useEffect, useRef, useState } from "react";
import { trackConversion } from "../lib/conversion-analytics";
import { SHOW_PILOT_PROGRAM, PILOT_PROGRAM_OPTION } from "../lib/pilot-program";
import { PilotProgramBanner } from "./components/PilotProgram";
import ContactForm from "./components/ContactForm";
import HomeHero from "./components/HomeHero";
import { snelStrategy } from "../lib/snel-strategy";
import { WEBSITE_SERVICE } from "../lib/contact-request";
import { PROFILE_IMAGE, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT, profileStructuredData } from "../lib/site-profile";
import WebsiteMockup from "./components/WebsiteMockup";
import { services, serviceAnchor } from "../lib/public-services";

const contact = {
  whatsapp: "https://wa.me/243838318812",
  email: "contact@manasse-mukendi.com",
  socials: {
    LinkedIn: "https://www.linkedin.com/in/manass%C3%A9-mukendi-75412b295/",
    Instagram: "https://www.instagram.com/sir_manasse_mukendi/?hl=fr",
    Facebook: "https://www.facebook.com/manasse.mkd",
  },
};

type Project = {
  name: string; client: string; type: string; sector: string;
  context: string; intervention: string; result: string; image: string;
  approach?: string; measured?: boolean; cover?: boolean;
  role?: string; resultLabel?: string; confidentiality?: string;
  website?: string;
  mobileImage?: string;
  deliverables?: { title: string; description: string }[];
};

const projects: Project[] = [
  {
    name: "Une boutique en ligne. Une gestion centralisée.",
    client: "ESENGO TECH", type: "Site & application web", sector: "Solutions technologiques",
    context: "Présenter les équipements et services d’Esengo Tech en ligne, tout en donnant à l’entreprise un espace pour suivre son activité au quotidien.",
    role: "Conception et réalisation du site e-commerce et de l’espace privé de gestion.",
    intervention: "Création d’un parcours de découverte des produits et services, d’une boutique et de formulaires de demande, complétés par un tableau de bord réservé à l’entreprise.",
    approach: "Penser les deux côtés du service : un parcours clair pour le visiteur, et des outils de suivi pour l’équipe qui prend en charge sa demande.",
    deliverables: [
      { title: "Côté client : découvrir et commander", description: "Catalogue avec recherche, catégories et tri, fiches produits, panier et demandes de devis, d’installation ou de réabonnement Starlink." },
      { title: "Côté entreprise : organiser et suivre", description: "Espace privé pour les demandes, les clients, les commandes et le stock, avec suivi des paiements, des factures, des abonnements et des interventions." },
    ],
    result: "Un site marchand et un espace de gestion réunis dans un même projet : présenter l’offre, recueillir les demandes et organiser leur suivi.",
    resultLabel: "LA SOLUTION LIVRÉE",
    confidentiality: "L’aperçu présente uniquement le site public. Les données et les écrans internes du client ne sont pas exposés.",
    image: "/images/projects/esengo-tech-desktop-2026.png",
    mobileImage: "/images/projects/esengo-tech-mobile-2026.png",
    website: "https://esengotech.com/",
  },
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
  ["Esengo Tech", "/images/logos/esengo-tech.png"],
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
  function revealService(number: string) {
    const panel = document.getElementById(serviceAnchor(number));
    if (panel instanceof HTMLDetailsElement) panel.open = true;
  }
  useEffect(() => {
    if (!menu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLButtonElement>(".public-site .menu")?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(".nav")) setMenu(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [menu]);
  useEffect(() => {
    if (window.location.hostname === "manasse-mukendi.vercel.app") {
      window.location.replace(`https://www.manasse-mukendi.com${window.location.pathname}${window.location.search}${window.location.hash}`);
    }
  }, []);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section:not(.hero):not(.home-hero), main > footer"));
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
    const items = Array.from(document.querySelectorAll<HTMLElement>(".signature-copy > h1, .signature-copy > p, .signature-copy > div, .section-head, .about-copy, .why-head, .work-head, .trust-copy, .testimonial-heading, .service-disclosure, .consistent-projects .project, .why-grid article, .testimonial-card"));
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
    // The modal is the only interactive surface until it is closed.
    const background = Array.from(document.querySelectorAll<HTMLElement>(".public-site > header, .public-site > section, .public-site > footer, .public-site > .skip-link"));
    background.forEach(element => { element.inert = true; });
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
      background.forEach(element => { element.inert = false; });
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [selectedProject]);
  return <main className="public-site">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileStructuredData).replace(/</g, '\\u003c') }}/>
    <a className="skip-link" href="#accueil">Aller au contenu</a>
    <div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${scrollProgress})` }}></div>
    <header className={`nav ${scrollProgress > .015 ? "scrolled" : ""}`}><a className="brand brand-logo" href="#accueil" aria-label="Accueil — Manassé Mukendi"><img src="/images/brand/logo-mm.png" alt="Manassé Mukendi"/></a><nav id="main-navigation" aria-label="Navigation principale" className={menu ? "open" : ""}>{navigation.map(({ label, target }) => <a aria-current={activeSection === target ? "page" : undefined} className={activeSection === target ? "active" : ""} onClick={() => setMenu(false)} href={`#${target}`} key={target}>{label}</a>)}</nav><a className="nav-cta" href="#contact">Échangeons <BrandGlyph className="compact"/></a><button className="menu" aria-controls="main-navigation" aria-expanded={menu} aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMenu(!menu)}>{menu ? "×" : "☰"}</button></header>

    <HomeHero icon={<BrandGlyph/>}/>

    {SHOW_PILOT_PROGRAM && <PilotProgramBanner onApply={() => setRequestedService(PILOT_PROGRAM_OPTION)} icon={<BrandGlyph className="compact"/>}/>}

    <section className="about about-short" id="a-propos">
      <div className="portrait"><div className="portrait-photo"><img src={PROFILE_IMAGE} alt="Manassé Mukendi, consultant en marketing et communication digitale" width={PROFILE_IMAGE_WIDTH} height={PROFILE_IMAGE_HEIGHT} loading="eager" decoding="async"/></div><div className="portrait-note">MANASSÉ<br/>MUKENDI <BrandGlyph className="outline"/></div></div>
      <div className="about-copy">
        <p className="eyebrow">01 / À PROPOS</p><h2>Votre ambition.<br/>Une direction <em>claire.</em></h2>
        <div className="bio editorial-bio">
          <p className="about-lead">Je suis Manassé Mukendi, consultant en marketing et communication digitale. Je relie la stratégie à sa mise en œuvre.</p>
          <p>Depuis 2024, j’accompagne des entreprises, des institutions et des marques personnelles, en RDC et à l’international.</p>
          <p>Je pars de votre activité, de vos clients et de vos objectifs. Je définis votre <a href="#service-02" onClick={() => revealService("02")}>stratégie de communication</a>, crée vos contenus et assure la <a href="#service-01" onClick={() => revealService("01")}>gestion de vos réseaux sociaux</a>. Je conçois aussi des <a href="#service-06" onClick={() => revealService("06")}>sites et solutions digitales</a> avec l’appui de l’IA.</p>
        </div>
        <dl className="about-references">
          <div><dt>QUELQUES RÉFÉRENCES</dt><dd>Zoom Tech, Evantura, FLMDA, Esengo Tech : des projets de communication, de contenu et de création web à découvrir dans mes réalisations.</dd></div>
          <div><dt>COMMENT COLLABORER</dt><dd>Une mission ciblée ou un accompagnement mensuel, à distance ou sur le terrain, selon vos besoins.</dd></div>
        </dl>
      </div>
    </section>

    <section className="section services" id="services">
      <div className="section-head"><p className="eyebrow">02 / SERVICES</p><h2>Marketing digital.<br/>Des actions <em>concrètes.</em></h2><p className="section-intro">Stratégie de communication, gestion des réseaux sociaux, création de contenus et sites web : un accompagnement adapté aux objectifs de votre entreprise.</p></div>
      <div className="service-list">{services.map(([n,t,d]) => <details className="service-disclosure" id={serviceAnchor(n)} key={n}>
        <summary><span className="service-number">{n}</span><h3>{t}</h3><span className="disclosure-sign" aria-hidden="true">+</span></summary>
        <div className="service-description"><p>{d}</p>{t === WEBSITE_SERVICE && <p className="service-example">Un exemple concret : <a href="#realisations">la boutique et l’espace de gestion Esengo Tech</a>.</p>}<a className="service-cta" href="#contact" aria-label={`Parler de ce besoin : ${t}`} onClick={() => { setRequestedService(t); trackConversion("Service selected"); }}>Parler de ce besoin <BrandGlyph className="compact"/></a></div>
      </details>)}</div>
      <details className="engagement-options"><summary>Un besoin ponctuel ou un suivi mensuel ? <span aria-hidden="true">+</span></summary><p>Une stratégie, des contenus, une campagne ou un site : je peux intervenir sur un projet ciblé ou assurer un suivi régulier de vos réseaux sociaux. Nous définissons le périmètre, les livrables, le calendrier et le budget avant de démarrer.</p></details>
    </section>

    <section className="section why"><div className="why-head"><p className="eyebrow">COMMENT TRAVAILLER ENSEMBLE</p><h2>Un cadre clair.<br/>À chaque <em>étape.</em></h2></div><div className="why-grid">{[["01","Comprendre","Nous faisons le point sur votre activité, vos publics et ce que vous voulez améliorer."],["02","Structurer","Je propose une direction, des livrables, un calendrier et un budget à valider ensemble."],["03","Créer et déployer","Je réalise les contenus et les actions convenus, avec des points de validation définis."],["04","Faire le point","Nous examinons le travail réalisé et, selon la mission, les performances pour décider de la suite."]].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section className="work" id="realisations">
      <div className="work-head"><div><p className="eyebrow light">03 / RÉALISATIONS</p><h2>De la stratégie<br/>aux <em>réalisations.</em></h2></div><p>Le besoin de départ, mon intervention et le travail réalisé : voici une sélection de mes projets. D’autres exemples peuvent être présentés selon votre secteur.</p></div>
      <div className="project-grid consistent-projects" id="project-list">
        {projects.map((p,i) => <article className="project case-study" key={p.name} hidden={!showAllProjects && i >= 4}>
          <div className={`project-art${p.cover ? " project-document" : ""}${p.website ? " project-website" : ""}`}>
            {p.mobileImage ? <WebsiteMockup desktop={p.image} mobile={p.mobileImage} name={p.client}/> : <img src={p.image} alt={`${p.cover ? "Couverture — " : ""}${p.name} — ${p.client}`} loading="lazy" decoding="async"/>}
            {!p.cover && <><div className="project-topline"><span>{p.type}</span><BrandGlyph className="card-glyph light"/></div><b>{String(i+1).padStart(2,"0")}</b></>}
          </div>
          <div className="project-info">
            <p className="case-client">CLIENT <strong>{p.client}</strong> <span>/ {p.sector}</span></p><h3>{p.name}</h3>
            <div className="case-details">
              <div className="case-detail"><small>CONTEXTE</small><p>{p.context}</p></div>
              <div className="case-detail"><small>INTERVENTION</small><p>{p.intervention}</p></div>
              <div className="case-result"><small>{p.resultLabel ?? (p.measured ? "PORTÉE DE LA CAMPAGNE" : "CE QUI A ÉTÉ RÉALISÉ")}</small><strong>{p.result}</strong></div>
            </div>
            <button className="project-view-button" aria-label={`Découvrir le projet ${p.client} : ${p.name}`} onClick={() => { setSelectedProject(p); trackConversion("Project opened"); }}>Découvrir le projet <BrandGlyph className="compact"/></button>
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
          <img src="/images/peter-ngoyi-portrait.jpg" alt="Peter Ngoyi N." width="2036" height="2048" loading="lazy" decoding="async"/>
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



    <section className="contact section" id="contact">
      <div className="section-head">
        <p className="eyebrow">04 / VOTRE PROJET</p>
        <h2>Votre prochain projet<br/>commence <em>ici.</em></h2>
        <p>Présentez votre besoin dans le formulaire. Je vous recontacterai personnellement par e-mail ou sur WhatsApp pour préciser votre projet.</p>
      </div>
      <div className="contact-request-column">
        <ContactForm service={requestedService} onServiceChange={setRequestedService} icon={<BrandGlyph/>}/>
        <details className="contact-alternatives">
          <summary>Autres moyens de contact <span aria-hidden="true">+</span></summary>
          <p>Vous ne pouvez pas utiliser le formulaire ?</p>
          <a className="mail" href={`mailto:${contact.email}`}><span className="contact-action-label">Écrire par e-mail</span><BrandGlyph className="compact"/></a>
          <a className="whatsapp-link contact-whatsapp" href={contact.whatsapp} onClick={() => trackConversion("WhatsApp clicked")} target="_blank" rel="noreferrer"><span className="contact-action-label">Échanger sur WhatsApp</span><BrandGlyph className="compact"/></a>
        </details>
      </div>
    </section>

    <footer><div><a className="brand footer-mark" href="#accueil" aria-label="Retour à l'accueil"><img src="/images/brand/icon-mm.png" alt="Manassé Mukendi"/></a><p>Marketing &amp; communication digitale<br/>Stratégie · Contenus · Social Media Management</p></div><p className="motto">Comprendre.<br/><em>Créer.</em><br/>Faire avancer.</p><div className="footer-links"><p className="footer-availability">Un interlocuteur pour votre stratégie et vos réseaux sociaux. Missions ponctuelles ou suivi mensuel, en RDC et à l’international.</p><div className="footer-social-actions"><p>Retrouvez mes publications</p><div>{Object.entries(contact.socials).map(([n,l]) => <a key={n} href={l} target="_blank" rel="noreferrer" aria-label={`Ouvrir mon profil ${n}`}>{n} <BrandGlyph className="compact"/></a>)}</div></div></div><small>© 2026 Manassé Mukendi. Tous droits réservés.</small></footer>

    {selectedProject && <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={() => setSelectedProject(null)}>
      <article className="project-modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <div className="project-modal-toolbar"><button ref={modalCloseRef} className="project-modal-close" onClick={() => setSelectedProject(null)} aria-label="Fermer le projet">×</button></div>
        <div className={`project-modal-visual${selectedProject.cover ? " project-document" : ""}${selectedProject.website ? " project-website" : ""}`}>
          {selectedProject.mobileImage ? <WebsiteMockup desktop={selectedProject.image} mobile={selectedProject.mobileImage} name={selectedProject.client}/> : <img src={selectedProject.image} alt={`${selectedProject.cover ? "Couverture — " : ""}${selectedProject.name} — ${selectedProject.client}`}/>}
          {selectedProject.mobileImage && <div className="project-capture-links"><a href={selectedProject.image} target="_blank" rel="noopener noreferrer">Agrandir : ordinateur</a><a href={selectedProject.mobileImage} target="_blank" rel="noopener noreferrer">Agrandir : mobile</a></div>}
        </div>
        <div className="project-modal-copy">
          <p className="eyebrow">{selectedProject.client} / {selectedProject.sector}</p><h2 id="project-modal-title">{selectedProject.name}</h2>
          {selectedProject.website && <div className="project-next-actions"><a className="button dark" href="#contact" onClick={() => { setRequestedService(WEBSITE_SERVICE); setSelectedProject(null); }}>Présenter mon projet web <BrandGlyph className="compact"/></a><a className="project-website-link" href={selectedProject.website} target="_blank" rel="noopener noreferrer" aria-label={`Visiter le site ${selectedProject.client} (nouvel onglet)`}>Visiter Esengo Tech <BrandGlyph className="compact"/></a></div>}
          <div><small>CONTEXTE</small><p>{selectedProject.context}</p></div>
          {selectedProject.role && <div><small>MON RÔLE</small><p>{selectedProject.role}</p></div>}
          <div><small>INTERVENTION</small><p>{selectedProject.intervention}</p></div>
          {selectedProject.deliverables && <details className="project-deliverables"><summary>Voir les fonctionnalités livrées <span aria-hidden="true">+</span></summary><dl>{selectedProject.deliverables.map((item) => <div key={item.title}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl></details>}
          {selectedProject.approach && <div><small>LE PARTI PRIS</small><p>{selectedProject.approach}</p></div>}
          <div className="project-modal-result"><small>{selectedProject.resultLabel ?? (selectedProject.measured ? "PORTÉE DE LA CAMPAGNE" : "CE QUI A ÉTÉ RÉALISÉ")}</small><strong>{selectedProject.result}</strong></div>
          {selectedProject.confidentiality && <p className="project-confidentiality">{selectedProject.confidentiality}</p>}
          <a className="button dark" href="#contact" onClick={() => { if (selectedProject.website) setRequestedService(WEBSITE_SERVICE); setSelectedProject(null); }}>Parler d’un projet similaire <BrandGlyph/></a>
        </div>
      </article>
    </div>}
  </main>;
}
