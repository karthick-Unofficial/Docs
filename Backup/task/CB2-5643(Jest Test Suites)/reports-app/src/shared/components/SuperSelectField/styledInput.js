import { styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";

const StyledInput = styled(InputBase)(({ theme }) => ({
	padding: "10px 20px",
	width: "100%",
	"& input": {
		backgroundColor: theme.palette.mode === "light" ? "#fff" : "#0d1117",
		padding: 8,
		outline: "none",
		borderBottom: "1px solid black",
		transition: theme.transitions.create(["border-color", "box-shadow"]),
		fontSize: 14,
		"::placeholder": {
			color: "black"
		},
		"&:focus": {
			borderColor: theme.palette.mode === "light" ? "#0366d6" : "#388bfd"
		}
	}
}));

export default StyledInput;