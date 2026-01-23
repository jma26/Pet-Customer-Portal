import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase, headers } = await createSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('No user, redirecting to login', user);
    throw redirect('/login', { headers });
  }
}

export default function AuthLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}