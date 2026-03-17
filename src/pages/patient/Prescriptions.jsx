import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import API from "../../api/axios";

function Prescriptions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/prescriptions/my").then(res => {
      setList(res.data);
    }).catch(e => {
      console.error("prescriptions load failed", e);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>
        My Prescriptions
      </Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "24px" }}>
        Prescriptions added by your doctor
      </Typography>

      {loading && <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>}

      {!loading && list.length === 0 && (
        <Typography style={{ color: "#7AAACE" }}>No prescriptions found.</Typography>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {list.map((p, i) => (
          <div key={p.id || i} style={{
            backgroundColor: "#fff",
            border: "1px solid #9CD5FF",
            borderRadius: "10px",
            padding: "20px 24px",
            maxWidth: "560px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <Typography style={{ color: "#355872", fontWeight: "bold", fontSize: "14px" }}>
                Prescription #{i + 1}
              </Typography>
              <Typography style={{ color: "#7AAACE", fontSize: "12px" }}>
                Appt ID: {p.appointmentId}
              </Typography>
            </div>

            {p.medicines?.map((m, j) => (
              <div key={j} style={{
                backgroundColor: "#F7F8F0",
                borderRadius: "6px",
                padding: "10px 14px",
                marginBottom: "8px",
                border: "1px solid #9CD5FF"
              }}>
                <Typography style={{ color: "#355872", fontWeight: "600", fontSize: "14px" }}>{m.name}</Typography>
                <Typography style={{ color: "#7AAACE", fontSize: "12px" }}>
                  Dosage: {m.dosage} &bull; Duration: {m.duration}
                </Typography>
              </div>
            ))}

            {p.notes && (
              <Typography style={{ color: "#7AAACE", fontSize: "13px", marginTop: "10px" }}>
                Notes: {p.notes}
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prescriptions;
