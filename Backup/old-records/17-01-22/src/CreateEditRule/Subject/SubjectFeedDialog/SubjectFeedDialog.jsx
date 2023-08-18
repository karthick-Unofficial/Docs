import React, { Component } from "react";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, {ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
const html = document.getElementsByTagName("html")[0];

class SubjectFeedDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFeeds: [],
			searchValue: ""
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

	handleUpdateSearch = value => {
		this.setState({
			searchValue: value
		});
	};

	handleSaveClick = () => {
		const trimmedFeeds = this.state.selectedFeeds.map((feed) => {
			return {
				id: feed.feedId,
				entityType: "feed",
				name: feed.name || feed.feedId,
				feedId: feed.feedId
			};
		});
		this.props.addSubjects(trimmedFeeds);
		this.setState({
			selectedFeeds: []
		});
		document.removeEventListener("keydown", this._handleKeyDown);
		this.props.toggleDialog();
	}

	handleCancelClick = () => {
		this.setState({
			selectedFeeds: []
		});
		document.removeEventListener("keydown", this._handleKeyDown);
		this.props.toggleDialog();
	}

	_capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	}

	handleEntitySelect = (feed) => {
		const tArray = this.state.selectedFeeds;
		const index = tArray.indexOf(feed);
		tArray.indexOf(feed) > -1 ?
			tArray.splice(index, 1)
			:
			tArray.push(feed);
		this.setState({
			selectedFeeds: tArray
		});
	}

	render () {
		const { styles, subject, userTrackFeeds, isOpen} = this.props;
		const { searchValue } = this.state;

		const feedsAddActions = [
			<FlatButton
				style={styles.buttonStyles}
				label='Cancel'
				onClick={this.handleCancelClick}
				primary={true}
			/>,
			<FlatButton
				style={styles.buttonStyles}
				label='Add item(s)'
				onClick={() => this.handleSaveClick()}
				primary={true}
			/>
		];


		const subjectIds = subject.map((feed) => feed.feedId);

		const dialogFeeds = userTrackFeeds.filter((feed) => {
			if (searchValue === "" || feed.name.includes(searchValue)) {
				return !subjectIds.includes(feed.feedId);
			}
		});

		// react-virtualized
		// We are virtualized rendered lists of tracks so they don't slow down the app
		// this is a conditional because the map is a huge hit on performance when the dialog isn't open

		let renderedFeeds;
		if (isOpen) {
			renderedFeeds = dialogFeeds.map((feed) => {
				return (
					<ListItem
						className={`${this.state.selectedFeeds.indexOf(feed) > -1 ? "selected" : "unselected"}`}
						style={styles.listItemStyles}
						key={feed.feedId}
						primaryText={feed.name}
						onClick={() => this.handleEntitySelect(feed)}
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
					{renderedFeeds[index]}
				</div>
			);
		};

		return (
			<Dialog
				paperClassName='rule-dialog'
				open={isOpen}
				onRequestClose={this.handleCancelClick}
				actions={feedsAddActions}
			>
				<List
					className='rule-attributes-list'
				>
					{dialogFeeds.length > 0 ?
						<AutoSizer disableHeight>
							{({ width }) => (
								<VirtList
									rowCount={dialogFeeds.length}
									autoContainerWidth={true}
									rowHeight={68}
									width={width}
									height={700}
									rowRenderer={rowRenderer}
									overscanRowCount={1}
								/>
							)}
						</AutoSizer>
						:
						<p>{`No ${userTrackFeeds.length > 0 && "additional "}feeds available.`}</p>
					}

				</List>
			</Dialog>
		);
	}
}


export default SubjectFeedDialog;