export const transformRole = (role) => {
	return role
		.split("-")
		.map((word) => {
			return word[0].toUpperCase() + word.substr(1);
		})
		.join(" ");
};
