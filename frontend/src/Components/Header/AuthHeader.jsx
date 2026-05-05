"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import logo from "@/public/Icons/logo-secondary.png";

function AuthHeader() {
  const router = useRouter();

  return (
    <header className="header">
      <div className="flex items-center gap-3 cursor-pointer">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          aria-label="Go back"
          className="inline-flex items-center justify-center"
        >
          <ArrowLeft size={24} color="#7e525c" />
        </button>
        <Link href="/" className="logo">
          {/* <Image
            src={logo}
            alt="logo"
            width={100}
            height={80}
            className="object-fit"
          /> */}
          AHM FRAGRANCES
        </Link>
      </div>
    </header>
  );
}

export default AuthHeader