import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../api/axios";
import SectionDivider from "../components/SectionDivider";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/products");

      // Handle different possible API response formats
      const productData = Array.isArray(res.data)
        ? res.data
        : res.data.products || res.data.data || [];

      setProducts(productData);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section className="px-10 py-14 bg-[#0a0614] text-white">
      <h2 className="text-4xl md:text-5xl text-center mb-12 golden-title">
        Our Top Rated Bots
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-400">Loading products...</p>
      )}

      {/* Error State */}
      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">
              No products available
            </p>
          )}
        </div>
      )}
    </section>
  );
}