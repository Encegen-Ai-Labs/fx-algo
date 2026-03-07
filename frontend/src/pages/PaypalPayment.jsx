import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "../api/axios";

export default function PaypalPayment(){

const { orderId } = useParams();
const navigate = useNavigate();

const [order,setOrder] = useState(null);

useEffect(()=>{

api.get(`/orders/${orderId}`)
.then(res=>setOrder(res.data))

},[orderId]);

if(!order) return <div className="text-white p-10">Loading...</div>

return(

<div className="min-h-screen bg-[#0a0614] text-white flex items-center justify-center p-10">

<div className="bg-[#12061f] p-8 rounded-xl w-full max-w-md text-center">

<h1 className="text-3xl font-bold mb-6">
Pay with PayPal
</h1>

<p className="text-gray-400 mb-4">
Order Amount
</p>

<p className="text-4xl text-yellow-400 font-bold mb-6">
${order.total}
</p>

<PayPalScriptProvider
options={{
"client-id": "YOUR_PAYPAL_CLIENT_ID",
currency: "USD"
}}
>

<PayPalButtons

createOrder={(data,actions)=>{

return actions.order.create({
purchase_units:[
{
amount:{
value:order.total
}
}
]
})

}}

onApprove={async(data,actions)=>{

const details = await actions.order.capture()

await api.post("/payment/paypal-verify",{
order_id:orderId,
paypal_order_id:data.orderID
})

navigate("/purchases")

}}

onError={(err)=>{
alert("Payment failed")
console.log(err)
}}

/>

</PayPalScriptProvider>

<button
onClick={()=>navigate("/cart")}
className="mt-6 w-full py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
>

Cancel Payment

</button>

</div>

</div>

)

}