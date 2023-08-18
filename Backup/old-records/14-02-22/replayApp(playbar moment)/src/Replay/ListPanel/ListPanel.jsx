/* eslint react/prop-types: 0 */
import React, { PureComponent, Fragment } from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
import EntityProfileContainer from "./EntityProfile/EntityProfileContainer";
import GISProfileContainer from "./GISProfile/GISProfileContainer";
import FacilityProfileContainer from "./FacilityProfile/FacilityProfileContainer";
import EventProfileContainer from "./EventProfile/EventProfileContainer";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
// TODO: Update to most recent Material UI Tabs
import { CircularProgress } from "@material-ui/core";
import { Event, Search } from "@material-ui/icons";
import _ from "lodash";

class ListPanel extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			search: {},
			tab: "collections",
			exclusionDialogOpen: false
		};
	}

	renderProfile(mode) {
		const { endDate } = this.props;
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfileContainer forReplay={true} readOnly={true} endDate={endDate} />
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
	}

	render() {
		const {
			profileMode,
			profileLoaded,
			dir
		} = this.props;


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
					this.renderProfile(profileMode)
				) : (
					<div style={progressStyle.outer}>
						<CircularProgress size={200} />
					</div>
				)}
			</ContextPanel>
		);
	}
}

export default ListPanel;
