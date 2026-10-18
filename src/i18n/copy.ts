/** Every string the interface shows, in both languages.
 *
 * `en` is the source of truth and `pt` is typed against it, so a key added to
 * one and forgotten in the other is a compile error rather than a blank space
 * someone notices in production. Interpolated strings are functions instead of
 * templates with placeholders: no parser to write, and the argument types are
 * checked at both ends. */
export const en = {
  nav: {
    demo: 'Demo',
    source: 'Source',
    signOut: 'Sign out',
    language: 'Language',
  },
  footer: {
    credit: (year: number) => `© ${year} Lucas de Oliveira. Not affiliated with Spotify.`,
    api: 'API',
    web: 'Front end',
  },
  home: {
    titleTop: 'Your listening,',
    titleBottom: 'read back to you',
    lede:
      'Spotify tells you what you played. This tells you what that says: which decades you actually live in, how few names hold most of your listening, what entered and left your rotation this month, and the hours you reach for music.',
    signIn: 'Sign in with Spotify',
    demoLink: 'See it without an account',
    devModeNote:
      'Spotify limits apps in development mode to a handful of approved accounts, so signing in only works if yours is one of them. The demo is the same code over stored data.',
    chartCaption: 'A real answer, from the demo account: the decades its top tracks come from.',
    waking: 'The API is waking up. Reload in a moment.',
    loading: 'Loading…',
    howItWorks: 'How it works',
    how1:
      "You authorise through Spotify's own screen. The app never sees your password, and the tokens it receives stay on the server.",
    how2:
      'Four statistics are computed from your top items and recent plays, the only endpoints Spotify still exposes to new apps.',
    how3:
      'Listening history is accumulated over time, because Spotify returns only the last 50 plays and cannot page further back.',
  },
  demo: {
    title: 'Demo',
    lede:
      "Stored Spotify responses from the author's account, read by the same code that serves a signed in user. No account needed. The demo exists because Spotify keeps an app in development mode until it is reviewed, and a development mode app can only be used by five accounts on an allowlist.",
  },
  dashboard: {
    title: (name: string | null) => (name ? `${name}'s listening` : 'Your listening'),
    lede: 'Three readings of what you have been playing, then the detail behind each one.',
    collect: 'Collect recent plays',
    collecting: 'Collecting…',
    upToDate: 'Already up to date. Nothing new since the last collection.',
    saved: (count: number) => `Saved ${count} new plays.`,
    collectFailed: 'Could not collect right now. Try again in a moment.',
    notSignedIn: 'You are not signed in',
    backHome: 'Back to the start',
  },
  callback: {
    signingIn: 'Signing you in…',
  },
  states: {
    wakingTitle: 'Waking the server',
    wakingBody:
      'The API sleeps after 15 minutes without traffic, so the first request of the day can take up to a minute. Later ones are immediate.',
  },
  spotify: {
    contentFrom: 'Content from',
    playOn: 'Play on Spotify',
  },
  print: {
    title: 'Your print',
    body:
      'One spoke per hour, midnight at the top, each as long as that hour is busy. The core is the share your top three artists hold, so a narrow rotation shows as a dense centre.',
    footnote: (plays: number) =>
      `Drawn from ${plays} plays collected so far. It thickens as the history grows.`,
    alt: (plays: number) =>
      `A radial figure of ${plays} plays, one spoke per hour of the day, midnight at the top.`,
  },
  pending: {
    concentration: 'Counting the artists you repeat',
    hours: 'Reading the hours you listen',
    decades: 'Dating your top tracks',
    noHistory: 'No history collected yet, so there is no clock to read.',
  },
  decades: {
    heading: 'Where your taste sits in time',
    caption: 'Which decade each of your top tracks was released in.',
    loading: 'Reading your top tracks',
    error: 'Could not load decades',
    footnote: (tracks: number) =>
      `Based on ${tracks} tracks. The date is the album's, so reissues and re-recordings count in the year they came out again.`,
  },
  concentration: {
    heading: 'The names behind that concentration',
    caption: 'Your most repeated artists, and how many of your top tracks each one holds.',
    loading: 'Counting artists',
    error: 'Could not load concentration',
  },
  comparison: {
    heading: 'What changed between the last four weeks and the last year',
    caption: 'Artists that appeared, disappeared, or moved between the two rankings.',
    loading: 'Comparing both rankings',
    error: 'Could not load the comparison',
    entered: 'New this month',
    climbed: 'Climbing',
    dropped: 'Dropped out',
    wasAt: (position: number) => `was #${position}`,
    empty: 'Nothing moved here.',
  },
  patterns: {
    heading: 'When you actually listen',
    caption: (timezone: string) =>
      `Plays by hour of the day, in ${timezone}. Built from history this API collects itself, because Spotify only ever returns the last 50 plays.`,
    loading: 'Reading your history',
    error: 'Could not load patterns',
    emptyTitle: 'No history yet',
    emptyBody:
      'Collect your recent plays once and this fills in. It gets more interesting after a few days.',
    busiest: (weekday: string) => `Busiest on ${weekday}. `,
    // The API names weekdays in English. Looked up rather than translated on
    // the fly, with the raw name as the fallback if the API ever changes them.
    weekdays: {
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
      Sunday: 'Sunday',
    } as Record<string, string>,
    streak: (days: number) => `Longest streak of consecutive listening days: ${days}.`,
    hourTooltip: (clock: string, plays: number) => `${clock}, ${plays} plays`,
  },
  readings: {
    concentrationSentence: 'of everything you play comes from three artists.',
    concentrationNarrow: (artists: number) =>
      `Three names out of ${artists} hold most of what you play.`,
    concentrationMiddle: (artists: number, tracks: number) =>
      `${artists} artists turn up across ${tracks} tracks, but the top three take the biggest slice.`,
    concentrationWide: (artists: number) =>
      `A wide rotation: ${artists} artists share your listening fairly evenly.`,
    decadeSentence: (decade: number) => `of your top tracks came out in the ${decade}s.`,
    decadeOlderThanStreaming: 'Most of what you play is older than streaming itself.',
    decadeOldest: (decade: number) => `Your oldest pick reaches back to the ${decade}s.`,
    hourSentence: (from: string, to: string) => `of your plays land between ${from} and ${to}.`,
    hourNote: (plays: number, timezone: string) =>
      `From ${plays} plays collected so far, counted in ${timezone}.`,
  },
}

