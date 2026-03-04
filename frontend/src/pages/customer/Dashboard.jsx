// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../auth/AuthContext";

// const Dashboard = () => {
//   const { isAuthenticated } = useAuth();

//   const [products, setProducts] = useState([]);
//   const [groupedProducts, setGroupedProducts] = useState({});

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get("/products/");
//       setProducts(response.data);
//       groupByCategory(response.data);
//     } catch (err) {
//       console.error("Failed to fetch products");
//     }
//   };

//   const groupByCategory = (productsList) => {
//     const grouped = {};

//     productsList.forEach((product) => {
//       const categoryName = product.category?.name || "Others";

//       if (!grouped[categoryName]) {
//         grouped[categoryName] = [];
//       }

//       grouped[categoryName].push(product);
//     });

//     setGroupedProducts(grouped);
//   };

//   const handleWishlist = async (productId) => {
//     try {
//       await api.post(
//         "/products/wishlist/add/",
//         { product_id: productId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         },
//       );
//       alert("Added to wishlist");
//     } catch (err) {
//       alert("Login required or already added");
//     }
//   };

//   return (
//     <div>
//       <h2>Products</h2>

//       {Object.keys(groupedProducts).length === 0 ? (
//         <p>No products available.</p>
//       ) : (
//         Object.entries(groupedProducts).map(([category, items]) => (
//           <div key={category}>
//             <hr />
//             <h3>{category}</h3>

//             <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//               {items.map((product) => (
//                 <div
//                   key={product.id}
//                   style={{
//                     border: "1px solid #ccc",
//                     padding: "10px",
//                     width: "200px",
//                   }}
//                 >
//                   {product.image && (
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       style={{
//                         width: "100%",
//                         height: "150px",
//                         objectFit: "cover",
//                       }}
//                     />
//                   )}

//                   <h4>{product.name}</h4>
//                   <p>₹ {product.price}</p>

//                   <p>
//                     {product.stock === 0
//                       ? "Out of Stock"
//                       : product.stock < 5
//                         ? "Low Stock"
//                         : "Available"}
//                   </p>

//                   {isAuthenticated ? (
//                     <button onClick={() => handleWishlist(product.id)}>
//                       Add to Wishlist
//                     </button>
//                   ) : (
//                     <p>Login to wishlist</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Notification from "../../components/Notification";

const Dashboard = () => {
  const { isAuthenticated, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const [notification, setNotification] = useState("");
  const [notifType, setNotifType] = useState("success");

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      groupByCategory(response.data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/products/wishlist/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ids = new Set(response.data.map((item) => item.product.id));
      setWishlistIds(ids);
    } catch (err) {
      console.error("Failed to fetch wishlist");
    }
  };

  const groupByCategory = (productsList) => {
    const grouped = {};

    productsList.forEach((product) => {
      const categoryName = product.category?.name || "Others";

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }

      grouped[categoryName].push(product);
    });

    setGroupedProducts(grouped);
  };

  const handleWishlist = async (productId) => {
    if (!isAuthenticated) {
      setNotifType("error");
      setNotification("Please login to add to wishlist");
      return;
    }

    if (wishlistIds.has(productId)) {
      setNotifType("error");
      setNotification("Already in wishlist");
      return;
    }

    try {
      await api.post(
        "/products/wishlist/add/",
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlistIds((prev) => new Set(prev).add(productId));

      setNotifType("success");
      setNotification("Added to wishlist");
    } catch (err) {
      setNotifType("error");
      setNotification("Failed to add to wishlist");
    }
  };

  const handleOrder = async (product) => {
    if (!isAuthenticated) {
      setNotifType("error");
      setNotification("Please login to place order");
      return;
    }

    if (product.stock === 0) {
      setNotifType("error");
      setNotification("Product out of stock");
      return;
    }

    try {
      await api.post(
        "/orders/create/",
        {
          items: [
            {
              product_id: product.id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifType("success");
      setNotification("Order placed successfully");

      fetchProducts();
    } catch (err) {
      setNotifType("error");
      setNotification("Failed to place order");
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category}>
          <h3>{category}</h3>
          <hr />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {items.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "200px",
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <h4>{product.name}</h4>
                <p>₹ {product.price}</p>

                <p>
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock < 5
                      ? "Low Stock"
                      : "Available"}
                </p>

                {wishlistIds.has(product.id) ? (
                  <button disabled>❤️ Added</button>
                ) : (
                  <button onClick={() => handleWishlist(product.id)}>
                    Add to Wishlist
                  </button>
                )}

                <br />
                <br />

                <button onClick={() => handleOrder(product)}>Order</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Notification
        message={notification}
        type={notifType}
        onClose={() => setNotification("")}
      />
    </div>
  );
};

export default Dashboard;
