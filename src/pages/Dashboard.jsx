/* eslint-disable react-hooks/exhaustive-deps */
import FullCalendar from '@fullcalendar/react';
import momentPlugin from '@fullcalendar/moment'
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { Cancel, CheckCircle, ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    Container,
    Divider,
    Drawer,
    Grid,
    IconButton,
    Link,
    MenuItem,
    Select,
    Skeleton,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import chroma from "chroma-js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { Card, Dropdown, Subtitle } from "../components";
import { getScheduleStats, getStatusStats, minToStrHours } from "../utils/algorithms";
import { getSchedule, getStatus, updateSchedule, verify } from "../utils/api";
import "./Dashboard.css";
//import "./Test.css";

function Dashboard({ token, deleteToken }) {
    const gradient = chroma.scale(["#e5405e", "#ffdb3a", "#3fffa2"]);
    const isDesktop = useMediaQuery("(min-width:750px)");
    const calendarRef = useRef(null);

    const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
    const [confettiRunning, setConfettiRunning] = useState(false);
    const [user, setUser] = useState();
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [timespan, setTimespan] = useState("year");
    const [beginFinishDates, setBeginFinishDates] = useState();
    const [scheduleData, setScheduleData] = useState();
    const [events, setEvents] = useState();
    const [statusData, setStatusData] = useState();
    const [scheduleStats, setScheduleStats] = useState({
        percentage: 0,
        minTotal: 0,
        minSpent: 0,
        minBySubjects: [],
        minByType: [],
        minByTeachers: [],
        minByLocations: [],
        numOfClassAfter: 0,
    });
    const [statusStats, setStatusStats] = useState({
        percentage: 0,
        aliveTimes: 0,
        currentlyAlive: false,
        lastUpdate: null,
        firstUpdate: null,
        numOfUpdates: 0,
    });
    const [updateToastID, setUpdateToastID] = useState(null);

    useEffect(() => {
        async function verifyToken() {
            const auth = await verify(token);
            if (!auth) {
                deleteToken();
                toast.error("nah but fr who are u 👀");
            }
        }
        verifyToken();
        setUser(jwt.decode(token));
        getStatusData();
    }, []);
    useEffect(() => {
        if (isDesktop) {
            calendarRef.current.getApi().changeView("timeGridWeek");
        } else {
            calendarRef.current.getApi().changeView("timeGridDay");
        }
    }, [isDesktop]);
    useEffect(() => {
        if (user) setSelectedSchedule(user.schedules[0]);
    }, [user]);
    useEffect(() => {
        if (selectedSchedule) getScheduleData();
    }, [selectedSchedule]);
    useEffect(() => {
        if (statusData) {
            updateStatusStats();
        }
    }, [statusData]);
    useEffect(() => {
        let beginDate;
        let finishDate;
        switch (timespan) {
            case "day":
                beginDate = moment().startOf("day");
                finishDate = moment().endOf("day");
                break;
            case "week":
                beginDate = moment().startOf("isoWeek").startOf("day");
                finishDate = moment().endOf("isoWeek").endOf("day");
                break;
            case "month":
                beginDate = moment().startOf("month").startOf("day");
                finishDate = moment().endOf("month").endOf("day");
                break;
            case "semester":
                beginDate = moment("2021-09-01").startOf("day");
                finishDate = moment("2021-12-18").endOf("day");
                break;
            case "year":
                beginDate = null;
                finishDate = null;
                break;
            case "vacation":
                beginDate = moment("2021-09-01").startOf("day");
                const allSaints = moment("2021-10-23").endOf("day");
                const christmas = moment("2021-12-18").endOf("day");
                const winter = moment("2022-02-12").endOf("day");
                const spring = moment("2022-04-16").endOf("day");
                const summer = moment("2022-07-16").endOf("day");
                if (moment().isBefore(allSaints)) {
                    finishDate = allSaints;
                } else if (moment().isBefore(christmas)) {
                    finishDate = christmas;
                } else if (moment().isBefore(winter)) {
                    finishDate = winter;
                } else if (moment().isBefore(spring)) {
                    finishDate = spring;
                } else finishDate = summer;
                break;
            default:
                finishDate = null;
                break;
        }
        setBeginFinishDates({ beginDate: beginDate, finishDate: finishDate });
    }, [timespan]);
    useEffect(() => {
        if (scheduleData) {
            setEvents(scheduleData.events);
        }
    }, [scheduleData]);
    useEffect(() => {
        if (scheduleData && beginFinishDates) updateScheduleStats();
    }, [scheduleData, beginFinishDates]);
    useEffect(() => {
        if (scheduleStats.percentage === 100) setConfettiRunning(true);
    }, [scheduleStats.percentage]);

    const getScheduleData = async () => {
        const data = await getSchedule(token, selectedSchedule);
        if (!data) {
            toast.error("u brok the internet");
        } else {
            setScheduleData(data);
        }
    };
    const getStatusData = async () => {
        const data = await getStatus(token);
        if (!data) {
            toast.error("omg u h4k3r stop");
        } else {
            setStatusData(data);
        }
    };
    const updateScheduleData = async () => {
        const success = await updateSchedule(token, selectedSchedule);
        if (success) {
            getScheduleData();
        } else if (updateToastID) {
            toast.error("idk man the thing is broken", {
                id: updateToastID,
            });

            setUpdateToastID(null);
        }
    };
    const updateScheduleStats = () => {
        setScheduleStats(getScheduleStats(scheduleData.events, beginFinishDates.beginDate, beginFinishDates.finishDate, 17));
        if (updateToastID) {
            toast.success("tada new data", {
                id: updateToastID,
            });

            setUpdateToastID(null);
        }
    };
    const updateStatusStats = () => {
        setStatusStats(getStatusStats(statusData));
    };

    const onConfettiComplete = () => {
        setConfettiRunning(false);
    };
    const handleUpdate = () => {
        const toastID = toast.loading("updating plz wait");
        setUpdateToastID(toastID);
        updateScheduleData();
    };
    const handleDateLimitChange = (event, newValue) => {
        if (event.target.value !== "") {
            setTimespan(event.target.value);
        } else {
            setTimespan(newValue);
        }
    };
    const toggleSidebarMenu = () => {
        setSidebarMenuOpen(!sidebarMenuOpen);
    };
    const handleSelectedScheduleChange = (value) => {
        if (value !== selectedSchedule) {
            setSelectedSchedule(value);
            toggleSidebarMenu();
        }
    };
    const logOut = () => {
        toast.success("bbye u stinky man");
        deleteToken();
    };

    const Calendar = () => {
        return (
            <>
                <FullCalendar
                    plugins={[momentPlugin, timeGridPlugin]}
                    initialView={"timeGridWeek"}
                    height={"auto"}
                    locale={frLocale}
                    weekends={false}
                    allDaySlot={false}
                    events={events}
                    eventContent={renderEventContent}
                    nowIndicator
                    slotMinTime={"07:00:00"}
                    slotMaxTime={"19:00:00"}
                    ref={calendarRef}
                />
            </>
        );
    };
    const renderEventContent = (props) => {
        return (
            <Tooltip
                followCursor
                title={
                    <Box sx={{ padding: "2px", textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 600 }}>{props.event.extendedProps.name}</Typography>
                        <Typography sx={{ fontWeight: 100, fontSize: 12, fontStyle: "italic" }}>{props.event.extendedProps.location}</Typography>
                        <Typography sx={{ fontWeight: 100, fontSize: 12, fontStyle: "italic" }}>
                            {props.event.extendedProps.type} - {props.event.extendedProps.teacher}
                        </Typography>
                    </Box>
                }
            >
                <Box sx={{ padding: "2px", textAlign: "center", height: 1, width: 1, overflow: "hidden" }}>
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                        {props.event.extendedProps.name}
                    </Typography>
                    <Typography noWrap sx={{ fontWeight: 100, fontSize: 12, fontStyle: "italic" }}>
                        {props.event.extendedProps.location}
                    </Typography>
                    <Typography noWrap sx={{ fontWeight: 100, fontSize: 12, fontStyle: "italic" }}>
                        {props.event.extendedProps.type} - {props.event.extendedProps.teacher}
                    </Typography>
                </Box>
            </Tooltip>
        );
    };
    const InfoPanel = () => {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                <IconButton onClick={toggleSidebarMenu} sx={{ position: "absolute", right: "8px" }}>
                    <Menu />
                </IconButton>
                {user && scheduleData ? (
                    <>
                        <Typography variant={"h4"}>{scheduleData.name}</Typography>
                        <Subtitle value={`Dernière update : ${moment(scheduleData.lastUpdate).format("HH:mm:ss - DD/MM/YYYY")}`} />
                        <Subtitle value={`Dernier essai : ${moment(scheduleData.lastTry).format("HH:mm:ss - DD/MM/YYYY")}`} />
                        <Button
                            sx={{ marginTop: 2, marginBottom: 2 }}
                            variant="outlined"
                            disabled={user.role !== "admin" || updateToastID}
                            onClick={handleUpdate}
                        >
                            Update
                        </Button>
                    </>
                ) : (
                    <>
                        <Skeleton variant={"text"} />
                        <Skeleton variant={"text"} />
                        <Skeleton variant={"rectangular"} />
                        <Skeleton variant={"rectangular"} />
                    </>
                )}
            </Box>
        );
    };
    const DateLimitMenu = () => {
        return isDesktop ? (
            <>
                <Tabs centered variant={"fullWidth"} value={timespan} onChange={handleDateLimitChange}>
                    <Tab label={"Jour"} value={"day"} />
                    <Tab label={"Semaine"} value={"week"} />
                    <Tab label={"Mois"} value={"month"} />
                    <Tab label={"Semestre"} value={"semester"} />
                    <Tab label={"Année"} value={"year"} />
                    <Tab label={"Vacances"} value={"vacation"} />
                </Tabs>
            </>
        ) : (
            <>
                <Select value={timespan} onChange={handleDateLimitChange} fullWidth>
                    <MenuItem value={"day"}>Jour</MenuItem>
                    <MenuItem value={"week"}>Semaine</MenuItem>
                    <MenuItem value={"month"}>Mois</MenuItem>
                    <MenuItem value={"semester"}>Semestre</MenuItem>
                    <MenuItem value={"year"}>Année</MenuItem>
                    <MenuItem value={"vacation"}>Vacances</MenuItem>
                </Select>
            </>
        );
    };
    const Cards = () => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}
            >
                {scheduleStats ? (
                    <>
                        <Card title={"Progression"}>
                            <CircularProgressbar
                                value={scheduleStats.percentage}
                                text={`${scheduleStats.percentage}%`}
                                styles={buildStyles({
                                    textColor: gradient(scheduleStats.percentage / 100).hex(),
                                    pathColor: gradient(scheduleStats.percentage / 100).hex(),
                                })}
                            />
                        </Card>
                        <Card title={"Nombre d'heures restantes"}>
                            <Typography variant={"h5"} align={"center"} sx={{ margin: "auto", fontWeight: 600 }}>
                                {minToStrHours(scheduleStats.minTotal - scheduleStats.minSpent)}
                            </Typography>
                            <Typography variant={"subtitle"} align={"center"} sx={{ margin: "auto" }}>
                                /
                            </Typography>
                            <Typography variant={"subtitle"} align={"center"} sx={{ margin: "auto" }}>
                                {minToStrHours(scheduleStats.minTotal)}
                            </Typography>
                        </Card>
                        <Card title={"Nombre de cours après 17h"}>
                            <Typography variant={"h5"} align={"center"} sx={{ margin: "auto", fontWeight: 600 }}>
                                {scheduleStats.numOfClassAfter}
                            </Typography>
                        </Card>
                    </>
                ) : (
                    <>
                        <Skeleton>
                            <Card />
                            <Card />
                            <Card />
                        </Skeleton>
                    </>
                )}
                {statusStats && (
                    <>
                        <Card title={"EDT Status"}>
                            {statusStats.currentlyAlive ? (
                                <Box
                                    sx={{
                                        color: "#66bb6a",
                                        height: 1,
                                        fontSize: 48,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                    }}
                                    title={"u r not the father"}
                                >
                                    <CheckCircle fontSize={"inherit"} />
                                    <Typography variant={"h5"}>UP</Typography>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        color: "#f44336",
                                        height: 1,
                                        fontSize: 48,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                    }}
                                    title={"u ARE the father"}
                                >
                                    <Cancel fontSize={"inherit"} />
                                    <Typography variant={"h5"}>DOWN</Typography>
                                </Box>
                            )}
                            <Subtitle value={`à ${moment(statusStats.lastUpdate).format("HH:mm:ss")}`} centered />
                        </Card>
                        <Card title={"EDT Downtime"}>
                            <CircularProgressbar
                                value={statusStats.percentage}
                                text={`${statusStats.percentage}%`}
                                styles={buildStyles({
                                    textColor: gradient(statusStats.percentage / 100).hex(),
                                    pathColor: gradient(statusStats.percentage / 100).hex(),
                                })}
                            />
                            <Subtitle
                                value={`${minToStrHours(statusStats.aliveTimes * 5)}/${minToStrHours(statusStats.numOfUpdates * 5)}`}
                                sx={{ marginTop: 1 }}
                            />
                            <Subtitle value={`depuis ${moment(statusStats.firstUpdate).format("HH:mm:ss - DD/MM/YYYY")}`} />
                        </Card>
                    </>
                )}
            </Box>
        );
    };
    const Dropdowns = () => {
        return scheduleStats ? (
            <Box>
                <Dropdown title={"Cours"} data={scheduleStats.minBySubjects} />
                <Dropdown title={"Type"} data={scheduleStats.minByType} />
                <Dropdown title={"Prof"} data={scheduleStats.minByTeachers} />
                <Dropdown title={"Salle"} data={scheduleStats.minByLocations} />
            </Box>
        ) : (
            <>
                <Skeleton variant={"rectangle"} />
                <Skeleton variant={"rectangle"} />
                <Skeleton variant={"rectangle"} />
                <Skeleton variant={"rectangle"} />
            </>
        );
    };
    const Confettis = () => {
        return confettiRunning && <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={onConfettiComplete} />;
    };
    const SidebarMenu = () => {
        return (
            <Drawer anchor={"right"} open={sidebarMenuOpen} onClose={toggleSidebarMenu}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", padding: 1 }}>
                    <IconButton onClick={toggleSidebarMenu}>{sidebarMenuOpen ? <ChevronRight /> : <ChevronLeft />}</IconButton>
                </Box>
                <Divider />
                <Box sx={{ width: 250 }}>
                    <Box sx={{ width: 200, margin: "auto", marginTop: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography align={"center"} variant={"h4"}>
                            EDT(s)
                        </Typography>
                        {user && selectedSchedule ? (
                            <>
                                <ButtonGroup orientation={"vertical"} sx={{ width: "fit-content", marginTop: 1, marginBottom: 1 }}>
                                    {user.schedules.map((value) => {
                                        return (
                                            <Button
                                                variant={selectedSchedule === value ? "contained" : "outlined"}
                                                onClick={() => handleSelectedScheduleChange(value)}
                                            >
                                                {value}
                                            </Button>
                                        );
                                    })}
                                </ButtonGroup>
                                <Divider />
                                <Subtitle value={`Connecté en tant que ${user.role}.`} />
                            </>
                        ) : (
                            <Skeleton variant="rectangular" width={200} height={100} />
                        )}
                        <Link href={""} variant={"subtitle2"} sx={{ fontSize: 12, color: "#808080" }} onClick={logOut}>
                            Deconnexion
                        </Link>
                    </Box>
                    <Box sx={{ position: "absolute", bottom: 0, textAlign: "center", width: 1, marginBottom: 1 }}>
                        <Link href={"https://github.com/MathisEngels/better-insa-schedule"} variant={"subtitle2"} sx={{ fontSize: 12, color: "#808080" }}>
                            Github
                        </Link>
                        <Subtitle value={"Mathis Engels"} />
                    </Box>
                </Box>
            </Drawer>
        );
    };

    return (
        <Container maxWidth={false} sx={{ padding: 3 }}>
            <Grid container spacing={2} justifyContent={"center"}>
                <Grid item xs={12} sm={9}>
                    {Calendar()}
                </Grid>
                <Grid item xs={12} sm={3}>
                    {InfoPanel()}
                </Grid>
            </Grid>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <Container maxWidth={false} sx={{ padding: 2 }}>
                {DateLimitMenu()}
                {Cards()}
                {Dropdowns()}
            </Container>
            {Confettis()}
            {SidebarMenu()}
        </Container>
    );
}

export default Dashboard;
