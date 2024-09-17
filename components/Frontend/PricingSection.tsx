import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInButton, useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function PricingSection() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  const handleCheckout = async (priceId: string, firestoreDocId: string) => {
    if (priceId === "FREE") {
      router.push("/dashboard");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firestoreDocId, priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate checkout");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const handleClick = (priceId: string, firestoreDocId: string) => {
    if (!isSignedIn) {
      setRedirect(true); // Trigger sign-in redirect for non-authenticated users
    } else {
      handleCheckout(priceId, firestoreDocId);
    }
  };

  if (redirect) {
    return <RedirectToSignIn redirectUrl={window.location.href} />;
  }

  return (
    <div
      className="bg-white p-4 md:p-8 py-6 md:py-12 w-full dark:bg-gray-950 max-w-6xl mx-auto"
      data-aos="fade-up"
      data-aos-offset="200"
    >
      <div className="mx-auto max-w-7xl px-0">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-600">
            Prețuri
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Planuri pentru fiecare restaurant
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Alegeți planul potrivit pentru afacerea dumneavoastră și începeți să
          transformați experiența clienților dumneavoastră astăzi.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {[
            {
              name: "Gratis",
              id: "tier-free",
              priceMonthly: "0 lei",
              priceId: "FREE",
              description:
                "Perfect pentru a începe și a testa serviciul nostru, cu reclame în meniu.",
              features: [
                "Produse nelimitate în meniu",
                "Categorii nelimitate",
                "Mese nelimitate",
                "Generare coduri QR nelimitate",
                "Actualizări de meniu instante",
                "Suport 24/7",
                "Reclame în meniu",
              ],
            },
            {
              name: "Basic",
              id: "tier-basic",
              priceMonthly: "99 lei",
              priceRecurrance: "lună",
              priceId: "price_1PzICsLX5dxGMJYtRRuy64r2",
              description:
                "Ideal pentru restaurante mici care doresc o experiență fără reclame și funcționalități AI de bază.",
              features: [
                "Produse nelimitate în meniu",
                "Categorii nelimitate",
                "Mese nelimitate",
                "Generare coduri QR nelimitate",
                "Actualizări de meniu instante",
                "Suport 24/7 prioritar",
                "Fără reclame în meniu",
                "Poze de calitate înaltă",
                "Funcționalități AI",
              ],
            },
            {
              name: "Pro",
              id: "tier-pro",
              priceMonthly: "799 lei",
              priceRecurrance: "an",
              offer: "4 luni gratis",
              priceId: "price_1PzICsLX5dxGMJYti65UuOQ6",
              description:
                "Perfect pentru restaurante în creștere care au nevoie de suport prioritar, funcționalități AI și imagini de calitate superioară.",
              features: [
                "Produse nelimitate în meniu",
                "Categorii nelimitate",
                "Mese nelimitate",
                "Generare coduri QR nelimitate",
                "Actualizări de meniu instante",
                "Suport 24/7 prioritar",
                "Fără reclame în meniu",
                "Poze de calitate înaltă",
                "Funcționalități AI",
              ],
            },
          ].map((tier, i) => (
            <div
              key={tier.id}
              className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              data-aos="fade-right"
              data-aos-offset="200"
              data-aos-delay={i * 150}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">
                  {tier.name}{" "}
                  {tier.offer && (
                    <span className="text-sm px-4 py-2 bg-purple-500 text-white rounded-sm">
                      {tier.offer}
                    </span>
                  )}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {tier.priceMonthly}
                  </span>
                  {tier.name !== "Gratis" && (
                    <span className="text-base text-gray-500">
                      {" "}
                      / {tier.priceRecurrance}
                    </span>
                  )}
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className="h-6 w-5 flex-none text-purple-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <Button 
                    className={`mt-8 block w-full dark:bg-purple-200 ${tier.name !== 'Gratis' ? 'bg-purple-600 dark:bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                    >
                    Începeți {tier.name !== "Gratis" && 'cu'} {tier.name}
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  aria-describedby={tier.id}
                  className="mt-8 block w-full dark:bg-purple-200 bg-purple-600 dark:bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleClick(tier.priceId, tier.id)}
                >
                  Începeți cu {tier.name}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
