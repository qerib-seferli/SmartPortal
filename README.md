# SmartPortal GLOBAL PRO

Bu versiya GitHub layihələrinin yanına yükləmək və Supabase SQL-i run etmək üçün hazırlanmış tam statik PWA/SaaS platformasıdır.

## Əsaslar

- 480+ seçimli xidmət kataloqu
- 12 görünən dil seçimi və RTL dəstəyi
- 10 valyuta
- Login, qeydiyyat, parolu unutdum səhifəsi
- Müştəri portalı: domain, SSL, hosting, email, ödəniş, layihə statusu, sənəd və support modeli
- Admin ERP/CRM: satılmış layihə əlavə etmə, pipeline, MRR, ARR, profit, domain renewal
- Push notification və renewal xəbərdarlıq modeli
- Supabase üçün `supabase-global-pro.sql`

## Lokal Açılış

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1 -Port 4176
```

URL-lər:

- `http://127.0.0.1:4176/index.html`
- `http://127.0.0.1:4176/admin.html`
- `http://127.0.0.1:4176/portal.html`
- `http://127.0.0.1:4176/auth.html`

## Supabase

Supabase SQL Editor daxilində `supabase-global-pro.sql` faylını run edin. Sayt Supabase qoşulanda real auth, lead insert, portal data, admin project insert və push token yazılışları ilə işləyir; Supabase bağlantısı kəsilərsə lead-lər lokal ehtiyat yaddaşa saxlanır.

Sonra real auth, lead insert, portal RPC və katalog qiymət redaktoru üçün bu faylı da run edin:

```text
supabase-upgrade-pro.sql
```

Supabase URL və anon key üçün:

```js
// js/supabase-config.js
window.SMARTPORTAL_SUPABASE = {
  url: "https://YOUR_PROJECT_ID.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY"
};
```

Bu versiyada `js/supabase-client.js` Supabase Auth, lead RPC, portal RPC, admin project RPC və katalog qiymət override-larını real bazaya bağlayır. Supabase CDN importu üçün sayt internetdə host olunanda işləyəcək.
