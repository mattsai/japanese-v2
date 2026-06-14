import type { VerbCatalogEntry, VerbGroup, VerbPracticeForms } from "@/types/verb-practice";

type VerbSeed = {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaningEs: string;
  meaningEn: string;
  group: VerbGroup;
  tags?: string[];
};

type CoreVerbForms = Omit<
  VerbPracticeForms,
  | "teKara"
  | "teKudasai"
  | "teMoIi"
  | "teWaIkemasen"
  | "naideKudasai"
  | "nakuteMoIi"
  | "tai"
  | "mashou"
  | "masenKa"
  | "nagara"
>;

const seeds: VerbSeed[] = [
  v("taberu", "食べる", "たべる", "taberu", "comer", "to eat", "ichidan", ["food"]),
  v("nomu", "飲む", "のむ", "nomu", "beber", "to drink", "godan", ["food"]),
  v("miru", "見る", "みる", "miru", "ver; mirar", "to see; to watch", "ichidan", ["perception"]),
  v("iku", "行く", "いく", "iku", "ir", "to go", "godan", ["movement", "exception"]),
  v("kuru", "来る", "くる", "kuru", "venir", "to come", "irregular", ["movement"]),
  v("suru", "する", "する", "suru", "hacer", "to do", "irregular"),
  v("benkyou-suru", "勉強する", "べんきょうする", "benkyou suru", "estudiar", "to study", "irregular", ["school", "suru-compound"]),
  v("kau", "買う", "かう", "kau", "comprar", "to buy", "godan", ["shopping"]),
  v("kaku", "書く", "かく", "kaku", "escribir", "to write", "godan", ["school"]),
  v("yomu", "読む", "よむ", "yomu", "leer", "to read", "godan", ["school"]),
  v("kiku", "聞く", "きく", "kiku", "escuchar; preguntar", "to listen; to ask", "godan", ["communication"]),
  v("hanasu", "話す", "はなす", "hanasu", "hablar", "to speak", "godan", ["communication"]),
  v("matsu", "待つ", "まつ", "matsu", "esperar", "to wait", "godan"),
  v("kaeru", "帰る", "かえる", "kaeru", "volver; regresar", "to return", "godan", ["movement", "tricky-ru"]),
  v("neru", "寝る", "ねる", "neru", "dormir; acostarse", "to sleep; to go to bed", "ichidan", ["routine"]),
  v("okiru", "起きる", "おきる", "okiru", "levantarse; despertarse", "to get up; to wake up", "ichidan", ["routine"]),
  v("akeru", "開ける", "あける", "akeru", "abrir", "to open", "ichidan"),
  v("shimaru", "閉まる", "しまる", "shimaru", "cerrarse", "to close", "godan"),
  v("shimeru", "閉める", "しめる", "shimeru", "cerrar", "to close", "ichidan"),
  v("ireru", "入れる", "いれる", "ireru", "meter; insertar", "to put in", "ichidan"),
  v("hairu", "入る", "はいる", "hairu", "entrar", "to enter", "godan"),
  v("deru", "出る", "でる", "deru", "salir", "to go out", "ichidan"),
  v("dasu", "出す", "だす", "dasu", "sacar; entregar", "to take out; to submit", "godan"),
  v("au", "会う", "あう", "au", "encontrarse", "to meet", "godan"),
  v("aru", "ある", "ある", "aru", "haber; existir", "to exist", "godan", ["existence"]),
  v("iru", "いる", "いる", "iru", "estar; existir", "to exist", "ichidan", ["existence"]),
  v("asobu", "遊ぶ", "あそぶ", "asobu", "jugar", "to play", "godan"),
  v("aruku", "歩く", "あるく", "aruku", "caminar", "to walk", "godan", ["movement"]),
  v("hashiru", "走る", "はしる", "hashiru", "correr", "to run", "godan", ["movement"]),
  v("oyogu", "泳ぐ", "およぐ", "oyogu", "nadar", "to swim", "godan", ["movement"]),
  v("tatsu", "立つ", "たつ", "tatsu", "levantarse; estar de pie", "to stand", "godan"),
  v("suwaru", "座る", "すわる", "suwaru", "sentarse", "to sit", "godan"),
  v("nor-u", "乗る", "のる", "noru", "subirse; montar", "to ride", "godan", ["transport"]),
  v("oriru", "降りる", "おりる", "oriru", "bajarse", "to get off", "ichidan", ["transport"]),
  v("tsuku", "着く", "つく", "tsuku", "llegar", "to arrive", "godan", ["movement"]),
  v("wataru", "渡る", "わたる", "wataru", "cruzar", "to cross", "godan", ["movement"]),
  v("magaru", "曲がる", "まがる", "magaru", "doblar; girar", "to turn", "godan", ["movement"]),
  v("tomaru", "止まる", "とまる", "tomaru", "pararse; detenerse", "to stop", "godan"),
  v("tsukau", "使う", "つかう", "tsukau", "usar", "to use", "godan"),
  v("tsukuru", "作る", "つくる", "tsukuru", "hacer; crear", "to make", "godan"),
  v("uru", "売る", "うる", "uru", "vender", "to sell", "godan"),
  v("morau", "もらう", "もらう", "morau", "recibir", "to receive", "godan"),
  v("ageru", "あげる", "あげる", "ageru", "dar", "to give", "ichidan"),
  v("kureru", "くれる", "くれる", "kureru", "darme; darnos", "to give me/us", "ichidan"),
  v("motsu", "持つ", "もつ", "motsu", "tener; llevar", "to hold; to have", "godan"),
  v("mottekuru", "持って来る", "もってくる", "mottekuru", "traer", "to bring", "irregular"),
  v("motteiku", "持って行く", "もっていく", "motteiku", "llevar", "to take", "godan"),
  v("okuru", "送る", "おくる", "okuru", "enviar", "to send", "godan"),
  v("kariru", "借りる", "かりる", "kariru", "pedir prestado", "to borrow", "ichidan"),
  v("kasu", "貸す", "かす", "kasu", "prestar", "to lend", "godan"),
  v("kaesu", "返す", "かえす", "kaesu", "devolver", "to return something", "godan"),
  v("harau", "払う", "はらう", "harau", "pagar", "to pay", "godan"),
  v("narau", "習う", "ならう", "narau", "aprender", "to learn", "godan", ["school"]),
  v("oshieru", "教える", "おしえる", "oshieru", "ensenar; decir", "to teach; to tell", "ichidan", ["school"]),
  v("oboeru", "覚える", "おぼえる", "oboeru", "memorizar; recordar", "to memorize", "ichidan", ["school"]),
  v("wakar-u", "分かる", "わかる", "wakaru", "entender", "to understand", "godan"),
  v("wasureru", "忘れる", "わすれる", "wasureru", "olvidar", "to forget", "ichidan"),
  v("shiru", "知る", "しる", "shiru", "saber; conocer", "to know", "godan"),
  v("omou", "思う", "おもう", "omou", "pensar", "to think", "godan"),
  v("iu", "言う", "いう", "iu", "decir", "to say", "godan", ["communication"]),
  v("yobu", "呼ぶ", "よぶ", "yobu", "llamar", "to call", "godan", ["communication"]),
  v("utau", "歌う", "うたう", "utau", "cantar", "to sing", "godan"),
  v("suku", "好く", "すく", "suku", "gustar", "to like", "godan"),
  v("kirau", "嫌う", "きらう", "kirau", "odiar; desagradar", "to dislike", "godan"),
  v("iru-need", "要る", "いる", "iru", "necesitar", "to need", "godan"),
  v("hajimaru", "始まる", "はじまる", "hajimaru", "empezar", "to begin", "godan"),
  v("hajimeru", "始める", "はじめる", "hajimeru", "empezar algo", "to start something", "ichidan"),
  v("owaru", "終わる", "おわる", "owaru", "terminar", "to end", "godan"),
  v("yaru", "やる", "やる", "yaru", "hacer; dar", "to do; to give", "godan"),
  v("dekiru", "できる", "できる", "dekiru", "poder; ser posible", "can; to be able", "ichidan"),
  v("wakasu", "沸かす", "わかす", "wakasu", "hervir agua", "to boil", "godan"),
  v("waku", "沸く", "わく", "waku", "hervir; brotar", "to boil", "godan"),
  v("arau", "洗う", "あらう", "arau", "lavar", "to wash", "godan"),
  v("abiru", "浴びる", "あびる", "abiru", "ducharse; banarse", "to shower", "ichidan", ["routine"]),
  v("migaku", "磨く", "みがく", "migaku", "cepillar; pulir", "to brush; to polish", "godan", ["routine"]),
  v("kiru-wear", "着る", "きる", "kiru", "vestirse; ponerse ropa", "to wear", "ichidan"),
  v("kiru-cut", "切る", "きる", "kiru", "cortar", "to cut", "godan"),
  v("nugu", "脱ぐ", "ぬぐ", "nugu", "quitarse ropa", "to take off clothes", "godan"),
  v("haku", "履く", "はく", "haku", "ponerse zapatos/pantalon", "to put on lower-body clothes", "godan"),
  v("kaburu", "かぶる", "かぶる", "kaburu", "ponerse sombrero", "to put on a hat", "godan"),
  v("shimeru-tie", "締める", "しめる", "shimeru", "atar; abrochar", "to tie; to fasten", "ichidan"),
  v("sumu", "住む", "すむ", "sumu", "vivir; residir", "to live", "godan"),
  v("hataraku", "働く", "はたらく", "hataraku", "trabajar", "to work", "godan"),
  v("yasumu", "休む", "やすむ", "yasumu", "descansar; faltar", "to rest; to be absent", "godan"),
  v("komaru", "困る", "こまる", "komaru", "tener problema", "to be troubled", "godan"),
  v("tsukareru", "疲れる", "つかれる", "tsukareru", "cansarse", "to get tired", "ichidan"),
  v("kakar-u", "かかる", "かかる", "kakaru", "tardar; costar", "to take time; to cost", "godan"),
  v("isogu", "急ぐ", "いそぐ", "isogu", "apresurarse", "to hurry", "godan"),
  v("tetsudau", "手伝う", "てつだう", "tetsudau", "ayudar", "to help", "godan"),
  v("miseru", "見せる", "みせる", "miseru", "mostrar", "to show", "ichidan"),
  v("mirareru", "見られる", "みられる", "mirareru", "poder ver", "can see", "ichidan"),
  v("sagasu", "探す", "さがす", "sagasu", "buscar", "to search", "godan"),
  v("nakusu", "なくす", "なくす", "nakusu", "perder algo", "to lose something", "godan"),
  v("nakunaru", "なくなる", "なくなる", "nakunaru", "perderse; desaparecer", "to disappear", "godan"),
  v("tsukeru", "つける", "つける", "tsukeru", "encender; poner", "to turn on; to attach", "ichidan"),
  v("kesu", "消す", "けす", "kesu", "apagar; borrar", "to turn off; to erase", "godan"),
  v("aku", "開く", "あく", "aku", "abrirse", "to open", "godan"),
  v("narabu", "並ぶ", "ならぶ", "narabu", "hacer fila; alinearse", "to line up", "godan"),
  v("naraberu", "並べる", "ならべる", "naraberu", "alinear; ordenar", "to arrange", "ichidan"),
  v("ireru-turnon", "点ける", "つける", "tsukeru", "encender", "to turn on", "ichidan"),
  v("kaeru-change", "変える", "かえる", "kaeru", "cambiar algo", "to change something", "ichidan"),
  v("kawaru", "変わる", "かわる", "kawaru", "cambiar", "to change", "godan"),
  v("naru", "なる", "なる", "naru", "volverse; convertirse", "to become", "godan"),
  v("ireru-call", "電話する", "でんわする", "denwa suru", "llamar por telefono", "to phone", "irregular", ["suru-compound"]),
  v("sanpo-suru", "散歩する", "さんぽする", "sanpo suru", "pasear", "to take a walk", "irregular", ["suru-compound"]),
  v("ryokou-suru", "旅行する", "りょこうする", "ryokou suru", "viajar", "to travel", "irregular", ["suru-compound"]),
  v("shitsumon-suru", "質問する", "しつもんする", "shitsumon suru", "preguntar", "to ask a question", "irregular", ["suru-compound"]),
  v("renshuu-suru", "練習する", "れんしゅうする", "renshuu suru", "practicar", "to practice", "irregular", ["suru-compound"]),
];

