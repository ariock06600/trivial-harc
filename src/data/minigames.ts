import { DifficultyLevel } from './questions/types';

export type MinigameId = 'word-detector' | 'cyber-sort' | 'inclusion-circle';

export interface MinigameMeta {
  id: MinigameId;
  title: string;
  subtitle: string;
  skillLabel: string;
  description: string;
  accentColor: string;
  lightBg: string;
}

export const MINIGAME_META: Record<MinigameId, MinigameMeta> = {
  'word-detector': {
    id: 'word-detector',
    title: 'Le Détecteur de Mots',
    subtitle: 'Communication bienveillante',
    skillLabel: 'Reformulation & apaisement',
    description:
      'Transforme une phrase blessante ou tendue en un message clair, calme et respectueux pour désamorcer le conflit.',
    accentColor: '#C97A16',
    lightBg: '#FEF6E9',
  },
  'cyber-sort': {
    id: 'cyber-sort',
    title: 'Bouclier Cyber-Vigilance',
    subtitle: 'Réflexes numériques sûrs',
    skillLabel: 'Protection en ligne',
    description:
      'Des messages apparaissent sur la tablette de la classe : choisis vite la réaction la plus sûre et bienveillante.',
    accentColor: '#6D46A8',
    lightBg: '#F4EFFB',
  },
  'inclusion-circle': {
    id: 'inclusion-circle',
    title: 'Le Cercle d’Inclusion',
    subtitle: 'Scène de cour interactive',
    skillLabel: 'Empathie & posture d’allié',
    description:
      'Observe la cour de récréation et enchaîne 3 gestes d’allié bienveillants pour transformer la situation.',
    accentColor: '#1E7F5C',
    lightBg: '#ECF8F3',
  },
};

export interface WordDetectorChallenge {
  id: string;
  tier: DifficultyLevel;
  context: string;
  hurtfulPhrase: string;
  options: [
    { text: string; isKind: boolean; feedback: string },
    { text: string; isKind: boolean; feedback: string },
    { text: string; isKind: boolean; feedback: string },
  ];
}

