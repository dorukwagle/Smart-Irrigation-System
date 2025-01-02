import { useParams } from "react-router-dom";
import useSessionStat from "../hooks/useSessionStat";
import { Button, Card, CardContent, Divider, Typography } from "@mui/material";
import useWaterUsageGraph from "../hooks/useWaterUsageGraph";
import useSessionInfo from "../hooks/useSessionInfo";
import CropSession from "../entities/CropSession";
import { useState } from "react";
import VisualizationPage from "./VisualizationPage";

const SessionStatisticsPage = () => {
  const params = useParams<{ systemId: string, sessionId: string }>();
  const {data: statistics, isLoading: sessionStatLoading, error: sessionStatError} = useSessionStat(params.systemId || "", params.sessionId || "");
  const { data: waterUsageGraph, isLoading: graphLoading, error: graphError } = useWaterUsageGraph(params.systemId || "", params.sessionId || "");
  const { data: info, isLoading: infoLoading, error: infoError} = useSessionInfo(params.sessionId || "");
  const sessionInfo = info && (info as CropSession[])[0];
  const [showVisualization, setShowVisualization] = useState(false);
  
  if (!params.systemId || !params.sessionId) return <Typography variant="h4">No such system</Typography>;
  if (sessionStatLoading || graphLoading || infoLoading) return <Typography variant="h4">Loading...</Typography>;
  if (sessionStatError || graphError || infoError) return <Typography variant="h4">Error Fetching Data: {sessionStatError?.message || graphError?.message || infoError?.message}</Typography>;

  if (showVisualization) return <VisualizationPage graph={waterUsageGraph!} onBack={() => setShowVisualization(false)} />

  return (
    <Card sx={{ width: "50vw", margin: "0 auto", mt: 5, p: 2 }}>
      <CardContent sx={{ width: "100%" }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          {sessionInfo?.cropName} Session Statistics
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ backgroundColor: "#282828" }}>
              <th style={{ padding: "8px" }}>Operation Days</th>
              <td style={{ padding: "8px" }}>{statistics?.operationDays} Days</td>
            </tr>
            <tr style={{ backgroundColor: "#413839" }}>
              <th style={{ padding: "8px" }}>Operation Weeks</th>
              <td style={{ padding: "8px" }}>{statistics?.operationWeeks} Weeks</td>
            </tr>
            <tr style={{ backgroundColor: "#282828" }}>
              <th style={{ padding: "8px" }}>Irrigation Duration</th>
              <td style={{ padding: "8px" }}>{statistics?.irrigationDuration} Hours</td>
            </tr>
            <tr style={{ backgroundColor: "#413839" }}>
              <th style={{ padding: "8px" }}>Total Water Consumed</th>
              <td style={{ padding: "8px" }}>{statistics?.totalWaterConsumed} Litres</td>
            </tr>
          </tbody>
        </table>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Irrigation Schedules
        </Typography>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <tbody>
          <tr style={{ backgroundColor: "#413839" }}>
              <th style={{ padding: "8px" }}>Crop Age (Days)</th>
              <th style={{ padding: "8px" }}>Start Time</th>
              <th style={{ padding: "8px" }}>Stop Time</th>
            </tr>
          {
              waterUsageGraph?.schedules?.map((schedule, idx) => (
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
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowVisualization(true)}
          sx={{ display: "block", mx: "auto", mt: 2 }}
        >
          Visualize Statistics
        </Button>
      </CardContent>
    </Card>
  )
}

export default SessionStatisticsPage;