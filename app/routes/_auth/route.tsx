import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";
import SideBar from '~/components/SideBar';
import Header from '~/components/Header';
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="drawer md:drawer-open flex-1">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <main className="p-4">
            <Outlet />
          </main>
        </div>
        <SideBar />
      </div>
    </div>
  )
}