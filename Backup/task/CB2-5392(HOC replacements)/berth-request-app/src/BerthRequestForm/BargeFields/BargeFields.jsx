import React, { Fragment, useState } from "react";
import { restClient } from "client-app-core";
import PropTypes from "prop-types";
import { Add, Delete } from "@material-ui/icons";
import {
	Fab,
	Typography,
	IconButton,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from "@material-ui/core";
import Typeahead from "../Typeahead/Typeahead";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { withStyles } from "@material-ui/core/styles";

const propTypes = {
	barges: PropTypes.array.isRequired,
	updateBarge: PropTypes.func.isRequired,
	removeBarge: PropTypes.func.isRequired,
	vesselTypes: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const defaultProps = {
	barges: [],
	vesselTypes: [],
	updateBarge: () => { },
	removeBarge: () => { },
	width: 1920
};

const styles = {
	buttonBox: { marginRight: "auto", display: "flex", alignItems: "center", margin: "35px", width: "100%" },
	icon: {
		right: "unset!important",
		left: "0!important"
	},
	select: {
		paddingRight: "0!important"
	}
};


const BargeFields = ({ barges, updateBarge, removeBarge, width, vesselTypes, dir, classes }) => {
	const [bargeResults, setBargeResults] = useState([]);
	const [debouncer, setDeBouncer] = useState(null);

	const debounce = (fn, delay) => {

		if (debouncer) {
			clearTimeout(debouncer);
		}
		setDeBouncer({
			debouncer: setTimeout(() => {
				fn();
				setDeBouncer(null);
			}, delay)
		});
	};

	const handleAddBarge = () => {
		const bargeTemplate = {
			order: barges.length,
			name: "",
			registry: "",
			type: "",
			loa: 0,
			grt: 0,
			isDirty: false
		};
		const newBargeData = [...barges, bargeTemplate];
		updateBarge(newBargeData);
	};

	const handleSelectBarge = index => barge => {
		const newBargeData = [...barges];

		newBargeData[index] = { ...barge, order: index, isDirty: false };
		updateBarge(newBargeData);
	};

	const handleUpdateBarge = (index, key) => e => {
		const newBargeData = [...barges];
		const value = e.target.value;
		newBargeData[index] = { ...newBargeData[index], [key]: value, isDirty: !!newBargeData[index].id };
		updateBarge(newBargeData);
	};

	// unused function
	//const handleClearField = (index, key) => () => {
	//	const newBargeData = [...barges];
	//	newBargeData[index][key] = "";
	//	updateBarge(newBargeData);
	//};

	const handleClearBarge = index => () => {
		const newBargeData = [...barges];

		newBargeData[index] = {
			order: barges.length,
			name: "",
			registry: "",
			type: "",
			loa: 0,
			grt: 0,
			isDirty: false

		};
		updateBarge(newBargeData);
	};

	const handleRemoveBarge = position => {
		removeBarge(position);
	};

	const search = (searchProps, searchString) => {
		if (searchString !== "") {
			restClient.exec_get(
				`/berth-request-app/api/request/queryBarge?searchProps=${searchProps}&searchString=${searchString}`,
				(err, res) => {
					if (err) {
						console.log("Barge query err", err);
					}
					else {
						const result = {};
						res.forEach(barge => {
							result[barge.id] = {
								searchString: `${barge.name}${barge.registry}`,
								label: `${barge.name}`,
								id: barge.id,
								fullData: barge
							};
						});
						setBargeResults(result);
					}
				}
			);
		}
		else {
			setBargeResults({});

		}
	};

	const handleQuery = (searchProps) => (searchString) => {
		debounce(() => {
			search(searchProps, searchString);
		}, 400);
	};

	return (
		<Fragment>
			<div style={styles.buttonBox}>
				<Fab
					style={{ height: 30, width: 30, minHeight: "unset", borderRadius: "50px", backgroundColor: "#3f51b5", color: "#fff" }}
					color="primary"
					size="small"
					onClick={handleAddBarge}
				>
					<Add fontSize="small" />
				</Fab>
				<Typography variant="body1" style={dir == "rtl" ? { marginRight: 8 } : { marginLeft: 8 }}>
					<Translate value="berthRequestForm.bargeFields.addBargeBtn" />
				</Typography>
			</div>
			{barges.length ? (
				<Fragment>
					{barges.map((barge, index) => {
						return (
							<Fragment key={`barge-${index}`}>
								<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
									<Typeahead
										closeOnSelect={true}
										id={`barge-name-${index}`}
										items={bargeResults}
										selected={barge ? barge.name : null}
										updateState={handleUpdateBarge(index, "name")}
										handleSelect={handleSelectBarge(index)}
										clearSelected={handleClearBarge(index)}
										queryTypeahead={handleQuery("name")}
										maxResults={5}
										placeholder={getTranslation("berthRequestForm.bargeFields.fieldLabel.bargeName")}
										disabled={!!barge.id}
										dir={dir}
									/>
								</div>
								<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
									<Typeahead
										closeOnSelect={true}
										id={`barge-registry-${index}`}
										items={bargeResults}
										selected={barge ? barge.registry : null}
										updateState={handleUpdateBarge(index, "registry")}
										handleSelect={handleSelectBarge(index)}
										clearSelected={handleClearBarge(index)}
										queryTypeahead={handleQuery("registry")}
										maxResults={5}
										placeholder={getTranslation("berthRequestForm.bargeFields.fieldLabel.bargeIMO")}
										disabled={!!barge.id}
										dir={dir}
									/>
								</div>
								<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
									<FormControl margin="normal" fullWidth>
										<InputLabel style={dir && dir == "rtl" ? { left: "unset", transformOrigin: "top right" } : {}}><Translate value="berthRequestForm.bargeFields.fieldLabel.bargeType" /></InputLabel>
										<Select
											value={
												barge && barge.type
													? vesselTypes.find(item => item.id === barge.type).id
													: ""}
											onChange={handleUpdateBarge(index, "type")}
											inputProps={{
												classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
											}}
										>
											{vesselTypes.map(type => {
												const { id, name } = type;
												return (
													<MenuItem key={id} value={id}>
														{name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</div>
								<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
									<TextField
										id={`barge-loa-${index}`}
										label={getTranslation("berthRequestForm.bargeFields.fieldLabel.loa")}
										fullWidth
										value={barge && (barge.loa || barge.loa === 0) ? barge.loa : ""}
										type="number"
										onChange={handleUpdateBarge(index, "loa")}
										InputLabelProps={{
											style: {
												transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
												textAlign: (dir && dir == "rtl" ? "right" : "left"),
												right: (dir && dir == "rtl" ? 0 : "unset")
											}
										}} />
								</div>
								<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
									<TextField
										id={`barge-grt-${index}`}
										label="GRT"
										fullWidth
										value={barge && (barge.grt || barge.grt === 0) ? barge.grt : ""}
										type="number"
										onChange={handleUpdateBarge(index, "grt")}
										InputLabelProps={{
											style: {
												transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
												textAlign: (dir && dir == "rtl" ? "right" : "left"),
												right: (dir && dir == "rtl" ? 0 : "unset")
											}
										}} />
								</div>
								<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
									<IconButton onClick={() => handleRemoveBarge(index)}>
										<Delete />
									</IconButton>
								</div>
							</Fragment>
						);
					})}
				</Fragment>
			) : <Fragment />}
		</Fragment>
	);

};

BargeFields.propTypes = propTypes;
BargeFields.defaultProps = defaultProps;

export default withStyles(styles)(BargeFields); 