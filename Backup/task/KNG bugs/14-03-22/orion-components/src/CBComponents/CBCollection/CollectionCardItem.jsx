import React from "react";
import PropTypes from "prop-types";
import { TargetingIcon } from "orion-components/SharedComponents";
import {
	Grid,
	ListItem,
	ListItemText,
	IconButton,
	Button
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

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
	dir: PropTypes.string
};
const styles = {
	label: {
		overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
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
	dir: "ltr"
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
	dir
}) => {
	return (
		<Grid container>
			<ListItem key={id} disabled={disabled} style={{ height: 48, padding: 8, direction: dir }}>
				<Grid
					item
					xs={type ? 6 : 10}
					style={{ display: "flex", alignItems: "center" }}
				>
					{!disabled && ((id && feedId) || geometry) && (
						<TargetingIcon feedId={feedId} id={id} geometry={geometry} />
					)}
					<ListItemText
						style={
							dir === "rtl" ?
								{
									padding: 0,
									overflow: "hidden",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
									textAlign: "right",
									marginRight: "5px"
								}
								:
								{
									padding: 0,
									overflow: "hidden",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis"
								}
						}
						primary={
							handleClick ? (
								<Button
									color="primary"
									classes={{
										label: classes.label
									}}
									style={{ textTransform: "none", fontSize: 16 }}
									disabled={disabled}
									onClick={handleClick}
								>
									{name ? name : id ? id.toUpperCase() : ""}
								</Button>
							) : (
								name ? name : id ? id.toUpperCase() : ""
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
								style: { color: "#FFF", flex: "0 0 auto", marginLeft: 20, direction: dir },
								noWrap: true,
								variant: "body1"
							}}
						/>
					</Grid>
				)}
				{!disabled && canRemove && !readOnly && (
					<Grid item xs={type ? 1 : 2}>
						<IconButton onClick={handleRemove}>
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
	const {
		canRemove,
		disabled,
		feedId,
		id,
		name,
		readOnly,
		type,
		geometry
	} = nextProps;
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
	}
	else {
		return true;
	}
};
CollectionCardItem.propTypes = propTypes;
CollectionCardItem.defaultProps = defaultProps;
export default React.memo(withStyles(styles)(CollectionCardItem), areEqual);
