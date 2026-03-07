import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Purchases() {

  const [orders, setOrders] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {

        const [ordersRes, licensesRes] = await Promise.all([
          api.get("/orders"),
          api.get("/licenses/my")
        ]);

        setOrders(ordersRes.data);
        setLicenses(licensesRes.data);

      } catch (err) {
        console.log("Failed to load purchases");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statusColor = (status) => {
    if (status === "paid") return "bg-green-600";
    if (status === "pending_verification") return "bg-yellow-600";
    return "bg-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0614] text-white flex items-center justify-center">
        Loading your purchases...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <h1 className="text-3xl font-bold mb-6">
          My Purchases
        </h1>

        {/* TABS */}

        <div className="flex gap-6 border-b border-gray-700 mb-8">
 <button
            onClick={() => setTab("orders")}
            className={`pb-3 text-sm font-semibold ${
              tab === "orders"
                ? "border-b-2 border-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setTab("licenses")}
            className={`pb-3 text-sm font-semibold ${
              tab === "licenses"
                ? "border-b-2 border-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          >
            My Bots
          </button>

         

        </div>

        {/* ---------------- LICENSES ---------------- */}

        {tab === "licenses" && (

          licenses.length === 0 ? (

            <p className="text-gray-400">
              No active licenses yet. Your bot will appear here after payment approval.
            </p>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {licenses.map((license) => {

                const imageUrl = license.product?.image
                  ? `${import.meta.env.VITE_PUBLIC_BASE_URL || ""}${license.product.image}`
                  : "/p1.png";

                const downloadUrl = license.product?.file_url
                  ? `${window.location.origin}${license.product.file_url}`
                  : null;

                return (

                  <div
                    key={license.license_key}
                    className="bg-[#1a1033] p-5 rounded-xl space-y-4 border border-[#2a1a50]"
                  >

                    {/* PRODUCT */}

                    <div className="flex gap-4 items-center">

                      <img
                        src={imageUrl}
                        className="w-16 h-16 object-contain bg-[#0e061a] rounded-lg p-2"
                      />

                      <div>

                        <h2 className="font-semibold">
                          {license.product?.title || "Unknown Product"}
                        </h2>

                        <p
                          className={`text-sm ${
                            license.status === "active"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {license.status}
                        </p>

                      </div>

                    </div>

                    {/* LICENSE */}

                    <div className="bg-[#0e061a] p-3 rounded-lg">

                      <p className="text-xs text-gray-400 mb-1">
                        License Key
                      </p>

                      <p className="font-mono text-green-400 text-sm break-all">
                        {license.license_key}
                      </p>

                    </div>

                    {/* DOWNLOAD */}

                    {downloadUrl && (

                      <a
                        href={downloadUrl}
                        target="_blank"
                        className="block text-center py-2 rounded-lg
                        bg-gradient-to-r from-yellow-400 to-orange-500
                        text-black font-semibold hover:scale-105 transition"
                      >
                        Download Bot
                      </a>

                    )}

                  </div>

                );

              })}

            </div>

          )

        )}

        {/* ---------------- ORDERS ---------------- */}

        {tab === "orders" && (

          orders.length === 0 ? (

            <p className="text-gray-400">
              You have not placed any orders yet.
            </p>

          ) : (

            <div className="bg-[#1a1033] rounded-xl overflow-hidden">

              <table className="w-full text-sm">

                <thead className="bg-[#120a28] text-gray-400">
                  <tr>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (

                   <tr
  key={order.id}
  onClick={() => navigate(`/orders/${order.id}`)}
  className="border-t border-[#2a1a50] cursor-pointer hover:bg-[#24154a] transition"
>
                      <td className="p-4 font-semibold">
                        #{order.id}
                      </td>

                      <td className="p-4">
                        ₹{order.total}
                      </td>

                      <td className="p-4 text-gray-400">
                        {order.createdAt}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${statusColor(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )

        )}

      </div>

    </div>
  );
}
