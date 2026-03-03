import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [isError, setIsError] = useState(false)
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/products/categories/");
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      name.trim() === "" ||
      description.trim() === "" ||
      category === "" ||
      price === "" ||
      stock === ""
    ) {
      setIsError(true);
      setMessage("All fields are required");
      return;
    }

    if (Number(price) < 0) {
      setIsError(true);
      setMessage("Price cannot be negative");
      return;
    }

    if (Number(stock) < 0) {
      setIsError(true);
      setMessage("Stock cannot be negative");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/products/update/${editingId}/`, {
          name,
          description,
          price,
          stock,
          category_id: category,
          is_active: isActive,
        });

        setMessage("Product updated successfully!");
      } else {
        await api.post("/products/create/", {
          name,
          description,
          price,
          stock,
          category_id: category,
          is_active: isActive,
        });

        setMessage("Product added successfully!");
      }

      // Reset form
      setEditingId(null);
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setIsActive(true);
      setIsError(false);

      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/delete/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product");
    }
  };

  return (
    <div>
      <h2>Inventory Management</h2>

      {/* Add Product Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </div>

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {message && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px 15px",
              borderRadius: "6px",
              backgroundColor:
                message.toLowerCase().includes("fail") ||
                message.toLowerCase().includes("negative")
                  ? "#ffe5e5"
                  : "#e6ffed",
              color:
                message.toLowerCase().includes("fail") ||
                message.toLowerCase().includes("negative")
                  ? "#b30000"
                  : "#006600",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}
      </form>

      {/* Product List */}
      <hr style={{ margin: "40px 0" }} />

      <h3>Product List</h3>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Stock Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {product.stock === 0 ? (
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      Out of Stock
                    </span>
                  ) : product.stock < 5 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Low
                    </span>
                  ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Normal
                    </span>
                  )}
                </td>
                <td>{product.is_active ? "Yes" : "No"}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
