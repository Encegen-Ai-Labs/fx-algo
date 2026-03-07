import { useEffect, useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import api from "../api/axios";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/approve-payment/${id}`);
    alert("Payment approved");
    loadOrders();
  };

  const reject = async (id) => {
    await api.post(`/admin/reject-payment/${id}`);
    alert("Payment rejected");
    loadOrders();
  };

  /* -------- FILTER -------- */

  const filteredOrders = orders.filter((o) => {

    const name = `${o.first_name} ${o.last_name}`.toLowerCase();

    const searchMatch =
      name.includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search);

    const statusMatch =
      statusFilter === "" || o.payment_status === statusFilter;

    return searchMatch && statusMatch;
  });

  /* ---------------- UI ---------------- */

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-[#0a0614] text-white px-10 py-10">

        <h1 className="text-3xl font-bold mb-8">
          Admin Orders
        </h1>

        {/* SEARCH + FILTER */}

        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Search name / email / order id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-[#12061f] border border-gray-700 rounded w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#12061f] border border-gray-700 rounded"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="unpaid">Unpaid</option>
          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-700">

            <thead className="bg-[#12061f]">
              <tr>

                <th className="p-3 border">ID</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Payment Status</th>
                <th className="p-3 border">Screenshot</th>
                <th className="p-3 border">Action</th>
                <th className="p-3 border">Date</th>

              </tr>
            </thead>

            <tbody>

              {filteredOrders.map((o) => (

                <tr key={o.id} className="text-center">

                  <td className="p-2 border">
                    {o.id}
                  </td>

                  {/* USER CLICKABLE */}

                  <td
                    className="p-2 border w-[160px] cursor-pointer hover:text-yellow-400"
                    onClick={() => setSelectedOrder(o)}
                  >
                    <div className="font-semibold truncate">
                      {o.first_name} {o.last_name}
                    </div>

                    <div className="text-xs text-gray-400 truncate">
                      {o.email}
                    </div>
                  </td>

                  <td className="p-2 border text-yellow-400">
                    ₹{o.total}
                  </td>

                  <td className="p-2 border">
                    {o.payment_method}
                  </td>

                  <td className="p-2 border">

                    <span
                      className={`px-3 py-1 rounded
                      ${
                        o.payment_status === "paid"
                          ? "bg-green-600"
                          : o.payment_status === "pending_verification"
                          ? "bg-yellow-600"
                          : "bg-red-500"
                      }`}
                    >
                      {o.payment_status}
                    </span>

                  </td>

                  {/* SCREENSHOT */}

                  <td className="p-2 border">

                    {o.payment_proof ? (
                      <img
                        src={`http://127.0.0.1:5000/${o.payment_proof}`}
                        className="w-20 mx-auto rounded cursor-pointer hover:scale-110 transition"
                        alt="payment proof"
                        onClick={() =>
                          setPreview(`http://127.0.0.1:5000/${o.payment_proof}`)
                        }
                      />
                    ) : (
                      "-"
                    )}

                  </td>

                  {/* ACTION */}

                  <td className="p-2 border">

                    {o.payment_status === "pending_verification" && (

                      <div className="flex gap-2 justify-center">

                        <button
                          onClick={() => approve(o.id)}
                          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => reject(o.id)}
                          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>

                      </div>

                    )}

                  </td>

                  <td className="p-2 border">
                    {o.createdAt}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* IMAGE PREVIEW MODAL */}

      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            alt="preview"
          />
        </div>
      )}

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            className="bg-[#12061f] p-8 rounded-xl w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-2xl font-bold mb-6">
              Order Details
            </h2>

            <div className="space-y-2 text-gray-300">

              <p><b>Name:</b> {selectedOrder.first_name} {selectedOrder.last_name}</p>

              <p><b>Email:</b> {selectedOrder.email}</p>

              <p><b>Phone:</b> {selectedOrder.phone}</p>

              <p><b>Country:</b> {selectedOrder.country}</p>

              <p><b>Address:</b> {selectedOrder.address}</p>

              <p><b>Postal Code:</b> {selectedOrder.postal_code}</p>

              <p><b>Coupon:</b> {selectedOrder.coupon_code || "None"}</p>

              <p><b>Total:</b> ₹{selectedOrder.total}</p>

              <p><b>Payment Method:</b> {selectedOrder.payment_method}</p>

              <p><b>Status:</b> {selectedOrder.payment_status}</p>

              <p><b>Date:</b> {selectedOrder.createdAt}</p>

            </div>

            <button
              className="mt-6 bg-red-600 px-4 py-2 rounded"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </>
  );
}