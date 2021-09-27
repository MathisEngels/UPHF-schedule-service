import { CheckCircle, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from "@mui/material";
import { minToStrHours } from "../utils/algorithms";

function Dropdown(props) {
    if (!props.data || props.data.length === 0) return <></>;
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ width: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant={"h6"}>{props.title}</Typography>
                    <Box sx={{ marginRight: 2, display: "flex", alignItems: "center" }}>
                        {props.data.length > 0 && (
                            <>
                                <Typography align={"right"}>
                                    {props.data[0].key} - {minToStrHours(props.data[0].spent)}/{minToStrHours(props.data[0].total)}
                                </Typography>
                                <CheckCircle color={props.data[0].spent === props.data[0].total ? "success" : "disabled"} sx={{ marginLeft: 2 }} />
                            </>
                        )}
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {props.data.map((value, i) => {
                    if (i === 0) return <Box key={i} />;
                    return (
                        <Box key={i}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: 1,
                                    marginBottom: 1,
                                }}
                            >
                                <Typography>{value.key}</Typography>
                                <Box sx={{ display: "flex" }}>
                                    <Typography align={"right"}>
                                        {minToStrHours(value.spent)}/{minToStrHours(value.total)}
                                    </Typography>
                                    <CheckCircle color={value.spent === value.total ? "success" : "disabled"} sx={{ marginLeft: 4 }} />
                                </Box>
                            </Box>
                            {i !== props.data.length - 1 && (
                                <>
                                    <Divider />
                                </>
                            )}
                        </Box>
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
}

export default Dropdown;
