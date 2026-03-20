import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";
import SideBar from '~/components/SideBar';

export async function loader({ request }: LoaderFunctionArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: claims, error } = await supabase.auth.getClaims();

  if (!claims || error) {
    console.log('No session detected', claims);
    throw redirect('/login', { headers });
  }

  return { user: claims };
}

export default function AuthLayout() {
  return (
    <main>
      <SideBar />
      <Outlet />
    </main>
  )
}