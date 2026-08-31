'use client'
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


function InputAvatar({ name = 'image', user }) {

    const [selectedAvatar, setSelectedAvatar] = useState(user?.image || '/images/avatar-80.png');
    const [avatarOpen, setAvatarOpen] = useState(false);

    const avatares = Array.from({ length: 80 }, (_, index) =>
        `/images/avatar-${String(index).padStart(2, '0')}.png`
    );


    return (
        <div className="relative flex flex-col gap-8">
            <button
                type="button"
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="cursor-pointer flex items-center justify-end p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Image
                        width={60}
                        height={60}
                        src={selectedAvatar}
                        alt="Avatar seleccionado"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <input type="hidden" name={name} value={selectedAvatar} />

            {avatarOpen && (
                <div className="absolute z-10 mt-20 right-0 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="grid grid-cols-5 @xl:grid-cols-10 place-items-center gap-2 p-3">
                        {avatares.map((avatar, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    setSelectedAvatar(avatar);
                                    setAvatarOpen(false);
                                }}
                                className={`cursor-pointer p-1 rounded-full hover:bg-indigo-50 transition-colors ${selectedAvatar === avatar ? 'ring-2 ring-indigo-500' : ''
                                    }`}
                            >
                                <Image
                                    width={60}
                                    height={60}
                                    src={avatar}
                                    alt={`Avatar ${index}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Image
                width={300}
                height={300}
                src={selectedAvatar}
                alt="Avatar seleccionado"
                className="self-center h-60 object-contain"
            />
        </div>
    );
}

export default InputAvatar;