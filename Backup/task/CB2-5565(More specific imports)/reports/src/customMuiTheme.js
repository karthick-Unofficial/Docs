
import { grey, cyan, pink } from '@mui/material/colors';

import { alpha } from "@mui/material/styles";
//import spacing from "material-ui/styles/spacing";

const grey100 = grey[100];
const grey300 = grey[300];
const grey500 = grey[500];
const cyan500 = cyan[500];
const pinkA200 = pink[200];
const darkBlack = "#010203";
const textGray = "#828283";
const fullBlack = "#000000";

export default {
	//spacing: spacing,
	fontFamily: "Roboto, sans-serif",
	palette: {
		primary1Color: "#35b7f3",
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: grey500,
		borderColor: grey300,
		disabledColor: "#828283",
		pickerHeaderColor: cyan500,
		clockCircleColor: alpha(darkBlack, 0.07),
		shadowColor: fullBlack
	},
	components: {
		flatButton: {
			fontWeight: "bold"
		},
		MuiListItem: {
			styleOverrides: {
				secondaryTextColor: textGray
			}
		},
		tableHeaderColumn: {
			textColor: fullBlack
		}
	}
};
