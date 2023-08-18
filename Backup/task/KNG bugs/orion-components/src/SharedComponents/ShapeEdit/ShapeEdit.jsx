import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { SearchField, SelectField } from "orion-components/CBComponents";
import SymbolCollection from "./components/SymbolCollection";
import ColorTiles from "./components/ColorTiles";
import TransparencySlider from "./components/TransparencySlider";
import StrokeProperties from "./components/StrokeProperties";
import { withStyles } from "@material-ui/core/styles";
import { Drawer, Button, Typography, TextField, MenuItem } from "@material-ui/core";
import { getSymbols } from "./utils";
import _ from "lodash";
import { validateShape } from "orion-components/Map/helpers";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const styles = {
	paper: {
		top: 48,
		width: 350,
		height: "calc(100% - 48px)"
	},
	input: {
		"&::placeholder": {
			fontSize: 14,
			color: "#828283"
		}
	}
};

const propTypes = {
	map: PropTypes.object.isRequired,
	entity: PropTypes.object,
	handleSave: PropTypes.func.isRequired,
	app: PropTypes.string,
	dir: PropTypes.string
};

class ShapeEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			collections: null,
			search: "",
			name: "",
			description: "",
			displayOnEventActive: props.app === "events-app" ? true : false,
			symbol: null,
			fillColor: "#0073c8",
			strokeColor: "#2face8",
			strokeThickness: 3,
			strokeType: "Solid",
			transparency: 20,
			valid: this.props.mapTools.feature ? true : false,
			error: null
		};
	}

	componentDidMount = () => {
		const { map, mapTools } = this.props;
		const { mode, feature } = mapTools;
		const icons = require.context("./icons", true);
		document.addEventListener("keydown", this.handleKeydown);
		if (mode === "draw_point" || (feature && feature.geometry.type === "Point")) {
			const collections = getSymbols(map, icons);
			this.setState({
				collections,
				symbol: "Marker_blue"
			});
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

			const stateUpdate = {
				name,
				description,
				displayOnEventActive,
				symbol,
				...(polyFill && { fillColor: polyFill }),
				...(polyStroke && { strokeColor: polyStroke }),
				...(polyFillOpacity && { transparency: polyFillOpacity * 100 }),
				...(lineWidth && { strokeThickness: lineWidth }),
				...(lineType && { strokeType: lineType })
			};
			this.setState(stateUpdate);
		}

		map.on("draw.create", () => {
			this.setState({ valid: true });
		});
		map.on("draw.delete", () => {
			this.setState({ valid: false });
		});
	};

	componentWillUnmount = () => {
		document.removeEventListener("keydown", this.handleKeydown);
	};

	handleKeydown = e => {
		if (e.key === "Escape") {
			this.handleClose();
		}
	};

	handleClearSearch = () => {
		this.setState({
			search: ""
		});
	};

	handleChange = field => event => {
		const { value } = event.target;
		this.setState({ [field]: value });
	};

	// Sets data in parent component when data in child component updates for ease of access
	setData = field => value => {
		this.setState({ [field]: value });
	};

	handleExpand = key => (event, expanded) => {
		this.setState({
			expanded: expanded ? key : false
		});
	};

	handleSelectSymbol = symbol => {
		this.setState({ symbol });
	};

	handleClose = () => {
		const { setMapTools } = this.props;
		setMapTools({ type: null });
	};

	handleSave = () => {
		const { handleSave, mapTools } = this.props;
		const { feature } = mapTools;
		const { geometry } = feature;
		const { type } = geometry;
		const {
			name,
			description,
			displayOnEventActive,
			symbol,
			fillColor,
			strokeColor,
			transparency,
			strokeThickness,
			strokeType
		} = this.state;

		this.setState({ error: null });

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
			this.setState({
				error: getTranslation("global.sharedComponents.shapeEdit.errorText.shapesErr")
			});
			return;
		}

		handleSave(properties);
		this.handleClose();
	};

	render() {
		const { classes, open, mapTools, app, dir } = this.props;
		const {
			collections,
			search,
			name,
			description,
			displayOnEventActive,
			expanded,
			symbol,
			valid,
			error,
			fillColor,
			strokeColor,
			strokeThickness,
			strokeType,
			transparency
		} = this.state;
		const { mode, feature } = mapTools;
		const featureType =
			feature && feature.geometry ? feature.geometry.type : null;
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
									? <Translate value="global.sharedComponents.shapeEdit.createPoint"/>
									: <Translate value="global.sharedComponents.shapeEdit.createShape"/>}
							</Typography>
						</div>
						<div
							style={{
								width: "60%",
								display: "flex",
								justifyContent: "flex-end"
							}}
						>
							<Button onClick={this.handleClose} style={{ color: "#828283" }}>
								<Translate value="global.sharedComponents.shapeEdit.cancel"/>
							</Button>
							<Button
								onClick={this.handleSave}
								color="primary"
								disabled={!name || !valid}
							>
								<Translate value="global.sharedComponents.shapeEdit.save"/>
							</Button>
						</div>
					</div>

					<div style={{ display: "flex" }}>
						{(featureType === "Point" || mode === "draw_point") && !!symbol && (
							<img
								alt="selected-symbol"
								style={dir == "rtl" ? {
									width: 60,
									marginLeft: 12,
									marginTop: 16,
									alignSelf: "flex-start"
								} : {
									width: 60,
									marginRight: 12,
									marginTop: 16,
									alignSelf: "flex-start"
								}}
								src={require(`./icons/${symbol}.png`)}
							/>
						)}
						<div>
							<TextField
								id="shape-name"
								value={name}
								onChange={this.handleChange("name")}
								placeholder={getTranslation("global.sharedComponents.shapeEdit.name")}
								required={true}
								variant="filled"
								fullWidth
								margin="normal"
								autoFocus={true}
								InputProps={{ classes: { input: classes.input } }}
							/>
							<TextField
								id="shape-description"
								value={description}
								onChange={this.handleChange("description")}
								placeholder={getTranslation("global.sharedComponents.shapeEdit.description")}
								multiline={true}
								rows={3}
								rowsMax={6}
								variant="filled"
								InputProps={{ classes: { input: classes.input } }}
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
								handleChange={this.handleChange("displayOnEventActive")}
								label={getTranslation("global.sharedComponents.shapeEdit.mapApp")}
								inputProps={{ style: { fontSize: 14 } }}
								dir={dir}
							>
								<MenuItem 
									style={{ fontSize: 14 }}
									value={true}
								>
									<Translate value="global.sharedComponents.shapeEdit.showWhenActive"/>
								</MenuItem>
								<MenuItem 
									style={{ fontSize: 14 }}
									value={false}
								>
									<Translate value="global.sharedComponents.shapeEdit.alwaysShow"/>
								</MenuItem>
							</SelectField>
						</div>
					)}

					<Typography style={{ padding: "38px 20px 0px 20px" }} variant="h6">
						{featureType === "Point" || mode === "draw_point"
							? <Translate value="global.sharedComponents.shapeEdit.chooseSymbol"/>
							: <Translate value="global.sharedComponents.shapeEdit.chooseStyles"/>}
					</Typography>

					{/* Point: Search, Icon Categories, Icons */}
					{(featureType === "Point" || mode === "draw_point") && (
						<div style={{ marginTop: -6, padding: "0px 20px" }}>
							<Fragment>
								<SearchField
									id="symbol-search"
									handleChange={this.handleChange("search")}
									handleClear={this.handleClearSearch}
									value={search}
									placeholder={getTranslation("global.sharedComponents.shapeEdit.searchLib")}
									dir={dir}
								/>
								<div style={{ paddingTop: 20 }}>
									{!!collections &&
									_.map(collections, (collection, key) => {
										return (
											<SymbolCollection
												key={key}
												name={key}
												collection={collection}
												expanded={expanded === key}
												handleExpand={this.handleExpand(key)}
												handleSelect={this.handleSelectSymbol}
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
									setData={this.setData("fillColor")}
								/>
							</div>

							<TransparencySlider
								transparency={transparency}
								setData={this.setData("transparency")}
								dir={dir}
							/>

							<div style={{ padding: "17px 20px 0px 20px" }}>
								<ColorTiles
									selectedColor={strokeColor}
									title={getTranslation("global.sharedComponents.shapeEdit.strokeColor")}
									setData={this.setData("strokeColor")}
								/>

								<StrokeProperties
									thickness={strokeThickness}
									type={strokeType}
									titleNoun={"Stroke"}
									setThickness={this.setData("strokeThickness")}
									setType={this.setData("strokeType")}
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
									setData={this.setData("strokeColor")}
								/>

								<StrokeProperties
									thickness={strokeThickness}
									type={strokeType}
									titleNoun={"Line"}
									setThickness={this.setData("strokeThickness")}
									setType={this.setData("strokeType")}
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
	}
}

ShapeEdit.propTypes = propTypes;

// export default ShapeEdit;
export default withStyles(styles)(ShapeEdit);
