import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Button, Fab, Toolbar, Typography } from "@material-ui/core";
import SearchSelectField from "../shared/components/SearchSelectField";
import moment from "moment";
import { Add, Map, InsertInvitation, EventNote } from "@material-ui/icons";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { editAssignment, openEventForm, startMapStreams, setDay, stopMapStreams, updateBerthView } from "./berthToolbarActions";

const styles = {
	toolbarRTL: {
		height: 55,
		justifyContent: "center",
		paddingRight: 12
	},
	fabRTL: {
		marginLeft: "auto",
		display: "flex",
		alignItems: "center"
	}
};

const propTypes = {
	canEdit: PropTypes.bool,
	assignments: PropTypes.array,
	closeBerthMap: PropTypes.func.isRequired,
	editAssignment: PropTypes.func.isRequired,
	map: PropTypes.object.isRequired,
	view: PropTypes.object.isRequired,
	openBerthMap: PropTypes.func.isRequired,
	openEventForm: PropTypes.func.isRequired,
	setDay: PropTypes.func.isRequired,
	mapFeedIds: PropTypes.array,
	mapInclusionZone: PropTypes.object,
	startMapStreams: PropTypes.func.isRequired,
	stopMapStreams: PropTypes.func.isRequired,
	updateBerthView: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	assignments: [],
	mapFeedIds: [],
	mapInclusionZone: {}
};

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
	return (
		<AppBar position="relative" color="default" style={{ zIndex: 100 }}>
			<Toolbar
				style={dir == "rtl" ? styles.toolbarRTL : {
					height: 55,
					justifyContent: "center",
					paddingLeft: 12
				}}
			>
				<div
					style={dir == "rtl" ? styles.fabRTL : { marginRight: "auto", display: "flex", alignItems: "center" }}
				>
					<Fab onClick={() => dispatch(openEventForm())} disabled={!canEdit} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="body1" style={dir == "rtl" ? { marginRight: "1rem" } : { marginLeft: "1rem" }}>
						<Translate value="berthToolbar.newEvent" />
					</Typography>
				</div>

				{/* hide search bar on daily agenda */}
				{view.page === "schedule" &&
					<div style={dir == "rtl" ? { width: 300, marginLeft: "auto" } : { width: 300, marginRight: "auto" }}>
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
					style={dir == "rtl" ? { width: "180px", marginLeft: "12px" } : { width: "180px", marginRight: "12px" }}
				>
					{view.page === "schedule" ? <EventNote style={dir == "rtl" ? { marginLeft: 6 } : { marginRight: 6 }} /> : <InsertInvitation style={dir == "rtl" ? { marginLeft: 6 } : { marginRight: 6 }} />}
					{view.page === "schedule" ? getTranslation("berthToolbar.btnLabel.dailyAgendaList") : getTranslation("berthToolbar.btnLabel.berthSchedule")}
				</Button>
				<Button
					onClick={map.open ? closeMap : openMap}
					variant="contained"
					color="primary"
				>
					<Map style={dir == "rtl" ? { marginLeft: 6 } : { marginRight: 6 }} />
					{map.open ? getTranslation("berthToolbar.btnLabel.hideMap") : getTranslation("berthToolbar.btnLabel.showMap")}
				</Button>
			</Toolbar>
		</AppBar>
	);
};

BerthToolbar.propTypes = propTypes;
BerthToolbar.defaultProps = defaultProps;

export default memo(BerthToolbar);
