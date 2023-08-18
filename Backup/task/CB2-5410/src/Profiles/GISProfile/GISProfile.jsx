import React from "react";
import DetailsWidget from "../Widgets/Details/DetailsWidget.js";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ErrorBoundary from "../../ErrorBoundary";
import { useSelector } from "react-redux";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";

const GISProfile = () => {
	const context = useSelector((state) => selectedContextSelector(state));
	const { entity } = context;
	const { id, entityData } = entity;
	const { geometry, properties } = entityData;
	const { type } = geometry;
	const { layerName, details } = properties;
	const textField = properties["text-field"];
	return entity ? (
		<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
			<ErrorBoundary>
				<SummaryWidget
					id={id}
					name={`${layerName ? layerName + ": " : ""}${textField}`}
					type={type}
					context={context}
					geometry={geometry}
				/>
			</ErrorBoundary>
			<div className="widgets-container">
				<DetailsWidget
					id={"details"}
					details={details}
				/>
			</div>
		</div>
	) : (
		<div />
	);
};

export default GISProfile;
