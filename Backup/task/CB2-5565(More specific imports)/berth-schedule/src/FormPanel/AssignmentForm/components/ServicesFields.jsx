import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "orion-components/CBComponents";
import {
	Checkbox,
	FormControlLabel,
	Grid,
	Typography
} from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
	handleUpdate: PropTypes.func.isRequired,
	serviceConfig: PropTypes.array.isRequired,
	services: PropTypes.object,
	dir: PropTypes.string
};


const ServicesFields = ({
	handleUpdate,
	serviceConfig,
	services,
	dir
}) => {
	const [serviceObjects, setServiceObjects] = useState([]);

	useEffect(() => {
		if (serviceConfig && serviceConfig.length > 0) {
			setServiceObjects(serviceConfig.map(svc => {
				return {
					...svc,
					selected: Boolean(services && services[svc.property] && services[svc.property].selected),
					comments: (services && services[svc.property]) ? services[svc.property].comments : ""
				};
			}));
		}
	}, [serviceConfig, services]);

	const handleChecked = service => e => {
		const newServices = {};
		serviceObjects.forEach(svcObj => {
			newServices[svcObj.property] = {
				label: svcObj.label,
				selected: svcObj.property === service ? e.target.checked : svcObj.selected,
				comments: svcObj.comments
			};
		});

		handleUpdate("services", newServices);

	};

	const handleCommentsChange = service => e => {
		const newServices = {};
		serviceObjects.forEach(svcObj => {
			newServices[svcObj.property] = {
				label: svcObj.label,
				selected: svcObj.selected,
				comments: svcObj.property === service ? e.target.value : svcObj.comments
			};
		});

		handleUpdate("services", newServices);

		setServiceObjects(serviceObjects.map(svc => {
			if (svc.property === service) {
				return {
					...svc,
					comments: e.target.value
				};
			}
			return svc;
		}));
	};

	const styles = {
		formControlLabel: {
			...(dir == "rtl" ? { marginLeft: 16, marginRight: -11 } : {})
		}
	};

	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				<Translate value="formPanel.services.title" />
			</Typography>
			<Grid container style={{ padding: "0px 16px 24px", margin: "-12px", width: "calc(100% + 24px)" }}>
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={12}>
					{serviceObjects.map(svc => {
						return (
							<Grid container direction="row" key={`${svc.property}-grid`}>
								<Grid item xs={12} sm={6} style={{ marginTop: 16 }}>
									<FormControlLabel
										className="themedCheckBox"
										control={
											<Checkbox
												value={svc.selected}
												checked={svc.selected}
												color="primary"
												onChange={handleChecked(`${svc.property}`)}
											/>
										}
										label={svc.label}
										style={styles.formControlLabel}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										style={{ margin: 0 }}
										id={`${svc.property}Comments`}
										label={getTranslation("formPanel.services.fieldLabel.comments")}
										value={svc.comments}
										handleChange={handleCommentsChange(svc.property)}
										disabled={!svc.selected}
										dir={dir}
										dottedInputUnderline={true}
										inputLabelStyle={{ fontSize: 14, color: "#B5B9BE" }}
									/>
								</Grid>
							</Grid>
						);
					})}
				</Grid>
			</Grid>
		</Fragment>
	);
};

ServicesFields.propTypes = propTypes;


export default memo(ServicesFields);
