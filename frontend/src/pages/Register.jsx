import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  /* ---------- VALIDATION ---------- */

  const validate = () => {

    let valid = true;

    setEmailError("");
    setPasswordError("");

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ characters with uppercase, lowercase and number"
      );
      valid = false;
    }

    return valid;
  };

  /* ---------- REGISTER ---------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {

      await api.post("/auth/register", {
        email,
        password
      });

      alert("Registered successfully. Please login.");
      navigate("/login");

    } catch (err) {

      alert(err.response?.data?.error || "Registration failed");

    } finally {

      setLoading(false);

    }
  };

  /* ---------- GOOGLE LOGIN ---------- */

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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0614] px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-[#12061f] p-8 rounded-xl w-full max-w-md text-white shadow-xl"
      >

        {/* BREADCRUMB */}

        <div className="flex items-center text-sm text-gray-400 mb-4">

          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>

          <ChevronRight size={16} className="mx-2" />

          <span className="text-white">Register</span>

        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        {/* GOOGLE SIGN IN */}

        <div className="mb-6 flex justify-center">

          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => alert("Google login failed")}
          />

        </div>

        <div className="text-center text-gray-400 mb-4">
          OR
        </div>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-[#0e061a]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && (
          <p className="text-red-400 text-sm mt-1">
            {emailError}
          </p>
        )}

        {/* PASSWORD */}

        <div className="relative mt-4">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-12 rounded bg-[#0e061a]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
           {showPassword ? <EyeOff size={18} color="black" /> : <Eye size={18} color="black" />}
          </button>

        </div>

        {passwordError && (
          <p className="text-red-400 text-sm mt-1">
            {passwordError}
          </p>
        )}

        {/* REGISTER BUTTON */}

        <button
          disabled={loading}
          className="w-full py-3 mt-6 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* LOGIN */}

        <div className="mt-6 text-center text-sm text-gray-400">

          Already registered?{" "}

          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Go to Login
          </span>

        </div>

      </form>

    </div>
  );
}