export const WORD_DETECTOR_CHALLENGES: WordDetectorChallenge[] = [
  // Tier 1 (6-8 ans)
  {
    id: 'wd-1',
    tier: 1,
    context: 'Dans la cour, un camarade rate une passe au ballon.',
    hurtfulPhrase: '« T’es trop nul, ne joue plus jamais avec nous ! »',
    options: [
      {
        text: '« Pas grave, bien essayé ! On refait une passe ensemble ? »',
        isKind: true,
        feedback: 'Bravo ! Encourager son camarade lui donne confiance et rend le jeu joyeux.',
      },
      {
        text: '« Tu devrais t’asseoir sur le banc tout seul. »',
        isKind: false,
        feedback: 'Cette phrase exclut encore le camarade. On préfère encourager son effort !',
      },
      {
        text: '« C’est de ta faute si on a perdu ! »',
        isKind: false,
        feedback: 'Accuser un seul joueur blesse et gâche l’esprit d’équipe.',
      },
    ],
  },
  {
    id: 'wd-2',
    tier: 1,
    context: 'En classe, un voisin renverse sans faire exprès ta trousse.',
    hurtfulPhrase: '« T’es vraiment trop maladroit, pousse-toi ! »',
    options: [
      {
        text: '« Je suis surpris que ma trousse soit tombée, tu veux bien m’aider à ramasser ? »',
        isKind: true,
        feedback: 'Super ! Tu exprimes ce qui te gêne calmement et tu proposes de coopérer.',
      },
      {
        text: '« Je vais faire tomber tes cahiers exprès aussi ! »',
        isKind: false,
        feedback: 'Se venger transforme une maladresse en vraie dispute.',
      },
      {
        text: '« Tu ne fais jamais attention à rien ! »',
        isKind: false,
        feedback: 'Dire « jamais » attaque la personne au lieu de régler le petit accident.',
      },
    ],
  },
  {
    id: 'wd-3',
    tier: 1,
    context: 'Un camarade lit doucement à voix haute et hésite sur un mot.',
    hurtfulPhrase: '« Dépêche-toi, tu lis comme un bébé ! »',
    options: [
      {
        text: '« Prends ton temps, ce mot est difficile, tu vas y arriver ! »',
        isKind: true,
        feedback: 'Magnifique ! La patience et les encouragements aident chacun à progresser.',
      },
      {
        text: '« Arrête de lire, passe le livre à quelqu’un d’autre. »',
        isKind: false,
        feedback: 'Lui retirer la parole risque de lui faire perdre toute envie d’essayer.',
      },
      {
        text: '« Moi je lis beaucoup plus vite que toi. »',
        isKind: false,
        feedback: 'Comparer pour rabaisser ne l’aide pas à prendre confiance.',
      },
    ],
  },
  // Tier 2 (9-11 ans)
  {
    id: 'wd-4',
    tier: 2,
    context: 'En travail de groupe, un élève coupe toujours la parole aux autres.',
    hurtfulPhrase: '« Tais-toi, tu es insupportable, personne ne veut de tes idées ! »',
    options: [
      {
        text: '« J’aimerais aussi pouvoir finir mon idée : on peut s’écouter chacun son tour ? »',
        isKind: true,
        feedback: 'Parfait ! Tu poses une limite claire avec « Je » sans insulter ton camarade.',
      },
      {
        text: '« On va changer de table sans te le dire. »',
        isKind: false,
        feedback: 'Exclure en cachette crée de l’isolement au lieu de régler la façon de travailler.',
      },
      {
        text: '« De toute façon tu dis n’importe quoi. »',
        isKind: false,
        feedback: 'Rabaisser les idées de l’autre ferme immédiatement la discussion.',
      },
    ],
  },
  {
    id: 'wd-5',
    tier: 2,
    context: 'Un camarade porte des chaussures simples que d’autres critiquent.',
    hurtfulPhrase: '« Elles sont bizarres tes baskets, t’as pas de style ! »',
    options: [
      {
        text: '« Chacun son style ! L’important c’est d’être bien dedans. On va jouer ? »',
        isKind: true,
        feedback: 'Excellent ! Tu désamorces la moquerie avec naturel et tu ramènes l’attention sur le jeu.',
      },
      {
        text: '« Tu devrais demander d’autres chaussures à tes parents. »',
        isKind: false,
        feedback: 'Cela donne raison aux moqueurs et met le camarade mal à l’aise.',
      },
      {
        text: '« Ne les écoute pas, elles sont juste un peu vieilles. »',
        isKind: false,
        feedback: 'Même gentil en apparence, critiquer ses chaussures renforce sa gêne.',
      },
    ],
  },
  {
    id: 'wd-6',
    tier: 2,
    context: 'Dans le couloir, un ami répète une rumeur sur une élève de la classe.',
    hurtfulPhrase: '« Paraît qu’elle a triché, tout le monde le dit ! »',
    options: [
      {
        text: '« On n’a aucune preuve et ça peut lui faire beaucoup de mal : mieux vaut ne pas répéter ça. »',
        isKind: true,
        feedback: 'Bravo ! Tu coupes court à la rumeur avec calme et esprit critique.',
      },
      {
        text: '« Raconte-moi tout, mais je ne le dirai qu’à deux personnes. »',
        isKind: false,
        feedback: 'Répéter même à deux personnes suffit pour qu’une rumeur fasse le tour de l’école.',
      },
      {
        text: '« Allons lui crier devant tout le monde que c’est une tricheuse ! »',
        isKind: false,
        feedback: 'Accuser publiquement sans preuve est une grave humiliation.',
      },
    ],
  },
  // Tier 3 (12-15 ans)
  {
    id: 'wd-7',
    tier: 3,
    context: 'En exposé de 4e, un élève bafouille et un duo ricane au fond.',
    hurtfulPhrase: '« Franchement c’est gênant, t’as même pas révisé ! »',
    options: [
      {
        text: '« Parler devant toute la classe n’est pas simple : ton plan est clair, continue ! »',
        isKind: true,
        feedback: 'Remarquable ! Tu valides son effort et tu rassures toute la salle.',
      },
      {
        text: '« C’est vrai que tu stressais trop, la prochaine fois lis ta feuille. »',
        isKind: false,
        feedback: 'Cette remarque sur le vif augmente encore son malaise devant le groupe.',
      },
      {
        text: '« Ignore-les, de toute façon ils ont de mauvaises notes eux aussi. »',
        isKind: false,
        feedback: 'Attaquer les autres déplace le conflit au lieu de créer un climat serein.',
      },
    ],
  },
  {
    id: 'wd-8',
    tier: 3,
    context: 'Un camarade poste un commentaire sarcastique dans le groupe de devoirs.',
    hurtfulPhrase: '« Encore une question débile… t’écoutes en cours parfois ? »',
    options: [
      {
        text: '« Ce groupe sert à s’entraider : moi aussi j’avais un doute sur l’exo 3, voici l’explication ! »',
        isKind: true,
        feedback: 'Superbe posture d’ambassadeur ! Tu rappelles l’objectif d’entraide sans agresser.',
      },
      {
        text: '« C’est toi qui es débile, quitte le groupe ! »',
        isKind: false,
        feedback: 'Répondre par une insulte lance une escalade de cyber-conflit.',
      },
      {
        text: 'Mettre un émoji rire pour détendre.',
        isKind: false,
        feedback: 'Un émoji rire sous une remarque méchante valide l’humiliation.',
      },
    ],
  },
  {
    id: 'wd-9',
    tier: 3,
    context: 'Un ami proche se moque d’un nouvel élève pour impressionner d’autres camarades.',
    hurtfulPhrase: '« Regarde le nouveau, il connaît personne, il est trop bizarre. »',
    options: [
      {
        text: '« Franchement, arriver dans un nouveau collège c’est dur : et si on allait plutôt lui parler ? »',
        isKind: true,
        feedback: 'Bravo ! Un recadrage calme entre amis change l’ambiance sans faire la morale.',
      },
      {
        text: '« C’est vrai qu’il a l’air un peu étrange, mais laisse tomber. »',
        isKind: false,
        feedback: 'Valider l’étiquette « étrange » entretient le préjugé.',
      },
      {
        text: 'Ne rien dire et s’éloigner en silence.',
        isKind: false,
        feedback: 'Ici ton ami est proche : ta voix bienveillante peut vraiment le faire réfléchir.',
      },
    ],
  },
];

export type CyberActionType = 'encourage' | 'block-report' | 'support-alert';

export interface CyberSortItem {
  id: string;
  tier: DifficultyLevel;
  sender: string;
  channel: string;
  message: string;
  correctAction: CyberActionType;
  explanation: string;
}

export const CYBER_ACTION_LABELS: Record<
  CyberActionType,
  { label: string; shortDesc: string }
> = {
  encourage: {
    label: 'Répondre avec bienveillance',
    shortDesc: 'Message positif ou demande d’aide normale',
  },
  'block-report': {
    label: 'Ne pas relayer · Bloquer / Signaler',
    shortDesc: 'Inconnu, piège ou contenu malveillant à stopper',
  },
  'support-alert': {
    label: 'Capturer · Soutenir & alerter un adulte / 3018',
    shortDesc: 'Camarade visé par du cyberharcèlement ou menaces',
  },
};

export const CYBER_SORT_ITEMS: CyberSortItem[] = [
  // Tier 1 (6-8 ans)
  {
    id: 'cs-1',
    tier: 1,
    sender: 'JoueurInconnu99',
    channel: 'Chat de jeu',
    message: '« Donne-moi ton mot de passe et le nom de ton école pour gagner 1000 pièces ! »',
    correctAction: 'block-report',
    explanation: 'C’est un piège ! On ne donne jamais ses infos privées ni son mot de passe : on ferme, on bloque et on prévient ses parents.',
  },
  {
    id: 'cs-2',
    tier: 1,
    sender: 'LoutreJoyeuse (camarade)',
    channel: 'Espace classe',
    message: '« Bravo pour ton dessin de fusée aujourd’hui, j’ai adoré les couleurs ! »',
    correctAction: 'encourage',
    explanation: 'C’est un gentil compliment d’un camarade : on peut répondre merci avec plaisir !',
  },
  {
    id: 'cs-3',
    tier: 1,
    sender: 'Groupe de jeu',
    channel: 'Messagerie',
    message: 'Quelqu’un envoie une photo de Sami qui est tombé dans la cour avec écrit « Trop ridicule ahaha ».',
    correctAction: 'support-alert',
    explanation: 'On ne transfère surtout pas ! On garde la preuve avec ses parents pour aider Sami et faire supprimer la photo.',
  },
  // Tier 2 (9-11 ans)
  {
    id: 'cs-4',
    tier: 2,
    sender: 'Groupe Classe CM2',
    channel: 'Messagerie de groupe',
    message: '« On a créé un groupe sans Nora, mettez tous une moquerie sur son exposé ! »',
    correctAction: 'support-alert',
    explanation: 'C’est du cyberharcèlement de groupe : faire une capture d’écran, refuser de participer, soutenir Nora et prévenir un adulte.',
  },
  {
    id: 'cs-5',
    tier: 2,
    sender: 'PandaCurieux',
    channel: 'ENT de l’école',
    message: '« Salut, j’étais malade hier, est-ce que tu pourrais m’envoyer la leçon de sciences stp ? »',
    correctAction: 'encourage',
    explanation: 'Entraider un camarade absent sur ses devoirs via l’ENT est un super usage du numérique !',
  },
  {
    id: 'cs-6',
    tier: 2,
    sender: 'CompteAnonyme_07',
    channel: 'Jeu en ligne',
    message: 'Un inconnu t’insulte dans le chat vocal et t’envoie des liens bizarres à cliquer.',
    correctAction: 'block-report',
    explanation: 'Couper le son, ne cliquer sur aucun lien, bloquer/signaler le compte et prévenir ses parents te protège aussitôt.',
  },
  // Tier 3 (12-15 ans)
  {
    id: 'cs-7',
    tier: 3,
    sender: 'PotinsDuCollege_Off',
    channel: 'Réseau social',
    message: 'Un compte anonyme publie un montage photo humiliant d’un élève de 5e et invite à voter en commentaire.',
    correctAction: 'support-alert',
    explanation: 'Ne jamais s’abonner ni commenter : capturer avec l’URL, signaler la page, soutenir l’élève et alerter le CPE et le 3018.',
  },
  {
    id: 'cs-8',
    tier: 3,
    sender: 'HibouCalme',
    channel: 'Groupe Révisions 3e',
    message: '« J’ai fait une fiche récap d’histoire pour le brevet blanc, je vous la partage si ça aide ! »',
    correctAction: 'encourage',
    explanation: 'Partager des fiches de révision et remercier ses camarades entretient un groupe d’entraide précieux.',
  },
  {
    id: 'cs-9',
    tier: 3,
    sender: 'SondageSecret_Link',
    channel: 'Message transféré',
    message: '« Clique vite sur ce lien pour classer anonymement les élèves de ta classe du plus cool au moins cool ! »',
    correctAction: 'block-report',
    explanation: 'Ces liens de classement anonyme nourrissent le cyberharcèlement : on refuse de cliquer, on ne relaye pas et on signale.',
  },
];