export const n5VerbCatalog = seeds.map(buildVerb) satisfies VerbCatalogEntry[];

export type N5VerbId = (typeof n5VerbCatalog)[number]["id"];

function v(
  id: string,
  kanji: string,
  kana: string,
  romaji: string,
  meaningEs: string,
  meaningEn: string,
  group: VerbGroup,
  tags: string[] = [],
): VerbSeed {
  return { id: `verb-${id}`, kanji, kana, romaji, meaningEs, meaningEn, group, tags };
}

function buildVerb(seed: VerbSeed): VerbCatalogEntry {
  const forms = buildForms(seed);

  return {
    ...seed,
    forms,
    hints: {
      meaning: `${seed.kanji} significa ${seed.meaningEs}. Fijate en la lectura ${seed.kana}.`,
      conjugation: {
        "present-future": presentHint(seed),
        past: pastHint(seed),
        negative: negativeHint(seed),
        "past-negative": pastNegativeHint(seed),
        "te-form": teHint(seed),
        "te-kara": `Secuencia N5: usa la forma te ${forms.teForm} + から.`,
        progressive: `Uso N5: forma te + います/いる para accion en curso o estado.`,
        "te-kudasai": `Peticion N5: usa la forma te ${forms.teForm} + ください.`,
        "te-mo-ii": `Permiso N5: usa la forma te ${forms.teForm} + もいいです.`,
        "te-wa-ikemasen": `Prohibicion N5: usa la forma te ${forms.teForm} + はいけません.`,
        "naide-kudasai": `Peticion negativa N5: usa la forma ない sin い + いでください.`,
        "nakute-mo-ii": `Permiso negativo N5: usa la forma ない sin い + くてもいいです.`,
        tai: `Deseo N5: usa el tallo masu + たいです.`,
        mashou: `Invitacion N5: usa el tallo masu + ましょう.`,
        "masen-ka": `Invitacion suave N5: usa el tallo masu + ませんか.`,
        nagara: `Acciones simultaneas N5: usa el tallo masu + ながら.`,
      },
    },
    explanation: {
      meaning: `${seed.kanji} significa ${seed.meaningEs}.`,
      "present-future": `${forms.presentFuture.formal} es formal; ${forms.presentFuture.informal} es informal.`,
      past: `${forms.past.formal} es pasado formal; ${forms.past.informal} es pasado informal.`,
      negative: `${forms.negative.formal} es negativo formal; ${forms.negative.informal} es negativo informal.`,
      "past-negative": `${forms.pastNegative.formal} es pasado negativo formal; ${forms.pastNegative.informal} es pasado negativo informal.`,
      "te-form": `${forms.teForm} es la forma te de ${seed.kanji}.`,
      "te-kara": `${forms.teKara} marca hacer algo despues de esta accion.`,
      progressive: `${forms.progressive.formal} es forma N5 con ています; ${forms.progressive.informal} es su version llana con ている.`,
      "te-kudasai": `${forms.teKudasai} es peticion: por favor haz la accion.`,
      "te-mo-ii": `${forms.teMoIi} es permiso: esta bien hacer la accion.`,
      "te-wa-ikemasen": `${forms.teWaIkemasen} es prohibicion: no se debe hacer la accion.`,
      "naide-kudasai": `${forms.naideKudasai} es peticion negativa: por favor no hagas la accion.`,
      "nakute-mo-ii": `${forms.nakuteMoIi} es permiso negativo: esta bien no hacer la accion.`,
      tai: `${forms.tai} expresa deseo: quiero hacer la accion.`,
      mashou: `${forms.mashou} invita: hagamos la accion.`,
      "masen-ka": `${forms.masenKa} invita de forma suave: que tal si hacemos la accion?`,
      nagara: `${forms.nagara} conecta dos acciones simultaneas: hacer algo mientras haces esta accion.`,
    },
    tags: ["N5", "verb", seed.group, ...(seed.tags ?? [])],
  };
}

