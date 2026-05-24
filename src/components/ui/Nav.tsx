"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";

type NavProps = {
  title: string;
};

export default function Nav({ title }: NavProps) {
  const { user } = useUser();

  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b border-zinc-200 bg-white">
      <div className="max-w-3xl mx-auto flex items-center justify-between w-full">
        <Link href="/" className="text-sm font-medium text-secondary hover:opacity-70 transition">{title}</Link>
        <div className="flex items-center gap-4">
          {user.name && user.email && (
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-secondary">
                {user.name}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
