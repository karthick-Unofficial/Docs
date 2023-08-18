import React, { useEffect, useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

// components
import SearchField from "./components/SearchField";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch, Provider, useStore } from "react-redux";
import * as actionCreators from "./subjectDialogActions";

const html = document.getElementsByTagName("html")[0];

const SubjectDialog = ({ addSubjects, toggleDialog, styles, subject, isOpen }) => {
	const dispatch = useDispatch();
	const store = useStore();

	const { typeAheadFilter, queryTracks } = actionCreators;
	const trackList = useSelector(state => state.appState.profilePage.searchResults);
	const isQuerying = useSelector(state => state.appState.profilePage.isQuerying);
	const error = useSelector(state => state.appState.profilePage.queryDialogError);

	const [state, setState] = useState({
		selectedTracks: [],
		mounted: false
	});

	// Enter to submit
	const _handleKeyDown = (event) => {
		if (event.key === "Enter" && isOpen) {
			handleSaveClick();
		}
	};

	useEffect(() => {
		setState(prevState => ({ ...prevState, mounted: true }));
		return () => {
			// Allow background scrolling on dialog close
			html.style.position = "static";
			html.style.width = "auto";
		};
	}, []);

	if (!state.mounted) {
		// Prevent background scrolling when dialog is open.
		html.style.position = "fixed";
		html.style.width = "100%";
		document.addEventListener("keydown", _handleKeyDown);
		setState(prevState => ({ ...prevState, mounted: true }));
	}

	const handleSaveClick = () => {
		const trimmedTracks = state.selectedTracks.map((track) => {
			return {
				id: track.id,
				name: track.entityData.properties.name || track.feedId + track.name,
				feedId: track.feedId
			};
		});
		addSubjects(trimmedTracks);
		setState(prevState => ({ ...prevState, selectedTracks: [] }));
		dispatch(typeAheadFilter(""));
		document.removeEventListener("keydown", _handleKeyDown);
		toggleDialog();
	};

	const handleCancelClick = () => {
		setState(prevState => ({ ...prevState, selectedTracks: [] }));
		dispatch(typeAheadFilter(""));
		document.removeEventListener("keydown", _handleKeyDown);
		toggleDialog();
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	const handleEntitySelect = (track) => {
		const tArray = state.selectedTracks;
		const index = tArray.indexOf(track);
		tArray.indexOf(track) > -1 ?
			tArray.splice(index, 1)
			:
			tArray.push(track);
		setState(prevState => ({ ...prevState, selectedTracks: tArray }));
	};

	const tracksAddActions = [
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.subject.subjectDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.subject.subjectDialog.addItem")}
			onClick={() => handleSaveClick()}
			primary={true}
		/>
	];


	const subjectIds = subject.map((track) => track.id);

	const dialogTracks = trackList.filter((track) => {
		return !subjectIds.includes(track.id);
	});

	// react-virtualized
	// We are virtualized rendered lists of tracks so they don't slow down the app
	// this is a conditional because the map is a huge hit on performance when the dialog isn't open

	let renderedTracks;
	if (isOpen) {
		renderedTracks = dialogTracks.map((track) => {
			return (
				<ListItem
					className={`${state.selectedTracks.indexOf(track) > -1 ? "selected" : "unselected"}`}
					style={styles.listItemStyles}
					key={track.id}
					primaryText={track.entityData.properties.name}
					onClick={() => handleEntitySelect(track)}
				/>
			);
		}
		);
	}

	const rowRenderer = ({
		key,
		index,
		isScrolling,
		isVisible,
		style
	}) => {
		return (
			<div key={key} style={style}>
				{renderedTracks[index]}
			</div>
		);
	};

	return (
		<Dialog
			paperClassName='rule-dialog'
			open={isOpen}
			onRequestClose={handleCancelClick}
			actions={tracksAddActions}
		>
			<List
				className='rule-attributes-list'
			>
				<ErrorBoundary store={store}>
					<SearchField
						width="100%"
						updateSearch={queryTracks}
						className="typeAheadFilter"
						placeholder={getTranslation("createEditRule.subject.subjectDialog.wantToFind")}
					/>
				</ErrorBoundary>
				{isQuerying ?
					<div className="circular-progress">
						<CircularProgress size={60} thickness={5} />
					</div>
					: error ?
						<div className="error-message">
							<p><Translate vlaue="createEditRule.subject.subjectDialog.errorOccured" /></p>
						</div>
						: trackList ? <AutoSizer disableHeight>
							{({ width }) => (
								<VirtList
									rowCount={dialogTracks.length}
									autoContainerWidth={true}
									rowHeight={68}
									width={width}
									height={700}
									rowRenderer={rowRenderer}
									overscanRowCount={1}
								/>
							)}
						</AutoSizer>
							: null
				}

			</List>
		</Dialog >
	);
};


export default SubjectDialog;