import SignupForm from "./_components/sign-up-form";

export default function SignupPage({ searchParams }: { searchParams?: { ref?: string } }) {
  const referralCode = typeof searchParams?.ref === "string" ? searchParams.ref : undefined;
  return <SignupForm referralCode={referralCode} />;
}
