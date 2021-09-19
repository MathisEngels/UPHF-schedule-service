import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import toast from "react-hot-toast";
import { login } from "../utils/api";

function Login({ setToken }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const token = await login(data.get("password"));

        if (token) {
            setToken(token);
            toast.success("u not that stupid");
        } else {
            toast.error("who are u 👁️👄👁️");
        }
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Typography component="h1" variant="h5">
                Log in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Log In
                </Button>
            </Box>
        </Box>
    );
}

export default Login;
