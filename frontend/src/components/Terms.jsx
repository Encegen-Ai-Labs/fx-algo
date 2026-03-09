import { Link } from "react-router-dom";


export default function Terms() {
  return (
    <section className="bg-black border-t border-cyan-500/30">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2">

        {/* LEFT SIDE - MAP */}
        <div className="w-full h-[450px]">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52349.16372153237!2d33.576344959632266!3d34.910897844325035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e082a16c40cb13%3A0x4fcbf0221371d0a5!2sLarnaca%2C%20Cyprus!5e0!3m2!1sen!2sin!4v1772644752128!5m2!1sen!2sin"
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>

        {/* RIGHT SIDE - CONTACT INFO */}
        <div className="bg-gradient-to-b from-[#0b0f19] to-black p-12 text-gray-300">

          {/* LOGO + TITLE */}
          <div className="flex items-center gap-4 mb-6">
            <img src="/logo.png" alt="logo" className="w-12 h-12" />
            <div>
              <h3 className="text-white text-xl font-semibold">FX ALGO</h3>
              <div className="w-16 h-1 bg-cyan-400 mt-2 rounded"></div>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-10">
            FX ALGO: Where innovative trading solutions meet expert guidance.
            We believe in quality trading tools.
          </p>

          {/* CONTACT SECTION */}
          <h4 className="text-white font-semibold mb-4">CONTACT US</h4>
          <div className="w-16 h-1 bg-cyan-400 mb-6 rounded"></div>

          <div className="space-y-6 text-sm">

            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white">fxalgofficial@gmail.com</p>
            </div>

            <div>
              <p className="text-gray-400">Call us</p>
              <p className="text-white">9373245172</p>
            </div>

            <div>
              <p className="text-gray-400">Whatsapp</p>
              <p className="text-white">9764221152</p>
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM STRIP */}
 

<div className="bg-gradient-to-r from-purple-900 via-black to-cyan-900 text-gray-400 text-xs py-4 text-center border-t border-white/10">
  © 2026 Developed by Encegen AI Labs &nbsp; | &nbsp;

  <Link to="/termspage" className="hover:text-white">
    Terms
  </Link>

  &nbsp; • &nbsp;

  <Link to="/privacy" className="hover:text-white">
    Privacy
  </Link>

  &nbsp; • &nbsp;

  <Link to="/refund-policy" className="hover:text-white">
    Refund Policy
  </Link>
</div>

    </section>
  );
}
