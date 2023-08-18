export function getDir(state) {
	return state.i18n.locale === "ar" ? "rtl" : "ltr";
}

export function getCultureCode(state) {
	switch (state.i18n.locale){
		case "ar":
			return "ar-EG";
		case "en":
			return "en-US";
		default:
			return "en-US";
	}
}