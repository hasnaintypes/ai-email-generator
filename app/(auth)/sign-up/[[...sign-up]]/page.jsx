import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      fallbackRedirectUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
    />
  );
}
