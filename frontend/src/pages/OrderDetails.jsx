import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderDetails() {

  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => console.log("Failed to load order"));
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0614] text-white flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  const imageUrl = order.product?.image
    ? `${window.location.origin}${order.product.image}`
    : "/p1.png";

  return (

    <div className="min-h-screen bg-[#0a0614] text-white p-8">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            Order #{order.id}
          </h1>

          <span
            className={`px-4 py-2 rounded text-sm font-semibold
            ${order.payment_status === "paid"
              ? "bg-green-600"
              : "bg-yellow-600"
            }`}
          >
            {order.payment_status}
          </span>

        </div>

        {/* PRODUCT CARD */}

        <div className="bg-[#1a1033] rounded-xl p-6 flex gap-6 items-center">

          <img
            src={imageUrl}
            className="w-24 h-24 object-contain bg-[#0e061a] rounded-lg p-2"
          />

          <div>

            <h2 className="text-xl font-semibold">
              {order.product?.title || "Product"}
            </h2>

            <p className="text-gray-400 text-sm">
              Quantity: {order.quantity}
            </p>

          </div>

        </div>

        {/* GRID SECTION */}

        <div className="grid md:grid-cols-2 gap-8">

          {/* PAYMENT DETAILS */}

          <div className="bg-[#1a1033] p-6 rounded-xl space-y-4">

            <h2 className="text-lg font-semibold">
              Payment Details
            </h2>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price</span>
              <span>${order.price}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Paid</span>
              <span className="font-semibold">
                ${order.total}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Method</span>
              <span>{order.payment_method}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date</span>
              <span>{order.createdAt}</span>
            </div>

          </div>

          {/* BILLING DETAILS */}

          <div className="bg-[#1a1033] p-6 rounded-xl space-y-4">

            <h2 className="text-lg font-semibold">
              Billing Details
            </h2>

          <p className="text-sm">
  {order.billing?.first_name} {order.billing?.last_name}
</p>

<p className="text-sm text-gray-400">
  {order.billing?.email || "Not provided"}
</p>

<p className="text-sm text-gray-400">
  {order.billing?.phone || "Not provided"}
</p>

<p className="text-sm text-gray-400">
  {order.billing?.address || "Not provided"}
</p>

<p className="text-sm text-gray-400">
  {order.billing?.country} • {order.billing?.postal_code}
</p>

          </div>

        </div>

      </div>

    </div>

  );
}
