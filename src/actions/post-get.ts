'use server'


import { createClient } from "@/lib/supabaseServer";
import { PostgrestError } from "@supabase/supabase-js";
import { PostsType } from "./posts-get";


export default async function postGet(id:string): Promise<{ data: PostsType[] | null; error: PostgrestError | null }> {
    const supabaseServer = await createClient();
    
    const { data, error } = await supabaseServer
        .from('posts')
        .select("*")
        .eq('id', id);

    return { data, error };
}