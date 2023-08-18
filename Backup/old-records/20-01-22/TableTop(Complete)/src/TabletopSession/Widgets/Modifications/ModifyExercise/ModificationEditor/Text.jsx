/* eslint-disable react/display-name */
import React, {useState, useEffect, useImperativeHandle} from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "orion-components/CBComponents";
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
	id: PropTypes.string.isRequired,
	desc: PropTypes.string,
	dataType: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	value: PropTypes.number,
	disabled: PropTypes.bool,
	itemSelectionHandler : PropTypes.func,
	paramType: PropTypes.string
};

const Text = React.forwardRef(({ id, desc, dataType, required, value, disabled, itemSelectionHandler, paramType}, ref) => {
	const [ textValue, setTextValue ] = useState(value);
	const [ textError, setTextError ] = useState(null);

	useImperativeHandle(ref, () => ({
		getValue: () =>{
		  return {
				definitionDesc: "", //no need for lookup
				avertName:id, 
				required: true,
				value: textValue,
				dataType: dataType
			};
		}
	}));

	useEffect(() => {
		if (paramType && paramType === "system"){ 
			// Ignore validation
		} 
		else if (!textValue) {
			setTextError(null);
			if (itemSelectionHandler){
				itemSelectionHandler(null);
			}
			return;
		}
		
		if (required){
			if (paramType && paramType === "system"){ 
				// Ignore validation
			}
			else if (dataType.toLowerCase() !== "string"){
				const currentValue = parseFloat(textValue);
				if (currentValue <= 0){
					setTextError(<Translate value="tableopSession.widgets.modifications.modificationEditor.text.valueGreater"/>);
				} else{
					setTextError(null);
				}
			} else{
				if (textValue.length<1){
					setTextError(<Translate value="tableopSession.widgets.modifications.modificationEditor.text.enterDynamic" count={desc}/>);
				}
			}
		}
		
		if (itemSelectionHandler){
			itemSelectionHandler({isItemSelectedOnMap: false});
		}

	}, [dataType, desc, required, textValue]);

	return (
		<div style={{minWidth:100, margin:1}}>
			<TextField
				id={id}
				formControlStyles={{ margin: "18px 50px 10px 0px" }}
				label={desc}
				type={(dataType.toLowerCase() === "string")? "string" : "number"}
				value={(dataType.toLowerCase() === "string")? textValue : textValue.toFixed(2)}
				error={textError}
				helperText={textError}
				handleChange={(e)=>setTextValue(e.target.value)}
				disabled={disabled||false}
			/>
		</div>
	);
});

Text.propTypes = propTypes;

export default withStyles(styles)(Text);




