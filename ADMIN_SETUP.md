# Espace privé de gestion freelance — état et activation

## État actuel

La V1 est implémentée et configurée avec Supabase. **La connexion réelle du propriétaire est validée en local ; publication autorisée et en préparation.** Sans configuration complète, la connexion reste désactivée et toutes les pages privées redirigent vers `/admin/connexion`. Aucune donnée client fictive n’est installée dans la base réelle.

### Installation du 6 octobre 2026 — ne pas rejouer la migration

- Projet autorisé par le propriétaire : `pqnmntltfrdklhlryxnt`, dans l’organisation `manasse-mukendi.com`, offre gratuite, région Frankfurt.
- Migration `202610060001_freelance.sql` exécutée avec succès via SQL Editor. Le contrôle Supabase « Run and enable RLS » a été conservé. Pas de seconde exécution.
- Audit SQL réel : exactement six tables métier ; `relrowsecurity=true`, `relforcerowsecurity=true`, une politique `owner_admin` par table, aucun privilège SELECT pour `anon`.
- Authentication → Sign In / Providers : « Allow new users to sign up » désactivé, valeur `false` vérifiée après rechargement. Connexions anonymes désactivées ; confirmation e-mail laissée activée.
- Le propriétaire a créé son compte et saisi lui-même son mot de passe. Compte et confirmation e-mail vérifiés ; UUID inscrit dans le registre selon l’autorisation donnée. Audit : un seul administrateur, correspondant au propriétaire attendu. Ne jamais lire, saisir, journaliser ou partager son mot de passe.
- `.env.local` ignoré par Git configuré avec la clé publiable, sans clé privilégiée. Aperçu local sur `127.0.0.1:3001`. Vérification réelle : six requêtes REST anonymes refusées (401), route `/admin` redirigée vers la connexion (307), en-têtes privés `no-store` et `noindex` présents, formulaire de connexion activé.
- Le propriétaire s’est connecté dans l’aperçu local : écran Tâches accessible avec la vraie session, données vides. Les contrôles métier automatisés restent des tests en mémoire ; aucun cycle CRUD réel n’a été exécuté sur Supabase.
- Publication autorisée le 6 octobre 2026, avec consentement explicite pour enregistrer les quatre paramètres privés dans Vercel, environnement Production uniquement. Après déploiement : contrôler les accès anonymes et demander au propriétaire une connexion sur le domaine final.

Fonctions : clients, missions, tâches, livrables, paiements multiples, soldes par devise, notes, recherche et liste mensuelle des échéances. Le site public conserve sa structure et son contenu. Aucun lien d’administration n’est ajouté à sa navigation.

## Activation accompagnée

1. Le propriétaire crée/se connecte à son compte sur `https://supabase.com/dashboard`. Il saisit lui-même ses mots de passe et accepte les conditions. Ne jamais demander un mot de passe dans le chat.
2. Créer un **projet dédié** à cette gestion freelance. Choisir la région et l’offre avec le propriétaire avant tout engagement payant. Aucun import automatique des clients du portfolio.
3. Dans SQL Editor, exécuter une seule fois `supabase/migrations/202610060001_freelance.sql`. Vérifier sa réussite complète. Le fichier est transactionnel et ne contient aucun compte administrateur.
4. Dans Authentication, désactiver les nouvelles inscriptions publiques. Créer le compte du propriétaire avec son adresse personnelle déjà fournie dans la conversation. Le mot de passe doit être saisi par le propriétaire, ou établi via le parcours officiel d’invitation/récupération correctement configuré. Ne pas inventer de page de callback : cette V1 fournit la connexion par mot de passe, pas un parcours d’invitation personnalisé.
5. Copier l’UUID exact de cet utilisateur, puis exécuter dans SQL Editor (remplacer le placeholder) :

```sql
insert into private.admin_users (user_id)
values ('UUID_DU_PROPRIETAIRE');
```

Le registre impose un seul administrateur. Ne pas remplacer un propriétaire existant sans vérifier son identité et obtenir une autorisation explicite. Les rôles `anon` et `authenticated` ne peuvent ni consulter ni modifier ce registre.

6. Configurer côté serveur uniquement, dans `.env.local` (local) et plus tard dans les variables Vercel du bon environnement :

```text
SUPABASE_URL=https://PROJET.supabase.co
SUPABASE_PUBLISHABLE_KEY=cle_publiable_du_projet
ADMIN_USER_ID=UUID_DU_PROPRIETAIRE
ADMIN_EMAIL=adresse_personnelle_du_proprietaire
```

Utiliser la clé publiable, **jamais `service_role` ni une clé secrète**. Aucune variable n’a le préfixe `NEXT_PUBLIC_`. Ne pas committer `.env.local`. Garder les secrets, mots de passe et l’adresse personnelle hors du code et des captures publiques. `.env.example` ne contient que des champs vides.

