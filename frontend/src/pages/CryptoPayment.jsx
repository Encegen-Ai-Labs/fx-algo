import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

import {
FaUpload,
FaCopy,
FaCheckCircle,
FaClock,
FaSpinner
} from "react-icons/fa";

export default function CryptoPayment(){

const { orderId } = useParams();
const navigate = useNavigate();

const [order,setOrder] = useState(null);
const [network,setNetwork] = useState("btc");
const [loading,setLoading] = useState(false);
const [file,setFile] = useState(null);
const [preview,setPreview] = useState(null);
const [txId,setTxId] = useState("");

const [timeLeft,setTimeLeft] = useState(15*60);

const [submitted,setSubmitted] = useState(false);
const [copied,setCopied] = useState(false);


/* LOAD ORDER */

useEffect(()=>{

api.get(`/orders/${orderId}`)
.then(res=>setOrder(res.data))
.catch(()=>navigate("/"))

},[orderId,navigate]);


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


/* WALLET CONFIG */

const wallets={
btc:{
name:"Bitcoin",
address:"bc1qwn8n0yjwrpqsfmn4ekagx5pr3w4l8k5s2tu7p3",
qr:"/payments/btc_qr.jpeg"
},
erc20:{
name:"USDT ERC20",
address:"0x3e6BFC73a57a6A12EAc4899b35e34d44496d9E54",
qr:"/payments/erc20_qr.jpeg"
},
bep20:{
name:"USDT BEP20",
address:"0x3e6BFC73a57a6A12EAc4899b35e34d44496d9E54",
qr:"/payments/bep20_qr.jpeg"
},
trc20:{
name:"USDT TRC20",
address:"TXzu2zgAw8tZyr9UrmeCipXcwNAkGvFaRL",
qr:"/payments/trc20_qr.jpeg"
}
}

const wallet=wallets[network]


/* COPY ADDRESS */

const copyAddress=()=>{

navigator.clipboard.writeText(wallet.address)

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
alert("Only image files allowed")
return
}

if(selected.size>5*1024*1024){
alert("File must be under 5MB")
return
}

setFile(selected)
setPreview(URL.createObjectURL(selected))

}


/* UPLOAD PAYMENT */
const uploadProof = async () => {

  if(!file){
    alert("Please upload payment screenshot")
    return
  }

  const formData = new FormData()

  formData.append("screenshot",file)
  formData.append("transaction_id",txId)
  formData.append("network",network)

  try{

    setLoading(true)

    await api.post(`/payment/upload-proof/${orderId}`,formData)

    setSubmitted(true)

    setFile(null)
    setPreview(null)
    setTxId("")

  }catch(err){

    alert("Upload failed. Please try again.")

  }finally{

    setLoading(false)

  }

}


if(!order) return <div className="text-white p-10 text-center">Loading...</div>


return(

<div className="min-h-screen bg-[#0a0614] text-white flex justify-center p-6 relative">

<div className={`${submitted ? "blur-md pointer-events-none" : ""}`}>

<div className="max-w-[1400px] w-full grid lg:grid-cols-2 gap-6">

{/* LEFT SIDE PAYMENT */}

<div className="bg-[#12061f] p-6 rounded-xl space-y-5">

<h1 className="text-2xl font-bold">
Crypto Payment
</h1>


{/* AMOUNT */}

<div className="flex justify-between items-center">

<div>
<p className="text-sm text-gray-400">
Amount to Pay
</p>

<p className="text-3xl font-bold text-yellow-400">
${order.total}
</p>
</div>

<div className="bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">

<FaClock/>

{minutes}:{seconds.toString().padStart(2,"0")}

</div>

</div>


{/* NETWORK */}

<div>

<p className="text-sm text-gray-400 mb-1">
Crypto Network
</p>

<select
value={network}
onChange={(e)=>setNetwork(e.target.value)}
className="w-full p-3 rounded-lg bg-[#0a0614] border border-gray-700"
>

<option value="btc">Bitcoin</option>
<option value="erc20">USDT ERC20</option>
<option value="bep20">USDT BEP20</option>
<option value="trc20">USDT TRC20</option>

</select>

</div>


{/* QR */}

<div className="text-center">

<p className="text-sm text-gray-400 mb-2">
Scan QR to Pay ({wallet.name})
</p>

<img
src={wallet.qr}
className="w-52 mx-auto border border-yellow-400 rounded-lg"
/>

</div>


{/* WALLET ADDRESS */}

<div>

<p className="text-sm text-gray-400 mb-1">
Wallet Address
</p>

<div className="flex">

<div className="flex-1 bg-[#0a0614] p-3 rounded-l-lg break-all text-yellow-400 text-xs">

{wallet.address}

</div>

<button
onClick={copyAddress}
className="bg-yellow-400 text-black px-4 rounded-r-lg"
>

<FaCopy/>

</button>

</div>

<p className="text-xs text-gray-400 mt-2">
Send only {wallet.name} to this address
</p>

</div>

</div>



{/* RIGHT SIDE UPLOAD */}

<div className="bg-[#12061f] p-6 rounded-xl space-y-4">

<h2 className="text-lg font-semibold text-center">
Upload Payment Proof
</h2>

<label
className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition"
>

<FaUpload className="mb-1"/>

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
className="w-40 mx-auto rounded border"
/>

)}


<input
type="text"
placeholder="Transaction ID (optional)"
value={txId}
onChange={(e)=>setTxId(e.target.value)}
className="w-full p-2 rounded-lg bg-[#0a0614] border border-gray-700"
/>


<div className="flex gap-3">

<button
onClick={uploadProof}
disabled={loading}
className={`flex-1 py-2 font-bold rounded-lg flex items-center justify-center gap-2 transition
${loading ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-400 text-black hover:scale-105"}
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


<p className="text-xs text-gray-400 text-center">
After approval your order will activate automatically.
</p>

</div>


</div>

</div>


{/* COPY POPUP */}

{copied && (

<div className="fixed bottom-6 right-6 bg-green-500 text-black px-4 py-2 rounded-lg shadow-lg">

Address Copied ✓

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

<button
onClick={()=>navigate("/purchases")}
className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:scale-105 transition"
>

View Order

</button>

</div>

</div>

)}

</div>

)

}