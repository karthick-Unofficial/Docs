import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	GridList,
	GridListTile,
	Button,
	Divider,
	Typography
} from "@material-ui/core";
import { Avatar } from "../index";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const styles = {
	paper: {
		backgroundColor: "#1f1f21",
		color: "#fff",
		maxWidth: 340,
		display: "flex",
		flexDirection: "column"
	},
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	logOut: PropTypes.func.isRequired
};

const CBAppMenu = ({ classes, user, logOut }) => {

	const checkAccess = app => {
		return _.isString(app)
			? !_.includes(window.location.href, app)
			: app.config.canView && !_.includes(window.location.href, app.name);
	};

	const { profile } = user;
	const { applications } = profile;

	const styles = {
		link: {
			textDecoration: "none"
		}
	};

	return (
		<Paper className={classes.paper}>
			<List>
				<ListItem style={{ flexGrow: 1 }}>
					<ListItemAvatar>
						<Avatar
							image={
								profile.profileImage
									? `/_download?handle=${profile.profileImage}`
									: null
							}
							name={profile.name}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={profile.name}
						secondary={profile.orgRole.title}
						primaryTypographyProps={{ noWrap: true }}
						secondaryTypographyProps={{ noWrap: true }}
					/>
					<Button onClick={logOut} color="primary">
						<Translate value="global.CBComponents.CBAppMenu.logOut" />
					</Button>
				</ListItem>
				<Divider />
				<GridList cellHeight={120} spacing={0}>
					{checkAccess("settings") && (
						<GridListTile className={classes.root} style={{ width: "33%" }}>
							<a
								style={styles.link}
								alt={getTranslation("global.CBComponents.CBAppMenu.settings")}
								href="/settings-app/my-profile"
							>
								<img
									style={{ height: 60 }}
									alt={getTranslation("global.CBComponents.CBAppMenu.settings")}
									src="../../static/app-icons/app.settings.png"
								/>
								<Typography align="center"><Translate value="global.CBComponents.CBAppMenu.settings" /></Typography>
							</a>
						</GridListTile>
					)}
					{_.map(
						_.filter(applications, app => checkAccess(app)),
						app => {
							const appIconSrc = `/_fileDownload?bucketName=app-icons&fileName=app.${app.appId.replace(/-app/g, "")}.png`;
							return (
								<GridListTile
									key={app.appId}
									className={classes.root}
									style={{ width: "33%" }}
								>
									<a
										style={styles.link}
										alt={app.name}
										href={`/${app.appId}`}
									>
										<img style={{ height: 60 }} alt={app.name} src={appIconSrc} />
										<Typography align="center">{app.name}</Typography>
									</a>
								</GridListTile>
							);
						}
					)}
					<GridListTile className={classes.root} style={{ width: "33%" }}>
						<a
							style={styles.link}
							alt={getTranslation("global.CBComponents.CBAppMenu.support")}
							target="_blank"
							rel="noopener noreferrer"
							href="http://support.commandbridge.com/helpdesk/"
						>
							<img
								style={{ height: 60 }}
								alt="Settings"
								src="../../static/app-icons/app.support.png"
							/>
							<Typography align="center"><Translate value="global.CBComponents.CBAppMenu.support" /></Typography>
						</a>
					</GridListTile>
				</GridList>
			</List>
		</Paper>
	);
};

CBAppMenu.propTypes = propTypes;

export default withStyles(styles)(CBAppMenu);
