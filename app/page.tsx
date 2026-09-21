"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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
  ["01", "Social Media Management", "Structurer et gérer votre présence sur les réseaux sociaux."],
  ["02", "Stratégie digitale", "Donner une direction claire à votre communication."],
  ["03", "Communication de marque", "Construire une image cohérente, crédible et reconnaissable."],
  ["04", "Création de contenu", "Créer des contenus qui servent réellement vos objectifs."],
  ["05", "Publicité digitale", "Accélérer votre visibilité auprès des bonnes audiences."],
];

const projects = [
  { name: "Simplifier le parcours client", client: "ZOOM TECH", type: "Social Media", sector: "Technologie", context: "Sensibiliser les entreprises à l’importance d’un suivi client rapide, clair et accessible.", intervention: "Conception éditoriale et visuelle d’un contenu pédagogique reliant la digitalisation à une meilleure expérience client.", result: "Un message commercial concret qui rend la promesse de Zoom Tech immédiatement compréhensible.", image: "/images/projects/zoom-tech-semaine.webp" },
  { name: "Événement de la semaine", client: "EVANTURA", type: "Social Media", sector: "Événementiel", context: "Rendre l’offre événementielle immédiatement compréhensible et attractive.", intervention: "Direction artistique et conception de visuels de campagne sur Photoshop.", result: "Une campagne visuelle cohérente avec l’univers et l’offre de la plateforme.", image: "/images/projects/evantura-evenement-semaine.webp" },
  { name: "Fête du travail — SNEL SA", client: "SNEL SA", type: "Communication", sector: "Institutionnel", context: "Prendre la parole à l’occasion du 1er mai tout en valorisant les agents et techniciens de l’entreprise.", intervention: "Conception d’un visuel institutionnel aligné avec les codes de marque et adapté aux réseaux sociaux.", result: "Un message lisible, valorisant et cohérent avec la dimension nationale de l’entreprise.", image: "/images/projects/snel-fete-travail.jpg" },
  { name: "Septembre, c’est la rentrée", client: "SAFIA BELLA", type: "Social Media", sector: "Marque personnelle", context: "Créer une prise de parole de rentrée alignée avec l’univers personnel de Safia Bella.", intervention: "Direction artistique, composition graphique et adaptation du message pour les réseaux sociaux.", result: "Un contenu de saison expressif, cohérent et immédiatement identifiable.", image: "/images/projects/safia-bella-rentree.webp" },
  { name: "Campagne de trafic FLMDA", client: "FLMDA RDC", type: "Publicité", sector: "Événementiel", context: "Renforcer la visibilité digitale de l’événement.", intervention: "Stratégie éditoriale, création de contenus, gestion des canaux et suivi de la communication.", result: "29 992 personnes touchées, progression de la communauté et forte production de contenus.", image: "/images/projects/flmda-campaign.jpeg" },
  { name: "Contenu immobilier", client: "IMMO KONNECT", type: "Social Media", sector: "Immobilier", context: "Valoriser l’offre immobilière et soutenir sa visibilité en ligne.", intervention: "Création de contenus promotionnels adaptés aux réseaux sociaux.", result: "Des messages plus lisibles et une présence visuelle plus professionnelle.", image: "/images/projects/immo-konnect.jpeg" },
  { name: "Couverture du FLMDA 2026", client: "FESTIVAL DES LANGUES MATERNELLES", type: "Communication", sector: "Événementiel", context: "Faire vivre l’événement en temps réel auprès de la communauté.", intervention: "Couverture en direct, rédaction et publication de contenus événementiels.", result: "Une actualité continue et une meilleure visibilité des temps forts.", image: "/images/projects/flmda-live.jpeg" },
  { name: "Votre image parle avant vous", client: "LE COMMUNITY MANAGER", type: "Social Media", sector: "Marque personnelle", context: "Renforcer la perception d’expertise autour de la marque personnelle.", intervention: "Conception éditoriale et visuelle de contenus de sensibilisation.", result: "Une communication plus claire, cohérente et identifiable.", image: "/images/projects/le-community-manager.webp" },
];

