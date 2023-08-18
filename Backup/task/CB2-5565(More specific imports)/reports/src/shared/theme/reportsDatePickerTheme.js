import { createTheme } from "@mui/material/styles";

const reportsDatePickerTheme = createTheme({
	components: {
		MuiDateTimePickerToolbar: {
			styleOverrides: {
				root: {
					color: 'white',
					backgroundColor: '#4eb5f3',
				}
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					color: 'black', // month picker color
				},
			},
		},

		MuiTabs: {
			styleOverrides: {
				flexContainer: {
					backgroundColor: "#4eb5f3"
				},
				indicator: {
					border: '2px solid #88134A',
					backgroundColor: '#88134A',
				},
			},
		},

		MuiPickersDay: {
			styleOverrides: {
				dayWithMargin: {
					color: 'black', // calendar date number colors.
				},
			},
		},

		//checked till here

		MuiSvgIcon: {
			styleOverrides: {
				root: {
					color: "black"
				}

			}
		},

	}
});

export default reportsDatePickerTheme;