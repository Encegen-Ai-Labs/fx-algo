import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";

export default function ResetPassword() {

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {

    if (!password || !confirm) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      await api.post("/auth/reset-password", {
        token,
        password
      });

      setDone(true);

    } catch {

      alert("Invalid or expired reset link");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0a0614] text-white px-4">

      <div className="bg-[#12061f] p-8 rounded-xl w-full max-w-md shadow-xl">

        {/* BACK BUTTON */}

        <div className="flex items-center text-sm text-gray-400 mb-4">

          <Link
            to="/login"
            className="flex items-center hover:text-yellow-400"
          >
            <ChevronLeft size={16} className="mr-1"/>
            Back to Login
          </Link>

        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h1>

        {done ? (

          <div className="text-center">

            <p className="text-green-400 mb-4">
              Password updated successfully
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

            {/* PASSWORD */}

            <div className="relative mb-4">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded bg-[#0e061a]"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

            {/* CONFIRM PASSWORD */}

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-[#0e061a]"
            />

            {/* RESET BUTTON */}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 disabled:opacity-60"
            >

              {loading ? "Updating..." : "Reset Password"}

            </button>

          </>

        )}

      </div>

    </div>

  );
}