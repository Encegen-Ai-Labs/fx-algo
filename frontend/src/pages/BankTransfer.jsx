import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  FaUpload,
  FaCheckCircle,
  FaTimes,
  FaCopy,
  FaClock,
  FaUniversity
} from "react-icons/fa";

export default function BankTransfer(){

const { orderId } = useParams();
const navigate = useNavigate();

const [order,setOrder] = useState(null);

const [file,setFile] = useState(null);
const [preview,setPreview] = useState(null);
const [txId,setTxId] = useState("");

const [submitted,setSubmitted] = useState(false);
const [copied,setCopied] = useState(false);

const [timeLeft,setTimeLeft] = useState(15*60);

const [inrAmount,setInrAmount] = useState(null);


/* LOAD ORDER */

useEffect(()=>{

api.get(`/orders/${orderId}`)
.then(res=>setOrder(res.data))
.catch(()=>navigate("/"))

},[orderId,navigate]);


/* FETCH USD → INR RATE */

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

// fallback conversion
const fallback = (order.total * 83).toFixed(0);
setInrAmount(fallback);

})

},[order]);


/* TIMER */

useEffect(()=>{

if(timeLeft<=0) return;

const timer=setInterval(()=>{
setTimeLeft(prev=>prev-1)
},1000)

return ()=>clearInterval(timer)

},[timeLeft])


const minutes=Math.floor(timeLeft/60)
const seconds=timeLeft%60


/* COPY ACCOUNT */

const copyAccount=()=>{

navigator.clipboard.writeText("083018210001451")

setCopied(true)

setTimeout(()=>{
setCopied(false)
},2000)

}


/* FILE SELECT */

const handleFile=(e)=>{

const selected=e.target.files[0]

if(!selected) return

if(!selected.type.startsWith("image/")){
alert("Only image allowed")
return
}

if(selected.size>5*1024*1024){
alert("Max file size 5MB")
return
}

setFile(selected)
setPreview(URL.createObjectURL(selected))

}


/* UPLOAD PROOF */

const uploadProof=async()=>{

if(timeLeft<=0){
alert("Payment time expired")
navigate("/cart")
return
}

if(!file){
alert("Upload screenshot")
return
}

const formData=new FormData()

formData.append("screenshot",file)
formData.append("transaction_id",txId)

try{

await api.post(`/payment/upload-proof/${orderId}`,formData)

setSubmitted(true)

}catch(err){

alert("Upload failed")

}

}


if(!order) return <div className="text-white p-10">Loading...</div>


return(

<div className="min-h-screen bg-[#0a0614] text-white flex items-center justify-center p-6 relative">


{/* BLUR AFTER SUBMIT */}

<div className={`${submitted ? "blur-md pointer-events-none" : ""}`}>

<div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">


{/* LEFT SIDE */}

<div className="space-y-6">

<h1 className="text-3xl font-bold">
Bank Transfer
</h1>


{/* AMOUNT */}

<div className="bg-[#12061f] p-6 rounded-xl flex justify-between items-center">

<div>

<p className="text-gray-400 text-sm">
Amount to Pay
</p>

<p className="text-xl text-gray-300 mt-1">
${order.total} USD
</p>

{inrAmount && (

<div className="mt-3 bg-yellow-400/10 border border-yellow-400 rounded-lg p-3 text-center">

<p className="text-xs text-gray-400 uppercase tracking-wide">
Send Exactly
</p>

<p className="text-4xl font-bold text-yellow-400">
₹{inrAmount}
</p>

<p className="text-xs text-gray-400">
INR (Indian Rupees)
</p>

</div>

)}

<p className="text-xs text-gray-400">
Converted based on current exchange rate
</p>

</div>

<div className="bg-yellow-400 text-black px-5 py-2 rounded-lg flex items-center gap-2 font-semibold">

<FaClock/>

{minutes}:{seconds.toString().padStart(2,"0")}

</div>

</div>


{/* BANK DETAILS */}

<div className="bg-[#12061f] p-6 rounded-xl space-y-3">

<h3 className="text-lg font-semibold flex items-center gap-2">

<FaUniversity/>

Bank Details

</h3>

<p><b>Bank:</b> Bank Of India</p>

<p><b>Beneficiary name:</b> Krishna Chandrakant Devangaon</p>

<p><b>Account Number:</b> 083018210001451</p>

<p><b>IFSC:</b> BKID0000830</p>

<p><b>Reference:</b> Order #{order.id}</p>


<button
onClick={copyAccount}
className="mt-3 bg-yellow-400 text-black px-3 py-1 rounded flex items-center gap-2"
>

<FaCopy/>

Copy Account Number

</button>

<p className="text-xs text-yellow-400 mt-2">
Send exact INR amount and include Order ID in reference
</p>

</div>

</div>



{/* RIGHT SIDE */}

<div className="bg-[#12061f] p-6 rounded-xl space-y-4">

<h2 className="text-xl font-semibold text-center">
Upload Payment Proof
</h2>


<label
className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-yellow-400"
>

<FaUpload className="mb-2"/>

Upload Screenshot

<input
type="file"
accept="image/*"
className="hidden"
onChange={handleFile}
/>

</label>


{preview && (

<img
src={preview}
className="w-56 mx-auto rounded border"
/>

)}


<input
type="text"
placeholder="Transaction ID (optional)"
value={txId}
onChange={(e)=>setTxId(e.target.value)}
className="w-full p-3 rounded-lg bg-[#0a0614]"
/>


{/* BUTTONS */}

<div className="flex gap-3 pt-2">

<button
onClick={()=>navigate("/cart")}
className="flex-1 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
>

<FaTimes/>

Cancel

</button>

<button
onClick={uploadProof}
className="flex-1 py-3 bg-yellow-400 text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition"
>

<FaCheckCircle/>

Submit Payment

</button>

</div>


<p className="text-xs text-gray-400 text-center">
After admin verification your order will be activated.
</p>

</div>


</div>

</div>


{/* COPY POPUP */}

{copied && (

<div className="fixed bottom-6 right-6 bg-green-500 text-black px-4 py-2 rounded-lg shadow-lg">

Account Copied ✓

</div>

)}


{/* SUCCESS OVERLAY */}

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

)

}