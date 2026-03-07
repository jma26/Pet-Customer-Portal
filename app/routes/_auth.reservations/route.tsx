import type { Route } from "../_auth/+types/route";
import { Form, useFetcher } from 'react-router';
import { useEffect, useRef, useState } from "react";
import Modal from "~/components/Modal";

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
  const { data, error } = await supabase.from('pets').select(
    `id, name, age, breed, type, avatar_path,
    reservations (id, name, date, time, service, pet_id)
    `
  )

  const pets = data?.map((pet) => {
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(`${pet.avatar_path}`);
    return {
      ...pet,
      avatar_path: data.publicUrl ?? null
    }
  })
  return { pets, error };
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
      return { success: true }
    }
    
    case 'DELETE': {
      const id = formData.get('id');
      if (typeof id !== 'string') {
        console.error('Invalid ID for pet deletion');
        throw new Error('Invalid ID for reservation deletion');
      }
      const { status, error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) {
        console.error(error);
        throw error;
      }
      return { success: true }
    }

    case 'PUT': {
      const id = formData.get('id');
      if (typeof id !== 'string') {
        console.error('Invalid ID for reservation update');
        throw new Error('Invalid ID for reservation update');
      }
      const { status, error } = await supabase.from('reservations').update(formObj).eq('id', id);
      if (error) {
        console.error(error);
        throw error;
      }
      return { success: true }
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
      <section className="flex flex-col min-h-screen mx-auto px-4">
        <div className="flex flex-col gap-1">
          <div className="border-b flex flex-wrap gap-4 justify-between items-center py-8">
            <h1 className="font-medium text-3xl">Reservations</h1>
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
          {
            pets.length > 0 ? (
              pets.map((pet) => {
                if (pet.reservations.length > 0) {
                  const reservations = pet.reservations
                  return reservations.map((reservation) => {
                    return (
                      <div className="border-b flex flex-col gap-8 px-4 py-8" key={reservation.id}>
                        <div className="flex gap-8 items-center">
                          <div className="avatar">
                            <div className="w-40 rounded-full">
                              <img src={ pet.avatar_path } alt={ pet.name } />
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <h2>{ reservation.name }</h2>
                            <div className="flex flex-col gap-2">
                              <p>Service: { reservation.service }</p>
                              <p>Date: { new Date(reservation.date).toLocaleDateString() }</p>
                              <p>Time: { reservation.time }</p>
                            </div>
                            <div className="flex gap-2">
                              <Modal
                                triggerLabel="EDIT"
                                title="Edit Reservation"
                              >
                                {(fetcher) => (
                                  <ReservationForm fetcher={fetcher} pets={pets} reservation={reservation} method="PUT" submitLabel="Save Changes" />
                                )}
                              </Modal>
                              <Form method="DELETE">
                                <input type="hidden" name="id" value={reservation.id} />
                                <button className="btn btn-error">DELETE</button>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                return []
              })
            ) : (
              <p className="mb-16">You have no reservations.</p>
            )
          }
        </div>
        <div className="flex flex-col flex-1 gap-4">
        </div>
      </section>
    </>
  )
}

type ReservationFormProps = {
  fetcher: ReturnType<typeof useFetcher>,
  pets?: Pet[],
  reservation?: Reservation,
  submitLabel: string
  method?: 'POST' | 'PUT'
}

function ReservationForm({ fetcher, pets, reservation, method = "POST", submitLabel }: ReservationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [petId, setPetId] = useState(reservation?.pet_id || '');

  useEffect(() => {
    if (fetcher.state === 'idle' && (fetcher.data as { success?: boolean })?.success) {
      formRef.current?.reset();
    }
  },  [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form 
      ref={formRef}
      method={method} 
      className="flex flex-col gap-4 mt-4"
    >
      {<input type="hidden" name="pet_id" value={petId} />}
      {<input type="hidden" name="id" value={reservation?.id} />}

      <div className="flex flex-col gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select a pet</legend>
          <select className="select" defaultValue={reservation?.name || "Select a pet"} name="name" onChange={(e) => setPetId(e.target.selectedOptions[0].getAttribute('data-id') || '')}>
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
          <input type="date" className="input" name="date" defaultValue={reservation?.date ? new Date(reservation.date).toISOString().split('T')[0] : ''} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label" htmlFor="time">Reservation time</label>
          <input type="time" className="input" name="time" defaultValue={reservation?.time} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="label" htmlFor="service">Services</label>
        <select className="select" defaultValue={reservation?.service || "Select a service"} name="service">
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