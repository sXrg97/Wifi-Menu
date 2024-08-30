import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="m-auto py-8">
      <h1 className="mb-4 text-center text-2xl font-semibold">Înregistrare - Wifi Menu</h1>
      <SignUp />
    </div>
  );
}