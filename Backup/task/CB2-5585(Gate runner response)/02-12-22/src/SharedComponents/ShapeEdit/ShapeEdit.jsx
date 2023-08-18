import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SearchField, SelectField } from "orion-components/CBComponents";
import SymbolCollection from "./components/SymbolCollection";
import ColorTiles from "./components/ColorTiles";
import TransparencySlider from "./components/TransparencySlider";
import StrokeProperties from "./components/StrokeProperties";
import { withStyles } from "@mui/styles";
import { Drawer, Button, Typography, TextField, MenuItem } from "@mui/material";
import { getSymbols } from "./utils";
import Map from "lodash/map";
import { validateShape } from "orion-components/Map/helpers";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";


const styles = {
	root: {
		"&.Mui-focused": {
			backgroundColor: "rgb(31, 31, 33)"
		}
	},
	paper: {
		top: 48,
		width: 350,
		height: "calc(100% - 48px)"
	},
	input: {
		"&::placeholder": {
			fontSize: 14,
			color: "#828283"
		},
		height: "unset!important",
		color: "#fff"
	},
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	},
	selected: {
		backgroundColor: "rgba(255, 255, 255, 0.16)!important"
	}
};

const propTypes = {
	map: PropTypes.object.isRequired,
	entity: PropTypes.object,
	handleSave: PropTypes.func.isRequired,
	app: PropTypes.string,
	dir: PropTypes.string
};

