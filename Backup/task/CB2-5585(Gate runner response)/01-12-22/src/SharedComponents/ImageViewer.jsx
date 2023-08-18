import React, { memo, useEffect, useRef } from "react";

import Slider from "react-slick";

import { IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

import size from "lodash/size";
import isEqual from "react-fast-compare";

const ImageViewer = ({
	images,
	dir
}) => {
	const slider = useRef();


	const handleSliderUpdate = () => {
		if (slider && slider.innerSlider) {
			slider.innerSlider.adaptHeight();
		}
	};


	useEffect(() => {
		if (size(images)) {
			handleSliderUpdate();
		}
	}, []);

	handleSliderUpdate();




	const next = () => {
		slider.slickNext();
	};

	const previous = () => {
		slider.slickPrev();
	};

	const orderImages = (arr) => {
		arr.forEach(i => {
			if (i.defaultImage === true && arr.indexOf(i) > 0) {
				arr.splice(arr.indexOf(i), 1);
				arr.unshift(i);
			}
		});
	};

	orderImages(images);

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
			<Slider ref={slider} {...settings}>
				{images.map((item, index) => {
					return (
						<div key={index}>
							<div style={{ position: "relative" }}>
								{images.length > 1 && (
									<IconButton
										iconStyle={styles.icon}
										style={{ ...styles.button, ...(dir === "rtl" && { right: 2 }), ...(dir === "ltr" && { left: 2 }) }}
										onClick={previous}
									>
										{dir && dir === "rtl" ? <ChevronRight color="black" /> : <ChevronLeft color="black" />}
									</IconButton>
								)}
								<img
									onLoad={handleSliderUpdate}
									style={styles.image}
									alt="attachment"
									src={(item.source != null && item.source == "external") ? item.handle : "/_download?handle=" + item.handle}
								/>
								{images.length > 1 && (
									<IconButton
										iconStyle={styles.icon}
										style={dir === "rtl" ? { ...styles.button, left: 2 } : { ...styles.button, right: 2 }}
										onClick={next}
									>
										{dir && dir === "rtl" ? <ChevronLeft color="black" /> : <ChevronRight color="black" />}
									</IconButton>
								)}
							</div>
						</div>
					);
				})}
			</Slider>
		</div>
	);
};

const propsChange = (prevProps, nextProps) => {
	return !isEqual(prevProps, nextProps);
};


export default memo(ImageViewer, propsChange);
