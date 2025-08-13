
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

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

  const { data: { user } } = await supabase.auth.getUser();

  const profileSetupPath = '/login/registrar/criar-perfil';
  const protectedPaths = ['/conta'];

  const currentPath = req.nextUrl.pathname;

  if (!user) {
    if (protectedPaths.includes(currentPath) || currentPath === profileSetupPath) {
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }


  let hasProfile = false;
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profile) {
      hasProfile = true;
    }
  } catch (err) {
    console.error('Middleware network error checking profile:', err);
  }

  if (!hasProfile) {
    if (currentPath !== profileSetupPath) {
      const redirectUrl = new URL(profileSetupPath, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }
  else {
    if (currentPath === profileSetupPath) {
      const redirectUrl = new URL('/conta', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    if(['/login', '/login/registrar'].includes(currentPath)) {
      const redirectUrl = new URL('/conta', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};