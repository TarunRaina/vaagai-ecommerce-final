import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories/')
        setCategories(res.data)
      } catch (err) {
        console.error('Failed to load categories')
      }
    }

    fetchCategories()
  }, [])

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`)
        const product = res.data

        setName(product.name)
        setDescription(product.description)
        setPrice(product.price)
        setStock(product.stock)
        setCategory(product.category?.id || '')
        setIsActive(product.is_active)

        setLoading(false)
      } catch (err) {
        console.error('Failed to load product')
      }
    }

    fetchProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      await api.put(`/products/update/${id}/`, {
        name,
        description,
        price,
        stock,
        category_id: category,
        is_active: isActive,
      })

      setMessage('Product updated successfully!')

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1000)

    } catch (err) {
      setMessage('Update failed')
    }
  }

  if (loading) {
    return <p>Loading product...</p>
  }

  return (
    <div>
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
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
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
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

        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default EditProduct