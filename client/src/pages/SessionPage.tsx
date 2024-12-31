import { Box, Button, Card, CardContent, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import useAddCropSession from "../hooks/useAddCropSession";
import SessionPagination from "../entities/SessionPagination";
import { useParams } from "react-router-dom";
import { Search } from "@mui/icons-material";
import useCropSessions from "../hooks/useCropSessions";
import CropSession from "../entities/CropSession";
import useCropTypes from "../hooks/useCropTypes";
import useSessionInfo from "../hooks/useSessionInfo";
import useUpdateCropSession from "../hooks/useUpdateCropSession";
import useDeleteCropSession from "../hooks/useDeleteCropSession";
import useActivateCropSession from "../hooks/useActivateSession";
import useDeactivateSession from "../hooks/useDeactivateSession";
import InfoModel from "../components/InfoModel";

const SessionPage = () => {
  const [showLeftCard, setShowLeftCard] = useState<boolean>(false);
  const [showRightBox, setShowRightBox] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const route = useParams<{ systemId: string }>();
  const cropTypes = useCropTypes();
  const { data: cropSessions, error: cropSessionsError } = useCropSessions(route.systemId || "", searchString);
  const { mutate: addCropSession, error: addCropSessionError } = useAddCropSession(() => setShowLeftCard(false));
  const cropSessionList = (cropSessions as SessionPagination)?.data;
  const [selectedCropSession, setSelectedCropSession] = useState<string>("");
  const { data: info, isLoading: infoLoading, error: sessionInfoError } = useSessionInfo(selectedCropSession);
  const sessionInfo = info && (info as CropSession[])[0];
  const { mutate: updateCropSession, error: updateCropSessionError } = useUpdateCropSession();
  const { mutate: deleteCropSession } = useDeleteCropSession(() => setShowRightBox(false));
  const { mutate: activateCropSession, error: activateCropSessionError } = useActivateCropSession();
  const { mutate: deactivateCropSession, error: deactivateCropSessionError } = useDeactivateSession();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const searchFieldRef = useRef<HTMLInputElement>(null);
  const [cropName, setCropName] = useState<string>("");
  const ageCountRef = useRef<HTMLInputElement>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [updateCropName, setUpdateCropName] = useState<string>("");
  const [updateAgeCount, setUpdateAgeCount] = useState<number>(0);

  const handleSearch = () => {
    if (!searchFieldRef.current || !searchFieldRef.current.value) return;
    setSearchString(searchFieldRef.current.value);
    console.log(searchString);
  };

  const handleAddCropSession = () => {
    setShowLeftCard(true);
  };

  const handleCreateSession = () => {
    const ageCount = parseInt(ageCountRef.current?.value || "0");
    if (!cropName || !ageCount || !route.systemId) return;
    const cropSession = { cropName, ageCount, systemId: route.systemId} as CropSession;
    addCropSession(cropSession);
  };

  const handleListItemClick = (cropSessionId: string) => {
    setSelectedCropSession(cropSessionId);
    setShowRightBox(true);
    setUpdateCropName("");
    setUpdateAgeCount(0);
  };


  const handleUpdate = () => {
    const cropSession = { systemId: route.systemId, cropSessionId: selectedCropSession} as CropSession;
    cropSession.cropName = updateCropName || sessionInfo?.cropName || "";
    cropSession.ageCount = updateAgeCount || sessionInfo?.ageCount || 0;

    if (!updateCropName && !updateAgeCount && !selectedCropSession) return;
    updateCropSession(cropSession);
    setIsEditable(false);
  };

  const handleActivateOrDeactivate = () => {
    if (sessionInfo?.sessionActive) {
      deactivateCropSession({ systemId: route.systemId, cropSessionId: selectedCropSession} as CropSession);
    } else {
      activateCropSession({ systemId: route.systemId, cropSessionId: selectedCropSession} as CropSession);
    }
  };

  return (
    <>
      <InfoModel 
        show={showDeleteConfirm}
        title="Delete Crop Session"
        body="Are you sure you want to delete this crop session?"
        onYes={() => {deleteCropSession({ systemId: route.systemId, cropSessionId: selectedCropSession} as CropSession);
          setShowDeleteConfirm(false);
        }}
        onNo={() => setShowDeleteConfirm(false)}
        buttonText={{ yes: "Yes", no: "No"}}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        {/* Left Card */}
        <Card sx={{ width: "25%", visibility: showLeftCard ? "visible" : "hidden", p: 2 }}>
          <CardContent>
            <Stack spacing={2}>
              {/* Crop Name */}
              <Select
                value={cropName}
                onChange={(event) => setCropName(event.target.value as string)}
                displayEmpty
                variant="standard"
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Select a crop type</em>;
                  }
                  return selected;
                }}
              >
                {cropTypes.data?.cropTypes.map((option: string) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {/* Age Count */}
              <TextField
                inputRef={ageCountRef}
                label="Age Count"
                variant="standard"
                type="number"
              />
              {/* Create Button */}
              {addCropSessionError && (
                <Typography color="error" variant="body1">
                  {addCropSessionError.message}
                </Typography>
              )}
              <Button variant="contained" onClick={handleCreateSession}>
                Create
              </Button>
            </Stack>
          </CardContent>
        </Card>
        {/* Center Section */}
        <Stack sx={{ width: "50%" }} spacing={2}>
          {/* Search Box */}
          <Stack direction="row" spacing={1}>
            <TextField
              inputRef={searchFieldRef}
              label="Search Crop Sessions"
              variant="standard"
              fullWidth
            />
            <Button variant="contained" onClick={handleSearch} startIcon={<Search fontSize="large" fontWeight="bold"/>}>
            </Button>
          </Stack>
          {/* List View of Crop Sessions */}
          <Box sx={{ height: "300px", overflow: "auto" }}>
            {cropSessionsError && <Typography color="error">{cropSessionsError.message}</Typography>}
            {cropSessionList && cropSessionList.length > 0 ? (
              cropSessionList.map((session) => (
                <Box
                  key={session.cropSessionId}
                  onClick={() => handleListItemClick(session.cropSessionId)}
                  sx={{ p: 1, cursor: "pointer" }}
                >
                  {/* Render session details here */}
                  <Typography
                    color={session.sessionActive ? "#34C759" : ""}
                    fontWeight={session.sessionActive ? 900 : 500}
                  >
                    {session.cropName}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No crop sessions exist</Typography>
            )}
          </Box>
          {/* Add Crop Session Button */}
          <Button variant="contained" onClick={handleAddCropSession}>
            Add Crop Session
          </Button>
        </Stack>
        {/* Right Box */}
        <Card sx={{ width: "25%", visibility: showRightBox ? "visible" : "hidden", p: 2 }}>
          <CardContent sx={{ p: 2 }}>
            {infoLoading ? (
              <Typography variant="h4" align="center">Loading...</Typography>
            ) : (
              <Stack direction="column" spacing={2}>
                {/* Crop Name */}
                <Select
                  value={updateCropName || sessionInfo?.cropName}
                  onChange={(event) => setUpdateCropName(event.target.value as string)}
                  displayEmpty
                  variant="standard"
                  renderValue={(selected) => {
                    if (!selected || !selected.length) {
                      return <em>Select a crop type</em>;
                    }
                    return selected;
                  }}
                  disabled={!isEditable}
                  fullWidth
                >
                  {cropTypes.data?.cropTypes.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {/* Age Count */}
                <TextField
                  label="Age Count"
                  variant="standard"
                  type="number"
                  disabled={!isEditable}
                  value={updateAgeCount || sessionInfo?.ageCount}
                  onChange={(event) => setUpdateAgeCount(Number(event.target.value))}
                  fullWidth
                />
                {/* Display any error for the update request */}
                {updateCropSessionError && (
                  <Typography color="error" variant="body1">
                    {updateCropSessionError.message}
                  </Typography>
                )}
                {activateCropSessionError && (
                  <Typography color="error" variant="body1">
                    {activateCropSessionError.message.endsWith("400") ? "Only one crop session can be active at a time" : activateCropSessionError.message}
                  </Typography>
                )}
                {deactivateCropSessionError && (
                  <Typography color="error" variant="body1">
                    {deactivateCropSessionError.message}
                  </Typography>
                )}
                {/* Edit, Update, Activate/Deactivate, and Delete Button */}
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => setIsEditable(true)} fullWidth>
                    Edit
                  </Button>
                  <Button variant="contained" onClick={handleUpdate} disabled={!isEditable} fullWidth>
                    Update
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                  {sessionInfo?.sessionActive ? (
                    <Button variant="contained" onClick={handleActivateOrDeactivate} fullWidth>
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleActivateOrDeactivate} fullWidth>
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteConfirm(true)}
                    sx={{ alignSelf: "center", width: "100%" }}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}

export default SessionPage;