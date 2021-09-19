import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Divider,
    Grid,
    Tabs,
    Tab,
    useMediaQuery,
    Select,
    MenuItem,
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Drawer,
    IconButton,
} from "@mui/material";
import { ExpandMore, CheckCircle, ChevronLeft, ChevronRight } from "@mui/icons-material";
import Confetti from 'react-confetti';
import toast from "react-hot-toast";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import chroma from "chroma-js";
import moment from "moment";

import { getStats, minToStrHours, numberOfClassAfter } from "../utils/algorithms";
import { getCDSI, verify } from "../utils/api";
import "react-circular-progressbar/dist/styles.css";
import "./Dashboard.css";

const donne = {
    name: 'CDSI',
    lastUpdate: '2021-09-19T21:34:27.592Z',
    lastTry: '2021-09-19T21:34:27.592Z',
    events: [
      {
        start: '2021-09-13T07:00:00.000Z',
        end: '2021-09-13T08:00:00.000Z',
        name: 'Reservation',
        type: 'RES',
        location: 'AB1-012 S',
        teacher: 'Ratli Mustapha'
      },
      {
        start: '2021-09-14T09:00:00.000Z',
        end: '2021-09-14T10:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB2-A100',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-09-14T12:00:00.000Z',
        end: '2021-09-14T13:30:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'CAR-308 U',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-09-15T07:30:00.000Z',
        end: '2021-09-15T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'CAR-308 U',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-09-15T11:00:00.000Z',
        end: '2021-09-15T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-010 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-09-16T06:00:00.000Z',
        end: '2021-09-16T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-09-16T07:30:00.000Z',
        end: '2021-09-16T09:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'AB1-203 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-09-20T12:00:00.000Z',
        end: '2021-09-20T15:00:00.000Z',
        name: 'Systemes de transport intelligents',
        type: 'CM',
        location: 'CAR-308 U',
        teacher: 'Didouh Ahmed'
      },
      {
        start: '2021-09-21T09:00:00.000Z',
        end: '2021-09-21T10:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB2-202 E',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-09-21T12:00:00.000Z',
        end: '2021-09-21T13:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-09-21T13:30:00.000Z',
        end: '2021-09-21T15:00:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-09-22T07:30:00.000Z',
        end: '2021-09-22T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-09-22T11:00:00.000Z',
        end: '2021-09-22T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-09-23T06:00:00.000Z',
        end: '2021-09-23T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-09-23T07:30:00.000Z',
        end: '2021-09-23T09:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'AB1-203 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-09-27T12:00:00.000Z',
        end: '2021-09-27T15:00:00.000Z',
        name: 'Systemes de transport intelligents',
        type: 'CM',
        location: 'CAR-308 U',
        teacher: 'Didouh Ahmed'
      },
      {
        start: '2021-09-28T09:00:00.000Z',
        end: '2021-09-28T10:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB2-202 E',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-09-28T12:00:00.000Z',
        end: '2021-09-28T13:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-09-28T13:30:00.000Z',
        end: '2021-09-28T15:00:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-09-29T07:30:00.000Z',
        end: '2021-09-29T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-09-29T11:00:00.000Z',
        end: '2021-09-29T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-010 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-09-30T06:00:00.000Z',
        end: '2021-09-30T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-09-30T07:30:00.000Z',
        end: '2021-09-30T09:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'AB1-203 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-10-04T12:00:00.000Z',
        end: '2021-10-04T15:00:00.000Z',
        name: 'Systemes de transport intelligents',
        type: 'CM',
        location: 'CAR-308 U',
        teacher: 'Didouh Ahmed'
      },
      {
        start: '2021-10-05T09:00:00.000Z',
        end: '2021-10-05T10:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-10-05T12:00:00.000Z',
        end: '2021-10-05T13:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-05T13:30:00.000Z',
        end: '2021-10-05T15:00:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-10-06T07:30:00.000Z',
        end: '2021-10-06T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-06T11:00:00.000Z',
        end: '2021-10-06T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-10-07T06:00:00.000Z',
        end: '2021-10-07T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-10-11T12:00:00.000Z',
        end: '2021-10-11T15:00:00.000Z',
        name: 'Systemes de transport intelligents',
        type: 'CM',
        location: 'CAR-308 U',
        teacher: 'Didouh Ahmed'
      },
      {
        start: '2021-10-12T09:00:00.000Z',
        end: '2021-10-12T10:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-10-12T12:00:00.000Z',
        end: '2021-10-12T13:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-12T13:30:00.000Z',
        end: '2021-10-12T15:00:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-10-13T07:30:00.000Z',
        end: '2021-10-13T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-13T11:00:00.000Z',
        end: '2021-10-13T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-10-14T06:00:00.000Z',
        end: '2021-10-14T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-10-19T09:00:00.000Z',
        end: '2021-10-19T10:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-10-19T12:00:00.000Z',
        end: '2021-10-19T13:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-19T13:30:00.000Z',
        end: '2021-10-19T15:00:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-10-20T07:30:00.000Z',
        end: '2021-10-20T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-20T11:00:00.000Z',
        end: '2021-10-20T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-10-21T06:00:00.000Z',
        end: '2021-10-21T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-10-21T07:30:00.000Z',
        end: '2021-10-21T09:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'AB1-203 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-10-26T09:00:00.000Z',
        end: '2021-10-26T10:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-10-26T12:00:00.000Z',
        end: '2021-10-26T13:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-26T13:30:00.000Z',
        end: '2021-10-26T15:00:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-10-27T07:30:00.000Z',
        end: '2021-10-27T09:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-10-27T11:00:00.000Z',
        end: '2021-10-27T12:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-10-28T06:00:00.000Z',
        end: '2021-10-28T07:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-10-28T07:30:00.000Z',
        end: '2021-10-28T09:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'AB1-203 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-11-09T10:00:00.000Z',
        end: '2021-11-09T11:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-11-09T13:00:00.000Z',
        end: '2021-11-09T14:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-11-09T14:30:00.000Z',
        end: '2021-11-09T15:30:00.000Z',
        name: 'Systemes de la radio intelligente',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-11-09T15:30:00.000Z',
        end: '2021-11-09T16:00:00.000Z',
        name: 'Securite de la  radio intelligente',
        type: 'TD',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-11-10T08:30:00.000Z',
        end: '2021-11-10T10:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-11-10T12:00:00.000Z',
        end: '2021-11-10T13:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-11-11T07:00:00.000Z',
        end: '2021-11-11T08:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-11-11T08:30:00.000Z',
        end: '2021-11-11T09:30:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'CM',
        location: 'AB1-203 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-11-11T09:30:00.000Z',
        end: '2021-11-11T11:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'TD',
        location: 'AB1-009 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-11-16T10:00:00.000Z',
        end: '2021-11-16T11:30:00.000Z',
        name: 'Securite des donnees dans le cloud',
        type: 'CM',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-11-16T13:00:00.000Z',
        end: '2021-11-16T14:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-11-16T14:30:00.000Z',
        end: '2021-11-16T16:00:00.000Z',
        name: 'Securite de la  radio intelligente',
        type: 'TD',
        location: 'AB1-202 S',
        teacher: 'Dayoub Iyad'
      },
      {
        start: '2021-11-17T08:30:00.000Z',
        end: '2021-11-17T10:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-11-17T12:00:00.000Z',
        end: '2021-11-17T13:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-11-18T07:00:00.000Z',
        end: '2021-11-18T08:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-11-18T08:30:00.000Z',
        end: '2021-11-18T11:30:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'TD',
        location: 'AB1-009 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-11-23T10:00:00.000Z',
        end: '2021-11-23T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-11-23T13:00:00.000Z',
        end: '2021-11-23T14:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-11-24T08:30:00.000Z',
        end: '2021-11-24T10:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-11-24T12:00:00.000Z',
        end: '2021-11-24T13:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-11-25T07:00:00.000Z',
        end: '2021-11-25T08:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-11-25T08:30:00.000Z',
        end: '2021-11-25T11:30:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'TD',
        location: 'AB1-009 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-11-30T10:00:00.000Z',
        end: '2021-11-30T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: 'AB3-007 T',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-11-30T13:00:00.000Z',
        end: '2021-11-30T14:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-12-01T08:30:00.000Z',
        end: '2021-12-01T10:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-12-01T12:00:00.000Z',
        end: '2021-12-01T13:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-12-02T07:00:00.000Z',
        end: '2021-12-02T08:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-12-02T08:30:00.000Z',
        end: '2021-12-02T11:30:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'TD',
        location: 'AB1-009 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-12-07T13:00:00.000Z',
        end: '2021-12-07T14:30:00.000Z',
        name: 'Cryptographie avancee',
        type: 'CM',
        location: 'AB1-202 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-12-08T08:30:00.000Z',
        end: '2021-12-08T10:00:00.000Z',
        name: 'Cryptographie avancee',
        type: 'TD',
        location: 'AB1-203 S',
        teacher: 'Sodaigui Bouchaib'
      },
      {
        start: '2021-12-08T12:00:00.000Z',
        end: '2021-12-08T13:30:00.000Z',
        name: 'Anglais',
        type: 'TD',
        location: 'AB1-201 S',
        teacher: 'Busi Pierre-marie'
      },
      {
        start: '2021-12-09T07:00:00.000Z',
        end: '2021-12-09T08:30:00.000Z',
        name: 'Anglais',
        type: 'TP',
        location: 'AB3-105 T',
        teacher: 'Muiruri Moses'
      },
      {
        start: '2021-12-09T08:30:00.000Z',
        end: '2021-12-09T10:00:00.000Z',
        name: 'Securite informatique des procedes industriels',
        type: 'TD',
        location: 'AB1-009 S',
        teacher: 'Caulier Patrice'
      },
      {
        start: '2021-12-21T10:00:00.000Z',
        end: '2021-12-21T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: '',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2021-12-28T10:00:00.000Z',
        end: '2021-12-28T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: '',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2022-01-04T10:00:00.000Z',
        end: '2022-01-04T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: '',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2022-01-11T10:00:00.000Z',
        end: '2022-01-11T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: '',
        teacher: 'Ouarnoughi Hamza'
      },
      {
        start: '2022-01-18T10:00:00.000Z',
        end: '2022-01-18T11:30:00.000Z',
        name: 'Privacite et securite des donnees dans le cloud',
        type: 'TD',
        location: '',
        teacher: 'Ouarnoughi Hamza'
      }
    ]
};

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
            }}>
            <Typography variant={"h6"} align={"center"} sx={{ marginBottom: 1 }}>{props.title}</Typography>
            {props.children}
        </Paper>
    )
}

