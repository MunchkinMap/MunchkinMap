import { Suspense } from "react";
import { LoginForm } from "@/components/auth";

export const metadata = {
  title: "Sign In | MunchkinMap",
  description: "Sign in to your MunchkinMap account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
