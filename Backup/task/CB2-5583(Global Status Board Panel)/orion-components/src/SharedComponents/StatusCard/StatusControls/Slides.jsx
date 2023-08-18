import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";


const propTypes = {
	control: PropTypes.object.isRequired,
	updateSelected: PropTypes.func.isRequired,
	disableControls: PropTypes.bool.isRequired,
	dir: PropTypes.string
};

const Slides = ({ control, updateSelected, disableControls, dir, forceUpdate }) => {
	const { selectedIndex } = control;
	const [selectedIndexState, setSelectedIndexState] = useState(selectedIndex);

	const selectedItem = control.items[selectedIndexState];
	const {
		color: selectedItemColor,
		text: selectedItemText
	} = selectedItem;

	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = e => {
		e.stopPropagation();
	};

	const updateSelectedIndex = (isIncrement) => {
		const value = isIncrement
			? selectedIndexState + 1
			: selectedIndexState - 1;

		setSelectedIndexState(value);
		const response = updateSelected(value);
		console.log("***", response);
	};

	useEffect(() => {
		console.log("$$$", selectedIndex);
		setSelectedIndexState(selectedIndex);
	}, [selectedIndex, forceUpdate]);
	console.log("+++");
	const styles = {
		container: {
			width: "100%",
			height: "calc(100% - 91px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			...(dir === "rtl" && { flexDirection: "row-reverse" })
		},
		content: {
			width: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		},
		textContainer: {
			height: "70px",
			overflow: "hidden",
			display: "flex",
			alignItems: "center"
		},
		withColor: {
			maxWidth: "calc(100% - 70px)",
			...(dir === "rtl" && { marginRight: "20px" }),
			...(dir === "ltr" && { marginLeft: "20px" })
		},
		slideText: {
			color: "#B5B9BE",
			fontSize: "20px",
			maxHeight: "70px"
		}
	};

	return (
		<div style={styles.container}>
			{!disableControls && (
				<div>
					<IconButton
						className="status-card-slider-control slider-control-left"
						disabled={selectedIndexState === 0}
						onClick={() => updateSelectedIndex()}
						disableFocusRipple={true}
						disableRipple={true}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
					>
						<ArrowLeftIcon style={{ fontSize: "3rem", color: selectedIndexState !== 0 ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3" }} />
					</IconButton>
				</div>
			)}
			<div style={styles.content}>
				{selectedItemColor && <div style={{
					borderRadius: "50%",
					backgroundColor: selectedItemColor,
					height: "50px",
					width: "50px"
				}}></div>}
				<div style={{ ...styles.textContainer, ...(selectedItemColor ? styles.withColor : {}) }}>
					<h2 style={styles.slideText}>{selectedItemText}</h2>
				</div>
			</div>
			{!disableControls && (
				<div>
					<IconButton
						className="status-card-slider-control slider-control-right"
						disabled={selectedIndexState === (control.items.length - 1)}
						onClick={() => updateSelectedIndex(true)}
						disableFocusRipple={true}
						disableRipple={true}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
					>
						<ArrowRightIcon style={{ fontSize: "3rem", color: selectedIndexState !== (control.items.length - 1) ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)" }} />
					</IconButton>
				</div>
			)}
		</div>
	);
};

Slides.propTypes = propTypes;
export default Slides;
