import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOGIN ---------------- */
  const login = async ({ token, role }) => {

    const authData = { token, role };

    localStorage.setItem("auth", JSON.stringify(authData));

    setAuth(authData);

    try {
      await fetchMe();
    } catch (err) {
      console.warn("User fetch failed after login");
    }

  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    setUser(null);
  };

  /* ---------------- FETCH CURRENT USER ---------------- */
  const fetchMe = async () => {

    try {

      const res = await api.get("/auth/me");

      setUser(res.data);

    } catch (err) {

      if (err.response?.status === 401) {

        console.log("Session expired");

        logout();

      } else {

        console.log("Fetch user failed but keeping session");

      }

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- AUTO LOGIN AFTER REFRESH ---------------- */
  useEffect(() => {

    if (auth?.token) {

      fetchMe();

    } else {

      setLoading(false);

    }

  }, [auth]);

  /* ---------------- HELPERS ---------------- */

  // only check token
  const isLoggedIn = !!auth?.token;

  const isAdmin = user?.role === "superadmin";

  return (

    <AuthContext.Provider
      value={{
        auth,
        user,
        login,
        logout,
        isLoggedIn,
        isAdmin,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export const useAuth = () => useContext(AuthContext);