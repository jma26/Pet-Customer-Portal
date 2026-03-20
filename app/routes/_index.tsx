import { redirect } from "react-router";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: claims, error } = await supabase.auth.getUser();

  if (!claims || error) {
    console.log('No session detected', claims);
    throw redirect('/login', { headers });
  }

  console.log('What is claims', claims);
    
  throw redirect('/dashboard', { headers });
}