function buildForms(seed: VerbSeed) {
  if (seed.id === "verb-suru") {
    return fixedForms(seed, "し");
  }

  if (seed.kanji.endsWith("する")) {
    const noun = seed.kanji.slice(0, -2);
    return attachN5Forms({
      presentFuture: { formal: `${noun}します`, informal: `${noun}する` },
      past: { formal: `${noun}しました`, informal: `${noun}した` },
      negative: { formal: `${noun}しません`, informal: `${noun}しない` },
      pastNegative: { formal: `${noun}しませんでした`, informal: `${noun}しなかった` },
      teForm: `${noun}して`,
      progressive: { formal: `${noun}しています`, informal: `${noun}している` },
    }, `${noun}し`);
  }

  if (seed.id === "verb-kuru") {
    return attachN5Forms({
      presentFuture: { formal: "来ます", informal: "来る" },
      past: { formal: "来ました", informal: "来た" },
      negative: { formal: "来ません", informal: "来ない" },
      pastNegative: { formal: "来ませんでした", informal: "来なかった" },
      teForm: "来て",
      progressive: { formal: "来ています", informal: "来ている" },
    }, "来");
  }

  if (seed.kanji.endsWith("来る")) {
    const prefix = seed.kanji.slice(0, -2);
    return attachN5Forms({
      presentFuture: { formal: `${prefix}来ます`, informal: seed.kanji },
      past: { formal: `${prefix}来ました`, informal: `${prefix}来た` },
      negative: { formal: `${prefix}来ません`, informal: `${prefix}来ない` },
      pastNegative: { formal: `${prefix}来ませんでした`, informal: `${prefix}来なかった` },
      teForm: `${prefix}来て`,
      progressive: { formal: `${prefix}来ています`, informal: `${prefix}来ている` },
    }, `${prefix}来`);
  }

  if (seed.id === "verb-aru") {
    return attachN5Forms({
      presentFuture: { formal: "あります", informal: "ある" },
      past: { formal: "ありました", informal: "あった" },
      negative: { formal: "ありません", informal: "ない" },
      pastNegative: { formal: "ありませんでした", informal: "なかった" },
      teForm: "あって",
      progressive: { formal: "あります", informal: "ある" },
    }, "あり");
  }

  if (seed.group === "ichidan") {
    const stem = seed.kanji.slice(0, -1);
    return attachN5Forms({
      presentFuture: { formal: `${stem}ます`, informal: seed.kanji },
      past: { formal: `${stem}ました`, informal: `${stem}た` },
      negative: { formal: `${stem}ません`, informal: `${stem}ない` },
      pastNegative: { formal: `${stem}ませんでした`, informal: `${stem}なかった` },
      teForm: `${stem}て`,
      progressive: { formal: `${stem}ています`, informal: `${stem}ている` },
    }, stem);
  }

  const stem = politeStem(seed.kanji);
  const nai = naiStem(seed.kanji);
  const te = teForm(seed);
  const ta = taForm(seed);

  return attachN5Forms({
    presentFuture: { formal: `${stem}ます`, informal: seed.kanji },
    past: { formal: `${stem}ました`, informal: ta },
    negative: { formal: `${stem}ません`, informal: `${nai}ない` },
    pastNegative: { formal: `${stem}ませんでした`, informal: `${nai}なかった` },
    teForm: te,
    progressive: { formal: `${te}います`, informal: `${te}いる` },
  }, stem);
}

