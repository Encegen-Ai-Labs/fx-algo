import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar";

export default function AdminTestimonials() {

  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    name: "",
    country: "",
    flag: "",
    reward: "",
    role: "",
    youtube: ""
  });

  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);

  // LOAD TESTIMONIALS
  const load = async () => {
    try {
      const res = await api.get("/testimonials/");
      setList(res.data);
    } catch (err) {
      console.error("Failed to load testimonials", err);
      alert("Failed to load testimonials");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // SUBMIT
  const submit = async () => {

    if (!video) {
      alert("Please select a video");
      return;
    }

    const fd = new FormData();

    Object.keys(form).forEach(key => {
      fd.append(key, form[key]);
    });

    fd.append("video", video);

    try {

      await api.post("/testimonials/", fd, {

        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }

      });

      alert("Testimonial added!");

      setForm({
        name: "",
        country: "",
        flag: "",
        reward: "",
        role: "",
        youtube: ""
      });

      setVideo(null);
      setProgress(0);

      load();

    } catch (err) {

      console.error(err);
      alert("Upload failed");

    }

  };

  // DELETE
  const remove = async (id) => {

    if (!window.confirm("Delete this testimonial?")) return;

    try {

      await api.delete(`/testimonials/${id}`);

      load();

    } catch (err) {

      alert("Delete failed");

    }

  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 text-white bg-[#0a0614] min-h-screen">

        <h1 className="text-3xl mb-8">Testimonials Manager</h1>

        {/* ADD FORM */}
        <div className="bg-[#1a1033] p-6 rounded-xl mb-10">

          <h2 className="text-xl mb-4">Add New Testimonial</h2>

          {Object.keys(form).map(key => (

            <input
              key={key}
              value={form[key]}
              placeholder={key}
              className="block w-full p-3 mb-3 bg-[#0f0b2a] rounded"
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />

          ))}

          {/* VIDEO INPUT */}
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={(e) => setVideo(e.target.files[0])}
            className="mb-4"
          />

          {/* UPLOAD PROGRESS */}
          {progress > 0 && (
            <div className="w-full bg-gray-700 h-2 mb-4 rounded">
              <div
                className="bg-yellow-400 h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            onClick={submit}
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
          >
            Upload
          </button>

        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {list.map(t => (

            <div
              key={t.id}
              className="bg-[#1a1033] p-4 rounded-xl"
            >

              <video
                src={t.video}
                controls
                className="w-full h-48 object-cover mb-3 rounded"
              />

              <div className="flex items-center gap-2 mb-2">

                <img
                  src={`https://flagcdn.com/24x18/${t.flag?.toLowerCase()}.png`}
                  className="w-6 h-4"
                />

                <h3 className="font-bold">{t.name}</h3>

              </div>

              <p className="text-sm">{t.role}</p>

              {t.youtube && (
                <a
                  href={t.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 text-sm"
                >
                  YouTube
                </a>
              )}

              <button
                onClick={() => remove(t.id)}
                className="mt-3 px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}