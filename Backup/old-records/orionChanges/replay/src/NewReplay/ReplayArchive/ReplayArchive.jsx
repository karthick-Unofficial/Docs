import React, { Fragment, memo, useState, useEffect } from "react";
import { Container, useMediaQuery, CircularProgress } from "@material-ui/core";
import { replayService, restClient } from "client-app-core";
// components
import { SearchField, Dialog } from "orion-components/CBComponents";
import { UserTime } from "orion-components/SharedComponents";
//material-ui
import {
	Button,
	SvgIcon,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Checkbox,
	Divider
} from "@material-ui/core";
import {
	mdiMapClockOutline,
	mdiMapMarkerPath,
	mdiCalendarClock
} from "@mdi/js";
const propTypes = {
};

const defaultProps = {
};

const styles = {
	archiveTable: {
		width: "100%",
		backgroundColor: "rgb(65, 69, 74)",
		borderRadius: 10
	},
	archiveIcons: {
		color: "white",
		height: 24,
		width: 31
	},
	archiveType: {
		flex: "none",
		width: 150
	},
	archiveColumns: {
		flex: "1 1"
	}
};

const getIcon = type => {
	switch (type) {
		case "track":
			return (
				<img src={require("../images/Replay_Track_Icon_sm.png")} style={{ height: 20, width: 31 }} />
			);
		case "event": {
			return (
				<SvgIcon style={styles.archiveIcons}>
					<path d={mdiCalendarClock} />
				</SvgIcon>
			);
		}
		case "zone": {
			return (
				<SvgIcon style={styles.archiveIcons}>
					<path d={mdiMapMarkerPath} />
				</SvgIcon>
			);
		}
		case "map": {
			return (
				<SvgIcon style={styles.archiveIcons}>
					<path d={mdiMapClockOutline} />
				</SvgIcon>
			);
		}
		default:
			return "";
	}
};

const deleteReplays = (selectedForDeletion, replays, updateReplays, updateSelectedForDeletion, closeDialog) => {
	const deletionArray = Object.keys(selectedForDeletion).filter(key => {
		return selectedForDeletion[key];
	});
	replayService.deleteReplays(deletionArray, (err, result) => {
		if (err) {
			console.log(err);
		} else if (result && result.changes){
			console.log("result: ", result);
			const newReplays = replays.filter(replay => !deletionArray.includes(replay.id));
			updateReplays(newReplays);
			updateSelectedForDeletion({});
		}
		console.log("result: ", result);
		closeDialog("deleteReplay");
	});
};

