import React, { Component } from "react";

import SearchField from "./SearchField";
import {
	List,
	CircularProgress,
	ListItem,
	Checkbox
} from "material-ui";
import { Dialog as CBDialog } from "orion-components/CBComponents";

import { eventService } from "client-app-core";

import { getIconByTemplate } from "orion-components/SharedComponents";
import debounce from "debounce";
import { getTranslation } from "orion-components/i18n/I18nContainer";

class PinnedItemsDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			querying: false,
			additions: [],
			results: [],
			error: null,
			profileIconTemplates: {}
		};
	}

	componentDidMount = () => {
		const { feeds } = this.props;
		const { profileIconTemplates } = this.state;

		feeds.forEach(feed => {
			profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
		});
		this.setState({ profileIconTemplates: profileIconTemplates });
	}

	handleClosePinDialog = () => {
		this.setState({
			additions: [],
			querying: false,
			error: null,
			results: []
		});
		this.props.closeDialog("pinnedItemDialog");
	};

	handleConfirmPin = () => {
		const { contextId } = this.props;
		const { additions } = this.state;

		eventService.pinEntities(contextId, additions, (err, response) => {
			if (err) console.log(err);

			// Update 'lastModified', cause new pinned items to stream in on event stream object
			eventService.mockUpdateEvent(contextId, (err, response) => {
				if (err) {
					console.log(err);
				}
			});
		});

		this.handleClosePinDialog();
	};

	handleAddItem = item => {
		const { additions } = this.state;

		const addition = {
			id: item.id,
			feedId: item.feedId
		};

		const index = additions.findIndex(addition => {
			return addition.id === item.id;
		});

		if (index === -1) {
			this.setState({ additions: [...additions, addition] });
		} else {
			additions.splice(index, 1);
			this.setState({ additions: additions });
		}
	};

	handleSearch = value => {
		const { contextId } = this.props;
		let queryFinished = false;
		setTimeout(() => {
			if (!queryFinished) {
				this.setState({ querying: true });
			}
		}, 500);

		if (value.length) {
			eventService.queryPinnable(contextId, value, 5, (err, response) => {
				// No matter the response, we don't want to show the progress wheel
				queryFinished = true;
				if (err) {
					this.setState({ error: getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.errorText.errorOcc"), querying: false });
					return;
				}
				if (response instanceof Array && response.length < 1) {
					this.setState({ error: getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.errorText.noItems"), querying: false });
				} else {
					this.setState({
						results: response,
						querying: false,
						error: null
					});
				}
			});
		} else {
			queryFinished = true;
			this.handleClearSearch();
		}
	};

	handleClearSearch = () => {
		this.setState({ results: [], querying: false, error: null });
	};
	
	render() {
		const { dialog, dir } = this.props;
		const { results, querying, error, additions, profileIconTemplates } = this.state;

		const styles = {
			listStyles: {
				backgroundColor: "#41454A",
				marginBottom: ".75rem"
			},
			error: {
				textAlign: "center",
				padding: "10px"
			},
			progress: {
				textAlign: "center",
				padding: "15px 0"
			}
		};

		const handleSearch = debounce(this.handleSearch, 500);

		return (
			<CBDialog
				open={dialog === "pinnedItemDialog"}
				confirm={{ 
					label: getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.confirm"), 
					action: this.handleConfirmPin,
					disabled: !additions.length
				}}
				abort={{ label: getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.cancel"), action: this.handleClosePinDialog }}
				options={{
					onClose: this.handleClosePinDialog,
					maxWidth: "sm"
				}}
				dir={dir}
			>
				<SearchField
					updateSearch={handleSearch}
					handleClear={this.handleClearSearch}
					width="320px"
					placeholder={getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.wantToFind")}
					autoFocus={true}
				/>
				<List>
					{querying ? (
						<div style={styles.progress}>
							<CircularProgress size={60} thickness={5} />
						</div>
					) : error ? (
						<div style={styles.error}>
							<p> {error}</p>
						</div>
					) : results.length ? (
						results.map(result => {
							const props = result.entityData.properties;
							const index = this.state.additions.findIndex(addition => {
								return addition.id === result.id;
							});
							return (
								<ListItem
									id="search-result"
									key={result.id}
									style={styles.listStyles}
									leftAvatar={getIconByTemplate(props.type, result, "2.5rem", profileIconTemplates[result.feedId])}
									rightToggle={
										<Checkbox
											checked={index !== -1}
											onCheck={() => this.handleAddItem(result)}
										/>
									}
									primaryText={props.name}
									secondaryText={props.type}
								/>
							);
						})
					) : null}
				</List>
			</CBDialog>
		);
	}
}

export default PinnedItemsDialog;
