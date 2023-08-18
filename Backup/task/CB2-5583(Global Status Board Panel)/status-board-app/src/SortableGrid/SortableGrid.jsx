import React, { useRef, useState, useEffect, useCallback } from "react";
import draftToHtml from "draftjs-to-html";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

import StatusCard from "orion-components/SharedComponents/StatusCard/StatusCard";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { updatePersistedState } from "./sortableGridActions";


const SortableItem = SortableElement(({ sortIndex, card, setEditingMode, disableControls, userCanEdit, userCanShare, dir, locale }) =>
	<li className={"grid-list-item type-" + card.data[0].type}>
		<StatusCard
			key={card.id}
			index={sortIndex}
			card={card}
			setEditingMode={setEditingMode}
			disableControls={disableControls}
			userCanEdit={userCanEdit}
			userCanShare={userCanShare}
			dir={dir}
			locale={locale}
		/>
	</li>
);

const SortableList = SortableContainer(({ children }) => {
	return (
		<ul className="grid-list-wrapper">
			{children}
		</ul>
	);
});

const SortableGrid = () => {

	const dispatch = useDispatch();

	const statusCards = useSelector(state => state.statusCards);
	const session = useSelector(state => state.session);

	let { statusCardLayout } = useSelector(state => state.appState.persisted);
	const userCanEdit = session.user.profile.applications
		&& session.user.profile.applications.find(app => app.appId === "status-board-app")
		&& session.user.profile.applications.find(app => app.appId === "status-board-app").permissions
		&& session.user.profile.applications.find(app => app.appId === "status-board-app").permissions.includes("manage");
	const userCanShare = session.user.profile.applications
		&& session.user.profile.applications.find(app => app.appId === "status-board-app")
		&& session.user.profile.applications.find(app => app.appId === "status-board-app").permissions
		&& session.user.profile.applications.find(app => app.appId === "status-board-app").permissions.includes("share");
	// clean up incompatible layout state values
	if (typeof statusCardLayout === "undefined" || statusCardLayout.layout === null || !(Array.isArray(statusCardLayout.layout)) || statusCardLayout.layout.length === 0) {
		statusCardLayout = { layout: statusCards.cards.map(card => card.id) };
	}
	const primaryOpen = useSelector(state => state.appState.contextPanel.contextPanelData.primaryOpen);
	const persistedLayout = statusCardLayout;
	const orgId = useSelector(state => state.session.user.profile.orgId);
	const searchValue = useSelector(state => state.statusCards.searchValue);
	const orgFilters = useSelector(state => state.statusCards.orgFilters);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	const [items, setItems] = useState(statusCards.cards);
	const [editing, setEditing] = useState(false);
	const [layout, setLayout] = useState(persistedLayout.layout);
	const ref = useRef(null);

	const sortCards = useCallback(() => {
		const filteredCards = statusCards.cards
			.filter(card => {
				if (!orgFilters.length) { return true; }

				if (orgFilters.includes(card.ownerOrg)) {
					return true;
				}
				return false;
			})
			.filter(card => {
				if (!searchValue) { return true; }
				const lowerCardName = card.name.toLowerCase();
				const lowerSearch = searchValue.toLowerCase();

				const data = card.data[0];

				if (lowerCardName.includes(lowerSearch)) {
					return true;
				}
				else if (data.type === "text") {
					const html = draftToHtml(data.body);

					if (html.includes(lowerSearch)) {
						return true;
					}
				}
				return false;
			});

		let sortedCards = [];
		const newCards = [];
		filteredCards.forEach(function (card) {
			const cardIndex = layout.indexOf(card.id);
			if (cardIndex === -1) {
				newCards.push(card);
			}
			else {
				sortedCards[layout.indexOf(card.id)] = card;
			}
		});

		sortedCards = [...sortedCards, ...newCards];
		sortedCards = sortedCards.filter(card => !(typeof card === "undefined"));
		setItems(sortedCards);
	}, [layout, orgFilters, searchValue, statusCards.cards]);

	useEffect(() => {
		//Layout updated, need to re-sort
		sortCards();
	}, [layout, sortCards]);

	useEffect(() => {
		//PersistedLayout updated, need to update component state
		setLayout(persistedLayout.layout);
	}, [persistedLayout]);

	useEffect(() => {
		//StatusCards or filters updated, need to re-sort
		sortCards();
	}, [statusCards, searchValue, orgFilters, sortCards]);

	const setEditingMode = editMode => {
		setEditing(editMode);
	};

	const handleCardChanges = (layout) => {
		/* There are multiple ways to set up rules for managing layout across adds/deletes/searches
				For now, we'll update layout to match the actively displayed cards */
		// remove deleted cards from layout
		const cardKeys = items.map(({ id }) => id);
		const revisedLayout = layout.filter(key => cardKeys.includes(key));
		// add new cards to layout
		const newKeys = cardKeys.filter(key => !revisedLayout.includes(key));
		return [...revisedLayout, ...newKeys];
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {
		const newLayout = handleCardChanges(arrayMove(layout, oldIndex, newIndex));

		//Optimistically update layout
		setLayout(newLayout);

		//Update layout in persisted state
		dispatch(updatePersistedState("status-board-app", "statusCardLayout", { layout: newLayout }));
	};

	const shouldCancelStart = (e) => {
		// Cancel sorting when clicking card buttons
		if (e.target.tagName.toLowerCase() === "button") {
			return true; // Return true to cancel sorting
		}
		// Cancel sorting when clicking card content links (should that get added)
		if (e.target.tagName.toLowerCase() === "a") {
			return true;
		}
	};

	return (
		<div
			ref={ref}
			className={dir == "rtl" ? (primaryOpen ? "sidebarRTL-open" : "sidebarRTL-closed") : (primaryOpen ? "sidebar-open" : "sidebar-closed")}
			style={{
				position: "absolute",
				padding: "15px 30px 30px 30px",
				height: "93%",
				top: "60px",
				bottom: "10px",
				overflow: "auto"
			}}
		>
			<div className="grid-list-container">
				<SortableList items={items}
					onSortEnd={onSortEnd}
					shouldCancelStart={shouldCancelStart}
					axis="xy">
					{items.map((card, index) => (
						<SortableItem
							key={`item-${card.id}`}
							index={index}
							sortIndex={index}
							card={card}
							setEditingMode={setEditingMode}
							disableControls={orgId !== card.ownerOrg}
							userCanEdit={userCanEdit}
							userCanShare={userCanShare}
							dir={dir}
							locale={locale}
						/>
					))}
				</SortableList>

			</div>
		</div>
	);
};

export default SortableGrid;
