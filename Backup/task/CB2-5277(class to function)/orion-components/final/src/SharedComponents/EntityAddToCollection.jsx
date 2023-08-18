import React, { useEffect, useState, useCallback } from "react";

// Material Ui
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


const EntityAddToCollection = ({
	close,
	handleCopyComplete,
	addition,
	createCollection,
	open,
	dir
}) => {
	const [newCollectionValue, setNewCollectionValue] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {

		document.addEventListener("keydown", _handleKeyDown);

		return () => {
			document.removeEventListener("keydown", _handleKeyDown);
		};

	}, [_handleKeyDown]);


	// Enter to submit
	const _handleKeyDown = useCallback(event => {
		console.log(event, "event log");
		if (
			event.key === "Enter" && newCollectionValue.length > 0
		) {
			handleSubmit();
		}
	}, []);

	const handleNewCollectionChange = event => {
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
			createCollection(name, addition);
			handleClose();
		}
	};

	const actions = [
		<FlatButton label={getTranslation("global.sharedComponents.entityAddToColl.cancel")} primary={true} onClick={handleClose} />,
		<FlatButton
			label={getTranslation("global.sharedComponents.entityAddToColl.submit")}
			primary={true}
			keyboardFocused={true}
			onClick={handleSubmit}
			disabled={!newCollectionValue}
		/>
	];

	return (
		<Dialog
			title={getTranslation("global.sharedComponents.entityAddToColl.title")}
			className="collection-dialog"
			actions={actions}
			modal={false}
			open={open}
			onRequestClose={close}
			contentStyle={{ maxWidth: 500 }}
		>
			{errorMsg && <p className="dialog-error">{errorMsg}</p>}
			<div>
				<p><Translate value="global.sharedComponents.entityAddToColl.createNewColl" /></p>
				<TextField
					hintText={getTranslation("global.sharedComponents.entityAddToColl.enterCollTitle")}
					value={newCollectionValue}
					hintStyle={{ color: "#828283" }}
					floatingLabelText={getTranslation("global.sharedComponents.entityAddToColl.newColl")}
					//floatingLabelStyle={{ color: "#828283" }}
					floatingLabelFixed={true}
					onChange={handleNewCollectionChange}
					autoFocus={true}
					floatingLabelStyle={{
						style: {
							color: "#828283",
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
						}
					}}
				/>
			</div>
		</Dialog>
	);
};

export default EntityAddToCollection;
