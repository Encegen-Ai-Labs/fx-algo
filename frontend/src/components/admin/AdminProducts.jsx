import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import api from "../../api/axios";

const initialForm = {
  title: "",
  price: "",
  old_price: "",
  discount: "",
  description: "",
  image: null,
};

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const BASE = "";
  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= FORM INPUT ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= IMAGE ================= */

  const handleImage = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  /* ================= SAVE / UPDATE ================= */

  const handleSubmit = async () => {

    if (!form.title || !form.price) {
      setError("Title and Price are required.");
      return;
    }

    try {

      setSaving(true);
      setError("");

      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) {
          fd.append(key, form[key]);
        }
      });

      if (editingId) {
        await api.put(`/products/${editingId}`, fd);
        alert("✅ Product updated");
      } else {
        await api.post("/products", fd);
        alert("✅ Product added");
      }

      setForm(initialForm);
      setEditingId(null);
      loadProducts();

    } catch (err) {
      console.error(err.response?.data);
      setError("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (p) => {

    setEditingId(p.id);

    setForm({
      title: p.title,
      price: p.price,
      old_price: p.old_price,
      discount: p.discount,
      description: p.description,
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= UI ================= */

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-[#0a0614] text-white p-10">

        <h1 className="text-3xl font-bold mb-10">
          Product Management
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* ================= FORM ================= */}

          <div className="bg-[#1a1033] p-6 rounded-xl shadow-lg">

            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            {error && (
              <p className="bg-red-500/20 text-red-400 p-2 mb-4 rounded text-sm">
                {error}
              </p>
            )}

            <div className="space-y-4">

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product Title"
                className="w-full px-4 py-2 rounded bg-[#0e061a]"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="px-4 py-2 rounded bg-[#0e061a]"
                />

                <input
                  name="old_price"
                  value={form.old_price}
                  onChange={handleChange}
                  placeholder="Old Price"
                  className="px-4 py-2 rounded bg-[#0e061a]"
                />

              </div>

              <input
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Discount %"
                className="w-full px-4 py-2 rounded bg-[#0e061a]"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full px-4 py-2 rounded bg-[#0e061a] h-24"
              />

              <input
                type="file"
                onChange={handleImage}
              />

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded transition"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                  className="w-full bg-gray-700 py-2 rounded"
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </div>

          {/* ================= PRODUCTS ================= */}

          <div className="lg:col-span-2">

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-400">No products found.</p>
            ) : (

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {products.map((p) => (

                  <div
                    key={p.id}
                    className="bg-[#1a1033] p-4 rounded-xl shadow hover:scale-105 transition"
                  >

                    <img
                      src={`${BASE}${p.image}`}
                      alt={p.title}
                      className="h-36 mx-auto object-contain"
                    />

                    <h3 className="mt-3 text-center font-semibold">
                      {p.title}
                    </h3>

                    <div className="flex justify-center gap-2 mt-2 text-sm">

                      {p.old_price > 0 && (
                        <span className="line-through text-gray-500">
                          ${p.old_price}
                        </span>
                      )}

                      <span className="text-orange-400 font-bold">
                        ${p.price}
                      </span>

                    </div>

                    {p.discount > 0 && (
                      <p className="text-green-400 text-xs text-center mt-1">
                        {p.discount}% OFF
                      </p>
                    )}

                    <div className="flex justify-between mt-4">

                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </div>
    </>
  );
}
