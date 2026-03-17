import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import API from "../../api/axios";

function AdminDashboard() {
  const [clinic, setClinic] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clinicRes, usersRes] = await Promise.all([
          API.get("/admin/clinic"),
          API.get("/admin/users")
        ]);
        setClinic(clinicRes.data);
        setUsers(usersRes.data);
      } catch (e) {
        console.error("Failed to load admin data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const card = {
    backgroundColor: "#fff",
    border: "1px solid #9CD5FF",
    borderRadius: "10px",
    padding: "22px 26px",
    minWidth: "155px",
  };

  const countByRole = (r) => users.filter(u => u.role === r).length;

  if (loading) {
    return (
      <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
        <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "4px", fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "6px" }}>
        {clinic?.name} &nbsp;&bull;&nbsp; Code: {clinic?.code}
      </Typography>
      <Typography style={{ color: "#9CD5FF", fontSize: "12px", marginBottom: "28px" }}>
        Overview of clinic users
      </Typography>

      <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
        <div style={card}>
          <Typography style={{ color: "#7AAACE", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Users</Typography>
          <Typography variant="h4" style={{ color: "#355872", fontWeight: "bold" }}>{users.length}</Typography>
        </div>
        <div style={card}>
          <Typography style={{ color: "#7AAACE", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Doctors</Typography>
          <Typography variant="h4" style={{ color: "#355872", fontWeight: "bold" }}>{countByRole("doctor")}</Typography>
        </div>
        <div style={card}>
          <Typography style={{ color: "#7AAACE", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Patients</Typography>
          <Typography variant="h4" style={{ color: "#355872", fontWeight: "bold" }}>{countByRole("patient")}</Typography>
        </div>
        <div style={card}>
          <Typography style={{ color: "#7AAACE", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Receptionists</Typography>
          <Typography variant="h4" style={{ color: "#355872", fontWeight: "bold" }}>{countByRole("receptionist")}</Typography>
        </div>
      </div>

      {clinic && (
        <div style={{
          marginTop: "32px",
          backgroundColor: "#fff",
          border: "1px solid #9CD5FF",
          borderRadius: "10px",
          padding: "20px 24px",
          maxWidth: "360px"
        }}>
          <Typography style={{ color: "#7AAACE", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Clinic Info</Typography>
          <Typography style={{ color: "#355872", fontSize: "14px", marginBottom: "6px" }}>Name: {clinic.name}</Typography>
          <Typography style={{ color: "#355872", fontSize: "14px", marginBottom: "6px" }}>Code: {clinic.code}</Typography>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
