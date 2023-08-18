import React, { useState } from "react";
import {
	FormControl,
	Input,
	InputAdornment,
	IconButton,
	ListItem,
	ListItemText,
	Tooltip,
	ListItemSecondaryAction
} from "@mui/material";
import { FileCopy, Cancel } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";

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
			...(dir === "rtl" ? { marginLeft: 48 } : { marginRight: 48 }),
			width: "100%"
		},
		icon: {
			position: "relative",
			...(dir === "rtl" ? { right: 48 } : { right: -48 })
		},
		copyIcon: {
			...(dir === "rtl" ? { marginLeft: "25px" } : { marginRight: "25px" }),
			borderRadius: "0",
			color: "white"
		},
		listItem: {
			...(dir === "rtl" ? {
				paddingRight: 0,
				paddingLeft: 48
			} : { paddingLeft: 0 })
		},
		listItemText: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemSecondaryAction: {
			...(dir === "rtl" ? { right: "unset", left: 16 } : {})
		}
	};
	const [state, setState] = useState({
		tooltips: {}
	});
	const { tooltips } = state;
	return !placeholder ? (
		<ListItem style={styles.listItem} key={index}>
			<ListItemText primary={value} primaryTypographyProps={{
				style: {
					color: !targetOrgName ? "#b5b9be" : "white"
				}
			}} style={styles.listItemText} />
			{!targetOrgName && toolTipCheck && (
				<Tooltip
					open={!!tooltips[id]}
					title={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.clipboardText")}
					leaveDelay={1500}
					onClose={() => handleTooltipClose(id, setState)}
				>
					<IconButton
						onClick={() => copyToClipboard(id, setState)}
						style={styles.copyIcon}
					>
						<FileCopy />
					</IconButton>
				</Tooltip>
			)}
			<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
				<IconButton style={{ color: "white" }} disabled={value.length === 0} onClick={handleClear}>
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
				style={styles.input}
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				endAdornment={
					<InputAdornment style={styles.icon} position="end">
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