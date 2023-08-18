const getAction = ({ type, url }) => {
	let action;
	switch (type) {
		case "external_link":
			action = () => window.open(url, "_blank");
			break;
		default:
			break;
	}
	return action;
};

export default getAction;
