import { type CookieOptions, type CookieMethodsServer, createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

export function createSupabaseServerClient(
  request: Request
) {
  const headers = new Headers();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  const cookies: CookieMethodsServer = {
    getAll() {
      const cookieHeader = request.headers.get('Cookie');
      if (!cookieHeader) {
        return null;
      }
      return parseCookieHeader(cookieHeader).map(({ name, value }) => ({
        name,
        value: value ?? ''
      }));
    },
    setAll(
      cookiesToSet: {
        name: string;
        value: string;
        options: CookieOptions;
      }[],
    ) {
      cookiesToSet.forEach(({ name, value, options }) => {
        headers.append(
          'Set-Cookie',
          serializeCookieHeader(name, value, options),
        );
      });
    },
  };
  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: cookies
    }
  );

  return { supabase, headers };
}