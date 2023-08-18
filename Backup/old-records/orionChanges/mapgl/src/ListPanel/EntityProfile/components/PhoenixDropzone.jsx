import React, { PureComponent } from "react";
import Dropzone from "react-dropzone";
import { Translate } from "orion-components/i18n/I18nContainer";

class PhoenixDropzone extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			files: []
		};
	}

	onDrop = (acceptedFiles) => {
		this.props.attachAction(this.props.targetEntityId, this.props.targetEntityType, acceptedFiles);
		this.setState({
			files: acceptedFiles
		});
	}

	onOpenClick = () => {
		this.dropzone.open();
	}

	render () {
		return (
			<div style={{float: "right"}}>
				<Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop} style={{ display: "none"}}/>
				<button type="button" onClick={this.onOpenClick} className="dropzone">
                    <Translate value="listPanel.entityProfile.phoenixDropzone.addFilesBtn"/>
				</button>
			</div>
		);
	}
}

export default PhoenixDropzone;