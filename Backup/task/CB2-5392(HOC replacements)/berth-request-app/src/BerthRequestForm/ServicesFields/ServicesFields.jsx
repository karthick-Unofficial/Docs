import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField } from "orion-components/CBComponents";
import {
	Checkbox,
	FormControlLabel,
	Grid
} from "@material-ui/core";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	updateServices: PropTypes.func.isRequired,
	servicesConfig: PropTypes.array.isRequired,
	services: PropTypes.object,
	dir: PropTypes.string
};

const defaultProps = {

};

const ServicesFields = ({
	updateServices,
	servicesConfig,
	services,
	dir
}) => {
	const [serviceObjects, setServiceObjects] = useState([]);

	useEffect(() => {
		if (servicesConfig && servicesConfig.length > 0) {
			setServiceObjects(servicesConfig.map(svc => {
				return {
					...svc,
					selected: Boolean(services && services[svc.property] && services[svc.property].selected),
					comments: (services && services[svc.property]) ? services[svc.property].comments : ""
				};
			}));
		}
	}, [servicesConfig, services]);

	const handleChecked = service => e => {
		const newServices = {};
		serviceObjects.forEach(svcObj => {
			newServices[svcObj.property] = {
				label: svcObj.label,
				selected: svcObj.property === service ? e.target.checked : svcObj.selected,
				comments: svcObj.comments
			};
		});

		updateServices(newServices);

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

		updateServices(newServices);

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

	return (
		<Fragment>
			<Grid style={{ padding: "0px 16px 24px 16px" }} container spacing={3}>
				<Grid item style={{ paddingBottom: 0 }} xs={12}>
					{serviceObjects.map(svc => {
						return (
							<Grid container direction="row" key={`${svc.property}-grid`}>
								<Grid item xs={12} sm={4} style={{ marginTop: 16 }}>
									<FormControlLabel
										control={
											<Checkbox
												value={svc.selected}
												checked={svc.selected}
												color="primary"
												onChange={handleChecked(`${svc.property}`)}
												style={{
													color: svc.selected ? "#3f51b5" : "rgba(0, 0, 0, 0.54)"
												}}
											/>
										}
										label={svc.label}
									/>
								</Grid>
								<Grid item xs={12} sm={8}>
									<TextField
										style={{ margin: 0 }}
										id={`${svc.property}Comments`}
										label={getTranslation("berthRequestForm.servicesField.comments")}
										value={svc.comments}
										handleChange={handleCommentsChange(svc.property)}
										disabled={!svc.selected}
										dir={dir}
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
ServicesFields.defaultProps = defaultProps;

export default memo(ServicesFields);
