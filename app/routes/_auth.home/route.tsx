import Placeholder from '~/assets/camera-placeholder.svg';
import type { Route } from './+types/route';

interface Pet {
  id: string,
  user_id: string,
  created_at?: Date,
  name: string,
  age: number,
  breed: string,
  type: string,
  avatar_path: string
}

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  // Retrieve pets from database
  const { data, error } = await supabase.from('pets').select();
  // Retrieve avatar for each pet
  const pets = data?.map((pet) => {
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(`${pet.avatar_path}`);
    return {
      ...pet,
      avatar_path: data.publicUrl ?? null
    }
  })
  console.log('What are the pets', pets);
  return { pets, error };
}

export default function Home({ loaderData }: { loaderData: { pets: Pet[], error: unknown }}) {
  const { pets, error } = loaderData
  console.log('There is an error', error);

  return (
    <>
      <h1>Home</h1>
      {/* Intro */}
      <div className="flex flex-col gap-8">
        <section className="card bg-base-100 card-md shadow-sm">
          <div className="card-body">
            <h2 className="card-title font-semibold text-lg">Welcome back, User</h2>
            <p>Here's what's happening with your pets today</p>
          </div>
        </section>
        {/* Quick Stats */}
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Quick Stats</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
            <div className="card bg-base-100 card-sm min-w-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title font-normal text-sm ">Pets</h3>
                <p className="text-lg font-medium self-center">{pets.length}</p>
              </div>
            </div>
            <div className="card bg-base-100 card-sm min-w-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title font-normal text-sm">Appts</h3>
                <p className="text-lg font-medium self-center">2</p>
              </div>
            </div>
            <div className="card bg-base-100 card-sm min-w-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title font-normal text-sm">Msgs</h3>
                <p className="text-lg font-medium self-center">5</p>
              </div>
            </div>
          </div>
        </section>
        {/* Your Pets */}
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Your Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            { pets.length > 0 ? (
              pets.map((pet) => {
                return (
                <div className="card card-side bg-base-100 card-sm p-4 shadow-sm" key={pet.id}>
                  <div className="avatar w-24">
                    <div className="avatar aspect-square rounded-full">
                      <img 
                        className="rounded-full" 
                        src={pet.avatar_path} 
                        alt={pet.name} 
                      />
                    </div>
                  </div>
                  <div className="card-body gap-1 w-full">
                    <h3 className="card-title font-semibold text-normal">{pet.name}</h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs">{pet.breed}</p>
                      <p className="text-xs">{pet.age} years</p>
                    </div>
                  </div>
                </div>
                )
              })
            ) : (
              <div className="card card-side bg-base-100 card-sm p-4 shadow-sm">
                <div className="card-body gap-1 w-full">
                  <h3 className="card-title font-semibold text-normal">You have no pets!</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs">Add a pet to get started.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}