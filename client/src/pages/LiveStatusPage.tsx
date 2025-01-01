import { useParams } from "react-router-dom";
import useLiveStatus from "../hooks/useLiveStatus";
import useSystemInfo from "../hooks/useSystemInfo";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import System from "../entities/System";

const LiveStatusPage = () => {
  const params = useParams<{ systemId: string }>();
  const systemId = params.systemId;
  const {data: info, error: systemInfoError} = useSystemInfo(systemId || "");
  const systemInfo = info && (info as System[])[0];
  const { data: liveStatus, isLoading, error: liveStatusError } = useLiveStatus(systemId || "");

  if (!systemId) return <Typography variant="h4">No such system</Typography>;

  if (isLoading) return <Typography variant="h4">Loading...</Typography>;

  if (systemInfoError || liveStatusError) return <Typography variant="h4">Error Fetching Data: {systemInfoError?.message || liveStatusError?.message}</Typography>;

  return (
    <Card sx={{ width: "50vw", m: "0 auto", mt: 5, p: 2 }}>
      <CardContent sx={{ width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          {`${systemInfo?.systemName} ${liveStatus?.manualOverride ? " (Manual Mode)" : ""}`}
        </Typography>
        <Divider />
        <Divider  />
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <tbody>
            {
              [
                { title: "Crop", value: `${liveStatus?.activeSession?.cropName}` || "No Active Crop" },
                { title: "Age", value: `${liveStatus?.activeSession?.ageCount} Days` || "No Active Crop" },
              ].map(({ title, value }, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#413839" : "#666362" }}>
                  <th style={{ padding: "8px" }}>{title}</th>
                  <td style={{ padding: "8px" }}>{value}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Divider  />
        <Divider />
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <tbody>
            {
              [
                { title: "Temperature", value: `${liveStatus?.liveStatus.temperature || ""} \u00B0C` },
                { title: "Humidity", value: `${liveStatus?.liveStatus.humidity || ""} %` },
                { title: "Moisture", value: `${liveStatus?.liveStatus.moisture || ""} %` },
                { title: "Irrigation Status", value: liveStatus?.liveStatus.irrigationStatus },
                { title: "Last Updated", value: liveStatus?.liveStatus.updatedAt
                  ? new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(liveStatus.liveStatus.updatedAt))
                  : ""
                },
              ].map(({ title, value }, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#413839" : "#666362" }}>
                  <th style={{ padding: "8px" }}>{title}</th>
                  <td style={{ padding: "8px" }}>{value}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Divider sx={{ mt: 2, pb: 2 }} />
        <Typography variant="h6" align="center" fontWeight={600}>Irrigation Schedules</Typography>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ backgroundColor: "#413839" }}>
              <th style={{ padding: "8px" }}>Crop Age (Days)</th>
              <th style={{ padding: "8px" }}>Start Time</th>
              <th style={{ padding: "8px" }}>Stop Time</th>
            </tr>
            {
              liveStatus?.schedules.map((schedule, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#413839" : "#666362" }}>
                  <td style={{ padding: "8px" }}>
                    {schedule.cropAge}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(schedule.irrigationStartTime))}
                    </td>
                  <td style={{ padding: "8px" }}>
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(schedule.irrigationStopTime))}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default LiveStatusPage;