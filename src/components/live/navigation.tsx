'use client';

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

const ITEMS = [{
  name: "user",
  requiresUser: true
}];

const Navigation = () => {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>()
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const retrieveUser = async () => {
      const result = (await supabase.auth.getUser()).data.user;
      setUser(result)
      setLoaded(true)
      return result
    }
    retrieveUser()
  }, [])

  const signOut = () => {
    supabase.auth.signOut().then(() => setUser(null))
  }

  console.log(!loaded, !user)
  return (
    <div className="flex justify-between items-center w-full sticky top-0 p-4 shadow-md z-50 bg-white/80 backdrop-blur-lg">
      {/* Logo */}
      <Link href="/" className="text-2xl font-semibold text-black">
        Auto-Auto
      </Link>
      <div className="flex gap-x-6 items-center">
        {ITEMS.filter(item => {
          if (item.requiresUser && !user) {
            return false;
          }
          return true;
        }).map((item) => (
          <Link
            key={item.name}
            href={`/${item.name}`}
            className="relative text-black text-lg font-medium group"
          >
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
        {loaded && (!user ? <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
          className="px-4 py-2 bg-gradient-to-br from-orange-300 to-orange-700 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        >
          Join Us
        </button> : <button
          onClick={signOut}
          className="px-4 py-2 bg-gradient-to-br from-orange-300 to-orange-700 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        >
          Sign Out
        </button>)}
      </div>
    </div>
  );
};

export default Navigation;