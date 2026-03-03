import Navbar from "../components/Navbar"

const CustomerLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  )
}

export default CustomerLayout