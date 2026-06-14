export type KanjiExample = {
  word: string;
  reading: string;
  meaningEs: string;
};

export type KanjiMemorandumItem = {
  id: string;
  character: string;
  meaningEs: string;
  meaningEn: string;
  onyomi: string[];
  kunyomi: string[];
  examples: KanjiExample[];
  hint: string;
  similar?: string[];
  strokes?: number;
};

export type KanjiChoice = {
  id: string;
  label: string;
  detail: string;
};

export type KanjiMemorandumExercise = {
  id: string;
  section: "kanji";
  promptEs: string;
  item: KanjiMemorandumItem;
  choices: KanjiChoice[];
  correctChoiceId: string;
  hint: string;
  info: string;
  explanation: string;
};

export const n5KanjiMemorandum: KanjiMemorandumItem[] = [
  k("kanji-ichi", "一", "uno", "one", ["イチ", "イツ"], ["ひと"], [{ word: "一つ", reading: "ひとつ", meaningEs: "uno" }], "Numero basico. Busca una sola linea horizontal.", 1),
  k("kanji-ni", "二", "dos", "two", ["ニ"], ["ふた"], [{ word: "二つ", reading: "ふたつ", meaningEs: "dos" }], "Numero basico. Son dos lineas horizontales.", 2),
  k("kanji-san", "三", "tres", "three", ["サン"], ["みっ"], [{ word: "三日", reading: "みっか", meaningEs: "dia 3; tres dias" }], "Numero basico. Son tres lineas horizontales.", 3),
  k("kanji-yon", "四", "cuatro", "four", ["シ"], ["よん", "よ"], [{ word: "四月", reading: "しがつ", meaningEs: "abril" }], "Numero con caja exterior. En meses se lee し.", 5),
  k("kanji-go", "五", "cinco", "five", ["ゴ"], ["いつ"], [{ word: "五月", reading: "ごがつ", meaningEs: "mayo" }], "Numero frecuente para fechas y cantidades.", 4),
  k("kanji-roku", "六", "seis", "six", ["ロク"], ["むっ"], [{ word: "六日", reading: "むいか", meaningEs: "dia 6; seis dias" }], "Numero frecuente. En dias tiene lectura irregular.", 4),
  k("kanji-nana", "七", "siete", "seven", ["シチ"], ["なな", "なの"], [{ word: "七月", reading: "しちがつ", meaningEs: "julio" }], "Numero con lecturas なな y しち segun palabra.", 2),
  k("kanji-hachi", "八", "ocho", "eight", ["ハチ"], ["やっ"], [{ word: "八日", reading: "ようか", meaningEs: "dia 8; ocho dias" }], "Numero basico. Se abre hacia abajo.", 2),
  k("kanji-kyuu", "九", "nueve", "nine", ["キュウ", "ク"], ["ここの"], [{ word: "九月", reading: "くがつ", meaningEs: "septiembre" }], "Numero con lectura く en septiembre.", 2),
  k("kanji-juu", "十", "diez", "ten", ["ジュウ"], ["とお"], [{ word: "十日", reading: "とおか", meaningEs: "dia 10; diez dias" }], "Cruz simple para diez.", 2),
  k("kanji-hyaku", "百", "cien", "hundred", ["ヒャク"], [], [{ word: "三百", reading: "さんびゃく", meaningEs: "trescientos" }], "Aparece en cantidades grandes; puede cambiar sonido.", 6),
  k("kanji-sen", "千", "mil", "thousand", ["セン"], ["ち"], [{ word: "千円", reading: "せんえん", meaningEs: "mil yenes" }], "Cantidad grande. Muy comun con 円.", 3),
  k("kanji-man", "万", "diez mil", "ten thousand", ["マン", "バン"], [], [{ word: "一万", reading: "いちまん", meaningEs: "diez mil" }], "Unidad japonesa importante: 10,000.", 3),
  k("kanji-en", "円", "yen; circulo", "yen; circle", ["エン"], ["まる"], [{ word: "百円", reading: "ひゃくえん", meaningEs: "cien yenes" }], "Moneda japonesa. Tambien significa circulo.", 4),
  k("kanji-nichi", "日", "dia; sol", "day; sun", ["ニチ", "ジツ"], ["ひ", "か"], [{ word: "日本", reading: "にほん", meaningEs: "Japon" }], "Muy comun en fechas y dias de la semana.", 4),
  k("kanji-getsu", "月", "mes; luna", "month; moon", ["ゲツ", "ガツ"], ["つき"], [{ word: "月曜日", reading: "げつようび", meaningEs: "lunes" }], "Para meses usa がつ; para lunes usa げつ.", 4),
  k("kanji-ka", "火", "fuego", "fire", ["カ"], ["ひ"], [{ word: "火曜日", reading: "かようび", meaningEs: "martes" }], "Piensa en chispas o llamas pequenas.", 4),
  k("kanji-sui", "水", "agua", "water", ["スイ"], ["みず"], [{ word: "水曜日", reading: "すいようび", meaningEs: "miercoles" }], "Agua. Lectura sola: みず.", 4),
  k("kanji-moku", "木", "arbol; madera", "tree; wood", ["モク", "ボク"], ["き"], [{ word: "木曜日", reading: "もくようび", meaningEs: "jueves" }], "Forma de arbol simple.", 4),
  k("kanji-kin", "金", "oro; dinero; metal", "gold; money; metal", ["キン", "コン"], ["かね"], [{ word: "金曜日", reading: "きんようび", meaningEs: "viernes" }], "Dinero o metal. Viernes es 金曜日.", 8),
  k("kanji-do", "土", "tierra", "earth; soil", ["ド", "ト"], ["つち"], [{ word: "土曜日", reading: "どようび", meaningEs: "sabado" }], "Tierra o suelo. Sabado es 土曜日.", 3),
  k("kanji-you", "曜", "dia de la semana", "weekday", ["ヨウ"], [], [{ word: "日曜日", reading: "にちようび", meaningEs: "domingo" }], "Aparece casi siempre en dias de la semana.", 18),
  k("kanji-toshi", "年", "ano", "year", ["ネン"], ["とし"], [{ word: "今年", reading: "ことし", meaningEs: "este ano" }], "Tiempo largo: ano.", 6),
  k("kanji-ima", "今", "ahora", "now", ["コン", "キン"], ["いま"], [{ word: "今日", reading: "きょう", meaningEs: "hoy" }], "Ahora. En 今日 tiene lectura especial.", 4),
  k("kanji-ji", "時", "hora; tiempo", "time; hour", ["ジ"], ["とき"], [{ word: "三時", reading: "さんじ", meaningEs: "las tres" }], "Se usa para horas del reloj.", 10),
  k("kanji-fun", "分", "minuto; parte", "minute; part", ["フン", "ブン", "プン"], ["わ"], [{ word: "十分", reading: "じゅっぷん", meaningEs: "diez minutos" }], "En minutos cambia entre ふん y ぷん.", 4),
  k("kanji-han", "半", "mitad", "half", ["ハン"], ["なか"], [{ word: "三時半", reading: "さんじはん", meaningEs: "tres y media" }], "Muy comun para media hora.", 5),
  k("kanji-hito", "人", "persona", "person", ["ジン", "ニン"], ["ひと"], [{ word: "日本人", reading: "にほんじん", meaningEs: "persona japonesa" }], "Persona. Cambia lectura por palabra.", 2),
  k("kanji-ko", "子", "nino; hijo", "child", ["シ", "ス"], ["こ"], [{ word: "女の子", reading: "おんなのこ", meaningEs: "nina" }], "Nino o hijo. Muy comun en palabras familiares.", 3),
  k("kanji-onna", "女", "mujer", "woman", ["ジョ", "ニョ"], ["おんな"], [{ word: "女の人", reading: "おんなのひと", meaningEs: "mujer" }], "Persona femenina.", 3),
  k("kanji-otoko", "男", "hombre", "man", ["ダン", "ナン"], ["おとこ"], [{ word: "男の子", reading: "おとこのこ", meaningEs: "nino" }], "Persona masculina.", 7),
  k("kanji-haha", "母", "madre", "mother", ["ボ"], ["はは", "かあ"], [{ word: "母", reading: "はは", meaningEs: "mi madre" }], "Familia. はは suele usarse para mi madre.", 5),
  k("kanji-chichi", "父", "padre", "father", ["フ"], ["ちち", "とう"], [{ word: "父", reading: "ちち", meaningEs: "mi padre" }], "Familia. ちち suele usarse para mi padre.", 4),
  k("kanji-tomo", "友", "amigo", "friend", ["ユウ"], ["とも"], [{ word: "友だち", reading: "ともだち", meaningEs: "amigo" }], "Piensa en compania o amistad.", 4),
  k("kanji-sensei", "先", "antes; anterior", "before; ahead", ["セン"], ["さき"], [{ word: "先生", reading: "せんせい", meaningEs: "profesor" }], "En 先生 forma la idea de maestro.", 6),
  k("kanji-sei", "生", "vida; nacer; estudiante", "life; birth; student", ["セイ", "ショウ"], ["い", "う", "なま"], [{ word: "学生", reading: "がくせい", meaningEs: "estudiante" }], "Muy flexible. Aprende por palabras.", 5),
  k("kanji-gaku", "学", "estudio", "study", ["ガク"], ["まな"], [{ word: "学校", reading: "がっこう", meaningEs: "escuela" }], "Relacionado con estudiar.", 8),
  k("kanji-kou", "校", "escuela", "school", ["コウ"], [], [{ word: "学校", reading: "がっこう", meaningEs: "escuela" }], "Aparece en palabras de escuela.", 10),
  k("kanji-hon", "本", "libro; origen", "book; origin", ["ホン"], ["もと"], [{ word: "日本", reading: "にほん", meaningEs: "Japon" }], "Libro, raiz u origen. En 日本 es parte de Japon.", 5),
  k("kanji-language", "語", "idioma; palabra", "language; word", ["ゴ"], ["かた"], [{ word: "日本語", reading: "にほんご", meaningEs: "japones" }], "Aparece en idiomas: 日本語, 英語.", 14),
  k("kanji-kuni", "国", "pais", "country", ["コク"], ["くに"], [{ word: "外国", reading: "がいこく", meaningEs: "pais extranjero" }], "Pais. Caja exterior con elemento interno.", 8),
  k("kanji-soto", "外", "afuera; extranjero", "outside; foreign", ["ガイ", "ゲ"], ["そと", "ほか"], [{ word: "外国人", reading: "がいこくじん", meaningEs: "extranjero" }], "Fuera o extranjero.", 5),
  k("kanji-na", "名", "nombre", "name", ["メイ", "ミョウ"], ["な"], [{ word: "名前", reading: "なまえ", meaningEs: "nombre" }], "Nombre. Se ve en 名前.", 6),
  k("kanji-ookii", "大", "grande", "big", ["ダイ", "タイ"], ["おお"], [{ word: "大学", reading: "だいがく", meaningEs: "universidad" }], "Figura grande con brazos abiertos.", 3),
  k("kanji-chiisai", "小", "pequeno", "small", ["ショウ"], ["ちい", "こ", "お"], [{ word: "小さい", reading: "ちいさい", meaningEs: "pequeno" }], "Pequeno. Tres trazos simples.", 3),
  k("kanji-naka", "中", "dentro; medio", "inside; middle", ["チュウ"], ["なか"], [{ word: "中国", reading: "ちゅうごく", meaningEs: "China" }], "Una linea atraviesa el centro.", 4),
  k("kanji-ue", "上", "arriba", "above; up", ["ジョウ"], ["うえ", "あ"], [{ word: "上", reading: "うえ", meaningEs: "arriba" }], "La marca esta arriba de la base.", 3),
  k("kanji-shita", "下", "abajo", "below; down", ["カ", "ゲ"], ["した", "さ"], [{ word: "下", reading: "した", meaningEs: "abajo" }], "La marca baja desde la base.", 3),
  k("kanji-migi", "右", "derecha", "right", ["ウ", "ユウ"], ["みぎ"], [{ word: "右", reading: "みぎ", meaningEs: "derecha" }], "Direccion derecha.", 5),
  k("kanji-hidari", "左", "izquierda", "left", ["サ"], ["ひだり"], [{ word: "左", reading: "ひだり", meaningEs: "izquierda" }], "Direccion izquierda.", 5),
  k("kanji-mae", "前", "adelante; antes", "front; before", ["ゼン"], ["まえ"], [{ word: "名前", reading: "なまえ", meaningEs: "nombre" }], "Puede significar enfrente o antes.", 9),
  k("kanji-ato", "後", "despues; atras", "after; behind", ["ゴ", "コウ"], ["あと", "うし"], [{ word: "午後", reading: "ごご", meaningEs: "p.m.; tarde" }], "Despues o atras segun contexto.", 9),
  k("kanji-kita", "北", "norte", "north", ["ホク"], ["きた"], [{ word: "北", reading: "きた", meaningEs: "norte" }], "Direccion norte.", 5),
  k("kanji-minami", "南", "sur", "south", ["ナン"], ["みなみ"], [{ word: "南", reading: "みなみ", meaningEs: "sur" }], "Direccion sur.", 9),
  k("kanji-higashi", "東", "este", "east", ["トウ"], ["ひがし"], [{ word: "東京", reading: "とうきょう", meaningEs: "Tokio" }], "Este. Aparece en 東京.", 8),
  k("kanji-nishi", "西", "oeste", "west", ["セイ", "サイ"], ["にし"], [{ word: "西", reading: "にし", meaningEs: "oeste" }], "Direccion oeste.", 6),
  k("kanji-takai", "高", "alto; caro", "high; expensive", ["コウ"], ["たか"], [{ word: "高い", reading: "たかい", meaningEs: "alto; caro" }], "Para altura o precio alto.", 10),
  k("kanji-yasui", "安", "barato; tranquilo", "cheap; peaceful", ["アン"], ["やす"], [{ word: "安い", reading: "やすい", meaningEs: "barato" }], "En N5 suele verse como barato: 安い.", 6),
  k("kanji-atarashii", "新", "nuevo", "new", ["シン"], ["あたら", "あら"], [{ word: "新しい", reading: "あたらしい", meaningEs: "nuevo" }], "Nuevo. Contrasta con 古い.", 13),
  k("kanji-furui", "古", "viejo; antiguo", "old", ["コ"], ["ふる"], [{ word: "古い", reading: "ふるい", meaningEs: "viejo" }], "Viejo o antiguo. Contrasta con 新しい.", 5),
  k("kanji-nani", "何", "que", "what", ["カ"], ["なに", "なん"], [{ word: "何", reading: "なに", meaningEs: "que" }], "Pregunta: que. Cambia entre なに y なん.", 7),
  k("kanji-dare", "誰", "quien", "who", ["スイ"], ["だれ"], [{ word: "誰", reading: "だれ", meaningEs: "quien" }], "Pregunta por persona.", 15),
  k("kanji-yasumu", "休", "descansar", "rest", ["キュウ"], ["やす"], [{ word: "休み", reading: "やすみ", meaningEs: "descanso" }], "Persona junto a arbol: descansar.", 6),
  k("kanji-hairu", "入", "entrar", "enter", ["ニュウ"], ["はい", "い"], [{ word: "入る", reading: "はいる", meaningEs: "entrar" }], "Movimiento hacia adentro.", 2),
  k("kanji-deru", "出", "salir", "exit", ["シュツ", "スイ"], ["で", "だ"], [{ word: "出る", reading: "でる", meaningEs: "salir" }], "Movimiento hacia afuera.", 5),
  k("kanji-iku", "行", "ir", "go", ["コウ", "ギョウ"], ["い", "ゆ"], [{ word: "行く", reading: "いく", meaningEs: "ir" }], "Accion de ir.", 6),
  k("kanji-kuru", "来", "venir", "come", ["ライ"], ["く", "き"], [{ word: "来る", reading: "くる", meaningEs: "venir" }], "Accion de venir.", 7),
  k("kanji-miru", "見", "ver", "see", ["ケン"], ["み"], [{ word: "見る", reading: "みる", meaningEs: "ver" }], "Ojo/piernas: observar o ver.", 7),
  k("kanji-kiku", "聞", "escuchar; preguntar", "hear; ask", ["ブン", "モン"], ["き"], [{ word: "聞く", reading: "きく", meaningEs: "escuchar; preguntar" }], "Oreja dentro de puerta: escuchar.", 14),
  k("kanji-yomu", "読", "leer", "read", ["ドク", "トク"], ["よ"], [{ word: "読む", reading: "よむ", meaningEs: "leer" }], "Relacionado con leer palabras.", 14),
  k("kanji-kaku", "書", "escribir", "write", ["ショ"], ["か"], [{ word: "書く", reading: "かく", meaningEs: "escribir" }], "Escribir. Se usa en 書く.", 10),
  k("kanji-hanasu", "話", "hablar", "speak; talk", ["ワ"], ["はな"], [{ word: "話す", reading: "はなす", meaningEs: "hablar" }], "Palabras/lengua: hablar.", 13),
  k("kanji-taberu", "食", "comer; comida", "eat; food", ["ショク", "ジキ"], ["た", "く"], [{ word: "食べる", reading: "たべる", meaningEs: "comer" }], "Accion de comer o comida.", 9),
  k("kanji-nomu", "飲", "beber", "drink", ["イン"], ["の"], [{ word: "飲む", reading: "のむ", meaningEs: "beber" }], "Accion de beber.", 12),
  k("kanji-kuruma", "車", "carro; coche", "car", ["シャ"], ["くるま"], [{ word: "車", reading: "くるま", meaningEs: "coche" }], "Rueda/carro visto de arriba.", 7),
  k("kanji-den", "電", "electricidad", "electricity", ["デン"], [], [{ word: "電車", reading: "でんしゃ", meaningEs: "tren" }], "Electricidad. En N5 aparece en 電車.", 13),
  k("kanji-ame", "雨", "lluvia", "rain", ["ウ"], ["あめ"], [{ word: "雨", reading: "あめ", meaningEs: "lluvia" }], "Parece lluvia cayendo dentro del cielo.", 8),
  k("kanji-shiro", "白", "blanco", "white", ["ハク", "ビャク"], ["しろ"], [{ word: "白い", reading: "しろい", meaningEs: "blanco" }], "Color blanco.", 5),
  k("kanji-nagai", "長", "largo; jefe", "long; leader", ["チョウ"], ["なが"], [{ word: "長い", reading: "ながい", meaningEs: "largo" }], "Longitud. En N5 se usa como 長い.", 8),
  k("kanji-aida", "間", "intervalo; entre", "interval; between", ["カン", "ケン"], ["あいだ", "ま"], [{ word: "時間", reading: "じかん", meaningEs: "tiempo; hora" }], "Entre espacios o tiempo.", 12),
  k("kanji-ki", "気", "energia; animo", "spirit; energy", ["キ", "ケ"], [], [{ word: "元気", reading: "げんき", meaningEs: "saludable; animado" }], "Idea abstracta: energia, animo, aire.", 6),
  k("kanji-gozen", "午", "mediodia", "noon", ["ゴ"], ["うま"], [{ word: "午前", reading: "ごぜん", meaningEs: "a.m.; manana" }], "Se usa para a.m./p.m.: 午前, 午後.", 4),
  k("kanji-yama", "山", "montana", "mountain", ["サン"], ["やま"], [{ word: "山", reading: "やま", meaningEs: "montana" }], "Forma simple de montana.", 3),
  k("kanji-kawa", "川", "rio", "river", ["セン"], ["かわ"], [{ word: "川", reading: "かわ", meaningEs: "rio" }], "Tres lineas como corriente de rio.", 3),
];

