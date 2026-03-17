import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import API from "../../api/axios";

function PatientDashboard({ onViewDetail }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    API.get("/appointments/my").then(res => {
      setAppointments(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }, []);

  const getStatusColor = (s) => {
    if (s === "done") return "#7AAACE";
    if (s === "in_progress") return "#355872";
    if (s === "cancelled") return "#e53e3e";
    return "#9CD5FF";
  };

  const recent = appointments.slice(0, 3);

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "4px", fontWeight: "bold" }}>
        Welcome, {user.name || "Patient"}!
      </Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "14px", marginBottom: "30px" }}>
        Use the menu above to book or check appointments.
      </Typography>

      {loading ? (
        <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>
      ) : (
        <div>
          <Typography style={{ color: "#355872", fontWeight: "bold", marginBottom: "14px", fontSize: "15px" }}>
            Recent Appointments
          </Typography>

          {recent.length === 0 && (
            <Typography style={{ color: "#7AAACE", fontSize: "14px" }}>No appointments yet.</Typography>
          )}

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {recent.map((appt) => (
              <div key={appt.id} style={{
                backgroundColor: "#fff",
                border: "1px solid #9CD5FF",
                borderRadius: "10px",
                padding: "18px 22px",
                minWidth: "200px",
              }}>
                <Typography style={{ color: "#7AAACE", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Token</Typography>
                <Typography variant="h4" style={{ color: "#355872", fontWeight: "bold", marginBottom: "8px" }}>
                  #{appt.queueEntry?.tokenNumber || "-"}
                </Typography>
                <Typography style={{ color: "#7AAACE", fontSize: "12px", marginBottom: "4px" }}>
                  {appt.appointmentDate} &bull; {appt.timeSlot}
                </Typography>
                <span style={{
                  backgroundColor: "#9CD5FF",
                  color: getStatusColor(appt.queueEntry?.status || appt.status),
                  padding: "2px 10px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "600",
                  display: "inline-block",
                  marginBottom: "10px"
                }}>
                  {appt.queueEntry?.status || appt.status}
                </span>
                <br />
                <Button
                  size="small"
                  onClick={() => onViewDetail(appt.id)}
                  style={{ color: "#355872", textTransform: "none", padding: "0", fontSize: "12px" }}
                >
                  View Details &rarr;
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