const ShapeEdit = ({
	app,
	mapTools,
	map,
	setMapTools,
	handleSave,
	classes,
	open,
	dir
}) => {

	const dispatch = useDispatch();

	const [expanded, setExpanded] = useState(false);
	const [collections, setCollections] = useState(null);
	const [search, setSearch] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [displayOnEventActive, setDisplayOnEventActive] = useState(app === "events-app" ? true : false);
	const [symbol, setSymbol] = useState(null);
	const [fillColor, setFillColor] = useState("0073c8");
	const [strokeColor, setStrokeColor] = useState("2face8");
	const [strokeThickness, setStrokeThickness] = useState(3);
	const [strokeType, setStrokeType] = useState("Solid");
	const [transparency, setTransparency] = useState(20);
	const [valid, setValid] = useState(mapTools.feature ? true : false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const { mode, feature } = mapTools;
		const icons = require.context("./icons", true);
		if (mode === "draw_point" || (feature && feature.geometry.type === "Point")) {
			const collections = getSymbols(map, icons);
			setCollections(collections);
			setSymbol("Marker_blue");
		}
		if (feature) {
			const { properties } = feature;
			const {
				name,
				description,
				displayOnEventActive = false,
				symbol,
				polyFill,
				polyStroke,
				polyFillOpacity,
				lineWidth,
				lineType
			} = properties;
			setName(name);
			setDescription(description);
			setDisplayOnEventActive(displayOnEventActive);
			setSymbol(symbol);
			setFillColor(polyFill);
			setStrokeColor(polyStroke);
			setTransparency(polyFillOpacity * 100);
			setStrokeThickness(lineWidth);
			setStrokeType(lineType);
		}

		map.on("draw.create", () => {
			setValid(true);
		});
		map.on("draw.delete", () => {
			setValid(false);
		});
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", handleKeydown);
		return () => {
			document.removeEventListener("keydown", handleKeydown);
		};
	}, [handleKeydown]);

	const handleKeydown = e => {
		if (e.key === "Escape") {
			handleClose();
		}
	};

	const handleClearSearch = () => {
		setSearch("");
	};

	const handleChange = field => event => {
		const { value } = event.target;
		// Switch case using for updating state values dynamically depends on our changes.
		switch (field) {
			case "name": {
				setName(value);
				break;
			}
			case "description": {
				setDescription(value);
				break;
			}
			case "displayOnEventActive": {
				setDisplayOnEventActive(value);
				break;
			}
		}
	};

	// Sets data in parent component when data in child component updates for ease of access
	const setData = field => value => {
		//Switch case using for updating state values dynamically depends on our changes.
		switch (field) {
			case "fillColor": {
				setFillColor(value);
				break;
			}
			case "transparency": {
				setTransparency(value);
				break;
			}
			case "strokeColor": {
				setStrokeColor(value);
				break;
			}
			case "strokeThickness": {
				setStrokeThickness(value);
				break;
			}
			case "strokeType": {
				setStrokeType(value);
				break;
			}
		}
	};

	const handleExpand = key => (event, expanded) => {
		setExpanded(expanded ? key : false);
	};

	const handleSelectSymbol = symbol => {
		setSymbol(symbol);
	};

	const handleClose = () => {
		dispatch(setMapTools({ type: null }));
	};

	const handleSaveEvent = () => {
		const { feature } = mapTools;
		const { geometry } = feature;
		const { type } = geometry;
		setError(null);

		let properties = { name, description, displayOnEventActive, symbol, type };

		if (type === "Polygon") {
			properties = {
				...properties,
				polyFill: fillColor,
				polyStroke: strokeColor,
				polyFillOpacity: transparency / 100,
				lineWidth: strokeThickness,
				lineType: strokeType
			};
		} else if (type === "LineString") {
			properties = {
				...properties,
				polyStroke: strokeColor,
				lineWidth: strokeThickness,
				lineType: strokeType
			};
		}

		if (!validateShape(geometry)) {
			setError(getTranslation("global.sharedComponents.shapeEdit.errorText.shapesErr"));
			return;
		}

		handleSave(properties);
		handleClose();
	};

	const { mode, feature } = mapTools;
	const featureType = feature && feature.geometry ? feature.geometry.type : null;
	return (
		<Drawer
			classes={{ paper: classes.paper }}
			open={open}
			anchor={dir == "rtl" ? "right" : "left"}
			variant="persistent"
		>
			{/* Header, Buttons, Text Fields */}
			<div style={{ padding: "12px 20px" }}>
				<div style={{ display: "flex", justifyContent: "space-around" }}>
					<div
						style={{
							width: "39%",
							display: "flex",
							alignItems: "center"
						}}
					>
						<Typography variant="h6">
							{featureType === "Point" || mode === "draw_point"
								? <Translate value="global.sharedComponents.shapeEdit.createPoint" />
								: <Translate value="global.sharedComponents.shapeEdit.createShape" />}
						</Typography>
					</div>
					<div
						style={{
							width: "60%",
							display: "flex",
							justifyContent: "flex-end"
						}}
					>
						<Button onClick={handleClose} style={{ color: "#828283" }}>
							<Translate value="global.sharedComponents.shapeEdit.cancel" />
						</Button>
						<Button
							onClick={handleSaveEvent}
							color="primary"
							disabled={!name || !valid}
							classes={{ disabled: classes.disabled }}
						>
							<Translate value="global.sharedComponents.shapeEdit.save" />
						</Button>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					{(featureType === "Point" || mode === "draw_point") && !!symbol && (
						<img
							alt="selected-symbol"
							style={{
								width: 60,
								alignSelf: "flex-start",
								marginTop: 16,
								...(dir === "rtl" && { marginLeft: 12 }),
								...(dir === "ltr" && { marginRight: 12 })
							}}
							src={require(`./icons/${symbol}.png`)}
						/>
					)}
					<div>
						<TextField
							id="shape-name"
							value={name}
							onChange={handleChange("name")}
							placeholder={getTranslation("global.sharedComponents.shapeEdit.name")}
							required={true}
							variant="filled"
							fullWidth
							margin="normal"
							autoFocus={true}
							InputProps={{ classes: { root: classes.root, input: classes.input }, style: { lineHeight: "unset" } }}
						/>
						<TextField
							id="shape-description"
							value={description}
							onChange={handleChange("description")}
							placeholder={getTranslation("global.sharedComponents.shapeEdit.description")}
							multiline={true}
							rows={3}
							rowsMax={6}
							variant="filled"
							InputProps={{ classes: { root: classes.root, input: classes.input }, style: { padding: 0, lineHeight: "unset" } }}
							fullWidth
						/>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div
				style={{
					height: 1,
					width: "100%",
					marginBottom: 10,
					backgroundColor: "#424549"
				}}
			/>

			<div style={{ overflowY: "scroll" }}>
				{app === "events-app" && (
					<div style={{ marginTop: 4, padding: "0px 20px" }}>
						<SelectField
							id="map-app-display-options"
							value={displayOnEventActive}
							handleChange={handleChange("displayOnEventActive")}
							label={getTranslation("global.sharedComponents.shapeEdit.mapApp")}
							inputProps={{ style: { fontSize: 14 } }}
							dir={dir}
						>
							<MenuItem
								style={{ fontSize: 14 }}
								value={true}
								classes={{ selected: classes.selected }}
							>
								<Translate value="global.sharedComponents.shapeEdit.showWhenActive" />
							</MenuItem>
							<MenuItem
								style={{ fontSize: 14 }}
								value={false}
								classes={{ selected: classes.selected }}
							>
								<Translate value="global.sharedComponents.shapeEdit.alwaysShow" />
							</MenuItem>
						</SelectField>
					</div>
				)}

				<Typography style={{ padding: "38px 20px 0px 20px" }} variant="h6">
					{featureType === "Point" || mode === "draw_point"
						? <Translate value="global.sharedComponents.shapeEdit.chooseSymbol" />
						: <Translate value="global.sharedComponents.shapeEdit.chooseStyles" />}
				</Typography>

				{/* Point: Search, Icon Categories, Icons */}
				{(featureType === "Point" || mode === "draw_point") && (
					<div style={{ marginTop: -6, padding: "0px 20px" }}>
						<Fragment>
							<SearchField
								id="symbol-search"
								handleChange={handleChange("search")}
								handleClear={handleClearSearch}
								value={search}
								placeholder={getTranslation("global.sharedComponents.shapeEdit.searchLib")}
								dir={dir}
							/>
							<div style={{ paddingTop: 20 }}>
								{!!collections &&
									Map(collections, (collection, key) => {
										return (
											<SymbolCollection
												key={key}
												name={key}
												collection={collection}
												expanded={expanded === key}
												handleExpand={handleExpand(key)}
												handleSelect={handleSelectSymbol}
												search={search.toLowerCase()}
											/>
										);
									})}
							</div>
						</Fragment>
					</div>
				)}

				{/* Polygon: Fill Color/Transparency, Stroke Color/Thickness/Type */}
				{(featureType === "Polygon" || mode === "draw_polygon") && (
					<Fragment>
						<div style={{ marginTop: 4, padding: "12px 20px" }}>
							<ColorTiles
								selectedColor={fillColor}
								title={getTranslation("global.sharedComponents.shapeEdit.fillColor")}
								setData={setData("fillColor")}
							/>
						</div>

						<TransparencySlider
							transparency={transparency}
							setData={setData("transparency")}
							dir={dir}
						/>

						<div style={{ padding: "17px 20px 0px 20px" }}>
							<ColorTiles
								selectedColor={strokeColor}
								title={getTranslation("global.sharedComponents.shapeEdit.strokeColor")}
								setData={setData("strokeColor")}
							/>

							<StrokeProperties
								thickness={strokeThickness}
								type={strokeType}
								titleNoun={"Stroke"}
								setThickness={setData("strokeThickness")}
								setType={setData("strokeType")}
								dir={dir}
							/>
						</div>
					</Fragment>
				)}

				{/* Line: Line Color/Thickness/Type */}
				{(featureType === "LineString" || mode === "draw_line_string") && (
					<Fragment>
						<div style={{ marginTop: 4, padding: "12px 20px" }}>
							<ColorTiles
								selectedColor={strokeColor}
								title={getTranslation("global.sharedComponents.shapeEdit.lineColor")}
								setData={setData("strokeColor")}
							/>

							<StrokeProperties
								thickness={strokeThickness}
								type={strokeType}
								titleNoun={"Line"}
								setThickness={setData("strokeThickness")}
								setType={setData("strokeType")}
								dir={dir}
							/>
						</div>
					</Fragment>
				)}

				{/* Error Messaging */}
				{error && (
					<Typography
						style={{ padding: "0px 12px" }}
						color="error"
						variant="caption"
					>
						{error}
					</Typography>
				)}
			</div>
		</Drawer>
	);
};

ShapeEdit.propTypes = propTypes;

export default withStyles(styles)(ShapeEdit);
