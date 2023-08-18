import React, { Component, Fragment } from "react";

import { ContextPanel } from "orion-components/ContextPanel";
import { Button, Typography, Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

import _ from "lodash";
import moment from "moment";
import $ from "jquery";

import { SearchField } from "orion-components/CBComponents";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import { default as CreateList } from "./CreateList/CreateListContainer";
import { default as CategoryManager } from "./CategoryManager/CategoryManagerContainer";
import { listCategories } from "orion-components/GlobalData/Reducers";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const styles = {
	text: {
		textTransform: "none",
		marginLeft: "auto!important"
	},
	root: {
		color: "#828283"
	},
	textRTL: {
		textTransform: "none",
		marginRight: "auto!important"
	}
};

class ListPanel extends Component {
	constructor(props) {
		super(props);
		this.state = { searchValue: "" };
	}

	componentDidMount() {
		this.getListCategories();
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(prevProps.lists, this.props.lists)) {
			this.getListCategories();
		}
	}

	getListCategories = () => {
		if (this.props.lists) {
			const listCategoriesToGet = {};
			Object.values(this.props.lists).forEach(list => {
				if (list.category && !listCategoriesToGet[list.category] && !this.props.categories[list.category]) {
					listCategoriesToGet[list.category] = true;
				}
			});
			Object.keys(listCategoriesToGet).forEach(category => {
				this.props.getListCategory(category);
			});
		}

	}
	handleUpdateSearch = event => {
		const searchValue = event.target.value;
		this.setState({
			searchValue
		});
	};

	handleClearSearch = () => {
		this.setState({ searchValue: "" });
	};

	handleSelectList = item => {
		const { setPinnedLists, pinnedLists } = this.props;
		let newPinnedLists = { ...pinnedLists };

		if (pinnedLists[item.id] && pinnedLists[item.id].selected) {
			const list = newPinnedLists[item.id];
			list.selected = false;
			list.order = null;
			list.expanded = false;
		} else if (pinnedLists[item.id] && pinnedLists[item.id].selected) {
			const list = newPinnedLists[item.id];
			list.selected = true;
			list.order = moment().valueOf();
			list.expanded = true;
		} else {
			const newList = {
				[item.id]: {
					id: item.id,
					name: item.name,
					selected: true,
					order: moment().valueOf(),
					expanded: true
				}
			};
			newPinnedLists = { ...newPinnedLists, ...newList };
		}
		setPinnedLists(newPinnedLists);
	};

	getListCategory = (dir, category, lists, shared) => {
		const { pinnedLists } = this.props;
		const { searchValue } = this.state;

		// Return whether or not a collection contains a selected item
		const isCollectionSelected = items => {
			const includedListIds = items.map(item => item.id);
			let isSelected = false;

			for (const id of includedListIds) {
				if (Object.keys(pinnedLists).includes(id) && pinnedLists[id].selected) {
					isSelected = true;
					break;
				}
			}

			return isSelected;
		};

		if (!category) {
			const items = _.pickBy(lists, list => !list.category);
			const filteredItems = _.filter(_.values(items), item => {
				return item.name.toLowerCase().includes(searchValue.toLowerCase());
			});

			if (_.size(filteredItems) > 0) {
				return (
					<Collection
						key={"uncategorized-" + (shared ? "-shared" : "-owned")}
						primaryText={<Translate value="listPanel.main.uncategorized"/>}
						secondaryText={
							_.size(filteredItems) === 1 ? this.placeholderConverter("listPanel.main.list", _.size(filteredItems)) : this.placeholderConverter("listPanel.main.lists", _.size(filteredItems))
						}
						children={filteredItems.map(item => {
							return (
								<CollectionItem
									key={item.id}
									item={item}
									primaryText={item.name}
									secondaryText={
										!item.rows
											? <Translate value="listPanel.main.noItems"/>
											: item.rows.length === 1
												? <Translate value="listPanel.main.oneItem"/>
												: <Translate value="listPanel.main.items" count={item.rows.length}/>
									}
									handleSelect={this.handleSelectList}
									selected={
										Object.keys(pinnedLists).includes(item.id) &&
										pinnedLists[item.id].selected
									}
									dir={dir}
								/>
							);
						})}
						handleSelect={this.handleSelectList}
						selected={isCollectionSelected(filteredItems)}
						dir={dir}
					/>
				);
			}
		} else {
			const items = _.pickBy(lists, list => list.category === category.id);
			const filteredItems = _.filter(_.values(items), item => {
				return item.name.toLowerCase().includes(searchValue.toLowerCase());
			});

			if (_.size(filteredItems) > 0) {
				return (
					<Collection
						key={`${category.id}` + (shared ? "-shared" : "-owned")}
						primaryText={category.name}
						secondaryText={
							_.size(filteredItems) +
							(_.size(filteredItems) === 1 ? this.placeholderConverter("listPanel.main.list") : this.placeholderConverter("listPanel.main.lists"))
						}
						children={filteredItems.map(item => {
							return (
								<CollectionItem
									key={item.id}
									item={item}
									primaryText={item.name}
									secondaryText={
										!item.rows
											? <Translate value="listPanel.main.noItems"/>
											: item.rows.length === 1
												? this.placeholderConverter("listPanel.main.oneItem")
												: this.placeholderConverter("listPanel.main.items", item.rows.length)
									}
									handleSelect={this.handleSelectList}
									selected={
										Object.keys(pinnedLists).includes(item.id) &&
										pinnedLists[item.id].selected
									}
									dir={dir}
								/>
							);
						})}
						handleSelect={this.handleSelectList}
						selected={isCollectionSelected(filteredItems)}
						dir={dir}
					/>
				);
			}
		}
	};
	placeholderConverter = (value, count) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	}
	render() {
		const { lists, categories, user, classes, openDialog, dialog, canCreate, canManageCategories, WavCamOpen, dir } = this.props;
		const { searchValue } = this.state;
		const listsApp = user.applications.find(application => {
			return application.appId === "lists-app";
		});
		const canEdit = listsApp.permissions.includes("manage");

		const isMobile = $(window).width() <= 1023;

		const styles = {
			panelWrapper: {
				height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}`
			},
			controls: {
				display: "flex",
				align: "center",
				alignItems: "center",
				padding: "1rem",
				backgroundColor: "#242426"
			},
			contents: {
				padding: "0.5rem 1rem",
				height: isMobile ? "calc(100% - 120px)" : "calc(100% - 72px)"
			},
			button: {
				marginLeft: "auto",
				color: "#35b7f3",
				cursor: "pointer",
				fontSize: 14
			},
			search: {
				icon: {
					color: "rgba(255, 255, 255, 0.3)",
					fontSize: 24,
					marginLeft: "0.5rem"
				},
				field: { display: "flex", alignItems: "center" }
			},
			lists: {
				wrapper: {
					height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}`,
					overflow: "scroll"
				},
				header: {
					padding: "1rem 0 0.5rem 0"
				}
			},
			empty: {
				color: "#828283",
				display: "flex",
				justifyContent: "center",
				textAlign: "center",
				alignItems: "center"
			}
		};

		const ownedLists = _.pickBy(lists, list => list.owner === user.id);
		const sharedLists = _.pickBy(lists, list => list.owner !== user.id);

		const mobileToggle = {
			visible: Boolean(isMobile),
			closeLabel: <Translate value="listPanel.main.showPinned"/>,
			openLabel: <Translate value="listPanel.main.showPanel"/>
		};
		return (
			<ContextPanel className="list-panel" style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}`}} mobileToggle={mobileToggle} dir={dir}>
				<div className="list-panel-wrapper" style={styles.panelWrapper}>
					<div className="list-panel-controls" style={styles.controls}>
						<Fab
							onClick={() => openDialog("createList")}
							disabled={!canCreate}
							color="primary"
							size="small"
							style={{ height: 30, width: 30, minHeight: "unset", borderRadius: "50px", backgroundColor: "#3f51b5", color: "#fff" }}
						>
							<Add />
						</Fab>
						<p className="cb-font-b2" style={dir == "rtl" ? { marginRight: "1rem" } : { marginLeft: "1rem" }}>
							<Translate value="listPanel.main.newList"/>
						</p>
						{canManageCategories && 
							<Button
								variant="text"
								onClick={() => openDialog("categoryManager")}
								className={dir == "rtl" ? classes.textRTL : classes.text}
								color="primary"
							>
								<Translate value="listPanel.main.manage"/>
							</Button>
						}

					</div>
					{_.size(lists) ? (
						<div className="list-panel-contents" style={styles.contents}>
							<SearchField
								value={searchValue}
								placeholder={this.placeholderConverter("listPanel.main.fieldLabel.searchList")}
								handleChange={this.handleUpdateSearch}
								handleClear={this.handleClearSearch}
								dir={dir}
							/>
							<div className="lists-wrapper" style={styles.lists.wrapper}>
								<Typography variant="h6"><Translate value="listPanel.main.myLists"/></Typography>
								{_.map(categories, category =>
									this.getListCategory(dir, category, ownedLists)
								)}
								{this.getListCategory(dir, null, ownedLists)}
								<Typography variant="h6"><Translate value="listPanel.main.listsShared"/></Typography>
								{_.map(categories, category =>
									this.getListCategory(dir, category, sharedLists, true)
								)}
								{this.getListCategory(dir, null, sharedLists, true)}
							</div>
						</div>
					) : (
						<div style={{ ...styles.contents, ...styles.empty }}>
							<Translate value="listPanel.main.clickToCreate"/>
						</div>
					)}
					{dialog && (
						<Fragment>
							<CategoryManager canEdit={canEdit} />
							<CreateList key="create-list" dialogRef="createList" />
						</Fragment>
					)}
				</div>
			</ContextPanel>
		);
	}
}

export default withStyles(styles)(ListPanel);
