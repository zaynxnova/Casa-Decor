/* =============================================================================
   CASA DECOR — supabase.js
   Central Supabase client + public data helpers
============================================================================= */
import { SUPABASE } from "./config.js";

let _client = null;

/* ── Is Supabase configured? ─────────────────────────────────────────────── */
export function isSupabaseConfigured() {
  return (
    typeof SUPABASE?.url === "string" &&
    SUPABASE.url.startsWith("https://") &&
    typeof SUPABASE?.anonKey === "string" &&
    SUPABASE.anonKey.length > 10
  );
}

/* ── Lazy singleton client ───────────────────────────────────────────────── */
export function getSupabase() {
  if (_client) return _client;

  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set url + anonKey in assets/js/config.js"
    );
  }

  // Load from CDN — works on GitHub Pages (no build step needed)
  if (typeof window !== "undefined" && !window.__supabaseLoaded) {
    throw new Error(
      "Supabase JS not loaded yet. Make sure the CDN script tag is in your HTML <head>."
    );
  }

  const { createClient } = window.supabase;
  _client = createClient(SUPABASE.url, SUPABASE.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}

/* ── Storage public URL ──────────────────────────────────────────────────── */
export function storagePublicUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path; // already absolute
  const bucket = SUPABASE.storage?.bucket || "casa-decor";
  return `${SUPABASE.url}/storage/v1/object/public/${bucket}/${path}`;
}

/* ── Public settings ─────────────────────────────────────────────────────── */
export async function fetchPublicSettings() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from(SUPABASE.views?.publicSettings || "public_site_settings")
      .select("key, value");
    if (error) throw error;
    // Convert array [{key,value}] → plain object {key: value}
    const map = {};
    (data || []).forEach(({ key, value }) => { map[key] = value; });
    return { data: map, error: null };
  } catch (err) {
    console.warn("fetchPublicSettings failed:", err.message);
    return { data: null, error: err };
  }
}

/* ── Public categories ───────────────────────────────────────────────────── */
export async function fetchPublicCategories() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from(SUPABASE.views?.publicCategories || "public_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.warn("fetchPublicCategories failed:", err.message);
    return { data: [], error: err };
  }
}

/* ── Public products ─────────────────────────────────────────────────────── */
export async function fetchPublicProducts({
  limit = SUPABASE.maxProductsToLoad || 300,
  categoryId = null,
  featured = null,
  search = null,
} = {}) {
  try {
    const sb = getSupabase();
    let query = sb
      .from(SUPABASE.views?.publicProducts || "public_products")
      .select("*")
      .limit(limit);

    if (categoryId) query = query.eq("category_id", categoryId);
    if (featured !== null) query = query.eq("featured", featured);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.warn("fetchPublicProducts failed:", err.message);
    return { data: [], error: err };
  }
}

/* ── Public offers ───────────────────────────────────────────────────────── */
export async function fetchPublicOffers() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from(SUPABASE.views?.publicOffers || "public_offers")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.warn("fetchPublicOffers failed:", err.message);
    return { data: [], error: err };
  }
}

/* ── Submit inquiry ──────────────────────────────────────────────────────── */
export async function submitInquiry(payload) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from(SUPABASE.tables?.inquiries || "inquiries")
      .insert([{
        name:         payload.name         || null,
        phone:        payload.phone        || null,
        email:        payload.email        || null,
        message:      payload.message      || null,
        interested_in: payload.interested_in || null,
        product_name: payload.product_name || null,
        status:       "new",
      }]);
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.warn("submitInquiry failed:", err.message);
    return { data: null, error: err };
  }
}ublicSettings() {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error("Supabase not configured.") };

  const { data, error } = await sb
    .from(SUPABASE.views.publicSettings)
    .select("*")
    .limit(1)
    .maybeSingle();

  return { data, error };
}

/** CATEGORIES */
export async function fetchPublicCategories() {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error("Supabase not configured.") };

  const { data, error } = await sb
    .from(SUPABASE.views.publicCategories)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return { data, error };
}

/** PRODUCTS (catalog) */
export async function fetchPublicProducts({ limit = 120 } = {}) {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error("Supabase not configured.") };

  const safeLimit = Math.min(limit, SUPABASE.maxProductsToLoad);

  const { data, error } = await sb
    .from(SUPABASE.views.publicProducts)
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  return { data, error };
}

/** PRODUCT by slug */
export async function fetchPublicProductBySlug(slug) {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error("Supabase not configured.") };

  const { data, error } = await sb
    .from(SUPABASE.views.publicProducts)
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  return { data, error };
}

/** Product images */
export async function fetchProductImages(productId) {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error("Supabase not configured.") };

  const { data, error } = await sb
    .from(SUPABASE.tables.productImages)
    .select("id, path, alt, sort_order, is_primary")
    .eq("product_id", productId)
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return { data, error };
}

/** Inquiries (public can insert) */
export async function createInquiry(payload) {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error("Supabase not configured.") };

  const { data, error } = await sb
    .from(SUPABASE.tables.inquiries)
    .insert(payload)
    .select("id")
    .limit(1)
    .maybeSingle();

  return { data, error };
}
