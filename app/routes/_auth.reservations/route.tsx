import type { Route } from "../_auth/+types/route";
import { useFetcher } from 'react-router';
import Modal from "~/components/Modal";

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
  return { pets: data , error };
}

export default function Reservations({ loaderData }: { loaderData: { pets: Pet[], error: unknown } }) {
  const { pets, error } = loaderData;
  console.log('Okay, what are the pets?', pets);
  return (
    <>
      <section className="flex flex-col min-h-screen mx-auto px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl">Reservations</h1>
          <p className="mb-16">You have no reservations.</p>
          <Modal
            triggerLabel="Book a reservation now!"
            title="Book a reservation"
            description="We look forward to seeing you soon!"
          >
            {(fetcher) => (
              <ReservationForm fetcher={fetcher} pets={pets} submitLabel="Submit Reservation" /> 
            )}
          </Modal>
        </div>
        <div className="flex flex-col flex-1 gap-4">
        </div>
      </section>
    </>
  )
}

type ReservationFormProps = {
  fetcher: ReturnType<typeof useFetcher>,
  pet?: Pet,
  pets?: Pet[],
  submitLabel: string
  method?: 'POST' | 'PUT'
}

function ReservationForm({ fetcher, pet, pets, method = "POST", submitLabel }: ReservationFormProps) {
  return (
    <fetcher.Form method={method} className="flex flex-col gap-4 mt-4">
      {pet && <input type="hidden" name="id" value={pet.id} />}

      <div className="flex flex-col gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select a pet</legend>
          <select className="select" defaultValue="Select a pet" name="pet">
            {pets && pets.length > 0 ? (
              pets.map((pet: Pet) => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))
            ) : (
              <option disabled>No pets available, add a pet first!</option>
            )}
          </select>
        </fieldset>
        <div className="flex flex-col gap-1">
          <label className="label" htmlFor="date">Reservation date</label>
          <input type="date" className="input" name="date" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label" htmlFor="time">Reservation time</label>
          <input type="time" className="input" name="time" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="label" htmlFor="service">Services</label>
        <select className="select" defaultValue="Select a service" name="service">
          <option value="daycare">Daycare</option>
          <option value="grooming">Grooming</option>
          <option value="boarding">Boarding</option>
        </select>
      </div>

      <button className="btn btn-primary mt-4 w-full">
        {submitLabel}
      </button>
    </fetcher.Form>
  )
}