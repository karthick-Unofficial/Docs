import React, { useState } from "react";
import {
	Dialog, DialogTitle, DialogContent,
	DialogActions, Button, Grid, Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { Translate } from "orion-components/i18n";



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
	name
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
		onSubmit(unitName);
		handleDialogClose();
	}

	const handleDialogClose = () => {
		setIsOpen(!isOpen);
		setUnitName("");
		closeDialog();
	}

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
					<Typography fontSize="16px" style={{ marginBottom: "12px", fontWeight: "300px" }}>
						{title}
					</Typography>
				</DialogTitle>
				<DialogContent >
					{children}
				</DialogContent>

				<DialogActions>
					<Grid container>
						<Grid item xs={3} sm={3} md={3} lg={3} />
						<Grid item xs={4} sm={4} md={4} lg={4}>
							<Button
								className="themedButton"
								variant="text"
								style={{ textTransform: "none", color: "#8A8E92" }}
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
		</div >
	);
}
export default Template;