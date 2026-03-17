import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import AppointmentDetail from "./pages/patient/AppointmentDetail";
import Prescriptions from "./pages/patient/Prescriptions";
import Reports from "./pages/patient/Reports";
import ReceptionistDashboard from "./pages/receptionist/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import { removetoken } from "./api/axios";

const navLinks = {
  admin: ["Dashboard", "Users"],
  patient: ["Dashboard", "Book Appointment", "My Appointments", "Prescriptions", "Reports"],
  receptionist: ["Dashboard"],
  doctor: ["Dashboard"],
};

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("Login");
  const [selectedApptId, setSelectedApptId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      setRole(u.role);
      setPage("Dashboard");
    }
  }, []);

  const handleLogin = (r) => {
    setRole(r);
    setPage("Dashboard");
  };

  const handleLogout = () => {
    removetoken();
    localStorage.removeItem("user");
    setRole(null);
    setPage("Login");
    setSelectedApptId(null);
  };

  const goToDetail = (id) => {
    setSelectedApptId(id);
    setPage("Appointment Detail");
  };

  const renderPage = () => {
    if (!role || page === "Login") return <Login onLogin={handleLogin} />;

    if (role === "admin") {
      if (page === "Dashboard") return <AdminDashboard />;
      if (page === "Users") return <Users />;
    }

    if (role === "patient") {
      if (page === "Dashboard") return <PatientDashboard onViewDetail={goToDetail} />;
      if (page === "Book Appointment") return <BookAppointment />;
      if (page === "My Appointments") return <MyAppointments onViewDetail={goToDetail} />;
      if (page === "Appointment Detail") return <AppointmentDetail id={selectedApptId} onBack={() => setPage("My Appointments")} />;
      if (page === "Prescriptions") return <Prescriptions />;
      if (page === "Reports") return <Reports />;
    }

    if (role === "receptionist") return <ReceptionistDashboard />;
    if (role === "doctor") return <DoctorDashboard />;

    return null;
  };

  const user = role ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const links = page === "Login" ? [] : (navLinks[role] || []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F8F0" }}>
      {role && page !== "Login" && (
        <div style={{
          backgroundColor: "#355872",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Typography style={{ color: "#F7F8F0", fontWeight: "bold", fontSize: "17px" }}>
              {user?.clinicName || "Darshan Clinic"}
            </Typography>
            <div style={{ display: "flex", gap: "4px" }}>
              {links.map((link) => (
                <Button
                  key={link}
                  size="small"
                  onClick={() => setPage(link)}
                  style={{
                    color: page === link ? "#355872" : "#F7F8F0",
                    backgroundColor: page === link ? "#9CD5FF" : "transparent",
                    textTransform: "none",
                    borderRadius: "5px",
                    padding: "4px 14px",
                    fontWeight: page === link ? "bold" : "normal",
                  }}
                >
                  {link}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Typography style={{ color: "#F7F8F0", fontSize: "13px" }}>
              {user?.name} &nbsp;
              <span style={{
                backgroundColor: "#9CD5FF",
                color: "#355872",
                padding: "2px 9px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600",
              }}>
                {user?.role}
              </span>
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={handleLogout}
              style={{ color: "#F7F8F0", borderColor: "#9CD5FF", textTransform: "none" }}
            >
              Logout
            </Button>
          </div>
        </div>
      )}

      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
