# دليل الاستخدام — العربية

## التشغيل محليًا

```bash
git clone https://github.com/amirrezapanahi/chess-algorithm-lab.git
cd chess-algorithm-lab
npm ci
npm run dev
```

افتح العنوان الذي يعرضه Vite. لا تحتاج إلى خادم خلفي أو قاعدة بيانات.

## طريقة الاستخدام

1. اختر تمرينًا من الترويسة.
2. اقرأ **المسألة** وأظهر التلميحات تدريجيًا.
3. اكتب دالة متزامنة `solve(input)` في تبويب **الكود**.
4. اضغط **تشغيل** أو `Ctrl/Cmd + Enter`.
5. استخدم الخط الزمني لمراجعة كل حدث تم التحقق منه.
6. اضغط **اختبار** لتشغيل أدوات التحقق الرياضية العامة.
7. صدّر الحل كملف `.js` قبل الانتقال إلى جهاز آخر.

يُحفظ الكود تلقائيًا في IndexedDB داخل هذا المتصفح ولا تتم مزامنته مع GitHub.

```js
function solve(input) {
  return input.value * 2;
}

function* trace(input) {
  yield { type: "visit", row: 0, col: 0 };
  yield { type: "complete", message: "تم" };
}
```

راجع [[Code-Examples|أمثلة الكود]] و[[Exercise-API|واجهة التمارين]] للمزيد.
