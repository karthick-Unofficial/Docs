import React, { Component } from "react";
import isEqual from "react-fast-compare";

// components
import NotificationsTabContainer from "./Notifications/NotificationsTabContainer";
import CamerasDockContainer from "./Cameras/CameraDockContainer";
import SystemHealthContainer from "./SystemHealth/SystemHealthContainer";
import ErrorBoundary from "../ErrorBoundary";
import ZetronCallingPanelContainer from "./CallingPanel/ZetronCallingPanelContainer";

//Material UI
import Close from "material-ui/svg-icons/content/clear";

class Dock extends Component {
	constructor(props) {
		super(props);

		this.state = {
			feedType: "newswire"
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleFeedSelection = this.handleFeedSelection.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
		);
	}

	handleChange(value) {
		this.props.setTab(value);
	}

	handleFeedSelection = value => {
		this.setState({
			feedType: value
		});
	};

	// TODO: MAKE CONTROLLED AND ADJUST LABEL AND INKBAR STYLES FOR UNSELECTED
	render() {
		const { componentState, map, readOnly, dir } = this.props;

		return (
			<div id="sidebar-inner-wrapper" className="cf">
				<ErrorBoundary>
					{componentState.isOpen && (
						<div
							onClick={() => this.props.toggleOpen()}
							className="ad-toggle-mobile"
						>
							<a>
								<div className={dir && dir == "rtl" ? "close-ad-textRTL" : "close-ad-text"}>
									<Close />
								</div>
							</a>
						</div>
					)}
					{componentState.tab === "Notifications" && (
						<ErrorBoundary>
							<div className="margin-container">
								<NotificationsTabContainer
									map={this.props.map}
									notifications={this.props.notifications}
									componentState={componentState}
								/>
							</div>
						</ErrorBoundary>
					)}

					{componentState.tab === "Cameras" && (
						<ErrorBoundary>
							<CamerasDockContainer map={map} readOnly={readOnly} />
						</ErrorBoundary>
					)}

					{componentState.tab === "System_health" && (
						<ErrorBoundary>
							<SystemHealthContainer />
						</ErrorBoundary>
					)}

					{componentState.tab === "Calling_Panel" && (
						<ErrorBoundary>
							<ZetronCallingPanelContainer />
						</ErrorBoundary>
					)}

				</ErrorBoundary>
			</div>
		);
	}
}

export default Dock;
