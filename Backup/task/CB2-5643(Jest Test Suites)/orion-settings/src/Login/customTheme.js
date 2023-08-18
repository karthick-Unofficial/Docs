import { cyan, grey, common, pink } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { spacing } from "@mui/system";

const cyan500 = cyan[500];
const grey100 = grey[100];
const grey300 = grey[300];
const grey500 = grey[500];
const white = common.white;
const darkBlack = "#010203";
const fullBlack = "#000000";
const pinkA200 = pink[200];
// vars
// const darkGray = '#1F1F21';
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
		primary1Color: mediumGray,
		primary2Color: darkGray2,
		primary3Color: white,
		accent1Color: pinkA200,
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
		MuiTextField: {
			backgroundColor: "transparent"
		},
		flatButton: {
			fontSize: ".7em"
		},
		MuiListItem: {
			secondaryTextColor: textGray
		},
		toggle: {
			trackOnColor: "#2E7292",
			trackOffColor: "#969697",
			thumbOnColor: "#35B7F3",
			thumbOffColor: "#FFFFFF"
		},
		MuiListSubheaderr: {
			color: white
		}
	}
};