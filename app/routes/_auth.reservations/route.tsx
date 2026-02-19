import type { Route } from "../_auth/+types/route";
import { useFetcher } from 'react-router';
import { useState } from "react";
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

interface Reservation {
  id: string,
  user_id: string,
  pet_id: string,
  created_at?: Date,
  name: string,
  date: Date,
  time: string,
  service: string
}

type PetReservation = Pet & { reservations: Reservation[] };

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase.from('pets').select(
    `id, name, age, breed, type,
    reservations (id, name, date, time, service, pet_id)
    `
  )
  return { pets: data , error };
}

export async function action({ request }: Route.ActionArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  const reservationFields = ['pet_id', 'name', 'date', 'time', 'service'] as const;
  const formObj: Partial<Reservation> = {};
  const formData = await request.formData();
    // Build form object
  for (const key of reservationFields) {
    const value = formData.get(key);
    // formData.get(key) always returns a string of Blob according to MDN
    // Add error handling - FUTURE
    if (typeof value !== 'string') continue;
    // Edge case specifically for date - Transform to Date to satisfy Supabase database specification
    else if (key === 'date') {
      formObj.date = new Date(value);
    } else {
      formObj[key] = value;
    }
  }

  console.log('This is the form object to be submitted', formObj);

  switch(request.method) {
    case 'POST': {
      const { status, error } = await supabase.from('reservations').insert(formObj).select();
      if (error) {
        console.error(error);
        throw error;
      }
      // Status 201
      return { status }
    }

    default: {
      throw new Response('Method Not Allowed', { status: 405 });
    }
  }
}

export default function Reservations({ loaderData }: { loaderData: { pets: PetReservation[], error: unknown } }) {
  const { pets, error } = loaderData;
  const reservations = pets?.flatMap(pet => pet.reservations);
  console.log('Okay, what is the pet data', pets);
  console.log('Okay, what is the reservation data', reservations);
  console.log('what is the error?', error);

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
  const [petId, setPetId] = useState(pet?.id || '');

  return (
    <fetcher.Form method={method} className="flex flex-col gap-4 mt-4">
      {<input type="hidden" name="pet_id" value={petId} />}

      <div className="flex flex-col gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select a pet</legend>
          <select className="select" defaultValue="Select a pet" name="name" onChange={(e) => setPetId(e.target.selectedOptions[0].getAttribute('data-id') || '')}>
            <option disabled>Select a pet</option>
            {pets && pets.length > 0 ? (
              pets.map((pet: Pet) => (
              <option key={pet.id} value={pet.name} data-id={pet.id}>{pet.name}</option>
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