import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { TextField, SelectField } from "orion-components/CBComponents";
import { Grid, Button, MenuItem } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	search: PropTypes.func.isRequired,
	searchFormReset: PropTypes.func.isRequired,
	searchFieldUpdated: PropTypes.func.isRequired,
	values: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const PersonSearch = ({
	search,
	searchFormReset,
	searchFieldUpdated,
	values,
	dir
}) => {
	const [error, setError] = useState(false);
	const handleChange = useCallback(
		name => e => {
			const { value } = e.target;
			searchFieldUpdated(name, value);
			if (name === "dOB") {
				setError(false);
			}
		},
		[searchFieldUpdated]
	);
	const handleReset = useCallback(() => {
		if (error) {
			setError(false);
		}
		searchFormReset();
	}, [error, searchFormReset]);
	const handleSearch = () => {
		if (values.dOB) {
			const valid = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$/.test(
				values.dOB
			);
			if (!valid) {
				setError(true);
				return;
			}
		}
		search();
	};
	const { firstName, lastName, dOB, sex, race, keyword } = values;
	return (
		<Grid container spacing={3}>
			<Grid item lg={2} sm={4} xs={12}>
				<TextField
					id="first-name"
					handleChange={handleChange("firstName")}
					label={<Translate value="searchForm.forms.firstName" />}
					value={firstName}
					dir={dir}
				/>
			</Grid>
			<Grid item lg={2} sm={4} xs={12}>
				<TextField
					id="last-name"
					handleChange={handleChange("lastName")}
					label={<Translate value="searchForm.forms.lastName" />}
					value={lastName}
					dir={dir}
				/>
			</Grid>
			<Grid item lg={2} sm={4} xs={12}>
				<TextField
					id="dob"
					handleChange={handleChange("dOB")}
					label={<Translate value="searchForm.forms.dob" />}
					value={dOB}
					helperText={!error ? "" : "MM/DD/YYYY or MM/DD/YY"}
					error={error}
					dir={dir}
				/>
			</Grid>
			<Grid item lg={1} sm={2} xs={6}>
				<SelectField
					id="sex"
					handleChange={handleChange("sex")}
					label={<Translate value="searchForm.forms.sex" />}
					value={sex}
					dir={dir}
				>
					<MenuItem value="M"><Translate value="searchForm.forms.male" /></MenuItem>
					<MenuItem value="F"><Translate value="searchForm.forms.female" /></MenuItem>
					<MenuItem value="all"><Translate value="searchForm.forms.all" /></MenuItem>
				</SelectField>
			</Grid>
			<Grid item lg={1} sm={2} xs={6}>
				<SelectField
					id="race"
					handleChange={handleChange("race")}
					label={<Translate value="searchForm.forms.race" />}
					value={race}
					dir={dir}
				>
					<MenuItem value="W"><Translate value="searchForm.forms.white" /></MenuItem>
					<MenuItem value="B"><Translate value="searchForm.forms.black" /></MenuItem>
					<MenuItem value="all"><Translate value="searchForm.forms.all" /></MenuItem>
				</SelectField>
			</Grid>
			<Grid item lg={2} sm={4} xs={12}>
				<TextField
					id="keyword"
					handleChange={handleChange("keyword")}
					label={<Translate value="searchForm.forms.keyword" />}
					value={keyword}
					dir={dir}
				/>
			</Grid>
			<Grid item lg={1} sm={2} xs={6}>
				<Button
					onClick={handleSearch}
					style={{ width: "100%", marginTop: 18 }}
					color="primary"
					variant="contained"
				>
					<Translate value="searchForm.forms.search" />
				</Button>
			</Grid>
			<Grid item lg={1} sm={2} xs={6}>
				<Button
					onClick={handleReset}
					style={{ backgroundColor: "#494D53", color: "#FFF", width: "100%", whiteSpace:"nowrap", marginTop: 18 }}
					variant="contained"
				>
					<Translate value="searchForm.forms.reset" />
				</Button>
			</Grid>
		</Grid>
	);
};

PersonSearch.propTypes = propTypes;

export default memo(PersonSearch);
