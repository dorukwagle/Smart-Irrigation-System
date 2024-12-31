import { useNavigate, useParams } from "react-router-dom";
import usePreference from "../hooks/usePreference";
import {
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import useUpdatePreference from "../hooks/useUpdatePreference";
import useSystemInfo from "../hooks/useSystemInfo";
import System from "../entities/System";
import Preference from "../entities/Preference";

const PreferencePage = () => {
    const params = useParams<{ systemId: string }>();
    const { data: info, error: systemInfoError } = useSystemInfo(
        params.systemId || ""
    );
    const systemInfo = info && (info as System[])[0];
    const {
        data: preference,
        isLoading,
        error: preferenceError,
    } = usePreference(params.systemId || "");
    const { mutate: updatePreference, error: updatePreferenceError } =
        useUpdatePreference(params.systemId || "");
    const navigate = useNavigate();

    const handleUpdatePreference = (
        isManualOverride: boolean,
        isIrrigationActive: boolean
    ) => {
        if (!systemInfo) return;
        const preference = {
            systemId: systemInfo.systemId,
            isManualOverride,
            isIrrigationActive,
        } as Preference;
        updatePreference(preference);
    };

    if (!params.systemId)
        return (
            <Typography variant="h1" align="center" sx={{ mt: 4, mb: 2 }}>
                This page doesn't exist
            </Typography>
        );

    if (isLoading)
        return (
            <Typography variant="h1" align="center" sx={{ mt: 4, mb: 2 }}>
                Loading...
            </Typography>
        );

    return (
        <Card
            sx={{
                width: "30vw",
                margin: "0 auto",
                marginTop: 5,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <CardContent sx={{ width: "100%" }}>
                <Typography variant="h4" align="center">
                    {systemInfo?.systemName}
                </Typography>
                <Divider />
                {systemInfoError || preferenceError || updatePreferenceError ? (
                    <Typography variant="h5" color="error" align="center">
                        {systemInfoError
                            ? "Error loading system info"
                            : preferenceError
                            ? "Error loading preferences"
                            : updatePreferenceError
                            ? "Error updating preferences"
                            : ""}
                    </Typography>
                ) : null}
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{ mt: 2, width: "100%" }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                    >
                        <Typography variant="h5">Manual Override</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1">Off</Typography>
                            <Switch
                                checked={Boolean(preference?.isManualOverride)}
                                onChange={() =>{
                                    handleUpdatePreference(
                                        !Boolean(preference?.isManualOverride),
                                        Boolean(preference?.isIrrigationActive)
                                    );
                                  }
                                }
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <Typography variant="body1">On</Typography>
                        </Stack>
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                    >
                        <Typography variant="h5">Irrigation Status</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1">Off</Typography>
                            <Switch
                                checked={Boolean(
                                    preference?.isIrrigationActive
                                )}
                                disabled={!Boolean(preference?.isManualOverride)}
                                onChange={() => handleUpdatePreference(Boolean(preference?.isManualOverride), !Boolean(preference?.isIrrigationActive))}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <Typography variant="body1">On</Typography>
                        </Stack>
                    </Stack>
                    <Button
                        variant="contained"
                        onClick={() => navigate(-1)}
                        sx={{ width: "100%" }}
                    >
                        Go Back
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PreferencePage;
