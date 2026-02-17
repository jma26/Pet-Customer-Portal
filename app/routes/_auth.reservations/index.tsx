import type { Route } from "../_auth/+types/route";
import { Link, useLoaderData } from 'react-router';

interface Pet {
  id: string,
  user_id: string,
  created_at?: Date,
  name: string,
  age: number,
  breed: string,
  type: string
}

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase.from('pets').select();
  return { pets: data ?? [] , error };
}

export default function PetSelection() {
  const { pets, error } = useLoaderData<typeof loader>();
  console.log('What are the pets', pets);
  return (
    <>
    <h1>HElLO WORLD</h1>
      { pets.length> 0 ? (
        <form method="post" className="flex flex-col flex-1 my-8">
          <fieldset className="flex flex-col gap-4">
            <div className="flex flex-col flex-1 gap-4">
              {
                pets.map((pet: Pet) => {
                  return (
                    <label className="flex rounded-lg p-4 gap-4 items-center cursor-pointer active:bg-accent hover:bg-accent focus:bg-accent has-checked:bg-accent" key={pet.id}>
                      <input className="appearance-none font-semibold" type="radio" name="pet" value={pet.id}></input>
                      <div className="flex flex-col gap-1">
                        <h2 className="font-semibold">{ pet.name }</h2>
                        <span className="badge badge-ghost badge-sm">{ pet.type }</span>
                      </div>
                    </label>
                  )
                })
              }
            </div>
          </fieldset>
          <button className="btn btn-primary btn-block mt-auto mb-16" type="submit">Next</button>
        </form>
      ) : (
        <h2>You have no pets! <Link to="/pets">Add one now</Link></h2>
      )}
    </>
  );
}