export function createKanjiMemorandumExercises(
  items = n5KanjiMemorandum,
): KanjiMemorandumExercise[] {
  return items.map((item, index) => {
    const distractors = collectKanjiDistractors(items, index);
    const choices = shuffleStable([
      toChoice(item),
      ...distractors.map(toChoice),
    ]);

    return {
      id: `${item.id}-meaning`,
      section: "kanji",
      promptEs: `Kanji: ${item.character} - elige el significado correcto`,
      item,
      choices,
      correctChoiceId: item.id,
      hint: item.hint,
      info: buildInfo(item),
      explanation: `${item.character} significa ${item.meaningEs}. Ejemplo: ${item.examples[0]?.word ?? item.character} (${item.examples[0]?.reading ?? "lectura variable"}) = ${item.examples[0]?.meaningEs ?? item.meaningEs}.`,
    };
  });
}

function k(
  id: string,
  character: string,
  meaningEs: string,
  meaningEn: string,
  onyomi: string[],
  kunyomi: string[],
  examples: KanjiExample[],
  hint: string,
  strokes?: number,
  similar?: string[],
): KanjiMemorandumItem {
  return {
    id,
    character,
    meaningEs,
    meaningEn,
    onyomi,
    kunyomi,
    examples,
    hint,
    similar,
    strokes,
  };
}

function toChoice(item: KanjiMemorandumItem): KanjiChoice {
  return {
    id: item.id,
    label: item.meaningEs,
    detail: item.examples[0]
      ? `${item.examples[0].word} / ${item.examples[0].reading}`
      : item.character,
  };
}

function collectKanjiDistractors(
  items: KanjiMemorandumItem[],
  index: number,
): KanjiMemorandumItem[] {
  const offsets = [1, 7, 17];
  return offsets.map((offset) => items[(index + offset) % items.length]);
}

function shuffleStable<T>(items: T[]): T[] {
  if (items.length < 4) {
    return items;
  }

  return [items[1], items[3], items[0], items[2]];
}

function buildInfo(item: KanjiMemorandumItem): string {
  const readings = [
    item.onyomi.length ? `On: ${item.onyomi.join(", ")}` : "",
    item.kunyomi.length ? `Kun: ${item.kunyomi.join(", ")}` : "",
  ].filter(Boolean);
  const strokeText = item.strokes ? `Trazos: ${item.strokes}. ` : "";

  return `${strokeText}${readings.join(" | ")}`;
}
