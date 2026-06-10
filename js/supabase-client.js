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

// Bu siyahı admin paneldə ümumi data menecerinin işləyə biləcəyi cədvəlləri məhdudlaşdırır.
const adminTables = new Set([
  "sp_clients",
  "sp_projects",
  "sp_project_modules",
  "sp_domains",
  "sp_mailboxes",
  "sp_subscriptions",
  "sp_invoices",
  "sp_notifications",
  "sp_support_tickets",
  "sp_push_tokens",
  "sp_catalog_items",
  "sp_currency_rates"
]);

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
  const { data, error } = await supabase.rpc("sp_public_catalog");
  if (error) return [];
  return data || [];
}

// Bu funksiya admin üçün aktiv/passiv bütün katalog sətirlərini gətirir.
export async function loadAdminCatalog() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: [], message: "Supabase config yoxdur." };
  const { data, error } = await supabase
    .from("sp_catalog_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("group_key", { ascending: true })
    .order("module_title", { ascending: true });
  if (error) return { ok: false, data: [], message: error.message };
  return { ok: true, data: data || [] };
}

// Bu funksiya adminin valyuta kurslarını Supabase-dən oxuması üçündür.
export async function loadCurrencyRates() {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("sp_currency_rates")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
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

// Bu funksiya katalog elementini bazadan silir.
export async function deleteCatalogItem(id) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { error } = await supabase.from("sp_catalog_items").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

// Bu funksiya valyuta kursunu admin paneldən yeniləyir.
export async function saveCurrencyRate(rate) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { error } = await supabase.from("sp_currency_rates").upsert(rate, { onConflict: "code" });
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

// Bu funksiya layihə statusunu real Supabase cədvəlində dəyişir.
export async function updateProjectStatus(projectId, status) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { error } = await supabase.from("sp_projects").update({ status }).eq("id", projectId);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

// Bu funksiya layihəni və ona bağlı cascade datanı bazadan silir.
export async function deleteProject(projectId) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  const { data, error } = await supabase.rpc("sp_admin_delete_project", { project_id_input: projectId });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data };
}

// Bu funksiya whitelist daxilində istənilən admin cədvəlindən sətirləri oxuyur.
export async function loadAdminRows(tableName) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: [], message: "Supabase config yoxdur." };
  if (!adminTables.has(tableName)) return { ok: false, data: [], message: "Bu cədvəl admin menecerinə açılmayıb." };
  const { data, error } = await supabase.from(tableName).select("*").limit(100);
  if (error) return { ok: false, data: [], message: error.message };
  return { ok: true, data: data || [] };
}

// Bu funksiya whitelist daxilində sətir əlavə/redakt edir.
export async function saveAdminRow(tableName, row) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  if (!adminTables.has(tableName)) return { ok: false, message: "Bu cədvəl admin menecerinə açılmayıb." };
  const { error } = await supabase.from(tableName).upsert(row);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

// Bu funksiya whitelist daxilində id üzrə sətir silir.
export async function deleteAdminRow(tableName, id) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config yoxdur." };
  if (!adminTables.has(tableName)) return { ok: false, message: "Bu cədvəl admin menecerinə açılmayıb." };
  const { error } = await supabase.from(tableName).delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
