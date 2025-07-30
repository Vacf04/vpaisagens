// lib/supabase/client.ts  <-- Crie este arquivo
// (Caminho relativo: ../../lib/supabase/client em relação ao seu context.ts)

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../lib/database.types"; // Ajuste o caminho para seus tipos de banco de dados

// Esta instância é para uso em Client Components (no navegador)
// A lógica de cookieOptions que você testou para debug pode ficar aqui
const supabaseClient = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  options: {
    auth: {
      cookieOptions: {
        domain: "localhost", // Remova em produção se o Auth Domain no dashboard estiver certo
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      },
    },
  },
});

export { supabaseClient }; // Exporta como supabaseClient, para não confundir com outras instâncias