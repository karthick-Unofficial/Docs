import React, { useRef } from "react";
import Dropzone from "react-dropzone";
import { Translate } from "orion-components/i18n/I18nContainer";

const ProfilePicDropzone = ({ stageFile, dir, label }) => {
	const dropzoneRef = useRef(null);
	const getInitialState = () => {
		return {
			files: []
		};
	};

	const onDrop = (acceptedFiles) => {
		if (acceptedFiles[0]) {
			stageFile(acceptedFiles);
		}

	};

	const onOpenClick = () => {
		dropzoneRef.current.open();
	};

	return (
		<div className='dropzone-container' style={dir && dir == "rtl" ? { marginBottom: "10px", marginRight: "6px" } : { marginBottom: "10px", marginLeft: "6px" }}>
			<Dropzone ref={dropzoneRef} onDrop={onDrop} style={{ display: "none" }} accept='image/*' />
			<a onClick={onOpenClick} className="cb-font-b2 cb-font-link">
				{label ? label : <Translate value="mainContent.shared.profileDropzone.uploadBtn" />}
			</a>
		</div>
	);
};

export default ProfilePicDropzone;