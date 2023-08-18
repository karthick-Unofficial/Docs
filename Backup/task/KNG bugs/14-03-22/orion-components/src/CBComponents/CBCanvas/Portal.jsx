import { Component } from "react";
import ReactDOM from "react-dom";

class Portal extends Component {
	constructor(props) {
		super(props);
		this.el = document.createElement("div");
	}

	componentDidMount() {
		const { node } = this.props;
		node.appendChild(this.el);
	}

	componentDidUpdate(prevProps, prevState) {
		const { node } = this.props;
		if (node !== prevProps.node) {
			prevProps.node.removeChild(this.el);
			node.appendChild(this.el);
		}
	}

	componentWillUnmount() {
		const { node } = this.props;
		node.removeChild(this.el);
	}

	render() {
		const { children } = this.props;
		return ReactDOM.createPortal(children, this.el);
	}
}

export default Portal;
