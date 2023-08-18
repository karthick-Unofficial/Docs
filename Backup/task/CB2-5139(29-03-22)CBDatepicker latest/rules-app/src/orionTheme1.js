Object.defineProperty(exports, "__esModule", {
	value: true
});
const _colors = require("material-ui/styles/colors");
const _colorManipulator = require("material-ui/utils/colorManipulator");
const _spacing = require("material-ui/styles/spacing");
const _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Light Theme is the default theme used in material-ui. It is guaranteed to
 *  have all theme variables needed for every component. Variables not defined
 *  in a custom theme will default to these values.
 */

// COLOR REF
// $darkGray: #1F1F21;
// $darkGray2: #2C2D2F;
// $mediumGray: #41454A;
// $transBlack: rgba(0,0,0,0.3);
// $textGray: #828283;
// $white: #ffffff;
// $transWhite: rgba(255, 255, 255, 0.3);
// $transWhite2: rgba(255, 255, 255, 0.5);
// $link: #29B6F6;
// $alert: #E85858;
const orionWhite = "#FFFFFF";
const orionBlue = "#35b7f3";
const textGray= "rgba(255, 255, 255, 0.3)";
exports.default = {
	spacing: _spacing.default,
	fontFamily: "Roboto, sans-serif",
	palette: {
		primary1Color: orionBlue, // example 'AppBar header'
		primary2Color: "#41454A",
		primary3Color: "#41454A",
		accent1Color: orionBlue, // _colors.pinkA200,
		accent2Color: _colors.lightBlue400,
		accent3Color: _colors.lightBlue400,
		textColor: _colors.white, // _colors.darkBlack,
		secondaryTextColor: _colors.grey400, //(0, _colorManipulator.fade)(_colors.darkBlack, 0.54),
		alternateTextColor: _colors.white,
		canvasColor: _colors.white,
		borderColor: _colors.grey300,
		disabledColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.3),
		pickerHeaderColor: _colors.cyan500,
		clockCircleColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.07),
		shadowColor: _colors.fullBlack
	},
	dialog: {
		// titleFontSize: 24,
		// bodyFontSize: 18,
		bodyColor: textGray,
		backgroundColor: "red"
	},
	flatButton: {
		// color: orionBlue,
		// buttonFilterColor: '#999999',
		// disabledTextColor: fade(palette.textColor, 0.3),
		textColor: orionWhite
		// primaryTextColor: palette.primary1Color,
		// secondaryTextColor: palette.accent1Color,
		// fontSize: typography.fontStyleButtonFontSize,
		// fontWeight: typography.fontWeightMedium,
	},
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.75)"
	},
	menu: {
		padding: 0
	},
	menuItem: {
		hoverColor: orionBlue,
		selectedTextColor: "white",
		padding: 16
	},
	menuSubheader: {
		padding: 16
	},
	inkBar: {
		backgroundColor: orionBlue
	},
	dropDownMenu: {
		padding: "0 0 0 0"
	},
	list: {
		padding: "0 0 0 0"
	},
	listItem: {
		padding: "0 0 0 0"
	},
	textField: {
		// textColor: palette.textColor,
		// hintColor: palette.disabledColor,
		// disabledTextColor: palette.disabledColor,
		// errorColor: red500,
		// focusColor: palette.primary1Color,
		backgroundColor: "#1F1F21",
		textColor: orionWhite
		// borderColor: palette.borderColor,
	},
	checkbox: {
		boxColor: textGray,
		checkedColor: orionBlue
		// requiredColor: palette.primary1Color,
		// disabledColor: palette.disabledColor,
		// labelColor: palette.textColor,
		// labelDisabledColor: palette.disabledColor,
	}
};