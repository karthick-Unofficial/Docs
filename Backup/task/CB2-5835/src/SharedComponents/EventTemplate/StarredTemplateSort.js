let lastFavIndex = -1;

export function StarredTemplateSort(items, fields, directions, FavTemplateArr, unShiftItems = {}) {
	const favItems = getFavItems(items, FavTemplateArr);

	//other items that are not starred
	const otherItems = defaultSort(items, FavTemplateArr, fields, directions);

	// Check if the `unShiftItems` object is not empty
	if (Object.keys(unShiftItems).length !== 0) {
		// If it's not empty, add it to the beginning of the `favItems` array
		favItems.unshift(unShiftItems);
	}

	// Marking the `isLastElement` property of the `favItems` array
	lastFavIndex = favItems.length - 1;

	if (favItems.length > 0 && lastFavIndex !== -1) {
		const lastFavItem = favItems[lastFavIndex];
		if (favItems.length - 1 !== 0) {
			favItems[lastFavIndex - 1].isLastElement = false;
		}

		lastFavItem.isLastElement = true;
	}

	return favItems.concat(otherItems);
}

const getFavItems = (items, FavTemplateArr) => {
	const favItems = items
		.filter((item) => {
			if (FavTemplateArr.includes(item.id)) {
				item.isStarred = true;
				return true;
			}
			return false;
		})
		.sort((a, b) => {
			if (a.name > b.name) {
				return 1;
			}
			if (a.name < b.name) {
				return -1;
			}
			return 0;
		});

	return favItems;
};

const defaultSort = (items, FavTemplateArr, fields, directions) => {
	const otherItems = items
		.filter((item) => !FavTemplateArr.includes(item.id))
		.sort((a, b) => {
			for (let i = 0; i < fields.length; i++) {
				const field = fields[i];
				const direction = directions[i] === "asc" ? 1 : -1;
				if (a[field] > b[field]) {
					return direction;
				}
				if (a[field] < b[field]) {
					return -direction;
				}
			}
			return 0;
		});

	return otherItems;
};
