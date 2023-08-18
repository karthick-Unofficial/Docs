const rtlLocales = ["ar", "ar_kw"];

export function getDir(state) {
	return rtlLocales.includes(state.i18n.locale) ? "rtl" : "ltr";
}

export function getCultureCode(state) {
	switch (state.i18n.locale) {
		case "ar":
			return "ar-EG";
		case "ar_kw":
			return "ar-KW";
		case "en":
			return "en-US";
		default:
			return "en-US";
	}
}
