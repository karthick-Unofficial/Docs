import React, { Fragment, useState, useEffect } from "react";

import { ContextPanel } from "orion-components/ContextPanel";
import { Button, Typography, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { withStyles } from "@mui/styles";

import _ from "lodash";
import moment from "moment";
import $ from "jquery";

import { SearchField, Collection, CollectionItem } from "orion-components/CBComponents";
import CreateList from "./CreateList/CreateList";
import CategoryManager from "./CategoryManager/CategoryManager.jsx";
import { Translate, getTranslation } from "orion-components/i18n";

import {
	userFeedsSelector,
	feedDataSelector
} from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { useDispatch, useSelector } from "react-redux";

import { openDialog } from "orion-components/AppState/Actions";
import { getListCategory } from "orion-components/GlobalData/Actions";
import { setPinnedLists } from "./listPanelActions";

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

const ListPanel = ({
	classes
}) => {

	const user = useSelector(state => state.session.user.profile);
	const canCreate = useSelector(state => userFeedsSelector(state).some(feed => {
		return feed && feed.canView && feed.entityType === "list" && feed.ownerOrg === user.orgId
			&& user.integrations.find(int => int.intId === feed.feedId)
			&& user.integrations.find(int => int.intId === feed.feedId).permissions
			&& user.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	}));
	const listsApp = user.applications.find(app => app.appId === "lists-app");
	const canManageCategories = user && listsApp && listsApp.permissions
		&& listsApp.permissions.includes("manage");
	const listFeeds = useSelector(state => _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (feed && feed.entityType === "list");
			}
		), "feedId"));
	const pinnedLists = useSelector(state => state.appState.persisted.pinnedLists || {});
	let lists = {};
	const globalData = useSelector(state => {
		if (state.globalData) {
			listFeeds.forEach(feed => {
				lists = _.merge(lists, (_.cloneDeep(feedDataSelector(state, { feedId: feed })) || {}));
			});
			lists = _.pickBy(
				lists,
				list => list.name && !list.deleted && !list.targetId && !list.targetType
			);
		}
	});

	const categories = useSelector(state => state.globalData.listCategories.data);
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));

	const [searchValue, setSearchValue] = useState("");
	const dispatch = useDispatch();

	const getListCategories = () => {
		if (lists) {
			const listCategoriesToGet = {};
			Object.values(lists).forEach(list => {
				if (list.category && !listCategoriesToGet[list.category] && !categories[list.category]) {
					listCategoriesToGet[list.category] = true;
				}
			});
			Object.keys(listCategoriesToGet).forEach(category => {
				dispatch(getListCategory(category));
			});
		}
	};

	useEffect(() => {
		getListCategories();
	}, [lists]);

	const handleUpdateSearch = event => {
		const searchValue = event.target.value;
		setSearchValue(searchValue);
	};

	const handleClearSearch = () => {
		setSearchValue("");
	};

	const handleSelectList = item => {
		//const { setPinnedLists, pinnedLists } = props;
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
		dispatch(setPinnedLists(newPinnedLists));
	};

	const receiveListCategory = (dir, category, lists, shared) => {

		// Return whether or not a collection contains a selected item
		const isCollectionSelected = (items) => {
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

		const items = !category ? _.pickBy(lists, list => !list.category) : _.pickBy(lists, list => list.category === category.id);
		const collectionKey = `${!category ? "uncategorized-" : category.id}-${shared ? "shared" : "owned"}`;
		const primaryText = !category ? getTranslation("listPanel.main.uncategorized") : category.name;

		// Filter items by search
		const filteredItems = _.filter(_.values(items), item => {
			return item.name.toLowerCase().includes(searchValue.toLowerCase());
		});

		if (_.size(filteredItems) > 0) {
			return (
				<Collection
					key={collectionKey}
					primaryText={primaryText}
					secondaryText={`${_.size(filteredItems)} ${_.size(filteredItems) === 1 ? getTranslation("listPanel.main.list") : getTranslation("listPanel.main.lists")}`}
					children={filteredItems.map(item => {
						return (
							<CollectionItem
								key={item.id}
								item={item}
								primaryText={item.name}
								secondaryText={
									!item.rows ?
										getTranslation("listPanel.main.noItems") :
										`${item.rows.length} ${item.rows.length === 1 ? getTranslation("listPanel.main.item") : getTranslation("listPanel.main.items")}`
								}
								handleSelect={handleSelectList}
								selected={
									Object.keys(pinnedLists).includes(item.id) &&
									pinnedLists[item.id].selected
								}
								dir={dir}
							/>
						);
					})}
					handleSelect={handleSelectList}
					childSelected={isCollectionSelected(filteredItems)}
					dir={dir}
				/>
			);
		}
	};

	const ListsApp = user.applications.find(application => {
		return application.appId === "lists-app";
	});
	const canEdit = ListsApp.permissions.includes("manage");
	const isMobile = $(window).width() <= 1023;

	const styles = {
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
		empty: {
			color: "#828283",
			display: "flex",
			justifyContent: "center",
			textAlign: "center",
			alignItems: "center"
		},
		newList: {
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		}
	};

	const ownedLists = _.pickBy(lists, list => list.owner === user.id);
	const sharedLists = _.pickBy(lists, list => list.owner !== user.id);

	const mobileToggle = {
		visible: Boolean(isMobile),
		closeLabel: getTranslation("listPanel.main.showPinned"),
		openLabel: getTranslation("listPanel.main.showPanel")
	};
	return (
		<ContextPanel className="list-panel" mobileToggle={mobileToggle} dir={dir}>
			<div className="list-panel-wrapper">
				<div className="list-panel-controls" style={styles.controls}>
					<Fab
						onClick={() => dispatch(openDialog("createList"))}
						disabled={!canCreate}
						color="primary"
						size="small"
					>
						<Add />
					</Fab>
					<p className="cb-font-b2" style={styles.newList}>
						<Translate value="listPanel.main.newList" />
					</p>
					{canManageCategories &&
						<Button
							variant="text"
							onClick={() => dispatch(openDialog("categoryManager"))}
							className={dir === "rtl" ? classes.textRTL : classes.text}
							color="primary"
						>
							<Translate value="listPanel.main.manage" />
						</Button>
					}

				</div>
				{_.size(lists) ? (
					<div className="list-panel-contents">
						<SearchField
							value={searchValue}
							placeholder={getTranslation("listPanel.main.fieldLabel.searchList")}
							handleChange={handleUpdateSearch}
							handleClear={handleClearSearch}
							dir={dir}
						/>
						<div className="lists-wrapper">
							<Typography variant="h6"><Translate value="listPanel.main.myLists" /></Typography>
							{_.map(categories, category =>
								receiveListCategory(dir, category, ownedLists)
							)}
							{receiveListCategory(dir, null, ownedLists)}
							<Typography variant="h6"><Translate value="listPanel.main.listsShared" /></Typography>
							{_.map(categories, category =>
								receiveListCategory(dir, category, sharedLists, true)
							)}
							{receiveListCategory(dir, null, sharedLists, true)}
						</div>
					</div>
				) : (
					<div style={{ ...styles.contents, ...styles.empty }}>
						<Translate value="listPanel.main.clickToCreate" />
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
};

export default withStyles(styles)(ListPanel);
