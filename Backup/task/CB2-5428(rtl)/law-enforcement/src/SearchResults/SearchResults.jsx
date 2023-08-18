import React, { memo, Fragment } from "react";
import { Divider, Grid, Typography } from "@mui/material";
import ExternalLink from "./ExternalLink/ExternalLink";
import PersonCard from "./PersonCard/PersonCard";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";



const SearchResults = () => {
	const groups = useSelector(state => state.results);
	const dir = useSelector(state => getDir(state));
	return (
		<div>
			{groups.map((group, index) => {
				const { id, label, results } = group;
				const lastIndex = index === groups.length - 1;
				return (
					<Fragment key={id}>
						<div style={{ margin: "24px 0px" }}>
							<Typography variant="h6">{`${label} ${id === "sex-offender-database"
								? " - " + results.length + " Results"
								: ""
								}`}</Typography>
							<Grid container spacing={3}>
								{results.map((result, index) => {
									const { id, type } = result;
									switch (type) {
										case "external-link":
											return (
												<Grid key={id} item xl={2} lg={3} sm={6} xs={12}>
													<ExternalLink dir={dir} result={result} />
												</Grid>
											);
										case "person-card":
											return (
												<Grid
													id={`grid-${index}`}
													key={id}
													item
													xl={4}
													lg={6}
													sm={12}
													xs={12}
												>
													<PersonCard index={index} result={result} dir={dir} />
												</Grid>
											);
										default:
											break;
									}
								})}
							</Grid>
						</div>
						{!lastIndex && <Divider />}
					</Fragment>
				);
			})}
		</div>
	);
};


export default memo(SearchResults);
