import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

const CustomFilesDropContainer = ({ getDropZoneAction, entityType, contextId }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	const dispatch = useDispatch();

	const handleDragEnter = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const container = document.getElementById("fileDropContainer");
		const isOutsideContainer = !container.contains(event.relatedTarget);
		if (isOutsideContainer) {
			setIsHovering(false);
		}
		const isOutsideBrowser =
			event.clientY <= 0 ||
			event.clientX <= 0 ||
			event.clientX >= window.innerWidth ||
			event.clientY >= window.innerHeight;
		if (isOutsideBrowser) {
			setIsDragging(false);
		}
	};

	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
		setIsHovering(false);
	};

	useEffect(() => {
		// Add event listeners for drag and drop events to the document
		document.addEventListener("dragenter", handleDragEnter);
		document.addEventListener("dragover", handleDragOver);
		document.addEventListener("dragleave", handleDragLeave);
		document.addEventListener("drop", handleDrop);

		// Clean up event listeners on component unmount
		return () => {
			document.removeEventListener("dragenter", handleDragEnter);
			document.removeEventListener("dragover", handleDragOver);
			document.removeEventListener("dragleave", handleDragLeave);
			document.removeEventListener("drop", handleDrop);
		};
	}, []);

	return (
		<Fragment>
			{isDragging && (
				<div
					id="fileDropContainer"
					className={`fileDropContainer ${isHovering ? "fileHover" : ""}`}
					onDragEnter={(event) => {
						if (event.dataTransfer.items.length > 0) {
							setIsHovering(true);
						}
					}}
					onDragLeave={handleDragLeave}
					onDrop={(event) => {
						event.preventDefault();
						event.stopPropagation();
						const { files } = event.dataTransfer;
						const attachAction = getDropZoneAction(entityType);
						dispatch(attachAction(contextId, entityType, files));

						setIsDragging(false);
						setIsHovering(false);
					}}
				>
					<div>
						<Translate value="global.profiles.widgets.files.dropFiles" />
					</div>
					{isHovering && <div className="fileOverlay" />}
				</div>
			)}
		</Fragment>
	);
};

CustomFilesDropContainer.propTypes = {
	getDropZoneAction: PropTypes.func.isRequired,
	entityType: PropTypes.string.isRequired,
	contextId: PropTypes.string.isRequired
};

export default CustomFilesDropContainer;