function Dropdown(props) {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{width: 1, display: "flex", justifyContent: "space-between"}}>
                    <Typography variant={"h6"}>{props.title}</Typography>
                    <Box sx={{marginRight: 2, display: "flex", alignItems: "center"}}>
                        {
                            props.data.length > 0 ?
                            <>
                                <Typography align={"right"}>
                                    {props.data[0].key} - {minToStrHours(props.data[0].spent)}/{minToStrHours(props.data[0].total)}
                                </Typography>
                                <CheckCircle color={props.data[0].spent === props.data[0].total ? "success" : "disabled"} sx={{marginLeft: 2}}/>
                            </>
                            :
                            <></>
                        }
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {
                    props.data.map((value, i) => {
                        if (i === 0) return <Box key={i}/>;
                        return (
                            <Box key={i}>
                                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1, marginBottom: 1}}>
                                    <Typography>{value.key}</Typography>
                                    <Box sx={{display: "flex"}}>
                                        <Typography align={"right"}>{minToStrHours(value.spent)}/{minToStrHours(value.total)}</Typography>
                                        <CheckCircle color={value.spent === value.total ? "success" : "disabled"} sx={{marginLeft: 4}}/>
                                    </Box>
                                </Box>
                                {
                                    i !== (props.data.length - 1) && <><Divider /></>
                                }
                            </Box>
                        )
                    })
                }
            </AccordionDetails>
        </Accordion>
    )
}

