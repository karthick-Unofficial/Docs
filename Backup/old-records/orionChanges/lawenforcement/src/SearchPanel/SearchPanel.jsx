import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { ContextPanel } from "orion-components/ContextPanel";
import { default as SavedSearch } from "./SavedSearch/SavedSearchContainer";
import {
	Button,
	Fab,
	List,
	Typography,
	useMediaQuery
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import {Translate} from "orion-components/i18n/I18nContainer";

const propTypes = {
	canManage: PropTypes.bool,
	clearSavedSearches: PropTypes.func.isRequired,
	savedSearches: PropTypes.array,
	searchFormReset: PropTypes.func.isRequired,
	WavCamOpen: PropTypes.bool,
	dir: PropTypes.string
};
const defaultProps = { savedSearches: [] };

const SearchPanel = ({
	canManage,
	clearSavedSearches,
	savedSearches,
	searchFormReset,
	WavCamOpen,
	dir
}) => {
	const handleReset = useCallback(() => {
		searchFormReset();
	}, [searchFormReset]);
	const handleClearAll = useCallback(() => {
		clearSavedSearches();
	}, [clearSavedSearches]);
	const mobileToggle = {
		visible: useMediaQuery("(max-width:1023px)"),
		closeLabel: "Show Search Form",
		openLabel: "Show Saved Searches"
	};
	const styles = {
		wrapper: {
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		},
		controls: {
			display: "flex",
			align: "center",
			alignItems: "center",
			padding: "1rem",
			backgroundColor: "#242426"
		},
		contents: {
			padding: "0.5rem 1rem",
			height: "calc(100% - 72px)"
		}
	};
	return (
		<ContextPanel mobileToggle={mobileToggle} dir={dir}>
			<div style={styles.wrapper}>
				<div style={styles.controls}>
					<Fab onClick={handleReset} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="body1" style={dir == "rtl" ? { marginRight: "1rem" }:{ marginLeft: "1rem" }}>
						<Translate value="searchPanel.newSearch" />
					</Typography>
				</div>
				<div style={styles.contents}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "16px 0 8px 0"
						}}
					>
						<Typography variant="h6"><Translate value="searchPanel.mySearches" /></Typography>
						{canManage && <Button
							color="primary"
							style={{ textTransform: "none" }}
							onClick={handleClearAll}
						>
							<Translate value="searchPanel.clearAll" />
						</Button>}
					</div>
					{savedSearches && (
						<List style={{ height: "calc(100% - 60px", overflowY: "scroll" }}>
							{savedSearches
								.sort((a, b) => {
									const d1 = new Date(a.date);
									const d2 = new Date(b.date);
									if (d1.getTime() < d2.getTime()) {
										return 1;
									}
									if (d1.getTime() > d2.getTime()) {
										return -1;
									}
									return 0;
								})
								.map(search => {
									return (
										<SavedSearch
											key={search.id}
											id={search.id}
											search={search}
										/>
									);
								})}
						</List>
					)}
				</div>
			</div>
		</ContextPanel>
	);
};

SearchPanel.propTypes = propTypes;
SearchPanel.defaultProps = defaultProps;

export default memo(SearchPanel);
