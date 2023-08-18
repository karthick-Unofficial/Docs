import { grey, cyan, pink, white } from '@mui/material/colors';

import { alpha } from "@mui/material/styles";

import spacing from "@mui/styles";

// vars
const grey100 = grey[100];
const grey300 = grey[300];
const grey500 = grey[500];
const cyan500 = cyan[500];
const pinkA200 = pink[200];
const darkGray = "#1F1F21";
const darkGray2 = "#2C2D2F";
const darkBlack = "#010203";
const textGray = "#828283";
const fullBlack = "#000000";

export default {
	spacing: spacing,
	fontFamily: "Roboto, sans-serif",
	palette: {
		primary1Color: "#35b7f3",
		// primary2Color: darkGray2,
		// primary3Color: white,
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: white,
		alternateTextColor: white,
		canvasColor: darkGray2,
		borderColor: grey300,
		disabledColor: "#828283",
		pickerHeaderColor: cyan500,
		clockCircleColor: alpha(darkBlack, 0.07),
		shadowColor: fullBlack
	},
	components: {
		MuiAppBar: {
			height: 60
		},
		MuiDatePicker: {
			styleOverrides: {
				underlineShow: false
			}
		},
		MuiAutocomplete: {
			styleOverrides: {
				option: {
					color: "#DFDFDF"
				},
				listbox: {
					backgroundColor: "#2C2D2F"
				}
			}
		},
		MuiTextField: {
			backgroundColor: darkGray,
			styleOverrides: {
				underlineShow: false,
				hintColor: textGray,
			}
		},
		flatButton: {
			// fontSize: '.7em'
			fontFamily: "Roboto",
			fontWeight: "bold"
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					backgroundColor: "#4A4D52",
					color: "#F3F3F3"
				},
				secondaryTextColor: textGray
			}
		},
		MuiCheckbox: {
			styleOverrides: {
				boxColor: textGray,
				checkedColor: "#00bcd4",
				requiredColor: darkGray,
				disabledColor: "#828283",
				labelColor: "#9e9e9e",
				labelDisabledColor: "rgba(0,0,0,0.3"
			}
		},
		toggle: {
			styleOverrides: {
				trackOnColor: "#2E7292",
				trackOffColor: "#969697",
				thumbOnColor: "#35B7F3",
				thumbOffColor: "#FFFFFF"
			}
		},
		MuiListSubheader: {
			color: white
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: textGray
				},
				textPrimary: {
					color: "#4eb5f3"
				},
				// flatPrimary: { color: "#4eb5f3" },
				contained: { textTransform: "none" },
				containedPrimary: {
					backgroundColor: "#4eb5f3"
				},
				containedSecondary: {
					backgroundColor: "#e85858",
					"&:hover": { backgroundColor: "#e85858" }
				}
			}
		},
		MuiInput: {
			styleOverrides: {
				root: {
					color: "#FFF"
				},
				underline: {
					"&:before": {
						borderBottom: "1px solid #B5B9BE"
					},
					"&:after": {
						borderBottom: "1px solid #1688bd"
					},
					"&:hover:not($disabled):not($focused):not($error):before": {
						borderBottom: "1px solid #B5B9BE"
					}
				}
			}
		},
		//subheader: {
		//	color: white
		//}
	}
};



