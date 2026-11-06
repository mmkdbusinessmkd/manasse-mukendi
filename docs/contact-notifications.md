# Alertes des demandes du site

- La demande est d’abord enregistrée dans Supabase. Les doublons d’envoi ne déclenchent pas un second e-mail.
- Le serveur envoie ensuite une alerte FormSubmit à `contact@manasse-mukendi.com`, avec copie à l’adresse personnelle du propriétaire déjà configurée dans la variable privée `ADMIN_EMAIL`. L’adresse personnelle ne doit pas être inscrite dans le code ou les fichiers publics.
- L’URL d’activation reste `https://www.manasse-mukendi.com/`. L’alerte comprend les champs en français, la référence, le lien privé et l’adresse du visiteur en Reply-To.
- La réponse JSON du fournisseur doit confirmer le succès. Un simple statut HTTP 200 ne suffit pas.
- Les erreurs réseau et les statuts 408, 429 et 5xx sont retentés, avec une limite de trois essais de huit secondes. Une activation demandée ou un rejet explicite n’est pas retenté.
- Après un délai dépassé, l’acceptation par le fournisseur peut être incertaine : une tentative peut donc produire plusieurs alertes ayant la même référence. L’enregistrement de la demande reste unique.
- Les échecs sont journalisés avec la référence et un motif technique, sans coordonnées ni message du visiteur. La demande enregistrée reste accessible même si le fournisseur d’e-mail est indisponible.
- Le propriétaire peut relancer l’alerte depuis la fiche privée avec « Recevoir cette demande par e-mail ». Cette action vérifie la session et la propriété de la fiche avant tout envoi.
- « Acceptée par le service d’e-mail » signifie une prise en charge par le fournisseur, pas une preuve de livraison finale dans les deux boîtes.

Tests sans envoi réel : `node tests/contact-notification.cjs` et `node tests/contact-api.cjs`.

Vérification externe du 6 novembre 2026 : un test direct a expiré, puis un second a renvoyé HTTP 522. Ne pas annoncer la réception d’un test avant de la constater dans la messagerie.
