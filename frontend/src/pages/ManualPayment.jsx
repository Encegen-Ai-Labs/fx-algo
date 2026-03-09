import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

import {
FaUpload,
FaTimes,
FaQrcode,
FaMoneyBillWave,
FaCheckCircle,
FaCopy,
FaSpinner
} from "react-icons/fa";

export default function ManualPayment() {

const { orderId } = useParams();
const navigate = useNavigate();

const [order, setOrder] = useState(null);
const [file, setFile] = useState(null);
const [preview, setPreview] = useState(null);
const [txId, setTxId] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(null);
const [messageType, setMessageType] = useState("success");

const [submitted, setSubmitted] = useState(false);

const [timeLeft, setTimeLeft] = useState(15 * 60);

const [inrAmount,setInrAmount] = useState(null);


/* AUTO HIDE MESSAGE */

useEffect(() => {

if (!message) return;

const timer = setTimeout(() => {
setMessage(null);
}, 4000);

return () => clearTimeout(timer);

}, [message]);


/* LOAD ORDER */

useEffect(() => {

api.get(`/orders/${orderId}`)
.then(res => setOrder(res.data))
.catch(() => {
setMessage("Order not found");
setMessageType("error");
navigate("/");
});

}, [orderId, navigate]);


/* USD → INR CONVERSION */

useEffect(()=>{

if(!order) return;

fetch("https://api.exchangerate-api.com/v4/latest/USD")
.then(res=>res.json())
.then(data=>{

const rate = data.rates.INR;
const converted = (order.total * rate).toFixed(0);

setInrAmount(converted);

})
.catch(()=>{

const fallback = (order.total * 83).toFixed(0);
setInrAmount(fallback);

})

},[order]);


/* TIMER */

useEffect(() => {

if (timeLeft <= 0) return;

const timer = setInterval(() => {
setTimeLeft(prev => prev - 1);
}, 1000);

return () => clearInterval(timer);

}, [timeLeft]);


const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;


/* FILE SELECT */

const handleFile = (e) => {

const selected = e.target.files[0];

if (!selected) return;

if (!selected.type.startsWith("image/")) {
setMessage("Only image files allowed");
setMessageType("error");
return;
}

if (selected.size > 5 * 1024 * 1024) {
setMessage("File must be under 5MB");
setMessageType("error");
return;
}

setFile(selected);
setPreview(URL.createObjectURL(selected));

};


/* COPY ORDER ID */

const copyOrderId = () => {

navigator.clipboard.writeText(order.id);

setMessage("Order ID copied to clipboard");
setMessageType("success");

};


/* UPLOAD */
const uploadProof = async () => {

if (timeLeft <= 0) {
setMessage("Payment time expired. Please place order again.");
setMessageType("error");
navigate("/cart");
return;
}

if (!file) {
setMessage("Please upload payment screenshot");
setMessageType("error");
return;
}

const formData = new FormData();
formData.append("screenshot", file);
formData.append("transaction_id", txId);

try {

setLoading(true);

await api.post(`/payment/upload-proof/${orderId}`, formData);

setSubmitted(true);

setFile(null);
setPreview(null);
setTxId("");

} catch (err) {

console.log(err);

setMessage("Upload failed. Please try again.");
setMessageType("error");

} finally {

setLoading(false);

}

};

if (!order) {
return (
<div className="text-white p-10 text-center">
Loading...
</div>
);
}


return (

<div className="min-h-screen bg-[#0a0614] text-white flex items-center justify-center p-6 relative">


<div className={`${submitted ? "blur-md pointer-events-none" : ""}`}>

<div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">


{/* LEFT SECTION */}

<div className="space-y-5">

<h1 className="text-3xl font-bold">
Complete Your Payment
</h1>


{message && (

<div
className={`p-3 rounded-lg text-center text-sm
${messageType === "error"
? "bg-red-900/40 border border-red-500"
: "bg-green-900/40 border border-green-500"}`}
>

{message}

</div>

)}




<div className="bg-[#12061f] p-5 rounded-xl flex justify-between items-center">

<div>

<p className="text-gray-400 text-sm">
Amount to Pay
</p>

<p className="text-lg text-gray-300">
${order.total} USD
</p>

{inrAmount && (

<div className="mt-2 bg-yellow-400/10 border border-yellow-400 rounded-lg p-3 text-center">

<p className="text-xs text-gray-400 uppercase tracking-wide">
Send Exactly
</p>

<p className="text-3xl font-bold text-yellow-400">
₹{inrAmount}
</p>

<p className="text-xs text-gray-400">
INR (Indian Rupees)
</p>

</div>

)}

</div>

<div
className={`px-4 py-2 rounded-lg font-semibold
${timeLeft < 120 ? "bg-red-600" : "bg-yellow-500 text-black"}`}
>

{minutes}:{seconds.toString().padStart(2, "0")}

</div>

</div>


{/* WARNING */}

<div className="bg-red-900/40 border border-red-500 p-3 rounded-lg text-sm text-center">
Pay the exact amount <span className="font-bold">₹{inrAmount}</span>.
Wrong amount payments may delay approval.
</div>


{/* ORDER ID */}

<div className="bg-[#12061f] border border-yellow-400 p-4 rounded-xl text-center">

<p className="text-gray-400 text-sm">
Your Order ID
</p>

<p className="text-xl font-bold text-yellow-400">
{order.id}
</p>

<button
onClick={copyOrderId}
className="mt-2 text-sm bg-yellow-400 text-black px-3 py-1 rounded flex items-center gap-2 mx-auto"
>

<FaCopy />

Copy Order ID

</button>

<p className="text-xs text-gray-400 mt-2">
Include this ID in payment remark or screenshot if possible
</p>

</div>


{/* QR */}

<div className="bg-[#12061f] p-5 rounded-xl flex flex-col items-center">

<FaQrcode size={28} className="text-yellow-400 mb-2" />

<p className="text-gray-300 mb-3">
Scan QR using any UPI app
</p>

<img
src="/payments/upiqrc.jpeg"
alt="UPI QR"
className="w-56 border border-yellow-400 rounded-lg"
/>

<p className="text-sm text-gray-400 mt-3 text-center">
Google Pay • PhonePe • Paytm
</p>

</div>


{/* STEPS */}

<div className="bg-[#12061f] p-4 rounded-xl grid grid-cols-3 text-center text-sm">

<div className="flex flex-col items-center">
<FaQrcode className="text-yellow-400 mb-1"/>
Scan QR
</div>

<div className="flex flex-col items-center">
<FaMoneyBillWave className="text-yellow-400 mb-1"/>
Pay Amount
</div>

<div className="flex flex-col items-center">
<FaUpload className="text-yellow-400 mb-1"/>
Upload Proof
</div>

</div>

</div>


{/* RIGHT SECTION */}

<div className="bg-[#12061f] p-6 rounded-xl flex flex-col justify-center">

<h2 className="text-xl font-semibold mb-4 text-center">
Upload Payment Screenshot
</h2>


<label
htmlFor="fileUpload"
className="flex flex-col items-center justify-center w-full h-36
border-2 border-dashed border-gray-500 rounded-xl
cursor-pointer hover:border-yellow-400 hover:bg-[#1a0d2e]
transition text-gray-300"
>

<FaUpload size={26} className="mb-2"/>

<p className="font-semibold">
Choose Screenshot
</p>

<p className="text-xs text-gray-400">
PNG or JPG up to 5MB
</p>

</label>


<input
id="fileUpload"
type="file"
accept="image/*"
onChange={handleFile}
className="hidden"
/>


{preview && (

<div className="mt-4 text-center">

<img
src={preview}
alt="preview"
className="w-56 rounded-lg border mx-auto mb-2"
/>

<p className="text-green-400 text-sm">
{file?.name}
</p>

</div>

)}


<input
type="text"
placeholder="Transaction ID (optional)"
value={txId}
onChange={(e) => setTxId(e.target.value)}
className="w-full p-3 mt-4 rounded-lg bg-[#0a0614] border border-gray-600"
/>


<div className="flex gap-3 mt-6">

<button
onClick={() => navigate("/cart")}
className="flex-1 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
>

<FaTimes />
Cancel

</button>


<button
disabled={timeLeft <= 0 || loading}
onClick={uploadProof}
className={`flex-1 py-3 font-bold rounded-lg transition flex items-center justify-center gap-2
${loading
? "bg-gray-600 cursor-not-allowed"
: "bg-yellow-400 text-black hover:scale-105"}
`}
>

{loading ? (
<>
<FaSpinner className="animate-spin"/>
Uploading...
</>
) : (
<>
<FaCheckCircle/>
Submit
</>
)}

</button>
</div>

</div>

</div>

</div>


{submitted && (

<div className="absolute inset-0 flex items-center justify-center">

<div className="bg-[#12061f] border border-yellow-400 rounded-xl p-8 max-w-md text-center shadow-xl">

<FaCheckCircle className="text-green-400 text-5xl mx-auto mb-4"/>

<h2 className="text-2xl font-bold mb-2">
Payment Submitted
</h2>

<p className="text-gray-300 mb-4">
Your payment proof has been submitted successfully.
</p>

<div className="bg-[#0a0614] p-3 rounded-lg mb-4">

<p className="text-sm text-gray-400">Order ID</p>
<p className="font-bold text-yellow-400">{order.id}</p>

</div>

<button
onClick={()=>navigate("/purchases")}
className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:scale-105 transition"
>

View Order Details

</button>

</div>

</div>

)}

</div>

);
}