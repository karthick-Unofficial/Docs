import React, { useState } from "react";
import { TextField, MenuItem, Typography } from "@mui/material";
import { useEffect } from "react";
import { unitService } from "client-app-core";
import Collections from "./Collections";
import { getTranslation } from "orion-components/i18n";

const CollectionsCard = ({ title, id, collectionsData }) => {
	const [collection, setCollection] = useState({});
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [value, setValue] = useState("");

	useEffect(() => {
		unitService.getAppSettingsByKey("units-app", id, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			} else {
				if (response.value) {
					setValue(response.value);
				}
			}
		});
	}, []);

	const updateAppSettings = (data) => {
		unitService.updateAppSettingsByKey("units-app", id, data, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const getSelectedCollection = () => {
		collectionsData.map((data) => {
			if (data.id === value) {
				setCollection(data);
				setSelectedCollection(value);
			}
		});
	};

	useEffect(() => {
		getSelectedCollection();
	}, [value]);

	const changeCollection = (valueData) => {
		setSelectedCollection(valueData);
		collectionsData.forEach((element) => {
			if (element.id === valueData) {
				setCollection(element);
				updateAppSettings(valueData);
			}
		});
	};

	return (
		<div
			className="collectionsCardContainer"
			style={{
				backgroundColor: "#3D3F42",
				margin: "25px 5px 0px 5px",
				padding: "20px 15px",
				borderRadius: "5px"
			}}
		>
			<div className="collectionsCardHeader">
				<Typography
					fontSize="14px"
					style={{
						fontWeight: "600",
						marginBottom: "10px",
						textAlign: "center"
					}}
				>
					{title}
				</Typography>

				<TextField
					select
					value={selectedCollection}
					variant="standard"
					fullWidth
					label={getTranslation("global.units.components.collectionsCard.chooseCollection")}
					InputProps={{
						style: {
							fontSize: "11px"
						}
					}}
					InputLabelProps={{
						shrink: selectedCollection !== null ? true : false
					}}
					onChange={(e) => changeCollection(e.target.value)}
				>
					{collectionsData &&
						collectionsData.map((element) => {
							return (
								<MenuItem value={element.id} key={`${element.id}-menu-item`}>
									{element.name}
								</MenuItem>
							);
						})}
				</TextField>
			</div>
			<div className="collectionsCardBody">
				{collection && Object.keys(collection).length !== 0 ? (
					<Collections collection={collection} titleId={id} />
				) : null}
			</div>
		</div>
	);
};
export default CollectionsCard;
