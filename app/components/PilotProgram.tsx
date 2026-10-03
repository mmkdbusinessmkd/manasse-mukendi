import type { ReactNode } from "react";
import styles from "./PilotProgram.module.css";

export function PilotProgramBanner({ onApply, icon }: { onApply: () => void; icon: ReactNode }) {
  return (
    <aside id="programme-30-jours" className={styles.banner} aria-labelledby="pilot-program-title">
      <div className={styles.copy}>
        <p className={styles.label}>Candidatures ouvertes</p>
        <h2 id="pilot-program-title">Je prends en charge la communication digitale de <strong>2 entreprises</strong> pendant <strong>30 jours.</strong></h2>
        <p className={styles.description}>Je sélectionne 2 entreprises que j’accompagnerai gratuitement pendant un mois en prenant directement en charge une partie de leur communication digitale.</p>
      </div>
      <a className={styles.apply} href="#contact" onClick={onApply}>Postuler {icon}</a>
    </aside>
  );
}

export function PilotProgramFields() {
  return (
    <fieldset className={styles.fields} aria-describedby="pilot-program-notice">
      <legend>Candidature – Programme 30 jours</legend>
      <div className={styles.fieldGrid}>
        <label><span>Nom de l’entreprise</span><input name="entreprise" autoComplete="organization" required maxLength={160}/></label>
        <label><span>Secteur d’activité</span><input name="secteur" required maxLength={160}/></label>
        <label className={styles.wide}><span>Lien vers le site ou les réseaux sociaux</span><input name="site_ou_reseaux" type="text" inputMode="url" autoCapitalize="none" spellCheck={false} maxLength={1000} placeholder="Votre site ou votre profil (si disponible)"/></label>
        <label className={styles.wide}><span>Principal problème de communication actuellement</span><textarea name="probleme_communication" required maxLength={3000} rows={3}/></label>
        <label className={styles.wide}><span>Pourquoi souhaitez-vous participer au programme ?</span><textarea name="motivation_programme" required maxLength={3000} rows={3}/></label>
      </div>
      <p id="pilot-program-notice" className={styles.notice}>Seules 2 entreprises seront sélectionnées. L’envoi d’une candidature ne garantit pas une place.</p>
    </fieldset>
  );
}
