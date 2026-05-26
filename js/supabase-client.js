// Bu modul Supabase ilə real auth, CRM, portal və katalog əməliyyatlarını idarə edir.
let cachedClient = null;

// Bu funksiya config məlumatlarını yoxlayır və Supabase client yaradır.
export async function getSupabase() {
  const config = window.SMARTPORTAL_SUPABASE || {};
  if (!config.url || !config.anonKey || config.url.includes("YOUR_PROJECT")) return null;
  if (cachedClient) return cachedClient;
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  cachedClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return cachedClient;
}

// Bu funksiya cari auth sessiyasını qaytarır.
export async function getSession() {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Bu funksiya real qeydiyyat əməliyyatını Supabase Auth-a göndərir.
export async function signUp({ email, password, fullName, company }) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, company_name: company },
      emailRedirectTo: `${location.origin}${location.pathname.replace("auth.html", "portal.html")}`
    }
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data, message: "Qeydiyyat göndərildi. Email təsdiqi aktivdirsə, inbox-u yoxlayın." };
}

// Bu funksiya real login əməliyyatını icra edir.
export async function signIn({ email, password }) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data, message: "Daxil oldunuz." };
}

// Bu funksiya parol reset linkini emailə göndərir.
export async function resetPassword(email) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}${location.pathname.replace("auth.html", "auth.html")}`
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Parol yeniləmə linki emailə göndərildi." };
}

// Bu funksiya reset linkindən sonra yeni parolu aktiv sessiyada yeniləyir.
export async function updatePassword(newPassword) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Parol yeniləndi. İndi portala daxil ola bilərsiniz." };
}

// Bu funksiya sessiyadan çıxışı icra edir.
export async function signOut() {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

// Bu funksiya kalkulyator payload-unu security definer RPC vasitəsilə bazaya yazır.
export async function submitLeadToSupabase(leadPayload) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { data, error } = await supabase.rpc("sp_submit_public_lead", { lead_payload: leadPayload });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data };
}

// Bu funksiya müştərinin portal datasını RPC vasitəsilə oxuyur.
export async function loadMyPortal() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: null };
  const { data, error } = await supabase.rpc("sp_my_portal");
  if (error) return { ok: false, message: error.message, data: null };
  return { ok: true, data };
}

// Bu funksiya admin layihə siyahısını birbaşa cədvəldən oxuyur.
export async function loadAdminProjects() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: [] };
  const { data, error } = await supabase
    .from("sp_projects")
    .select("id,title,status,total_azn,mrr_azn,profit_azn,created_at,sp_clients(company_name),sp_domains(domain_name,expires_at)")
    .order("created_at", { ascending: false });
  if (error) return { ok: false, message: error.message, data: [] };
  return { ok: true, data };
}

// Bu funksiya adminin satılmış layihəni Supabase-ə əlavə etməsi üçün RPC çağırır.
export async function createManualProject(projectPayload) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { data, error } = await supabase.rpc("sp_admin_create_project", { project_payload: projectPayload });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data };
}

// Bu funksiya katalog qiymət override-larını Supabase-dən oxuyur.
export async function loadCatalogOverrides() {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("sp_catalog_items").select("*");
  if (error) return [];
  return data || [];
}

// Bu funksiya adminin 480+ katalog seçimlərindən birinin qiymət/gün məlumatını yeniləməsini saxlayır.
export async function saveCatalogOverride(item) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { error } = await supabase.from("sp_catalog_items").upsert(item, { onConflict: "module_key" });
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
