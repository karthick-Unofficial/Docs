import {
	cyan500,
	pinkA200,
	grey100, grey300, grey500,
	white, darkBlack, fullBlack
} from "material-ui/styles/colors";
import {fade} from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

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
		disabledColor: fade(darkBlack, 0.3),
		pickerHeaderColor: cyan500,
		clockCircleColor: fade(darkBlack, 0.07),
		shadowColor: fullBlack
	},
	appBar: {
		height: 60
	},
	textField: {
		backgroundColor: "transparent"
	},
	flatButton: {
		fontSize: ".7em"
	},
	listItem: {
		secondaryTextColor: textGray
	},
	toggle: {
		trackOnColor: "#2E7292",
		trackOffColor: "#969697",
		thumbOnColor: "#35B7F3",
		thumbOffColor: "#FFFFFF"
	},
	subheader: {
		color: white
	}
};