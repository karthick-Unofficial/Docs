import React from "react";
import DetailsWidget from "../Widgets/Details/DetailsWidget.js";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ErrorBoundary from "../../ErrorBoundary";
import { useSelector } from "react-redux";
import { mapState } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const GISProfile = ({ replayMapState }) => {
	const context = useSelector(state => selectedContextSelector(state));
	const user = useSelector(state => state.session.user.profile);
	const mapStatus = useSelector(state => replayMapState ? replayMapState(state) : mapState(state));
	const mapVisible = (mapStatus.visible);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));

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
