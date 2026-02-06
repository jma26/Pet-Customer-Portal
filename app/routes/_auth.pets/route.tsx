import { useRef } from "react";
import { type LoaderFunctionArgs } from 'react-router';

type PetProps =  {
  user_id: string,
  created_at: Date,
  name: string,
  age?: number,
  breed?: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = await createSupabaseServerClient(request);
  
  const { data, error } = await supabase.from('pets').select();
  return { pets: data , error };
}

export default function Pets({ loaderData }: { loaderData: { pets: PetProps[], error: unknown } }) {
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
          <p className="py-4">Let us know more about your furry friend</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}