function fixedForms(seed: VerbSeed, stem: string) {
  return attachN5Forms({
    presentFuture: { formal: `${stem}ます`, informal: seed.kanji },
    past: { formal: `${stem}ました`, informal: `${stem}た` },
    negative: { formal: `${stem}ません`, informal: `${stem}ない` },
    pastNegative: { formal: `${stem}ませんでした`, informal: `${stem}なかった` },
    teForm: `${stem}て`,
    progressive: { formal: `${stem}ています`, informal: `${stem}ている` },
  }, stem);
}

function attachN5Forms(forms: CoreVerbForms, stem: string): VerbPracticeForms {
  const naiBase = forms.negative.informal.endsWith("ない")
    ? forms.negative.informal.slice(0, -1)
    : forms.negative.informal;

  return {
    ...forms,
    teKara: `${forms.teForm}から`,
    teKudasai: `${forms.teForm}ください`,
    teMoIi: `${forms.teForm}もいいです`,
    teWaIkemasen: `${forms.teForm}はいけません`,
    naideKudasai: `${naiBase}いでください`,
    nakuteMoIi: `${naiBase}くてもいいです`,
    tai: `${stem}たいです`,
    mashou: `${stem}ましょう`,
    masenKa: `${stem}ませんか`,
    nagara: `${stem}ながら`,
  };
}

