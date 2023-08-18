import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import {
	Button,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	TableCell,
	TableRow
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { restClient } from "client-app-core";
import { FocusInput } from "../../../shared/components";
import { validate } from "../../../shared/utility/validate";
import { Translate } from "orion-components/i18n/I18nContainer";
import { withStyles } from "@material-ui/core/styles";

const propTypes = {
	datum: PropTypes.object.isRequired,
	endpoint: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	fields: PropTypes.object.isRequired,
	remove: PropTypes.func.isRequired,
	vesselTypes: PropTypes.array.isRequired,
	canManage: PropTypes.bool.isRequired,
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const styles = {
	cell: { border: "1px solid #515151" },
	icon: {
		right: "unset!important",
		left: "0!important"
	}
};

const Row = ({ fields, datum, remove, endpoint, index, vesselTypes, canManage, dir, classes }) => {
	let initial = datum;
	if (datum.name && typeof datum.name === "object") {
		initial = { ...initial, ...datum.name };
		delete initial.name;
	}
	const [previous, setPrevious] = useState(initial);
	const [next, setNext] = useState(initial);
	const handleChange = name => e => {
		setNext({
			...next,
			[name]: e.target.value
		});
	};
	const handleSave = () => {
		const { firstName, lastName } = next;
		const update = { ...next };
		if (firstName && lastName) {
			update["name"] = { firstName, lastName };
			delete update.firstName;
			delete update.lastName;
		}
		if (update.adding) {
			delete update.adding;
			Object.keys(update).forEach(key => {
				if (fields[key] && fields[key].dataType === "number") {
					update[key] = Number(update[key]);
				}
			});

			const body = JSON.stringify({
				...update
			});
			restClient.exec_post(
				`/berth-schedule-app/api/${endpoint}`,
				body,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
					} else {
						let newData = { ...response };
						if (typeof newData.name === "object") {
							newData = { ...newData, ...newData.name };
							delete newData.name;
						}
						setPrevious(newData);
						setNext(newData);
					}
				}
			);
		} else {
			const body = JSON.stringify(update);
			restClient.exec_put(
				`/berth-schedule-app/api/${endpoint}/${update.id}`,
				body,
				err => {
					if (err) {
						console.log("ERROR", err);
					}
				}
			);
			setPrevious(next);
		}
	};

	const handleDelete = () => {
		remove(index);
		if (!next.adding) {
			restClient.exec_delete(
				`/berth-schedule-app/api/${endpoint}/${next.id}`,
				err => {
					if (err) {
						console.log("ERROR", err);
					}
				}
			);
		}
	};
	const isValid = () => {
		let valid = true;
		Object.keys(fields).forEach(key => {
			if (fields[key].required && !next[key]) {
				valid = false;
			} else if (!validate(key, next[key])) {
				valid = false;
			}
		});
		return valid;
	};
	return (
		<React.Fragment>
			{canManage ? (
				<TableRow key={next.id}>
					{Object.keys(fields).map(key => {
						return (
							<TableCell key={key} style={{...styles.cell, textAlign: dir == "rtl" ? "right" : "left"}}>
								{key === "type" ? (
									<FormControl margin="normal" fullWidth>
										<Select value={next[key]} onChange={handleChange(key)} inputProps={{
											classes: (dir && dir == "rtl" ? { icon: classes.icon } : {})
										}}>
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
								) : (
									<FocusInput
										value={next[key]}
										handleChange={handleChange(key)}
										type={key}
										field={fields[key]}
									/>
								)}
							</TableCell>
						);
					})}
					<TableCell
						style={{
							...styles.cell,
							padding: 0,
							textAlign: dir == "rtl" ? "right" : "left"
						}}
					>
						<IconButton onClick={handleDelete}>
							<Delete />
						</IconButton>
					</TableCell>
					{JSON.stringify(next) !== JSON.stringify(previous) && (
						<TableCell style={{ border: "unset", paddingRight: 0, paddingLeft: 0, textAlign: dir == "rtl" ? "right" : "left" }}>
							<Button
								disabled={!isValid()}
								onClick={handleSave}
								color="primary"
								style={{ textTransform: "none" }}
							>
								<Translate value="lookupManager.berthSettings.berthForm.save" />
							</Button>
						</TableCell>
					)}
				</TableRow>
			) : (
				<TableRow key={next.id}>
					{Object.keys(fields).map(key => {
						return (
							<TableCell key={key} style={styles.cell}>
								{key === "type" ? (
									<React.Fragment>
										{vesselTypes.map(type => {
											const { id, name } = type;
											if (next.type === id) {
												return (
													<p
														key={id}
														style={{
															fontSize: "1rem"
														}}
													>
														{name}
													</p>
												);
											}
										})}
									</React.Fragment>
								) : (
									<p
										style={{
											fontSize: "1rem"
										}}
									>
										{next[key]}
									</p>
								)}
							</TableCell>
						);
					})}
				</TableRow>
			)}
		</React.Fragment>
	);
};

Row.propTypes = propTypes;

export default memo(withStyles(styles)(Row));