export interface InclusionStep {
  situationText: string;
  allyMood: 'isolated' | 'hopeful' | 'included';
  choices: [
    { label: string; isAlly: boolean; outcome: string },
    { label: string; isAlly: boolean; outcome: string },
    { label: string; isAlly: boolean; outcome: string },
  ];
}

export interface InclusionScenario {
  id: string;
  tier: DifficultyLevel;
  title: string;
  setting: string;
  victimName: string;
  steps: [InclusionStep, InclusionStep, InclusionStep];
}

export const INCLUSION_SCENARIOS: InclusionScenario[] = [
  {
    id: 'inc-1',
    tier: 1,
    title: 'Le banc de la cour',
    setting: 'Récréation du matin · Cour de l’école',
    victimName: 'Milo',
    steps: [
      {
        situationText: 'Milo vient d’arriver dans l’école. Deux enfants lui ont dit que la marelle était « complète » et il reste seul sur le banc.',
        allyMood: 'isolated',
        choices: [
          {
            label: 'S’approcher de Milo avec un sourire et lui dire bonjour',
            isAlly: true,
            outcome: 'Milo relève la tête et te rend ton sourire : il ne se sent déjà plus invisible !',
          },
          {
            label: 'Le regarder de loin sans bouger',
            isAlly: false,
            outcome: 'Milo reste tout seul sur son banc. Essaie un geste chaleureux pour briser la glace !',
          },
          {
            label: 'Dire aux autres qu’il n’a pas envie de jouer',
            isAlly: false,
            outcome: 'Sans lui avoir demandé, on risque de l’isoler encore plus.',
          },
        ],
      },
      {
        situationText: 'Milo te dit doucement qu’il ne connaît pas encore bien les règles du jeu de la cour.',
        allyMood: 'hopeful',
        choices: [
          {
            label: 'Lui expliquer les règles simplement et faire une partie d’essai ensemble',
            isAlly: true,
            outcome: 'Super ! Milo comprend vite et rit avec toi pendant le tour d’essai.',
          },
          {
            label: 'Lui dire qu’il jouera l’année prochaine',
            isAlly: false,
            outcome: 'Expliquer une règle prend 20 secondes et ouvre la porte à une belle amitié.',
          },
          {
            label: 'Partir jouer sans lui',
            isAlly: false,
            outcome: 'Milo se sent à nouveau laissé de côté.',
          },
        ],
      },
      {
        situationText: 'Un enfant passe et lance une moquerie à Milo qui hésite à nouveau.',
        allyMood: 'hopeful',
        choices: [
          {
            label: 'Dire calmement « Arrête, il joue avec nous ! » et prévenir l’adulte si l’enfant insiste',
            isAlly: true,
            outcome: 'Bravo ! Le cercle s’ouvre, d’autres camarades rejoignent le jeu et Milo passe une super récréation.',
          },
          {
            label: 'Pousser l’enfant moqueur très fort',
            isAlly: false,
            outcome: 'Répondre par des coups déclenche une bagarre. La fermeté calme et l’adulte protègent mieux !',
          },
          {
            label: 'Rire avec l’enfant moqueur',
            isAlly: false,
            outcome: 'Rire d’une moquerie brise la confiance que Milo venait de retrouver.',
          },
        ],
      },
    ],
  },
  {
    id: 'inc-2',
    tier: 2,
    title: 'La table du self',
    setting: 'Pause déjeuner · Cantine',
    victimName: 'Inès',
    steps: [
      {
        situationText: 'Une rumeur fausse circule sur Inès. Quand elle arrive avec son plateau, plusieurs élèves se lèvent brusquement de leur table.',
        allyMood: 'isolated',
        choices: [
          {
            label: 'Rester assis, lui faire signe et lui garder la place juste à côté de toi',
            isAlly: true,
            outcome: 'Inès souffle de soulagement et vient s’installer avec toi.',
          },
          {
            label: 'Te lever et suivre les autres pour ne pas te faire remarquer',
            isAlly: false,
            outcome: 'Suivre le mouvement renforce le boycott. Un seul camarade qui reste change tout !',
          },
          {
            label: 'Lui demander fort devant tout le monde si la rumeur est vraie',
            isAlly: false,
            outcome: 'L’interroger devant tout le self augmente sa gêne.',
          },
        ],
      },
      {
        situationText: 'Inès te confie à voix basse que cela fait quatre jours qu’on la met de côté à cause de cette histoire inventée.',
        allyMood: 'hopeful',
        choices: [
          {
            label: 'Lui dire que tu la crois, que c’est injuste et proposer d’aller voir ensemble le CPE après le repas',
            isAlly: true,
            outcome: 'Inès retrouve du courage : savoir qu’elle n’ira pas seule la rassure énormément.',
          },
          {
            label: 'Lui conseiller de lancer une autre rumeur pour se venger',
            isAlly: false,
            outcome: 'Une contre-rumeur aggrave les conflits dans toute l’école.',
          },
          {
            label: 'Lui dire de ne rien dire à personne jusqu’aux vacances',
            isAlly: false,
            outcome: 'Le silence laisse le harcèlement s’installer durablement.',
          },
        ],
      },
      {
        situationText: 'Après le repas, deux autres camarades te demandent pourquoi tu as mangé avec Inès.',
        allyMood: 'hopeful',
        choices: [
          {
            label: 'Répondre naturellement : « Cette rumeur est fausse, Inès est super sympa, venez discuter avec nous ! »',
            isAlly: true,
            outcome: 'Parfait ! Les deux camarades se joignent à vous et la rumeur s’éteint d’elle-même.',
          },
          {
            label: 'Dire que tu n’avais pas le choix',
            isAlly: false,
            outcome: 'Assumer sereinement son choix d’amitié inspire les autres à faire pareil.',
          },
          {
            label: 'Les insulter d’avoir cru la rumeur',
            isAlly: false,
            outcome: 'Rester calme et ouvert permet aux autres de changer d’avis facilement.',
          },
        ],
      },
    ],
  },
  {
    id: 'inc-3',
    tier: 3,
    title: 'Le couloir des casiers',
    setting: 'Intercours · Collège',
    victimName: 'Yanis',
    steps: [
      {
        situationText: 'Deux élèves bloquent le casier de Yanis en se moquant de ses vêtements pendant que trois curieux observent sans bouger.',
        allyMood: 'isolated',
        choices: [
          {
            label: 'Créer une diversion calme : « Hé Yanis, le prof demande nos dossiers en salle B2, tu viens ? »',
            isAlly: true,
            outcome: 'Excellente diversion ! Yanis récupère son cahier et quitte l’encerclement sans violence.',
          },
          {
            label: 'Sortir ton téléphone pour filmer la scène',
            isAlly: false,
            outcome: 'Filmer excite les harceleurs et humilie davantage Yanis.',
          },
          {
            label: 'Rester immobile avec les autres spectateurs',
            isAlly: false,
            outcome: 'La diffusion de responsabilité bloque tout le monde : oser faire le premier pas change la scène.',
          },
        ],
      },
      {
        situationText: 'Un peu plus loin dans le couloir, Yanis t’avoue que ça se répète tous les jours et qu’il reçoit aussi des messages méchants le soir.',
        allyMood: 'hopeful',
        choices: [
          {
            label: 'L’écouter sans juger, lui rappeler le 3018 (coffre-fort à preuves) et l’accompagner vers le CPE ou l’infirmière',
            isAlly: true,
            outcome: 'Yanis accepte d’aller voir le CPE avec toi et d’en parler à ses parents ce soir.',
          },
          {
            label: 'Prendre son téléphone pour insulter les harceleurs à sa place',
            isAlly: false,
            outcome: 'Répondre par des insultes aggrave le conflit et peut se retourner contre Yanis.',
          },
          {
            label: 'Promettre de garder le secret absolu',
            isAlly: false,
            outcome: 'Face à un harcèlement installé, les adultes ressources sont indispensables pour le stopper.',
          },
        ],
      },
      {
        situationText: 'Le lendemain, Yanis appréhende de retourner dans la cour à la récréation.',
        allyMood: 'hopeful',
        choices: [
          {
            label: 'Lui proposer spontanément de passer la pause avec ton groupe autour d’une activité qu’il aime',
            isAlly: true,
            outcome: 'Victoire collective ! Entouré d’alliés et protégé par l’équipe éducative, Yanis retrouve le sourire au collège.',
          },
          {
            label: 'Lui demander toutes les dix minutes devant tout le monde s’il a encore peur',
            isAlly: false,
            outcome: 'Lui offrir des moments simples et normaux l’aide bien mieux à reprendre confiance.',
          },
          {
            label: 'L’éviter pour ne pas rappeler l’histoire',
            isAlly: false,
            outcome: 'Ta présence amicale constante est ce qui consolide sa sécurité.',
          },
        ],
      },
    ],
  },
];

export function pickWordDetectorForAge(age: number, excludeIds: string[] = []): WordDetectorChallenge {
  const tier: DifficultyLevel = age <= 8 ? 1 : age <= 11 ? 2 : 3;
  const preferred = WORD_DETECTOR_CHALLENGES.filter(
    (c) => c.tier === tier && !excludeIds.includes(c.id),
  );
  const pool = preferred.length > 0 ? preferred : WORD_DETECTOR_CHALLENGES.filter((c) => c.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)] ?? WORD_DETECTOR_CHALLENGES[0];
}

export function pickCyberSortForAge(age: number): CyberSortItem[] {
  const tier: DifficultyLevel = age <= 8 ? 1 : age <= 11 ? 2 : 3;
  const tierItems = CYBER_SORT_ITEMS.filter((item) => item.tier === tier);
  return tierItems.length >= 3 ? tierItems : CYBER_SORT_ITEMS.slice(0, 3);
}

export function pickInclusionScenarioForAge(age: number): InclusionScenario {
  const tier: DifficultyLevel = age <= 8 ? 1 : age <= 11 ? 2 : 3;
  return INCLUSION_SCENARIOS.find((s) => s.tier === tier) ?? INCLUSION_SCENARIOS[0];
}
