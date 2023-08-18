import {
	cyan500,
	pinkA200,
	grey100,
	grey300,
	grey500,
	white,
	darkBlack,
	fullBlack
} from "material-ui/styles/colors";
import { fade, lighten } from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

// vars
const darkGray = "#1F1F21";
const darkGray2 = "#2C2D2F";
const textGray = "#828283";

export default {
	spacing: spacing,
	fontFamily: "Roboto, sans-serif",
	palette: {
		primary1Color: "#35b7f3",
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: grey500,
		borderColor: grey300,
		disabledColor: textGray,
		pickerHeaderColor: cyan500,
		clockCircleColor: fade(darkBlack, 0.07),
		shadowColor: fullBlack,
		// New Material UI
		type: "dark",
		primary: {
			main: "#35b7f3"
		},
		background: { paper: darkGray2 }
	},
	flatButton: {
		fontWeight: "bold"
	},
	listItem: {
		secondaryTextColor: textGray
	},
	tableHeaderColumn: {
		textColor: fullBlack
	},
	// New Material UI and Material UI Pickers
	// TODO: Remove hard-coded styles from components
	overrides: {
		MuiPickersToolbar: {
			toolbar: {
				backgroundColor: "#35b7f3"
			}
		},
		MuiPickersDay: {
			"&$selected": {
				backgroundColor: "#35b7f3"
			},
			current: {
				color: "#35b7f3"
			}
		},
		MuiPickersModal: {
			dialogAction: {
				color: "#35b7f3"
			}
		},
		MuiInput: {
			root: {
				color: "#fff"
			},
			underline: {
				"&:before": {
					borderBottom: "1px solid #828283"
				},
				"&:after": {
					borderBottom: "1px solid #35b7f3"
				},
				"&:hover:not($disabled):not($focused):not($error):before": {
					borderBottom: "1px solid #828283"
				}
			}
		},
		MuiFormLabel: {
			root: { color: textGray, "&$focused": { color: textGray } }
		},
		MuiSelect: {
			icon: {
				color: textGray
			},
			selectMenu: {
				"&:focus": { background: darkGray2 }
			}
		},
		MuiIconButton: {
			root: { color: textGray }
		},
		MuiCheckbox: {
			root: { color: textGray }
		},
		MuiTable: {
			root: { borderColor: textGray }
		}
	}
};
