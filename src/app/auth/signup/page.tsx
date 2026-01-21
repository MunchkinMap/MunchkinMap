import { Suspense } from "react";
import { SignupForm } from "@/components/auth";

export const metadata = {
  title: "Create Account | MunchkinMap",
  description: "Create your MunchkinMap account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
