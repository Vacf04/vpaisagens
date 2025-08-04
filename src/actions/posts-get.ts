'use server'


import { createClient } from "@/lib/supabaseServer";
import { PostgrestError } from "@supabase/supabase-js";


export type Posts = {
    id: string;
    user_id: string;
    image_url: string;
    description: string;
    created_at: string;
};

type RangeValues = {
    firstRange: number;
    lastRange: number;
}

export default async function postsGet(id: string, range: RangeValues): Promise<{ data: Posts[] | null; error: PostgrestError | null }> {
    const supabaseServer = await createClient();
    
    const { data, error } = await supabaseServer
        .from('posts')
        .select('*')
        .eq('user_id', id)
        .range(range.firstRange, range.lastRange);

    return { data, error };
}