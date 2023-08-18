import React, { useEffect, useState, memo } from "react";
import moment from "moment";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

const ElapsedTimer = ({ initialActivityDate }) => {

    const locale = useSelector(state => state.i18n.locale);

    moment.locale(locale);

    const [hoursPassed, setHoursPassed] = useState("");
    const [minutesPassed, setMinutesPassed] = useState("");
    const [secondsPassed, setSecondsPassed] = useState("");
    const [mounted, setMounted] = useState(false);

    const initiateTimer = () => {
        const formattedDateTime = moment(initialActivityDate).format('YYYY/MM/DD hh:mm:ss');
        const timediff = moment().diff(moment(formattedDateTime, 'YYYY/MM/DD hh:mm:ss'));
        setMinutesPassed(moment.utc(timediff).format('m'));
        setSecondsPassed(moment.utc(timediff).format('ss'));
        setHoursPassed(moment().diff(initialActivityDate, 'hours'));
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

    return <Typography style={{ color: "#fff", fontSize: 22, lineHeight: "unset" }}>{(hoursPassed > 0) && `${hoursPassed}h`} {minutesPassed}m {secondsPassed}s</Typography>
}

export default memo(ElapsedTimer);