import React, { Component } from "react";
import RulesAppBarContainer from "./RulesAppBar/RulesAppBarContainer";
import { Services } from "orion-components/Services";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { WavCam } from "orion-components/Dock";
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timedOut: false
		};
	}

	componentDidMount() {
		this.props.hydrateUser(this.props.session.identity.userId);
		this.props.getAppState("rules-app");
		this.props.getGlobalAppState();
		this.props.reHydrateUser(this.props.session.identity.userId);
		// this.props.fetchRules(this.props.session.user.profile.orgId);
		// this.props.fetchCollections();
		this.props.fetchHealthSystems();

		//New
		this.props.subscribeRules();
		this.props.subscribeCollections();
		this.props.subscribeFeedPermissions();

		setTimeout(() => {
			this.setState({
				timedOut: true
			});
		}, 4000);
	}

	render() {
		const isHydrated =
			(
				this.props.session.identity.userId 
				&& this.props.globalData.org.orgUsers
			) 
			|| this.state.timedOut;

		return (
			<div>
				{isHydrated ? (
					<div className="rulesAppWrapper">
						<Services />
						<ErrorBoundary>
							<RulesAppBarContainer location={this.props.location} />
						</ErrorBoundary>
						<WavCam />
						{this.props.children}
					</div>
				) : null
				}
			</div>
		);
	}
}

export default App;
