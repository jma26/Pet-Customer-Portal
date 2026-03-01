import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadPetAvatar({
  supabase,
  file,
  userId,
  petId
}: {
  supabase: SupabaseClient,
  file: File,
  userId: string,
  petId: string
}) {
  const filePath = `${userId}/${petId}/avatar-${crypto.randomUUID()}`;
  const { error } = await supabase.storage.from('pet-photos').upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    console.log('What is the error', error);
    throw error;
  }

  return filePath;
}