export async function uploadPetAvatar({
  supabase,
  file,
  userId,
  petId
}: {
  supabase: any,
  file: File,
  userId: string,
  petId: string
}) {
  const filePath = `userid-${userId}/petid-${petId}/avatar`;
  const { error } = supabase.storage.from('pet-photos').upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    console.log('What is the error', error);
    throw error;
  }

  return filePath;
}