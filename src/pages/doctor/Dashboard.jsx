import { useState, useEffect } from "react";
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

function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // prescription fields
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  // report fields
  const [diagnosis, setDiagnosis] = useState("");
  const [testRec, setTestRec] = useState("");
  const [remarks, setRemarks] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");

  useEffect(() => {
    API.get("/doctor/queue").then(res => {
      setQueue(res.data);
    }).catch(e => {
      console.error("queue load error", e);
    }).finally(() => setLoading(false));
  }, []);

  const handleSelect = (patient) => {
    setSelected(patient);
    setMsg("");
    setMedicine(""); setDosage(""); setDuration(""); setNotes("");
    setDiagnosis(""); setTestRec(""); setRemarks("");
  };

  const handleSubmit = async () => {
    if (!selected) return;
    if (!medicine || !dosage || !duration) {
      setMsg("Please fill in medicine name, dosage, and duration");
      return;
    }
    if (!diagnosis) {
      setMsg("Diagnosis is required for the report");
      return;
    }
    setSubmitting(true);
    setMsg("");
    try {
      await API.post(`/prescriptions/${selected.appointmentId}`, {
        medicines: [{ name: medicine, dosage, duration }],
        notes: notes || undefined,
      });
      await API.post(`/reports/${selected.appointmentId}`, {
        diagnosis,
        testRecommended: testRec || undefined,
        remarks: remarks || undefined,
      });
      setMsg("Prescription and report saved!");
      setSnackMsg("✓ Prescription & Report saved!");
      setSnackType("success");
      setSnackOpen(true);
      setSelected(null);
    } catch(e) {
      const errMsg = e.response?.data?.error || "Submission failed";
      setMsg(errMsg);
      setSnackMsg(errMsg);
      setSnackType("error");
      setSnackOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#355872",
      "& fieldset": { borderColor: "#9CD5FF" },
      "&:hover fieldset": { borderColor: "#7AAACE" },
      "&.Mui-focused fieldset": { borderColor: "#355872" },
    },
    "& .MuiInputLabel-root": { color: "#7AAACE" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#355872" },
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>Doctor Dashboard</Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "22px" }}>Today's patient queue</Typography>

      {loading ? (
        <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>
      ) : (
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #9CD5FF",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "28px",
          maxWidth: "560px"
        }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#355872" }}>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Token</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Patient</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Status</TableCell>
                <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} style={{ color: "#7AAACE", textAlign: "center", padding: "18px" }}>No patients in queue today</TableCell>
                </TableRow>
              )}
              {queue.map((p) => (
                <TableRow
                  key={p.id}
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    "& td": { borderColor: "#9CD5FF" },
                    backgroundColor: selected?.id === p.id ? "#F0F8FF" : "#fff"
                  }}
                >
                  <TableCell style={{ color: "#355872", fontWeight: "bold" }}>#{p.tokenNumber}</TableCell>
                  <TableCell style={{ color: "#355872" }}>{p.patientName || "-"}</TableCell>
                  <TableCell>
                    <span style={{
                      backgroundColor: "#9CD5FF",
                      color: "#355872",
                      padding: "2px 10px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleSelect(p)}
                      style={{ color: "#355872", border: "1px solid #9CD5FF", textTransform: "none", fontSize: "12px" }}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selected && (
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #9CD5FF",
          borderRadius: "10px",
          padding: "24px",
          maxWidth: "560px"
        }}>
          <Typography style={{ color: "#355872", fontWeight: "bold", marginBottom: "16px", fontSize: "15px" }}>
            Write prescription for: {selected.patientName} (Token #{selected.tokenNumber})
          </Typography>

          <Typography style={{ color: "#7AAACE", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Prescription</Typography>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <TextField label="Medicine" value={medicine} onChange={e => setMedicine(e.target.value)} sx={{ ...inputSx, flex: 1 }} size="small" />
            <TextField label="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} sx={{ ...inputSx, width: "110px" }} size="small" />
            <TextField label="Duration" value={duration} onChange={e => setDuration(e.target.value)} sx={{ ...inputSx, width: "110px" }} size="small" />
          </div>
          <TextField label="Notes" fullWidth value={notes} onChange={e => setNotes(e.target.value)} sx={{ ...inputSx, marginBottom: "18px" }} size="small" />

          <Typography style={{ color: "#7AAACE", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Report</Typography>
          <TextField label="Diagnosis *" fullWidth value={diagnosis} onChange={e => setDiagnosis(e.target.value)} sx={{ ...inputSx, marginBottom: "12px" }} size="small" />
          <TextField label="Tests Recommended" fullWidth value={testRec} onChange={e => setTestRec(e.target.value)} sx={{ ...inputSx, marginBottom: "12px" }} size="small" />
          <TextField label="Remarks" fullWidth value={remarks} onChange={e => setRemarks(e.target.value)} sx={{ ...inputSx, marginBottom: "18px" }} size="small" />

          {msg && (
            <Typography style={{
              color: msg.includes("saved") ? "#355872" : "#e53e3e",
              fontSize: "13px",
              marginBottom: "12px",
              fontWeight: "600"
            }}>
              {msg}
            </Typography>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ backgroundColor: "#355872", color: "#F7F8F0", textTransform: "none", fontWeight: "600" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#7AAACE"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#355872"}
            >
              {submitting ? "Saving..." : "Save Prescription & Report"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelected(null)}
              style={{ color: "#7AAACE", borderColor: "#9CD5FF", textTransform: "none" }}
            >
              Cancel
            </Button>
          </div>
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

export default DoctorDashboard;
