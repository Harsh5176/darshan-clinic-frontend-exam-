function Navbar({ role, currentPage, onNavigate }) {
  const navItems = {
    admin: ["Dashboard", "Users"],
    patient: ["Dashboard", "Book Appointment", "My Appointments", "Prescriptions", "Reports"],
    receptionist: ["Dashboard"],
    doctor: ["Dashboard"],
  };

  const items = navItems[role] || [];

  return (
    <div style={{
      background: "#355872",
      padding: "12px 24px",
      display: "flex",
      gap: "15px",
      alignItems: "center"
    }}>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onNavigate(item)}
          style={{
            background: currentPage === item ? "#7AAACE" : "transparent",
            color: "#F7F8F0",
            border: "none",
            padding: "8px 14px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: currentPage === item ? "600" : "400",
            fontSize: "14px",
            transition: "all 0.3s"
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default Navbar;