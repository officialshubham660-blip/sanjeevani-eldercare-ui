import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

const FALLBACK_SUPABASE_URL = 'https://vgvpnzqxitipmytjju.supabase.co'
const FALLBACK_SUPABASE_KEY = 'sb_publishable_J3TdVf4rc48VMdEvQbFRaA_k0uSHY_M'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY

let client: SupabaseClient | undefined

export function createClient() {
  if (!client) {
    client = createSupabaseClient(supabaseUrl, supabaseKey)
  }
  return client
}

export function getSupabaseHost() {
  return new URL(supabaseUrl).host
}