function Dashboard({ token, deleteToken }) {
    const gradient = chroma.scale(["#e5405e", "#ffdb3a", "#3fffa2"]);
    const isDesktop = useMediaQuery("(min-width:750px)");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [data, setData] = useState();
    const [dateLimit, setDateLimit] = useState("year");

    const [stats, setStats] = useState({ 
        percentage: 0,
        minTotal: 0,
        minSpent: 0,
        minBySubjects: [],
        minByType: [],
        minByTeachers: [],
        minByLocations: [],
     });
    const [confettiRunning, setConfettiRunning] = useState(false);

    useEffect(() => {
        async function verifyToken() {
            const auth = await verify(token);
            if (!auth) {
                deleteToken();
                toast.error("nah but fr who are u 👀");
            }

            const response = await getCDSI(token);
            setData(response);
            console.log(response);
        }
        //verifyToken();
        setData(donne);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (data) setStats(getStats(data.events));
    }, [data])
    useEffect(() => {
        if (data) {
            let beginDate;
            let finishDate;
            switch(dateLimit) {
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
            setStats(getStats(data.events, beginDate, finishDate));
        }
    }, [data, dateLimit]);
    useEffect(() => {
        if (stats.percentage === 100) setConfettiRunning(true)
    }, [stats.percentage]);

    const onConfettiComplete = () => {
        setConfettiRunning(false);
    }
    const handleDateLimitChange = (event, newValue) => {
        if (event.target.value !== "") {
            setDateLimit(event.target.value);
        } else {
            setDateLimit(newValue);
        }
    };
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <Container maxWidth={false}>
                {
                    data && 
                    <>
                        <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                            <Grid item xs={12} sm={9}>
                                calendar
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{display: "flex", flexDirection: "column", textAlign: "center"}}>
                                    <Typography variant={"h4"}>{data.name}</Typography>
                                    <Typography variant={"subtitle2"}>Dernière update : {moment(data.lastUpdate).format("HH:mm:ss, DD/MM/YYYY")}</Typography>
                                    <Typography variant={"subtitle2"}>Dernière essai : {moment(data.lastTry).format("HH:mm:ss, DD/MM/YYYY")}</Typography>
                                    <Button sx={{marginTop: 2, marginBottom: 1}} variant="outlined" onClick={toggleDrawer}>Add to Google Calendar</Button>
                                    <Button sx={{marginTop: 1, marginBottom: 2}} variant="outlined" disabled>Update</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Container maxWidth={false} sx={{ padding: 2 }}>
                            <>
                            {isDesktop ? (
                                <>
                                    <Tabs centered variant={"fullWidth"} value={dateLimit} onChange={handleDateLimitChange}>
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
                                    <Select value={dateLimit} onChange={handleDateLimitChange} fullWidth>
                                        <MenuItem value={"day"}>Jour</MenuItem>
                                        <MenuItem value={"week"}>Semaine</MenuItem>
                                        <MenuItem value={"month"}>Mois</MenuItem>
                                        <MenuItem value={"semester"}>Semestre</MenuItem>
                                        <MenuItem value={"year"}>Année</MenuItem>
                                        <MenuItem value={"vacation"}>Vacances</MenuItem>
                                    </Select>
                                </>
                            )}
                            </>
                            {
                                stats && 
                                <>
                                    <Box sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                    }}>
                                        <Card title={"Progression"}>
                                            <CircularProgressbar
                                                value={stats.percentage}
                                                text={`${stats.percentage}%`}
                                                styles={buildStyles({
                                                    textColor: gradient(stats.percentage / 100).hex(),
                                                    pathColor: gradient(stats.percentage / 100).hex(),
                                                })}
                                            />
                                        </Card>
                                        <Card title={"Nombre d'heures restantes"}>
                                            <Typography variant={"h5"} align={"center"} sx={{ margin: "auto", fontWeight: 600 }}>{minToStrHours(stats.minTotal - stats.minSpent)}</Typography>
                                            <Typography variant={"subtitle"} align={"center"} sx={{ margin: "auto" }}>/</Typography>
                                            <Typography variant={"subtitle"} align={"center"} sx={{ margin: "auto" }}>{minToStrHours(stats.minTotal)}</Typography>
                                        </Card>
                                        <Card title={"Nombre de cours après 17h"}>
                                            <Typography variant={"h5"} align={"center"} sx={{ margin: "auto", fontWeight: 600 }}>
                                            {numberOfClassAfter(data.events, moment().hours(17))}
                                            </Typography>
                                        </Card>
                                    </Box>
                                    <Box>
                                        <Dropdown title={"Cours"} data={stats.minBySubjects}/>
                                        <Dropdown title={"Type"} data={stats.minByType}/>
                                        <Dropdown title={"Prof"} data={stats.minByTeachers}/>
                                        <Dropdown title={"Salle"} data={stats.minByLocations}/>
                                    </Box>
                                </>
                            }
                        </Container>
                        <Drawer
                            anchor={"left"}
                            open={drawerOpen}
                            onClose={toggleDrawer}>
                            <Box sx={{display: "flex", alignItems: "center", justifyContent: "end", padding: 1}}>
                                <IconButton onClick={toggleDrawer}>
                                    {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
                                </IconButton>
                            </Box>
                            <Divider />
                            <Box sx={{width: 250}}>

                            </Box>
                        </Drawer>
                        {
                            confettiRunning && <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={onConfettiComplete} />
                        }
                    </>
                }
                
            </Container>
        </>
    );
}

export default Dashboard;

// Message pour connexion réussie


// Message mauvais mdp


// message t pa un hacker
// "What are you doing la"
