/* eslint react/prop-types: 0 */
import React from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
import EntityProfileContainer from "./EntityProfile/EntityProfileContainer";
import GISProfileContainer from "./GISProfile/GISProfileContainer";
import FacilityProfileContainer from "./FacilityProfile/FacilityProfileContainer";
import EventProfileContainer from "./EventProfile/EventProfileContainer";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
import AccessPointProfileContainer from "./AccessPointProfile/AccessPointProfileContainer";
// TODO: Update to most recent Material UI Tabs
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";

const ListPanel = ({
	endDate,
	profileMode,
	profileLoaded,
	dir
}) => {


	const renderProfile = (mode) => {
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfileContainer forReplay={true} readOnly={true} endDate={endDate} />
					</ErrorBoundary>
				);
			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfileContainer forReplay={true} readOnly={true} endDate={endDate} />
					</ErrorBoundary>
				);
			case "facility":
				return (
					<ErrorBoundary>
						<FacilityProfileContainer forReplay={true} readOnly={true} endDate={endDate} />
					</ErrorBoundary>
				);
			case "shapes":
			case "track":
				return (
					<ErrorBoundary>
						<EntityProfileContainer forReplay={true} readOnly={true} endDate={endDate} />
					</ErrorBoundary>
				);

			case "gis":
				return (
					<ErrorBoundary>
						<GISProfileContainer forReplay={true} readOnly={true} endDate={endDate} />
					</ErrorBoundary>
				);

			case "event":
				return (
					<ErrorBoundary>
						<EventProfileContainer forReplay={true} readOnly={true} replayEndDate={endDate} />
					</ErrorBoundary>
				);

			default:
				break;
		}
	};
	const progressStyle = {
		outer: {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}
	};
	return (
		<ContextPanel
			className="list-panel"
			secondaryClassName="entity-profile"
			hidden={false}
			readOnly={true}
			dir={dir}
		>
			<div></div>
			{profileLoaded ? (
				renderProfile(profileMode)
			) : (
				<div style={progressStyle.outer}>
					<CircularProgress size={200} />
				</div>
			)}
		</ContextPanel>
	);
};

export default ListPanel;
