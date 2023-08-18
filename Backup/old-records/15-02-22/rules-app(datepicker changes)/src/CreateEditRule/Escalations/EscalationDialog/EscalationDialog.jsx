import React, { Component } from "react";
import { eventService } from "client-app-core";

//Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, {ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

class EscalationDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingEvents: false,
			events: [],
			selectedEvent: [],
			searchText: ""
		};
	}

	componentDidMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
		eventService.getAllTemplates((err, result) => {
			if(result){
				this.setState({
					events: result,
					loadingEvents: true
				});
			} else {
				console.log(err);
			}
		});
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	// Enter to submit
	_handleKeyDown = (event) => {
		if (event.key === "Enter" && this.props.isOpen) {
			this.handleSaveClick();
		}
	}

	handleSaveClick = () => {
		this.props.addEscalation(this.state.selectedEvent);
		this.setState({
			selectedEvent: {},
			searchText: ""
		});
		this.props.closeDialog();
	}

	handleCancelClick = () => {
		this.setState({
			selectedEvent: {},
			searchText: ""
		});
		this.props.closeDialog();
	}

	handleSelect = (event) => {
		this.setState({
			selectedEvent: event
		});
	}

	handleTextChange = (event) => {
		this.setState({
			searchText: event.target.value
		});
	}

	eraseInputValue = () => {
		this.setState({
			searchText: ""
		});
	}

	placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	render() {
		const { 
			isOpen
		} = this.props;

		const isMobile = window.matchMedia("(max-width: 600px)").matches;

		const buttonStyles = isMobile
			? {
				fontSize: "13px"
			}
			: {};

		const isQuerying = arr => {
			for(const key in arr) {
				if(arr.hasOwnProperty(key))
					return false;
			}
			return true;
		};

		const hasEvents = arr => {
			if(arr.length > 0) {
				return true;
			}
			return false;
		};

		const userEvents = this.state.events;

		const sortArr = (arr) => {
			return arr.sort((a, b) => {
				const aName = a.name.toLowerCase();
				const bName = b.name.toLowerCase();
				if (aName < bName)
					return -1;
				if (aName > bName)
					return 1;
				return 0;
			});
		};

		const escalationsAddActions = [
			<FlatButton
				style={buttonStyles}
				label={<Translate value="createEditRule.escalations.escalationDialog.cancel"/>}
				onClick={this.handleCancelClick}
				primary={true}
			/>,
			<FlatButton
				style={buttonStyles}
				label={<Translate value="createEditRule.escalations.escalationDialog.add"/>}
				onClick={() => this.handleSaveClick()}
				primary={true}
			/>
		];

		const escalationCancelActions = [
			<FlatButton
				style={buttonStyles}
				label={<Translate value="createEditRule.escalations.escalationDialog.cancel"/>}
				onClick={this.handleCancelClick}
				primary={true}
			/>
		];

		const searchedEvents = userEvents.filter(event => {
			return this.state.searchText === "" || _.includes(event.name.toLowerCase(), this.state.searchText.toLowerCase());
		});

		let renderedEvents;

		if (!isQuerying(userEvents)) {
			sortArr(searchedEvents);
			renderedEvents = searchedEvents.map((event) => {
				return ( 
					<ListItem 
						className={`${this.state.selectedEvent.id === event.id ? "selected": "unselected"}`}
						key={event.id}
						style={{backgroundColor: "#41454A"}}
						primaryText={event.name}
						onClick={() => this.handleSelect(event)}
					/>
				);
			});
		}

		const targetRowRenderer = ({
			key,
			index,
			style
		}) => {
			return (
				<div key={key} style={style}>
					{renderedEvents[index]}
				</div>
			);
		};

		return (
			<React.Fragment>
				<Dialog
					model={true}
					paperClassName='rule-dialog'
					open={isOpen}
					onRequestClose={this.handleCancelClick}
					actions={hasEvents(userEvents) ? escalationsAddActions : escalationCancelActions}
				>
					{!this.state.loadingEvents
						? <div className="circular-progress">
							<CircularProgress size={60} thickness={5} />
						</div>
						: hasEvents(userEvents) ?	
							<List
								className='rule-attributes-list'
							>
								<React.Fragment>
									<ErrorBoundary>
										<div className="typeAhead">
											<input
												className="typeAheadFilter"
												type="text"
												placeholder={this.placeholderConverter("createEditRule.escalations.escalationDialog.wantToFind")}
												onChange={this.handleTextChange.bind(this)}
												value={this.state.searchText}
											/>
											{ this.state.searchText ? 
												<button onClick={this.eraseInputValue.bind(this)}>
													<i className="material-icons">cancel</i>
												</button>
												: 
												<i className="material-icons">search</i>
											}
										</div>
									</ErrorBoundary>
									<AutoSizer disableHeight>
										{({ width }) => (
											<VirtList 
												rowCount={userEvents.length}
												authoContainerWidth={true}
												rowHeight={68}
												width={width}
												height={700}
												rowRenderer={targetRowRenderer}
												overscanRowCount={1}
											/>
										)}
									</AutoSizer>
								</React.Fragment>
							</List>
							:
							<p><Translate vale="createEditRule.escalations.escalationDialog.noEventTemp"/></p>
					}						
				</Dialog>
			</React.Fragment>
		);
	}
}

export default EscalationDialog;