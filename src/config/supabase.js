import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kzjsymmvjwqiwefeuvmq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6anN5bW12andxaXdlZmV1dm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDczNTUsImV4cCI6MjA5MjY4MzM1NX0.cyu3elvy1rq7B97X4u0q57qkI9c0ZEfVXXNOinzeWdY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);