import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { Link } from "react-router-dom";
import api from "../../api/axios";

/* ===== STAT CARD ===== */
function StatCard({ title, value }) {
  return (
    <div className="bg-[#1a1033] p-6 rounded-xl text-center shadow-md">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

/* ===== ACTION CARD ===== */
function ActionCard({ title, link }) {
  return (
    <Link
      to={link}
      className="
        bg-gradient-to-r from-purple-700 to-indigo-700
        p-6 rounded-xl text-center font-bold
        hover:scale-105 transition block
      "
    >
      {title}
    </Link>
  );
}

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ===== LOAD STATS ===== */

  const loadStats = async () => {

    try {

      const res = await api.get("/admin/stats");

      setStats(res.data);

    } catch (err) {

      console.error("Failed to load dashboard stats", err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <AdminNavbar />

      <div className="p-10 text-white bg-[#0a0614] min-h-screen">

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {/* ===== STATS ===== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Total Products"
            value={loading ? "..." : stats.products}
          />

          <StatCard
            title="Orders"
            value={loading ? "..." : stats.orders}
          />

          <StatCard
            title="Revenue"
            value={loading ? "..." : `$${stats.revenue}`}
          />

          <StatCard
            title="Users"
            value={loading ? "..." : stats.users}
          />

        </div>

        {/* ===== ACTIONS ===== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-12">

          <ActionCard title="➕ Manage Products" link="/admin/products" />

          <ActionCard title="📦 View Orders" link="/admin/orders" />

          <ActionCard title="⚙️ Website Settings" link="/admin/settings" />

          <ActionCard title="🎥 Testimonials" link="/admin/testimonials" />

          <ActionCard title="👤 Users" link="/admin/users" />

        </div>

      </div>
    </>
  );
}