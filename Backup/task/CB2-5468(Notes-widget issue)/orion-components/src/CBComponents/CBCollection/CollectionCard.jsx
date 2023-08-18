import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Card,
	CardContent,
	Collapse,
	ListItem,
	ListItemText
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.array.isRequired,
	dir: PropTypes.string
};

const CollectionCard = ({ name, children, dir }) => {
	const [expanded, setExpanded] = useState(false);
	const handleExpand = () => {
		setExpanded(!expanded);
	};
	return (
		<Card
			style={{ borderRadius: 0, marginBottom: 12, background: "transparent" }}
		>
			<ListItem style={{ backgroundColor: "#494d53", padding: "0px" }}>
				<IconButton onClick={handleExpand}>
					{expanded ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
				<ListItemText
					style={dir == "rtl" ?
						{
							paddingRight: 10,
							textAlign: "right"
						}
						:
						{
							paddingLeft: 0
						}}
					primary={name}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
			</ListItem>
			<Collapse in={expanded}>
				<CardContent style={{ padding: 0, border: "1px solid #494d53" }}>
					{children}
				</CardContent>
			</Collapse>
		</Card>
	);
};

CollectionCard.propTypes = propTypes;

export default CollectionCard;
