import React, { Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText, Switch, Collapse } from "@mui/material";
import { CBSlider } from "orion-components/CBComponents";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { makeStyles } from "@mui/styles";
import { setLocalAppState } from "orion-components/AppState/Actions";

const propTypes = {
	label: PropTypes.string.isRequired,
	updateKey: PropTypes.string.isRequired,
	withOpacity: PropTypes.bool,
	setLayerState: PropTypes.func
};

const defaultProps = {
	withOpacity: false
};

const useStyles = makeStyles({
	thumbOff: {
		backgroundColor: "#ffffff"
	},
	trackOff: {
		backgroundColor: "#828283",
		opacity: 1
	},
	thumbSwitched: {
		backgroundColor: "#29B6F6"
	},
	trackSwitched: {
		backgroundColor: "#bee1f1!important",
		opacity: "1!important"
	}
});

const LayerToggle = (props) => {
	const classes = useStyles();
	const { label, withOpacity, updateKey, setLayerState } = props;

	const { mapSettings } = useSelector((state) => state.appState.persisted);
	const dir = useSelector((state) => getDir(state));
	let opacity;
	let visible;
	if (mapSettings && mapSettings[updateKey]) {
		opacity = mapSettings[updateKey].opacity;
		visible = mapSettings[updateKey].visible;
	}
	const dispatch = useDispatch();

	const handleVisibleChange = useCallback(
		(e) => {
			dispatch(
				setLayerState({
					[updateKey]: { visible: e.target.checked, opacity }
				})
			);
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
			padding: "4px 16px",
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
					onChange={handleVisibleChange}
					checked={visible}
					edge="end"
					color="primary"
					classes={{
						thumb: visible ? classes.thumbSwitched : classes.thumbOff,
						track: visible ? classes.trackSwitched : classes.trackOff
					}}
				/>
			</ListItem>
			{withOpacity && (
				<Collapse in={visible} style={{ padding: "0px 16px" }}>
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
