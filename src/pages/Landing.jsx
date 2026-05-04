import { SignInButton } from "@clerk/react";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      
      {/* Glass Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center text-white">
        
        {/* Logo / Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          CHMS
        </h1>
        <p className="text-sm md:text-base text-white/80 mb-6">
          Manage payments, reports, and hostel life — all in one place.
        </p>

        {/* CTA */}
        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
          <button className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </SignInButton>

        {/* Footer */}
        <p className="mt-6 text-xs text-white/60">
          Secure login powered by Clerk
        </p>
      </div>
    </div>
  );
};

export default Landing;