import Placeholder from '~/assets/camera-placeholder.svg';
import CatPlaceholder from '~/assets/cat-placeholder.png';
import DogPlaceholder from '~/assets/dog-placeholder.png';
import { useRouteLoaderData } from 'react-router';
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

interface Reservation {
  id: string,
  user_id: string,
  pet_id: string,
  created_at?: Date,
  name: string,
  date: Date
  time: string,
  service: string
}

type PetReservation = Pet & { reservations: Reservation[] };

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);

  const { data, error } = await supabase.from("pets").select(`
    id, name, age, breed, type, avatar_path, 
    reservations (id, name, date, time, service, pet_id)
    `
  );

  // Retrieve avatar for each pet
  const pets = data?.map((pet) => {
    return {
      ...pet,
      avatar_path: pet.avatar_path ? supabase.storage.from('pet-photos').getPublicUrl(`${pet.avatar_path}`).data.publicUrl : null
    }
  })

  return { pets, error };
  
}

export default function Home({ loaderData }: { loaderData: { pets: PetReservation[], error: unknown }}) {
  const { pets, error } = loaderData
  const { data } = useRouteLoaderData('routes/_auth');
  const user = data?.claims.user_metadata;
  const reservations = pets.flatMap((pet) => {
    return (
      pet.reservations.map((reservation) => ({
        ...reservation
      }))
    )
  })
  console.log('What is this', user);
  console.log('There is an error', error);
  console.log('What is the data', pets);
  console.log('What are the reservations', reservations);

  return (
    <>
      <h1>Home</h1>
      {/* Intro */}
      <div className="flex flex-col gap-8">
        <section className="card bg-base-100 card-md shadow-sm">
          <div className="card-body">
            <h2 className="card-title font-semibold text-lg">Welcome back {user?.first_name}!</h2>
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
                        src={ pet.avatar_path !== null ? pet.avatar_path : (pet.type === 'Cat' ? CatPlaceholder : DogPlaceholder) }
                        alt={pet.name} 
                      />
                    </div>
                  </div>
                  <div className="card-body gap-1 w-full">
                    <h3 className="card-title font-semibold text-normal">{pet.name}</h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">{pet.breed}</p>
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
        {/* Upcoming Reservations */}
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Upcoming Reservations</h2>
          <div className="grid grid-cols-1 gap-4">
            { reservations.length > 0 ? (
              reservations.map((reservation) => {
                const [year, month, day] = reservation.date.toString().split('-').map(Number);
                const [hours, minutes, seconds] = reservation.time.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const hours12 = hours % 12 || 12;

                return (
                  <div className="card card-side bg-base-100 card-sm gap-4 p-4 shadow-sm" key={reservation.id}>
                    <div className="bg-base-200 flex flex-col p-4 items-center justify-center">
                        <span className="text-normal">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2000, month - 1))}</span>
                        <span className="font-bold leading-none text-xl">{day < 10 ? `0${day}` : `${day}`}</span>
                    </div>
                    <div className="card-body gap-1 w-full">
                      <h3 className="card-title capitalize font-semibold text-normal">{reservation.service} - {reservation.name}</h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm">{`${hours12}:${String(minutes).padStart(2, "0")} ${period}`}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="card card-side bg-base-100 card-sm p-4 shadow-sm">
                <div className="card-body gap-1 w-full">
                  <h3 className="card-title font-semibold text-normal">You have no upcoming reservations!</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs">Add a reservation to get started.</p>
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