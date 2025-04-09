// supabaseClient.js
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Replace these with your own Supabase URL and Key
const SUPABASE_URL = 'https://rrgscadnpzbecaakhfbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3NjYWRucHpiZWNhYWtoZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDQwMzEsImV4cCI6MjA1ODk4MDAzMX0.x-VY-VX6BFu3BueYdq6jnhDPEj6bExDg1Wti7EFpiSw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;;
