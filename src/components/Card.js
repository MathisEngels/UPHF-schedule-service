import { Paper, Typography } from "@mui/material";

function Card(props) {
    return (
        <Paper
            elevation={8}
            sx={{
                width: "200px",
                height: "200px",
                padding: 2,
                margin: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant={"h6"} align={"center"} sx={{ marginBottom: 1 }}>
                {props.title}
            </Typography>
            {props.children}
        </Paper>
    );
}

export default Card;
