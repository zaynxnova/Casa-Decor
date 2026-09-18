// assets/js/config.js
// Central configuration (safe for frontend)
// IMPORTANT: Never put service-role key here. Only anon/publishable key.

export const APP = {
  brandName: "CASA DECOR",
  taglineFallback: "Complete Home Decoration & Interior Solutions",
  currencyFallback: "PKR",
};

export const SUPABASE = {
  // Set these from Supabase Project Settings → API
  url: "https://ofwmwlosvxzbwyirxgoz.supabase.co",
  anonKey: "sb_publishable_OBCuV0_A6AC1viDy3ZEdHw_e-Hw4TJm",

  // Views/tables (must match your schema)
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

  storage: {
    catalogBucket: "catalog",
    siteBucket: "site",
  },
};

export function isSupabaseConfigured() {
  return (
    typeof SUPABASE.url === "string" &&
    SUPABASE.url.startsWith("https://") &&
    typeof SUPABASE.anonKey === "string" &&
    SUPABASE.anonKey.length > 20
  );
}
