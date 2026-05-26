# SmartPortal GLOBAL PRO

Bu v3 versiya GitHub layihələrinin yanına yükləmək və Supabase SQL-i run etmək üçün hazırlanmış tam statik PWA prototipidir.

## Əsaslar

- 480+ seçimli xidmət kataloqu
- 12 görünən dil seçimi və RTL dəstəyi
- 10 valyuta
- Login, qeydiyyat, parolu unutdum səhifəsi
- Müştəri portalı: domain, SSL, hosting, email, ödəniş, layihə statusu, sənəd və support modeli
- Admin ERP/CRM: satılmış layihə əlavə etmə, pipeline, MRR, ARR, profit, domain renewal
- Push notification demo
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

Supabase SQL Editor daxilində `supabase-global-pro.sql` faylını run edin. Bu prototip hazırda localStorage demo rejimdə işləyir; növbəti mərhələdə Supabase JS client əlavə edib real auth, project insert, portal data və push token yazılışını aktivləşdirmək olar.
