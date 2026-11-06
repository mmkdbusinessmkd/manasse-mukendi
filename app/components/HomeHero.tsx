import type { ReactNode } from "react";
import { PROFILE_IMAGE, PROFILE_IMAGE_ALT, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT } from "../../lib/site-profile";
import styles from "./HomeHero.module.css";

const capabilities = ["Stratégie digitale", "Réseaux sociaux", "Création de contenu", "Sites & solutions digitales"];

/** A portrait-led composition; the original photo remains the semantic fallback. */
export default function HomeHero({ icon }: { icon: ReactNode }) {
  return <section className={"home-hero " + styles.hero} id="accueil" aria-labelledby="home-title">
    <div className={"signature-copy " + styles.heading}>
      <p className={styles.kicker}>{icon} Consultant en marketing et communication digitale</p>
      <h1 id="home-title" className={styles.title}>Je suis <em>Manassé Mukendi.</em></h1>
      <p className={styles.promise}>La communication qui déplace les marques.</p>
    </div>
    <div className={styles.stage}>
      <aside className={styles.introduction} aria-label="Mon accompagnement">
        <span className={styles.smallLabel}>VOTRE AMBITION. UNE DIRECTION CLAIRE.</span>
        <p>De la stratégie<br/>à la mise en œuvre.</p>
        <span className={styles.description}>Vos contenus, vos réseaux sociaux et votre présence digitale, avec un même cap.</span>
        <a href="#services">Découvrir mes services {icon}</a>
      </aside>
      <figure className={"hero-portrait " + styles.portrait}>
        <div className={styles.monogram} aria-hidden="true">{icon}</div>
        <svg className={styles.globe} viewBox="0 0 480 480" fill="none" aria-hidden="true">
          <circle cx="240" cy="240" r="208"/><ellipse cx="240" cy="240" rx="124" ry="208" transform="rotate(-22 240 240)"/>
          <ellipse cx="240" cy="240" rx="208" ry="76" transform="rotate(-22 240 240)"/>
          <path d="M50 184C160 242 320 242 430 184M50 296C160 238 320 238 430 296"/>
          <circle cx="398" cy="70" r="6" className={styles.globePin}/>
        </svg>
        <picture><source srcSet="/images/manasse-mukendi-cutout-v1.png" type="image/png"/><img src={PROFILE_IMAGE} alt={PROFILE_IMAGE_ALT} width={PROFILE_IMAGE_WIDTH} height={PROFILE_IMAGE_HEIGHT} loading="eager" fetchPriority="high" decoding="async"/></picture>
        <figcaption className={styles.location}>RDC &amp; international<span>À distance ou sur le terrain</span></figcaption>
      </figure>
      <aside className={styles.proof} aria-label="Un mot de Peter Ngoyi">
        <span className={styles.quoteMark} aria-hidden="true">“</span>
        <blockquote>« Simplicité, créativité, rapidité et efficacité. »</blockquote>
        <a href="#temoignages">Peter Ngoyi N.<span>Lire son témoignage</span></a>
        <div className={styles.skillPills}><span>Stratégie</span><span>Contenus</span><span>Social Media</span></div>
      </aside>
      <div className={styles.actionDock}>
        <a className={styles.primary} href="#contact" aria-label="Présenter mon projet"><span className={styles.fullLabel}>Présenter mon projet</span><span className={styles.shortLabel}>Mon projet</span> {icon}</a>
        <a className={styles.secondary} href="#realisations" aria-label="Voir mes réalisations"><span className={styles.fullLabel}>Mes réalisations</span><span className={styles.shortLabel}>Réalisations</span> {icon}</a>
      </div>
    </div>
    <div className={styles.ribbon} aria-label="Stratégie digitale, réseaux sociaux, création de contenu et sites et solutions digitales">
      <div className={styles.ribbonTrack}>{[false, true].map(duplicate => <div className={styles.ribbonGroup} key={String(duplicate)} aria-hidden={duplicate || undefined}>{capabilities.map(label => <span key={label}>{label}{icon}</span>)}</div>)}</div>
    </div>
  </section>;
}
