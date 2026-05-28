# Dokploy Setup Guide for Grantify Academy

## 1. Build-time Arguments (Dokploy Build Args)
**أضف هذه المتغيرات في "Build Args" في إعدادات التطبيق في Dokploy:**

| الاسم                     | القيمة                                                                 | ملاحظات                                                                 |
|--------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------|
| `VITE_SUPABASE_URL`      | `https://vfwhismhogfzvbsznqts.supabase.co`                           | رابط مشروع Supabase (بدون "db.")                                      |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmd2hpc21ob2dmenZic3pucXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzkyNzgsImV4cCI6MjA5NTU1NTI3OH0.QgUIujKmRGQr1U5ZkFZX_cXR6z2F38-Ey8Q2RVQPQlI` | المفتاح العام (anon) من Supabase                                       |

---

## 2. Build-time Secrets (Dokploy Build Secrets)
(لا تحتاج أي Build Secrets لهذا التطبيق)

---

## 3. Environment Settings (Dokploy Runtime Env)
(لا تحتاج أي Runtime Env Vars لهذا التطبيق)

---

## بعد إضافة المتغيرات:
1. اضغط على "Redeploy" (إعادة نشر) في Dokploy لتطبيق التغييرات (لأنه يتم تضمين متغيرات VITE أثناء البناء)
2. أضف رابط موقعك في `Supabase → Authentication → URL Configuration → Redirect URLs` (مثل `http://185.230.64.89:3000/*` أو أي مجال مخصص لديك)
