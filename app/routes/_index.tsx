import { redirect, type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: claims, error } = await supabase.auth.getUser();

  if (!claims || error) {
    console.log('No session detected', claims);
    throw redirect('/login', { headers });
  }

  console.log('What is claims', claims);
    
  throw redirect('/home', { headers });
}