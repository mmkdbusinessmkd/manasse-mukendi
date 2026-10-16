import type { ReactNode } from "react";
import styles from "./HomeHero.module.css";

/** Editorial introduction, isolated from the legacy hero styles. */
export default function HomeHero({ icon }: { icon: ReactNode }) {
  return <section className={`home-hero ${styles.hero}`} id="accueil" aria-labelledby="home-title">
    <div className={styles.composition}>
      <div className={`signature-copy ${styles.copy}`}>
        <p className={styles.eyebrow}>Marketing et communication digitale</p>
        <h1 id="home-title" className={styles.title}>La communication<br/>qui <em>déplace</em><br/>les marques.</h1>
        <p className={styles.intro}><strong>Votre entreprise a du savoir-faire.<br/>{" "}Faisons-le savoir.</strong>Je clarifie vos messages, crée vos contenus et pilote vos réseaux sociaux pour rendre votre offre plus visible, plus compréhensible et plus convaincante.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#contact">Parlons de votre projet {icon}</a>
          <a className={styles.secondary} href="#realisations">Voir mes réalisations {icon}</a>
        </div>
      </div>
      <figure className={styles.portrait}>
        <div className={styles.photoFrame}>
          <img src="/images/manasse-portrait-2026.png" alt="Manassé Mukendi" width="1086" height="1448" fetchPriority="high" decoding="async"/>
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.person}>Manassé Mukendi</span>
          <span className={styles.role}>Social Media Manager<br/>&amp; consultant en communication digitale</span>
          <a href="#a-propos">Découvrir mon approche {icon}</a>
        </figcaption>
      </figure>
    </div>
    <div className={styles.baseline}>
      <p>Stratégie <span aria-hidden="true">/</span> Contenus <span aria-hidden="true">/</span> Social Media</p>
      <p>Projets locaux &amp; internationaux</p>
    </div>
  </section>;
}
