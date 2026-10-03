# Campagne temporaire — Programme 30 jours

Le seul interrupteur est `SHOW_PILOT_PROGRAM` dans `lib/pilot-program.ts`.

- `true` : bandeau après le hero, option du formulaire et cinq champs spécifiques disponibles.
- `false` : tout le programme disparaît ; le formulaire habituel reste inchangé.

Après chaque changement, reconstruire et publier le site.

« Postuler » sélectionne la candidature dans le formulaire existant et rejoint la section contact. Les coordonnées restent obligatoires. Le champ habituel « Votre besoin » laisse place aux questions du programme, pour éviter une double saisie. Le lien web/social est facultatif pour ne pas exclure les entreprises sans présence en ligne.

L’envoi utilise le destinataire et le service d’envoi existants. Les candidatures ont un objet distinct et contiennent les cinq champs nommés. Changer de service retire ces champs de l’envoi et rétablit « Votre besoin ». Aucun nouveau formulaire, destinataire ou service externe n’est ajouté.
