import React, { useEffect, useState, memo } from "react";
import moment from "moment";
import { Typography } from "@mui/material";

const ElapsedTimer = ({ CaptureDateTime }) => {

    moment.locale("en");

    const [minutesPassed, setMinutesPassed] = useState("");
    const [secondsPassed, setSecondsPassed] = useState("");
    const [mounted, setMounted] = useState(false);

    const initiateTimer = () => {
        const formattedDateTime = moment(CaptureDateTime).format('YYYY/MM/DD hh:mm:ss');
        const timediff = moment().diff(moment(formattedDateTime, 'YYYY/MM/DD hh:mm:ss'));
        setMinutesPassed(moment.utc(timediff).format('m'));
        setSecondsPassed(moment.utc(timediff).format('ss'));
    };

    useEffect(() => {
        window.setInterval(function () {
            initiateTimer();
        }, 1000);
    }, []);

    if (!mounted) {
        initiateTimer();
        setMounted(true);
    }

    return <Typography style={{ color: "#fff", fontSize: 22, lineHeight: "unset" }}>{minutesPassed}m {secondsPassed}s</Typography>
}

export default memo(ElapsedTimer);