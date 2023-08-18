import {
	cyan500,
	// pinkA200,
	grey100,
	grey300,
	grey500,
	white,
	darkBlack,
	fullBlack
} from "material-ui/styles/colors";
import { fade, lighten } from "material-ui/utils/colorManipulator";
// import spacing from "material-ui/styles/spacing";

// vars
const darkGray = "#1F1F21";
const darkGray2 = "#2C2D2F";
const textGray = "#B5B9BE";
const transWhite = "rgba(255,255,255, 0.3)";

// ! 5 grays - future
// ! text blue - #4eb5f3
// ! button/icon blue - #1688bd
// ! secondary text - bright gray
// ! icons (boat, point, etc) - bright gray
// ! toggles (collection toggle, close button, etc. ) - bright gray / white hover
// ! remove drop shadow on left of screen
// ! padding on left of collections
// ! drop shadow on card header
// ! sizing on icons 35x35 > 25x25

export default {
	// spacing: spacing,
	fontFamily: "Roboto, sans-serif",
	palette: {
		primary1Color: "#4eb5f3",
		// primary2Color: darkGray2,
		// primary3Color: white,
		accent1Color: textGray,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: white,
		alternateTextColor: white,
		canvasColor: darkGray2,
		borderColor: grey300,
		disabledColor: "#828283",
		pickerHeaderColor: cyan500,
		clockCircleColor: fade(darkBlack, 0.07),
		shadowColor: fullBlack,
		// New Material UI
		type: "dark",
		primary: {
			main: "#1688bd"
		},
		background: { paper: darkGray2 },
		text: {
			secondary: textGray,
			disabled: "#828283"
		}
	},
	appBar: {
		height: 60
	},
	inkBar: {
		backgroundColor: "#35b7f3"
	},
	datePicker: {
		underlineShow: false
	},
	textField: {
		backgroundColor: darkGray,
		underlineShow: false,
		hintColor: textGray
	},
	flatButton: {
		// fontSize: '.7em'
		fontWeight: "bold"
	},
	listItem: {
		secondaryTextColor: textGray
	},
	checkbox: {
		boxColor: textGray,
		checkedColor: "#00bcd4",
		requiredColor: darkGray,
		disabledColor: "#828283",
		labelColor: "#9e9e9e",
		labelDisabledColor: "rgba(0,0,0,0.3"
	},
	toggle: {
		trackOnColor: "#2E7292",
		trackOffColor: "#969697",
		thumbOnColor: "#35B7F3",
		thumbOffColor: "#FFFFFF"
	},
	subheader: {
		color: white
	},
	snackbar: {
		textColor: "#FFFFFF",
		backgroundColor: "#35B7F3"
		// actionColor: "#35B7F3"
	},
	tableRow: {
		stripeColor: fade(lighten(darkGray2, 0.5), 0.4)
	},
	// New Material UI and Material UI Pickers
	// TODO: Remove hard-coded styles from components
	overrides: {
		MuiPickersToolbar: {
			toolbar: {
				backgroundColor: "#1688bd"
			}
		},
		MuiPickersDay: {
			current: {
				color: "#1688bd"
			}
		},
		MuiInput: {
			root: {
				color: "#fff",
				"&$focused": {
					backgroundColor: "transparent"
				}
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
		},
		MuiFormLabel: {
			root: { color: textGray, "&$focused": { color: textGray } }
		},
		MuiSelect: {
			icon: {
				color: textGray
			},
			selectMenu: {
				"&:focus": { background: "transparent" }
			}
		},
		MuiIconButton: {
			root: {
				color: transWhite,
				"&:hover": {
					opacity: 1
				}
			},
			colorPrimary: {
				color: "#4eb5f3"
			}
		},
		MuiCheckbox: {
			root: {
				color: transWhite
			},
			colorPrimary: {
				"&$checked": {
					color: "#00bcd4"
				}
			}
		},
		MuiFormHelperText: {
			root: { color: textGray }
		},
		MuiTable: {
			root: { borderColor: textGray }
		},
		MuiExpansionPanel: {
			root: { boxShadow: "none", marginBottom: 8 }
		},
		MuiExpansionPanelSummary: {
			root: {
				color: "#FFF",
				backgroundColor: "#41454a",
				"&$expanded": {
					minHeight: 0
				}
			},
			content: {
				margin: "12px 0px !important"
			}
		},
		MuiFilledInput: {
			root: {
				backgroundColor: darkGray,
				"&:after": {
					display: "none"
				},
				"&:before": {
					display: "none"
				},
				"&:hover": {
					backgroundColor: darkGray
				},
				"&$focused": { backgroundColor: darkGray }
			},
			input: {
				padding: "12px 10px"
			},
			multiline: {
				padding: "12px 10px"
			}
		},
		MuiCard: {
			root: {
				borderRadius: 0
			}
		},
		MuiCardHeader: {
			root: {
				backgroundColor: "#494D53",
				padding: "16px 8px"
			},
			subheader: {
				color: textGray
			}
		},
		MuiButton: {
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
		},
		MuiDialog: {
			paper: {
				backgroundColor: darkGray2
			}
		},
		MuiDialogContentText: {
			root: {
				color: textGray
			}
		},
		MuiDivider: {
			root: {
				backgroundColor: "#828283"
			}
		},
		MuiPopover: {
			paper: {
				backgroundColor: darkGray2
			}
		},
		MuiListItemIcon: {
			root: {
				color: textGray
			}
		}
	},
	typography: {
		caption: {
			color: textGray
		},
		body1: {
			color: "#FFF",
			fontSize: 14
		},
		body2: {
			color: textGray,
			fontSize: 12
		},
		h1: {
			color: "#FFF",
			fontSize: 30
		},
		h2: {
			color: "#FFF",
			fontSize: 24
		},
		h3: {
			color: "#FFF",
			fontSize: 20
		},
		h4: {
			color: "#FFF",
			fontSize: 18
		},
		h5: {
			color: "#FFF",
			fontSize: 18
		},
		h6: {
			color: "#FFF",
			fontSize: 16
		}
	}
};
