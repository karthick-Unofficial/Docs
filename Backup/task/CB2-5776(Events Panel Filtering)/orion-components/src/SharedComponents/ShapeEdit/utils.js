import data from "./sprites.json";

export const getSymbols = (map, icons) => {
	const collections = {
		Basic: []
	};
	const dataKeys = Object.keys(data);
	const keys = icons.keys();
	const names = keys.map((key) => key.slice(key.indexOf("/") + 1, key.lastIndexOf(".")));
	const symbols = [];
	keys.forEach((key, index) => {
		const name = names[index];
		// Check that the image has an object in the sprite json, that the map has the image and that the image is being used for
		// point creation
		if (dataKeys.includes(name) && map.hasImage(name) && data[name].forPoints) {
			const spriteData = data[name];
			const symbol = {
				path: key.slice(key.indexOf("/")),
				keywords: data[name].keywords ? data[name].keywords : [],
				file: icons(key),
				name,
				...spriteData
			};
			symbols.push(symbol);
		}
	});
	// Push the symbol into the correct collection of symbols. Defaults to 'Basic' collection
	symbols.forEach((symbol) => {
		if (symbol.group) {
			if (collections[symbol.group]) {
				collections[symbol.group].push(symbol);
			} else collections[symbol.group] = [symbol];
		} else collections["Basic"].push(symbol);
	});
	return collections;
};
