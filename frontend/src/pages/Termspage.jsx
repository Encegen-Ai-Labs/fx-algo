import { Link } from "react-router-dom";
import { useEffect } from "react";

 
export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300 px-6 py-16 flex justify-center">

      <div className="max-w-4xl w-full bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Terms and Conditions
          </h1>

          <Link
            to="/"
            className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90 transition"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="mb-4 text-sm text-gray-400">
          Last Updated: 2026
        </p>

        <p className="mb-6">
          Welcome to FX Algo (<a
            href="https://fxalgo.net"
            className="text-cyan-400 ml-1 hover:underline"
          >
            https://fxalgo.net
          </a>). By accessing or purchasing
          from our website, you agree to the following terms and conditions.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">1. Digital Products</h2>
        <p>
          FX Algo sells digital trading tools including forex robots,
          indicators and automated trading systems. These products are
          delivered digitally after successful payment.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">2. No Financial Advice</h2>
        <p>
          Our products are trading tools and are not financial advice.
          Trading in forex, crypto, and indices involves significant risk.
          Users are responsible for their own trading decisions.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">3. Refund Policy</h2>
        <p>
          Due to the nature of digital products, all sales are final and
          non-refundable once the product has been delivered or access
          has been granted.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">4. Product Usage</h2>
        <p>
          Customers are granted a license to use the purchased product
          for personal use only. Redistribution, resale, or sharing
          of the product is strictly prohibited.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">5. Payment</h2>
        <p>
          All payments on this website are processed securely via Razorpay.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">6. Account Suspension</h2>
        <p>
          If any user is found misusing, copying, or distributing our
          products illegally, FX Algo reserves the right to suspend
          access without notice.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">7. Changes to Terms</h2>
        <p>
          FX Algo may update these Terms and Conditions at any time
          without prior notice.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">8. Contact</h2>
        <p>
          If you have any questions about these Terms, you may contact us:
        </p>

        <p className="mt-2">
          Email:
          <a
            href="mailto:fxalgofficial@gmail.com"
            className="text-cyan-400 ml-1 hover:underline"
          >
            support@fxalgo.net
          </a>
          <br />

          Website:  <a
            href="https://fxalgo.net"
            className="text-cyan-400 ml-1 hover:underline"
          >
            https://fxalgo.net
          </a>
          
        </p>

      </div>

    </div>
  );
}