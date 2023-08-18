import React, { useRef } from "react";
import Dropzone from "react-dropzone";
import { Translate } from "orion-components/i18n";

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

	const styles = {
		dropzoneContainer: {
			marginBottom: "10px",
			...(dir && dir == "rtl" ? { marginRight: "6px" } : { marginLeft: "6px" })
		}
	};

	return (
		<div className='dropzone-container' style={styles.dropzoneContainer}>
			<Dropzone ref={dropzoneRef} onDrop={onDrop} style={{ display: "none" }} accept='image/*' />
			<a onClick={onOpenClick} className="cb-font-b2 cb-font-link">
				{label ? label : <Translate value="mainContent.shared.profileDropzone.uploadBtn" />}
			</a>
		</div>
	);
};

export default ProfilePicDropzone;