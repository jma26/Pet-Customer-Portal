import type { Route } from "../_auth/+types/route";
import { useRef } from "react";
import { Form } from 'react-router';

interface Pet {
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

export async function action({ request }: Route.ActionArgs) {
  const petFields = ['name', 'age', 'breed', 'type'] as const;
  const formObj: Partial<Pet> = {};
  const formData = await request.formData();

  for (const key of petFields) {
    console.log('What is the key', key);
    const value = formData.get(key);

    // formData.get(key) always returns a string of Blob according to MDN
    // Add error handling - FUTURE
    if (typeof value !== 'string') continue;

    // Edge case specifically for age - Transform to number to satisfy Supabase database specification
    if (key === 'age') formObj.age = Number(value);
    else formObj[key] = value;
  }

  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase.from('pets').insert(formObj);

  if (error) {
    console.error(error);
    throw error;
  }

  return { pet: data}
}

export default function Pets({ loaderData }: { loaderData: { pets: Pet[], error: unknown } }) {
  const { pets, error } = loaderData;
  console.log('Any error', error);
  console.log('Okay, what is the data', pets);
  return (
    <>
      <div className="border-b flex justify-between items-center max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-medium text-3xl">My Pets</h1>
        <ModalTrigger label="Add Pet"/>
      </div>
      {
        pets.length > 0 ? (
          pets.map((pet) => {
            return (
              <div className="border-b flex flex-col gap-4 px-4 py-8" key={pet.name}>
                <h2>{ pet.name }</h2>
                <div className="flex gap-2">
                  <span className="badge badge-soft badge-sm">{ pet.breed }</span>
                  <span className="badge badge-soft badge-sm">{ pet.age ?? 'Unknown age' }</span>
                </div>
              </div>
            )  
          })
        ) : (
          <div className="flex flex-col gap-4 px-4 py-8">
            <h2>You have no pets!</h2>
          </div>
        )
      }
    </>
  )
};

type ModalTriggerProps = {
  label: string;
};

function ModalTrigger({ label }: ModalTriggerProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="btn btn-primary" onClick={() => modalRef.current?.showModal()}>{ label }</button>
      <dialog id="petModal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Pet</h3>
          <p className="py-2">Let us know more about your furry friend</p>
          <Form className="flex flex-col gap-4 mt-4" method="POST">
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="name">Pet Name</label>
              <input className="input w-full" type="text" placeholder="Pet name" id="name" name="name" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="age">Pet Age</label>
              <input className="input w-full" type="number" placeholder="Pet age" id="age" name="age" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="breed">Pet Breed</label>
              <input className="input w-full" type="text" placeholder="Pet breed" id="breed" name="breed" required />
            </div>
            <div className="flex flex-col gap-1 join">
              <label className="label" htmlFor="type">Pet Type</label>
              <div className="w-full">
                <input type="radio" name="type" className="join-item btn" id="type" aria-label="Dog" value="Dog" defaultChecked />
                <input type="radio" name="type" className="join-item btn" id="type" aria-label="Cat" value="Cat" />
              </div>
            </div>
            <button className="btn btn-primary mt-4 w-full">Add Pet</button>
          </Form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}