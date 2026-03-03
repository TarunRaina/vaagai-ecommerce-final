import { useEffect } from "react"

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!message) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 20px",
        borderRadius: "8px",
        backgroundColor: type === "error" ? "#ffe5e5" : "#e6ffed",
        color: type === "error" ? "#b30000" : "#006600",
        fontWeight: "500",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  )
}

export default Notification