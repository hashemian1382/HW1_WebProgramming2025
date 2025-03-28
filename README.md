<div dir="rtl">

# 🧮 تگ با حساب و کتاب - تمرین دست‌گرمی اول برنامه‌نویسی وب

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Sharif-University-of-Technology.jpg" alt="لوگوی دانشگاه صنعتی شریف" width="200">
</p>

<p align="center">
  <b>دانشگاه صنعتی شریف</b><br>
  دانشکده مهندسی کامپیوتر<br>
  درس برنامه‌نویسی وب - بهار ۱۴۰۴<br>
  استاد درس: دکتر یحیی پورسلطانی
</p>

<p align="center">
  <b>دانشجو: علی هاشمیان</b><br>
  شماره دانشجویی: ۴۰۱۱۰۶۶۸۵
</p>

---

## فهرست مطالب

- [مقدمه](#مقدمه)
- [هدف پروژه](#هدف-پروژه)
- [تکنولوژی‌های استفاده‌شده](#تکنولوژیهای-استفاده‌شده)
- [ساختار فایل‌ها](#ساختار-فایلها)
- [نحوه عملکرد](#نحوه-عملکرد)
  - [کلاس FormulaElement](#کلاس-formulaelement)
  - [مکانیزم اجرا](#مکانیزم-اجرا)
- [نمونه‌های استفاده](#نمونههای-استفاده)
- [چالش‌ها و راه‌حل‌ها](#چالشها-و-راهحلها)
- [نتیجه‌گیری](#نتیجهگیری)
- [منابع](#منابع)

---

## 🧩 مقدمه

این پروژه به عنوان تمرین دست‌گرمی اول درس برنامه‌نویسی وب طراحی شده است. هدف آن آشنایی با تعامل پویا بین HTML، JavaScript و DOM است؛ به‌طوری‌که با تعریف یک تگ HTML سفارشی، محاسبات ریاضی به صورت بلادرنگ (Real-time) انجام گیرد.

---

## 🎯 هدف پروژه

ایجاد یک تگ HTML سفارشی به نام `<formula>` که با استفاده از ویژگی `evaluator`، فرمولی شامل شناسهٔ ورودی‌های مختلف را دریافت کرده و نتیجهٔ آن را بر اساس مقادیر ورودی‌های صفحه محاسبه و نمایش دهد.

این تگ باید به‌صورت خودکار و در لحظه، مقدار فرمول را به‌روزرسانی کند و همچنین در برابر ورودی‌ها و فرمول‌های نامعتبر مقاوم باشد.

---

## 💻 تکنولوژی‌های استفاده‌شده

<p dir="ltr">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
</p>

---

## 🗂️ ساختار فایل‌ها

پروژه شامل سه فایل اصلی است:

| نام فایل       | توضیح |
|----------------|-------|
| `index.html`   | ساختار صفحه و تعریف تگ‌های `<formula>` و ورودی‌ها |
| `script.js`    | منطق محاسبه فرمول‌ها و کلاس اصلی برنامه |
| `style.css`    | زیباسازی و استایل‌دهی به صفحه (در صورت نیاز) |

---

## ⚙️ نحوه عملکرد

### کلاس `FormulaElement`

این کلاس، مسئول مدیریت هر تگ `<formula>` در صفحه است. از شناسایی ورودی‌ها گرفته تا گوش دادن به تغییرات و محاسبه نتیجه نهایی.

#### ویژگی‌های کلیدی:

1. **اعتبارسنجی فرمول**  
   با استفاده از یک عبارت منظم (Regex) فقط فرمول‌هایی با حروف، اعداد، عملگرها و پرانتز‌ها مجاز هستند.

   ```javascript
   static FORMULA_REGEX = /^[a-zA-Z0-9+\-*\/()\s.]+$/;
   ```

2. **شناسایی ورودی‌های وابسته به فرمول**  
   شناسه‌های موجود در فرمول با جدا کردن عملگرها استخراج می‌شوند:

   ```javascript
   findInputElements() {
       const operators = new Set(['+', '-', '*', '/', '(', ')']);
       const inputIds = [...new Set(this.formula.match(/([a-zA-Z0-9]+)/g) || [])]
           .filter(id => !operators.has(id));
       return inputIds.map(id => document.getElementById(id)).filter(Boolean);
   }
   ```

3. **گوش دادن به تغییرات ورودی‌ها**  
   به ازای هر ورودی، یک listener برای رویداد `input` اضافه می‌شود:

   ```javascript
   setupEventListeners() {
       this.inputs.forEach(input =>
           input.addEventListener('input', () => this.calculate())
       );
   }
   ```

4. **محاسبه نتیجه فرمول**  
   با استفاده از `new Function(...)` فرمول اجرا می‌شود. اگر مقدار ورودی نامعتبر باشد، خروجی "Unknown" نمایش داده می‌شود. در صورت خطای فرمول، خروجی "Invalid Formula" خواهد بود.

   ```javascript
   calculate() {
       if (!this.isValidFormula(this.formula)) {
           this.element.textContent = 'Invalid Formula';
           return;
       }

       let hasInvalidInput = false;
       const values = this.inputs.reduce((acc, input) => {
           const isValid = input.value.trim() !== '' && /^-?\d*\.?\d+$/.test(input.value);
           if (!isValid) hasInvalidInput = true;
           acc[input.id] = isValid ? parseFloat(input.value) : 0;
           return acc;
       }, {});

       if (hasInvalidInput) {
           this.element.textContent = 'Unknown';
           return;
       }

       try {
           const evalFunction = new Function(...Object.keys(values), `return ${this.formula};`);
           const result = evalFunction(...Object.values(values));
           this.element.textContent =
               typeof result === 'number' && !isNaN(result) ? result.toFixed(2) : 'Invalid Formula';
       } catch (error) {
           this.element.textContent = 'Invalid Formula';
       }
   }
   ```

5. **اجرای خودکار هنگام بارگذاری صفحه**

   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
       document.querySelectorAll('[evaluator]').forEach(element => new FormulaElement(element));
   });
   ```

---

## 📌 مکانیزم اجرا

1. هنگام بارگذاری صفحه، کلاس `FormulaElement` برای هر تگ `<formula>` مقداردهی اولیه می‌شود.
2. در هر لحظه‌ای که کاربر مقادیر ورودی را تغییر دهد، محاسبه جدید انجام شده و مقدار داخل تگ به‌روزرسانی می‌شود.
3. در صورت ورود مقدار نامعتبر یا فرمول اشتباه، خروجی مناسب نمایش داده می‌شود.

---

## 🧪 نمونه‌های استفاده

### ۱. محاسبه قیمت نهایی با تخفیف

```html
<input type="text" id="fee" placeholder="قیمت واحد">
<input type="text" id="count" placeholder="تعداد">
<input type="text" id="discount" placeholder="تخفیف">
<formula evaluator="count*fee-discount"></formula>
```

---

### ۲. محاسبه مساحت مستطیل

```html
<input type="text" id="width" placeholder="عرض">
<input type="text" id="height" placeholder="ارتفاع">
<formula evaluator="width*height"></formula>
```

---

### ۳. فرمول نامعتبر (استفاده از عملگر غیرمجاز)

```html
<input type="text" id="number1" placeholder="عدد اول">
<input type="text" id="number2" placeholder="عدد دوم">
<formula evaluator="number1#number2"></formula>
<!-- نمایش: Invalid Formula -->
```

---

## 🚧 چالش‌ها و راه‌حل‌ها

| چالش | راه‌حل |
|------|--------|
| استخراج ورودی‌ها از فرمول | استفاده از Regex برای جدا کردن شناسه‌ها از بین عملگرها |
| جلوگیری از اجرای کد مخرب در فرمول | بررسی فرمول با Regex و محدود کردن به کاراکترهای مجاز |
| مدیریت ورودی‌های خالی یا نامعتبر | استفاده از `parseFloat` و نمایش پیام "Unknown" برای مقادیر نامعتبر |
| جلوگیری از کرش کردن در زمان اجرای فرمول | استفاده از `try/catch` برای مدیریت خطاها در زمان اجرا |

---

## ✅ نتیجه‌گیری

در این پروژه با استفاده از JavaScript و DOM، توانستیم یک کامپوننت HTML پویا طراحی کنیم که به‌صورت خودکار و هوشمند، فرمول‌های ریاضی را بر اساس ورودی‌های صفحه محاسبه و نمایش دهد.

طراحی شی‌گرا، اعتبارسنجی ورودی و فرمول، و مدیریت امن خطاها از مهم‌ترین ویژگی‌های این پروژه هستند. همچنین این پروژه پایه‌ای مناسب برای توسعه سیستم‌های محاسباتی پیچیده‌تر در صفحات وب فراهم می‌کند.

---

## 📚 منابع

- [MDN - JavaScript Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- [MDN - Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [MDN - DOM Manipulation](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

</div>

---

