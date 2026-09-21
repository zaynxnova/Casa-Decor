ral configuration (safe for frontend)
// IMPORTANT: Never put service-role key here. Only anon/public key.

export const APP = {
  brandName: "CASA DECOR",
  taglineFallback: "Complete Home Decoration & Interior Solutions",
  currencyFallback: "PKR",
};

export const SUPABASE = {
  // TODO: Set these in production:
  // 1) Go to Supabase Project Settings → API
  // 2) Paste Project URL + anon/public key below
url: "https://ofwmwlosvxzbwyirxgoz.supabase.co",
anonKey: "sb_publishable_OBCuVQ_A6AC1viDy3ZEdHw_e-Hw4TJm",

  // Views/tables (we will create these in supabase/schema.sql later)
  views: {
    publicSettings: "public_site_settings",
    publicCategories: "public_categories",
    publicProducts: "public_products",
    publicOffers: "public_offers",
  },

  tables: {
    productImages: "product_images",
    inquiries: "inquiries",
  },
) {
  return (
    typeof SUPABASE.url === "string" &&
    SUPABASE.url.startsWith("https://") &&
    typeof SUPABASE.anonKey === "string" &&
    SUPABASE.anonKey.length > 20
  );
}
