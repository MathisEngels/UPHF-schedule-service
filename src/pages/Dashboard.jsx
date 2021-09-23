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
    Typography,
    useMediaQuery,
} from "@mui/material";
import chroma from "chroma-js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { Card, Dropdown, Subtitle } from "../components";
import { getScheduleStats, getStatusStats, minToStrHours } from "../utils/algorithms";
import { getSchedule, getStatus, verify } from "../utils/api";
import "./Dashboard.css";

const donne = {
    name: "CDSI",
    lastUpdate: "2021-09-20T13:06:59.503Z",
    lastTry: "2021-09-20T13:06:59.503Z",
    events: [
        {
            start: "2021-09-13T07:00:00.000Z",
            end: "2021-09-13T08:00:00.000Z",
            name: "Reservation",
            type: "RES",
            location: "AB1-012 S",
            teacher: "Ratli Mustapha",
        },
        {
            start: "2021-09-14T09:00:00.000Z",
            end: "2021-09-14T10:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB2-A100",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-09-14T12:00:00.000Z",
            end: "2021-09-14T13:30:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "CAR-308 U",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-09-15T07:30:00.000Z",
            end: "2021-09-15T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "CAR-308 U",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-09-15T11:00:00.000Z",
            end: "2021-09-15T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-010 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-09-16T06:00:00.000Z",
            end: "2021-09-16T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-09-16T07:30:00.000Z",
            end: "2021-09-16T09:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "AB1-203 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-09-21T09:00:00.000Z",
            end: "2021-09-21T10:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB2-202 E",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-09-21T12:00:00.000Z",
            end: "2021-09-21T13:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-09-21T13:30:00.000Z",
            end: "2021-09-21T15:00:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-09-22T07:30:00.000Z",
            end: "2021-09-22T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-09-22T11:00:00.000Z",
            end: "2021-09-22T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-09-23T06:00:00.000Z",
            end: "2021-09-23T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-09-23T07:30:00.000Z",
            end: "2021-09-23T09:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "AB1-203 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-09-27T12:00:00.000Z",
            end: "2021-09-27T15:00:00.000Z",
            name: "Systemes de transport intelligents",
            type: "CM",
            location: "CAR-308 U",
            teacher: "Didouh Ahmed",
        },
        {
            start: "2021-09-28T09:00:00.000Z",
            end: "2021-09-28T10:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB2-202 E",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-09-28T12:00:00.000Z",
            end: "2021-09-28T13:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-09-28T13:30:00.000Z",
            end: "2021-09-28T15:00:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-09-29T07:30:00.000Z",
            end: "2021-09-29T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-09-29T11:00:00.000Z",
            end: "2021-09-29T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-010 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-09-30T06:00:00.000Z",
            end: "2021-09-30T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-09-30T07:30:00.000Z",
            end: "2021-09-30T09:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "AB1-203 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-10-04T12:00:00.000Z",
            end: "2021-10-04T15:00:00.000Z",
            name: "Systemes de transport intelligents",
            type: "CM",
            location: "CAR-308 U",
            teacher: "Didouh Ahmed",
        },
        {
            start: "2021-10-05T09:00:00.000Z",
            end: "2021-10-05T10:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-10-05T12:00:00.000Z",
            end: "2021-10-05T13:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-05T13:30:00.000Z",
            end: "2021-10-05T15:00:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-10-06T07:30:00.000Z",
            end: "2021-10-06T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-06T11:00:00.000Z",
            end: "2021-10-06T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-10-07T06:00:00.000Z",
            end: "2021-10-07T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-10-11T12:00:00.000Z",
            end: "2021-10-11T15:00:00.000Z",
            name: "Systemes de transport intelligents",
            type: "CM",
            location: "CAR-308 U",
            teacher: "Didouh Ahmed",
        },
        {
            start: "2021-10-12T09:00:00.000Z",
            end: "2021-10-12T10:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-10-12T12:00:00.000Z",
            end: "2021-10-12T13:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-12T13:30:00.000Z",
            end: "2021-10-12T15:00:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-10-13T07:30:00.000Z",
            end: "2021-10-13T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-13T11:00:00.000Z",
            end: "2021-10-13T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-10-14T06:00:00.000Z",
            end: "2021-10-14T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-10-18T12:00:00.000Z",
            end: "2021-10-18T15:00:00.000Z",
            name: "Systemes de transport intelligents",
            type: "CM",
            location: "CAR-308 U",
            teacher: "Didouh Ahmed",
        },
        {
            start: "2021-10-19T09:00:00.000Z",
            end: "2021-10-19T10:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-10-19T12:00:00.000Z",
            end: "2021-10-19T13:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-19T13:30:00.000Z",
            end: "2021-10-19T15:00:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-10-20T07:30:00.000Z",
            end: "2021-10-20T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-20T11:00:00.000Z",
            end: "2021-10-20T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-10-21T06:00:00.000Z",
            end: "2021-10-21T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-10-21T07:30:00.000Z",
            end: "2021-10-21T09:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "AB1-203 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-10-26T09:00:00.000Z",
            end: "2021-10-26T10:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-10-26T12:00:00.000Z",
            end: "2021-10-26T13:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-26T13:30:00.000Z",
            end: "2021-10-26T15:00:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-10-27T07:30:00.000Z",
            end: "2021-10-27T09:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-10-27T11:00:00.000Z",
            end: "2021-10-27T12:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-10-28T06:00:00.000Z",
            end: "2021-10-28T07:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-10-28T07:30:00.000Z",
            end: "2021-10-28T09:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "AB1-203 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-11-09T10:00:00.000Z",
            end: "2021-11-09T11:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-11-09T13:00:00.000Z",
            end: "2021-11-09T14:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-11-09T14:30:00.000Z",
            end: "2021-11-09T15:30:00.000Z",
            name: "Systemes de la radio intelligente",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-11-09T15:30:00.000Z",
            end: "2021-11-09T16:00:00.000Z",
            name: "Securite de la  radio intelligente",
            type: "TD",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-11-10T08:30:00.000Z",
            end: "2021-11-10T10:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-11-10T12:00:00.000Z",
            end: "2021-11-10T13:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-11-11T07:00:00.000Z",
            end: "2021-11-11T08:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-11-11T08:30:00.000Z",
            end: "2021-11-11T09:30:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "CM",
            location: "AB1-203 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-11-11T09:30:00.000Z",
            end: "2021-11-11T11:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "TD",
            location: "AB1-009 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-11-16T10:00:00.000Z",
            end: "2021-11-16T11:30:00.000Z",
            name: "Securite des donnees dans le cloud",
            type: "CM",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-11-16T13:00:00.000Z",
            end: "2021-11-16T14:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-11-16T14:30:00.000Z",
            end: "2021-11-16T16:00:00.000Z",
            name: "Securite de la  radio intelligente",
            type: "TD",
            location: "AB1-202 S",
            teacher: "Dayoub Iyad",
        },
        {
            start: "2021-11-17T08:30:00.000Z",
            end: "2021-11-17T10:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-11-17T12:00:00.000Z",
            end: "2021-11-17T13:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-11-18T07:00:00.000Z",
            end: "2021-11-18T08:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-11-18T08:30:00.000Z",
            end: "2021-11-18T11:30:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "TD",
            location: "AB1-009 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-11-23T10:00:00.000Z",
            end: "2021-11-23T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-11-23T13:00:00.000Z",
            end: "2021-11-23T14:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-11-24T08:30:00.000Z",
            end: "2021-11-24T10:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-11-24T12:00:00.000Z",
            end: "2021-11-24T13:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-11-25T07:00:00.000Z",
            end: "2021-11-25T08:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-11-25T08:30:00.000Z",
            end: "2021-11-25T11:30:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "TD",
            location: "AB1-009 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-11-30T10:00:00.000Z",
            end: "2021-11-30T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "AB3-007 T",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-11-30T13:00:00.000Z",
            end: "2021-11-30T14:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-12-01T08:30:00.000Z",
            end: "2021-12-01T10:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-12-01T12:00:00.000Z",
            end: "2021-12-01T13:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-12-02T07:00:00.000Z",
            end: "2021-12-02T08:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-12-02T08:30:00.000Z",
            end: "2021-12-02T11:30:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "TD",
            location: "AB1-009 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-12-07T13:00:00.000Z",
            end: "2021-12-07T14:30:00.000Z",
            name: "Cryptographie avancee",
            type: "CM",
            location: "AB1-202 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-12-08T08:30:00.000Z",
            end: "2021-12-08T10:00:00.000Z",
            name: "Cryptographie avancee",
            type: "TD",
            location: "AB1-203 S",
            teacher: "Sodaigui Bouchaib",
        },
        {
            start: "2021-12-08T12:00:00.000Z",
            end: "2021-12-08T13:30:00.000Z",
            name: "Anglais",
            type: "TD",
            location: "AB1-201 S",
            teacher: "Busi Pierre-marie",
        },
        {
            start: "2021-12-09T07:00:00.000Z",
            end: "2021-12-09T08:30:00.000Z",
            name: "Anglais",
            type: "TP",
            location: "AB3-105 T",
            teacher: "Muiruri Moses",
        },
        {
            start: "2021-12-09T08:30:00.000Z",
            end: "2021-12-09T10:00:00.000Z",
            name: "Securite informatique des procedes industriels",
            type: "TD",
            location: "AB1-009 S",
            teacher: "Caulier Patrice",
        },
        {
            start: "2021-12-21T10:00:00.000Z",
            end: "2021-12-21T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "Non défini",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2021-12-28T10:00:00.000Z",
            end: "2021-12-28T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "Non défini",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2022-01-04T10:00:00.000Z",
            end: "2022-01-04T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "Non défini",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2022-01-11T10:00:00.000Z",
            end: "2022-01-11T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "Non défini",
            teacher: "Ouarnoughi Hamza",
        },
        {
            start: "2022-01-18T10:00:00.000Z",
            end: "2022-01-18T11:30:00.000Z",
            name: "Privacite et securite des donnees dans le cloud",
            type: "TD",
            location: "Non défini",
            teacher: "Ouarnoughi Hamza",
        },
    ],
    retryInterval: 30,
    successInterval: 720,
};
const donneee = [
    { date: "2021-09-20T19:14:42.594Z", alive: true },
    { date: "2021-09-20T19:21:17.571Z", alive: true },
    { date: "2021-09-20T19:22:45.445Z", alive: true },
    { date: "2021-09-20T19:24:32.214Z", alive: true },
    { date: "2021-09-20T19:25:32.335Z", alive: true },
    { date: "2021-09-20T19:26:32.351Z", alive: true },
    { date: "2021-09-20T19:28:24.835Z", alive: true },
    { date: "2021-09-20T19:29:41.805Z", alive: true },
];

