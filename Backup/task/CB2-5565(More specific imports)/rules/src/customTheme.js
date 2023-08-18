// This should be moved to orion-components on refactor

import { alpha } from "@mui/material/styles";
import { cyan, grey, common } from '@mui/material/colors';
import { spacing } from '@mui/system';


// vars
const cyan500 = cyan[500];
const grey100 = grey[100];
const grey300 = grey[300];
const grey500 = grey[500];
const white = common.white;
const darkBlack = "#010203";
const fullBlack = "#000000";
const darkGray = "#1F1F21";
const darkGray2 = "#2C2D2F";
const mediumGray = "#41454A";
// const transBlack = 'rgba(0,0,0,0.3)';
const textGray = "#828283";
// const white = '#ffffff';
// const transWhite = 'rgba(255, 255, 255, 0.3)';
// const transWhite2 = 'rgba(255, 255, 255, 0.5)';
// const link = '#29B6F6';
// const alert = '#E85858';

export default {
	spacing: spacing,
	fontFamily: "Roboto, sans-serif",
	palette: {
		primary1Color: cyan500,
		primary2Color: darkGray2,
		primary3Color: white,
		accent1Color: cyan500,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: white,
		alternateTextColor: white,
		canvasColor: darkGray2,
		borderColor: grey300,
		disabledColor: alpha(darkBlack, 0.3),
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
		MuiTextField: {
			backgroundColor: darkGray,
			styleOverrides: {
				underlineShow: false,
				hintColor: textGray
			}
		},
		MuiListItem: {
			styleOverrides: {
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
	}
};