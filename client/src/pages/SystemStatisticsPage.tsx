import { useNavigate, useParams } from "react-router-dom";
import useCropSessions from "../hooks/useCropSessions";
import useSystemStats from "../hooks/useSystemStats";
import { Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import SessionPagination from "../entities/SessionPagination";

const SystemStatisticsPage = () => {
    const params = useParams<{ systemId: string }>();
    const [search, setSearch] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);
    const {data: sessionData, isLoading: sessionsLoading, error: sessionsError} = useCropSessions(params.systemId || "", search);
    const sessions = sessionData && (sessionData as SessionPagination)?.data;
    const {data: systemStat, isLoading: systemStatLoading, error: systemStatError} = useSystemStats(params.systemId || "");
    const navigate = useNavigate();

    if (!params.systemId) return <Typography variant="h4">No such system</Typography>;
    if (sessionsLoading || systemStatLoading) return <Typography variant="h4">Loading...</Typography>;
    if (sessionsError || systemStatError) return <Typography variant="h4">Error Fetching Data: {sessionsError?.message || systemStatError?.message}</Typography>;

    const handleSearch = () => {
        if (!searchRef.current || !searchRef.current.value) return setSearch("");
        setSearch(searchRef.current.value);
    };

  return (
    <Card sx={{ width: "50%", margin: "0 auto", mt: 0, p: 2 }}>
      <CardContent>
        <Box sx={{ height: "250px", overflow: "auto", mb: 2 }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th colSpan={2} style={{ textAlign: "center", padding: "10px", fontSize: "1.2em", backgroundColor: "#282828", color: "#fff" }}>
                  System Statistics
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: "#3e3e3e" }}>
                <td style={{ padding: "10px", fontWeight: "bold", color: "#fff" }}>Irrigation Duration:</td>
                <td style={{ padding: "10px", color: "#fff" }}>{systemStat?.irrigationDuration} Hours</td>
              </tr>
              <tr style={{ backgroundColor: "#5c5c5c" }}>
                <td style={{ padding: "10px", fontWeight: "bold", color: "#fff" }}>Operation Days:</td>
                <td style={{ padding: "10px", color: "#fff" }}>{systemStat?.operationDays}</td>
              </tr>
              <tr style={{ backgroundColor: "#3e3e3e" }}>
                <td style={{ padding: "10px", fontWeight: "bold", color: "#fff" }}>Operation Weeks:</td>
                <td style={{ padding: "10px", color: "#fff" }}>{systemStat?.operationWeeks}</td>
              </tr>
              <tr style={{ backgroundColor: "#5c5c5c" }}>
                <td style={{ padding: "10px", fontWeight: "bold", color: "#fff" }}>Total Water Usage:</td>
                <td style={{ padding: "10px", color: "#fff" }}>{systemStat?.totalWaterConsumed} Litres</td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ height: "300px", overflow: "auto" }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Age (Days)</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.map((session, idx) => (
                <tr key={session.cropSessionId} style={{ backgroundColor: idx % 2 === 0 ? "#413839" : "#666362", cursor: "pointer" }} onClick={() => navigate(`/statistics/${params.systemId}/${session.cropSessionId}`)}>
                  <td>{session.cropName}</td>
                  <td>{session.ageCount}</td>
                  <td>{new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(session.createdAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SystemStatisticsPage;