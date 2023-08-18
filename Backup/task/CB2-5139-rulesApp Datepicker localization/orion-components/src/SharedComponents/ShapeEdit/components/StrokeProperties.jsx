import React, { Fragment } from "react";
import { SelectField } from "orion-components/CBComponents";
import { MenuItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	thickness: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
	titleNoun: PropTypes.string.isRequired,
	setThickness: PropTypes.func.isRequired,
	setType: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	thickness: 3,
	type: "solid",
	titleNoun: "Stroke",
	setThickness: () => {},
	setType: () => {},
	dir: "ltr"
};

const StrokeProperties = ({
	thickness,
	type,
	titleNoun,
	setThickness,
	setType,
	dir
}) => {

	const handleThicknessChange = e => {
    	const value = e.target.value;
        
    	setThickness(value);
	};

	const handleTypeChange = e => {
    	const value = e.target.value;
        
    	setType(value);
	};
    
	const thicknessOptions = [1, 2, 3, 4, 5, 6];
	const strokeTypeOptions = ["Solid", "Dashed", "Dotted"];
    
	return (
		<Fragment>
			<div style={{display: "flex", justifyContent: "space-between"}}>
				<div style={{width: "45%"}}>
					<SelectField
						id={`${titleNoun}-thickness`}
						label={`${titleNoun} Thickness`}
						handleChange={handleThicknessChange}
						value={thickness}
						inputProps={{ style: { fontSize: 14 } }}
						dir={dir}
					>
						{thicknessOptions.map(thickVal => (
							<MenuItem key={thickVal} value={thickVal} style={{ fontSize: 14 }}>
								<Translate value="global.sharedComponents.shapeEdit.strokeProps.point" count={thickVal}/>
							</MenuItem>
						))}
					</SelectField>
				</div>
				<div style={{width: "45%"}}>
					<SelectField
						id={`${titleNoun}-type`}
						label={`${titleNoun} Type`}
						handleChange={handleTypeChange}
						value={type}
						inputProps={{ style: { fontSize: 14 } }}
						dir={dir}
					>
						{strokeTypeOptions.map(strokeVal => (
							<MenuItem key={strokeVal} value={strokeVal} style={{ fontSize: 14 }}>
								<Translate value={`global.sharedComponents.shapeEdit.strokeProps.${strokeVal}`} />
							</MenuItem>
						))}
					</SelectField>
				</div>
			</div>
            
		</Fragment>
	);
    
};

StrokeProperties.propTypes = propTypes;
StrokeProperties.defaultProps = defaultProps;

export default StrokeProperties;