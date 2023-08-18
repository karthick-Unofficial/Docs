import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
	Fab,
	Popover,
	MenuItem,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";
import { Add, Place, Layers, Timeline } from "@material-ui/icons";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	handleSelect: PropTypes.func.isRequired
};

class ShapeSelect extends Component {
	constructor(props) {
		super(props);
		this.state = { anchorEl: null };
	}
	handleMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};
	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};
	handleSelect = mode => {
		const { handleSelect } = this.props;
		handleSelect({ type: "drawing", mode });
		this.handleMenuClose();
	};
	render() {
		const { anchorEl } = this.state;
		const open = !!anchorEl;
		const { dir } = this.props;
		return (
			<Fragment>
				<Fab
					onClick={open ? this.handleMenuClose : this.handleMenuOpen}
					color="primary"
				>
					<Add style={{ color: "#FFF" }} />
				</Fab>
				<Popover
					open={open}
					anchorEl={anchorEl}
					onClose={this.handleMenuClose}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
					transformOrigin={{
						vertical: "bottom",
						horizontal: "right"
					}}
				>
					<MenuItem onClick={() => this.handleSelect("draw_point")}>
						<ListItemIcon>
							<Place />
						</ListItemIcon>
						<ListItemText primary={getTranslation("global.map.tools.shapeSelect.point")} style={dir == "rtl" ? {textAlign: "right"} : {}}/>
					</MenuItem>
					<MenuItem onClick={() => this.handleSelect("draw_polygon")}>
						<ListItemIcon>
							<Layers />
						</ListItemIcon>
						<ListItemText primary={getTranslation("global.map.tools.shapeSelect.polygon")} style={dir == "rtl" ? {textAlign: "right"} : {}}/>
					</MenuItem>
					<MenuItem onClick={() => this.handleSelect("draw_line_string")}>
						<ListItemIcon>
							<Timeline />
						</ListItemIcon>
						<ListItemText primary={getTranslation("global.map.tools.shapeSelect.line")} style={dir == "rtl" ? {textAlign: "right"} : {}}/>
					</MenuItem>
				</Popover>
			</Fragment>
		);
	}
}

ShapeSelect.propTypes = propTypes;

export default ShapeSelect;
