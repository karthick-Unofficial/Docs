import React from "react";
import { timeConversion } from "client-app-core";
import PropTypes from "prop-types";

const propTypes = {
	locale: PropTypes.string
};
const defaultProps = {
	locale: "en"
};

const UserTime = ({ time, format, locale }) => {
	const userTime = timeConversion.convertToUserTime(time, format, locale);
	return <div>{userTime}</div>;
};

UserTime.propTypes = propTypes;
UserTime.defaultProps = defaultProps;

export default UserTime;
