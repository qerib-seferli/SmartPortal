// Bu modul Supabase ilə auth, katalog, CRM, portal və admin CRUD əməliyyatlarını idarə edir.
let cachedClient = null;

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

// Bu funksiya /rest/v1 ilə yazılmış URL-i də Supabase JS üçün project URL-ə çevirir.
function projectUrl() {
  const raw = String(window.SMARTPORTAL_SUPABASE?.url || "").trim();
  return raw.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

// Bu funksiya Supabase REST endpoint URL-ni hazırlayır.
function restEndpoint(path, query = "") {
  return `${projectUrl()}/rest/v1/${path}${query ? `?${query}` : ""}`;
}

// Bu funksiya Supabase JS importu işləməsə də public anon key ilə oxuma əməliyyatı aparır.
async function restSelect(path, query = "") {
  const config = window.SMARTPORTAL_SUPABASE || {};
  const response = await fetch(restEndpoint(path, query), {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`
    }
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

// Bu funksiya Supabase client yaradır; CDN import alınmasa oxuma əməliyyatları REST fallback ilə davam edir.
export async function getSupabase() {
  const config = window.SMARTPORTAL_SUPABASE || {};
  if (!config.url || !config.anonKey || config.url.includes("YOUR_PROJECT")) return null;
  if (cachedClient) return cachedClient;
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    cachedClient = createClient(projectUrl(), config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return cachedClient;
  } catch {
    return null;
  }
}

export async function getSession() {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

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

export async function signIn({ email, password }) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data, message: "Daxil oldunuz." };
}

export async function resetPassword(email) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}${location.pathname.replace("auth.html", "auth.html")}`
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Parol yeniləmə linki emailə göndərildi." };
}

export async function updatePassword(newPassword) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase config tapılmadı." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Parol yeniləndi. İndi portala daxil ola bilərsiniz." };
}

export async function signOut() {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function submitLeadToSupabase(leadPayload) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { data, error } = await supabase.rpc("sp_submit_public_lead", { lead_payload: leadPayload });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data };
}

export async function loadMyPortal() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: null };
  const { data, error } = await supabase.rpc("sp_my_portal");
  if (error) return { ok: false, message: error.message, data: null };
  return { ok: true, data };
}

export async function loadAdminProjects() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: [] };
  const { data, error } = await supabase
    .from("sp_projects")
    .select("id,client_id,title,status,total_azn,mrr_azn,profit_azn,created_at,sp_clients(company_name,contact_name),sp_domains(domain_name,expires_at)")
    .order("created_at", { ascending: false });
  if (error) return { ok: false, message: error.message, data: [] };
  return { ok: true, data: data || [] };
}

export async function createManualProject(projectPayload) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { data, error } = await supabase.rpc("sp_admin_create_project", { project_payload: projectPayload });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data };
}

export async function loadCatalogOverrides() {
  const supabase = await getSupabase();
  if (supabase) {
    const rpc = await supabase.rpc("sp_public_catalog");
    if (!rpc.error && Array.isArray(rpc.data)) return rpc.data;

    const direct = await supabase
      .from("sp_catalog_items")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("group_key", { ascending: true })
      .order("module_title", { ascending: true });
    if (!direct.error && Array.isArray(direct.data)) return direct.data;
  }

  try {
    return await restSelect("sp_catalog_items", "select=*&active=eq.true&order=sort_order.asc,group_key.asc,module_title.asc");
  } catch (error) {
    console.warn("SmartPortal catalog load failed:", error);
    return [];
  }
}

export async function loadAdminCatalog() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: [], message: "Supabase JS yüklənmədi." };
  const { data, error } = await supabase
    .from("sp_catalog_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("group_key", { ascending: true })
    .order("module_title", { ascending: true });
  if (error) return { ok: false, data: [], message: error.message };
  return { ok: true, data: data || [] };
}

export async function loadCurrencyRates() {
  const supabase = await getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("sp_currency_rates")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (!error && Array.isArray(data)) return data;
  }

  try {
    return await restSelect("sp_currency_rates", "select=*&active=eq.true&order=sort_order.asc");
  } catch (error) {
    console.warn("SmartPortal currency load failed:", error);
    return [];
  }
}

export async function saveCatalogOverride(item) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { error } = await supabase.from("sp_catalog_items").upsert(item, { onConflict: "module_key" });
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function deleteCatalogItem(id) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { error } = await supabase.from("sp_catalog_items").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function saveCurrencyRate(rate) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { error } = await supabase.from("sp_currency_rates").upsert(rate, { onConflict: "code" });
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function updateProjectStatus(projectId, status) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { error } = await supabase.from("sp_projects").update({ status }).eq("id", projectId);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function deleteProject(projectId) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  const { data, error } = await supabase.rpc("sp_admin_delete_project", { project_id_input: projectId });
  if (error) return { ok: false, message: error.message };
  return { ok: true, data };
}

export async function loadAdminRows(tableName) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, data: [], message: "Supabase JS yüklənmədi." };
  if (!adminTables.has(tableName)) return { ok: false, data: [], message: "Bu cədvəl admin menecerinə açılmayıb." };
  const { data, error } = await supabase.from(tableName).select("*").limit(100);
  if (error) return { ok: false, data: [], message: error.message };
  return { ok: true, data: data || [] };
}

export async function saveAdminRow(tableName, row) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  if (!adminTables.has(tableName)) return { ok: false, message: "Bu cədvəl admin menecerinə açılmayıb." };
  const { error } = await supabase.from(tableName).upsert(row);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function deleteAdminRow(tableName, id) {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, message: "Supabase JS yüklənmədi." };
  if (!adminTables.has(tableName)) return { ok: false, message: "Bu cədvəl admin menecerinə açılmayıb." };
  const { error } = await supabase.from(tableName).delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
