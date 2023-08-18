import React, { useState } from "react";
import PropTypes from "prop-types";
import { GithubPicker } from "react-color";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Translate, getTranslation } from "orion-components/i18n";

const itemPropTypes = {
	slide: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	handleChangeColor: PropTypes.func.isRequired,
	handleChangeText: PropTypes.func.isRequired,
	handleRemoveSlide: PropTypes.func.isRequired,
	deleteDisabled: PropTypes.bool,
	dir: PropTypes.string
};

const EditTextItem = ({
	slide,
	index,
	handleChangeColor,
	handleChangeText,
	handleRemoveSlide,
	deleteDisabled,
	dir
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (type) => {
		setIsHovered(type);
	};

	const open = Boolean(anchorEl);

	const itemStyles = {
		container: {
			width: "100%",
			margin: "15px 0 15px 0",
			display: "flex",
			alignItems: "center",
			alignContent: "center",
			justifyContent: "space-evenly"
		},
		inputLabelProps: {
			color: "#B5B9BE",
			...(dir === "rtl" && {
				transformOrigin: "top right",
				textAlign: "right",
				right: "0"
			}),
			...(dir === "rtl" && {
				transformOrigin: "top left",
				textAlign: "left"
			})
		}
	};

	return (
		<div style={itemStyles.container}>
			<div
				onClick={handleClick}
				onMouseEnter={() => handleHover(true)}
				onMouseLeave={() => handleHover(false)}
				style={{
					borderRadius: "50%",
					backgroundColor: slide.color ? slide.color : "transparent",
					height: "50px",
					width: "50px",
					boxShadow: slide.color ? null : "0 0 0 2px #B5B9BE",
					...(isHovered && {
						boxShadow: `0 0 0 3px ${
							slide.color ? slide.color : "white"
						}`,
						cursor: "pointer"
					})
				}}
			/>
			<Popover
				id={`color-popover-${index}`}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
			>
				<GithubPicker
					color={slide.color}
					onChangeComplete={(color) => {
						handleChangeColor(color, index);
						handleClose();
					}}
					colors={[
						"#008b02",
						"#fcac00",
						"#db0000",
						"#1273de",
						"#038795",
						"#3f3f3f",
						"#000000",
						"#7fc580",
						"#fdd57f",
						"#ed7f7f",
						"#88b9ee",
						"#81c3ca",
						"#9f9f9f",
						"#ffffff"
					]}
				/>
			</Popover>
			<div style={{ width: "70%", padding: "0 20px" }}>
				<TextField
					style={{ width: "100%" }}
					id={`text-set-${index}`}
					variant="standard"
					label={getTranslation(
						"global.sharedComponents.statusCard.StatusCardDialog.editSlide.fieldLabel.text"
					)}
					value={slide.text}
					onChange={(e) => handleChangeText(e, index)}
					margin="normal"
					InputLabelProps={{
						style: itemStyles.inputLabelProps
					}}
				/>
			</div>
			{deleteDisabled ? (
				<Tooltip
					title={getTranslation(
						"global.sharedComponents.statusCard.StatusCardDialog.editSlide.fieldLabel.atleastOne"
					)}
				>
					{/* Tooltip listens to first child's events, won't fire on disabled elements */}
					<span>
						<IconButton
							style={{ padding: 0 }}
							onClick={() => handleRemoveSlide(index)}
							disabled={true}
						>
							<DeleteIcon />
						</IconButton>
					</span>
				</Tooltip>
			) : (
				<IconButton
					style={{ padding: 0 }}
					onClick={() => handleRemoveSlide(index)}
				>
					<DeleteIcon />
				</IconButton>
			)}
		</div>
	);
};

EditTextItem.propTypes = itemPropTypes;

const propTypes = {
	control: PropTypes.object.isRequired,
	setData: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const EditText = ({ control, setData, dir }) => {
	const { items } = control;
	const [slides, setSlides] = useState(items);

	// -- Initialize child data
	setData(slides);

	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	const handleChangeColor = (color, index) => {
		const newSlides = [...slides];
		newSlides[index].color = color.hex;

		setSlides(newSlides);
		setData(newSlides);
	};

	const handleChangeText = (e, index) => {
		const newSlides = [...slides];
		newSlides[index].text = e.target.value;

		setSlides(newSlides);
		setData(newSlides);
	};

	const addNewSlide = () => {
		const newSlides = [...slides, { text: "" }];

		setSlides(newSlides);
		setData(newSlides);
	};

	const handleRemoveSlide = (index) => {
		const newSlides = slides.filter((item, idx) => {
			return idx !== index;
		});

		setSlides(newSlides);
		setData(newSlides);
	};

	const styles = {
		container: {
			width: "100%",
			height: "100%"
		},
		controls: {
			display: "flex",
			align: "center",
			alignItems: "center",
			paddingTop: "15px",
			...(dir === "rtl" && { marginRight: "17px" }),
			...(dir === "ltr" && { marginLeft: "17px" })
		},
		typography: {
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		}
	};

	return (
		<div
			id="edit-slides-boundary"
			style={styles.container}
			onMouseDown={stopPropagation}
			onTouchStart={stopPropagation}
		>
			{slides.map((slide, idx) => {
				return (
					<EditTextItem
						key={idx + 10}
						slide={slide}
						text={slide.text}
						color={slide.color}
						index={idx}
						handleChangeColor={handleChangeColor}
						handleChangeText={handleChangeText}
						handleRemoveSlide={handleRemoveSlide}
						deleteDisabled={slides.length <= 1}
						dir={dir}
					/>
				);
			})}
			<div style={styles.controls}>
				<Fab onClick={addNewSlide} color="primary" size="small">
					<AddIcon />
				</Fab>
				<Typography variant="body1" style={styles.typography}>
					<Translate value="global.sharedComponents.statusCard.StatusCardDialog.editSlide.newSlide" />
				</Typography>
			</div>
		</div>
	);
};

EditText.propTypes = propTypes;
export default EditText;

// add a property to one of the rows, fo rthe selected index, use indexOf to set selected index before updating
