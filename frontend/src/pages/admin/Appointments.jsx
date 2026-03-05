import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"

const AdminAppointments = () => {

  const { token } = useAuth()

  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {

    const res = await api.get("/appointments/admin/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setAppointments(res.data)
  }

  const updateStatus = async (id, status) => {

    await api.patch(
      `/appointments/update/${id}/`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    fetchAppointments()
  }

  return (
    <div>

      <h2>Appointment Management</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {appointments.map(app => (

            <tr key={app.id}>

              <td>{app.user}</td>

              <td>{app.date}</td>

              <td>{app.time}</td>

              <td>{app.status}</td>

              <td>

                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(app.id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(app.id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}

export default AdminAppointments