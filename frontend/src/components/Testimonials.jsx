function VideoCard({ item }) {

  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const videoUrl =
    item.video?.startsWith("http")
      ? item.video
      : `${window.location.origin}/${item.video?.replace(/\\/g, "/")}`;

  const toggleSound = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(!muted);
  };

  const getYoutubeId = (url) => {
    if (!url) return null;

    if (url.includes("shorts/")) {
      return url.split("shorts/")[1].split("?")[0];
    }

    if (url.includes("v=")) {
      return url.split("v=")[1].split("&")[0];
    }

    return null;
  };

  const youtubeId = getYoutubeId(item.youtube);

  return (

    <div className="relative min-w-[320px] bg-[#0f0b2a] rounded-2xl overflow-hidden shadow-lg border border-white/10">

      {youtubeId ? (

        <div
          onClick={() => window.open(item.youtube, "_blank")}
          className="cursor-pointer"
        >
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            className="w-full h-56 object-cover"
          />
        </div>

      ) : (

        <>
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-56 object-cover"
          />

          <button
            onClick={toggleSound}
            className="absolute bottom-3 right-3 bg-black/70 p-2 rounded-full hover:bg-black"
          >
            {muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
          </button>
        </>

      )}

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
