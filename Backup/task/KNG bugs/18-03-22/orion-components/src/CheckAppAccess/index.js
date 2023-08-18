import React from "react";
import { userService } from "client-app-core";

export default function checkAppAccess(Component) {
	return appId => {
		class CheckAccess extends React.Component {
			constructor(props) {
				super(props);
				this.state = {
					canAccess: false
				};
			}

			componentWillMount() {
				// const appName = window.location.pathname.split('/')[1];
				this.checkAccess(appId);
			}

			componentWillReceiveProps(nextProps) {
				// this.checkAccess(appId);
			}
			checkAccess = appId => {
				userService.getCanAccessApp(appId, (err, result) => {
					if (err) {
						console.log(err);
						window.location = "/settings-app/my-account-settings";
					} else {
						if (result) {
							if (result.canView) {
								this.setState({
									canAccess: true
								});
							} else {
								if (result.err) {
									console.log(result.err.message);
								}
								window.location = "/settings-app/my-account-settings";
							}
						} else {
							window.location = "/settings-app/my-account-settings";
						}
					}
				});
			};

			render() {
				const component = this.state.canAccess ? (
					<Component {...this.props} />
				) : (
					<div style={{ backgroundColor: "#2C2D2F" }} />
				);

				return component;
			}
		}

		const mapStateToProps = state => ({
			userName: state.session.identity.userId,
			isAuthenticated: state.session.identity.isAuthenticated
		});

		return CheckAccess;
	};
}
