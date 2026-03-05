import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"

const Appointments = () => {

  const { token } = useAuth()

  const [appointments, setAppointments] = useState([])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {

    try {

      const res = await api.get("/appointments/my/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAppointments(res.data)

    } catch (err) {
      console.error("Failed to load appointments")
    }

  }

  const bookAppointment = async (e) => {

    e.preventDefault()

    try {

      await api.post(
        "/appointments/book/",
        { date, time },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setDate("")
      setTime("")

      fetchAppointments()

    } catch (err) {
      console.error("Booking failed")
    }

  }

  return (
    <div>

      <h2>Book Appointment</h2>

      <form onSubmit={bookAppointment}>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          Book Appointment
        </button>

      </form>

      <hr />

      <h3>My Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments yet</p>
      ) : (

        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {appointments.map(app => (

              <tr key={app.id}>

                <td>{app.date}</td>

                <td>{app.time}</td>

                <td>{app.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  )
}

export default Appointments