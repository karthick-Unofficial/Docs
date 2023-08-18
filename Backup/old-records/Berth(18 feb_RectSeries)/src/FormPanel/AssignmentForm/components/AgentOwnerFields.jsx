import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { restClient } from "client-app-core";
import { TextField } from "orion-components/CBComponents";
import { SearchSelectField } from "../../../shared/components";
import { Grid, Typography } from "@material-ui/core";
import debounce from "debounce";
import _ from "lodash";
import { validate } from "../../../shared/utility/validate";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	agent: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleChangeName: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired,
	saved: PropTypes.bool.isRequired,
	isRequired: PropTypes.bool.isRequired,
	dir: PropTypes.string
};

const AgentOwnerFields = ({
	agent,
	handleChange,
	handleChangeName,
	handleUpdate,
	saved,
	isRequired,
	dir
}) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [queryBy, setQueryBy] = useState("");
	const { company, email, id, name, phone } = agent;
	const { firstName, lastName } = name;
	useEffect(() => {
		restClient.exec_get(
			`/berth-schedule-app/api/agents/query/byAgentData?searchProps=${queryBy}&searchString=${query}`,
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					if (Array.isArray(response)) {
						setResults(response);
					}
				}
			}
		);
	}, [query, queryBy]);
	const search = value => {
		setQuery(value);
	};
	const handleSearch = debounce(search, 200);
	const handleQuery = (key, type) => e => {
		if (key === "name") {
			const { value } = e.target;
			const words = value.includes(" ") ? value.split(" ") : [value];
			handleChangeName("agent", words[0], words[1]);
		}
		if (!e.target.value) {
			handleUpdate("agent", {
				id: "",
				company: "",
				email: "",
				name: { firstName: "", lastName: "" },
				phone: ""
			});
		} else if (key !== "name") {
			handleChange(key, type)(e);
		}
		handleSearch(e.target.value);
	};
	const handleSelect = name => id => {
		const newAgent = results.find(result => result.id === id);
		if (name === "company") {
			if (company !== newAgent.company) {
				handleUpdate("agent", {
					name: { firstName: "", lastName: "" },
					email: "",
					phone: "",
					company: newAgent.company
				});
			}
		} else {
			handleUpdate("agent", newAgent);
		}
	};
	const companies = _.uniqBy(
		results.map(result => {
			const { id, company } = result;
			return { id, name: company };
		}),
		"name"
	);
	const names = results
		.filter(result => !company || result.company === company)
		.map(result => {
			const { id, name } = result;
			return { id, name: `${name.firstName} ${name.lastName}` };
		});
	const emails = results
		.filter(result => !company || result.company === company)
		.map(result => {
			const { id, email } = result;
			return { id, name: email };
		});
	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				<Translate value="formPanel.agentInfo.title" />
			</Typography>
			<Grid style={{ padding: "0px 16px 24px 16px" }} container spacing={3}>
				<Grid
					onFocus={() => setQueryBy("company")}
					item
					style={{ paddingBottom: 0 }}
					xs={12}
					sm={6}
				>
					<SearchSelectField
						id="agent-company"
						label={getTranslation("formPanel.agentInfo.fieldLabel.agentName")}
						value={company}
						handleSearch={handleQuery("company", "agent")}
						handleSelect={handleSelect("company")}
						results={companies}
						disabled={saved}
						dir={dir}
					/>
				</Grid>
				<Grid
					onFocus={() => setQueryBy("lastName,firstName")}
					item
					style={{ paddingBottom: 0 }}
					xs={12}
					sm={6}
				>
					<SearchSelectField
						disabled={!!id || saved}
						id="agent-contact-name"
						label={getTranslation("formPanel.agentInfo.fieldLabel.contactPersonName")}
						value={lastName ? `${firstName} ${lastName}` : firstName}
						handleSearch={handleQuery("name", "agent")}
						handleSelect={handleSelect("name")}
						results={names}
						required={isRequired}
						dir={dir}
					/>
				</Grid>
				<Grid
					onFocus={() => setQueryBy("email")}
					item
					style={{ paddingBottom: 0 }}
					xs={12}
					sm={6}
				>
					<SearchSelectField
						id="agent-contact-email"
						label={getTranslation("formPanel.agentInfo.fieldLabel.contactPersonEmail")}
						error={!validate("email", email)}
						value={email}
						handleSearch={handleQuery("email", "agent")}
						handleSelect={handleSelect("email")}
						results={emails}
						required={isRequired}
						disabled={saved}
						dir={dir}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} xs={12} sm={6}>
					<TextField
						id="agent-contact-phone"
						label={getTranslation("formPanel.agentInfo.fieldLabel.contactPersonPhone")}
						error={!validate("phone", phone)}
						value={phone}
						handleChange={handleChange("phone", "agent")}
						disabled={saved}
						dir={dir}
					/>
				</Grid>
			</Grid>
		</Fragment>
	);
};

AgentOwnerFields.propTypes = propTypes;

export default memo(AgentOwnerFields);
