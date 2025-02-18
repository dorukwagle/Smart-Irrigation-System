import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import WaterUsageGraph from "../entities/WaterUsageGraph";
import { LineChart } from "@mui/x-charts";

interface Props {
    graph: WaterUsageGraph;
    onBack: () => void
}

const VisualizationPage = ({graph, onBack}: Props) => {
    
  return (
    <Card sx={{ width: "80%", margin: "0 auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Water Usage Graph
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          <LineChart 
            width={900}
            height={400}
            xAxis={[{ scaleType: "band", label: "Week Number", data: graph.graph.map(g => g.week) }]} 
            series={[{ data: graph.graph.map(g => g.waterUsage), label: "Water Usage (L)", area: true }]}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Irrigation Schedules
        </Typography>
        <div style={{ height: "250px", overflow: "auto" }}>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <tbody>
          <tr style={{ backgroundColor: "#413839" }}>
              <th style={{ padding: "8px" }}>Crop Age (Days)</th>
              <th style={{ padding: "8px" }}>Start Time</th>
              <th style={{ padding: "8px" }}>Stop Time</th>
            </tr>
          {
              graph?.schedules?.map((schedule, idx) => (
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
        </div>
        <Divider sx={{ my: 2 }} />
        </CardContent>
      <Button
        variant="contained"
        onClick={onBack}
        sx={{ display: "block", mx: "auto", mt: 2 }}
      >
        Back
      </Button>
    </Card>
  )
}

export default VisualizationPage;