import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Portal = (props) => {
	const { node, children } = props;
	const el = document.createElement("div");

	useEffect(() => {
		node.appendChild(el);

		return () => {
			node.removeChild(el);
		};
	}, []);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	useEffect(() => {
		if (prevProps && node !== prevProps.node) {
			prevProps.node.removeChild(el);
			node.appendChild(el);
		}
	}, [props]);


	return ReactDOM.createPortal(children, el);
};

export default Portal;
