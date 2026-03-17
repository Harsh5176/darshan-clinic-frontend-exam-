import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API from "../../api/axios";

function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [list, setList] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [adding, setAdding] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");

  useEffect(() => {
    API.get("/admin/users").then(res => {
      setList(res.data);
    }).catch(e => {
      console.error("Error loading users", e);
    });
  }, []);

  const handleAdd = async () => {
    if (!name || !email || !password || !role) {
      setErrMsg("Please fill name, email, password and role");
      return;
    }
    setAdding(true);
    setErrMsg("");
    setSuccessMsg("");
    try {
      const body = { name, email, password, role };
      if (phone) body.phone = phone;
      const res = await API.post("/admin/users", body);
      setList([...list, res.data]);
      setSuccessMsg("User created successfully!");
      setSnackMsg("✓ User created successfully!");
      setSnackType("success");
      setSnackOpen(true);
      setName(""); setEmail(""); setPassword(""); setRole(""); setPhone("");
    } catch(e) {
      const msg = e.response?.data?.error || "Failed to create user";
      setErrMsg(msg);
      setSnackMsg(msg);
      setSnackType("error");
      setSnackOpen(true);
    } finally {
      setAdding(false);
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
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "24px", fontWeight: "bold" }}>Manage Users</Typography>

      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #9CD5FF",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "36px",
      }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#355872" }}>
              <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ color: "#F7F8F0", fontWeight: "bold" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((u, i) => (
              <TableRow key={i} sx={{ "&:last-child td": { borderBottom: 0 }, "& td": { borderColor: "#9CD5FF" } }}>
                <TableCell style={{ color: "#355872" }}>{u.name}</TableCell>
                <TableCell style={{ color: "#7AAACE" }}>{u.email}</TableCell>
                <TableCell>
                  <span style={{
                    backgroundColor: "#9CD5FF",
                    color: "#355872",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {u.role}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Typography variant="h6" style={{ color: "#355872", marginBottom: "18px", fontWeight: "bold" }}>Add New User</Typography>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "420px" }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={inputSx} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={inputSx} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={inputSx} />
        <TextField label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} sx={inputSx} />

        <FormControl>
          <InputLabel sx={{ color: "#408A71", "&.Mui-focused": { color: "#B0E4CC" } }}>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
            sx={{
              color: "#B0E4CC",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#285A48" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#408A71" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#B0E4CC" },
              "& .MuiSvgIcon-root": { color: "#B0E4CC" },
            }}
          >
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="receptionist">Receptionist</MenuItem>
            <MenuItem value="patient">Patient</MenuItem>
          </Select>
        </FormControl>

        {errMsg && <Typography style={{ color: "#f87171", fontSize: "13px" }}>{errMsg}</Typography>}
        {successMsg && <Typography style={{ color: "#4ade80", fontSize: "13px" }}>{successMsg}</Typography>}

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={adding}
          style={{ backgroundColor: "#355872", color: "#F7F8F0", textTransform: "none", padding: "9px", fontWeight: "600" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7AAACE"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#355872"}
        >
          {adding ? "Adding..." : "Add User"}
        </Button>
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

export default Users;
