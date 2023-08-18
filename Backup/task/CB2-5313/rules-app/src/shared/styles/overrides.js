import { makeStyles } from "@mui/styles";

//JSS overrides for Mui
export const useStyles = makeStyles({
    paper: {
        background: "rgb(31, 31, 33)",
        padding: "8px 0",
        borderRadius: "2px",
        boxShadow: "rgb(0 0 0 / 12%) 0px 1px 6px, rgb(0 0 0 / 12%) 0px 1px 4px"
    },
    selected: {
        background: "none!important",
        color: "rgb(0, 188, 212)"
    },
    scrollPaper: {
        width: "75%",
        margin: "0px auto"
    },
    mainScrollPaper: {
        width: "75%",
        margin: "0px auto",
        maxWidth: "768px"
    },
    input: {
        '&::placeholder': {
            color: "rgb(130, 130, 131)",
            fontSize: "16px",
            fontWeight: "normal",
            opacity: 1
        }
    },
    underline: {
        "&:before": {
            borderBottom: "1px solid rgb(65, 69, 74)!important"
        },
        "&:after": {
            borderBottom: "1px solid rgb(0, 188, 212)"
        }
    },
    disabled: {
        backgroundColor: "rgba(255, 255, 255, 0.12)!important"
    },
    select: {
        color: "#fff",
        padding: "0 24px",
        height: "48px!important",
        lineHeight: "48px",
        background: "rgb(31, 31, 33)",
        borderRadius: "2px"
    },
    conditionSelect: {
		color: "#fff",
		padding: "0 24px",
		height: "48px!important",
		lineHeight: "48px",
		background: "rgb(31, 31, 33)",
		borderRadius: "2px"
	},
    formControlLabel: {
		display: "block",
		margin: 0,
		height: "24px"
	},
    label: {
		fontSize: 14,
		color: "#828283",
		lineHeight: "24px",
		letterSpacing: 0
	}
});
