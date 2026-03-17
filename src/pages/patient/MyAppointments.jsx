import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import API from "../../api/axios";

function MyAppointments({ onViewDetail }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/appointments/my").then(res => {
      setAppointments(res.data);
    }).catch(err => {
      console.error("appointments error", err);
    }).finally(() => setLoading(false));
  }, []);

  const cellStyle = { color: "#355872", borderColor: "#9CD5FF" };

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>My Appointments</Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "22px" }}>All your booked appointments</Typography>

      {loading ? (
        <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>
      ) : (
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #9CD5FF",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#355872" }}>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Token</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Time Slot</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Status</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} style={{ color: "#7AAACE", textAlign: "center", padding: "20px" }}>No appointments found</TableCell>
                </TableRow>
              )}
              {appointments.map((a) => (
                <TableRow key={a.id} sx={{ "&:last-child td": { borderBottom: 0 }, "& td": { borderColor: "#9CD5FF" } }}>
                  <TableCell style={cellStyle}>
                    #{a.queueEntry?.tokenNumber || "-"}
                  </TableCell>
                  <TableCell style={cellStyle}>{a.appointmentDate}</TableCell>
                  <TableCell style={cellStyle}>{a.timeSlot}</TableCell>
                  <TableCell>
                    <span style={{
                      backgroundColor: "#9CD5FF",
                      color: "#355872",
                      padding: "2px 10px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}>
                      {a.queueEntry?.status || a.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => onViewDetail(a.id)}
                      style={{
                        color: "#355872",
                        border: "1px solid #9CD5FF",
                        textTransform: "none",
                        fontSize: "12px"
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
