import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const client = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
export const supabase = client
export default client