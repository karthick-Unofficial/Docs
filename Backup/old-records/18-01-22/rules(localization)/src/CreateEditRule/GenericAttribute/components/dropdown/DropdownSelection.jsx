import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

const DropdownSelection = ({
	inputOptions,
	dropdownValue,
	handleChange,
	styles
}) => {
	return(
		<SelectField
			value={dropdownValue}
			onChange={handleChange}
			style={styles.main}
			labelStyle={styles.label}
			menuItemStyle={styles.menuItem}
			listStyle={styles.list}
			underlineStyle={styles.underline}
			selectedMenuItemStyle={{}}
		>
			{inputOptions.map((option) => {
				return (
					<MenuItem
						key={option.value}
						value={option.value}
						primaryText={option.label}
					/>
				);
			})}
		</SelectField>
	);
};

export default DropdownSelection;