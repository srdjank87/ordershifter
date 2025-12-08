"use client";

import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

export default function ButtonLogin({
  text = "Login",
}: {
  text?: string;
}) {
  const router = useRouter();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <button onClick={handleClick} className="btn btn-ghost btn-sm">
      {text}
    </button>
  );
}
