import { useState } from "react";
import System from "../entities/System";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Save } from "@mui/icons-material";
import useAddSystem from "../hooks/useAddSystem";


interface Props {
    onBack: () => void;
}

const SystemForm = ({onBack}: Props) => {
    const [systemName, setSystemName] = useState<string>("");
    const [pumpFlowRate, setPumpFlowRate] = useState<number | undefined>(0);
    const {mutate, data, error} = useAddSystem();
    const system = data && (data as System[])[0];

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (!systemName || !pumpFlowRate) return;

        const system = { systemName, pumpFlowRate } as System;
        mutate(system);
    };

    const CopyIdentifier = () => {
        return (
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Typography variant="body1" align="center">
                    {system?.identifier}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => {
                        navigator.clipboard.writeText(system?.identifier!);
                    }}
                >
                    Copy
                </Button>
            </Stack>
    )};

    return (
        <>
            <Stack direction="column" spacing={2} sx={{ mx: 2, mt: 2 }}>
                <Typography variant="h4" align="center">Add new System</Typography>
                <Stack direction="column" spacing={2}>
                    <TextField
                        value={systemName}
                        onChange={(e) => setSystemName(e.target.value)}
                        label="System Name"
                        variant="outlined"
                    />
                    <TextField
                        value={pumpFlowRate}
                        onChange={(e) => setPumpFlowRate(Number(e.target.value))}
                        label="Pump Flow Rate"
                        variant="outlined"
                        type="number"
                    />
                </Stack>
                {system && system.identifier && <CopyIdentifier />}
                {error && (
                    <Typography color="error" align="center">
                        {error.message}
                    </Typography>
                )}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button onClick={onBack}>Back</Button>
                    <Button variant="contained" endIcon={<Save />} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};

export default SystemForm;