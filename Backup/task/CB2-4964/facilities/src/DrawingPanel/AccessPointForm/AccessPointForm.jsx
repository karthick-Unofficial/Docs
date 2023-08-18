import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, TextField, Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const propTypes = {
	setMapTools: PropTypes.func.isRequired,
	createAccessPoint: PropTypes.func.isRequired,
	feature: PropTypes.object,
	context: PropTypes.object,
	updateAccessPoint: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	feature: null,
	context: null
};

const AccessPointForm = ({
	createAccessPoint,
	setMapTools,
	feature,
	context,
	updateAccessPoint,
	dir
}) => {
	const [values, setValues] = useState({ name: "", description: "" });
	useEffect(() => {
		if (context && context.entity && context.entity.entityData && context.entity.entityData.properties) {
			const { name, description } = context.entity.entityData.properties;
			setValues({ name, description });
		}
		return () => {
			setValues({ name: "", description: "" });
		};
	}, [context]);
	const { name, description } = values;
	const handleChange = field => e => {
		setValues({ ...values, [field]: e.target.value });
	};
	const handleSave = () => {
		context
			? updateAccessPoint({ id: context.entity.id, name, description })
			: createAccessPoint({ name, description });
		setMapTools({ type: null });
	};
	const handleCancel = () => {
		setMapTools({ type: null });
	};
	const placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value} />);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};
	return (
		<Fragment>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between"

				}}
			>
				<Typography variant="h6">
					{context ? <Translate value="drawingPanel.accessPointForm.editAP" /> : <Translate value="drawingPanel.accessPointForm.createAP" />}
				</Typography>
				<div style={{ float: "left", direction: dir === "rtl" ? "rtl" : "ltr" }}>
					<Button style={{
						// marginLeft: "auto"
						marginRight: "auto"
					}} onClick={handleCancel}>
						<Translate value="drawingPanel.accessPointForm.cancel" />
					</Button>
					<Button
						color="primary"
						onClick={handleSave}
						disabled={!feature || !name}
					>
						<Translate value="drawingPanel.accessPointForm.save" />
					</Button>
				</div>
			</div>
			<TextField
				id="facility-name"
				value={name}
				onChange={handleChange("name")}
				placeholder={placeholderConverter("drawingPanel.accessPointForm.fieldLabel.name")}
				required={true}
				variant="filled"
				fullWidth
				margin="normal"
				autoFocus={true}
			/>
			<TextField
				id="facility-description"
				value={description}
				onChange={handleChange("description")}
				placeholder={placeholderConverter("drawingPanel.accessPointForm.fieldLabel.desc")}
				multiline={true}
				rows={4}
				rowsMax={6}
				variant="filled"
				fullWidth
			/>
			{!context &&
				<Typography variant="caption">
					<Translate value="drawingPanel.accessPointForm.clickToPlaceAP" />
				</Typography>
			}
		</Fragment>
	);
};

AccessPointForm.propTypes = propTypes;
AccessPointForm.defaultProps = defaultProps;

export default AccessPointForm;
