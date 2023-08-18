import React, { Component } from "react";
import Popover, { PopoverAnimationVertical } from "material-ui/Popover";

// Added for popover menu hack: (CB2-904)
import Menu from "material-ui/Menu";

class TileOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			layer: null,
			label: null,
			baseMaps: [],
			thumbNail: ""
		};
	}


	static getDerivedStateFromProps(props, state) {
		if (props.baseMaps.length > 0) {
			const selectedThumbnail = props.baseMaps.filter((element) => element.name === props.mapName)[0];
			return {
				baseMaps: props.baseMaps,
				layer: props.mapName,
				label: props.mapLabel,
				thumbNail: selectedThumbnail.thumbnail
			};
		}
	}

	toggleOpen() {
		this.setState({
			open: !this.state.open
		});
	}
	handleRequestClose() {
		this.setState({
			open: false
		});
	}

	setMapStyle = style => {
		const { setMapStyle } = this.props;
		setMapStyle({ mapStyle: style });
		this.setState({ open: false });
	};


	render() {
		const { baseMaps, thumbNail } = this.state;
		const { dir } = this.props;
		const allOptions = baseMaps.map((tileLayer, index) => {
			// Return all but the currently selected layer
			return (
				tileLayer.name !== this.state.layer && (
					<div
						className={"map-sample-square hilite"}
						onClick={() => {
							this.setMapStyle(tileLayer.name);
						}}
						key={index}
					>
						<div className="thumb" style={{ backgroundImage: `url(${tileLayer.thumbnail})` }} />
						<div className={dir == "rtl" ? "labelRTL" : "label"}>{tileLayer.label}</div>
					</div>
				)
			);
		});

		return (
			<div className="map-selector-wrapper" ref="dropdownref">
				<div className="map-tile-options drop">
					<div
						className={"map-sample-square"}
						onClick={() => this.toggleOpen()}
					>
						<div className="thumb" style={{ backgroundImage: `url(${thumbNail})` }} />


						<div className={dir == "rtl" ? "labelRTL" : "label"}>{this.state.label}</div>
						<div className="dropper">
							<i className="material-icons">keyboard_arrow_down</i>
						</div>
					</div>
				</div>
				<Popover
					style={{
						backgroundColor: "transparent"
					}}
					open={this.state.open}
					animation={PopoverAnimationVertical}
					anchorEl={this.refs.dropdownref}
					className={dir == "rtl" ? "map-selectionRTL" : "map-selection"}
					onRequestClose={() => this.handleRequestClose()}
				>
					<Menu style={{ width: "242px" }}>
						<div className="map-tile-options">{allOptions}</div>
					</Menu>
				</Popover>
			</div>
		);
	}
}

export default TileOptions;
