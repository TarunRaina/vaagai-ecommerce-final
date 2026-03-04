import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const OrderForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("individual");
  const [installationType, setInstallationType] = useState("product_only");
  const [deliveryMethod, setDeliveryMethod] = useState("home_delivery");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [message, setMessage] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}/`);

      setProduct(res.data);
    } catch (err) {
      console.error("Failed to load product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity > product.stock) {
      setMessage("Selected quantity exceeds available stock");
      return;
    }

    if (quantity < 1) {
      setMessage("Quantity must be at least 1");
      return;
    }
    try {
      await api.post(
        "/orders/create/",
        {
          items: [
            {
              product_id: productId,
              quantity: quantity,
            },
          ],
          order_type: orderType,
          installation_type: installationType,
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          delivery_address:
            deliveryMethod === "home_delivery" ? deliveryAddress : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage("Order placed successfully!");

      setTimeout(() => {
        navigate("/customer/orders");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to place order");
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h2>Place Order</h2>

      <hr />

      {/* Product Info */}

      <div>
        <img src={product.image} alt={product.name} width="150" />

        <h3>{product.name}</h3>

        <p>Category: {product.category.name}</p>

        <p>Price: ₹{product.price}</p>
        <p>Available Stock: {product.stock}</p>
        {product.stock === 0 && (
          <p style={{ color: "red" }}>This product is currently out of stock</p>
        )}
      </div>

      <hr />

      {/* Order Form */}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label>Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="individual">Individual</option>
            <option value="b2b">B2B</option>
          </select>
        </div>

        <div>
          <label>Worker Support</label>
          <select
            value={installationType}
            onChange={(e) => setInstallationType(e.target.value)}
          >
            <option value="product_only">Product Only</option>
            <option value="installation_required">
              Worker Installation Required
            </option>
          </select>
        </div>

        <div>
          <label>Delivery Method</label>
          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          >
            <option value="home_delivery">Home Delivery</option>
            <option value="shop_pickup">Shop Pickup</option>
          </select>
        </div>
        {deliveryMethod === "home_delivery" && (
          <div>
            <label>Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cod">Cash On Delivery</option>
            <option value="razorpay" disabled>
              Razorpay
            </option>
          </select>
        </div>

        <br />

        <button type="submit" disabled={product.stock === 0}>
          Confirm Order
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderForm;
