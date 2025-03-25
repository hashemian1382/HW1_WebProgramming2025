<div dir="rtl">

# تگ با حساب و کتاب - پیاده‌سازی محاسبه‌گر پویا

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Sharif-University-of-Technology.jpg" alt="لوگوی دانشگاه صنعتی شریف" width="200">
</p>

<p align="center">
  <b>دانشگاه صنعتی شریف</b><br>
  دانشکده مهندسی کامپیوتر<br>
  درس برنامه‌نویسی وب - بهار ۱۴۰۴
  <br>استاد درس: دکتر یحیی پورسلطانی

</p>

<p align="center">
  <b>علی هاشمیان</b><br>
  شماره دانشجویی: ۴۰۱۱۰۶۶۸۵
</p>



## فهرست محتوا
- [مقدمه](#مقدمه)
- [شرح مسئله](#شرح-مسئله)
- [تکنولوژی های استفاده شده](#تکنولوژی‌-های-استفاده-شده)
- [ساختار پروژه](#ساختار-پروژه)
- [نحوه پیاده‌سازی](#نحوه-پیاده-سازی)
  - [کلاس FormulaElement](#کلاس-formulaelement)
  - [روند اجرا](#روند-اجرا)
- [نمونه استفاده](#نمونه-استفاده)
- [چالش‌ها و راه‌حل‌ها](#چالش-ها-و-راه-حل-ها)
- [نتیجه‌گیری](#نتیجه-گیری)
- [منابع](#منابع)

## مقدمه

این پروژه در راستای تمرین دستگرمی اول درس برنامه‌نویسی وب با عنوان "تگ با حساب و کتاب" انجام شده است. هدف از این پروژه، پیاده‌سازی یک محاسبه‌گر پویا با استفاده از JavaScript و DOM است که بتواند بر اساس ورودی‌های کاربر، محاسبات را به صورت آنی انجام دهد.

## شرح مسئله

در این پروژه، هدف ایجاد یک تگ سفارشی `<formula>` است که می‌تواند عبارات ریاضی را بر اساس مقادیر ورودی‌های HTML محاسبه کند. این تگ دارای یک ویژگی `evaluator` است که فرمول محاسباتی را در خود نگه می‌دارد. با تغییر هر یک از ورودی‌ها، نتیجه محاسبه به صورت آنی به‌روزرسانی می‌شود.


## تکنولوژی‌های استفاده شده
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ساختار پروژه

پروژه از سه فایل اصلی تشکیل شده است:

1. **index.html**: ساختار HTML صفحه و تعریف تگ‌های `<formula>`
2. **script.js**: منطق جاوااسکریپت برای محاسبه فرمول‌ها
3. **style.css**: استایل‌دهی به صفحه و المان‌ها

## نحوه پیاده‌سازی

### کلاس FormulaElement

قلب این پروژه، کلاس `FormulaElement` است که برای هر تگ `<formula>` یک نمونه از آن ایجاد می‌شود. این کلاس مسئولیت‌های زیر را بر عهده دارد:

1. **استخراج شناسه‌های ورودی از فرمول**:
   ```javascript
   extractInputIds(formula) {
       const regex = /([a-zA-Z0-9]+)/g;
       let matches = formula.match(regex);
       return matches ? matches.filter(match => !['+', '-', '*', '/', '(', ')'].includes(match)) : [];
   }
   ```

2. **دریافت المان‌های ورودی مرتبط**:
   ```javascript
   getInputElements(inputIds) {
       return inputIds.map(id => document.getElementById(id)).filter(element => element);
   }
   ```

3. **اتصال رویدادهای ورودی**:
   ```javascript
   attachEventListeners() {
       this.inputElements.forEach(inputElement => {
           inputElement.addEventListener('input', () => this.updateFormulaResult());
       });
   }
   ```

4. **به‌روزرسانی نتیجه فرمول**:
   ```javascript
   updateFormulaResult() {
       const values = {};
       this.inputIds.forEach((id, index) => {
           const element = this.inputElements[index];
           if (element) {
               const value = parseFloat(element.value);
               values[id] = isNaN(value) ? 0 : value;
           } else {
               values[id] = 0;
           }
       });

       try {
           const formulaFunction = new Function(...Object.keys(values), `return ${this.formula};`);
           const result = formulaFunction(...Object.values(values));

           if (typeof result === 'number') {
               this.element.textContent = result.toFixed(2);
           } else {
               this.element.textContent = 'Invalid Formula Result';
           }
       } catch (error) {
           console.error("Formula evaluation error:", error);
           this.element.textContent = 'Invalid Formula';
       }
   }
   ```

### روند اجرا

1. با بارگذاری صفحه، رویداد `DOMContentLoaded` فعال می‌شود.
2. تمام تگ‌های `<formula>` در صفحه پیدا می‌شوند.
3. برای هر تگ، یک نمونه از کلاس `FormulaElement` ایجاد می‌شود.
4. کلاس `FormulaElement` شناسه‌های ورودی را از فرمول استخراج می‌کند.
5. برای هر ورودی، یک شنونده رویداد `input` اضافه می‌شود.
6. با تغییر هر ورودی، متد `updateFormulaResult` فراخوانی می‌شود.
7. نتیجه محاسبه در محتوای تگ `<formula>` نمایش داده می‌شود.

## نمونه استفاده

در این پروژه، سه نمونه فرمول پیاده‌سازی شده است:

1. **محاسبه قیمت با تخفیف**: `count*fee-discount`
   ```html
   <input type="text" id="fee" placeholder="قیمت واحد">
   <input type="text" id="count" placeholder="تعداد">
   <input type="text" id="discount" placeholder="تخفیف">
   <div class="formula-output">
       نتیجه فرمول 1: <formula evaluator="count*fee-discount"></formula>
   </div>
   ```

2. **محاسبه مساحت**: `width*height`
   ```html
   <input type="text" id="width" placeholder="عرض">
   <input type="text" id="height" placeholder="ارتفاع">
   <div class="formula-output">
       نتیجه فرمول 2: <formula evaluator="width*height"></formula>
   </div>
   ```

3. **فرمول با عملگر نامعتبر**: `number1#number2`
   ```html
   <input type="text" id="number1" placeholder="عدد اول">
   <input type="text" id="number2" placeholder="عدد دوم">
   <div class="formula-output">
       نتیجه فرمول 3: <formula evaluator="number1#number2"></formula>
   </div>
   ```

## چالش‌ها و راه‌حل‌ها

در طول پیاده‌سازی این پروژه با چالش‌های زیر مواجه شدم:

1. **استخراج شناسه‌های ورودی از فرمول**:
   - **چالش**: تشخیص شناسه‌های ورودی از عملگرها و کلمات کلیدی
   - **راه‌حل**: استفاده از عبارت منظم (Regex) برای تشخیص کلمات و فیلتر کردن عملگرها

2. **ارزیابی امن فرمول‌ها**:
   - **چالش**: ارزیابی فرمول‌های ورودی بدون ایجاد خطرات امنیتی
   - **راه‌حل**: استفاده از `Function` constructor برای ایجاد تابع ارزیابی و مدیریت خطاها با `try/catch`

3. **مدیریت ورودی‌های نامعتبر**:
   - **چالش**: رسیدگی به ورودی‌های غیر عددی یا خالی
   - **راه‌حل**: استفاده از `parseFloat` و بررسی `isNaN` برای تبدیل ورودی‌ها به اعداد معتبر

## نتیجه‌گیری

در این پروژه، موفق شدم یک سیستم محاسبه‌گر پویا با استفاده از JavaScript و DOM پیاده‌سازی کنم که می‌تواند فرمول‌های ریاضی را بر اساس ورودی‌های کاربر محاسبه کند. استفاده از اصول برنامه‌نویسی شی‌گرا و رویکرد ماژولار، امکان توسعه و استفاده مجدد از کد را فراهم می‌کند.

این پروژه نشان می‌دهد که چگونه می‌توان با استفاده از JavaScript، رفتارهای پویا را به صفحات وب اضافه کرد و تجربه کاربری بهتری را فراهم نمود.

## منابع

- MDN Web Docs - [Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
- MDN Web Docs - [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- MDN Web Docs - [Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

</div>
