import _ from "lodash";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Container } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import ExerciseContainer from "../../shared/components/ExerciseContainer";
import HeaderContainer from "../../shared/components/HeaderContainer";
import { SearchField } from "orion-components/CBComponents";
import { timeConversion } from "client-app-core";
import { makeStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { renderToStaticMarkup } from "react-dom/server";

const useStyles = makeStyles({
	flexContainer: {
		display: "flex",
		flexDirection: "column",
		flexWrap: "wrap",
		marginBottom: 23
	},
	flexContainerHorizontal: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	buttonStart: {
		minWidth: "163px",
		minHeight: "41"
	},
	buttonDelete: {
		fontSize: 16,
		marginTop: 20,
		marginLeft: 0,
		textTransform: "none",
		backgroundColor: "transparent"
	},
	paginationRowInput: {
		fontSize: 12
	},
	buttonDeleteRTL: {
		fontSize: 16,
		marginTop: 20,
		marginRight: 0,
		textTransform: "none",
		backgroundColor: "transparent"
	}
});

const useCheckBoxStyles = makeStyles(() => ({
	root: {
		color: "#828283",
		"&$checked": {
			color: "#4eb5f3"
		}
	},
	checked: {},
	disabled: {
		opacity: 0.5
	}
}));

const propTypes = {
	canManage: PropTypes.bool.isRequired,
	librarySessions: PropTypes.object.isRequired,
	loadExistingSession: PropTypes.func.isRequired,
	deleteExistingSessions: PropTypes.func.isRequired,
	users: PropTypes.object
};

const SessionLibrary = ({ canManage, librarySessions, users, loadExistingSession, deleteExistingSessions }) => {
	const classes = useStyles();
	const checkBoxclasses = useCheckBoxStyles();

	const [searchValue, setSearchValue] = useState("");
	const [pageSize, setPageSize] = useState(25);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(0);
	const [sessions, setSessions] = useState([]);
	const [sessionsSelected, setSessionsSelected] = useState([]);
	const [allSessionsSelected, setAllSessionsSelected] = useState(false);

	const handleSearch = (event) => {
		const valueSearch = event ? event.target.value : "";
		setSearchValue(valueSearch);
	};

	useEffect(() => {
		let filteredSessions;
		if (!searchValue || !(searchValue.trim())) {
			filteredSessions = _.values(librarySessions);
		}
		else {
			filteredSessions = _.values(librarySessions).filter((val) => {
				return val.baseSimName.toLowerCase().includes(searchValue.toLowerCase());
			});
		}

		const sortedSessions = _.orderBy(filteredSessions, "createdDate", "desc");

		const paginatedSessions = _.take(_.drop(sortedSessions, pageSize * page), pageSize);
		setTotalCount(filteredSessions.length);
		setSessions(paginatedSessions);
		if ((page * pageSize) + 1 > filteredSessions.length) {
			if (filteredSessions.length === 0) {
				if (page > 0) {
					setPage(0);
				}
			} else {
				setPage(Math.ceil(filteredSessions.length / pageSize) - 1);
			}
		}
	}, [librarySessions, searchValue, pageSize, page]);

	useEffect(() => {
		if (sessionsSelected.length === sessions.length && sessions.length > 0) {
			setAllSessionsSelected(true);
		}
		else {
			setAllSessionsSelected(false);
		}
	}, [sessions, sessionsSelected]);

	useEffect(() => {
		setSessionsSelected([]);
	}, [sessions]);

	const sessionSelectionChangeHandler = (event) => {
		if (event.target.checked) {
			setSessionsSelected([...sessionsSelected, event.target.name]);
		} else {
			const newSessionsSelected = [...sessionsSelected];
			const index = newSessionsSelected.indexOf(event.target.name);
			if (index > -1) {
				newSessionsSelected.splice(index, 1);
				setSessionsSelected(newSessionsSelected);
			}
		}
	};

	const deleteSessionsHandler = () => {
		//Check if session is selected else display message.
		if (sessionsSelected.length > 0) {
			deleteExistingSessions(sessionsSelected);
			setSessionsSelected([]);
		} else {
			//todo: display Message as "select atleast 1 existing session".
			console.log("select atleast 1 existing session for deletion.");
		}
	};

	const selectAllSessions = (event) => {
		let tempSessionSelectedArray = [];
		if (event.target.checked) {
			sessions.forEach(sess => {
				tempSessionSelectedArray.push(sess.id);
			});
		}
		setSessionsSelected(tempSessionSelectedArray);
	};

	const placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	return (
		<Container className={classes.flexContainer}>
			<HeaderContainer
				headerTitle={<Translate value="tableopsessionList.sessionLibrary.title" />}
				headerDescription={<Translate value="tableopsessionList.sessionLibrary.desc" />}
				dir={dir}>
			</HeaderContainer>

			<ExerciseContainer headerTitle="" headerDescription="" dir={dir}>
				<Container className={classes.flexContainer}>
					<Container className={classes.flexContainerHorizontal}>
						<Button onClick={() => deleteSessionsHandler()} disableTouchRipple={true}
							className={dir == "rtl" ? classes.buttonDeleteRTL : classes.buttonDelete}
							style={{ visibility: (sessionsSelected.length > 0) ? "visible" : "hidden" }} color="primary">
							<Translate value="tableopsessionList.sessionLibrary.delete" />
						</Button>
						<div style={{ width: 223 }}>
							<SearchField
								value={searchValue}
								placeholder={placeholderConverter("tableopsessionList.sessionLibrary.search")}
								handleChange={handleSearch}
								handleClear={() => handleSearch("")}
								dir={dir}
							/>
						</div>
					</Container>
					<TableContainer>
						<Table size="small" aria-label="a dense table">
							<TableHead>
								<TableRow>
									<TableCell padding="checkbox"><Checkbox name="Select All" value="Select All"
										checked={allSessionsSelected} color="default" onChange={selectAllSessions}
										classes={{
											root: checkBoxclasses.root,
											checked: checkBoxclasses.checked,
											disabled: checkBoxclasses.disabled
										}} /></TableCell>
									<TableCell align="left"><Translate value="tableopsessionList.sessionLibrary.Name" /></TableCell>
									<TableCell align="left"><Translate value="tableopsessionList.sessionLibrary.status" /></TableCell>
									<TableCell align="left"><Translate value="tableopsessionList.sessionLibrary.Date" />&nbsp;<Translate value="tableopsessionList.sessionLibrary.created" /></TableCell>
									<TableCell align="left"> <Translate value="tableopsessionList.sessionLibrary.Created" />&nbsp;<Translate value="tableopsessionList.sessionLibrary.by" /></TableCell>
									<TableCell align="left"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sessions.map(sess => (
									<TableRow key={sess.id}>
										<TableCell padding="checkbox">
											<Checkbox
												checked={sessionsSelected.includes(sess.id)} onChange={sessionSelectionChangeHandler} name={sess.id} value={sess.id}
												color="default"
												classes={{
													root: checkBoxclasses.root,
													checked: checkBoxclasses.checked,
													disabled: checkBoxclasses.disabled
												}}
											/>

										</TableCell>
										<TableCell align="left">{sess.baseSimName}</TableCell>
										<TableCell align="left">{sess.status}</TableCell>
										<TableCell align="left">{`${timeConversion.convertToUserTime(sess.createdDate, "full_12-hour")}`}</TableCell>
										<TableCell align="left">{users[sess.createdBy].name}</TableCell>
										<TableCell scope="sess.id">
											{canManage &&
												<Button className={classes.buttonStart} color="primary" variant="contained" onClick={() => loadExistingSession(sess)}>
													<Translate value="tableopsessionList.sessionLibrary.Start" /></Button>
											}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TablePagination
										colSpan={6}
										count={totalCount}
										page={page}
										onChangePage={(e, newPage) => setPage(newPage)}
										rowsPerPage={pageSize}
										onChangeRowsPerPage={(e) => setPageSize(parseInt(e.target.value, 10))}
										classes={{
											input: classes.paginationRowInput
										}}
									/>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</Container>
			</ExerciseContainer>
		</Container>
	);
};

SessionLibrary.propTypes = propTypes;
export default SessionLibrary;