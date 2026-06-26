"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignUpPage from "./_component/signupPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RedirectToChat() {
  const router = useRouter();
  useEffect(() => {
    router.push("/chat");
  }, [router]);
  return null;
}

export default function Home() {
  return (
    <>
      <SignedOut>
        <SignUpPage />
      </SignedOut>
      <SignedIn>
        <RedirectToChat />
      </SignedIn>
    </>
  );
}