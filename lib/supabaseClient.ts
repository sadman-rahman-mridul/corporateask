import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjtcqgwoyhbbcobqqvmr.supabase.co';
const supabaseKey = 'sb_publishable_Gz4EwfO9dF4scTp6Nw9AUQ_7KCa10R0';

export const supabase = createClient(supabaseUrl, supabaseKey);