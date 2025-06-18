"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { verifyCode } from "../api/service/api";

export default function TwoFactorForm() {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : "";

  useEffect(() => {
    if (!email) {
      setError("Email topilmadi. Ro‘yxatdan o‘ting.");
    }
  }, [email]);

  const handleChange = (val: string, idx: number) => {
    if (!/^[A-Za-z0-9]?$/.test(val)) return;
    const arr = [...code];
    arr[idx] = val.toUpperCase();
    setCode(arr);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const checkCode = async () => {
    const entered = code.join("");
    if (entered.length !== 6) {
      setError("6 xonali kodni to‘liq kiriting.");
      return;
    }

    if (!email) {
      setError("Email topilmadi.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await verifyCode({ email, code: entered });
      setSuccess("Tasdiqlandi!");
      setTimeout(() => router.push(`/user/${response.user.id}`), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Xatolik yuz berdi. Qayta urinib ko‘ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Emailga yuborilgan 6 xonali kodni kiriting
      </h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

      <div className="grid grid-cols-6 gap-3 mb-6">
        {code.map((ch, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            maxLength={1}
            value={ch}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            inputMode="text"
            className="h-20 w-full rounded-md bg-black/30 text-center text-xl border border-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white"
            disabled={loading}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={checkCode}
          disabled={loading}
          className={`flex-1 uppercase text-white h-12 rounded-xs ${
            loading
              ? "bg-gray-400"
              : "bg-black/80 border border-black/70 hover:bg-black"
          }`}
        >
          {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
        </button>
        <button
          onClick={() => setCode(new Array(6).fill(""))}
          disabled={loading}
          className="flex-1 uppercase text-gray-700 border border-gray-300 bg-white h-12 rounded-xs hover:bg-gray-50"
        >
          Tozalash
        </button>
      </div>
    </div>
  );
}
