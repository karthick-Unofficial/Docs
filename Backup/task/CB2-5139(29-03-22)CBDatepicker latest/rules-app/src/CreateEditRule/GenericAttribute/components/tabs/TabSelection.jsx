import React from "react";
import { Tabs, Tab } from "material-ui/Tabs";

const TabSelection = ({
	inputOptions,
	tabValue,
	handleClick,
	styles
}) => {
	return(
		<Tabs
			tabItemContainerStyle={styles.contentContainerStyle}
			inkBarStyle={styles.inkBar}
			value={tabValue}
			children={inputOptions.map((option, index) => {
				const value = index + 1;
				return(
					<Tab
						label={option}
						style={styles.tabButton}
						value={value}
						onActive={handleClick}
						className={`left-tab ${tabValue === value ? "selected-tab" : "unselected-tab"}`}
					/>
				);
			})}
		/>
	);
};

export default TabSelection;