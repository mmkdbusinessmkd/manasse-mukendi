# Alertes des demandes du site

- La demande est d’abord enregistrée dans Supabase. Les doublons d’envoi ne déclenchent pas un second e-mail.
- Le serveur adresse l’alerte à `contact@manasse-mukendi.com` et à l’adresse personnelle du propriétaire déjà configurée dans la variable privée `ADMIN_EMAIL`. L’adresse personnelle ne doit pas être inscrite dans le code ou les fichiers publics.
- Si `RESEND_API_KEY` est configurée, le transport utilise Resend et l’expéditeur vérifié `CONTACT_EMAIL_FROM`. La clé doit être limitée à l’envoi et au domaine retenu. Ces deux variables restent privées, sans préfixe `NEXT_PUBLIC_`.
- Sans cette clé, l’ancien transport FormSubmit reste disponible pendant la migration. Il n’a pas livré le test du 6 novembre 2026 : le propriétaire a confirmé l’absence d’e-mail dans ses deux boîtes.
- Pour Resend, vérifier un sous-domaine dédié, par exemple `notifications.manasse-mukendi.com`, et définir l’expéditeur `Manassé Mukendi <alertes@notifications.manasse-mukendi.com>`. Les MX Google Workspace du domaine principal restent en place.
- L’URL d’activation reste `https://www.manasse-mukendi.com/`. L’alerte comprend les champs en français, la référence, le lien privé et l’adresse du visiteur en Reply-To.
- La réponse JSON du fournisseur doit confirmer le succès. Un simple statut HTTP 200 ne suffit pas.
- Les erreurs réseau et les statuts 408, 429 et 5xx sont retentés, avec une limite de trois essais de huit secondes. Une activation demandée ou un rejet explicite n’est pas retenté.
- Resend utilise une clé d’idempotence stable par demande pour les tentatives automatiques. Un renvoi manuel reçoit une nouvelle clé, réutilisée pendant les tentatives de cette action. Aucun passage automatique vers l’autre fournisseur après un envoi incertain.
- Avec l’ancien transport FormSubmit, après un délai dépassé, l’acceptation peut être incertaine : une tentative peut donc produire plusieurs alertes ayant la même référence. L’enregistrement de la demande reste unique.
- Les échecs sont journalisés avec la référence et un motif technique, sans coordonnées ni message du visiteur. La demande enregistrée reste accessible même si le fournisseur d’e-mail est indisponible.
- Le propriétaire peut relancer l’alerte depuis la fiche privée avec « Recevoir cette demande par e-mail ». Cette action vérifie la session et la propriété de la fiche avant tout envoi.
- « Acceptée par le service d’e-mail » signifie une prise en charge par le fournisseur, pas une preuve de livraison finale dans les deux boîtes.

Tests sans envoi réel : `node tests/contact-notification.cjs` et `node tests/contact-api.cjs`.

Vérification externe du 6 novembre 2026 : un test direct a expiré, puis un second a renvoyé HTTP 522. L’unique demande de test de production explicitement autorisée a été enregistrée (HTTP 201), mais le propriétaire n’a reçu aucun e-mail. Ne pas annoncer la réception d’un test avant de la constater dans la messagerie.

Références : [API Resend](https://resend.com/docs/api-reference/emails/send-email), [idempotence](https://resend.com/docs/dashboard/emails/idempotency-keys), [domaines vérifiés](https://resend.com/docs/dashboard/domains/introduction).
