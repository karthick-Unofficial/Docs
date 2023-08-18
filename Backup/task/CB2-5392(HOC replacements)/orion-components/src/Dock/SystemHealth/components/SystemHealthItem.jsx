import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Translate } from "orion-components/i18n";


const propTypes = {
	check: PropTypes.object,
	locale: PropTypes.string
};

const defaultProps = {
	check: {},
	locale: "en"
};

const styles = {
	text: {
		fontSize: "14px",
		fontWeight: "bold",
		color: "#FFF"
	},
	subtext: {
		fontSize: "12px",
		color: "white",
		width: "100%"
	}
};

const SystemHealthItem = ({ check, locale }) => {
	const errorMessage = check.status && check.status.message ? check.status.message : null;
	const passed = check.status && check.status.ok;
	const displayValue =
		check.displayValue
			? check.displayValue
			: passed
				? "Passed"
				: "Error";
	return (
		<Fragment>
			<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "90%", padding: "5px 0 5px 0" }}>
				<p style={{ ...styles.text, ...(!passed && { color: "#be3e49" }) }}>{<Translate value={check.name} />}</p>
				<p style={{ ...styles.text, ...(!passed && { color: "#be3e49" }) }}>{displayValue == "Passed" ? <Translate value="global.dock.systemHealth.systemHealthItem.passed" /> : displayValue == "Error" ? <Translate value="global.dock.systemHealth.systemHealthItem.error" /> : displayValue}</p>
				{errorMessage && <p style={styles.subtext}>{<Translate value={errorMessage} />}</p>}
				{errorMessage && <p style={{ ...styles.subtext, color: "#6e7376" }}><Translate value="global.dock.systemHealth.systemHealthItem.lastUpdate" />{moment(check.lastUpdated).locale(locale).fromNow()}</p>}
			</div>
		</Fragment>
	);
};

SystemHealthItem.propTypes = propTypes;
SystemHealthItem.defaultProps = defaultProps;

export default SystemHealthItem;