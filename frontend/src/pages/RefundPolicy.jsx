import { Link } from "react-router-dom";
import { useEffect } from "react";



export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-black text-gray-300 px-6 py-16 flex justify-center">

      <div className="max-w-4xl w-full bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Refund Policy
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
          Thank you for purchasing from FX Algo (<a
            href="https://fxalgo.net"
            className="text-cyan-400 ml-1 hover:underline"
          >
            https://fxalgo.net
          </a>).
        </p>

        <p className="mb-6">
          At FX Algo, we sell digital products such as forex trading robots,
          indicators, and automated trading tools. Because these are digital
          products delivered instantly after purchase, we maintain a strict
          refund policy.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          1. No Refund Policy
        </h2>

        <p>
          All sales are final. Once a product has been delivered or access has
          been granted, we do not offer refunds, returns, or exchanges.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          2. Digital Product Nature
        </h2>

        <p>
          Since our products are digital downloads or software licenses,
          they cannot be returned once accessed or delivered.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          3. Incorrect Purchase
        </h2>

        <p>
          Customers are advised to carefully read product descriptions before
          purchasing. FX Algo will not be responsible for incorrect purchases
          made by customers.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          4. Technical Support
        </h2>

        <p>
          If you face any technical issue with the product, our support team
          will assist you in resolving the issue.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          5. Fraudulent Transactions
        </h2>

        <p>
          If any fraudulent payment or unauthorized transaction is detected,
          FX Algo reserves the right to investigate and take appropriate
          action.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          6. Contact Us
        </h2>

        <p>
          If you have questions regarding our refund policy, please contact us:
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
          Website: <a
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