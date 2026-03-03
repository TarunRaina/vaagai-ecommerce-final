import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"

const Wishlist = () => {
  const { token } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/products/wishlist/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setWishlist(response.data)
    } catch (err) {
      console.error("Failed to fetch wishlist")
    }
  }

  const handleRemove = async (id) => {
    try {
      await api.delete(`/products/wishlist/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchWishlist()
    } catch (err) {
      alert("Failed to remove item")
    }
  }

  return (
    <div>
      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            {item.product.image && (
              <img
                src={item.product.image}
                alt={item.product.name}
                style={{ width: "150px", height: "120px", objectFit: "cover" }}
              />
            )}

            <h4>{item.product.name}</h4>
            <p>₹ {item.product.price}</p>

            <button onClick={() => handleRemove(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Wishlist