function politeStem(verb: string) {
  const end = verb.at(-1);
  const stem = verb.slice(0, -1);
  const map: Record<string, string> = {
    う: "い",
    く: "き",
    ぐ: "ぎ",
    す: "し",
    つ: "ち",
    ぬ: "に",
    ぶ: "び",
    む: "み",
    る: "り",
  };

  return `${stem}${map[end ?? ""] ?? end}`;
}

function naiStem(verb: string) {
  const end = verb.at(-1);
  const stem = verb.slice(0, -1);
  const map: Record<string, string> = {
    う: "わ",
    く: "か",
    ぐ: "が",
    す: "さ",
    つ: "た",
    ぬ: "な",
    ぶ: "ば",
    む: "ま",
    る: "ら",
  };

  return `${stem}${map[end ?? ""] ?? end}`;
}

function teForm(seed: VerbSeed) {
  if (seed.kanji.endsWith("行く")) {
    return `${seed.kanji.slice(0, -2)}行って`;
  }

  const end = seed.kanji.at(-1);
  const stem = seed.kanji.slice(0, -1);

  if (end === "う" || end === "つ" || end === "る") return `${stem}って`;
  if (end === "む" || end === "ぶ" || end === "ぬ") return `${stem}んで`;
  if (end === "く") return `${stem}いて`;
  if (end === "ぐ") return `${stem}いで`;
  if (end === "す") return `${stem}して`;

  return `${stem}て`;
}

function taForm(seed: VerbSeed) {
  const te = teForm(seed);
  if (te.endsWith("で")) return `${te.slice(0, -1)}だ`;
  return `${te.slice(0, -1)}た`;
}

function presentHint(seed: VerbSeed) {
  return seed.group === "ichidan"
    ? "Ichidan: quita る antes de ます; informal queda en diccionario."
    : "Godan/irregular: usa el tallo ます para formal; informal queda en diccionario.";
}

function pastHint(seed: VerbSeed) {
  return seed.group === "ichidan"
    ? "Ichidan pasado informal: quita る y agrega た."
    : "Godan pasado informal depende del final: った, んだ, いた, いだ o した.";
}

function negativeHint(seed: VerbSeed) {
  return seed.group === "ichidan"
    ? "Ichidan negativo informal: quita る y agrega ない."
    : "Godan negativo informal usa sonido a: かない, まない, らない, etc.";
}

function pastNegativeHint(seed: VerbSeed) {
  return seed.group === "ichidan"
    ? "Ichidan pasado negativo informal: tallo + なかった."
    : "Godan pasado negativo informal: tallo a + なかった.";
}

function teHint(seed: VerbSeed) {
  if (seed.id === "verb-iku") return "行く es excepcion: la forma te es 行って.";
  if (seed.group === "ichidan") return "Ichidan forma te: quita る y agrega て.";
  return "Godan forma te depende del final del verbo.";
}