export type Copy = typeof en

export const pt: Copy = {
  nav: {
    demo: 'Demo',
    source: 'Código',
    signOut: 'Sair',
    language: 'Idioma',
  },
  footer: {
    credit: (year: number) => `© ${year} Lucas de Oliveira. Sem vínculo com o Spotify.`,
    api: 'API',
    web: 'Front-end',
  },
  home: {
    titleTop: 'Sua escuta,',
    titleBottom: 'lida de volta',
    lede:
      'O Spotify te diz o que você tocou. Aqui você vê o que isso diz: em quais décadas você vive de verdade, quão poucos nomes seguram a maior parte da sua escuta, o que entrou e saiu da sua rotação neste mês, e as horas em que você procura música.',
    signIn: 'Entrar com o Spotify',
    demoLink: 'Ver sem fazer login',
    devModeNote:
      'O Spotify limita apps em modo de desenvolvimento a um punhado de contas aprovadas, então o login só funciona se a sua for uma delas. O demo é o mesmo código sobre dados guardados.',
    chartCaption: 'Uma resposta real, da conta do demo: as décadas de onde vêm as faixas mais tocadas.',
    waking: 'A API está acordando. Recarregue em instantes.',
    loading: 'Carregando…',
    howItWorks: 'Como funciona',
    how1:
      'Você autoriza pela própria tela do Spotify. O app nunca vê sua senha, e os tokens que ele recebe ficam no servidor.',
    how2:
      'Quatro estatísticas são calculadas a partir dos seus itens mais ouvidos e das execuções recentes, os únicos endpoints que o Spotify ainda abre para apps novos.',
    how3:
      'O histórico de escuta é acumulado com o tempo, porque o Spotify devolve só as últimas 50 execuções e não dá para voltar mais.',
  },
  demo: {
    title: 'Demo',
    lede:
      'Respostas do Spotify guardadas da conta do autor, lidas pelo mesmo código que atende um usuário logado. Não precisa de conta. O demo existe porque o Spotify mantém um app em modo de desenvolvimento até revisá-lo, e um app nesse modo só pode ser usado por cinco contas numa lista.',
  },
  dashboard: {
    title: (name: string | null) => (name ? `A escuta de ${name}` : 'Sua escuta'),
    lede: 'Três leituras do que você andou tocando, e depois o detalhe por trás de cada uma.',
    collect: 'Coletar execuções recentes',
    collecting: 'Coletando…',
    upToDate: 'Já está em dia. Nada novo desde a última coleta.',
    saved: (count: number) => `${count} execuções novas salvas.`,
    collectFailed: 'Não deu para coletar agora. Tente de novo em instantes.',
    notSignedIn: 'Você não está logado',
    backHome: 'Voltar ao início',
  },
  callback: {
    signingIn: 'Entrando…',
  },
  states: {
    wakingTitle: 'Acordando o servidor',
    wakingBody:
      'A API dorme depois de 15 minutos sem tráfego, então a primeira requisição do dia pode levar até um minuto. As seguintes são imediatas.',
  },
  spotify: {
    contentFrom: 'Conteúdo do',
    // Spotify's own pt-BR interface uses this wording for the same link.
    playOn: 'Ouvir no Spotify',
  },
  print: {
    title: 'Sua impressão',
    body:
      'Um raio por hora, meia-noite no topo, cada um tão longo quanto aquela hora é cheia. O núcleo é a fatia que seus três artistas mais ouvidos seguram, então uma rotação estreita aparece como um centro denso.',
    footnote: (plays: number) =>
      `Traçada a partir de ${plays} execuções coletadas até aqui. Ela engrossa conforme o histórico cresce.`,
    alt: (plays: number) =>
      `Uma figura radial de ${plays} execuções, um raio por hora do dia, meia-noite no topo.`,
  },
  pending: {
    concentration: 'Contando os artistas que você repete',
    hours: 'Lendo as horas em que você escuta',
    decades: 'Datando suas faixas mais tocadas',
    noHistory: 'Nenhum histórico coletado ainda, então não há relógio para ler.',
  },
  decades: {
    heading: 'Onde seu gosto fica no tempo',
    caption: 'Em que década cada uma das suas faixas mais tocadas foi lançada.',
    loading: 'Lendo suas faixas mais tocadas',
    error: 'Não deu para carregar as décadas',
    footnote: (tracks: number) =>
      `Com base em ${tracks} faixas. A data é a do álbum, então relançamentos e regravações contam no ano em que saíram de novo.`,
  },
  concentration: {
    heading: 'Os nomes por trás dessa concentração',
    caption: 'Seus artistas mais repetidos, e quantas das suas faixas mais tocadas cada um segura.',
    loading: 'Contando artistas',
    error: 'Não deu para carregar a concentração',
  },
  comparison: {
    heading: 'O que mudou entre as últimas quatro semanas e o último ano',
    caption: 'Artistas que apareceram, sumiram ou se moveram entre os dois rankings.',
    loading: 'Comparando os dois rankings',
    error: 'Não deu para carregar a comparação',
    entered: 'Novos neste mês',
    climbed: 'Subindo',
    dropped: 'Saíram',
    wasAt: (position: number) => `era #${position}`,
    empty: 'Nada se moveu aqui.',
  },
  patterns: {
    heading: 'Quando você escuta de verdade',
    caption: (timezone: string) =>
      `Execuções por hora do dia, em ${timezone}. Montado a partir do histórico que esta API coleta sozinha, porque o Spotify só devolve as últimas 50 execuções.`,
    loading: 'Lendo seu histórico',
    error: 'Não deu para carregar os padrões',
    emptyTitle: 'Sem histórico ainda',
    emptyBody:
      'Colete suas execuções recentes uma vez e isto se preenche. Fica mais interessante depois de alguns dias.',
    busiest: (weekday: string) => `Dia mais cheio: ${weekday}. `,
    weekdays: {
      Monday: 'segunda',
      Tuesday: 'terça',
      Wednesday: 'quarta',
      Thursday: 'quinta',
      Friday: 'sexta',
      Saturday: 'sábado',
      Sunday: 'domingo',
    },
    streak: (days: number) => `Maior sequência de dias seguidos ouvindo: ${days}.`,
    hourTooltip: (clock: string, plays: number) => `${clock}, ${plays} execuções`,
  },
  readings: {
    concentrationSentence: 'de tudo que você toca vem de três artistas.',
    concentrationNarrow: (artists: number) =>
      `Três nomes entre ${artists} seguram a maior parte do que você toca.`,
    concentrationMiddle: (artists: number, tracks: number) =>
      `${artists} artistas aparecem em ${tracks} faixas, mas os três primeiros ficam com a maior fatia.`,
    concentrationWide: (artists: number) =>
      `Rotação ampla: ${artists} artistas dividem sua escuta de forma bem equilibrada.`,
    decadeSentence: (decade: number) => `das suas faixas mais tocadas saíram nos anos ${decade}.`,
    decadeOlderThanStreaming: 'A maior parte do que você toca é mais velha que o próprio streaming.',
    decadeOldest: (decade: number) => `Sua escolha mais antiga volta aos anos ${decade}.`,
    hourSentence: (from: string, to: string) => `das suas execuções caem entre ${from} e ${to}.`,
    hourNote: (plays: number, timezone: string) =>
      `De ${plays} execuções coletadas até aqui, contadas em ${timezone}.`,
  },
}
