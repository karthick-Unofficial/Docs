import React, { memo } from "react";
import PropTypes from "prop-types";
import { Button, Icon, Typography } from "@mui/material";
import { Language } from "@mui/icons-material";

const propTypes = { result: PropTypes.object, dir: PropTypes.string };

const ExternalLink = ({ result, dir }) => {
	const { endpoint, iconSrc, label } = result;
	console.log("result", result);
	return (
		<Button
			target="_blank"
			href={endpoint}
			variant="contained"
			style={{
				backgroundColor: "#494D53",
				color: "#FFF",
				justifyContent: "flex-start",
				width: "100%"
			}}
		>
			{!iconSrc ? (
				<Language fontSize="large" style={{ marginRight: 12 }} />
			) : (
				<Icon fontSize="large" style={{ marginRight: 12, width: "auto" }}>
					<img style={{ height: "100%" }} src={iconSrc} />
				</Icon>
			)}
			<Typography style={dir == "rtl" ? { paddingRight: "12px", direction: "ltr" } : null} noWrap={true}>{label}</Typography>
		</Button>
	);
};

ExternalLink.propTypes = propTypes;

export default memo(ExternalLink);
