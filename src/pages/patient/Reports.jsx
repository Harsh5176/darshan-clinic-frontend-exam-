import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import API from "../../api/axios";

function Reports() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/reports/my").then(res => {
      setList(res.data);
    }).catch(e => {
      console.error("reports load failed", e);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>
        My Reports
      </Typography>
      <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "24px" }}>
        Medical reports from your doctor
      </Typography>

      {loading && <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>}

      {!loading && list.length === 0 && (
        <Typography style={{ color: "#7AAACE" }}>No reports found.</Typography>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {list.map((r, i) => (
          <div key={r.id || i} style={{
            backgroundColor: "#fff",
            border: "1px solid #9CD5FF",
            borderRadius: "10px",
            padding: "20px 24px",
            maxWidth: "560px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <Typography style={{ color: "#355872", fontWeight: "bold", fontSize: "14px" }}>
                Report #{i + 1}
              </Typography>
              <Typography style={{ color: "#7AAACE", fontSize: "12px" }}>
                Appt ID: {r.appointmentId}
              </Typography>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <Typography style={{ color: "#7AAACE", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Diagnosis</Typography>
              <Typography style={{ color: "#355872", fontWeight: "600" }}>{r.diagnosis}</Typography>
            </div>

            {r.testRecommended && (
              <div style={{ marginBottom: "8px" }}>
                <Typography style={{ color: "#7AAACE", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tests Recommended</Typography>
                <Typography style={{ color: "#355872" }}>{r.testRecommended}</Typography>
              </div>
            )}

            {r.remarks && (
              <div>
                <Typography style={{ color: "#7AAACE", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Remarks</Typography>
                <Typography style={{ color: "#355872" }}>{r.remarks}</Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
