import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Checkout() {

  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "India",
    city: "",
    address: "",
    postal_code: "",
    coupon: "",
    paymentMethod: "razorpay",
    agreeTerms: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (value, countryData) => {
    setForm(prev => ({
      ...prev,
      phone: value,
      country: countryData?.name || "India"
    }));
    setErrors(prev => ({ ...prev, phone: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!form.first_name) newErrors.first_name = "First name is required";
    if (!form.last_name) newErrors.last_name = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.postal_code) newErrors.postal_code = "Postal code is required";
    if (!form.agreeTerms) newErrors.agreeTerms = "You must accept Terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectPayment = (method) => {
    setForm(prev => ({ ...prev, paymentMethod: method }));
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
 const handleSubmit = async () => {

  if (loading) return;

  if (cart.length === 0) {
    alert("Cart empty");
    return;
  }

  if (!validate()) return;

  setLoading(true);

  const startTime = Date.now(); // ⏱ start timer

  try {

    const orderRes = await api.post("/orders", {
      payment_method: form.paymentMethod,
      billing: form,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.qty
      }))
    });

    const orderId = orderRes.data.order_id;

// CRYPTO
if (form.paymentMethod === "crypto") {
  clearCart();
  navigate(`/crypto-payment/${orderId}`);
  return;
}

// PAYPAL
// PAYPAL PAYMENT
if (form.paymentMethod === "paypal") {

  const productId = cart[0].id; // assuming single product purchase

  const paypalLinks = {
    1: "https://www.paypal.com/ncp/payment/LBGPHUSMVS5L6",
    2: "https://www.paypal.com/ncp/payment/PX3HA9HB3X2DC",
    3: "https://www.paypal.com/ncp/payment/WDGF52YURHQ9U",
    4: "https://www.paypal.com/ncp/payment/VV6SNLGVN96X2",
    5: "https://www.paypal.com/ncp/payment/Z4JQ3RJQ5ZTPN",
    6: "https://www.paypal.com/ncp/payment/SSKR4A7TNUNQQ",
    7: "https://www.paypal.com/ncp/payment/R83ZBCP7QJFMJ",
    8: "https://www.paypal.com/ncp/payment/37ZQTMH8YMCM4"
  };

  const link = paypalLinks[productId];

  if (link) {
    window.location.href = link;
  } else {
    alert("PayPal link not available for this product");
  }

  return;
}
// UPI (manual screenshot)
if (form.paymentMethod === "upi") {
  clearCart();
  navigate(`/manual-payment/${orderId}`);
  return;
}

// BANK TRANSFER PAGE
if (form.paymentMethod === "banktransfer") {
  clearCart();
  navigate(`/bank-transfer/${orderId}`);
  return;
}
// OTHER MANUAL
if (form.paymentMethod !== "razorpay") {
  clearCart();
  navigate(`/manual-payment/${orderId}`);
  return;
}
  const payRes = await api.post("/payment/create-order", {
      order_id: orderId,
      amount: Math.round(cartTotal * 100)
    });

    const payData = payRes.data;

    const options = {
      key: payData.key,
      amount: payData.amount,
      currency: "INR",
      name: "FX ALGO",
      description: "Digital Product Purchase",
      order_id: payData.razorpay_order_id,

      prefill: {
        name: form.first_name + " " + form.last_name,
        email: form.email,
        contact: form.phone,
      },

      theme: { color: "#facc15" },

      handler: async function (response) {

        try {
          await api.post("/payment/verify", {
            order_id: orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          clearCart();
          navigate("/purchases");

        } catch (err) {
          alert("Verification failed");
        } finally {
          const elapsed = Date.now() - startTime;
          if (elapsed < 3000) {
            await delay(3000 - elapsed);
          }
          setLoading(false);
        }
      },

      modal: {
        ondismiss: async function () {
          const elapsed = Date.now() - startTime;
          if (elapsed < 3000) {
            await delay(3000 - elapsed);
          }
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log(err);
    alert("Payment failed");

    const elapsed = Date.now() - startTime;
    if (elapsed < 3000) {
      await delay(3000 - elapsed);
    }

    setLoading(false);
  }
};
  const inputStyle = `
  p-3 rounded-lg bg-[#0e061a]
  border border-white/40
  text-white placeholder-gray-400
  focus:outline-none
  focus:border-yellow-400
  focus:ring-2 focus:ring-yellow-400/30
  hover:border-white
  transition-all duration-300
  `;

  return (
    <div className="min-h-screen bg-[#0a0614] text-white px-10 py-12">

      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-[#12061f] p-6 rounded-xl border border-white/20">
            <h2 className="text-xl font-semibold mb-2">Account</h2>
            <p className="text-sm text-gray-400">
              Logged in as <b className="text-white">{user?.email}</b>
            </p>
          </div>

          <div className="bg-[#12061f] p-6 rounded-xl border border-white/20">
            <h2 className="text-xl font-semibold mb-6">Billing Details</h2>

          <div className="grid md:grid-cols-2 gap-6">

{["first_name","last_name"].map(field => (

<div key={field} className="flex flex-col">

<label className="text-sm text-gray-300 mb-1">
{field === "first_name" ? "First Name *" : "Last Name *"}
</label>

<input
name={field}
placeholder={field === "first_name" ? "Enter first name" : "Enter last name"}
onChange={handleChange}
className={`w-full px-4 py-3 rounded-lg bg-[#0e061a] border border-white/30 text-white placeholder-gray-400
focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition
${errors[field] ? "border-red-500" : ""}`}
/>

{errors[field] && (
<p className="text-red-400 text-sm mt-1">
{errors[field]}
</p>
)}

</div>

))}

</div>
            <div className="mt-4">
              <input
                name="email"
                placeholder="Email *"
                onChange={handleChange}
                className={`${inputStyle} w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mt-4">
              <PhoneInput
                country={"in"}
                value={form.phone}
                onChange={handlePhoneChange}
                inputClass={`!w-full !bg-[#0e061a] !text-white ${errors.phone ? "!border-red-500" : "!border-white/40"}`}
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            {["address", "city", "postal_code"].map(field => (
              <div key={field} className="mt-4">
                <input
                  name={field}
                  placeholder={field.replace("_", " ").toUpperCase() + " *"}
                  onChange={handleChange}
                  className={`${inputStyle} w-full ${errors[field] ? "border-red-500" : ""}`}
                />
                {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <input
              name="coupon"
              placeholder="Coupon Code"
              onChange={handleChange}
              className={`${inputStyle} w-full mt-4`}
            />

          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="bg-[#12061f] p-6 rounded-xl h-fit">

          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.title} × {item.qty}</span>
              <span>${item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-4 border-gray-700" />

          <div className="flex justify-between font-bold text-yellow-400">
            <span>Total</span>
            <span>${cartTotal}</span>
          </div>

          {/* PAYMENT METHODS */}

         <h3 className="mt-6 mb-3 font-semibold">Payment Method</h3>

<div className="grid grid-cols-2 gap-4">

  {[
  { id: "razorpay", name: "UPI / Cards", img: "/payments/razorpay.jpg" },
  { id: "paypal", name: "PayPal", img: "/payments/paypal.jpg" },
  { id: "skrill", name: "Skrill", img: "/payments/Skrill.jpeg" },
  { id: "crypto", name: "Crypto", img: "/payments/crypto.jpeg" },
  { id: "upi", name: "UPI Payment", img: "/payments/upi.jpeg" },
  { id: "banktransfer", name: "Bank Transfer", img: "/payments/bank.webp" }
].map(p => (

    <div
      key={p.id}
      onClick={() => selectPayment(p.id)}
      className={`
        cursor-pointer 
        border 
        rounded-lg
        p-3 
        flex 
        flex-col 
        items-center 
        justify-center 
        transition-all 
        duration-300
        hover:border-yellow-400 
        hover:bg-[#1a0c2e]
        ${form.paymentMethod === p.id
          ? "border-yellow-400 bg-[#1a0c2e]"
          : "border-white"}
      `}
    >

      <img 
        src={p.img} 
        className="h-12 w-auto mb-1  border 
        rounded-lg  object-contain transition-transform duration-300 hover:scale-110" 
        alt={p.name}
      />

      <span className="text-sm font-medium">{p.name}</span>

    </div>

  ))}

</div>

<label className="flex items-start gap-2 mt-4 text-sm">
  <input
    type="checkbox"
    name="agreeTerms"
    onChange={handleChange}
    className="accent-yellow-400 mt-1"
  />

 <span>
  I confirm that:
  <ul className="list-disc ml-5 mt-1 space-y-1">
    <li>I have read and agreed to the Terms of Use.</li>
    <li>All information provided is correct and matches government-issued ID.</li>
    <li>
      I have read and agree with the{" "}
      <Link
        to="/termspage"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Terms and Conditions
      </Link>
    </li>
  </ul>
</span>
</label>

 <button
  onClick={handleSubmit}
  disabled={loading}
  className={`w-full mt-6 py-3 rounded-lg
  font-bold transition-all duration-300
  ${loading
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 text-black"
  }`}
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Processing...
    </div>
  ) : (
    "Pay Now →"
  )}
</button>
{loading && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
)}
        </div>

      </div>

    </div>
  );
}