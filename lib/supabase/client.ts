import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgvpnzqzltiyprnytlju.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_J3TdVf4rc48VMdEvQbFRaA_k0uSHY_M'

export const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export function createClient() {
  return supabase
}

export function getSupabaseHost(): string {
  try {
    return new URL(SUPABASE_URL).host
  } catch {
    return 'supabase-host'
  }
}