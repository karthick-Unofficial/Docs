import React, { useEffect, useState, useCallback } from "react";

// Material Ui
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

import { getTranslation } from "orion-components/i18n";
import { TextField } from "orion-components/CBComponents";
import { withStyles } from "@mui/styles";

const styles = {
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
};

const EntityAddToCollection = ({
	close,
	handleCopyComplete,
	addition,
	createCollection,
	open,
	dir,
	dispatch,
	classes
}) => {
	const [newCollectionValue, setNewCollectionValue] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [mounted, setMounted] = useState(false);

	if (!mounted) {
		document.addEventListener("keydown", _handleKeyDown);
		setMounted(true);
	}

	useEffect(() => {
		setMounted(true);
		return () => {
			document.removeEventListener("keydown", _handleKeyDown);
		};
	}, [_handleKeyDown]);

	// Enter to submit
	const _handleKeyDown = useCallback((event) => {
		if (event.key === "Enter" && newCollectionValue.length > 0) {
			handleSubmit();
		}
	}, []);

	const handleNewCollectionChange = (event) => {
		setNewCollectionValue(event.target.value);
	};

	const handleClose = () => {
		// Close both dialogs
		close();
		handleCopyComplete();
		setNewCollectionValue("");
		setErrorMsg("");
	};

	const handleSubmit = () => {
		if (!newCollectionValue) {
			return;
		} else {
			const name = newCollectionValue;
			dispatch(createCollection(name, addition));
			handleClose();
		}
	};

	const actions = [
		<Button
			key="cancel-action-button"
			className="customActionButton"
			onClick={handleClose}
			variant="text"
		>
			{getTranslation("global.sharedComponents.entityAddToColl.cancel")}
		</Button>,
		<Button
			key="submit-action-button"
			className="customActionButton"
			onClick={handleSubmit}
			variant="text"
			disabled={!newCollectionValue}
			classes={{ disabled: classes.disabled }}
		>
			{getTranslation("global.sharedComponents.entityAddToColl.submit")}
		</Button>
	];

	return (
		<Dialog
			className="collection-dialog"
			modal={false}
			open={open}
			onClose={close}
			PaperProps={{
				style: {
					maxWidth: 500,
					width: "75%"
				}
			}}
		>
			<DialogTitle
				sx={{
					padding: "24px 24px 20px",
					fontSize: "22px",
					fontWeight: 400,
					lineHeight: "32px",
					background: "#1f1f21"
				}}
			>
				{getTranslation(
					"global.sharedComponents.entityAddToColl.title"
				)}
			</DialogTitle>
			{errorMsg && <p className="dialog-error">{errorMsg}</p>}
			<div
				style={{
					color: "rgba(255, 255, 255, 0.6)",
					padding: "0px 24px 24px"
				}}
			>
				<TextField
					label={getTranslation(
						"global.sharedComponents.entityAddToColl.newColl"
					)}
					placeholder={getTranslation(
						"global.sharedComponents.entityAddToColl.enterCollTitle"
					)}
					value={newCollectionValue}
					handleChange={handleNewCollectionChange}
					autoFocus={true}
					dir={dir}
					inputLabelStyle={{ fontSize: 16 }}
					formControlStyles={{ width: "256px" }}
					labelShrink={true}
				/>
			</div>
			<DialogActions
				sx={{ flexDirection: "row!important" }}
				disableSpacing={true}
			>
				{actions}
			</DialogActions>
		</Dialog>
	);
};

export default withStyles(styles)(EntityAddToCollection);
