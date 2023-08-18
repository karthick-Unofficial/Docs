import React, { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { FlatButton } from "material-ui";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const PhoenixDropzone = ({ attachAction, targetEntityId, targetEntityType }) => {
	const [files, setFiles] = useState([]);
	const dropzone = useRef();

	const onDrop = acceptedFiles => {
		attachAction(
			targetEntityId,
			targetEntityType,
			acceptedFiles
		);
		setFiles(acceptedFiles);
	};

	const onOpenClick = () => {
		dropzone.current.open();
	};
	return (
		<div>
			<Dropzone
				ref={dropzone}
				onDrop={onDrop}
				style={{ display: "none" }}
			/>
			<FlatButton
				label={getTranslation("global.profiles.widgets.files.phoenixDropzone.uploadFiles")}
				primary={true}
				onClick={onOpenClick}
			/>
		</div>
	);
};

export default PhoenixDropzone;
