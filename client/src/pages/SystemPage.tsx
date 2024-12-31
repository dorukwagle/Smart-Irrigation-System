import { useNavigate, useParams } from "react-router-dom";
import useDeleteSystem from "../hooks/useDeleteSystem";
import useSystemInfo from "../hooks/useSystemInfo";
import useUpdateSystem from "../hooks/useUpdateSystem";
import { Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import System from "../entities/System";
import InfoModel from "../components/InfoModel";
import { ContentCopyTwoTone, Restore } from "@mui/icons-material";
import useRegenerateIdentifier from "../hooks/useRegenerateIdentifier";

const SystemPage = () => {
  const { mutate: updateSystem, error: updateError } = useUpdateSystem();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showUpdateError, setShowUpdateError] = useState(Boolean(updateError));
  const { data, error } = useSystemInfo(params.id || "");
  const systemInfo = data && (data as System[])[0];
  
  const { mutate: deleteSystem } = useDeleteSystem(() => navigate("/dashboard"));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const {mutate: regenerateIdentifier} = useRegenerateIdentifier();

  const [isEditing, setIsEditing] = useState(false);
  const systemNameRef = useRef<HTMLInputElement>(null);
  const pumpFlowRateRef = useRef<HTMLInputElement>(null);

  if (!(systemInfo?.systemId)) return (
    <Stack sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Typography variant="h4" align="center">System not found</Typography>
    </Stack>
  );


  const onSystemEdit = () => {
    if (!systemNameRef.current || !pumpFlowRateRef.current) return;
    const systemName = systemNameRef.current.value;
    const pumpFlowRate = parseInt(pumpFlowRateRef.current.value);

    updateSystem({ systemId: systemInfo.systemId, systemName, pumpFlowRate } as System);
    setIsEditing(false);
  };

  if (!systemInfo) return ;
  if (error) return <div>Error loading system info</div>;

  return (
    <>
    <InfoModel 
        show={showUpdateError}
        title="Error"
        body={"Update Failed: " + updateError?.message}
        buttonText={{ yes: "Reload" }}
        onYes={() => setShowUpdateError(false)}
    />
    <InfoModel 
        show={confirmDelete}
        title="Confirm Delete"
        body="Are you sure you want to delete this system?"
        buttonText={{ yes: "Delete", no: "Cancel" }}
        onYes={() => deleteSystem(systemInfo.systemId)}
        onNo={() => setConfirmDelete(false)}
    />
    <InfoModel 
        show={showRegenerate}
        title="Are you sure ? Regenerate the system identifier?"
        body="This logs off the system, you need to copy the identifier and then update it into the system"
        buttonText={{ yes: "Regenerate", no: "Cancel" }}
        onYes={() => {regenerateIdentifier(systemInfo.systemId); 
          setShowRegenerate(false)}
        }
        onNo={() => setShowRegenerate(false)}
    />
      <Card sx={{ maxWidth: "50vw", m: "auto", p: 2 }}>
        <CardContent>
          <Stack spacing={2} direction="row">
            <Stack spacing={2} flex={1}>
              <TextField
                label="System Name"
                value={systemInfo.systemName}
                variant="standard"
                disabled={!isEditing}
                fullWidth
              />
              <TextField
                label="Pump Flow Rate"
                variant="standard"
                value={systemInfo.pumpFlowRate}
                disabled={!isEditing}
                fullWidth
                type="number"
              />
            </Stack>
            <Stack spacing={1}>
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="contained" onClick={onSystemEdit} disabled={!isEditing}>
                Submit
              </Button>
              <Button variant="contained" color="error" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ my: 2 }}>
            <Typography variant="body1">Identifier:</Typography>
            <TextField
              value={systemInfo?.identifier || ""}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => navigator.clipboard.writeText(systemInfo?.identifier!)}
                    >
                      <ContentCopyTwoTone />
                    </Button>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => setShowRegenerate(true)}
                    >
                      <Restore color="error"/>
                    </Button>
                  </Stack>
                ),
              }}
              disabled
              fullWidth
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="column" spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/session/${systemInfo.systemId}`)}
            >
              Manage Sessions
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/dashboard/${systemInfo.systemId}/status`)}
            >
              Live Status
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/dashboard/${systemInfo.systemId}/statistics`)}
            >
              View Statistics
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/dashboard/${systemInfo.systemId}/statistics`)}
            >
              Preferences
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default SystemPage;

