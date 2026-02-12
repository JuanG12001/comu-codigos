import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pormcgukgytkteobdqrc.supabase.co";
const supabaseKey = "sb_publishable_36X63fwZ-ww18ym4wi_jXA_GLh3Gt7M";

export const supabase = createClient(supabaseUrl, supabaseKey);
