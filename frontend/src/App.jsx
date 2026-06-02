
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [activeProductId, setActiveProductId] = useState(null);

  // Load products from backend
  useEffect(() => {
    fetch("/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", price: "", description: "" });
    setActiveProductId(null);
  };

  const startEdit = (product) => {
    setActiveProductId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/products/${id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setProducts(products.filter((product) => product.id !== id));
          if (activeProductId === id) resetForm();
        }
      })
      .catch((err) => console.error(err));
  };

  // Submit new product or update existing one
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = activeProductId ? "PUT" : "POST";
    const url = activeProductId
      ? `/api/products/${activeProductId}/`
      : "/api/products/";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (activeProductId) {
          setProducts(
            products.map((product) =>
              product.id === activeProductId ? data : product
            )
          );
        } else {
          setProducts([...products, data]);
        }
        resetForm();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h1>🛍 Product List</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {activeProductId ? "Update Product" : "Add Product"}
        </button>
        {activeProductId && (
          <button type="button" onClick={resetForm} className="cancel-button">
            Cancel
          </button>
        )}
      </form>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p className="price">{p.price}</p>
            <p>{p.description}</p>
            <div className="product-actions">
              <button type="button" onClick={() => startEdit(p)}>
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
