"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _colors = require("@mui/material/colors");
var _styles = require("@mui/material/styles");
var _styles2 = _interopRequireDefault(require("@mui/styles"));
// vars
var grey100 = _colors.grey[100];
var grey300 = _colors.grey[300];
var grey500 = _colors.grey[500];
var cyan500 = _colors.cyan[500];
var pinkA200 = _colors.pink[200];
var darkGray = "#1F1F21";
var darkGray2 = "#2C2D2F";
var darkBlack = "#010203";
var textGray = "#828283";
var fullBlack = "#000000";
var _default = {
  spacing: _styles2["default"],
  fontFamily: "Roboto, sans-serif",
  palette: {
    primary1Color: "#35b7f3",
    // primary2Color: darkGray2,
    // primary3Color: white,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: _colors.white,
    alternateTextColor: _colors.white,
    canvasColor: darkGray2,
    borderColor: grey300,
    disabledColor: "#828283",
    pickerHeaderColor: cyan500,
    clockCircleColor: (0, _styles.alpha)(darkBlack, 0.07),
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
        hintColor: textGray
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
      color: _colors.white
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
        contained: {
          textTransform: "none"
        },
        containedPrimary: {
          backgroundColor: "#4eb5f3"
        },
        containedSecondary: {
          backgroundColor: "#e85858",
          "&:hover": {
            backgroundColor: "#e85858"
          }
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
    }
    //subheader: {
    //	color: white
    //}
  }
};
exports["default"] = _default;