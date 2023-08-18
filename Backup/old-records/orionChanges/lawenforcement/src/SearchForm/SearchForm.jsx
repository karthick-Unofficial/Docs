import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import PersonSearch from "./Forms/PersonSearch";
import { Button, Typography } from "@material-ui/core";
import {Translate} from "orion-components/i18n/I18nContainer";

const propTypes = {
	canSave: PropTypes.bool,
	saveSearch: PropTypes.func.isRequired,
	search: PropTypes.func.isRequired,
	searchFormReset: PropTypes.func.isRequired,
	searchFieldUpdated: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	values: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const SearchForm = ({
	canSave,
	saveSearch,
	search,
	searchFormReset,
	searchFieldUpdated,
	type,
	values,
	dir
}) => {
	let form;
	switch (type) {
		case "person":
			form = (
				<PersonSearch
					search={search}
					searchFormReset={searchFormReset}
					searchFieldUpdated={searchFieldUpdated}
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
				>{type}{" "} <Translate value="personSearch.search" /> </Typography>
				{canSave && <Button
					onClick={saveSearch}
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

SearchForm.propTypes = propTypes;

export default memo(SearchForm);
