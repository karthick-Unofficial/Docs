import React, { memo } from "react";
import PropTypes from "prop-types";
import { Button, Icon, Typography } from "@material-ui/core";
import { Language } from "@material-ui/icons";

const propTypes = { result: PropTypes.object };

const ExternalLink = ({ result }) => {
	const { endpoint, iconSrc, label } = result;
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
			<Typography noWrap={true}>{label}</Typography>
		</Button>
	);
};

ExternalLink.propTypes = propTypes;

export default memo(ExternalLink);
