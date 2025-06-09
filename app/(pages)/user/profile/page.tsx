"use client";

import { useEffect, useState } from "react";
import { Wallet, BookOpenCheck, Bell, Settings, Lock } from "lucide-react";
import { allCourse, getMe } from "@/app/api/service/api";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  courses: Course[];
  phonenumber: string;
  coins: number;
}

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    allCourse()
      .then((data) => setCourses(data))
      .catch((e) => console.error("allCourse error:", e));

    getMe()
      .then((data) => setUser(data))
      .catch((e) => console.error("getMe error:", e));
  }, []);

  const cardBaseStyle = "transition-all duration-300 ease-in-out transform hover:scale-[1.03] bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-md border border-white/10";

  return (
    <div className="container mx-auto pt-10 px-4 text-white">
      {user ? (
        <div className="flex flex-col gap-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className={cardBaseStyle}>
              <BookOpenCheck className="text-green-400 w-8 h-8" />
              <div>
                <p className="text-gray-300">Kurslar soni</p>
                <p className="font-semibold text-white">{user.courses.length} ta</p>
              </div>
            </div>

            <div className={cardBaseStyle}>
              <Bell className="text-blue-400 w-8 h-8" />
              <div>
                <p className="text-gray-300">Bildirishnomalar</p>
                <p className="font-semibold text-white">0 ta</p>
              </div>
            </div>

            <div className={cardBaseStyle}>
              <BookOpenCheck className="text-purple-400 w-8 h-8" />
              <div>
                <p className="text-gray-300">Umumiy kurslar</p>
                <p className="font-semibold text-white">{courses.length} ta</p>
              </div>
            </div>

            <Link href="settings" className={cardBaseStyle}>
              <Settings className="text-yellow-400 w-8 h-8" />
              <div>
                <p className="text-gray-300">Foydalanuvchi Sozlamalari</p>
                <p className="font-semibold text-white">Profilingizni tahrirlashingiz mumkin</p>
              </div>
            </Link>

            <Link href="settings/password" className={cardBaseStyle}>
              <Lock className="text-gray-400 w-8 h-8" />
              <div>
                <p className="text-gray-300">Parol Menejment</p>
                <p className="font-semibold text-white">Parolingizni o‘zgartirishingiz mumkin</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400">Yuklanmoqda...</p>
      )}
    </div>
  );
};

export default UserPage;
