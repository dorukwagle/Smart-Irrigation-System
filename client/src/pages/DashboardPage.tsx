import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Save, Search } from "@mui/icons-material";
import { useRef, useState } from "react";
import useSystems from "../hooks/useSystems";
import SystemForm from "../components/SystemForm";
import SystemPagination from "../entities/SystemPagination";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const [searchString, setSearchString] = useState<string | undefined>(
        undefined
    );
    const navigate = useNavigate();
    const searchFieldRef = useRef<HTMLInputElement>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const { data, error } = useSystems(searchString);
    const systems = (data as SystemPagination)?.data;

    const handleSearch = () => {
        if (!searchFieldRef.current || !searchFieldRef.current.value) return;

        setSearchString(searchFieldRef.current.value);
    };

    if (showForm) return <SystemForm onBack={() => setShowForm(false)}/>;
    
    return (
        <Stack spacing={2} sx={{ p: 2, mx: 3 }}>
            {/* Search Bar Section */}
            <Stack direction="row" spacing={1}>
                <TextField
                    inputRef={searchFieldRef}
                    label="Search Systems"
                    variant="outlined"
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    startIcon={<Search />}
                >
                    Search
                </Button>
            </Stack>

            {/* List View Section */}
            <Box sx={{ height: "300px", overflow: "auto" }}>
                {error && (
                    <Typography color="error">{error.message}</Typography>
                )}
                {systems &&
                    systems.map((system) => (
                        <Box
                            key={system.systemId}
                            onClick={() => navigate(`/dashboard/${system.systemId}`)}
                            sx={{
                                p: 1,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#0a0a0a" },
                            }}
                        >
                            <Typography variant="body1">
                                {system.systemName}
                            </Typography>
                        </Box>
                    ))}
                {systems && !systems.length && (
                    <Typography>No systems found</Typography>
                )}
            </Box>

            {/* Add System Button Section */}
            <Button
                variant="contained"
                color="secondary"
                startIcon={<Save />}
                onClick={() => setShowForm(true)}
            >
                Add System
            </Button>
        </Stack>
    );
};

export default DashboardPage;
