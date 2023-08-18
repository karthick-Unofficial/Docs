import React from "react";
import DetailsWidget from "../Widgets/Details/DetailsWidget.js";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ErrorBoundary from "../../ErrorBoundary";

const GISProfile = ({ context, user, mapVisible, timeFormatPreference, dir }) => {
	const { entity } = context;
	const { id, entityData } = entity;
	const { geometry, properties } = entityData;
	const { type } = geometry;
	const { layerName, details } = properties;
	const textField = properties["text-field"];
	return entity ? (
		<div
			className="cb-profile-wrapper"
			style={{ height: "100%", overflow: "scroll" }}
		>
			<ErrorBoundary>
				<SummaryWidget
					id={id}
					user={user}
					name={`${layerName ? layerName + ": " : ""}${textField}`}
					type={type}
					context={context}
					geometry={geometry}
					mapVisible={mapVisible}
					dir={dir}
				/>
			</ErrorBoundary>
			<div className="widgets-container">
				<DetailsWidget
					order={0}
					details={details}
					timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
					dir={dir}
				/>
			</div>
		</div>
	) : (
		<div />
	);
};

export default GISProfile;
