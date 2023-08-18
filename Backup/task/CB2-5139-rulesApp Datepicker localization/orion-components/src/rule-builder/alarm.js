import React from "react";
import _getConditions from "./condition-builder.js";
import { Translate } from "orion-components/i18n/I18nContainer";

const VOWELS = ["a", "e", "i", "o", "u"];
const alarmBuilder = (
	rule,
	collections
) => {
	// -- Alert me when {feed} fires a {subFilter ? subFilter : filter} alarm.
	if (rule.alarmFeeds && rule.alarmFeeds.length > 0) {
		const feed = _getFeed(rule);
		if (!feed || feed === "") {
			return (
				<div id="rule-statement" className="cb-font-b9">
					<Translate value="global.ruleBuilder.alarm.alarmRule"/>
				</div>
			);
		}
		else {
			const filter = _getFilter(rule);
			const article = filter === "" || VOWELS.includes(filter.charAt(0)) ? "an" : "a";
			return (
				<div id="rule-statement" className="cb-font-b9">
					<Translate value="global.ruleBuilder.alarm.alertMe" count={feed} primaryValue={article} secondaryValue={filter}/>
					{_getConditions(rule, collections)}
				</div>
			);
		}
	}
	else {
		return (
			<div id="rule-statement" className="cb-font-b9">
				{_getDefault(rule)}
			</div>
		);
	}
};

const _getDefault = (rule) => {
	// -- use rule statement when alarmFeeds is not available (eg. when viewing the rule rather than creating/editing it)
	if (rule.statement && rule.statement.length > 0) return rule.statement;
	return "";
};
const _getFeed = (rule) => {
	const selectedFeed = rule.alarmFeeds.filter(feed => feed.value === rule.feed)[0];
	if (selectedFeed) {
		return  selectedFeed.label;
	}
	return "";
};

const _getFilter = (rule) => {
	const selectedFeed = rule.alarmFeeds.filter(feed => feed.value === rule.feed)[0];
	if (selectedFeed) {
		const selectedFilter = selectedFeed.filters.filter(filter => filter.value === rule.filter)[0];
		const selectedSubFilter = selectedFilter ? selectedFilter.subFilters.filter(subFilter => subFilter.value === rule.subFilter)[0] : null;

		return selectedSubFilter ? selectedSubFilter.label : (selectedFilter ? selectedFilter.label : "");
	}
	return "";
};

export default alarmBuilder;