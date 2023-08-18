import React, { Component } from "react";

// Material UI
import FlatButton from "material-ui/FlatButton";
import AutoComplete from "material-ui/AutoComplete";

// Material UI Icons
import MapMarkerRadiusIcon from "mdi-react/MapMarkerRadiusIcon";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

export default class DockedControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cameraSearch: ""
		};
	}

	handleUpdateInput = searchText => {
		this.setState({ cameraSearch: searchText });
	};

	handleNewRequest = (chosenRequest, index) => {
		this.setState({ cameraSearch: "" });
		const cameraId = this.props.userCameras[index].id;
		this.props.addToDock(
			cameraId,
			this.props.cameraPosition,
			this.props.dockedCameras
		);
	};

	handleToggleNearestCameraMode = () => {
		this.props.setFindNearestMode(this.props.cameraPosition);
	};

	render() {
		const {
			userCameras,
			cameraView,
			cameraPosition,
			findNearestMode,
			findNearestPosition,
			dir
		} = this.props;

		const searchableCameras = userCameras.map(item => {
			return item.entityData.properties.name;
		});

		const controlStyles = {
			addCamera: {
				backgroundColor: "#41454A",
				borderRadius: "5px",
				marginTop: "15%"
			},
			searchCamera: {
				backgroundColor: "#2C2B2D"
			}
		};

		return (
			<div>
				<div
					className="camera-dock-controls"
					style={cameraView ? { paddingBottom: "15%" } : {}}
				>
					{cameraView && (
						<FlatButton
							style={controlStyles.addCamera}
							// If find nearest mode is active, and the position matches, style button correctly
							label={
								findNearestMode[cameraPosition] &&
								findNearestPosition === cameraPosition
									? getTranslation("global.dock.cameras.dockedControls.selectNearestCam")
									: getTranslation("global.dock.cameras.dockedControls.mapLocation")
							}
							primary={
								findNearestMode[cameraPosition] &&
								findNearestPosition === cameraPosition
							}
							labelStyle={{ fontSize: "10px" }}
							onClick={this.handleToggleNearestCameraMode}
							icon={<MapMarkerRadiusIcon style={dir == "rtl" ? {marginLeft: 0, marginRight: 12} : {}}/>}
						/>
					)}
					{cameraView && <p> <Translate value="global.dock.cameras.dockedControls.or"/> </p>}
					<AutoComplete
						className="search-for-camera"
						textFieldStyle={controlStyles.searchCamera}
						hintText={getTranslation("global.dock.cameras.dockedControls.searchForCam")}
						searchText={this.state.cameraSearch}
						onUpdateInput={this.handleUpdateInput}
						onNewRequest={this.handleNewRequest}
						dataSource={searchableCameras}
						filter={AutoComplete.caseInsensitiveFilter}
						openOnFocus={true}
						maxSearchResults={5}
					/>
				</div>
			</div>
		);
	}
}
