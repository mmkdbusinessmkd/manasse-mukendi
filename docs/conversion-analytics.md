# Suivi des conversions

Le suivi des visites existant reste inchangé. Les événements personnalisés sont préparés mais désactivés par défaut : Vercel les réserve aux offres Pro et Enterprise.

Après vérification de l'abonnement et accord du propriétaire, définir `NEXT_PUBLIC_ENABLE_CONVERSION_ANALYTICS=true` dans l'environnement Vercel puis redéployer. Aucun abonnement n'a été modifié.

Événements prévus dans Web Analytics :

- `Project opened` : ouverture volontaire d'une fiche projet.
- `WhatsApp clicked` : clic sur le lien WhatsApp ; ce n'est pas une conversation confirmée.
- `Service selected` : clic sur « Parler de ce besoin » depuis une carte service.
- `Contact request accepted` : FormSubmit a répondu positivement, pas une preuve de réception dans la boîte e-mail.

Les appels ne transmettent aucune propriété personnalisée : ni nom, ni e-mail, ni téléphone, ni texte du formulaire. Ne pas ajouter FormData ou des valeurs saisies à ces événements.

Vérification après activation : ouvrir une fiche, sélectionner un service et suivre le comptage dans le tableau Vercel. Tester l'envoi uniquement avec un message explicitement identifié comme test, puis confirmer sa réception avec le propriétaire. Les bloqueurs peuvent empêcher le comptage ; les chiffres restent indicatifs.

Documentation : https://vercel.com/docs/analytics/custom-events
