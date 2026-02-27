import type { Route } from "../_auth/+types/route";
import { Form, useFetcher } from 'react-router';
import AvatarUploader from "~/components/AvatarUploader";
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

export async function loader({ request }: Route.LoaderArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  const { data, error } = await supabase.from('pets').select();
  return { pets: data , error };
}

export async function action({ request }: Route.ActionArgs) {
  const { createSupabaseServerClient } = await import('~/lib/supabase.server');
  const { supabase } = createSupabaseServerClient(request);
  const petFields = ['name', 'age', 'breed', 'type'] as const;
  const formObj: Partial<Pet> = {};
  const formData = await request.formData();
  const avatarFile = formData.get('avatar');
  const hasAvatar = avatarFile instanceof File;

  // Build form object
  for (const key of petFields) {
    const value = formData.get(key);
    // formData.get(key) always returns a string of Blob according to MDN
    // Add error handling - FUTURE
    if (typeof value !== 'string') continue;
    // Edge case specifically for age - Transform to number to satisfy Supabase database specification
    if (key === 'age') formObj.age = Number(value);
    else formObj[key] = value;
  }

  console.log('This is the form object', formObj);
  console.log('What is the avatarFile', avatarFile);
  console.log('Do I have an avatar', hasAvatar);

  switch(request.method) {
    case 'POST': {
      const { data: pet, error } = await supabase.from('pets').insert(formObj).select();
      if (error) {
        console.error(error);
        throw error;
      }
      
      console.log('What is this pet object being returned', pet);
      console.log('What is userId', pet[0].user_id);

      if (hasAvatar) {
        // Upload to storage
        const { uploadPetAvatar } = await import ('~/lib/uploadAvatar.server');
        const filePath = await uploadPetAvatar({
          supabase,
          file: avatarFile,
          userId: pet[0].user_id,
          petId: pet[0].id
        });

        console.log('What is the filepath', filePath);

        // Update Pet table avatar_path column
        const { error } =  await supabase.from('pets').update({ avatar_path: filePath }).eq('id', pet[0].id);
        if (error) {
          console.error(error);
          throw error;
        }

        return { success: true }

      }

      // Status 201
      return { success: true }
    }

    case 'DELETE': {
      const id = formData.get('id');
      if (typeof id !== 'string') {
        console.error('Invalid ID for pet deletion');
        throw new Error('Invalid ID for pet deletion');
      }
      const { status, error } = await supabase.from('pets').delete().eq('id', id);
      if (error) {
        console.error(error);
        throw error;
      }
      // Status 204
      return { status }
    }

    case 'PUT': {
      const id = formData.get('id');
      if (typeof id !== 'string') {
        console.error('Invalid ID for pet update');
        throw new Error('Invalid ID for pet update');
      }

      const { data: pet, error } = await supabase.from('pets').update(formObj).eq('id', id).select();
      if (error) {
        console.error(error);
        throw error;
      }

      if (hasAvatar) {
        // Upload to storage
        const { uploadPetAvatar } = await import ('~/lib/uploadAvatar.server');
        const filePath = await uploadPetAvatar({
          supabase,
          file: avatarFile,
          userId: pet[0].user_id,
          petId: pet[0].id
        });

        console.log('What is the filepath', filePath);

        // Update Pet table avatar_path column
        const { error } =  await supabase.from('pets').update({ avatar_path: filePath }).eq('id', pet[0].id);
        if (error) {
          console.error(error);
          throw error;
        }

        return { success: true }

      }
      return { success: true }
    }
    
    default: {
      throw new Response('Method not allowed', { status: 405 });
    }
  }

}

export default function Pets({ loaderData }: { loaderData: { pets: Pet[], error: unknown } }) {
  const { pets, error } = loaderData;
  console.log('Any error', error);
  console.log('Okay, what is the data', pets);
  return (
    <>
      <div className="border-b flex justify-between items-center max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-medium text-3xl">My Pets</h1>
        <Modal
          triggerLabel="Add Pet"
          title="Add New Pet"
          description="Let us know more about your furry friend"
        >
          {(fetcher) => (
            <PetForm fetcher={fetcher} submitLabel="Add Pet" />
          )}
        </Modal>
      </div>
      {
        pets.length > 0 ? (
          pets.map((pet) => {
            return (
              <div className="border-b flex flex-col gap-8 px-4 py-8" key={pet.id}>
                <div className="flex flex-col gap-4">
                  <h2>{ pet.name }</h2>
                  <div className="flex gap-2">
                    <span className="badge badge-soft badge-sm">{ pet.breed }</span>
                    <span className="badge badge-soft badge-sm">{`${pet.age ?? 'N/A'} YEARS OLD`}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Modal
                    triggerLabel="EDIT"
                    title="Edit Pet"
                  >
                    {(fetcher) => (
                      <PetForm fetcher={fetcher} pet={pet} method="PUT" submitLabel="Save Changes" />
                    )}
                  </Modal>
                  <Form method="DELETE">
                    <input type="hidden" name="id" value={pet.id} />
                    <button className="btn btn-error">DELETE</button>
                  </Form>
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

type PetFormProps = {
  fetcher: ReturnType<typeof useFetcher>
  pet?: Pet
  method?: 'POST' | 'PUT'
  submitLabel: string
}

function PetForm({ fetcher, pet, method = 'POST', submitLabel }: PetFormProps) {
  return (
    <fetcher.Form method={method} encType="multipart/form-data" className="flex flex-col gap-4 mt-4">
      {pet && <input type="hidden" name="id" value={pet.id} />}

      <div className="flex flex-col gap-1">
        <AvatarUploader />
      </div>

      <div className="flex flex-col gap-1">
        <label className="label" htmlFor="name">Pet Name</label>
        <input
          name="name"
          className="input w-full"
          defaultValue={pet?.name}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="label" htmlFor="age">Pet Age</label>
        <input
          type="number"
          name="age"
          className="input w-full"
          defaultValue={pet?.age}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="label" htmlFor="breed">Pet Breed</label>
        <input
          name="breed"
          className="input w-full"
          defaultValue={pet?.breed}
          required
        />
      </div>
      <div className="flex flex-col gap-1 join">
        <label className="label" htmlFor="type">Pet Type</label>
        <div className="flex w-full">
          {['Dog', 'Cat'].map((type) => (
            <input
              key={type}
              type="radio"
              name="type"
              value={type}
              defaultChecked={pet?.type === type}
              className="join-item btn flex-1"
              aria-label={type}
            />
          ))}
        </div>
      </div>

      <button className="btn btn-primary mt-4 w-full">
        {submitLabel}
      </button>
    </fetcher.Form>
  )
}