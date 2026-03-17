import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API from "../../api/axios";

function ReceptionistDashboard() {
  const [date, setDate] = useState("");
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");

  const today = new Date().toISOString().split("T")[0];

  const loadQueue = (d) => {
    if (!d) return;
    setLoading(true);
    API.get(`/queue?date=${d}`).then(res => {
      setQueue(res.data);
    }).catch(err => {
      console.error("queue load error", err);
      setQueue([]);
    }).finally(() => setLoading(false));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    loadQueue(e.target.value);
  };

  const updateStatus = async (queueId, status, idx) => {
    try {
      await API.patch(`/queue/${queueId}`, { status });
      const updated = [...queue];
      updated[idx].status = status;
      setQueue(updated);
      setSnackMsg(`✓ Status updated to ${status}!`);
      setSnackType("success");
      setSnackOpen(true);
    } catch(e) {
      console.error("status update failed", e);
      const errMsg = e.response?.data?.error || "Update failed";
      setSnackMsg(errMsg);
      setSnackType("error");
      setSnackOpen(true);
    }
  };

  const btnStyle = (color) => ({
    color: color,
    border: `1px solid ${color}`,
    textTransform: "none",
    fontSize: "12px",
    marginRight: "6px"
  });

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>Queue Management</Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "22px" }}>Select a date to view the daily queue</Typography>

      <TextField
        label="Select Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: today }}
        value={date}
        onChange={handleDateChange}
        sx={{
          marginBottom: "28px",
          "& .MuiOutlinedInput-root": {
            color: "#355872",
            "& fieldset": { borderColor: "#9CD5FF" },
            "&:hover fieldset": { borderColor: "#7AAACE" },
            "&.Mui-focused fieldset": { borderColor: "#355872" },
          },
          "& .MuiInputLabel-root": { color: "#7AAACE" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#355872" },
        }}
      />

      {loading && <Typography style={{ color: "#7AAACE" }}>Loading queue...</Typography>}

      {!loading && date && queue.length === 0 && (
        <Typography style={{ color: "#7AAACE" }}>No queue entries for this date.</Typography>
      )}

      {!loading && queue.length > 0 && (
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
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Patient Name</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Status</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((row, i) => (
                <TableRow key={row.id} sx={{ "&:last-child td": { borderBottom: 0 }, "& td": { borderColor: "#9CD5FF" } }}>
                  <TableCell style={{ color: "#355872", fontWeight: "bold" }}>#{row.tokenNumber}</TableCell>
                  <TableCell style={{ color: "#355872" }}>
                    {row.appointment?.patient?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <span style={{
                      backgroundColor: "#9CD5FF",
                      color: "#355872",
                      padding: "2px 10px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.status === "waiting" && (
                      <>
                        <Button size="small" style={btnStyle("#355872")} onClick={() => updateStatus(row.id, "in-progress", i)}>Start</Button>
                        <Button size="small" style={btnStyle("#7AAACE")} onClick={() => updateStatus(row.id, "skipped", i)}>Skip</Button>
                      </>
                    )}
                    {row.status === "in_progress" && (
                      <Button size="small" style={btnStyle("#355872")} onClick={() => updateStatus(row.id, "done", i)}>Done</Button>
                    )}
                    {(row.status === "done" || row.status === "skipped") && (
                      <Typography style={{ color: "#7AAACE", fontSize: "12px" }}>—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackType} sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ReceptionistDashboard;
