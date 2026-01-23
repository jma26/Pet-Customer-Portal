import { redirect } from "react-router";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase, headers } = await createSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('No user, redirecting to login', user);
    throw redirect('/login', { headers });
  } 
    
  throw redirect('/dashboard', { headers});
}