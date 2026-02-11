# 🔧 حل مشكلة اختفاء الـ + من رقم الهاتف في URL

## ❌ المشكلة

عند إرسال رقم الهاتف في الـ URL كـ query parameter (مثل `+966123456789`)، الرمز `+` كان يختفي ويتحول إلى مسافة.

### مثال:

```javascript
// رقم الهاتف الأصلي
mobile = "+966123456789";

// في الـ URL
router.push(`/auth/verfiy-otp?mobile=${mobile}`);
// النتيجة: /auth/verfiy-otp?mobile= 966123456789
//                                           ↑ مسافة بدلاً من +
```

## 🤔 لماذا يحدث هذا؟

في **URL encoding**:

- الرمز `+` يُستخدم لتمثيل **المسافة** (space)
- عندما يقرأ المتصفح الـ URL، يحول `+` إلى مسافة
- لذلك عند استخدام `searchParams.get("mobile")` نحصل على ` 966...` بدلاً من `+966...`

### جدول URL Encoding:

| الحرف | Encoded      | الاستخدام                   |
| ----- | ------------ | --------------------------- |
| مسافة | `%20` أو `+` | مسافة عادية                 |
| `+`   | `%2B`        | علامة زائد فعلية            |
| `&`   | `%26`        | و (يُستخدم في query params) |
| `=`   | `%3D`        | يساوي                       |

---

## ✅ الحل

### 1️⃣ في `sign-up-form.jsx` - استخدام `encodeURIComponent`

**قبل:**

```javascript
router.push(`/auth/verfiy-otp?mobile=${values?.mobile}&code=${code}`);
```

**بعد:**

```javascript
const encodedMobile = encodeURIComponent(values?.mobile);
const encodedCode = encodeURIComponent(code);
router.push(`/auth/verfiy-otp?mobile=${encodedMobile}&code=${encodedCode}`);
```

### كيف يعمل `encodeURIComponent`:

```javascript
encodeURIComponent("+966123456789");
// النتيجة: "%2B966123456789"
//           ↑ الـ + تحول إلى %2B

encodeURIComponent("+966 123");
// النتيجة: "%2B966%20123"
//           ↑       ↑
//           +     space
```

---

### 2️⃣ في `otp-form.jsx` - القراءة الصحيحة

**قبل:**

```javascript
const mobile = searchParams.get("mobile");
// كان يحتاج:
mobile.replace(" ", ""); // لإزالة المسافة
```

**بعد:**

```javascript
const mobile = searchParams.get("mobile");
// الآن يأتي صحيح: +966123456789
// لا حاجة لـ replace
```

---

## 📊 المقارنة

### الطريقة القديمة (❌):

```
[sign-up-form.jsx]
  mobile: "+966123456789"
         ↓
  URL: ?mobile=+966123456789
         ↓ (المتصفح يحول + إلى مسافة)
  URL: ?mobile= 966123456789
         ↓
[otp-form.jsx]
  searchParams.get("mobile") = " 966123456789"
         ↓
  mobile.replace(" ", "") = "966123456789"  ← الـ + ضاع!
```

### الطريقة الجديدة (✅):

```
[sign-up-form.jsx]
  mobile: "+966123456789"
         ↓
  encodeURIComponent(mobile) = "%2B966123456789"
         ↓
  URL: ?mobile=%2B966123456789
         ↓ (المتصفح يفك الـ encoding)
[otp-form.jsx]
  searchParams.get("mobile") = "+966123456789"  ← صحيح! ✅
```

---

## 🎯 الملفات المعدلة

### 1. `src/components/auth/sign-up-form.jsx`

```javascript
// إضافة router
const router = useRouter();

// في onSubmit
if (response?.code === 200) {
  const encodedMobile = encodeURIComponent(values?.mobile);
  const encodedCode = encodeURIComponent(
    response?.data?.data?.verificationCode
  );
  router.push(`/auth/verfiy-otp?mobile=${encodedMobile}&code=${encodedCode}`);
}
```

### 2. `src/components/auth/otp-form.jsx`

```javascript
async function onSubmit(values) {
  const data = {
    mobile: mobile, // الآن صحيح مع الـ +
    verification_code: values.otp,
  };

  const res = await postData({ url: "/verification", data });

  if (res?.code === 200) {
    toast.success(res?.data?.message);
  } else {
    toast.error(res?.message || "حدث خطأ ما");
  }
}
```

---

## 💡 نصائح مهمة

### 1. متى تستخدم `encodeURIComponent`؟

استخدمه **دائماً** عند وضع قيم ديناميكية في الـ URL:

```javascript
// ✅ صحيح
const url = `/page?name=${encodeURIComponent(
  userName
)}&email=${encodeURIComponent(email)}`;

// ❌ خطأ - قد يسبب مشاكل
const url = `/page?name=${userName}&email=${email}`;
```

### 2. ماذا عن `encodeURI`؟

- `encodeURI()` - للـ URL الكامل
- `encodeURIComponent()` - للقيم الفردية (أكثر أماناً) ✅

```javascript
// للمقارنة
encodeURI("+966 123"); // "+966%20123"  ← لم يحول الـ +
encodeURIComponent("+966 123"); // "%2B966%20123" ← حول كل شيء ✅
```

### 3. أحرف أخرى تحتاج encoding:

```javascript
const text = "a&b=c d+e";
encodeURIComponent(text);
// النتيجة: "a%26b%3Dc%20d%2Be"
//           ↑  ↑  ↑   ↑
//           &  =  space +
```

---

## ✨ النتيجة النهائية

الآن عند إرسال رقم الهاتف:

- ✅ الرمز `+` محفوظ بشكل صحيح
- ✅ لا حاجة لاستخدام `replace`
- ✅ البيانات تصل للـ API بشكل صحيح
- ✅ الكود أنظف وأكثر أماناً

---

## 📚 مراجع إضافية

- [MDN: encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [URL Encoding Reference](https://www.w3schools.com/tags/ref_urlencode.asp)

**تم بحمد الله! 🎉**