const loadReplay = (replay) => {
	let parameters = "";
	Object.keys(replay).forEach(key => {
		if (!["createdDate", "owner", "ownerOrg"].includes(key)) {
			parameters += `&${key}=${replay[key]}`;
		}
	});
	window.open(`${window.location.origin}/replay-app/#/replay?${parameters}`);
};
const NewReplay = ({ dialog, openDialog, closeDialog }) => {
	const minWidth1024Query = useMediaQuery("(min-width:1024px)");
	const minWidth720Query = useMediaQuery("(min-width:720px)");
	const minWidth600Query = useMediaQuery("(min-width:600px)");
	const mixedQuery = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	const [searchFilter, updateSearchFilter] = useState("");
	const [selectedForDeletion, updateSelectedForDeletion] = useState({});
	const [gettingReplays, updateGettingReplays] = useState(true);
	const checkForDeletion = Object.values(selectedForDeletion).some(value => value);
	const [replays, updateReplays] = useState([]);
	useEffect(() => {
		replayService.getAllReplays((err, result) => {
			if (err) {
				console.log("err: ", err);
			} else {
				updateReplays(result);
			}
			updateGettingReplays(false);
		});
	}, []);

	const filteredReplays = replays.filter(data => {
		return data.name.toLowerCase().includes(searchFilter.toLowerCase());
	}).sort((a, b) => (a.createdDate < b.createdDate) ? 1 : -1);

	const selectedForDeletionCount = Object.keys(selectedForDeletion).filter(key => selectedForDeletion[key]).length;

	return (
		<Fragment>
			<div>
				{/* Replay Archive */}
				<div>
					<div style={{
						marginLeft: "auto",
						marginRight: "auto",
						paddingLeft: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8,
						paddingRight: minWidth1024Query ? 48 : minWidth720Query ? 24 : minWidth600Query ? 16 : 8
					}}>
						<div>
							<header style={{ textAlign: "center" }}>
								<h2>
									Replay Archive
								</h2>
								<div className="b1-dark-gray">
									Manage and view saved Replays.
								</div>
							</header>
							<Container component={"section"} style={{
								paddingLeft: 0,
								paddingRight: 0,
								paddingTop: mixedQuery ? 0 : minWidth600Query ? 8 : 16,
								paddingBottom: 20,
								marginTop: 58
							}}>
								<section style={styles.archiveTable}>
									<div style={{display: "flex", justifyContent: "space-between", paddingLeft: 50, paddingRight: 50, paddingTop: 25}}>
										{checkForDeletion ? (
											// <Button onClick={() => {
											// 	deleteReplays(selectedForDeletion, replays, updateReplays, updateSelectedForDeletion);
											// }}
											<Button onClick={() => openDialog("deleteReplay")}
												color="primary" 
												style={{textTransform: "none", marginTop: 16}}
											>
												Delete Items
											</Button>) : (
											<div />
										)
										}
										<div>
											<SearchField value={searchFilter} handleChange={(e) => updateSearchFilter(e.target.value)} handleClear={(e) => updateSearchFilter("")} id={"archive-search"} placeholder={"Search Archive"} />
										</div>
									</div>
									<List>
										<ListItem >
											<div style={{ width: 42, padding: 9, marginRight: 16 }} />
											<div style={{ height: 24, width: 56 }} />
											<ListItemText primaryTypographyProps={{ style: {color: "#b5b9be"} }} style={{ ...styles.archiveType, color: "#b5b9be"}} primary={"Type"} />
											<ListItemText primaryTypographyProps={{ style: {color: "#b5b9be"} }} style={{...styles.archiveColumns, color: "#b5b9be"}} primary={"Name"} />
											<ListItemText primaryTypographyProps={{ style: {color: "#b5b9be"} }} style={{...styles.archiveColumns, color: "#b5b9be"}} primary={"Created"} />
											<ListItemText primaryTypographyProps={{ style: {color: "#b5b9be"} }} style={{...styles.archiveColumns, color: "#b5b9be"}} primary={"Created by"} />
											<div style={{ height: 30, width: 100 }} />
										</ListItem>
										<Divider style={{ position: "absolute", left: 0, right: 0 }} />
										{gettingReplays ? (
											<div style={{ textAlign: "center", width: "50%", margin: "30px auto 0px" }}>
												<CircularProgress />
											</div>
										) : !filteredReplays.length ? (
											<div style={{ color: "white", textAlign: "center", width: "50%", margin: "30px auto" }}>
												<p>No Saved Replays Found</p>
											</div>
										) : filteredReplays.map((data, index) => {
											return (
												<div key={`data-${index}`}>
													<ListItem >
														<Checkbox
															checked={selectedForDeletion[data.id] ? true : false}
															color="primary"
															onChange={(e) => updateSelectedForDeletion({
																...selectedForDeletion,
																[data.id]: e.target.checked
															})
															}
															style={{marginRight: 16}}
														/>
														<ListItemIcon>
															{getIcon(data.type)}
														</ListItemIcon>
														<ListItemText style={styles.archiveType} primary={data.type} />
														<ListItemText style={styles.archiveColumns} primary={data.name} />
														<ListItemText style={styles.archiveColumns} primary={<UserTime time={data.createdDate} format={"full"} />} />
														<ListItemText style={styles.archiveColumns} primary={data.owner} />
														<Button
															style={{height: 30, width: 100}}
															variant="contained"
															color="primary"
															onClick={() => {
																loadReplay(data);
															}}
														>
														Load
														</Button>
														<Button
															style={{height: 30, width: 100}}
															color="primary"
															onClick={() => {
																restClient.exec_get(`/replay-app/api/portable/download/${data.id}`);
																openDialog("downloadReplay");
															}}
														>
														Download
														</Button>
													</ListItem>
													{
														index !== filteredReplays.length - 1 ?
															<Divider style={{ position: "absolute", left: 0, right: 0 }} /> : null
													}
												</div>
											);
										})}
									</List>
								</section>
							</Container>
						</div>
					</div>
				</div>
			</div>
			<Dialog
				open={dialog === "deleteReplay"}
				title={`Are you sure you want to delete the ${selectedForDeletionCount} selected replay${selectedForDeletionCount > 1 ? "s" : ""}?`}
				abort={{
					label: "CANCEL",
					action: () => {
						closeDialog("deleteReplay");
					}
				}}
				confirm={{
					label: "CONFIRM",
					action: () => {
						deleteReplays(selectedForDeletion, replays, updateReplays, updateSelectedForDeletion, closeDialog);
					}
				}}
			/>
			<Dialog
				open={dialog === "downloadReplay"}
				title={"It may take some time to complete your request. You will receive a notification with a link to download when the replay is available."}
				confirm={{
					label: "Ok",
					action: () => {
						closeDialog("downloadReplay");
					}
				}}
			/>
		</Fragment>
	);
};

NewReplay.propTypes = propTypes;
NewReplay.defaultProps = defaultProps;

export default memo(NewReplay);