function Dashboard({ token, deleteToken }) {
    const gradient = chroma.scale(["#e5405e", "#ffdb3a", "#3fffa2"]);
    const isDesktop = useMediaQuery("(min-width:750px)");

    const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
    const [confettiRunning, setConfettiRunning] = useState(false);
    const [user, setUser] = useState();
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [timespan, setTimespan] = useState("year");
    const [beginFinishDates, setBeginFinishDates] = useState();
    const [scheduleData, setScheduleData] = useState();
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
        updateStatusData();

        // Une fois l'utilisateur fetch on fait les bonnes requetes.
        // setStatusData(donneee);
        // setScheduleData(donne);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user) setSelectedSchedule(user.schedules[0]);
    }, [user]);
    useEffect(() => {
        if (selectedSchedule) updateScheduleData();
    }, [selectedSchedule]);
    useEffect(() => {
        if (statusData) updateStatusStats();
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
        if (scheduleData && beginFinishDates) updateScheduleStats();
    }, [scheduleData, beginFinishDates]);
    useEffect(() => {
        if (scheduleStats.percentage === 100) setConfettiRunning(true);
    }, [scheduleStats.percentage]);

    const updateScheduleData = async () => {
        const data = await getSchedule(token, selectedSchedule);
        setScheduleData(data);
    };
    const updateStatusData = async () => {
        const data = await getStatus(token);
        setStatusData(data);
    };
    const updateScheduleStats = () => {
        setScheduleStats(getScheduleStats(scheduleData.events, beginFinishDates.beginDate, beginFinishDates.finishDate, 17));
    };
    const updateStatusStats = () => {
        setStatusStats(getStatusStats(statusData));
    };

    const onConfettiComplete = () => {
        setConfettiRunning(false);
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
        if (value !== selectedSchedule) setSelectedSchedule(value);
    };
    const logOut = () => {
        toast.success("bbye u stinky man");
        deleteToken();
    };

    const Calendar = () => {
        return <>calendar</>;
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
                        <Button sx={{ marginTop: 2, marginBottom: 1 }} variant="outlined">
                            Add to Google Calendar
                        </Button>
                        <Button sx={{ marginTop: 1, marginBottom: 2 }} variant="outlined" disabled={user.role !== "admin"}>
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
                        <Link href={"TODO"} variant={"subtitle2"} sx={{ fontSize: 12, color: "#808080" }}>
                            Github
                        </Link>
                        <Subtitle value={"Mathis Engels"} />
                    </Box>
                </Box>
            </Drawer>
        );
    };

    return (
        <Container maxWidth={false}>
            <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                <Grid item xs={12} sm={9}>
                    {Calendar()}
                </Grid>
                <Grid item xs={12} sm={3}>
                    {InfoPanel()}
                </Grid>
            </Grid>
            <Divider />
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
