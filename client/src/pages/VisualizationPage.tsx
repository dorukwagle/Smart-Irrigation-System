import { Button, Card, CardContent, Typography } from "@mui/material";
import WaterUsageGraph from "../entities/WaterUsageGraph";

interface Props {
    graph: WaterUsageGraph;
    onBack: () => void
}

const VisualizationPage = ({graph, onBack}: Props) => {
    
  return (
    <Card sx={{ width: "80%", margin: "0 auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Visualization Page
        </Typography>
        {/* Add your visualization content here */}
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