const contactFields = [
  { label: "Nom", type: "text", name: "name", placeholder: "Votre nom", required: true },
  { label: "E-mail", type: "email", name: "email", placeholder: "votre@email.com", required: true },
  { label: "Téléphone / WhatsApp", type: "tel", name: "phone", placeholder: "+243 ...", required: true },
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
  const [formMessage, setFormMessage] = useState("");
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
    const items = Array.from(document.querySelectorAll<HTMLElement>(".service, .consistent-projects .project, .why-grid article, .testimonial-card"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("motion-in", entry.isIntersecting);
      });
    }, { threshold: 0.08 });
    items.forEach((item, index) => {
      if (item.classList.contains("motion-ready")) return;
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
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setFormMessage("Envoi en cours…");
    try {
      const response = await fetch("https://formsubmit.co/ajax/contact@manasse-mukendi.com", {
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

    <section className="hero" id="accueil"><div className="hero-copy"><p className="eyebrow light">MANASSÉ MUKENDI <span>/</span> MARKETING ET COMMUNICATION DIGITALE</p><h1><span className="headline-lead">La communication</span> qui <em>déplace</em> les marques.</h1><p className="intro">Une image claire. Des contenus qui comptent. Une présence digitale qui donne envie de vous choisir.</p><div className="actions"><a className="button white" href="#contact">Parler de mon projet <BrandGlyph/></a><a className="button button-ghost" href="#services">Découvrir mes services <BrandGlyph/></a></div></div><div className="orbit" aria-hidden="true"><div className="orbit-ring"></div><div className="orbit-core"><span>digital</span><strong>impact</strong></div><span className="tag t1">STRATÉGIE</span><span className="tag t2">SOCIAL</span><span className="tag t3">CONTENU</span><span className="dot d1"></span><span className="dot d2"></span></div><div className="hero-foot"><span>Marketing · Communication · Social Media</span><span>PROJETS LOCAUX &amp; INTERNATIONAUX <b>●</b></span></div></section>

    <section className="about about-short" id="a-propos"><div className="portrait"><div className="portrait-photo" role="img" aria-label="Portrait de Manassé Mukendi, consultant en marketing et communication digitale"></div><div className="portrait-note">MANASSÉ<br/>MUKENDI <BrandGlyph className="outline"/></div></div><div className="about-copy"><p className="eyebrow">01 / À PROPOS</p><h2>Votre ambition.<br/>Une direction <em>claire.</em></h2><div className="bio editorial-bio"><p className="about-lead">Je suis Manassé Mukendi.</p><p>Consultant en marketing et communication digitale, j’accompagne les marques dans leur stratégie, leurs contenus et leurs réseaux sociaux.</p><p>Je pars de vos objectifs pour construire une communication cohérente, qui rend votre valeur visible. À distance ou sur le terrain, en Afrique et à l’international.</p></div><a className="button dark about-cta" href="#contact">Parler de votre projet <BrandGlyph/></a></div></section>

    <section className="section services" id="services"><div className="section-head"><p className="eyebrow">02 / SERVICES</p><h2>Ce que je peux faire<br/>pour votre <em>marque.</em></h2><p className="section-intro">Clarifier votre message, renforcer votre visibilité et transformer l’intérêt en prise de contact.</p></div><div className="service-grid">{services.map(([n,t,d]) => <article className="service" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><a className="service-cta" href="#contact">Parler de ce besoin <BrandGlyph className="compact"/></a></article>)}</div><div className="service-closing"><p>Vous hésitez sur le bon accompagnement ?</p><a href="#contact">Discutons de votre communication <span className="link-dot" aria-hidden="true"></span></a></div></section>

    <section className="section why"><div className="why-head"><p className="eyebrow">MON APPROCHE</p><h2>Comprendre avant<br/>de <em>communiquer.</em></h2></div><div className="why-grid">{[["01","Je comprends avant de publier.","Chaque action part de votre réalité, de votre audience et de vos objectifs."],["02","Je pense stratégie avant exécution.","Les contenus et les canaux suivent une direction claire, pas une simple tendance."],["03","Je relie image, communication et réputation.","Votre marque reste cohérente à chaque point de contact."]].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><a className="button dark why-cta" href="#contact">Discuter de votre projet <BrandGlyph/></a></section>

    <section className="work" id="realisations"><div className="work-head"><div><p className="eyebrow light">03 / RÉALISATIONS</p><h2>Des marques.<br/>Des projets <em>concrets.</em></h2></div><p>Une sélection de projets représentatifs. D’autres réalisations peuvent être présentées selon votre secteur.</p></div><div className="work-proof"><span><strong>29 992</strong> personnes touchées · campagne FLMDA</span><span><strong>6+</strong> secteurs accompagnés</span><span><strong>Partout</strong> projets locaux et internationaux</span></div><div className="project-grid consistent-projects">{visibleProjects.map((p,i) => <article className="project case-study" key={p.name}><div className="project-art"><img src={p.image} alt={`${p.name} — ${p.client}`} loading="lazy" decoding="async"/><div className="project-topline"><span>{p.type}</span><BrandGlyph className="card-glyph light"/></div><b>{String(i+1).padStart(2,"0")}</b></div><div className="project-info"><p className="case-client">CLIENT <strong>{p.client}</strong> <span>/ {p.sector}</span></p><h3>{p.name}</h3><div className="case-details"><div className="case-detail"><small>CONTEXTE</small><p>{p.context}</p></div><div className="case-detail"><small>INTERVENTION</small><p>{p.intervention}</p></div><div className="case-result"><small>RÉSULTAT</small><strong>{p.result}</strong></div></div><button className="project-view-button" onClick={() => setSelectedProject(p)}>Voir le projet <span aria-hidden="true">+</span></button></div></article>)}</div><div className="work-actions">{projects.length > 4 && <button className="button project-toggle" onClick={() => setShowAllProjects(!showAllProjects)}>{showAllProjects ? "Réduire la sélection" : `Voir ${projects.length - 4} autres projets`} <span aria-hidden="true">{showAllProjects ? "−" : "+"}</span></button>}<a className="button white" href="#contact">Parler d’un projet similaire <BrandGlyph/></a></div></section>


    <section className="trust-compact partners-return" aria-labelledby="trust-title"><div className="trust-copy"><p className="eyebrow">CONFIANCE &amp; EXPERTISE</p><h2 id="trust-title">Des compétences solides.<br/><em>Des collaborations réelles.</em></h2><div className="certification-chips">{certifications.map((certificate) => <span key={certificate}>{certificate}</span>)}</div></div><div className="partner-marquee partner-marquee-green" aria-label="Marques et organisations accompagnées"><div className="partner-track"><div className="partner-row">{partnerLogos.map(([name, logo]) => <div className="partner-card" key={name}><img src={logo} alt={name} loading="lazy" decoding="async"/></div>)}</div><div className="partner-row" aria-hidden="true">{partnerLogos.map(([name, logo]) => <div className="partner-card" key={`duplicate-${name}`}><img src={logo} alt="" loading="lazy" decoding="async"/></div>)}</div></div></div></section>

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

    <section className="cta"><p className="eyebrow light">PROCHAINE ÉTAPE</p><h2>Votre communication<br/>peut faire <em>mieux.</em></h2><p>Parlons de votre image, de votre communication et de ce que vous souhaitez construire.</p><div className="actions"><a className="button white" href="#contact">Parler de mon projet <BrandGlyph/></a><a className="button button-ghost" href="#contact">Demander un devis <BrandGlyph/></a></div></section>

    <section className="contact section" id="contact"><div className="section-head"><p className="eyebrow">04 / CONTACT</p><h2>Votre projet commence<br/>par un <em>échange.</em></h2><p>Décrivez brièvement votre besoin. Je vous recontacte personnellement pour définir la meilleure prochaine étape.</p><a className="mail" href={`mailto:${contact.email}`}>{contact.email} <span className="link-dot" aria-hidden="true"></span></a><a className="whatsapp-link contact-whatsapp" href={contact.whatsapp} target="_blank" rel="noreferrer">Ou écrivez-moi sur WhatsApp <span className="link-dot" aria-hidden="true"></span></a></div><form onSubmit={submit}><input className="honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off"/><input type="hidden" name="_subject" value="Nouvelle demande — site Manassé Mukendi"/><input type="hidden" name="_template" value="table"/>{contactFields.map((field) => <label key={field.label}><span>{field.label}</span><input name={field.name} required={field.required} type={field.type} placeholder={field.placeholder}/></label>)}<label><span>Service recherché</span><select name="service" required defaultValue=""><option disabled value="">Choisir un service</option>{services.map(x => <option key={x[1]}>{x[1]}</option>)}</select></label><label className="full"><span>Votre besoin</span><textarea name="message" required placeholder="Votre objectif et le résultat que vous souhaitez obtenir…"></textarea></label><div className="form-end"><p>{formMessage || "Vos informations servent uniquement à vous recontacter au sujet de votre demande."}</p><button className="button dark">Envoyer ma demande <BrandGlyph/></button></div></form></section>

    <footer><div><a className="brand footer-mark" href="#accueil" aria-label="Retour à l'accueil"><img src="/images/brand/icon-mm.png" alt="Manassé Mukendi"/></a><p>Consultant en marketing &amp; communication digitale<br/>Social Media Manager</p></div><p className="motto">Stratégie.<br/><em>Créativité.</em><br/>Résultats.</p><div className="footer-links"><p className="footer-availability">Disponible pour des missions ponctuelles, des accompagnements mensuels et des collaborations en RDC comme à l’international.</p><div className="footer-social-actions"><p>Suivez mon actualité</p><div>{Object.entries(contact.socials).map(([n,l]) => <a key={n} href={l} target="_blank" rel="noreferrer" aria-label={`Ouvrir mon profil ${n}`}>{n} <BrandGlyph className="compact"/></a>)}</div></div></div><small>© 2026 Manassé Mukendi. Tous droits réservés.</small></footer>

    {selectedProject && <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={() => setSelectedProject(null)}><article className="project-modal-card" onMouseDown={(event) => event.stopPropagation()}><button ref={modalCloseRef} className="project-modal-close" onClick={() => setSelectedProject(null)} aria-label="Fermer le projet">×</button><div className="project-modal-visual"><img src={selectedProject.image} alt={`${selectedProject.name} — ${selectedProject.client}`}/></div><div className="project-modal-copy"><p className="eyebrow">{selectedProject.client} / {selectedProject.sector}</p><h2 id="project-modal-title">{selectedProject.name}</h2><div><small>CONTEXTE</small><p>{selectedProject.context}</p></div><div><small>INTERVENTION</small><p>{selectedProject.intervention}</p></div><div className="project-modal-result"><small>RÉSULTAT</small><strong>{selectedProject.result}</strong></div><a className="button dark" href="#contact" onClick={() => setSelectedProject(null)}>Parler d’un projet similaire <BrandGlyph/></a></div></article></div>}
  </main>;
}
