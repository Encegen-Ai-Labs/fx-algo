import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use((config) => {
  try {
    const auth = localStorage.getItem("auth");

    if (auth) {
      const parsed = JSON.parse(auth);

      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (err) {
    console.warn("Invalid auth in localStorage");
    localStorage.removeItem("auth");
  }

  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {
      const status = error.response.status;

      // 🔥 Auto logout on 401
      if (status === 401) {
        console.log("Session expired. Logging out...");

        localStorage.removeItem("auth");

        // redirect safely
        window.location.href = "/login";
      }

      // Optional: handle server crash
      if (status === 500) {
        console.error("Server error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
