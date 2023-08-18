import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { FlatButton } from "material-ui";
import { getTranslation } from "orion-components/i18n/I18nContainer";

class PhoenixDropzone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: []
		};
	}

	onDrop = acceptedFiles => {
		this.props.attachAction(
			this.props.targetEntityId,
			this.props.targetEntityType,
			acceptedFiles
		);
		this.setState({
			files: acceptedFiles
		});
	};

	onOpenClick = () => {
		this.dropzone.open();
	};

	render() {
		return (
			<div>
				<Dropzone
					ref={node => {
						this.dropzone = node;
					}}
					onDrop={this.onDrop}
					style={{ display: "none" }}
				/>
				<FlatButton
					label={getTranslation("global.profiles.widgets.files.phoenixDropzone.uploadFiles")}
					primary={true}
					onClick={this.onOpenClick}
				/>
			</div>
		);
	}
}

export default PhoenixDropzone;
