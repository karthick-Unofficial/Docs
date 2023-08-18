import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Card,
	CardContent,
	Collapse,
	ListItem,
	ListItemText
} from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

const propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.array.isRequired,
	dir: PropTypes.string
};

class CollectionCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		};
	}
	handleExpand = () => {
		const { expanded } = this.state;
		this.setState({ expanded: !expanded });
	};
	render() {
		const { name, children, dir } = this.props;
		const { expanded } = this.state;
		return (
			<Card
				style={{ borderRadius: 0, marginBottom: 12, background: "transparent" }}
			>
				<ListItem style={{ backgroundColor: "#494d53", padding: "0px" }}>
					<IconButton onClick={this.handleExpand}>
						{expanded ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
					<ListItemText
						style={dir == "rtl" ? { paddingRight: 2, textAlign: "right" } : { paddingLeft: 0 }}
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
	}
}

CollectionCard.propTypes = propTypes;

export default CollectionCard;
