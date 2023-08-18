import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton, Typography } from "@mui/material";
import FileLink from "../../../../CBComponents/CBFileLink/FileLink";

const renderFileLink = (currentIndex, attachment, canEdit, handleDeleteFile, entityType, dir, expandedView) => {
	return (
		<FileLink
			key={currentIndex}
			attachment={attachment}
			canEdit={canEdit}
			handleDeleteFile={handleDeleteFile}
			entityType={entityType}
			dir={dir}
			sliderImage={true}
			expandedView={expandedView}
		/>
	);
};

const ImageSlider = ({ attachments, canEdit, handleDeleteFile, entityType, dir, expandedView }) => {
	const images =
		attachments?.length > 0
			? attachments.map((element, index) =>
					renderFileLink(index, element, canEdit, handleDeleteFile, entityType, dir, expandedView)
			  )
			: [];

	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
	};

	// Check if the current index is out of bounds and adjust it accordingly
	if (currentIndex < 0 || currentIndex >= images.length) {
		setCurrentIndex(images.length - 1);
	}

	const indicatorsPerPage = 15; // Number of indicators to show per page

	// Calculate the start and end index of the indicators to display based on the current page
	const startIndex = Math.floor(currentIndex / indicatorsPerPage) * indicatorsPerPage;
	const endIndex = Math.min(startIndex + indicatorsPerPage, images.length);

	// Generate the slider indicators based on the current page
	const sliderIndicators = images.slice(startIndex, endIndex).map((_, index) => {
		const indicatorIndex = startIndex + index;
		return (
			<div
				key={indicatorIndex}
				style={{
					width: "8px",
					height: "8px",
					borderRadius: "50%",
					backgroundColor: indicatorIndex === currentIndex ? "#FFFFFF" : "#616263",
					margin: "0 4px",
					cursor: "pointer"
				}}
				onClick={() => setCurrentIndex(indicatorIndex)}
			/>
		);
	});

	const styles = {
		imageSliderContainer: {
			width: "100%",
			marginTop: "10.5px"
		},
		chevron: {
			display: "flex",
			alignItems: "center",
			height: !expandedView ? "150px" : "auto"
		},
		chevronIconLeft: {
			color: "#FFF",
			padding: "0px",
			...(dir === "ltr" && { marginLeft: "-10px" }),
			...(dir === "rtl" && { marginRight: "-10px" })
		},
		fileName: {
			color: "#B6B6B2",
			fontFamily: "Roboto",
			marginTop: "-5px"
		},
		sliderIndicators: {
			display: "flex",
			justifyContent: "center",
			marginTop: "7px"
		},
		chevronIconRight: {
			color: "#FFF",
			padding: "0px"
		},
		imageWrapper: {
			margin: "auto",
			textAlign: "center"
		}
	};

	return (
		<div style={styles.imageSliderContainer}>
			<div style={{ display: "flex" }}>
				<div style={styles.chevron}>
					<IconButton onClick={handlePrevious} style={styles.chevronIconLeft}>
						<ChevronLeftIcon fontSize="large" />
					</IconButton>
				</div>
				<div style={styles.imageWrapper}>
					{images[currentIndex]}
					<Typography fontSize="12px" style={styles.fileName}>
						{attachments[currentIndex]?.filename}
					</Typography>
					<div style={styles.sliderIndicators}>{sliderIndicators}</div>
				</div>
				<div style={styles.chevron}>
					<IconButton onClick={handleNext} style={styles.chevronIconRight}>
						<ChevronRightIcon fontSize="large" />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

export default ImageSlider;
