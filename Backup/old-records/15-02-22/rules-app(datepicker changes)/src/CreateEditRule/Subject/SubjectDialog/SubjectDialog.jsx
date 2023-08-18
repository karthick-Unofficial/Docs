import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, {ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

// components
import TypeAheadFilterContainer from "../../../TypeAheadFilter/TypeAheadFilterContainer";
import SearchField from "./components/SearchField";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const html = document.getElementsByTagName("html")[0];

class SubjectDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTracks: []
		};
	}

	UNSAFE_componentWillMount() {
		// Prevent background scrolling when dialog is open.
		html.style.position = "fixed";
		html.style.width = "100%";
		document.addEventListener("keydown", this._handleKeyDown);
	}

	componentWillUnmount() {
		// Allow background scrolling on dialog close
		html.style.position = "static";
		html.style.width = "auto";
	}

// Enter to submit
_handleKeyDown = (event) => {
	if (event.key === "Enter" && this.props.isOpen) {
		this.handleSaveClick();
	}
}

handleSaveClick = () => {
	const trimmedTracks = this.state.selectedTracks.map((track) => {
		return {
			id: track.id,
			name: track.entityData.properties.name || track.feedId + track.name,
			feedId: track.feedId
		};
	});
	this.props.addSubjects(trimmedTracks);
	this.setState({
		selectedTracks: []
	});
	this.props.typeAheadFilter("");
	document.removeEventListener("keydown", this._handleKeyDown);
	this.props.toggleDialog();
}

handleCancelClick = () => {
	this.setState({
		selectedTracks: []
	});
	this.props.typeAheadFilter("");
	document.removeEventListener("keydown", this._handleKeyDown);
	this.props.toggleDialog();
}

_capitalize = (string) => {
	return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

handleEntitySelect = (track) => {
	const tArray = this.state.selectedTracks;
	const index = tArray.indexOf(track);
	tArray.indexOf(track) > -1 ?
		tArray.splice(index, 1)
		:
		tArray.push(track);
	this.setState({
		selectedTracks: tArray
	});
}

placeholderConverter = (value) => {
	const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
	let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
	return placeholderString;
};

render () {
	const { styles, subject, trackList, isQuerying, error, isOpen} = this.props;

	const tracksAddActions = [
		<FlatButton
			style={styles.buttonStyles} 
			label={<Translate value="createEditRule.subject.subjectDialog.cancel"/>}
			onClick={this.handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label={<Translate value="createEditRule.subject.subjectDialog.addItem"/>}
			onClick={() => this.handleSaveClick()}
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
					className={`${this.state.selectedTracks.indexOf(track) > -1 ? "selected" : "unselected"}`}
					style={styles.listItemStyles}
					key={track.id}
					primaryText={track.entityData.properties.name}
					onClick={() => this.handleEntitySelect(track)}
				/>
			);}
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
			onRequestClose={this.handleCancelClick}
			actions={tracksAddActions}
		>
			<List
				className='rule-attributes-list'
			>
				<ErrorBoundary>
					<SearchField
						width="100%"
						updateSearch={this.props.queryTracks}
						className="typeAheadFilter"
						placeholder={this.placeholderConverter("createEditRule.subject.subjectDialog.wantToFind")}
					/>
				</ErrorBoundary>
				{isQuerying ? 
					<div className="circular-progress">
						<CircularProgress size={60} thickness={5} />
					</div>
					: error ?
						<div className="error-message">
							<p><Translate vlaue="createEditRule.subject.subjectDialog.errorOccured"/></p>
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
		</Dialog>
	);
}
}


export default SubjectDialog;