import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Volume2, VolumeX, Youtube } from "lucide-react";

export default function Testimonials() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials/");
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    }
  };

  const sliderData = reviews.length > 1 ? [...reviews, ...reviews] : reviews;

  return (
    <section className="relative bg-[#0a0614] text-white py-20 overflow-hidden">

      {/* Title */}
      <div className="text-center mb-12">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">

          Excellent

          <span className="flex items-center">

            {[1,2,3,4].map((star)=>(
              <svg key={star} xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#facc15"
                className="w-5 h-5">
                <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.87 1.401-8.168L.132 9.211l8.2-1.193z"/>
              </svg>
            ))}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
              <defs>
                <linearGradient id="halfGradient">
                  <stop offset="50%" stopColor="#facc15"/>
                  <stop offset="50%" stopColor="#e5e7eb"/>
                </linearGradient>
              </defs>
              <path fill="url(#halfGradient)"
                d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.87 1.401-8.168L.132 9.211l8.2-1.193z"/>
            </svg>

          </span>

          | 1,000+ reviews on
          <span className="text-green-500 font-semibold">Trustpilot</span>

        </h3>
      </div>

      {/* Slider */}
      <div className="overflow-hidden">

        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: reviews.length * 10 || 20,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >

          {sliderData.map((item, i) => (
            <VideoCard key={i} item={item} />
          ))}

        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />

    </section>
  );
}


function VideoCard({ item }) {

  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

 
const videoUrl =
  item.video?.startsWith("http")
    ? item.video
    : `http://127.0.0.1:5000/${item.video.replace(/\\/g, "/")}`;

  const toggleSound = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(!muted);
  };

  return (

    <div className="relative min-w-[320px] bg-[#0f0b2a] rounded-2xl overflow-hidden shadow-lg border border-white/10">

      {/* VIDEO */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-56 object-cover"
      />

      {/* SOUND BUTTON */}
      <button
        onClick={toggleSound}
        className="absolute bottom-3 right-3 bg-black/70 p-2 rounded-full hover:bg-black"
      >
        {muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
      </button>

      {/* YOUTUBE LINK */}
      {item.youtube && (
        <a
          href={item.youtube}
          target="_blank"
          rel="noreferrer"
          className="absolute top-3 left-3 bg-red-600 p-2 rounded-full hover:bg-red-700"
        >
          <Youtube size={18}/>
        </a>
      )}

      <div className="p-4">

        <div className="flex items-center gap-2 mb-2">

          {/* FLAG */}
          <img
            src={`https://flagcdn.com/24x18/${item.flag?.toLowerCase()}.png`}
            alt={item.country}
            className="w-6 h-4 rounded-sm"
          />

          <span className="font-semibold">{item.name}</span>

        </div>

        <p className="text-sm text-white/70">
          Profits earned <span className="text-white">{item.reward}</span>
        </p>

        <p className="text-sm font-medium">{item.role}</p>

      </div>

    </div>

  );
}