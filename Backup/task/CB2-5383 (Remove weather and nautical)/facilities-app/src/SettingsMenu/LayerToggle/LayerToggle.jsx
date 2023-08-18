import React, { Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText, Switch, Collapse } from "@material-ui/core";
import { CBSlider } from "orion-components/CBComponents";

const propTypes = {
	label: PropTypes.string.isRequired,
	updateKey: PropTypes.string.isRequired,
	withOpacity: PropTypes.bool,
	opacity: PropTypes.number,
	visible: PropTypes.bool,
	setLayerState: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	withOpacity: false,
	opacity: 1,
	visible: false
};

const LayerToggle = ({
	label,
	updateKey,
	withOpacity,
	opacity,
	visible,
	setLayerState,
	dir
}) => {
	const style = {
		listItem: {
			display: "inline-block",
			clear: "both"
		}
	};
	const handleVisibleChange = useCallback(
		e => {
			setLayerState({ [updateKey]: { visible: e.target.checked, opacity } });
		},
		[opacity, setLayerState, updateKey]
	);
	const handleOpacityChange = useCallback(
		(e, v) => {
			setLayerState({ [updateKey]: { visible, opacity: v } });
		},
		[setLayerState, updateKey, visible]
	);
	return (
		<Fragment>
			<ListItem key={updateKey} disableGutters style={dir === "rtl" ? style.listItem : null}>
				<ListItemText
					style={{
						marginLeft: dir === "rtl" ? "1rem" : "0rem",
						float: dir == "rtl" ? "right" : "none"

					}}
					primary={label}
					primaryTypographyProps={{
						variant: "h6",
						color: visible ? "initial" : "textSecondary"
					}}
				/>
				<Switch
					onChange={handleVisibleChange}
					checked={visible}
					color="primary"
					edge="end"
				/>
			</ListItem>
			{withOpacity && (
				<Collapse in={visible}>
					<CBSlider
						value={opacity}
						min={0}
						max={1}
						step={0.1}
						onChange={handleOpacityChange}
					/>
				</Collapse>
			)}
		</Fragment>
	);
};

LayerToggle.propTypes = propTypes;
LayerToggle.defaultProps = defaultProps;

export default LayerToggle;
