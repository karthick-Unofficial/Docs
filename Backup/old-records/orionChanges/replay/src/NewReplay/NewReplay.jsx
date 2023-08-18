import React, { memo } from "react";
import { Container, useMediaQuery } from "@material-ui/core";
import { Link } from "react-router";
//material-ui
import {
	SvgIcon
} from "@material-ui/core";
import {
	mdiMapClockOutline,
	mdiMapMarkerPath,
	mdiCalendarClock
} from "@mdi/js";

import ReplayArchiveContainer from "./ReplayArchive/ReplayArchiveContainer";
const propTypes = {
};

const defaultProps = {
};

const styles = {
	replayTypesSection: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
		borderRadius: 10
	},
	replayTypes: {

	},
	newReplayIcons: {
		color: "white",
		height: 36,
		width: 36
	},
	placeholderImg: {
		width: 266,
		height: 211,
		margin: "auto",
		cursor: "not-allowed"
	}
};

const getLink = index => {
	switch (index) {
		case 0:
			return "new-map-replay";
		case 1: {
			return "new-zone-replay";
		}
		case 2: {
			return "new-track-replay";
		}
		case 3: {
			return "new-event-replay";
		}
		default:
			return "/";
	}
};

const replayTypes = [
	{
		title: "Map Selection",
		description: "Generate new Replay from map area selection.",
		icon: <SvgIcon style={styles.newReplayIcons}>
			<path d={mdiMapClockOutline} />
		</SvgIcon>
	}
	// },
	// {
	// 	title: "Map Zone",
	// 	description: "Generate new Replay from an existing map zone.",
	// 	icon: <SvgIcon style={styles.newReplayIcons}>
	// 		<path d={mdiMapMarkerPath} />
	// 	</SvgIcon>
	// },
	// {
	// 	title: "Track",
	// 	description: "Generate new Replay from any current or historical track.",
	// 	icon: <img src={require("./images/Replay_Track_Icon.png")} style={{height: 36, width: 36}} />
	// },
	// {
	// 	title: "Event",
	// 	description: "Generate new Replay from an Event Timeline.",
	// 	icon: <SvgIcon style={styles.newReplayIcons}>
	// 		<path d={mdiCalendarClock} />
	// 	</SvgIcon>
	// }
];

const NewReplay = () => {
	const minWidth1024Query = useMediaQuery("(min-width:1024px)");
	const minWidth720Query = useMediaQuery("(min-width:720px)");
	const minWidth600Query = useMediaQuery("(min-width:600px)");
	const mixedQuery = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");

	return (
		<div style={{ paddingTop: 52 }}>
			{/* New Replay */}
			<div>
				<div style={{
					marginLeft: "auto",
					marginRight: "auto",
					paddingLeft: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8,
					paddingRight: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8
				}}>
					<div>
						{/* My Settings Header */}
						<header style={{ textAlign: "center" }}>
							<h2>
								New Replay
							</h2>
							<div className="b1-dark-gray">
								Choose starting point to generate new Replay or search archived Replay files.
							</div>
						</header>
						<Container component={"section"} style={{
							paddingLeft: 0,
							paddingRight: 0,
							paddingTop: mixedQuery ? 0 : minWidth600Query ? 8 : 16,
							paddingBottom: 20,
							marginTop: 58,
							marginBottom: 58
						}}>
							<section style={styles.replayTypesSection}>
								{replayTypes.map((type, index) => {
									return (
										<Link style={{textDecoration: "none", margin: "auto"}} key={type.title} to={getLink(index)}>
											<div className="replay-type-card" style={styles.replayTypes} >
												{type.icon}
												<div>
													<p style={{ color: "white" }}>{type.title}</p>
													<p className="b2-bright-gray">{type.description}</p>
												</div>

											</div>
										</Link>
									);
								})}
								{/* Below are "coming soon" placeholders */}
								<img src={require("../../public/static/images/zone-replay-coming-soon.png")} style={styles.placeholderImg} />
								<img src={require("../../public/static/images/track-replay-coming-soon.png")} style={styles.placeholderImg} />
								<img src={require("../../public/static/images/event-replay-coming-soon.png")} style={styles.placeholderImg} />
							</section>
						</Container>
						<ReplayArchiveContainer />
					</div>
				</div>
			</div>
		</div>
	);
};

NewReplay.propTypes = propTypes;
NewReplay.defaultProps = defaultProps;

export default memo(NewReplay);
