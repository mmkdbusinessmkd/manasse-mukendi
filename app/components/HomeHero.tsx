import type { ReactNode } from "react";
import styles from "./HomeHero.module.css";

/** A self-contained homepage composition, isolated from the legacy hero styles. */
export default function HomeHero({ icon }: { icon: ReactNode }) {
  return <section className={`home-hero ${styles.hero}`} id="accueil" aria-labelledby="home-title">
    <div className={styles.topline}>
      <p>MANASSÉ MUKENDI <span>Marketing et communication digitale</span></p>
      <span className={styles.location}>Projets locaux &amp; internationaux</span>
    </div>

    <div className={styles.composition}>
      <div className={`signature-copy ${styles.copy}`}>
        <h1 id="home-title" className={styles.title}>La communication<br/>qui <em>déplace</em><br/>les marques<span className={styles.period}>.</span></h1>
        <p className={styles.intro}><strong>Votre entreprise a du savoir-faire.<br/>{" "}Faisons-le savoir.</strong>Je clarifie vos messages, crée vos contenus et pilote vos réseaux sociaux pour rendre votre offre plus visible, plus compréhensible et plus convaincante.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#contact">Présenter mon projet {icon}</a>
          <a className={styles.secondary} href="#realisations">Voir mes réalisations {icon}</a>
        </div>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualHeading}><span>UNE DIRECTION CLAIRE</span><span className={styles.cross}>+</span></div>
        <div className={styles.world}>
          <svg className={styles.globe} viewBox="0 0 480 480" fill="none">
            <circle cx="240" cy="240" r="206"/>
            <ellipse cx="240" cy="240" rx="124" ry="206" transform="rotate(32 240 240)"/>
            <ellipse cx="240" cy="240" rx="56" ry="206" transform="rotate(32 240 240)"/>
            <ellipse cx="240" cy="240" rx="206" ry="88" transform="rotate(32 240 240)"/>
            <path d="M83 108C208 86 359 180 416 310M64 170C121 300 272 394 397 372"/>
          </svg>
          <div className={styles.satellite}><i/></div>
          <div className={styles.satelliteSecond}><i/></div>
          <div className={styles.brandCore}>
            <div className={styles.largeMark}><i/><i/><i/><i/></div>
            <span>De l’idée<br/><strong>à l’impact.</strong></span>
          </div>
          <span className={`${styles.label} ${styles.strategy}`}>Stratégie</span>
          <span className={`${styles.label} ${styles.content}`}>Contenus</span>
          <span className={`${styles.label} ${styles.social}`}>Social Media</span>
        </div>
        <p className={styles.visualCaption}><span>Votre marque.</span> Au centre de chaque action.</p>
      </div>
    </div>

    <div className={styles.baseline}>
      <p><span>01</span> Une direction <b>claire.</b></p>
      <p><span>02</span> Des contenus <b>justes.</b></p>
      <p><span>03</span> Une présence <b>cohérente.</b></p>
      <a href="#a-propos" aria-label="Découvrir mon approche">Mon approche {icon}</a>
    </div>
  </section>;
}
