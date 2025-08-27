// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 使用 service_role key 创建客户端，拥有更高权限
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)