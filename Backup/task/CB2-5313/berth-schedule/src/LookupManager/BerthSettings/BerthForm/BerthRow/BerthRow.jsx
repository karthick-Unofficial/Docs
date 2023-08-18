import React, { memo, useState, useEffect } from "react";
import { restClient } from "client-app-core";
import PropTypes from "prop-types";
import { Button, IconButton, TableCell, TableRow } from "@mui/material"
import { Delete } from "@mui/icons-material";

import { FocusInput, SearchSelectField } from "../../../../shared/components";
import { useDispatch } from "react-redux";
import { addBerth, deleteBerth, updateBerth } from "./berthRowActions";
const propTypes = {
	berth: PropTypes.object.isRequired,
	groupId: PropTypes.string.isRequired,
	removeBerth: PropTypes.func.isRequired,
	saved: PropTypes.bool.isRequired,
	berthMarks: PropTypes.array.isRequired,
	canManage: PropTypes.bool.isRequired,
	dir: PropTypes.string
};

const styles = {
	cell: { border: "1px solid #515151" },
	cellRTL: { border: "1px solid #515151", textAlign: "right" }
};

const BerthRow = ({
	berth,
	groupId,
	removeBerth,
	saved,
	berthMarks,
	canManage,
	dir
}) => {
	const dispatch = useDispatch();

	const [berthData, setBerthData] = useState(berth);
	const [query, setQuery] = useState(null);
	const [shapeResults, setShapeResults] = useState([]);
	const [shape, setShape] = useState(null);
	const [error, setError] = useState(false);
	const { beginningFootmark, endFootmark, id, name, shapeId } = berthData;
	useEffect(() => {
		setBerthData(berth);
	}, [berth]);
	useEffect(() => {
		if (shapeId) {
			restClient.exec_get(
				`/ecosystem/api/shapes/${shapeId}`,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
						// Set error to disable shape field
						setShape(null);
						setError(true);
					} else {
						// If an error message was returned
						if (response.reason) {
							// Hidden shape
							if (response.reason.code === 406) {
								setShape("[Hidden Shape]");
							}
							// No access or other error
							else {
								setShape(null);
							}
						}
						else if (response.code || response.message) {
							// No access or other error
							setShape(null);
						}
						// Shape returned successfully (full access)
						else {
							setShape(response);
						}
					}
				}
			);
		}
	}, [shapeId]);
	useEffect(() => {
		if (query !== null) {
			restClient.exec_get(
				`/ecosystem/api/shapes/by-geo-type/polygon?excludeFOV=true&onlyPublic=true&name=${query}`,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
					} else {
						setShapeResults(response);
					}
				}
			);
		}
	}, [query]);
	const handleSearch = e => {
		setQuery(e.target.value);
	};
	const handleChange = name => e => {
		setBerthData({
			...berthData,
			[name]: name === "shapeId" ? e : e.target.value
		});
	};
	const handleSave = () => {
		if (!saved) {
			dispatch(addBerth({
				beginningFootmark,
				berthGroupId: groupId,
				endFootmark,
				name,
				shapeId
			}));
		} else {
			dispatch(updateBerth(id, berthData));
		}
	};

	const handleDelete = () => {
		if (!saved) {
			removeBerth(id);
		} else {
			dispatch(deleteBerth(id));
		}
	};
	const shapes = shapeResults.map(result => {
		const { id, entityData } = result;
		return { id, name: entityData.properties.name };
	});
	const disabled = !name || !shape || isNaN(beginningFootmark) || isNaN(endFootmark);

	const shapeValue = !shape
		? ""
		: // Shape and Shape data - Full access
		shape && shape.entityData
			? shape.entityData.properties.name
			: // Otherwise, shape was hidden and will display "[Hidden Shape]" string
			shape;

	const validBerth = () => {
		const beginningFootmarkInt = parseInt(beginningFootmark);
		const endFootmarkInt = parseInt(endFootmark);
		if (!isOverlapping(id, beginningFootmarkInt, endFootmarkInt)) {
			if (saved) {
				return JSON.stringify(berthData) !== JSON.stringify(berth);
			}
			else {
				return !!name && !!shapeValue && beginningFootmarkInt < endFootmarkInt;
			}
		}
		else {
			return false;
		}
	};

	const isOverlapping = (id, a, b) => {
		const isBetween = (n, min, max) => {
			return n > min && n < max;
		};
		let overlapping = false;
		berthMarks
			.filter(berth => berth.id !== id)
			.map(berth => {
				const { min, max } = berth;
				if (
					a == min || b == max || //Same beggining or ending footmark
					isBetween(a, min, max) || //Beginning in middle of berth
					isBetween(b, min, max) || //Ending in middle of berth
					isBetween(min, a, b) || //Encompasses berth's beginning
					isBetween(max, a, b) //Encompasses berth's ending
				) {
					overlapping = true;
				}
			});
		return overlapping;
	};

	return (
		<React.Fragment>
			{canManage ? (
				<TableRow key={id}>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<FocusInput value={name} handleChange={handleChange("name")} />
					</TableCell>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<SearchSelectField
							id={`${name}-zone-select`}
							value={shapeValue}
							disabled={error}
							handleSelect={handleChange("shapeId")}
							handleSearch={handleSearch}
							results={shapes}
							dir={dir}
						/>
					</TableCell>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<FocusInput
							value={beginningFootmark}
							handleChange={handleChange("beginningFootmark")}
							type="number"
						/>
					</TableCell>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<FocusInput
							value={endFootmark}
							handleChange={handleChange("endFootmark")}
							type="number"
						/>
					</TableCell>
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
					{validBerth() && (
						<TableCell style={{ border: "unset", paddingRight: 0, paddingLeft: 0, textAlign: dir == "rtl" ? "right" : "left" }}>
							<Button
								onClick={handleSave}
								color="primary"
								style={{ textTransform: "none" }}
								disabled={disabled}
							>
								Save
							</Button>
						</TableCell>
					)}
				</TableRow>
			) : (
				<TableRow key={id}>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<p style={{ fontSize: "1rem" }}>{name}</p>
					</TableCell>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<p style={{ fontSize: "1rem" }}>{shapeValue}</p>
					</TableCell>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<p style={{ fontSize: "1rem" }}>{beginningFootmark}</p>
					</TableCell>
					<TableCell style={dir == "rtl" ? styles.cellRTL : styles.cell}>
						<p style={{ fontSize: "1rem" }}>{endFootmark}</p>
					</TableCell>
				</TableRow>
			)}
		</React.Fragment>
	);
};

BerthRow.propTypes = propTypes;

export default memo(BerthRow);
