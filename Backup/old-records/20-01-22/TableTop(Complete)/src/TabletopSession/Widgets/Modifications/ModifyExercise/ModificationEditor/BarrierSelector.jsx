/* eslint-disable react/display-name */
import React, {useState, useImperativeHandle} from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { SelectField } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer: {
	  paddingTop: 10,
	  paddingLeft: 5,
	  display: "flex",
	  background: "transparent"
	}
};

const propTypes = {
	definitionDesc: PropTypes.string,
	value: PropTypes.string,
	barriers: PropTypes.object,
	controlDataTypes: PropTypes.string,
	itemSelectionHandler : PropTypes.func

};

const BarrierSelector = React.forwardRef(({ definitionDesc, value, barriers, controlDataTypes, itemSelectionHandler}, ref) => {
	const [ selectedValue, setSelectedValue ] = useState(value?value : "");
	
	const handleBarrierChange = (barrierKey) => {
		setSelectedValue(barrierKey);
		
		const entTmp = _.find(barriers, (barrier) => {
			return (barrier.entityData.properties.name === barrierKey);
		});
		
		const itemInfo = {
			entity: entTmp,
			entityType: controlDataTypes, //"barrier"
			selectedName: barrierKey,
			isItemSelectedOnMap: false
		};

		itemSelectionHandler(itemInfo);
	};

	let barrierList = [];
	const getBarrierList = ()=> {
		
		if (barrierList.length<1){
			barrierList = _.map(barriers, (barrier) => {
				return (barrier.entityData.properties.name.startsWith("_")? null: {id: barrier.entityData.properties.name, value: barrier.entityData.properties.name});
			}).filter((v) => {
				return (v? true: false);
			}).sort((a, b) => {
				return (a.value > b.value) ? 1 : -1;
			})||[];
		}
		
		return barrierList;
	};

	useImperativeHandle(ref, () => ({
		getValue: () =>{
		  return {
				definitionDesc: definitionDesc,
				avertName: "", 
				required: true,
				value: selectedValue, 
				dataType: controlDataTypes
			};
		}
	}));

	return (
		<div style={{minWidth: 260, marginLeft: 10, marginRight: 10}}>
			<SelectField id="barrierSelect" label={<Translate value="tableopSession.widgets.modifications.modificationEditor.barrierSelector.barrier"/>} handleChange={(e)=>handleBarrierChange(e.target.value)}
				formControlProps={{
					style: { margin: "18px 10px 10px 0px" }
				}}
				items={getBarrierList()}
				value={selectedValue}
				disabled={false}
			/>
		</div>
	);
});

BarrierSelector.propTypes = propTypes;
export default withStyles(styles)(BarrierSelector);