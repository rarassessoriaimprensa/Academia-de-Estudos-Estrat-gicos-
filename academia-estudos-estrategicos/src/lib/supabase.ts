import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const legacyAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const apiKey = publishableKey || legacyAnonKey

export const isSupabaseConfigured = Boolean(url && apiKey)
export const supabase = isSupabaseConfigured ? createClient(url, apiKey) : null
