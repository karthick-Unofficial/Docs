import { setLocale, loadTranslations, I18n } from "react-redux-i18n";
import { supportedLocales, fallbackLocale } from "../Config/i18n";
import { translationService } from "client-app-core";
import _ from "lodash";

export function initI18n(appId, store) {
	return dispatch => {
		if (_.isEmpty(store.i18n)) {
			dispatch(setLocaleWithFallback());
		}
		return new Promise((resolve, reject) => {
			translationService.loadTranslations(appId, (err, response) => {
				if (err) {
					// console.log("translationServiceErr", err);
				} else {
					dispatch(loadTranslations(response.translations));
					resolve();
				}
			});
		});
	};
}

export function setLocaleWithFallback(desiredLocale) {
	const browserLocale = navigator.language.split("-");
	const finalLocale = Object.keys(supportedLocales).includes(desiredLocale)
		? desiredLocale : Object.keys(supportedLocales).includes(browserLocale[0]) ? browserLocale[0] : fallbackLocale;
	return dispatch => dispatch(setLocale(finalLocale));
}

export function getTranslation(code, count, primaryValue, secondaryValue) {
	return I18n.t(code, {
		count: (count != undefined ? count : ""),
		primaryValue: (primaryValue != undefined ? primaryValue : ""),
		secondaryValue: (secondaryValue != undefined ? secondaryValue : "")
	});
}

export function getLocalize(code, format) {
	return I18n.l(code, {
		dateFormat: (format != undefined ? format : "date.min")
	});
}