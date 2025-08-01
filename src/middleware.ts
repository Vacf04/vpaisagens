// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types'; // Verifique o caminho real do seu database.types.ts

export async function middleware(req: NextRequest) {
  console.log('\n--- Middleware START ---');
  const res = NextResponse.next();

  // A ÚNICA ALTERAÇÃO CRÍTICA AQUI
  // Troca createMiddlewareClient por createServerClient e passa { req, res }
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          req.cookies.set({ name, value, ...options })
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          req.cookies.set({ name, value: '', ...options })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current Path:', req.nextUrl.pathname);
  console.log('Session exists:', !!session);

  // O restante do seu código (lógica de roteamento) permanece o mesmo
  // ...
  if (session) {
    console.log('Session user ID:', session.user.id);
    console.log('Session email confirmed:', session.user.email_confirmed_at ? 'Yes' : 'No');
  }

  const publicPaths = ['/login', '/registrar', '/'];
  const profileSetupPath = '/login/registrar/criar-perfil';
  const protectedPaths = ['/conta', '/dashboard', '/settings'];

  const currentPath = req.nextUrl.pathname;

  // 1. Usuário NÃO autenticado
  if (!session) {
    console.log('State: NOT AUTHENTICATED');
    if (protectedPaths.includes(currentPath) || currentPath === profileSetupPath) {
      console.log('Action: Redirecting to /login (not authenticated).');
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    console.log('Action: Allowing access to public path.');
    return res;
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
    if (error && error.code !== 'PGRST116') {
      console.error('Middleware RLS error or DB query error checking profile:', error);
    }
  } catch (err) {
    console.error('Middleware network error checking profile:', err);
  }
  console.log('Has Profile:', hasProfile);


  // 2.1. Usuário AUTENTICADO, mas SEM perfil
  if (!hasProfile) {
    console.log('State: AUTHENTICATED, NO PROFILE');
    if (currentPath !== profileSetupPath) {
      console.log('Action: Redirecting to ' + profileSetupPath + ' (missing profile, from any path).');
      const redirectUrl = new URL(profileSetupPath, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    console.log('Action: Allowing access to profile setup page (user has no profile).');
    return res;
  }
  // 2.2. Usuário AUTENTICADO E COM perfil
  else {
    console.log('State: AUTHENTICATED, HAS PROFILE');
    if (currentPath === profileSetupPath) {
      console.log('Action: Redirecting from setup to /conta (profile complete).');
      const redirectUrl = new URL('/conta', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    if(['/login', '/login/registrar'].includes(currentPath)) {
      const redirectUrl = new URL('/conta', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    console.log('Action: Allowing access to protected path (profile complete).');
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};