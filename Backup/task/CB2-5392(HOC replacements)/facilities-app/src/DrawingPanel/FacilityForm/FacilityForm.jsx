import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, TextField, Typography } from "@material-ui/core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import {setMapTools, createFacility, updateFacility} from "./facilityFormActions";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";

const FacilityForm = ({
}) => {

	const { feature } = useSelector(state => state.mapState.mapTools);
	const context = useSelector(state => selectedContextSelector(state));
	const dir = useSelector(state => getDir(state));
	const dispatch = useDispatch();

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
			? dispatch(updateFacility({ id: context.entity.id, name, description }))
			: dispatch(createFacility({ name, description }));
		dispatch(setMapTools({ type: null }));
	};
	const handleCancel = () => {
		dispatch(setMapTools({ type: null }));
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
					{context ? <Translate value="drawingPanel.facilityForm.editFacility" /> : <Translate value="drawingPanel.facilityForm.createFacility" />}
				</Typography>
				<div style={{ float: "left", direction: dir === "rtl" ? "rtl" : "ltr" }}>
					<Button style={{
						// marginLeft: "auto"
						marginRight: "auto"
					}} onClick={handleCancel}>
						<Translate value="drawingPanel.facilityForm.cancel" />
					</Button>
					<Button
						color="primary"
						onClick={handleSave}
						disabled={!feature || !name}
					>
						<Translate value="drawingPanel.facilityForm.save" />
					</Button>
				</div>
			</div>
			<TextField
				id="facility-name"
				value={name}
				onChange={handleChange("name")}
				placeholder={getTranslation("drawingPanel.facilityForm.fieldLabel.name")}
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
				placeholder={getTranslation("drawingPanel.facilityForm.fieldLabel.desc")}
				multiline={true}
				rows={4}
				rowsMax={6}
				variant="filled"
				fullWidth
			/>
			{!context &&
				<Typography variant="caption">
					<Translate value="drawingPanel.facilityForm.clickToPlaceFac" />
				</Typography>
			}
		</Fragment>
	);
};

export default FacilityForm;
