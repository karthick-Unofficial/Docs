import React, { useEffect, useState } from "react";
import { userService } from "client-app-core";

export default function checkAppAccess(Component) {
	return appId => {
		const CheckAccess = (props) => {
			const [canAccess, setCanAccess] = useState(false);
			const [mounted, setMounted] = useState(false);

			useEffect(() => {
				setMounted(true);
			}, []);

			// componentWillReceiveProps(nextProps) {
			// 	// this.checkAccess(appId);
			// }
			//Seems like this is'nt used anymore.

			const checkAccess = appId => {
				userService.getCanAccessApp(appId, (err, result) => {
					if (err) {
						console.log(err);
						window.location = "/settings-app/my-account-settings";
					} else {
						if (result) {
							if (result.canView) {
								setCanAccess(true);
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

			if (!mounted) {
				// const appName = window.location.pathname.split('/')[1];
				checkAccess(appId);
				setMounted(true);
			}

			const component = canAccess ? (
				<Component {...props} />
			) : (
				<div style={{ backgroundColor: "#2C2D2F" }} />
			);

			return component;
		};

		const mapStateToProps = state => ({
			userName: state.session.identity.userId,
			isAuthenticated: state.session.identity.isAuthenticated
		});

		return CheckAccess;
	};
}
