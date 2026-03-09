import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {

      await api.post("/auth/forgot-password", {
        email
      });

      setSent(true);

    } catch {

      alert("Error sending reset email");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0a0614] text-white px-4">

      <div className="bg-[#12061f] p-8 rounded-xl w-full max-w-md shadow-xl">

        {/* BACK TO LOGIN */}

        <div className="flex items-center mb-4 text-gray-400 text-sm">

          <Link
            to="/login"
            className="flex items-center hover:text-yellow-400"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Login
          </Link>

        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        {sent ? (

          <div className="text-center">

            <p className="text-green-400 mb-4">
              Password reset link sent to your email.
            </p>

            <Link
              to="/login"
              className="text-yellow-400 hover:underline"
            >
              Go to Login
            </Link>

          </div>

        ) : (

          <>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-[#0e061a]"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 disabled:opacity-60"
            >

              {loading ? "Sending..." : "Send Reset Link"}

            </button>

          </>

        )}

      </div>

    </div>

  );
}