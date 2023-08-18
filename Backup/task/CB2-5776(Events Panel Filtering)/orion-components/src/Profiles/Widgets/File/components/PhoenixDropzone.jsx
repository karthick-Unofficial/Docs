import React, { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { Button } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const PhoenixDropzone = ({ attachAction, targetEntityId, targetEntityType }) => {
	const dispatch = useDispatch();

	const [files, setFiles] = useState([]);
	const dropzone = useRef();

	const onDrop = (acceptedFiles) => {
		acceptedFiles.map((file) =>
			Object.assign(file, {
				preview: URL.createObjectURL(file)
			})
		);
		dispatch(attachAction(targetEntityId, targetEntityType, acceptedFiles));
		setFiles(acceptedFiles);
	};

	const onOpenClick = () => {
		dropzone.current.open();
	};
	return (
		<div>
			<Dropzone ref={dropzone} onDrop={onDrop} style={{ display: "none" }}>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps()}>
						<input {...getInputProps()} />
					</div>
				)}
			</Dropzone>
			<Button variant="text" color="primary" onClick={onOpenClick}>
				{getTranslation("global.profiles.widgets.files.phoenixDropzone.uploadFiles")}
			</Button>
		</div>
	);
};

export default PhoenixDropzone;
