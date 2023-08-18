import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
	Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { Translate } from "orion-components/i18n";
import PropTypes from "prop-types";

const propTypes = {
	checkError: PropTypes.func
};

const defaultPropTypes = {
	checkError: () => {},
	onCancel: () => {}
};

const useStyles = makeStyles({
	scrollPaper: {
		width: "70%",
		margin: "0px auto"
	}
});

const Template = ({
	open,
	closeDialog,
	title,
	children,
	onSubmit,
	name,
	checkError,
	onCancel
}) => {
	const overrides = {
		paperProps: {
			width: "480px",
			borderRadius: "5px",
			padding: "25px"
		}
	};

	const [isOpen, setIsOpen] = useState(false);
	const [unitName, setUnitName] = useState("");

	const classes = useStyles();

	useEffect(() => {
		setIsOpen(open);
		setUnitName(name);
	}, [open, name]);

	const save = () => {
		const emptyString = new RegExp("^\\s*$");

		if (emptyString.test(unitName)) {
			checkError("unitName");
		} else {
			onSubmit(unitName);
			handleDialogClose();
		}
	};

	const handleDialogClose = () => {
		setIsOpen(!isOpen);
		setUnitName("");
		closeDialog();
		checkError("");
		onCancel();
	};

	return (
		<div>
			<Dialog
				PaperProps={{ sx: overrides.paperProps }}
				open={isOpen}
				onClose={handleDialogClose}
				classes={{ scrollPaper: classes.scrollPaper }}
				sx={{ zIndex: "1200" }}
				disableEnforceFocus={true}
				scroll="paper"
			>
				<DialogTitle>
					<Typography
						fontSize="16px"
						style={{ marginBottom: "12px", fontWeight: "300px" }}
					>
						{title}
					</Typography>
				</DialogTitle>
				<DialogContent>{children}</DialogContent>

				<DialogActions>
					<Grid container>
						<Grid item xs={3} sm={3} md={3} lg={3} />
						<Grid item xs={4} sm={4} md={4} lg={4}>
							<Button
								className="themedButton"
								variant="text"
								style={{
									textTransform: "none",
									color: "#8A8E92"
								}}
								onClick={handleDialogClose}
							>
								<Translate value="global.units.components.dialog.template.cancel" />
							</Button>
						</Grid>
						<Grid item xs={4} sm={4} md={4} lg={4}>
							<Button
								className="themedButton"
								variant="text"
								style={{
									textTransform: "none",
									backgroundColor: "#4DB5F4",
									width: "175px",
									color: "#fff",
									borderRadius: "10px"
								}}
								onClick={save}
							>
								<Translate value="global.units.components.dialog.template.save" />
							</Button>
							<Grid item xs={1} sm={1} md={1} lg={1} />
						</Grid>
					</Grid>
				</DialogActions>
			</Dialog>
		</div>
	);
};

Template.propTypes = propTypes;
Template.defaultPropTypes = defaultPropTypes;

export default Template;