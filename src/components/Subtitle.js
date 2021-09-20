import { Typography } from "@mui/material";

function Subtitle(props) {
    return (
        <Typography variant={"subtitle2"} sx={{ fontSize: 12, color: "#808080", ...props.sx }} align={props.inherit ? "inherit" : "center"}>
            {props.value}
        </Typography>
    );
}

export default Subtitle;