7. Redémarrer localement, puis effectuer les vérifications ci-dessous avant toute publication. L’activation n’est pas terminée tant que le véritable compte et la vraie API ne sont pas testés.
8. Après validation et autorisation de publication, configurer Vercel et déployer. Tester également sur le domaine final et sur une fenêtre non connectée.

## Sécurité prévue

- Proxy : rafraîchissement de session, redirection des visiteurs, en-têtes privés `no-store`, `noindex`, `DENY`, `no-referrer`.
- Chaque chargement et chaque action serveur vérifie à nouveau l’utilisateur avec Supabase Auth, l’UUID, l’adresse configurée et le registre `is_admin`.
- RLS activée et forcée sur les six tables ; chaque accès requiert à la fois le propriétaire autorisé et son `owner_id`.
- Aucune clé privilégiée ni mot de passe dans le navigateur. Cookies HTTP-only, Secure en production, SameSite Lax. Les données nécessaires aux formulaires sont transmises uniquement après authentification.
- Liens client/mission contrôlés par clés étrangères composites ; suppression d’un parent ayant des éléments liés refusée. Suppression individuelle avec confirmation explicite.
- Mises à jour protégées contre l’écrasement d’une version plus récente ; UUID de création stable pour limiter les doubles soumissions.
- Calcul monétaire en unités entières (centimes), jamais d’addition entre devises différentes. Paiement supérieur au solde refusé par la base ; réduction du montant convenu sous le total déjà reçu refusée.
- Pas de suivi Vercel Analytics sur les pages privées. Pas de données privées dans les métadonnées ni de lien dans le sitemap.

## Vérification locale réalisée

```text
node tests/admin.cjs
node tests/pilot-program.cjs
node tests/snel-strategy.cjs
node node_modules/typescript/bin/tsc --noEmit
node node_modules/next/dist/bin/next build
```

`tests/admin.cjs` exécute la migration dans PostgreSQL en mémoire (PGlite), avec des rôles Auth simulés uniquement pour les tests. Vérifie RLS, droits anonymes, relations, CRUD, solde 400 − 150 − 100 = 150, paiement excessif, suppression protégée et modification périmée. **Ce test ne remplace pas la validation de Supabase Auth réel ou de transactions concurrentes réelles.**

Avec un serveur de production local sur le port 3001 **sans configuration Supabase** : `node tests/admin-http.cjs` contrôle les redirections, en-têtes, absence d’adresse personnelle/analytics et accès au site public.

`node tests/admin-preview.cjs` ouvre un aperçu **statique et fictif** sur `127.0.0.1:3002`. Il sert aux captures de mise en page, pas à la connexion ni aux tests fonctionnels. Il ne fait pas partie des routes Next.js, n’accède à aucune base, et ne doit jamais être déployé. Arrêter le processus après les captures.

## Vérifications à faire après configuration réelle

- Connexion correcte, mauvais mot de passe, session persistante, expiration, déconnexion et accès direct à toutes les routes sans session.
- Compte Auth non autorisé : lecture/écriture interdites via API, pas seulement via l’interface.
- Créer un client de test clairement identifié, une mission de 400 USD, puis deux paiements de 150 et 100 : solde 150. Tester deux onglets modifiant la même fiche et deux paiements simultanés dépassant le solde. Vérifier les refus et messages.
- Ajouter/modifier une tâche, un livrable et une note ; vérifier recherche, filtres, liens, échéances, statuts et vues mobile/ordinateur avec les vrais écrans connectés.
- Supprimer les données de test seulement avec confirmation, enfants avant parents ; ne pas toucher aux vrais dossiers.
- Vérifier les sauvegardes disponibles selon l’offre Supabase choisie et convenir d’une procédure d’export/restauration avant d’en faire l’outil principal. Aucun système de sauvegarde externe n’est activé par ce code.

## Limites explicites de la V1

- La fréquence « mensuel » est descriptive : pas de génération automatique de factures ou d’échéances récurrentes. Le montant de la mission est son montant convenu total.
- Une date de prochain paiement par mission ; pas d’échéancier détaillé, remboursements ou comptabilité fiscale.
- Liens de livrables seulement, pas de stockage/téléversement de fichiers privés.
- Pas de conversion de devises ; heure métier fixée à `Africa/Kinshasa` sans localisation du propriétaire.
- Liste d’échéances simple, pas d’intégration à Google Calendar.
- Lecture paginée en interne et plafond de sécurité de 50 000 lignes par table. Au-delà, l’écran refuse d’afficher des totaux partiels ; prévoir une pagination dédiée pour un volume important.
- Pas de MFA ni récupération de mot de passe dédiée dans l’interface. Les procédures Auth doivent être configurées et testées avant usage intensif.
