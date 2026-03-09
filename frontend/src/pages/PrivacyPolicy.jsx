import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-gray-300 px-6 py-16 flex justify-center">

      <div className="max-w-4xl w-full bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
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
          Welcome to FX Algo (https://fxalgo.net). Your privacy is important to us.
          This Privacy Policy document explains how we collect, use, and protect
          your information when you visit our website or purchase our products.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          1. Information We Collect
        </h2>

        <p className="mb-2">
          When you visit or purchase from our website, we may collect the following information:
        </p>

        <ul className="list-disc pl-6 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing information</li>
          <li>Payment details (processed securely through Razorpay)</li>
          <li>Device and browser information</li>
        </ul>

        <h2 className="text-xl text-white mt-6 mb-2">
          2. How We Use Your Information
        </h2>

        <p className="mb-2">
          We use your information for the following purposes:
        </p>

        <ul className="list-disc pl-6 space-y-1">
          <li>To process payments and deliver our digital products</li>
          <li>To communicate with customers regarding purchases or support</li>
          <li>To improve our website and services</li>
          <li>To send updates about our products, offers, or trading tools</li>
        </ul>

        <h2 className="text-xl text-white mt-6 mb-2">
          3. Payment Security
        </h2>

        <p>
          All payments are securely processed through Razorpay. We do not store
          your card or banking information on our servers.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          4. Cookies
        </h2>

        <p>
          Our website may use cookies to improve user experience and analyze
          website traffic.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          5. Third-Party Services
        </h2>

        <p>
          We may use trusted third-party services such as payment gateways and
          analytics tools. These services have their own privacy policies.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          6. Data Protection
        </h2>

        <p>
          We implement reasonable security measures to protect your personal
          information from unauthorized access.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">
          7. Contact Information
        </h2>

        <p>
          If you have any questions about this Privacy Policy, you can contact us:
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
          Website: https://fxalgo.net
        </p>

        <p className="mt-8 text-sm text-gray-400">
          By using our website, you agree to this Privacy Policy.
        </p>

      </div>
    </div>
  );
}