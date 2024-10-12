"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className="bg-blue-800 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-blue-900 flex justify-between">
      <div >
        Logged in as {session.user.name} {""}. 
        <button onClick={() => signOut()} className="bg-red-500 p-2 px-4 rounded-lg text-white">
         Sign Out
        </button>
      </div>
        <div className="flex bg-gray-300 gap-2 text-black pr-2 rounded-lg overflow-hidden">
        <Image src={session.user.image} alt="" width={50} height={50}/>
        {session.user.name}
        </div>
    </div>
  );
}
