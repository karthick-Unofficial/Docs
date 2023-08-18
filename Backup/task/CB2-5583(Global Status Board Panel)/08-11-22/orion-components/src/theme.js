import { alpha, lighten } from "@mui/material/styles";
import { cyan, grey, common } from "@mui/material/colors";
// import { spacing } from "@mui/system";


// vars
const cyan500 = cyan[500];
const grey100 = grey[100];
const grey300 = grey[300];
const grey500 = grey[500];
const white = common.white;
const darkBlack = "#010203";
const fullBlack = "#000000";


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
		clockCircleColor: alpha(darkBlack, 0.07),
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
	//spacing: spacing,  //Uncommenting this line will result in grid component spacing issues.
	components: {
		MuiTimePickerToolbar: {
			styleOverrides: {
				root: {
					color: "white",
					flexDirection: "row",
					height: "100px",
					background: "#1688bd",
					paddingTop: "20px"
				}
			}
		},
		MuiDatePickerToolbar: {
			styleOverrides: {
				root: {
					color: "white",
					flexDirection: "row",
					height: "100px",
					background: "#1688bd",
					paddingTop: "20px"
				},
				dateContainer: {
				}

			}
		},
		MuiDateTimePickerToolbar: {
			styleOverrides: {
				root: {
					color: "white",
					flexDirection: "row",
					height: "100px",
					background: "#1688bd",
					paddingTop: "20px"
				},
				dateContainer: {
				}

			}
		},
		MuiButtonBase: {
			styleOverrides: {
				root: {
					color: "#fff",
					"&.Mui-disabled": {
						"color": "#8F9091"
					}
				}
			}
		},
		MuiAppBar: {
			height: 60
		},
		inkBar: {
			backgroundColor: "#35b7f3"
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
		flatButton: {
			styleOverrides: {
				// fontSize: '.7em'
				fontWeight: "bold"
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
		MuiSnackbar: {
			textColor: "#FFFFFF",
			backgroundColor: "#35B7F3"
			// actionColor: "#35B7F3"
		},
		MuiTableRow: {
			styleOverrides: {
				stripeColor: alpha(lighten(darkGray2, 0.5), 0.4)
			}
		},
		// New Material UI and Material UI Pickers
		// TODO: Remove hard-coded styles from components

		//overrides
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
		MuiTypography: {
			styleOverrides: {
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
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					color: textGray
				}
			}
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					backgroundColor: "#828283"
				}
			}
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					backgroundColor: darkGray2
				}
			}
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
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: darkGray2
				}
			}
		},
		MuiDialogContentText: {
			styleOverrides: {
				root: {
					color: textGray
				}
			}
		},
		MuiFilledInput: {
			styleOverrides: {
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
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 0
				}
			}
		},
		MuiCardHeader: {
			styleOverrides: {
				root: {
					backgroundColor: "#494D53",
					padding: "16px 8px"
				},
				subheader: {
					color: textGray
				}
			}
		},
		MuiTable: {
			styleOverrides: {
				root: { borderColor: textGray }
			}
		},
		MuiExpansionPanel: {
			styleOverrides: {
				root: { boxShadow: "none", marginBottom: 8 }
			}
		},
		MuiExpansionPanelSummary: {
			styleOverrides: {
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
			}
		},
		MuiPickersToolbar: {
			styleOverrides: {
				toolbar: {
					backgroundColor: "#1688bd"
				}
			}
		},
		MuiPickersDay: {
			styleOverrides: {
				current: {
					color: "#1688bd"
				}
			}
		},
		MuiFormLabel: {
			styleOverrides: {
				root: { color: textGray, "&$focused": { color: textGray } }
			}
		},
		MuiSelect: {
			styleOverrides: {
				icon: {
					color: textGray
				},
				selectMenu: {
					"&:focus": { background: "transparent" }
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: transWhite,
					"&:hover": {
						opacity: 1
					}
				},
				colorPrimary: {
					color: "#4eb5f3"
				}
			}
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: transWhite
				},
				colorPrimary: {
					"&$checked": {
						color: "#00bcd4"
					}
				}
			}
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: { color: textGray }
			}
		}
	}
};

