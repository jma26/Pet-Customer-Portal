import { useRef, useState, type ChangeEvent } from 'react';
import Placeholder from '~/assets/camera-placeholder.svg';

interface FileInputElement extends HTMLInputElement {
  files: FileList | null;
}

export default function AvatarUploader() {
  const fileInputRef = useRef<FileInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('What is the file', file);

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      }
      reader.readAsDataURL(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <>
      <input type="file" className="file-input" name="avatar" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/png/, image/jpeg, image/jpg" />

      {/* Avatar Display + Button */}
      <button className={`avatar aspect-square cursor-pointer duration-300 max-w-[50%] mx-auto p-2 ring-offset-base-300 ring-1 ring-offset-1 rounded-full transition-shadows w-full hover:ring-primary focus:ring-primary active:ring-primary ${imageSrc ? 'ring-primary/60' : 'ring-primary/30'}`} type="button" onClick={handleClick} aria-label={ imageSrc ? 'Change photo' : 'Upload photo'}>
        <img className="rounded-full" src={imageSrc || Placeholder } alt="Avatar" />
      </button>
      <p className="text-center text-sm">{ imageSrc ? 'Change photo' : 'Upload photo' }</p>
    </>
  )
}