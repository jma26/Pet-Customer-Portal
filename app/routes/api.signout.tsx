import { redirect, type ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from '~/lib/supabase.server';

export async function loader() {
  throw new Response('Method Not Allowed', { status: 405 });
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  await supabase.auth.signOut();
  return redirect('/login', { headers });
}