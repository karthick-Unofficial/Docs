import React, { Fragment } from "react";
import PropTypes from "prop-types";

const propTypes = {
	selectedColor: PropTypes.string.isRequired,
	setData: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};

const defaultProps = {
	selectedColor: "#0073c8",
	setData: () => {},
	title: "Color"
};

const styles = {
	colorBlock: {
		height: 34,
		width: 34
	},
	colorRow: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		marginTop: 15
	},
	text: {
		color: "white"
	}
};

// Individual Color Block
const Tile = ({ color, selectColor, selectedColor }) => {
	const isWhite = color === "#ffffff";

	return (
		<div
			onClick={() => selectColor(color)}
			style={{
				...styles.colorBlock,
				backgroundColor: color,
				...(selectedColor === color && {
					border: isWhite ? "3px solid #8c8c8c" : "3px solid white"
				})
			}}
		/>
	);
};

const ColorTiles = ({ selectedColor, title, setData }) => {
	const selectColor = (hex) => {
		setData(hex);
	};

	const colorRowOne = [
		"#0073c8",
		"#38499f",
		"#238238",
		"#ffac3c",
		"#9c0019",
		"#000000"
	];
	const colorRowTwo = [
		"#2face8",
		"#6e399e",
		"#82cf51",
		"#fffd4f",
		"#ff0022",
		"#ffffff"
	];

	return (
		<Fragment>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				<div style={{ width: "100%" }}>
					<p style={styles.text}>{title}</p>
				</div>

				<div style={styles.colorRow}>
					{colorRowOne.map((hexCode) => {
						return (
							<Tile
								key={hexCode}
								color={hexCode}
								selectColor={selectColor}
								selectedColor={selectedColor}
							/>
						);
					})}
				</div>

				<div style={{ ...styles.colorRow, marginBottom: 15 }}>
					{colorRowTwo.map((hexCode) => {
						return (
							<Tile
								key={hexCode}
								color={hexCode}
								selectColor={selectColor}
								selectedColor={selectedColor}
							/>
						);
					})}
				</div>
			</div>
		</Fragment>
	);
};

ColorTiles.propTypes = propTypes;
ColorTiles.defaultProps = defaultProps;

export default ColorTiles;
