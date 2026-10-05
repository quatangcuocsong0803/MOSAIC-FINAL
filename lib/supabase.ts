import { createClient } from "@supabase/supabase-js";

let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
// Loại bỏ dấu nháy kép / nháy đơn nếu có
rawUrl = rawUrl.replace(/^["']|["']$/g, "").trim();
// Loại bỏ /rest/v1 nếu người dùng vô tình copy URL của REST API thay vì Project URL
rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");
// Loại bỏ dấu gạch chéo ở cuối URL (trailing slash) để tránh lỗi URL double-slash
const supabaseUrl = rawUrl.replace(/\/+$/, "");

let rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
const supabaseKey = rawKey.replace(/^["']|["']$/g, "").trim();

if (!supabaseUrl || !supabaseKey) {
  console.error("Thiếu biến môi trường Supabase! Hãy kiểm tra NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
