import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Card, CardContent, Collapse, ListItem, ListItemText } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.array.isRequired,
	dir: PropTypes.string,
	collapsed: PropTypes.bool,
	id: PropTypes.string,
	handleCollapseAndExpand: PropTypes.func
};

const defaultProps = {
	collapsed: false,
	id: "",
	handleCollapseAndExpand: () => {}
};

const CollectionCard = ({ name, children, dir, collapsed, id, handleCollapseAndExpand }) => {
	const styles = {
		listItemText: {
			...(dir === "rtl" && {
				paddingRight: 10,
				textAlign: "right"
			}),
			...(dir === "ltr" && { paddingLeft: 0 })
		}
	};
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		setExpanded(!collapsed);
	}, [collapsed]);

	const handleExpand = () => {
		handleCollapseAndExpand(id, !expanded);
		setExpanded(!expanded);
	};
	return (
		<Card
			style={{
				borderRadius: 0,
				marginBottom: 12,
				background: "transparent"
			}}
		>
			<ListItem style={{ backgroundColor: "#494d53", padding: "0px" }}>
				<IconButton onClick={handleExpand} style={{ color: "rgb(243, 243, 243)" }}>
					{expanded ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
				<ListItemText
					style={styles.listItemText}
					primary={name}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
			</ListItem>
			<Collapse in={expanded}>
				<CardContent style={{ padding: 0, border: "1px solid #494d53" }}>{children}</CardContent>
			</Collapse>
		</Card>
	);
};

CollectionCard.propTypes = propTypes;
CollectionCard.defaultProps = defaultProps;

export default CollectionCard;
