import type { BoardPiece, ExerciseDefinition, LocalizedText, PieceColor, PieceKind, Position, TraceEvent } from '../../types/lab'

const t = (en: string, fa: string, pt: string, fr: string, ru: string, ar: string): LocalizedText => ({ en, fa, pt, fr, ru, ar })

export const simpleOpeningMoves = ['e2-e4', 'e7-e5', 'g1-f3', 'b8-c6'] as const

const backRank: PieceKind[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

export const startingPieces: BoardPiece[] = [
  ...backRank.map((piece, col) => ({ row: 0, col, piece, color: 'black' as const })),
  ...Array.from({ length: 8 }, (_, col) => ({ row: 1, col, piece: 'pawn' as const, color: 'black' as const })),
  ...Array.from({ length: 8 }, (_, col) => ({ row: 6, col, piece: 'pawn' as const, color: 'white' as const })),
  ...backRank.map((piece, col) => ({ row: 7, col, piece, color: 'white' as const })),
]

interface OpeningMove {
  from: Position
  to: Position
  piece: PieceKind
  color: PieceColor
}

const openingMoves: Record<(typeof simpleOpeningMoves)[number], OpeningMove> = {
  'e2-e4': { from: { row: 6, col: 4 }, to: { row: 4, col: 4 }, piece: 'pawn', color: 'white' },
  'e7-e5': { from: { row: 1, col: 4 }, to: { row: 3, col: 4 }, piece: 'pawn', color: 'black' },
  'g1-f3': { from: { row: 7, col: 6 }, to: { row: 5, col: 5 }, piece: 'knight', color: 'white' },
  'b8-c6': { from: { row: 0, col: 1 }, to: { row: 2, col: 2 }, piece: 'knight', color: 'black' },
}

const setupEvent: TraceEvent = { type: 'setup', pieces: startingPieces }

const firstOpening: ExerciseDefinition = {
  id: 'first-opening',
  slug: 'first-opening',
  title: t(
    'Start Here: Your First Opening',
    'از اینجا شروع کنید: اولین اوپنینگ',
    'Comece aqui: a sua primeira abertura',
    'Commencez ici : votre première ouverture',
    'Начните здесь: ваш первый дебют',
    'ابدأ هنا: افتتاحيتك الأولى',
  ),
  shortTitle: t('Start Here', 'شروع از صفر', 'Começar', 'Bien démarrer', 'Начало', 'ابدأ هنا'),
  description: t(
    'Learn the editor, arrays, return values, tests, and playback by coding four safe opening moves from a complete starting board.',
    'با کدنویسی چهار حرکت ساده از صفحهٔ کامل، ویرایشگر، آرایه، return، آزمون و پخش مرحله‌ای را یاد بگیرید.',
    'Aprenda o editor, arrays, valores de retorno, testes e reprodução ao programar quatro lances simples a partir da posição inicial completa.',
    'Découvrez l’éditeur, les tableaux, return, les tests et la lecture pas à pas en codant quatre coups simples depuis la position initiale complète.',
    'Изучите редактор, массивы, return, тесты и пошаговое воспроизведение, запрограммировав четыре простых хода из полной начальной позиции.',
    'تعلّم المحرر والمصفوفات وعبارة return والاختبارات والتشغيل خطوة بخطوة عبر برمجة أربع نقلات بسيطة من الوضع الابتدائي الكامل.',
  ),
  difficulty: 'beginner',
  objectives: [
    t('Recognize every piece in the standard 32-piece setup.', 'همهٔ مهره‌ها را در چیدمان استاندارد ۳۲ مهره‌ای بشناسید.', 'Reconhecer todas as peças na posição inicial de 32 peças.', 'Reconnaître toutes les pièces dans la position initiale à 32 pièces.', 'Узнать все фигуры в стандартной позиции из 32 фигур.', 'التعرّف إلى جميع القطع في الوضع القياسي المكوّن من 32 قطعة.'),
    t('Return an ordered JavaScript array from solve().', 'از تابع solve() یک آرایهٔ مرتب جاوااسکریپت برگردانید.', 'Devolver um array JavaScript ordenado em solve().', 'Renvoyer un tableau JavaScript ordonné depuis solve().', 'Вернуть упорядоченный массив JavaScript из solve().', 'إرجاع مصفوفة JavaScript مرتبة من solve().'),
    t('Run code, inspect playback, and pass a test.', 'کد را اجرا کنید، پخش مرحله‌ای را ببینید و آزمون را پاس کنید.', 'Executar o código, observar a reprodução e passar o teste.', 'Exécuter le code, observer la lecture et réussir le test.', 'Запустить код, посмотреть воспроизведение и пройти тест.', 'تشغيل الكود ومشاهدة الخطوات واجتياز الاختبار.'),
  ],
  concepts: [
    t('First steps', 'قدم‌های اول', 'Primeiros passos', 'Premiers pas', 'Первые шаги', 'الخطوات الأولى'),
    t('Arrays', 'آرایه‌ها', 'Arrays', 'Tableaux', 'Массивы', 'المصفوفات'),
    t('Return values', 'مقدار بازگشتی', 'Valores de retorno', 'Valeurs de retour', 'Возвращаемые значения', 'القيم المعادة'),
    t('Chess coordinates', 'مختصات شطرنج', 'Coordenadas de xadrez', 'Coordonnées d’échecs', 'Шахматные координаты', 'إحداثيات الشطرنج'),
  ],
  inputSpec: t('No input is required: input = {}.', 'ورودی لازم نیست: input = {}.', 'Não é necessária entrada: input = {}.', 'Aucune entrée requise : input = {}.', 'Ввод не требуется: input = {}.', 'لا توجد مدخلات مطلوبة: input = {}.'),
  outputSpec: t(
    'Return ["e2-e4", "e7-e5", "g1-f3", "b8-c6"].',
    'آرایهٔ ["e2-e4", "e7-e5", "g1-f3", "b8-c6"] را برگردانید.',
    'Devolva ["e2-e4", "e7-e5", "g1-f3", "b8-c6"].',
    'Renvoyez ["e2-e4", "e7-e5", "g1-f3", "b8-c6"].',
    'Верните ["e2-e4", "e7-e5", "g1-f3", "b8-c6"].',
    'أرجع ["e2-e4", "e7-e5", "g1-f3", "b8-c6"].',
  ),
  constraints: [
    t('Keep the four strings in exactly this order.', 'چهار رشته را دقیقاً با همین ترتیب نگه دارید.', 'Mantenha as quatro strings exatamente nesta ordem.', 'Conservez les quatre chaînes exactement dans cet ordre.', 'Сохраните четыре строки точно в этом порядке.', 'أبقِ السلاسل الأربع بهذا الترتيب تمامًا.'),
    t('Use lowercase square names and a hyphen between squares.', 'نام خانه‌ها را با حروف کوچک و با خط تیره بنویسید.', 'Use casas em minúsculas e um hífen entre elas.', 'Utilisez des cases en minuscules séparées par un tiret.', 'Используйте строчные имена полей и дефис между ними.', 'استخدم أسماء المربعات بحروف صغيرة وشرطة بين المربعين.'),
    t('Do not move or capture any other piece.', 'هیچ مهرهٔ دیگری را حرکت ندهید یا نگیرید.', 'Não mova nem capture outra peça.', 'Ne déplacez et ne capturez aucune autre pièce.', 'Не двигайте и не берите другие фигуры.', 'لا تحرّك أو تلتقط أي قطعة أخرى.'),
  ],
  hints: [
    t('An array uses square brackets: ["first", "second"].', 'آرایه با براکت ساخته می‌شود: ["اول", "دوم"].', 'Um array usa parênteses retos: ["primeiro", "segundo"].', 'Un tableau utilise des crochets : ["premier", "second"].', 'Массив записывается в квадратных скобках: ["первый", "второй"].', 'تُكتب المصفوفة بين أقواس مربعة: ["الأول", "الثاني"].'),
    t('After e2-e4 and e7-e5, develop the white knight with g1-f3.', 'بعد از e2-e4 و e7-e5، اسب سفید را با g1-f3 توسعه دهید.', 'Depois de e2-e4 e e7-e5, desenvolva o cavalo branco com g1-f3.', 'Après e2-e4 et e7-e5, développez le cavalier blanc avec g1-f3.', 'После e2-e4 и e7-e5 выведите белого коня ходом g1-f3.', 'بعد e2-e4 وe7-e5 طوّر الحصان الأبيض بالنقلة g1-f3.'),
    t('The final move develops Black’s knight: b8-c6.', 'حرکت آخر اسب سیاه را توسعه می‌دهد: b8-c6.', 'O último lance desenvolve o cavalo preto: b8-c6.', 'Le dernier coup développe le cavalier noir : b8-c6.', 'Последний ход выводит чёрного коня: b8-c6.', 'النقلة الأخيرة تطوّر الحصان الأسود: b8-c6.'),
  ],
  starterCode: `/**
 * Welcome! solve() must return the requested answer.
 * Strings are text inside quotes; an array keeps values in order.
 */
function solve() {
  return [
    "e2-e4",
    // TODO: add Black's pawn move,
    // White's knight move, and Black's knight move.
  ];
}`,
  defaultInput: {},
  inputFields: [],
  tests: [
    { id: 'opening-sequence', name: t('Four opening moves in order', 'چهار حرکت آغازین به‌ترتیب', 'Quatro lances em ordem', 'Quatre coups dans l’ordre', 'Четыре хода по порядку', 'أربع نقلات بالترتيب'), input: {} },
  ],
  piece: 'pawn',
  initialEvents: [setupEvent],
  getBoardSize: () => 8,
  validate: (_input, output) => {
    if (!Array.isArray(output) || !output.every((move) => typeof move === 'string')) {
      return { valid: false, message: 'solve() must return an array of move strings.', messageFa: 'تابع solve() باید یک آرایه از رشته‌های حرکت برگرداند.' }
    }
    const matches = output.length === simpleOpeningMoves.length
      && simpleOpeningMoves.every((move, index) => output[index] === move)
    return matches
      ? { valid: true, message: 'Correct: the four opening moves are in order.', messageFa: 'درست است: چهار حرکت آغازین به‌ترتیب قرار دارند.' }
      : { valid: false, message: `Expected ${JSON.stringify(simpleOpeningMoves)}.`, messageFa: `خروجی مورد انتظار ${JSON.stringify(simpleOpeningMoves)} است.` }
  },
  resultToEvents: (_input, output) => {
    const events: TraceEvent[] = [setupEvent]
    const valid = Array.isArray(output)
      && output.length === simpleOpeningMoves.length
      && simpleOpeningMoves.every((move, index) => output[index] === move)
    if (!valid) {
      events.push({ type: 'complete', message: 'Complete the four-move array, then run again.' })
      return events
    }
    for (const notation of simpleOpeningMoves) {
      const move = openingMoves[notation]
      events.push({ type: 'highlight', positions: [move.from, move.to], tone: 'path' })
      events.push({ type: 'remove', ...move.from })
      events.push({ type: 'place', ...move.to, piece: move.piece, color: move.color, label: notation })
    }
    events.push({ type: 'complete', message: 'Opening complete: the center is controlled and both knights are developed.' })
    return events
  },
}

export default firstOpening
