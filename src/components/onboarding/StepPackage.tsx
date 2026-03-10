import { ChevronLeft, ChevronRight, Mail, Heart, Trash2 } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import { useState } from "react";

const INSURERS: Record<string, { name: string; rating: string }> = {
  living: { name: "Centraal Beheer", rating: "4.5" },
  liability: { name: "Nationale Nederlanden", rating: "4.8" },
  travel: { name: "Anker Insurance", rating: "4.8" },
  car: { name: "FBTO", rating: "4.2" },
  legal: { name: "DAS", rating: "4.6" },
  accidents: { name: "Interpolis", rating: "4.3" },
  caravan: { name: "Kamernet", rating: "4.1" },
};

const BASE_PRICE: Record<string, number> = {
  living: 8.50,
  liability: 5.11,
  travel: 6.32,
  car: 45.00,
  legal: 12.40,
  accidents: 3.20,
  caravan: 9.80,
};

interface StepPackageProps {
  selectedInsurances: string[];
  email: string;
  emailSubmitted: boolean;
  onEmailChange: (email: string) => void;
  onEmailSubmit: () => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPackage = ({
  selectedInsurances,
  email,
  emailSubmitted,
  onEmailChange,
  onEmailSubmit,
  onNext,
  onBack,
}: StepPackageProps) => {
  const monthlyTotal = selectedInsurances.reduce(
    (sum, id) => sum + (BASE_PRICE[id] || 5),
    0
  );
  const discount = selectedInsurances.length >= 2 ? monthlyTotal * 0.12 : 0;
  const serviceFee = 1.44;
  const tax = 1.44;
  const finalTotal = monthlyTotal - discount + serviceFee + tax;
  const annualSavings = Math.round(discount * 12);

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-foreground border border-border rounded-lg px-4 py-2 mb-6 hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
        Your personal package
      </h1>

      {/* Email gate */}
      {!emailSubmitted ? (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Enter your email to view your package
          </p>
          <div className="flex gap-2 max-w-md">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <button
              onClick={onEmailSubmit}
              disabled={!email.includes("@")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              View
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-lg px-5 py-3 mb-8 max-w-md flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Your email address</p>
            <p className="text-sm font-medium text-foreground">{email}</p>
          </div>
          <button
            onClick={() => onEmailChange("")}
            className="text-sm font-medium text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-card transition-colors"
          >
            Edit
          </button>
        </div>
      )}

      {/* Insurance cards - blurred if no email */}
      <div className={`space-y-8 ${!emailSubmitted ? "blur-sm pointer-events-none select-none" : ""}`}>
        {selectedInsurances.map((id) => {
          const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
          const insurer = INSURERS[id];
          const price = BASE_PRICE[id] || 5;
          const originalPrice = (price * 1.2).toFixed(2);
          return (
            <div key={id}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-foreground">{ins.label}</h2>
                <div className="flex items-center gap-2">
                  <button className="text-sm font-medium text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                    Edit details
                  </button>
                  <button className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="border border-primary/30 rounded-xl p-5 bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-bold text-foreground">{insurer.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {insurer.rating} out of 5 ★ Trustpilot
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex gap-8">
                        <span>Insured amount</span>
                        <span className="text-foreground">€2,500,000</span>
                      </div>
                      <div className="flex gap-8">
                        <span>Excess</span>
                        <span className="text-foreground">€100</span>
                      </div>
                    </div>
                    <button className="text-xs font-medium text-foreground border border-border rounded px-2 py-1 mt-3 hover:bg-muted transition-colors">
                      View details
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">€{originalPrice}</span>
                      <span className="text-lg font-bold text-primary">€{price.toFixed(2)}</span>
                    </div>
                    <span className="inline-block mt-1 text-xs font-semibold bg-success text-success-foreground px-2 py-0.5 rounded">
                      Save 20%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Price breakdown */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">What you will pay later</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Here you can see exactly how your new total price is made up and what discount you are getting!
          </p>
          <div className="border border-border rounded-xl p-5 bg-card space-y-3">
            {selectedInsurances.map((id) => {
              const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
              return (
                <div key={id} className="flex justify-between text-sm">
                  <span className="text-foreground">{ins.label} (per month)</span>
                  <span className="text-foreground">€{(BASE_PRICE[id] || 5).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Package discount</span>
              <span className="text-foreground">€{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Service fees</span>
              <span className="text-foreground">€{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Insurance tax</span>
              <span className="text-foreground">€{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <button className="text-xs font-medium text-foreground border border-border rounded px-2 py-1 mb-3 hover:bg-muted transition-colors">
                Add promo code
              </button>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-lg font-bold text-foreground">Total</span>
                </div>
                <span className="text-2xl font-bold text-primary">€{finalTotal.toFixed(2)}</span>
              </div>
              {annualSavings > 0 && (
                <p className="text-sm font-medium text-success mt-1">
                  Annual savings: €{annualSavings}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button className="inline-flex items-center gap-2 border border-border rounded-full px-6 py-3 font-medium text-sm text-foreground hover:bg-muted transition-colors">
          <Heart className="w-4 h-4" />
          Save my package
        </button>
        <button
          onClick={onNext}
          disabled={!emailSubmitted}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg font-semibold text-base disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepPackage;
