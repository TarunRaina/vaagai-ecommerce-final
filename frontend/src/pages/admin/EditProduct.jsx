// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../api/axios";

// const EditProduct = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [image, setImage] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const [category, setCategory] = useState("");
//   const [isActive, setIsActive] = useState(true);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await api.get("/products/categories/");
//         setCategories(res.data);
//       } catch (err) {
//         console.error("Failed to load categories");
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch product details
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/products/${id}/`);
//         const product = res.data;

//         setName(product.name);
//         setDescription(product.description);
//         setPrice(product.price);
//         setStock(product.stock);
//         setCategory(product.category?.id || "");
//         setIsActive(product.is_active);

//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to load product");
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       await api.put(`/products/update/${id}/`, {
//         name,
//         description,
//         price,
//         stock,
//         category_id: category,
//         is_active: isActive,
//       });

//       setMessage("Product updated successfully!");

//       setTimeout(() => {
//         navigate("/admin/dashboard");
//       }, 1000);
//     } catch (err) {
//       setMessage("Update failed");
//     }
//   };

//   if (loading) {
//     return <p>Loading product...</p>;
//   }

//   return (
//     <div>
//       <h2>Edit Product</h2>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Price</label>
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Stock</label>
//           <input
//             type="number"
//             value={stock}
//             onChange={(e) => setStock(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Product Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={isActive}
//               onChange={(e) => setIsActive(e.target.checked)}
//             />
//             Active
//           </label>
//         </div>

//         <button type="submit">Update Product</button>

//         {message && <p>{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default EditProduct;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [existingImage, setExistingImage] = useState(null);
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`);
        const product = res.data;

        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setCategory(product.category?.id || "");
        setIsActive(product.is_active);
        setExistingImage(product.image);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category_id", category);
      formData.append("is_active", isActive);

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/products/update/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsError(false);
      setMessage("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);

    } catch (err) {
      setIsError(true);

      if (err.response && err.response.data) {
        const errors = err.response.data;
        const firstError = Object.values(errors)[0];
        setMessage(Array.isArray(firstError) ? firstError[0] : "Update failed");
      } else {
        setMessage("Update failed");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} noValidate>

        <div>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
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

        {/* Existing Image Preview */}
        <div>
          <label>Current Image</label>
          <br />
          {existingImage ? (
            <img
              src={existingImage}
              alt="Current"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        {/* Upload New Image */}
        <div>
          <label>Change Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
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

        <button type="submit">Update Product</button>

        {message && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px 15px",
              borderRadius: "6px",
              backgroundColor: isError ? "#ffe5e5" : "#e6ffed",
              color: isError ? "#b30000" : "#006600",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProduct;