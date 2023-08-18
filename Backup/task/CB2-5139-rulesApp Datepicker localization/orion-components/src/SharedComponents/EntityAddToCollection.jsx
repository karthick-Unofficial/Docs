import React, { Component } from "react";

// Material Ui
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


export default class EntityAddToCollection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newCollectionValue: ""
		};
	}

	componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	// Enter to submit
	_handleKeyDown = event => {
		if (
			event.key === "Enter" && this.state.newCollectionValue.length > 0
		) {
			this.handleSubmit();
		}
	};

	handleNewCollectionChange = event => {
		this.setState({
			newCollectionValue: event.target.value
		});
	};

	handleClose = () => {
		const { close, handleCopyComplete } = this.props;

		// Close both dialogs
		close();
		handleCopyComplete();

		this.setState({
			newCollectionValue: "",
			errorMsg: ""
		});
	};

	handleSubmit = () => {
		const { addition, createCollection } = this.props;
		const { newCollectionValue } = this.state;

		if (!newCollectionValue) {
			return;
		} else {
			const name = newCollectionValue;
			createCollection(name, addition);
			this.handleClose();
		}
	};

	render() {
		const { open, close, dir } = this.props;
		const { errorMsg, newCollectionValue } = this.state;

		const actions = [
			<FlatButton label={getTranslation("global.sharedComponents.entityAddToColl.cancel")} primary={true} onClick={this.handleClose} />,
			<FlatButton
				label={getTranslation("global.sharedComponents.entityAddToColl.submit")}
				primary={true}
				keyboardFocused={true}
				onClick={this.handleSubmit}
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
						floatingLabelStyle={{ color: "#828283" }}
						floatingLabelFixed={true}
						onChange={this.handleNewCollectionChange}
						autoFocus={true}
						floatingLabelStyle={{
							style: {
								transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
							}
						}}
					/>
				</div>
			</Dialog>
		);
	}
}
