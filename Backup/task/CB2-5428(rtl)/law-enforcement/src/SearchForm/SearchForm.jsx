import React, { Fragment, memo } from "react";
import PersonSearch from "./Forms/PersonSearch";
import { Button, Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import {
	searchFormReset,
	searchFieldUpdated,
	saveSearch,
	search
} from "./searchFormActions";

const SearchForm = () => {
	const State = useSelector(state => state);
	const { type } = useSelector(state => state.searchForm);
	const values = useSelector(state => state.searchForm[type]);
	const canSave = State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app")
		&& State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions
		&& State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions.includes("manage");
	const dir = useSelector(state => getDir(state));
	const dispatch = useDispatch();

	const handleSearchFieldUpdated = (name, value) => {
		dispatch(searchFieldUpdated(name, value));
	};
	let form;
	switch (type) {
		case "person":
			form = (
				<PersonSearch
					search={search}
					searchFormReset={searchFormReset}
					searchFieldUpdated={handleSearchFieldUpdated}
					values={values}
					dir={dir}
				/>
			);
			break;
		default:
			form = <Fragment />;
			break;
	}
	return (
		<Fragment>
			<div style={{ display: "flex", alignItems: "center" }}>
				<Typography
					variant="h6"
					style={{ textTransform: "capitalize", marginRight: 12 }}
				>{type && type == "person" ? <Translate value="personSearch.person" /> : type}{" "} <Translate value="personSearch.search" /> </Typography>
				{canSave && <Button
					onClick={() => dispatch(saveSearch())}
					color="primary"
					style={{ textTransform: "none" }}
				>
					<Translate value="personSearch.saveSearch" />
				</Button>}
			</div>
			{form}
		</Fragment>
	);
};

export default memo(SearchForm);
