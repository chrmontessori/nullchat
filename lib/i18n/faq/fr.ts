import type { FaqKey } from "../faq-translations";

export const fr: Record<FaqKey, string> = {
  faq_1_title: "Qu'est-ce que nullchat ?",
  faq_1_body: `nullchat est un salon de discussion anonyme, chiffré de bout en bout, qui ne requiert aucun compte, aucun e-mail, aucun numéro de téléphone, et aucune information personnelle d'aucune sorte. Vous entrez un secret partagé — un mot de passe — et toute personne qui entre le même mot de passe se retrouve dans le même salon. C'est tout.`,
  faq_2_title: "Comment rejoindre un salon ?",
  faq_2_body: `Vous et la personne avec qui vous souhaitez communiquer convenez d'un secret partagé à l'avance — en personne, par téléphone, comme vous voulez. Vous entrez tous les deux ce secret dans nullchat et vous vous retrouvez dans le même salon chiffré. Il n'y a pas de liste de salons, pas d'annuaire, aucun moyen de parcourir. Si vous ne connaissez pas le secret, le salon n'existe pas pour vous.`,
  faq_3_title: "Comment choisir un bon secret partagé ?",
  faq_3_body: `Votre secret partagé est l'élément le plus important de votre sécurité. Il est à la fois la clé de votre salon et la clé de votre chiffrement — si quelqu'un le devine, il peut tout lire. Traitez-le comme le mot de passe d'un coffre-fort.

Choisissez quelque chose de long, aléatoire et impossible à deviner. Un secret solide comporte au moins 5 à 6 mots aléatoires ou plus de 20 caractères variés. Évitez les noms, les dates, les expressions courantes, les paroles de chansons ou tout ce que quelqu'un pourrait trouver sur vos réseaux sociaux. Ne réutilisez jamais un secret pour différentes conversations ou salons.

Partagez votre secret par un canal sécurisé et hors bande — en personne, c'est le mieux. Un appel téléphonique est acceptable. Ne l'envoyez jamais par SMS, e-mail, message privé ou toute plateforme qui conserve les messages. Si vous suspectez qu'un secret a été compromis, cessez de l'utiliser immédiatement et convenez d'un nouveau par un canal sécurisé.

L'indicateur de robustesse sur l'écran d'entrée vous donne une idée approximative de la résistance de votre secret aux attaques par force brute, mais aucun indicateur ne remplace le bon sens. En cas de doute, faites-le plus long et plus aléatoire.`,
  faq_4_title: "Comment fonctionne le chiffrement ?",
  faq_4_body: `Lorsque vous entrez votre secret partagé, deux choses se produisent entièrement dans votre navigateur :

1. Le secret est traité par Argon2id — une fonction de dérivation de clé à mémoire intensive — avec un sel à domaine séparé pour produire un identifiant de salon. Ce hash est envoyé au serveur pour qu'il sache à quel salon vous connecter. Le serveur ne voit jamais votre secret réel.

2. Le secret passe par une seconde dérivation Argon2id indépendante (16 Mio de mémoire, 3 itérations) pour produire une clé de chiffrement de 256 bits. Cette clé ne quitte jamais votre navigateur. Argon2id nécessite de grands blocs de RAM par tentative, rendant les attaques par force brute sur GPU et ASIC contre votre mot de passe considérablement plus difficiles qu'avec les KDF traditionnels.

Chaque message que vous envoyez est chiffré avec NaCl secretbox (XSalsa20-Poly1305) à l'aide de cette clé avant de quitter votre appareil. Le serveur reçoit, stocke et relaie uniquement du texte chiffré — des blocs opaques qui n'ont aucun sens sans la clé. Nous ne pouvons pas lire vos messages. Personne ne le peut, à moins de connaître le secret partagé.`,
  faq_5_title: "Que voit le serveur ?",
  faq_5_body: `Le serveur voit :
• Un hash dérivé par Argon2id (l'identifiant du salon) — pas votre mot de passe
• Des blocs de texte chiffré — pas vos messages
• Le nombre de connexions actives dans un salon
• Les horodatages de réception des blocs chiffrés

Le serveur ne voit PAS :
• Votre secret partagé / mot de passe
• Le contenu de vos messages
• Votre identité ou nom d'utilisateur (les alias sont chiffrés dans les messages)
• Votre adresse IP (supprimée en périphérie par notre hébergeur)`,
  faq_6_title: "Qu'est-ce que le remplissage des messages ?",
  faq_6_body: `Avant le chiffrement, chaque message est complété jusqu'à un bloc fixe de 8 192 octets à l'aide d'un préfixe de longueur de 2 octets suivi du contenu du message et de bruit aléatoire. Cela signifie qu'un message court comme « salut » produit un texte chiffré de taille strictement identique à un message de longueur maximale. Sans remplissage, un observateur pourrait deviner le contenu d'un message en se basant sur la taille du texte chiffré. Le remplissage par du bruit aléatoire (et non des zéros) garantit l'absence de motif identifiable dans le texte clair avant chiffrement. Le remplissage élimine entièrement ce canal auxiliaire.`,
  faq_7_title: "Qu'est-ce que l'obfuscation des horodatages ?",
  faq_7_body: `Les horodatages inclus dans les messages sont arrondis à la minute la plus proche avant le chiffrement. Cela empêche les attaques par corrélation temporelle dans lesquelles un observateur pourrait associer des motifs de messages entre différents canaux en comparant les horodatages exacts.`,
  faq_8_title: "Combien de temps durent les messages ?",
  faq_8_body: `Les messages utilisent un système de minuteries à plusieurs niveaux :

• Dead drop (premier message) : Un message reste chiffré sur le serveur pendant 24 heures maximum, en attente d'une réponse. L'expéditeur peut quitter et revenir le vérifier sans déclencher de compte à rebours. Le simple fait d'entrer dans le salon ne détruit pas le message.

• Les deux utilisateurs sont présents : Lorsqu'une deuxième personne rejoint le salon, tous les messages non lus commencent immédiatement un compte à rebours de destruction de 5 minutes. Chaque nouveau message envoyé lorsque les deux utilisateurs sont présents s'autodétruit également en 5 minutes. Aucune action n'est nécessaire — la seule présence confirme que le message est en cours de lecture.

• Bouton Reçu : Si vous récupérez un message dead drop alors que vous êtes seul dans le salon, vous pouvez appuyer sur le bouton « Reçu » pour confirmer manuellement la réception et lancer le compte à rebours de 5 minutes. Ce bouton n'apparaît qu'une seule fois — lors de la récupération initiale du dead drop — et n'est pas disponible pendant les conversations actives.

• Conversation active : Une fois qu'un salon a vu des réponses, les messages suivants disposent d'une fenêtre de 6 heures si le destinataire n'est pas présent. Si les deux utilisateurs sont connectés, les messages s'autodétruisent en 5 minutes automatiquement.

• Plafond absolu : Tout message non lu est supprimé à l'expiration de son minuteur (24 heures pour les dead drops, 6 heures pour les messages actifs), qu'il ait été confirmé ou non.

Il n'y a pas d'archive, pas de sauvegarde, aucun moyen de récupérer un message supprimé.`,
  faq_9_title: "Qu'est-ce que le dead drop ?",
  faq_9_body: `nullchat fonctionne comme un dead drop numérique. Dans le renseignement traditionnel, un dead drop est une méthode de transmission d'informations entre deux personnes sans qu'elles aient besoin de se rencontrer ou d'être au même endroit au même moment. nullchat fonctionne de la même manière.

Vous entrez le secret partagé, déposez un message chiffré et vous déconnectez. Le message reste sur le serveur — chiffré et illisible par quiconque, y compris nous — pendant 24 heures maximum. Votre contact entre le même secret quand il le souhaite et récupère le message. Lorsque le destinataire rejoint le salon et que les deux utilisateurs sont présents, tous les messages en attente commencent immédiatement un compte à rebours de destruction de 5 minutes — la seule présence fait office de preuve de réception. Si le destinataire récupère le message alors qu'il est seul, il peut appuyer sur le bouton unique « Reçu » pour confirmer manuellement la réception et lancer la destruction, ou simplement répondre. Une fois la destruction lancée, le message est définitivement détruit après 5 minutes.

L'expéditeur peut se reconnecter à tout moment pour vérifier si son message est toujours en attente — sans déclencher de compte à rebours, tant qu'il est le seul dans le salon. Aucune des deux parties n'a besoin d'être en ligne en même temps. Aucune des deux parties n'a besoin d'un compte. Aucune des deux parties n'est identifiable. Le serveur ne sait jamais qui a déposé le message ni qui l'a récupéré — seulement qu'un bloc chiffré a été stocké puis récupéré. Après la destruction, il n'existe aucune preuve que l'échange a eu lieu.`,
  faq_10_title: "Combien de temps durent les salons ?",
  faq_10_body: `Un salon existe tant qu'il a des connexions actives ou des messages non expirés. Une fois que la dernière personne se déconnecte et que tous les messages ont expiré ou été détruits, le salon disparaît. Il n'y a pas d'état de salon persistant. Si aucun message n'est jamais envoyé, le salon n'est qu'une connexion en direct — rien n'est stocké, et il disparaît dès que tout le monde part.`,
  faq_11_title: "Qu'est-ce que le bouton Supprimer ?",
  faq_11_body: `Supprimer efface immédiatement du serveur tous les messages que vous avez envoyés pendant votre session en cours, pour tous les participants du salon. Les autres participants voient vos messages disparaître de leur écran en temps réel. Vous êtes ensuite déconnecté du salon. Utilisez cette fonction si vous devez partir sans laisser de trace.`,
  faq_12_title: "Qu'est-ce que le bouton Quitter ?",
  faq_12_body: `Quitter vous déconnecte simplement du salon. Vos messages restent sur le serveur — les messages non lus continuent d'attendre (jusqu'à 24 heures), et les messages déjà lus poursuivent leur compte à rebours de destruction de 5 minutes. Si vous rejoignez le salon plus tard, vous recevrez un nouvel alias aléatoire — il n'y a aucun moyen de relier vos anciennes et nouvelles identités.`,
  faq_13_title: "Que sont les alias aléatoires ?",
  faq_13_body: `Lorsque vous entrez dans un salon, un code hexadécimal aléatoire de 8 caractères (comme « a9f2b71c ») vous est attribué comme alias. Cet alias est généré dans votre navigateur, chiffré dans chaque message, et n'est jamais envoyé au serveur en clair. Si vous vous déconnectez et vous reconnectez, vous obtenez un nouvel alias. Il n'y a aucun moyen de réserver, choisir ou conserver un alias.`,
  faq_14_title: "Y a-t-il une limite de participants ?",
  faq_14_body: `Chaque salon prend en charge jusqu'à 50 connexions simultanées. Si le salon est plein, vous verrez le message « Le salon est plein ». Cette limite existe pour garder les salons intimistes et prévenir les abus.`,
  faq_15_title: "Y a-t-il une limitation de débit ?",
  faq_15_body: `Oui. Chaque connexion est limitée à 1 message par seconde. Cela empêche le spam et les abus sans nécessiter de vérification d'identité. Si vous envoyez des messages trop rapidement, vous verrez brièvement la mention « Ralentissez ».`,
  faq_16_title: "Puis-je accéder à nullchat via Tor ?",
  faq_16_body_1: `nullchat est disponible en tant que service caché Tor pour les utilisateurs dans des régions censurées ou toute personne souhaitant une couche d'anonymat supplémentaire. Ouvrez Tor Browser et accédez à :`,
  faq_16_body_2: `Par défaut, les versions clearnet et Tor se connectent au même serveur — les utilisateurs de l'une ou l'autre peuvent communiquer entre eux dans les mêmes salons avec le même secret partagé. Le service .onion passe par le réseau Tor sans Cloudflare, sans CDN et sans infrastructure tierce entre vous et le serveur. Tor achemine votre connexion à travers plusieurs relais chiffrés, de sorte que ni le serveur ni aucun observateur ne peut déterminer votre adresse IP réelle ou votre localisation. Le service .onion utilise du HTTP en clair, ce qui est attendu et sûr — Tor fournit lui-même le chiffrement de bout en bout entre votre navigateur et le serveur. Tout le chiffrement au niveau applicatif (NaCl secretbox, dérivation de clé Argon2id) s'applique par-dessus. Note : Tor Browser doit être réglé sur le niveau de sécurité « Standard » pour que nullchat fonctionne, car l'application nécessite JavaScript.`,
  faq_17_title: "Qu'est-ce qu'un salon réservé à Tor ?",
  faq_17_body: `Lorsque vous accédez à nullchat via le service caché .onion, vous avez la possibilité d'activer « Salon réservé à Tor » — un interrupteur qui apparaît sur l'écran de saisie du mot de passe. Lorsqu'il est activé, votre salon est placé dans un espace de noms séparé auquel seuls les autres utilisateurs Tor ayant activé le même interrupteur peuvent accéder. Les utilisateurs clearnet ne peuvent jamais rejoindre un salon réservé à Tor, même s'ils connaissent le secret partagé.

Cela offre un niveau de sécurité supérieur aux salons partagés par défaut :

• Les deux parties sont routées à travers le réseau en oignon multi-sauts de Tor — l'adresse IP réelle et la localisation d'aucune des parties ne sont visibles par quiconque, y compris le serveur.
• Aucune recherche DNS, aucun CDN et aucune infrastructure tierce ne touche la connexion à aucun moment.
• L'analyse du trafic est considérablement plus difficile car les deux parties bénéficient du remplissage des relais de Tor combiné au remplissage de connexion propre à nullchat (trames factices aléatoires envoyées à intervalles aléatoires).
• Il n'y a pas de participant clearnet dont les métadonnées de connexion plus faibles pourraient être corrélées avec la conversation.

Vous n'êtes anonyme que dans la mesure du maillon le plus faible de la conversation. Dans un salon par défaut, la connexion d'un participant clearnet passe par des résolveurs DNS, une infrastructure CDN et un routage Internet standard — tous pouvant être observés ou faire l'objet d'une injonction pour obtenir des métadonnées sur qui s'est connecté, quand et d'où. L'interrupteur Tor uniquement élimine entièrement ce risque en garantissant que chaque participant bénéficie du même niveau d'anonymat au niveau réseau.

Les deux parties doivent convenir d'activer l'interrupteur — cela fonctionne de la même manière que pour convenir du secret partagé. L'en-tête du chat affiche « TOR UNIQUEMENT » en vert lorsqu'il est actif, ou « CLEARNET » en rouge pour les salons standards, afin que vous sachiez toujours dans quel mode vous êtes.`,
  faq_18_title: "Qu'est-ce que le délai d'inactivité ?",
  faq_18_body: `Si vous êtes inactif pendant 15 minutes — pas de frappe, pas de tapotement, pas de défilement — nullchat vous déconnecte automatiquement et vous ramène à l'écran de saisie du mot de passe. Un avertissement apparaît à 13 minutes vous donnant la possibilité de rester. Cela protège votre session si vous vous éloignez de votre appareil, empêchant les messages de se détruire alors que personne ne les lit activement, et garantissant que le chat n'est pas laissé visible sur un écran sans surveillance.`,
  faq_19_title: "Qu'en est-il des adresses IP ?",
  faq_19_body: `Sur le clearnet (nullchat.org), l'application est hébergée sur le réseau périphérique de Cloudflare. Votre adresse IP est gérée au niveau de l'infrastructure et n'est jamais lue, journalisée ou stockée par le code applicatif. Le code serveur n'accède pas aux en-têtes IP. Nous n'avons aucun mécanisme pour vous identifier par adresse réseau.

Sur le service caché Tor (.onion), votre adresse IP n'est jamais visible par le serveur — le routage en oignon de Tor assure un anonymat complet au niveau réseau. Le serveur ne voit que des connexions provenant du réseau Tor, sans aucun moyen de les retracer jusqu'à vous.`,
  faq_20_title: "Y a-t-il des cookies ou des traqueurs ?",
  faq_20_body: `Non. nullchat ne place aucun cookie, n'utilise aucune analytique, ne charge aucun script tiers, n'intègre aucun pixel de suivi et ne fait aucune requête externe. Les en-têtes Content Security Policy imposent cela au niveau du navigateur. Vous pouvez le vérifier dans les outils de développement de votre navigateur.`,
  faq_21_title: "Pourquoi ne puis-je pas envoyer de liens, d'images ou de fichiers ?",
  faq_21_body: `C'est voulu. nullchat est uniquement textuel — aucun lien, image, pièce jointe ou média d'aucune sorte ne peut être envoyé ou affiché. Il s'agit d'une décision de sécurité délibérée, pas d'une limitation. Les liens cliquables et les médias intégrés constituent la surface d'attaque principale pour les exploits zero-day utilisés par les logiciels espions commerciaux comme Pegasus, Predator et d'autres outils de surveillance similaires. Un seul lien ou fichier malveillant peut compromettre silencieusement un appareil entier. En réduisant le chat au texte brut uniquement, nullchat élimine entièrement ce vecteur d'attaque. Il n'y a rien à cliquer, rien à télécharger et rien à afficher — donc rien à exploiter.`,
  faq_22_title: "Puis-je copier ou capturer les messages ?",
  faq_22_body: `nullchat décourage activement la capture du contenu des messages. La sélection et la copie de texte sont désactivées dans la zone de chat, les menus contextuels du clic droit sont bloqués, et les raccourcis clavier courants de capture d'écran sont interceptés. L'API Screen Capture du navigateur est également bloquée via les en-têtes Permissions-Policy, empêchant les outils d'enregistrement d'écran web de capturer la page.

Ce sont des protections basées sur la friction, pas des garanties absolues. Un utilisateur déterminé peut toujours photographier son écran avec un autre appareil ou utiliser des outils au niveau du système d'exploitation qui contournent les restrictions du navigateur. L'objectif est de rendre la capture occasionnelle difficile et de renforcer l'idée que les conversations dans nullchat ne sont pas destinées à être conservées.`,
  faq_23_title: "Qu'est-ce que le trafic leurre ?",
  faq_23_body: `nullchat envoie automatiquement des messages factices chiffrés à intervalles aléatoires (toutes les 10 à 60 secondes) pendant que vous êtes connecté à un salon. Ces messages leurres sont indiscernables des vrais messages — ils ont la même taille (grâce au remplissage fixe), sont chiffrés avec la même clé et relayés par le même chemin serveur. Le client du destinataire les ignore silencieusement après déchiffrement.

Le trafic leurre contrecarre l'analyse du trafic. Sans lui, un observateur surveillant le trafic réseau pourrait déterminer quand une communication réelle a lieu en se basant sur l'envoi de blocs chiffrés. Avec les leurres, il y a un flux constant de trafic d'apparence identique, que quelqu'un soit en train de taper ou non — rendant impossible la distinction entre les vrais messages et le bruit.`,
  faq_24_title: "Qu'est-ce que le remplissage de connexion ?",
  faq_24_body: `Le serveur envoie des trames binaires de longueur aléatoire (64 à 512 octets de données aléatoires) à chaque client connecté à intervalles aléatoires (toutes les 5 à 30 secondes). Ces trames ne sont pas des messages — c'est du bruit pur que le client ignore silencieusement. Combiné au trafic leurre côté client, le remplissage de connexion garantit que les motifs de trafic réseau ne révèlent rien sur l'existence d'une communication réelle, le nombre de messages échangés ou le moment d'activité des participants.`,
  faq_25_title: "Qu'est-ce que la touche panique ?",
  faq_25_body: `Appuyer trois fois rapidement sur la touche Échap efface instantanément votre session. Lorsqu'elle est déclenchée, nullchat envoie une commande de suppression au serveur (effaçant tous vos messages), ferme la connexion WebSocket, met à zéro la clé de chiffrement en mémoire, vide le DOM, efface sessionStorage et localStorage, vide le presse-papiers et redirige votre navigateur vers google.com. L'ensemble du processus prend moins d'une seconde. Si le navigateur tente de restaurer la page depuis le cache (par exemple via le bouton retour), l'effacement est automatiquement relancé. Utilisez cette fonction si vous devez effacer immédiatement toute trace de la conversation de votre écran et de votre navigateur.`,
  faq_26_title: "Qu'est-ce que le mode stéganographique ?",
  faq_26_body: `Le mode stéganographique déguise l'interface de nullchat en éditeur de document. Appuyez cinq fois rapidement sur Maj pour l'activer. L'ensemble de l'interface se transforme — l'interface sombre du chat est remplacée par une interface d'édition de document familière avec barre d'outils et barre de menus. Les messages apparaissent sous forme de paragraphes dans le corps du document, et votre saisie se fond comme de la frappe active. Tout le chiffrement, les minuteurs de destruction et les fonctionnalités de sécurité continuent de fonctionner normalement en arrière-plan.

C'est utile si quelqu'un regarde par-dessus votre épaule ou si votre écran est visible par d'autres. Au premier coup d'oeil, on dirait que vous éditez un document, pas que vous avez une conversation chiffrée. Appuyez cinq fois à nouveau sur Maj pour revenir à l'affichage normal du chat.`,
  faq_27_title: "nullchat efface-t-il automatiquement le presse-papiers ?",
  faq_27_body: `Oui. Si quoi que ce soit est copié pendant que vous êtes dans un salon, nullchat efface automatiquement votre presse-papiers après 15 secondes. Le presse-papiers est également vidé lorsque vous fermez l'onglet ou naviguez ailleurs, et immédiatement si vous utilisez la touche panique. Cela empêche le contenu des messages de persister dans votre presse-papiers après avoir quitté la conversation.`,
  faq_28_title: "Pouvez-vous lire mes messages ?",
  faq_28_body: `Non. Le serveur est un simple relais. Il reçoit des blocs chiffrés et les transmet. La clé de chiffrement est dérivée de votre secret partagé, qui ne quitte jamais votre navigateur. Nous n'avons pas la clé. Nous ne pouvons pas déchiffrer les blocs. Même si le serveur était compromis, l'attaquant n'obtiendrait que du texte chiffré sans signification.`,
  faq_29_title: "Les agences gouvernementales peuvent-elles accéder à mes messages ?",
  faq_29_body: `Nous ne pouvons pas fournir ce que nous n'avons pas. Il n'y a aucun message en clair stocké nulle part. Il n'y a aucun compte utilisateur à consulter. Il n'y a aucun journal d'adresses IP à remettre. Les blocs chiffrés s'effacent automatiquement selon un calendrier fixe. Même en vertu d'une ordonnance juridique valide, le maximum que nous pourrions produire est une collection de blocs chiffrés et de hashes de salons — aucun d'entre eux n'étant exploitable sans le secret partagé que seuls les participants connaissent.`,
  faq_30_title: "nullchat est-il open source ?",
  faq_30_body_1: `Oui. L'intégralité du code source — client, serveur, chiffrement et configuration de l'infrastructure — est publiquement disponible pour audit sur`,
  faq_30_body_2: `. Vous pouvez vérifier que le code exécuté sur le serveur correspond à ce qui est publié, le compiler vous-même ou héberger votre propre instance. La transparence n'est pas optionnelle pour un outil qui vous demande de lui confier vos communications privées.`,
  faq_31_title: "Qui a créé nullchat ?",
  faq_31_body_1: `nullchat est développé par Artorias — une entreprise de technologie du renseignement dirigée par des vétérans, basée à New York. Artorias a pour mission de démanteler les systèmes obsolètes et d'armer les organisations et individus les plus importants avec des outils conçus spécifiquement pour opérer dans l'ombre. Au coeur de sa mission, Artorias vise à démocratiser le renseignement et l'anonymat — en garantissant que la capacité de communiquer en toute sécurité et d'opérer sans surveillance ne soit pas un privilège réservé à quelques-uns. nullchat est une expression de cette mission : la communication sécurisée réduite à l'essentiel, sans compromis sur l'intégrité cryptographique. En savoir plus sur`,

};
