import React, { useState } from "react";
import PropTypes from "prop-types";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Grid, ListItem, ListItemText, IconButton, Button } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import DomainIcon from "@mui/icons-material/Domain";
import NearMeIcon from "@mui/icons-material/NearMe";
import VideocamIcon from "@mui/icons-material/Videocam";
import PlaceIcon from "@mui/icons-material/Place";
import LayersIcon from "@mui/icons-material/Layers";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	canRemove: PropTypes.bool,
	disabled: PropTypes.bool,
	feedId: PropTypes.string,
	handleClick: PropTypes.func,
	handleRemove: PropTypes.func,
	id: PropTypes.string.isRequired,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
	type: PropTypes.string,
	selectFloor: PropTypes.func,
	classes: PropTypes.object,
	geometry: PropTypes.object,
	showIcon: PropTypes.bool,
	entityType: PropTypes.string
};
const styles = {
	label: {
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis"
	},
	disabledButton: {
		color: "#6E777C !important",
		fontWeight: "bolder"
	}
};
const defaultProps = {
	canRemove: false,
	disabled: false,
	feedId: null,
	handleClick: null,
	handleRemove: null,
	name: "",
	readOnly: false,
	type: "",
	selectFloor: () => {},
	showIcon: false,
	entityType: null
};

const renderIcons = (iconName) => {
	switch (iconName) {
		case "facility":
			return <DomainIcon sx={{ color: "#B0B5B8" }} />;
		case "track":
			return <NearMeIcon sx={{ color: "#B0B5B8" }} />;
		case "camera":
			return <VideocamIcon sx={{ color: "#B0B5B8" }} />;
		case "Point":
			return <PlaceIcon sx={{ color: "#B0B5B8" }} />;
		case "Polygon":
			return <LayersIcon sx={{ color: "#B0B5B8" }} />;
		case "LineString":
			return <TimelineIcon sx={{ color: "#B0B5B8" }} />;
		default:
			return null;
	}
};

const CollectionCardItem = ({
	canRemove,
	disabled,
	feedId,
	handleClick,
	handleRemove,
	classes,
	id,
	name,
	readOnly,
	type,
	geometry,
	selectFloor,
	showIcon,
	entityType
}) => {
	const dir = useSelector((state) => getDir(state));
	const inlineStyles = {
		listItemText: {
			padding: 0,
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			...(dir === "rtl" && {
				textAlign: "right",
				marginRight: "5px"
			})
		},
		emptyTargetSpace: {
			...(dir === "rtl" && {
				marginRight: "46px"
			}),
			...(dir === "ltr" && {
				marginLeft: "46px"
			})
		}
	};

	const [buttonTriggered, setButtonTriggered] = useState(false);

	const renderTargetIcon = () => {
		if (!disabled && ((id && feedId) || geometry)) {
			return <TargetingIcon feedId={feedId} id={id} geometry={geometry} selectFloor={selectFloor} />;
		} else {
			return <div style={inlineStyles.emptyTargetSpace} />;
		}
	};

	return (
		<Grid container>
			<ListItem key={id} disabled={disabled} style={{ height: 48, padding: 8, direction: dir }}>
				<Grid item xs={type ? 6 : 10} style={{ display: "flex", alignItems: "center" }}>
					{renderTargetIcon()}
					{showIcon && renderIcons(entityType)}
					<ListItemText
						style={inlineStyles.listItemText}
						primary={
							handleClick ? (
								<Button
									color="primary"
									classes={{
										label: classes.label,
										disabled: classes.disabledButton
									}}
									style={{
										textTransform: "none",
										fontSize: 16
									}}
									disabled={disabled}
									onClick={handleClick}
								>
									{name ? name : id ? id.toUpperCase() : ""}
								</Button>
							) : name ? (
								name
							) : id ? (
								id.toUpperCase()
							) : (
								""
							)
						}
						primaryTypographyProps={{
							noWrap: true
						}}
					/>
				</Grid>
				{type && (
					<Grid item xs={5}>
						<ListItemText
							primary={type}
							primaryTypographyProps={{
								style: {
									color: "#FFF",
									flex: "0 0 auto",
									marginLeft: 20,
									direction: dir
								},
								noWrap: true,
								variant: "body1"
							}}
						/>
					</Grid>
				)}
				{canRemove && !readOnly && (
					<Grid item xs={type ? 1 : 2}>
						<IconButton
							onClick={() => {
								if (!buttonTriggered) {
									handleRemove();
									setButtonTriggered(!buttonTriggered);
								}
							}}
						>
							<Cancel />
						</IconButton>
					</Grid>
				)}
			</ListItem>
		</Grid>
	);
};
const areEqual = (prevProps, nextProps) => {
	/*
	 * Performance enhancement: Compare all props except handleClick & handleRemove.
	 * Comparing functions always returns false and these functions would only change if the underlying item changed,
	 * which would cause a rerender of the component anyways. - CD
	 */
	const { canRemove, disabled, feedId, id, name, readOnly, type, geometry } = nextProps;
	const changedProps = Object.entries({
		canRemove,
		disabled,
		feedId,
		id,
		name,
		readOnly,
		type,
		geometry
	}).reduce((changedProp, [key, val]) => {
		if (prevProps[key] !== val) {
			changedProp[key] = [prevProps[key], val];
		}
		return changedProp;
	}, {});
	if (Object.keys(changedProps).length > 0) {
		return false;
	} else {
		return true;
	}
};
CollectionCardItem.propTypes = propTypes;
CollectionCardItem.defaultProps = defaultProps;
export default React.memo(withStyles(styles)(CollectionCardItem), areEqual);
