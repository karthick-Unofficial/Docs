import React, { Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText, Switch, Collapse } from "@mui/material";
import { CBSlider } from "orion-components/CBComponents";
import { useDispatch } from "react-redux";
import { setLayerState } from "./layerToggleActions";
import { makeStyles } from "@mui/styles";
import { getDir } from "orion-components/i18n/Config/selector";
import { useSelector } from "react-redux";
import { setLocalAppState } from "orion-components/AppState/Actions";

const propTypes = {
	updateKey: PropTypes.string.isRequired,
	withOpacity: PropTypes.bool
};

const defaultProps = {
	withOpacity: false
};

const useStyles = makeStyles({
	thumbOff: {
		backgroundColor: "#bdbdbd"
	},
	trackOff: {
		backgroundColor: "#fff",
		opacity: "0.3"
	}
});


const LayerToggle = ({
	label,
	updateKey,
	withOpacity,
	opacity,
	visible,
	customVisibleChange
}) => {

	const dispatch = useDispatch();
	const classes = useStyles();

	const { mapSettings } = useSelector(state => state.appState.persisted);
	const dir = useSelector(state => getDir(state));
	const handleVisibleChange = useCallback(
		e => {
			dispatch(setLayerState({ [updateKey]: { visible: e.target.checked, opacity } }));
		},
		[opacity, setLayerState, updateKey]
	);

	const handleOpacityChange = (e, v) => {
		const value = { [updateKey]: { visible, opacity: v } };
		const update = { ...mapSettings, ...value };
		dispatch(setLocalAppState("mapSettings", update));
	};

	const handleOpacityChangeCommitted = useCallback(
		(e, v) => {
			dispatch(setLayerState({ [updateKey]: { visible, opacity: v } }));
		},
		[setLayerState, updateKey, visible]
	);

	const styles = {
		listItem: {
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	return (
		<Fragment>
			<ListItem key={updateKey} disableGutters style={styles.listItem}>
				<ListItemText
					primary={label}
					primaryTypographyProps={{
						variant: "h6",
						style: { color: visible ? "#fff" : "#B5B9BE" }
					}}
				/>
				<Switch
					onChange={customVisibleChange ? customVisibleChange : handleVisibleChange}
					checked={visible}
					color="primary"
					edge="end"
					classes={{
						thumb: !visible && classes.thumbOff,
						track: !visible && classes.trackOff
					}}

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
						onChangeCommitted={handleOpacityChangeCommitted}
					/>
				</Collapse>
			)}
		</Fragment>
	);
};

LayerToggle.propTypes = propTypes;
LayerToggle.defaultProps = defaultProps;

export default LayerToggle;
