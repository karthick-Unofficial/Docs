import React, { Component } from "react";
import Dropzone from "react-dropzone";
import {Translate} from "orion-components/i18n/I18nContainer";

class ProfilePicDropzone extends Component {
	getInitialState = () => {
		return {
			files: []
		};
	}

	onDrop = (acceptedFiles) => {
		if (acceptedFiles[0]) {
			this.props.stageFile(acceptedFiles);
		}
		
	}

	onOpenClick = () => {
		this.dropzone.open();
	}

	render () {
		return (
			<div className='dropzone-container' style={this.props.dir && this.props.dir == "rtl" ? {marginBottom: "10px", marginRight: "6px"} : {marginBottom: "10px", marginLeft: "6px"}}>
				<Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop} style={{ display: "none"}} accept='image/*'/>
				<a onClick={this.onOpenClick} className="cb-font-b2 cb-font-link">
					{this.props.label ? this.props.label : <Translate value="mainContent.shared.profileDropzone.uploadBtn"/>}
				</a>
			</div>
		);
	}
}

export default ProfilePicDropzone;