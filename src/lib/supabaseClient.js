// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://krwxgnolngmkmqvgsgcr.supabase.co'; // ton URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyd3hnbm9sbmdta21xdmdzZ2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTcyNzgsImV4cCI6MjA3OTYzMzI3OH0.KtQ3zwNkH7TuN8I42AxzV9iBMQ5iesZObfPa4THxPuY'; // ta clé anonyme

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
