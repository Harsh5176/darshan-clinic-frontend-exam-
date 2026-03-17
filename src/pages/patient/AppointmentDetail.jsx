import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import API from "../../api/axios";

function AppointmentDetail({ id, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    API.get(`/appointments/${id}`).then(res => {
      setData(res.data);
    }).catch(e => {
      setErr("Could not load appointment details.");
      console.error(e);
    }).finally(() => setLoading(false));
  }, [id]);

  const sectionStyle = {
    backgroundColor: "#fff",
    border: "1px solid #9CD5FF",
    borderRadius: "10px",
    padding: "20px 24px",
    marginBottom: "20px",
    maxWidth: "560px"
  };

  const labelStyle = { color: "#7AAACE", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" };

  return (
    <div style={{ padding: "30px", backgroundColor: "#F7F8F0", minHeight: "100vh" }}>
      <Button
        size="small"
        onClick={onBack}
        style={{ color: "#355872", border: "1px solid #9CD5FF", textTransform: "none", marginBottom: "18px" }}
      >
        &larr; Back to Appointments
      </Button>

      <Typography variant="h5" style={{ color: "#355872", marginBottom: "6px", fontWeight: "bold" }}>
        Appointment Details
      </Typography>

      {loading && <Typography style={{ color: "#7AAACE" }}>Loading...</Typography>}
      {err && <Typography style={{ color: "#e53e3e" }}>{err}</Typography>}

      {data && (
        <div>
          <div style={sectionStyle}>
            <Typography style={labelStyle}>Appointment Info</Typography>
            <Typography style={{ color: "#355872", marginBottom: "4px" }}>Date: {data.appointmentDate}</Typography>
            <Typography style={{ color: "#355872", marginBottom: "4px" }}>Time Slot: {data.timeSlot}</Typography>
            <Typography style={{ color: "#355872", marginBottom: "4px" }}>Status: &nbsp;
              <span style={{
                backgroundColor: "#9CD5FF",
                color: "#355872",
                padding: "2px 10px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                {data.queueEntry?.status || data.status}
              </span>
            </Typography>
            {data.queueEntry && (
              <Typography style={{ color: "#7AAACE", fontSize: "13px", marginTop: "4px" }}>
                Queue Token: #{data.queueEntry.tokenNumber}
              </Typography>
            )}
          </div>

          {data.prescription ? (
            <div style={sectionStyle}>
              <Typography style={labelStyle}>Prescription</Typography>
              {data.prescription.medicines?.map((m, i) => (
                <div key={i} style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: i < data.prescription.medicines.length - 1 ? "1px solid #9CD5FF" : "none" }}>
                  <Typography style={{ color: "#355872", fontWeight: "600" }}>{m.name}</Typography>
                  <Typography style={{ color: "#7AAACE", fontSize: "13px" }}>Dosage: {m.dosage} &bull; Duration: {m.duration}</Typography>
                </div>
              ))}
              {data.prescription.notes && (
                <Typography style={{ color: "#7AAACE", fontSize: "13px", marginTop: "8px" }}>
                  Notes: {data.prescription.notes}
                </Typography>
              )}
            </div>
          ) : (
            <div style={sectionStyle}>
              <Typography style={labelStyle}>Prescription</Typography>
              <Typography style={{ color: "#7AAACE", fontSize: "13px" }}>No prescription added yet.</Typography>
            </div>
          )}

          {data.report ? (
            <div style={sectionStyle}>
              <Typography style={labelStyle}>Medical Report</Typography>
              <Typography style={{ color: "#355872", marginBottom: "6px" }}>Diagnosis: {data.report.diagnosis}</Typography>
              {data.report.testRecommended && (
                <Typography style={{ color: "#7AAACE", fontSize: "13px", marginBottom: "6px" }}>
                  Tests: {data.report.testRecommended}
                </Typography>
              )}
              {data.report.remarks && (
                <Typography style={{ color: "#7AAACE", fontSize: "13px" }}>
                  Remarks: {data.report.remarks}
                </Typography>
              )}
            </div>
          ) : (
            <div style={sectionStyle}>
              <Typography style={labelStyle}>Medical Report</Typography>
              <Typography style={{ color: "#7AAACE", fontSize: "13px" }}>No report added yet.</Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AppointmentDetail;
