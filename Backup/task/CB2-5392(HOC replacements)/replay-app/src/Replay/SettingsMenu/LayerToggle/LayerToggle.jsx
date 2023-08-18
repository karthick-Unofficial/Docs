import React, { Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText, Switch, Collapse } from "@material-ui/core";
import { CBSlider } from "orion-components/CBComponents";
import { useDispatch } from "react-redux";
import { setLayerState } from "./layerToggleActions";

const propTypes = {
	updateKey: PropTypes.string.isRequired,
	withOpacity: PropTypes.bool
};

const defaultProps = {
	withOpacity: false
};

const LayerToggle = ({
	label,
	updateKey,
	withOpacity,
	opacity,
	visible,
	customVisibleChange
}) => {

	const dispatch = useDispatch();

	const handleVisibleChange = useCallback(
		e => {
			dispatch(setLayerState({ [updateKey]: { visible: e.target.checked, opacity } }));
		},
		[opacity, setLayerState, updateKey]
	);
	const handleOpacityChange = useCallback(
		(e, v) => {
			dispatch(setLayerState({ [updateKey]: { visible, opacity: v } }));
		},
		[setLayerState, updateKey, visible]
	);
	return (
		<Fragment>
			<ListItem key={updateKey} disableGutters>
				<ListItemText
					primary={label}
					primaryTypographyProps={{
						variant: "h6",
						color: visible ? "initial" : "textSecondary"
					}}
				/>
				<Switch
					onChange={customVisibleChange ? customVisibleChange : handleVisibleChange}
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
