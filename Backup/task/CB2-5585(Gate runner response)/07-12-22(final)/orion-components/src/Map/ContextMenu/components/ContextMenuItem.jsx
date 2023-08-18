import { withStyles } from "@mui/styles";
import { MenuItem } from "@mui/material";

const ContextMenuItem = withStyles({
	root: {
		minWidth: 220,
		maxWidth: 300,
		minHeight: 54,
		whiteSpace: "normal",
		backgroundColor: "#494d53",
		color: "#ffffff",
		fontSize: 14,
		"&:hover, &:focus": {
			backgroundColor: "#2c2d2f"
		}
	}
})(MenuItem);

export default ContextMenuItem;