import React, { useRef } from "react";
import Dropzone from "react-dropzone";
import { Translate } from "orion-components/i18n";

const PhoenixDropzone = ({
	attachAction,
	targetEntityId,
	targetEntityType
}) => {
	const dropzone = useRef(null);

	const onDrop = (acceptedFiles) => {
		attachAction(targetEntityId, targetEntityType, acceptedFiles);
	};

	const onOpenClick = () => {
		dropzone.open();
	};

	return (
		<div style={{ float: "right" }}>
			<Dropzone
				ref={dropzone}
				onDrop={onDrop}
				style={{ display: "none" }}
			/>
			<button type="button" onClick={onOpenClick} className="dropzone">
				<Translate value="listPanel.entityProfile.phoenixDropzone.addFilesBtn" />
			</button>
		</div>
	);
};

export default PhoenixDropzone;
