import React, { useState } from "react";
import { Cancel } from "@material-ui/icons";
import {
	FormControl,
	Input,
	InputAdornment,
	IconButton,
	ListItem,
	ListItemText,
	Tooltip,
	ListItemSecondaryAction
} from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";
import { getTranslation} from "orion-components/i18n/I18nContainer";

const copyToClipboard = (connectionId, setState) => {
	setState(prevState => {
		return {
			...prevState,
			tooltips: {
				[connectionId]: true
			}
		};
	});
	navigator.clipboard.writeText(connectionId);
};

const handleTooltipClose = (connectionId, setState) => {
	setState(prevState => {
		return {
			...prevState,
			tooltips: {
				[connectionId]: false
			}
		};
	});
};

const Row = ({
	id,
	value,
	toolTipCheck,
	targetOrgName,
	index,
	handleChange,
	handleClear,
	placeholder,
	dir
}) => {
	const styles = {
		input: {
			marginRight: 48,
			width: "100%"
		},
		icon: {
			position: "relative",
			right: -48
		},
		inputRTL: {
			marginLeft: 48,
			width: "100%"
		},
		iconRTL: {
			position: "relative",
			right: 48
		},
		copyRTL: {
			marginLeft: "25px",
			borderRadius: "0",
			color: "white" 
		},
		listItemRTL: {
			paddingRight: 0,
			paddingLeft: 48
		}
	};
	const [state, setState] = useState({
		tooltips: {}
	});
	const { tooltips } = state;
	return !placeholder ? (
		<ListItem style={dir && dir == "rtl" ? styles.listItemRTL : {paddingLeft: 0}} key={index}>
			<ListItemText primary={value} primaryTypographyProps={{
				style: {
					color: !targetOrgName ? "#b5b9be" : "white"
				}
			}} style={dir && dir == "rtl" ? {textAlign: "right"} : {}} />
			{!targetOrgName && toolTipCheck && (
				<Tooltip
					open={!!tooltips[id]}
					title={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.clipboardText")}
					leaveDelay={1500}
					onClose={() => handleTooltipClose(id, setState)}
				>
					<IconButton
						onClick={() => copyToClipboard(id, setState)}
						style={dir && dir == "rtl" ? styles.copyRTL : { marginRight: "25px", borderRadius: "0", color: "white" }}
					>
						<FileCopy />
					</IconButton>
				</Tooltip>
			)}
			<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16}: {}}>
				<IconButton style={{color: "white"}} disabled={value.length === 0} onClick={handleClear}>
					<Cancel />
				</IconButton>
			</ListItemSecondaryAction>

		</ListItem>
	) : (
		<FormControl
			style={{ flexDirection: "row", maxHeight: 32 }}
			margin="normal"
			fullWidth={true}
		>
			<Input
				id={id}
				style={dir == "rtl" ? styles.inputRTL : styles.input}
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				endAdornment={
					<InputAdornment style={dir == "rtl" ? styles.iconRTL : styles.icon} position="end">
						<IconButton disabled={value.length === 0} onClick={handleClear}>
							<Cancel />
						</IconButton>
					</InputAdornment>
				}
				autoFocus={true}
			/>
		</FormControl>
	);
};

export default Row;