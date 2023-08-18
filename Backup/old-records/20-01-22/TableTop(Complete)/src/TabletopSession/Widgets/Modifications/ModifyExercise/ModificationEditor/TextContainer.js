import { connect } from "react-redux";
import Text from "./Text";

const TextContainer = connect(
	null,
	null,
	null,
	{withRef: true}
)(Text);

export default TextContainer;
