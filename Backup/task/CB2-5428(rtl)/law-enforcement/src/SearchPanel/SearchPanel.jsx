import React, { memo, useCallback } from "react";
import { ContextPanel } from "orion-components/ContextPanel";
import SavedSearch from "./SavedSearch/SavedSearch";
import {
	Button,
	Fab,
	List,
	Typography,
	useMediaQuery
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import {
	searchFormReset,
	clearSavedSearches
} from "./searchPanelActions";



const SearchPanel = () => {
	const State = useSelector(state => state);
	const { savedSearches } = useSelector(state => state.appState.persisted);
	const canManage = State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app")
		&& State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions
		&& State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions.includes("manage");
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));
	const dispatch = useDispatch();

	const handleReset = useCallback(() => {
		dispatch(searchFormReset());
	}, [searchFormReset]);

	const handleClearAll = useCallback(() => {
		dispatch(clearSavedSearches());
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
		},
		typography: {
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		}
	};
	return (
		<ContextPanel mobileToggle={mobileToggle} dir={dir}>
			<div style={styles.wrapper}>
				<div style={styles.controls}>
					<Fab onClick={handleReset} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="body1" style={styles.typography}>
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
											dir={dir}
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

export default memo(SearchPanel);
