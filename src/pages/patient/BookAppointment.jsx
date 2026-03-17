import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API from "../../api/axios";

const timeSlots = [
  "09:00-09:15", "09:15-09:30", "09:30-09:45",
  "10:00-10:15", "10:15-10:30", "10:30-10:45",
  "11:00-11:15", "11:15-11:30", "11:30-11:45",
  "12:00-12:15", "12:15-12:30",
  "14:00-14:15", "14:15-14:30", "14:30-14:45",
  "15:00-15:15", "15:15-15:30",
  "16:00-16:15", "16:15-16:30",
];

function BookAppointment() {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");

  // today's date in YYYY-MM-DD for the min value
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!date || !slot) {
      setErrMsg("Please select a date and time slot");
      return;
    }
    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");
    try {
      await API.post("/appointments", { appointmentDate: date, timeSlot: slot });
      setSuccessMsg("Appointment booked successfully!");
      setSnackMsg("✓ Appointment booked successfully!");
      setSnackType("success");
      setSnackOpen(true);
      setDate("");
      setSlot("");
    } catch (e) {
      const msg = e.response?.data?.error || "Booking failed. Slot may already be taken.";
      setErrMsg(msg);
      setSnackMsg(msg);
      setSnackType("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
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
    "& .MuiInputBase-input": { color: "#355872" },
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>Book Appointment</Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "26px" }}>Select a date and available time slot</Typography>

      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #9CD5FF",
        borderRadius: "10px",
        padding: "28px 24px",
        maxWidth: "420px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <TextField
            label="Appointment Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={inputSx}
          />

          <FormControl sx={inputSx}>
            <InputLabel sx={{ color: "#7AAACE", "&.Mui-focused": { color: "#355872" } }}>Time Slot</InputLabel>
            <Select
              value={slot}
              label="Time Slot"
              onChange={(e) => setSlot(e.target.value)}
              sx={{
                color: "#355872",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#9CD5FF" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7AAACE" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#355872" },
                "& .MuiSvgIcon-root": { color: "#7AAACE" },
              }}
            >
              {timeSlots.map(ts => (
                <MenuItem key={ts} value={ts}>{ts}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {errMsg && <Typography style={{ color: "#e53e3e", fontSize: "13px" }}>{errMsg}</Typography>}
          {successMsg && <Typography style={{ color: "#355872", fontSize: "13px", fontWeight: "600" }}>{successMsg}</Typography>}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: "#355872", color: "#F7F8F0", textTransform: "none", fontWeight: "600", padding: "10px" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#7AAACE"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#355872"}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </div>
      </div>

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

export default BookAppointment;
