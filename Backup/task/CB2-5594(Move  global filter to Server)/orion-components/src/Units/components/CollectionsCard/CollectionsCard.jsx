import React, { useState } from "react";
import { TextField, MenuItem, Typography } from "@mui/material";
import { useEffect } from "react";
import { unitService } from "client-app-core";
import Collections from "./Collections";
import { useSelector } from "react-redux";
import { getTranslation } from "orion-components/i18n";



const CollectionsCard = ({ title, id }) => {


	const [cardCollections, setCardCollections] = useState([]);
	const globalData = useSelector(state => state.globalData);
	const [collectionDetails, setCollectionDetails] = useState([]);
	const [collection, setCollection] = useState([]);
	const [selectedCollection, setSelectedCollection] = useState(null);

	useEffect(() => {
		unitService.getAppSettingsByKey("units-app", id, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			}
			else {
				if (response.value) {

					const { value } = response;
					const memberData = [];
					if (value.length > 0) {
						value.forEach(element => {
							const obj = {
								members: element,
							}
							memberData.push(obj);
						});
					}
					setCardCollections(memberData);
				}
			}
		});
	}, []);

	useEffect(() => {
		if (cardCollections.length > 0) {
			const entityDetails = [];
			cardCollections.forEach((element) => {
				const memberId = element.members;
				entityDetails.push(globalData["collections"][memberId])
			});
			setCollectionDetails(entityDetails);
		}

	}, [cardCollections]);

	const changeCollection = (value) => {
		setSelectedCollection(value);
		collectionDetails.forEach((element) => {
			if (element.id === value) {
				setCollection([element]);
			}
		})

	}

	return (
		<div className="collectionsCardContainer"
			style={{
				backgroundColor: "#3D3F42",
				margin: "25px 5px 0px 5px",
				padding: "20px 15px",
				borderRadius: "5px"
			}}>
			<div className="collectionsCardHeader">
				<Typography fontSize="14px" style={{
					marginBottom: "20px",
					fontWeight: "600",
					marginBottom: "10px",
					textAlign: "center"
				}}>
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
							fontSize: "10px"
						}
					}}
					onChange={(e) => changeCollection(e.target.value)}
				>
					{collectionDetails && collectionDetails.map((element) => {
						return (<MenuItem value={element.id}>{element.name}</MenuItem>)
					})}

				</TextField>
			</div>
			<div className="collectionsCardBody">
				{collection.length > 0 && collection.map((collectionData) => {
					return (
						<Collections collection={collectionData} />
					)
				})}
			</div>
		</div>
	);
}
export default CollectionsCard;