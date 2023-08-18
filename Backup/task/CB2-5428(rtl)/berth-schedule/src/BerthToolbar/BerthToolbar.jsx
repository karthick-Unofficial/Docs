import React, { memo, useState } from "react";
import { AppBar, Button, Fab, Toolbar, Typography } from "@mui/material";
import SearchSelectField from "../shared/components/SearchSelectField";
import moment from "moment";
import { Add, Map, InsertInvitation, EventNote } from "@mui/icons-material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { editAssignment, openEventForm, startMapStreams, setDay, stopMapStreams, updateBerthView } from "./berthToolbarActions";

const BerthToolbar = () => {
	const dispatch = useDispatch();

	const assignments = useSelector(state => state.assignments);
	const map = useSelector(state => state.map);
	const view = useSelector(state => state.view);
	const session = useSelector(state => state.session);
	const clientConfig = useSelector(state => state.clientConfig);

	const { mapFeedIds, mapInclusionZone } = clientConfig;
	const user = session.user.profile;
	const canEdit = user.applications && user.applications.find(app => app.appId === "berth-schedule-app") &&
		user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	const Assignments = Object.values(assignments.allAssignments);
	const dir = useSelector(state => getDir(state));

	const initialResults = Assignments.map(assignment => {
		const { id, vessel, schedule, berth } = assignment;
		return {
			assignment,
			id,
			name: `${vessel.name}${berth ? ` @ ${berth.name}` : ""}`,
			date: moment(schedule.ata || schedule.eta).toString()
		};
	});
	const [results, setResults] = useState(initialResults);
	const handleSearch = e => {
		const filteredResults = initialResults.filter(result => {
			const { vessel, berth } = result.assignment;
			const query = e.target.value.toLowerCase();

			return vessel.name.toLowerCase().includes(query) ||
				(berth && berth.name && berth.name.toLowerCase().includes(query));
		});

		// -- sort results in descending order by date
		filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
		setResults(
			Array.isArray(filteredResults) ? filteredResults.slice(0, 14) : []
		);
	};
	const handleSelect = id => {
		const result = results.find(result => result.id === id);
		dispatch(setDay(moment(result.date)));
		dispatch(editAssignment(result));
	};
	const openMap = () => {
		dispatch(startMapStreams(mapFeedIds, mapInclusionZone));
	};
	const closeMap = () => {
		dispatch(stopMapStreams(map.subscriptions));
	};
	const updateView = () => {
		dispatch(updateBerthView(view.page));
	};

	const styles = {
		toolbar: {
			height: 55,
			justifyContent: "center",
			...(dir === "rtl" ? { paddingRight: 12 } : { paddingLeft: 12 })
		},
		fab: {
			...(dir === "rtl" ? { marginLeft: "auto" } : { marginRight: "auto" }),
			display: "flex",
			alignItems: "center"
		},
		searchFieldWrapper: {
			width: 300,
			...(dir === "rtl" ? { marginLeft: "auto" } : { marginRight: "auto" })
		},
		typography: {
			...(dir === "rtl" ? { marginRight: "1rem" } : { marginLeft: "1rem" })
		},
		button: {
			width: "180px",
			color: "#fff",
			...(dir === "rtl" ? { marginLeft: "12px" } : { marginRight: "12px" })
		},
		icon: {
			...(dir === "rtl" ? { marginLeft: 6 } : { marginRight: 6 })
		}
	};

	return (
		<AppBar position="relative" color="default" style={{ zIndex: 100, background: "#202020", paddingRight: "20px" }}>
			<Toolbar
				style={styles.toolbar}
			>
				<div
					style={styles.fab}
				>
					<Fab onClick={() => dispatch(openEventForm())} disabled={!canEdit} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="body1" style={styles.typography}>
						<Translate value="berthToolbar.newEvent" />
					</Typography>
				</div>

				{/* hide search bar on daily agenda */}
				{view.page === "schedule" &&
					<div style={styles.searchFieldWrapper}>
						<SearchSelectField
							id="assignment-search"
							key="assignment-search"
							value=""
							label={getTranslation("berthToolbar.fieldLabel.search")}
							handleSearch={handleSearch}
							handleSelect={handleSelect}
							results={results}
							dir={dir}
						/>
					</div>
				}
				<Button
					onClick={updateView}
					variant="contained"
					color="primary"
					style={styles.button}
				>
					{view.page === "schedule" ? <EventNote style={styles.icon} /> : <InsertInvitation style={styles.icon} />}
					{view.page === "schedule" ? getTranslation("berthToolbar.btnLabel.dailyAgendaList") : getTranslation("berthToolbar.btnLabel.berthSchedule")}
				</Button>
				<Button
					onClick={map.open ? closeMap : openMap}
					variant="contained"
					color="primary"
					style={{ color: "#fff" }}
				>
					<Map style={styles.icon} />
					{map.open ? getTranslation("berthToolbar.btnLabel.hideMap") : getTranslation("berthToolbar.btnLabel.showMap")}
				</Button>
			</Toolbar>
		</AppBar>
	);
};



export default memo(BerthToolbar);
