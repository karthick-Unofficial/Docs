import React, { Fragment, memo, useState, useEffect } from "react";
import { Container, useMediaQuery, CircularProgress } from "@mui/material";
import { replayService, restClient } from "client-app-core";
// components
import { Translate, getTranslation } from "orion-components/i18n";
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
} from "@mui/material";
import {
	mdiMapClockOutline,
	mdiMapMarkerPath,
	mdiCalendarClock
} from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import { getDir, getCultureCode } from "orion-components/i18n/Config/selector";
import * as actionCreators from "./replayArchiveActions";


const getIcon = (type, styles) => {
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

const deleteReplays = (selectedForDeletion, replays, updateReplays, updateSelectedForDeletion, closeDialog, dispatch) => {
	const deletionArray = Object.keys(selectedForDeletion).filter(key => {
		return selectedForDeletion[key];
	});
	replayService.deleteReplays(deletionArray, (err, result) => {
		if (err) {
			console.log(err);
		} else if (result && result.changes) {
			console.log("result: ", result);
			const newReplays = replays.filter(replay => !deletionArray.includes(replay.id));
			updateReplays(newReplays);
			updateSelectedForDeletion({});
		}
		console.log("result: ", result);
		dispatch(closeDialog("deleteReplay"));
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
const NewReplay = () => {

	const dispatch = useDispatch();

	const {
		openDialog,
		closeDialog
	} = actionCreators;

	const identity = useSelector(state => state.session.identity);
	const isHydrated = useSelector(state => state.session.user.isHydrated);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => getCultureCode(state));

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

	const capitalizeFirstLetter = (string) => {
		return string[0].toUpperCase() + string.slice(1);
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
		},
		textAlignRight: {
			...(dir == "rtl" && { textAlign: "right" })
		}
	};

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
									<Translate value="newReplay.replayArchive.replay" />
								</h2>
								<div className="b1-dark-gray">
									<Translate value="newReplay.replayArchive.manage" />
								</div>
							</header>
							<Container component={"section"} style={{
								paddingLeft: 0,
								paddingRight: 0,
								paddingTop: mixedQuery ? 0 : minWidth600Query ? 8 : 16,
								paddingBottom: 20,
								marginTop: 58,
								maxWidth: 1280
							}}>
								<section style={styles.archiveTable}>
									<div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 50, paddingRight: 50, paddingTop: 25 }}>
										{checkForDeletion ? (
											// <Button onClick={() => {
											// 	deleteReplays(selectedForDeletion, replays, updateReplays, updateSelectedForDeletion);
											// }}
											<Button onClick={() => dispatch(openDialog("deleteReplay"))}
												color="primary"
												style={{ textTransform: "none", marginTop: 16 }}
											>
												<Translate value="newReplay.replayArchive.delete" />
											</Button>) : (
											<div />
										)
										}
										<div>
											<SearchField dir={dir} value={searchFilter} handleChange={(e) => updateSearchFilter(e.target.value)} handleClear={(e) => updateSearchFilter("")} id={"archive-search"} placeholder={getTranslation("newReplay.newEventReplay.search")} />
										</div>
									</div>
									<List>
										<ListItem style={styles.textAlignRight} >
											<div style={{ width: 42, padding: 9, marginRight: 16 }} />
											<div style={{ height: 24, width: 56 }} />
											<ListItemText primaryTypographyProps={{ style: { color: "#b5b9be" } }} style={{ ...styles.archiveType, color: "#b5b9be" }} primary={getTranslation("newReplay.replayArchive.tableHeaders.type")} />
											<ListItemText primaryTypographyProps={{ style: { color: "#b5b9be" } }} style={{ ...styles.archiveColumns, color: "#b5b9be" }} primary={getTranslation("newReplay.replayArchive.tableHeaders.name")} />
											<ListItemText primaryTypographyProps={{ style: { color: "#b5b9be" } }} style={{ ...styles.archiveColumns, color: "#b5b9be" }} primary={getTranslation("newReplay.replayArchive.tableHeaders.created")} />
											<ListItemText primaryTypographyProps={{ style: { color: "#b5b9be" } }} style={{ ...styles.archiveColumns, color: "#b5b9be" }} primary={getTranslation("newReplay.replayArchive.tableHeaders.createdBy")} />
											<div style={{ height: 30, width: 100 }} />
										</ListItem>
										<Divider style={{ position: "absolute", left: 0, right: 0 }} />
										{gettingReplays ? (
											<div style={{ textAlign: "center", width: "50%", margin: "30px auto 0px" }}>
												<CircularProgress />
											</div>
										) : !filteredReplays.length ? (
											<div style={{ color: "white", textAlign: "center", width: "50%", margin: "30px auto" }}>
												<p><Translate value="newReplay.replayArchive.saved" /></p>
											</div>
										) : filteredReplays.map((data, index) => {
											return (
												<div key={`data-${index}`}>
													<ListItem style={styles.textAlignRight}>
														<Checkbox
															checked={selectedForDeletion[data.id] ? true : false}
															color="primary"
															onChange={(e) => updateSelectedForDeletion({
																...selectedForDeletion,
																[data.id]: e.target.checked
															})
															}
															style={{ marginRight: 16 }}
														/>
														<ListItemIcon>
															{getIcon(data.type, styles)}
														</ListItemIcon>
														<ListItemText style={styles.archiveType} primary={capitalizeFirstLetter(data.type)} />
														<ListItemText style={styles.archiveColumns} primary={data.name} />
														<ListItemText style={styles.archiveColumns} primary={<UserTime time={data.createdDate} format={"full"} locale={locale} />} />
														<ListItemText style={styles.archiveColumns} primary={data.owner} />
														<Button
															style={{ height: 30, width: 100, color: "#fff" }}
															variant="contained"
															color="primary"
															onClick={() => {
																loadReplay(data);
															}}
														>
															<Translate value="newReplay.replayArchive.load" />
														</Button>
														<Button
															style={{ height: 30, width: 100 }}
															color="primary"
															onClick={() => {
																restClient.exec_get(`/replay-app/api/portable/download/${data.id}`);
																dispatch(openDialog("downloadReplay"));
															}}
														>
															<Translate value="newReplay.replayArchive.download" />
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
				title={`${getTranslation("newReplay.replayArchive.deleteReplay.title.areYouSure")} ${selectedForDeletionCount} ${getTranslation("newReplay.replayArchive.deleteReplay.title.selectedReplay")}${selectedForDeletionCount > 1 ? `${getTranslation("newReplay.replayArchive.deleteReplay.title.s")}` : ""}?`}
				abort={{
					label: `${getTranslation("newReplay.replayArchive.cancel")}`,
					action: () => {
						dispatch(closeDialog("deleteReplay"));
					}
				}}
				confirm={{
					label: `${getTranslation("newReplay.replayArchive.confirm")}`,
					action: () => {
						deleteReplays(selectedForDeletion, replays, updateReplays, updateSelectedForDeletion, closeDialog, dispatch);
					}
				}}
				titlePropStyles={{
					fontWeight: "bold"
				}}
				actionPropStyles={{
					fontWeight: "bold !important"
				}}
			/>
			<Dialog
				open={dialog === "downloadReplay"}
				title={getTranslation("newReplay.replayArchive.downloadReplay")}
				confirm={{
					label: `${getTranslation("newReplay.replayArchive.ok")}`,
					action: () => {
						dispatch(closeDialog("downloadReplay"));
					}
				}}
				titlePropStyles={{
					fontWeight: "bold"
				}}
				actionPropStyles={{
					fontWeight: "bold !important"
				}}
			/>
		</Fragment>
	);
};

export default memo(NewReplay);
