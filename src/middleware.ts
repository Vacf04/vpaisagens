// middleware.ts (NA RAIZ DO SEU PROJETO)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types'; // Verifique o caminho real do seu database.types.ts

export async function middleware(req: NextRequest) {
  console.log('\n--- Middleware START ---'); // Início da execução
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current Path:', req.nextUrl.pathname);
  console.log('Session exists:', !!session);
  if (session) {
    console.log('Session user ID:', session.user.id);
    console.log('Session email confirmed:', session.user.email_confirmed_at ? 'Yes' : 'No');
  }

  // Rotas que o usuário PODE acessar sem perfil completo ou sem login
  const publicPaths = ['/login', '/registrar', '/']; // Ajuste 'registrar' se sua rota de registro for diferente
  // A página de setup de perfil é especial: precisa estar logado, mas SEM perfil
  const profileSetupPath = '/login/registrar/criar-perfil'; // Confirme que esta é a URL exata
  // Rotas protegidas que exigem perfil completo
  const protectedPaths = ['/conta', '/dashboard', '/settings']; // Adicione TODAS as suas rotas protegidas aqui!

  const currentPath = req.nextUrl.pathname;

  // 1. Usuário NÃO autenticado
  if (!session) {
    console.log('State: NOT AUTHENTICATED');
    // Se está tentando acessar uma rota protegida OU a página de setup, redireciona para o login
    if (protectedPaths.includes(currentPath) || currentPath === profileSetupPath) {
      console.log('Action: Redirecting to /login (not authenticated).');
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    console.log('Action: Allowing access to public path.');
    return res; // Permite acesso a rotas públicas
  }

  // Se chegou aqui, o usuário está AUTENTICADO
  console.log('State: AUTHENTICATED');

  // Verificar se o usuário tem um perfil
  let hasProfile = false;
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      hasProfile = true;
    }
    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found (isso é ok)
      console.error('Middleware RLS error or DB query error checking profile:', error);
    }
  } catch (err) {
    console.error('Middleware network error checking profile:', err);
  }
  console.log('Has Profile:', hasProfile);


  // 2.1. Usuário AUTENTICADO, mas SEM perfil
  if (!hasProfile) {
    console.log('State: AUTHENTICATED, NO PROFILE');
    // Se o usuário NÃO tem perfil E NÃO está na página de setup, redireciona para a página de setup.
    if (currentPath !== profileSetupPath) {
      console.log('Action: Redirecting to ' + profileSetupPath + ' (missing profile, from any path).');
      const redirectUrl = new URL(profileSetupPath, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    // Se já está na página de setup, permite que continue
    console.log('Action: Allowing access to profile setup page (user has no profile).');
    return res;
  } 
  // 2.2. Usuário AUTENTICADO E COM perfil
  else { // hasProfile é true
    console.log('State: AUTHENTICATED, HAS PROFILE');
    // Se está na página de setup, mas já tem perfil, redireciona para a página de conta/dashboard
    if (currentPath === profileSetupPath) {
      console.log('Action: Redirecting from setup to /conta (profile complete).'); // OU /dashboard
      const redirectUrl = new URL('/conta', req.url); 
      return NextResponse.redirect(redirectUrl);
    }

    if(['/login', '/login/registrar'].includes(currentPath)) {
        const redirectUrl = new URL('/conta', req.url); 
      return NextResponse.redirect(redirectUrl);
            }

    console.log('Action: Allowing access to protected path (profile complete).');
    return res; // Permite acesso normal a outras rotas
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};