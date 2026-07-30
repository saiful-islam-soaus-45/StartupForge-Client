import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[85vh] items-center justify-center bg-slate-50/50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}