import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdorkyywnldqisvskzjc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_4unN4vo4g_Wkxf2sUZlsGg_7qM343lL'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
