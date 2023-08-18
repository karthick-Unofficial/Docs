import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Button, Fab, Toolbar, Typography } from "@material-ui/core";
import SearchSelectField from "../shared/components/SearchSelectField";
import moment from "moment";
import { Add, Map, InsertInvitation, EventNote } from "@material-ui/icons";
import { Translate } from "orion-components/i18n/I18nContainer";

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
	updateBerthView: PropTypes.func.isRequired
};

const defaultProps = {
	assignments: [],
	mapFeedIds: [],
	mapInclusionZone: {}
};

const BerthToolbar = ({
	canEdit,
	assignments,
	editAssignment,
	map,
	view,
	openEventForm,
	setDay,
	mapFeedIds,
	mapInclusionZone,
	startMapStreams,
	stopMapStreams,
	updateBerthView
}) => {
	const initialResults = assignments.map(assignment => {
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
		setDay(moment(result.date));
		editAssignment(result);
	};
	const openMap = () => {
		startMapStreams(mapFeedIds, mapInclusionZone);
	};
	const closeMap = () => {
		stopMapStreams(map.subscriptions);
	};
	const updateView = () => {
		updateBerthView(view.page);
	};
	return (
		<AppBar position="relative" color="default" style={{ zIndex: 100 }}>
			<Toolbar
				style={{
					height: 55,
					justifyContent: "center",
					paddingLeft: 12
				}}
			>
				<div
					style={{ marginRight: "auto", display: "flex", alignItems: "center" }}
				>
					<Fab onClick={openEventForm} disabled={!canEdit} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="body1" style={{ marginLeft: "1rem" }}>
						<Translate value="berthToolbar.newEvent"/>
					</Typography>
				</div>

				{/* hide search bar on daily agenda */}
				{view.page === "schedule" &&
					<div style={{ width: 300, marginRight: "auto" }}>
						<SearchSelectField
							id="assignment-search"
							key="assignment-search"
							value=""
							label={<Translate value="berthToolbar.fieldLabel.search"/>}
							handleSearch={handleSearch}
							handleSelect={handleSelect}
							results={results}
						/>
					</div>
				}
				<Button
					onClick={updateView}
					variant="contained"
					color="primary"
					style={{ width: "180px", marginRight: "12px"}}
				>
					{view.page === "schedule" ? <EventNote style={{ marginRight: 6 }} /> : <InsertInvitation style={{ marginRight: 6 }} />}
					{view.page === "schedule" ? <Translate value="berthToolbar.btnLabel.dailyAgendaList"/> : <Translate value="berthToolbar.btnLabel.berthSchedule"/>}
				</Button>
				<Button
					onClick={map.open ? closeMap : openMap}
					variant="contained"
					color="primary"
				>
					<Map style={{ marginRight: 6 }} />
					{map.open ? <Translate value="berthToolbar.btnLabel.hideMap"/> : <Translate value="berthToolbar.btnLabel.showMap"/>}
				</Button>
			</Toolbar>
		</AppBar>
	);
};

BerthToolbar.propTypes = propTypes;
BerthToolbar.defaultProps = defaultProps;

export default memo(BerthToolbar);
