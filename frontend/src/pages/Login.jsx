import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Eye, EyeOff, ChevronRight } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /* ---------------- NORMAL LOGIN ---------------- */

  const handleLogin = async () => {

    setLoading(true);

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login({
        token: res.data.token,
        role: res.data.role,
      });

      if (res.data.role === "superadmin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {

      console.error(err);
      alert("Invalid email or password");

    } finally {

      setLoading(false);

    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */

 const handleGoogle = async (credentialResponse) => {

  const decoded = jwtDecode(credentialResponse.credential);

  console.log("Google decoded:", decoded);

  try {

    const res = await api.post("/auth/google-login", {
      email: decoded.email,
      name: decoded.name,
      google_id: decoded.sub,
    });

    console.log("Backend response:", res.data);

    login({
      token: res.data.token,
      role: res.data.role,
    });

    navigate("/", { replace: true });

  } catch (err) {

    console.log(err);
    alert("Google login failed");

  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0614] text-white px-4">

      <div className="bg-[#12061f] p-8 rounded-xl w-full max-w-md shadow-xl">

        {/* BREADCRUMB */}

        <div className="flex items-center text-sm text-gray-400 mb-4">

          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>

          <ChevronRight size={16} className="mx-2" />

          <span className="text-white">Login</span>

        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* GOOGLE LOGIN */}

        <div className="flex justify-center mb-6">

          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => alert("Google Login Failed")}
          />

        </div>

        <div className="text-center text-gray-400 mb-4">
          OR
        </div>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-[#0e061a]"
        />

        {/* PASSWORD */}

        <div className="relative mb-6">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 rounded bg-[#0e061a]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 "
          >
            {showPassword ? <EyeOff size={18} color="black" /> : <Eye size={18} color="black" />}
          </button>

        </div>

        {/* LOGIN BUTTON */}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER */}

        <div className="mt-6 text-center text-sm text-gray-400">

          Don’t have an account?{" "}

          <span
            onClick={() => navigate("/register")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Register

          </span>

        </div>

      </div>

    </div>
  );
}