import React, { useEffect, useState } from "react";
import { TextField } from "material-ui";

const EditableText = ({
	row,
	item,
	type,
	dataType,
	handleSaveUpdatedText,
	index,
	expanded,
	color
}) => {
	const data = row[item];
	const [textValue, setTextValue] = useState(data);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		setTextValue(row[item]);
	}, []);

	useEffect(() => {
		if (
			textValue !== row[item]
			&& !editing
		) {
			setTextValue(row[item]);
		}
	}, [textValue, row]);


	const handleUpdate = (e) => {
		e.preventDefault();
		setTextValue(e.target.value);
	};

	const handleEditMode = () => {
		setEditing(true);
	};

	const handleSave = () => {
		setEditing(false);

		let data;
		if (type === "text-header") {
			data = { label: textValue, property: row.property, type: dataType };
		} else {
			data = textValue;
		}
		handleSaveUpdatedText(data, item, index);
	};

	const style = {
		widget: {
			fontSize: "15px",
			backgroundColor: "#2c2d2f",
			color: color || "white",
			width: "100%",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis"
			// For whatever reason, inputs are shortened when deleting a row, this solves the issue for now
		}, 
		// Also causes slight style issue on bottom border 
		expanded: {
			fontSize: "15px",
			backgroundColor: "#35383C",
			color: color || "white",
			width: "100%",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis"
		}
	};

	return (
		<TextField
			id={"testing"}
			value={textValue}
			onChange={(e) => handleUpdate(e)}
			onFocus={handleEditMode}
			fullWidth={true}  // sets to column width
			onBlur={handleSave} // on mouse leave
			underlineShow={editing ? true : false}
			inputStyle={expanded ? style.expanded : style.widget}
		>
		</TextField>
	);
};

export default EditableText;