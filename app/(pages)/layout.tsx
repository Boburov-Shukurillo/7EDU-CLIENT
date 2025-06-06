"use client";

import Footer from "./pages_components/Footer";
import { CircleArrowLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { deleteUserProfilePic, getMe, getUserByEmail, updateUserProfilePic } from "../api/service/api";

interface User {
  id: string;
  name: string;
  profilePic?: string;
  courses: any[];
  email: string;
  phonenumber: string;
  coin: number;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const userData = await getMe();
        setUser(userData);

      } catch (error: any) {
        if (error?.response?.status === 401 || error.message === 'Token bekor qilindi') {
          router.push('/auth/signup');
        } else {
          console.error("Foydalanuvchi ma'lumotini olishda xatolik:", error);
        }
      }
    };

    fetchUser();
  }, [router]);


  const onProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const formData = new FormData();
      formData.append('profilePic', file);

      const updatedUser = await updateUserProfilePic(user.id, formData);

      setUser(updatedUser);

    } catch (error) {
      console.error('Rasmni yuklashda xatolik:', error);
    }
  };

  const handleDeleteProfilePic = async () => {
    if (!user) return;
    try {
      await deleteUserProfilePic(user.id);
      setUser({ ...user, profilePic: "" });
    } catch (error) {
      console.error("Rasmni o‘chirishda xatolik:", error);
    }
  };
  console.log(user);

  return (
    <>
      <button
        onClick={() => router.back()}
        aria-label="Back"
        type="button"
      >
        <CircleArrowLeft size={50} strokeWidth={1} className="mx-4 mt-4 text-white" />
      </button>

      {user && (
        <section className="container text-white pt-10">
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={onProfilePicClick}>
            {user.profilePic ? (
              <div className="relative w-20 h-20">
                <img
                  src={user.profilePic}
                  width={120}
                  height={120}
                  alt="user image"
                  className="rounded-full border-2 border-white/5 p-1 bg-gray-500 object-cover w-full h-full"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfilePic();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-300"
                >
                  <Trash width={16} height={16} />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <span className="text-4xl">{user.name[0].toUpperCase()}</span>
              </div>
            )}

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <span className="text-xs text-gray-300">{user.email}</span>
            </div>
          </div>
        </section>
      )}

      {children}
      <span className="pb-5 pt-6 inline-block"></span>
      <Footer />
    </>
  );
};

export default Layout;
