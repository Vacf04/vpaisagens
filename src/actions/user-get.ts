'use server'


import { createClient } from "@/lib/supabaseServer";
import { PostgrestError } from "@supabase/supabase-js";

export type UserType = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
}


export default async function userGet(id:string): Promise<{ data: UserType[] | null; error: PostgrestError | null }> {
    const supabaseServer = await createClient();
    
    const { data, error } = await supabaseServer
        .from('profiles')
        .select("*")
        .eq('id', id);

    return { data, error };
}