import React from "react";
import { Tabs, Tab } from "@mui/material";

const TabSelection = ({
	inputOptions,
	tabValue,
	handleClick,
	styles
}) => {
	return (
		<Tabs
			value={tabValue}
			TabIndicatorProps={{
				sx: {
					display: "none"
				}
			}}
			onChange={handleClick}
		>
			{inputOptions.map((option, index) => {
				const value = index + 1;
				return (
					<Tab
						label={option}
						sx={styles.tabButton}
						value={value}
						className={`left-tab ${tabValue === value ? "selected-tab" : "unselected-tab"}`}
					/>
				);
			})}
		</Tabs>
	);
};

export default TabSelection;