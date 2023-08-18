import React from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	DialogTitle,
	Typography,
	Box,
	withTheme
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function DialogTitleWithCloseIcon(props) {
	const {
		onClose,
		disabled,
		title,
		dir
	} = props;
	return (
		<DialogTitle
			style={{
				paddingBottom: 35,
				paddingLeft: 24,
				paddingRight: 24,
				paddingTop: 35,
				width: "100%", background: "#414449"

			}}
			disableTypography
		>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h5">{title}</Typography>
				<IconButton
					onClick={onClose}
					style={dir == "rtl" ? { marginLeft: -12, marginTop: -10 } : { marginRight: -12, marginTop: -10 }}
					disabled={disabled? false: false}
					aria-label="Close"
				>
					<CloseIcon />
				</IconButton>
			</Box>
		</DialogTitle>
	);
}

DialogTitleWithCloseIcon.propTypes = {
	onClose: PropTypes.func,
	disabled: PropTypes.bool,
	title: PropTypes.string,
	dir: PropTypes.string
};

export default withTheme(DialogTitleWithCloseIcon);
