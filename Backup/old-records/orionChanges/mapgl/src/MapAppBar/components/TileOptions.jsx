import React, { Component } from "react";
import Popover, { PopoverAnimationVertical } from "material-ui/Popover";

// Added for popover menu hack: (CB2-904)
import Menu from "material-ui/Menu";

class TileOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			baseMaps: [],
			thumbNail: ""
		};
	}

	_toggleOpen() {
		this.setState({
			open: !this.state.open
		});
	}
	_handleRequestClose() {
		this.setState({
			open: false
		});
	}

	static getDerivedStateFromProps(props, state) {
		if (props.baseMaps.length > 0) {
			const selectedThumbnail = props.baseMaps.filter((element) => element.name === props.mapName)[0];
			return {
				baseMaps: props.baseMaps,
				thumbNail: selectedThumbnail.thumbnail
			};
		}
	}

	setMapStyle = style => {
		const { setMapStyle } = this.props;
		setMapStyle({ mapStyle: style });
		this.setState({ open: false });
	};

	render() {
		const { mapName, mapLabel, dir } = this.props;
		const { baseMaps, thumbNail } = this.state;

		const allOptions = baseMaps.map((tileLayer, index) => {
			// Return all but the currently selected layer
			return (
				tileLayer.name !== mapName && (
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
			<div className="baseMapSelectorWrapper" ref="dropdownref">
				<div className="mapTileOptions drop">
					<div
						className={"map-sample-square"}
						onClick={() => this._toggleOpen()}
					>
						<div className="thumb" style={{ backgroundImage: `url(${thumbNail})` }} />
						<div className={dir == "rtl" ? "labelRTL" : "label"}>{mapLabel}</div>
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
					className={dir == "rtl" ? "baseMapSelectionRTL" : "baseMapSelection"}
					onRequestClose={() => this._handleRequestClose()}
				>
					<Menu style={{ width: "242px" }}>
						<div className="mapTileOptions">{allOptions}</div>
					</Menu>
				</Popover>
			</div>
		);
	}
}

export default TileOptions;
