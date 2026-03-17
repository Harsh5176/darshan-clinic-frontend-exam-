import { useState } from "react";
import { TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import API, { settoken } from "../../api/axios";

function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");

  const handleLogin = async () => {
    if (!email || !pass) {
      setErr("Please enter email and password");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await API.post("/auth/login", { email, password: pass });
      const { token, user } = res.data;
      settoken(token);
      localStorage.setItem("user", JSON.stringify(user));
      setSnackMsg("Login successful! Redirecting...");
      setSnackType("success");
      setSnackOpen(true);
      setTimeout(() => onLogin(user.role), 1500);
    } catch (e) {
      const msg = e.response?.data?.error || "Login failed. Check your email and password.";
      setErr(msg);
      setSnackMsg(msg);
      setSnackType("error");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const inputSx = {
    marginBottom: 2,
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
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: "340px",
        padding: "32px 28px",
        border: "1px solid #9CD5FF",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(53,88,114,0.08)"
      }}>

        <Typography variant="h5" style={{ marginBottom: "4px", color: "#355872", fontWeight: "bold" }}>
          Clinic Login
        </Typography>
        <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "24px" }}>
          Darshan Clinic Portal
        </Typography>

        <TextField
          label="Email"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g., enrollment@darshan.ac.in"
          sx={inputSx}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          size="small"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={handleKey}
          sx={inputSx}
        />

        {err && (
          <Typography style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>
            {err}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            backgroundColor: "#355872",
            color: "#F7F8F0",
            textTransform: "none",
            fontWeight: "600",
            "&:hover": { backgroundColor: "#7AAACE" },
            "&.Mui-disabled": { backgroundColor: "#9CD5FF", color: "#F7F8F0" }
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

      </div>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackType} sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
