import { makeStyles } from "@mui/styles";

//JSS overrides for Mui
export const useStyles = makeStyles({
	input: {
		"&::placeholder": {
			color: "rgb(130, 130, 131)",
			fontSize: "16px",
			fontWeight: "normal",
			opacity: 1
		}
	},
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "2px solid rgb(22, 136, 189)"
		}
	},
	disabledBtn: {
		color: "rgba(255, 255, 255, 0.4)!important"
	}
});
