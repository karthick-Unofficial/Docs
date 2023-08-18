import React, { Component } from "react";

import Slider from "react-slick";

import { IconButton } from "material-ui";
import ChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";

import _ from "lodash";
import isEqual from "react-fast-compare";

class ImageViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
	}

	handleSliderUpdate = () => {
		if (this.slider) {
			this.slider.innerSlider.adaptHeight();
		}
	};

	shouldComponentUpdate(nextProps) {
		return !isEqual(this.props, nextProps);
	}

	componentDidMount() {
		const { images } = this.props;
		if (_.size(images)) {
			this.handleSliderUpdate();
		}
	}

	componentDidUpdate() {
		this.handleSliderUpdate();
	}

	next() {
		this.slider.slickNext();
	}

	previous() {
		this.slider.slickPrev();
	}

	orderImages = (arr) => {
		arr.forEach(i => {
			if(i.defaultImage === true && arr.indexOf(i) > 0) {
				arr.splice(arr.indexOf(i), 1);
				arr.unshift(i);
			}
		});
	}

	render() {
		const { images, dir } = this.props;

		this.orderImages(images);

		const styles = {
			button: {
				position: "absolute",
				top: "40%",
				zIndex: "100",
				opacity: 0.5,
				height: 48,
				width: 48,
				padding: 0
			},
			icon: {
				height: 48,
				width: 48
			},
			image: {
				width: "100%"
			}
		};

		const settings = {
			infinite: true,
			speed: 600,
			slidesToShow: 1,
			slidesToScroll: 1,
			adaptiveHeight: true,
			variableWidth: false,
			arrows: false,
			centerMode: true,
			centerPadding: "0px"
		};

		return (
			<div>
				<Slider ref={c => (this.slider = c)} {...settings}>
					{images.map((item, index) => {
						return (
							<div key={index}>
								<div style={{ position: "relative" }}>
									{images.length > 1 && (
										<IconButton
											iconStyle={styles.icon}
											style={dir == "rtl" ? { ...styles.button, right: 2 } : { ...styles.button, left: 2 }}
											onClick={this.previous}
										>
											{dir && dir == "rtl" ? <ChevronRight color="black" /> : <ChevronLeft color="black" />}
										</IconButton>
									)}
									<img
										onLoad={this.handleSliderUpdate}
										style={styles.image}
										alt="attachment"
										src={(item.source != null && item.source == "external") ? item.handle : "/_download?handle=" + item.handle}
									/>
									{images.length > 1 && (
										<IconButton
											iconStyle={styles.icon}
											style={dir == "rtl" ? { ...styles.button, left: 2 } : { ...styles.button, right: 2 }}
											onClick={this.next}
										>
											{dir && dir == "rtl" ? <ChevronLeft color="black" /> : <ChevronRight color="black" />}
										</IconButton>
									)}
								</div>
							</div>
						);
					})}
				</Slider>
			</div>
		);
	}
}

export default ImageViewer;
