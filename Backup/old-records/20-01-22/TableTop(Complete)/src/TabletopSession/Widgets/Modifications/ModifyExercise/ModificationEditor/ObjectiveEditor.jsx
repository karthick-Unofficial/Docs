import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {  Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import MapObjectSelectorContainer from "./MapObjectSelectorContainer";
import { TextField } from "orion-components/CBComponents";
import MapObjectConnectorContainer from "../../../../shared/components/MapObjectConnectorContainer";
import { isValidLocation } from "../../modificationUtility";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	map: PropTypes.object,
	data: PropTypes.object.isRequired,
	modificationMode: PropTypes.string,
	onCancelObjective: PropTypes.func,
	createModification: PropTypes.func,
	updateModification: PropTypes.func,
	onSaveObjective: PropTypes.func,
	raiseError: PropTypes.func.isRequired,
	floorPlans: PropTypes.object
};

const ObjectiveEditor = ({map, data, modificationMode, createModification, updateModification, onCancelObjective, onSaveObjective, raiseError, floorPlans}) => {

	const getName = () => {
		return (data && data.object.name) || "";
	};

	const [ objectiveName, setObjectiveName ] = useState(getName());
	const [ resultNode, setResultNode ] = useState(null);
	const [ selectedItemForResult, setSelectedItemForResult ] = useState((data && data.object.name)? (data && data.object.name) : null);
	const [ itemSelectionFor, setItemSelectionFor] = useState("result");
	const [ floorPlanToDisplay, setFloorPlanToDisplay ] = useState(null);
	const [ floorPlanToRemove, setFloorPlanToRemove ] = useState(null);

	const [ resultItemRequired ] = useState(true);

	const initMapEntitySelected = () => {
		const arrCoord = data.object.coordinates.split(",");
		return {
			type: "Point",
			coordinates: [arrCoord[0], arrCoord[1], (arrCoord[2] ? arrCoord[2]: 0)]
		}; 
	};

	const [ mapEntitySelectedForResult, setMapEntitySelectedForResult ] = useState(initMapEntitySelected()); 

	const isInEditMode = () => {
		return (modificationMode && modificationMode === "EDITED")? true: false;
	};

	const disableSaveButton = () =>{
		
		let disableBtn = false;

		disableBtn = (objectiveName.length>0) ? false: true;

		if (!disableBtn && resultItemRequired && (!selectedItemForResult)) {
			disableBtn = true;
		}

		return disableBtn;
	};

	const handleClose = () => {
		setResultNode(null);
		setMapEntitySelectedForResult(null);
		setItemSelectionFor("result");
		onCancelObjective();
	};

	const saveObjective = async () =>{
		
		try {
			const dataToSave = _.cloneDeep(data);
			dataToSave.object.name = objectiveName;
			
			//const resultDefinitions = dataToSave.externalMessage.resultDef;
			if (resultNode){
				const resultValue = resultNode.hasOwnProperty("wrappedInstance")? resultNode.wrappedInstance.getValue() : resultNode.getValue();
				if (Boolean(resultValue.value) === false){
					raiseError("Please select objective from Result section.");
					return;
				}
				const arr = resultValue.value.split(",");
				dataToSave.object.x = parseFloat(arr[0]);
				dataToSave.object.y = parseFloat(arr[1]);
				dataToSave.object.z = parseFloat(arr[2]? arr[2]: 0);

				const validObj = await isValidLocation(dataToSave.tabletopSessionId, dataToSave.object.x, 
					dataToSave.object.y, dataToSave.object.z);
				if (!validObj.success){
					if (validObj.errMsg){
						raiseError(validObj.errMsg);
					} else{
						raiseError("Selected location is invalid. Please select another location.");
					}
					return;	
				} 
			}

			delete dataToSave["externalMessage"];
			delete dataToSave.object["coordinates"];
			
			if (modificationMode == "ADD"){
				delete dataToSave["id"];
				createModification(dataToSave.tabletopSessionId, dataToSave);
			} else{
				updateModification(dataToSave.tabletopSessionId, dataToSave);
			}
			removeCurrentFloorPlan();	
			onSaveObjective({success: true, errorMessage: ""});

		} catch (error) {
			console.log(error);			
		}

	};
	
	const getResultControl = () =>{
		return(
			<div style={{flex:1, marginLeft: 10, marginRight: 10}}>
				<MapObjectSelectorContainer id="result" definitionDesc={""}
					ref={node => {
						if (!resultNode && node){
							setResultNode(node);
						}
					}} 
					required={true}
					headerText={<Translate value="tableopSession.widgets.modifications.modificationEditor.objectiveEditor.chooseLocation"/>}
					itemSelectionFor={itemSelectionFor} enableItemSelectionOnMap={enableItemSelectionOnMapForResult}
					itemSelectionHandler= {resultItemSelectionHandler}
					mapClickedHandler= {drawSelectionForResult}
					controlDataTypes={"position"} value={data.object.coordinates}/>
			</div>
		);
	};

	
	const enableItemSelectionOnMapForResult = (id) => {
		if (itemSelectionFor !== "result"){
			setItemSelectionFor(id);
		}
	};

	const drawSelectionForResult = (clickedItemInfo, itemSelected) => {
		
		if (floorPlanToDisplay && !itemSelected && clickedItemInfo.hasOwnProperty("entityType") && clickedItemInfo.entityType.toLowerCase() === "floorplan"){
			//setFloorPlanToRemove(floorPlanToDisplay); // used to remove last floor plan from map.
			setFloorPlanToDisplay(null);
		}

		if (clickedItemInfo.entityType === "floorPlan"){
			setMapEntitySelectedForResult(clickedItemInfo.geometry);
		}
		else if (clickedItemInfo.entityType === "position" || clickedItemInfo.hasOwnProperty("geometry")){
			setMapEntitySelectedForResult(clickedItemInfo.geometry);
		}

		 if (!itemSelected){
			 setSelectedItemForResult(null);
			 console.log("objectiveEditor.drawSelectionForResult() - itemselected" );
		 }
	};

	useEffect(() => {
		
		if (!map || !floorPlans || (floorPlans.length<1)) {
			return;
		}

		if (floorPlanToDisplay){
			
			const floorPlansTmp = floorPlans[floorPlanToDisplay.facilityId];
			const floorPlan =  _.find(floorPlansTmp, (flrp) => {
				return (flrp.id ===	floorPlanToDisplay.id); //its floor plan id
			});

			const imgSrc = `/_download?handle=${floorPlan.handle}`;
			const coords = floorPlan.geometry.coordinates[0].filter((coord, index) => index < 4);
			const sourceData = {
				type: "image",
				url: imgSrc,
				coordinates: coords
			};
			const facilityId = `mod-${floorPlanToDisplay.facilityId}`;

			try {
				if (!map.getSource(`${facilityId}-map-floor-plan-source`)) {
					map.addSource(`${facilityId}-map-floor-plan-source`, sourceData);
					map.addLayer({
						id: `${facilityId}-map-floor-plan-overlay`,
						source: `${facilityId}-map-floor-plan-source`,
						type: "raster",
						paint: {
							"raster-opacity": 1.0
						}
					}, "country-label-sm");
				}
			} catch (error) {
				console.log("Error occurred when adding FloorPlanLayer");
			}

			setFloorPlanToRemove( _.cloneDeep(floorPlanToDisplay)); // used to remove last floor plan from map.
			//console.log("floorPlanToRemove is set.");
		}

		return () => {
			try {
				removeCurrentFloorPlan();
			} catch (error) {
				console.log("Error occurred when cleaning up FloorPlanLayer");
			}
			
		};

	}, [floorPlanToDisplay]);

	const removeCurrentFloorPlan = () => {
		
		if (floorPlanToRemove) {
			const facilityId = `mod-${floorPlanToRemove.facilityId}`;
			try {
				if (map && map.getSource(`${facilityId}-map-floor-plan-source`)) {
					map.removeLayer(`${facilityId}-map-floor-plan-overlay`);
					map.removeSource(`${facilityId}-map-floor-plan-source`);
				}	
			} catch (error) {
				console.log("Objective Editor: Error removing floorPlan.");		
			}
			//console.log("Modification Editor: FloorPlan is Removed.");	
		}
	};

	const resultItemSelectionHandler = (selectedItemInfo) => {
		if (!selectedItemInfo){
			setSelectedItemForResult(null);
			return;
		}

		if (selectedItemInfo.isItemSelectedOnMap){
			drawSelectionForResult(selectedItemInfo, true); //draw selection on map
		}

		setSelectedItemForResult(selectedItemInfo); //to enable/Disable Save button

		if (selectedItemInfo.hasOwnProperty("entityType") && selectedItemInfo.entityType.toLowerCase() === "floorplan"){
			
			if (!floorPlanToRemove){
				setFloorPlanToRemove( _.cloneDeep(selectedItemInfo.entity)); // used to remove last floor plan from map.
			}
			setFloorPlanToDisplay(selectedItemInfo.entity);
		} 
	};

	return (
		<div>
			<div className="modificationflex">
				{
					(!isInEditMode()) && <Typography variant="body1" className="b1-white" style={{margin:10, alignSelf:"center", flex:1, fontSize:18}}>{<Translate value="tableopSession.widgets.modifications.modificationEditor.objectiveEditor.addObj"/>}</Typography>
				}
				{
					(isInEditMode()) && <Typography variant="body1" className="b1-white" style={{margin:10, alignSelf:"center", flex:1, fontSize:18}}>{<Translate value="tableopSession.widgets.modifications.modificationEditor.objectiveEditor.editObj"/>}</Typography>
				}

				<div className="modificationActionsRight">
					<Button style={{ width: 74, marginLeft:10, marginRight:0}} onClick={handleClose}><Translate value="tableopSession.widgets.modifications.modificationEditor.objectiveEditor.cancel"/></Button>
					<Button variant="contained" color="primary" disabled={disableSaveButton()} 
						style={{ width: 74, marginLeft:10, marginRight:10 }} onClick={saveObjective}><Translate value="tableopSession.widgets.modifications.modificationEditor.objectiveEditor.save"/></Button>
				</div>
			</div>
			<div className="modificationflex">
				<div style={{flex:1, minWidth: 320, marginLeft: 10, marginRight: 10}}>
					<TextField 
						id="txtObjectiveName"
						formControlStyles={{ margin: "0px 0px 0px 0px" }}
						label={<Translate value="tableopSession.widgets.modifications.modificationEditor.objectiveEditor.objName"/>}
						value={objectiveName}
						handleChange={(e)=>setObjectiveName(e.target.value)}
						disabled={false}
					/>	
				</div>
			</div>
			<div className="modificationflex" style={{paddingLeft:5, paddingRight:5, marginTop:20}}>
				{
					getResultControl()
				}
			</div>
			<MapObjectConnectorContainer map={map} firstObject={mapEntitySelectedForResult} secondObject={null} thirdObject={null}/>
		</div>
	);
};

ObjectiveEditor.propTypes = propTypes;
export default ObjectiveEditor;
