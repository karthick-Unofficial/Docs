/*  The Timeline control consists of 4 canvases in the following order of z-index:
	Base Canvas: This canvas renders the timeline markers (from canvas bottom of height 22 px)
		and the hover for event lines (y range 45 to canvasHeight - 32). The hover line starts 
		3 px above the corresponding event bars and ends 3 px below the bars.
	Events Canvas: This canvas renders the event type labels and the event bars. The event
		bars range from y=48 to y=canvasWidth-32. Each bar is 6 px high and there is a vertical gap 
		of 6px between bars. Each bar is 6 px thick with fill width of 4 px and 1px left on either side.
	Current Time Canvas: This canvas renders the current time marker and text (y range 30 to canvas bottom)
		and the steppers (y range 8 to 28)
	Slider Canvas: This is the canvas on the top and hence is responsible for handling all mouse events.
		It also renders the slider.
*/

import _ from "lodash";
import React, { useEffect, useState, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import Measure from "react-measure";
import { Popover, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as eventUtilities from "../../../../shared/utility/eventUtility";
import TargetingIconContainer from "../../../Controls/TargetingIcon/TargetingIconContainer";
import EventTextContainer from "../../EventText/EventTextContainer";

const propTypes = {
	sessionId: PropTypes.string,
	isController: PropTypes.bool,
	playbackSettings: PropTypes.object,
	currentSimulation: PropTypes.object,
	endTime: PropTypes.number,
	playStatus: PropTypes.string,
	simulationData: PropTypes.object,
	agents: PropTypes.object,
	events: PropTypes.array,
	modificationsActive: PropTypes.bool,
	timelineSettings: PropTypes.object,
	teamsConfig: PropTypes.object,
	moveSimulation: PropTypes.func.isRequired,
	reportTimelineHeight: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const popoverStyles = makeStyles({
	paper: {
		background: "#494d54"
	},
	divider: {
		background: "#707070"
	}
});

const Timeline = ({ 
	sessionId, 
	isController, 
	playbackSettings, 
	currentSimulation, 
	endTime, 
	playStatus, 
	simulationData, 
	agents, 
	events,
	modificationsActive, 
	timelineSettings, 
	teamsConfig, 
	moveSimulation,
	reportTimelineHeight,
	dir 
}) => {
	const baseCanvasRef = useRef(null);
	const eventsCanvasRef = useRef(null);
	const currTimeCanvasRef = useRef(null);
	const sliderCanvasRef = useRef(null);

	const [ containerWidth, setContainerWidth ] = useState(null);
	const [ canvasWidth, setCanvasWidth ] = useState(null);
	const [ canvasHeight, setCanvasHeight ] = useState(null);
	const [ currentTimePos, setCurrentTimePos ] = useState(null);
	const [ sliderData, setSliderData ] = useState(null);
	const [ stepperData, setStepperData ] = useState(null);
	const [ eventBarData, setEventBarData] = useState(null);
	const [ eventLineHoverData, setEventLineHoverData ] = useState(null);
	const [ pixelsPerSecond, setPixelsPerSecond ] = useState(0);
	const [ canDrag, setCanDrag ] = useState(false);
	const [ dragging, setDragging ] = useState(false);
	const [ dragPrevX, setDragPrevX ] = useState(null);
	const [ eventsToDisplay, setEventsToDisplay ] = useState(null); // Events popover

	const SLIDER_HALF = 50;
	const EVENT_LABEL_WIDTH = 130;
	const LEFT_TIME_MARGIN = EVENT_LABEL_WIDTH + 5; // Space to the left of the first timeline tick
	const RIGHT_TIME_MARGIN = 50; // Space to the right of the last timeline tick
	const STEPPER_TOP = 8;
	const STEPPER_DIMENSION = 20;

	const popoverClasses = popoverStyles();

	// Move simulation to new time
	const moveToNewTime = ( newSimTime ) => {
		if (newSimTime < 0) {
			newSimTime = 0;
		}
		if (newSimTime > endTime) {
			newSimTime = endTime;
		}
		moveSimulation(sessionId, currentSimulation.simId, 
			{
				direction: "absolute", 
				command: "MOVE_TO_TIME", 
				toTime: newSimTime
			}
		);
	};

	// Can the user interact with the timeline based on the current mouse pointer
	const canInteract = ( x, y ) => {
		// We first look for steppers
		if (stepperData && playStatus !== "playing" && y >= STEPPER_TOP && y <= (STEPPER_TOP + STEPPER_DIMENSION) && x > LEFT_TIME_MARGIN) {
			for (let i = 0; i < stepperData.length; i++) {
				const stepperDatum = stepperData[i];
				if (x >= stepperDatum.x - (STEPPER_DIMENSION/2) && x <= stepperDatum.x + (STEPPER_DIMENSION/2)) {
					return {
						canInteract: true,
						component: "stepper",
						time: stepperDatum.time
					};
				}
			}
		}
		// Else we look for slider
		if (isController && sliderData && !modificationsActive && playStatus !== "playing" && x > sliderData.left && x < sliderData.right) {
			return {
				canInteract: true,
				component: "slider"
			};
		}
		// Else we look for event bars
		if (eventBarData && y >= 48 && y <= (canvasHeight - 32)) {
			for (const eventType in eventBarData) {
				const eventBarDatum = eventBarData[eventType];
				if (y >= 48 + (eventBarDatum.index * 12) && y <= 54 + (eventBarDatum.index * 12)) {
					for (let i = 0; i < eventBarDatum.bars.length; i++) {
						const bar = eventBarDatum.bars[i];
						if (x >= bar.lowerPixelLimit && x <= bar.upperPixelLimit) {
							return {
								canInteract: true,
								component: "eventBar",
								bar
							};
						} 
					}
				}
			}
		}
		return {
			canInteract: false
		};
	};

	const handleMouseMove = (e) => {
		const bounds = e.target.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		if (dragging) {
			const diff = dragPrevX - x;
			if (Math.abs(diff) > 10) {
				setDragPrevX(x);
				const left = x - SLIDER_HALF;
				const right = x + SLIDER_HALF;
				setSliderData({
					left: left < 0 ? 0 : left,
					right: right > canvasWidth ? canvasWidth : right
				});
			}
		} else {
			const y = e.clientY - bounds.top;
			const interactive = canInteract(x, y);
			if (interactive.canInteract) {
				sliderCanvasRef.current.style.cursor = "pointer";
				if (canDrag) {
					if (interactive.component !== "slider") {
						setCanDrag(false);
					}
				} else {
					if (interactive.component === "slider") {
						setCanDrag(true);
					}
				}
			} else {
				sliderCanvasRef.current.style.cursor = "default";
				if (canDrag) {
					setCanDrag(false);
				}
			}
		}
		// Check if we need to highlight an event line or remove the highlight
		if (eventBarData && y >= 45 && y <= (canvasHeight - 32)) {
			const index = Math.floor((y - 45) / 12);
			const newEventLineHoverData = 45 + (index * 12);
			if (newEventLineHoverData !== eventLineHoverData) {
				setEventLineHoverData(newEventLineHoverData);
			}
		} else {
			if (eventLineHoverData) {
				setEventLineHoverData(null);
			}
		}
	};

	const handleMouseLeave = (e) => {
		if (dragging) {
			const bounds = e.target.getBoundingClientRect();
			const x = e.clientX - bounds.left;
			const newSimTime = (x - LEFT_TIME_MARGIN) / pixelsPerSecond;
			moveToNewTime(newSimTime);
		}
		sliderCanvasRef.current.style.cursor = "default";
		setCanDrag(false);
		setDragging(false);
		setDragPrevX(null);
	};

	const handleMouseDown = (e) => {
		const bounds = e.target.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		if (canDrag) {
			setDragging(true);
			setDragPrevX(x);
		} else {
			const interaction = canInteract(x, y);
			if (interaction.canInteract) {
				if (interaction.component === "stepper") {
					moveToNewTime(interaction.time);
				} else if (interaction.component === "eventBar") {
					setEventsToDisplay({
						x: e.clientX,
						y: e.clientY,
						events: interaction.bar.events
					});
				}
			}
		}
	};

	const handleMouseUp = () => {
		if (dragging && dragPrevX) {
			const newSimTime = (dragPrevX - LEFT_TIME_MARGIN) / pixelsPerSecond;
			moveToNewTime(newSimTime);
			setDragging(false);
			setDragPrevX(null);
		}
	};

	// Report 0 height when closing
	useEffect(() => {
		return () => {
			reportTimelineHeight(0);
		};
	}, []);

	// Set canvas widths if the container resizes
	useEffect(() => {
		if (!containerWidth) {
			return;
		}
		
		if (containerWidth !== canvasWidth) {
			const baseCanvas = baseCanvasRef.current;
			const eventCanvas = eventsCanvasRef.current;
			const sliderCanvas = sliderCanvasRef.current;
			const currTimeCanvas = currTimeCanvasRef.current;
			
			baseCanvas.width  = containerWidth;
			eventCanvas.width  = containerWidth;
			sliderCanvas.width  = containerWidth;
			currTimeCanvas.width  = containerWidth;

			setCanvasWidth(containerWidth);
		}
	}, [containerWidth]);

	// Set canvas heights if there is a change in event display settings
	useEffect(() => {
		let height = 80; // If there are no events to display
		const qualifyingEventTypes = {}; 
		let effectiveConfig = timelineSettings;
		if (!effectiveConfig) {
			effectiveConfig = eventUtilities.createDefaultObject(true);
		}
		_.keys(effectiveConfig).forEach(team => {
			_.keys(effectiveConfig[team]).forEach(eventType => {
				if (effectiveConfig[team][eventType]) {
					qualifyingEventTypes[eventType] = true;
				}
			});
		});
		const eventTypesCount = _.keys(qualifyingEventTypes).length;
		if (eventTypesCount) {
			// height = base height + event bars heights + gaps heights
			height = height + (eventTypesCount * 6) + ((eventTypesCount - 1) * 6);
		}

		if (height !== canvasHeight) {
			const canvas = baseCanvasRef.current;
			const eventCanvas = eventsCanvasRef.current;
			const sliderCanvas = sliderCanvasRef.current;
			const currTimeCanvas = currTimeCanvasRef.current;
			
			canvas.height = height;
			eventCanvas.height = height;
			sliderCanvas.height = height;
			currTimeCanvas.height = height;

			setCanvasHeight(height);
			reportTimelineHeight(height);
		}
	}, [timelineSettings]);

	// Calculate pixels per second and render time markers if dimensions have changed.
	useEffect(() => {
		if (!canvasWidth || !canvasHeight) {
			return;
		}

		const canvas = baseCanvasRef.current;
		const context = canvas.getContext("2d");

		const timelineWidth = canvasWidth - (LEFT_TIME_MARGIN + RIGHT_TIME_MARGIN);
		const pixelsBySecond = timelineWidth / endTime;
		let stepSizeInPixels = 150;
		let stepSizeInSec = Math.round(stepSizeInPixels / pixelsBySecond);
		// Go to the nearest multiple of 10
		if (stepSizeInSec > 10) {
			if (stepSizeInSec % 10 !== 0) {
				stepSizeInSec = Math.floor(stepSizeInSec / 10) * 10; 
				stepSizeInPixels = stepSizeInSec * pixelsBySecond;
			}
		} else {
			if (stepSizeInSec === 0) {
				stepSizeInSec = 1;
			}
			stepSizeInPixels = stepSizeInSec * pixelsBySecond;
		}
		const stepCount = Math.floor(timelineWidth / stepSizeInPixels);

		// Clear the current contents
		context.clearRect(0, canvasHeight - 22, canvasWidth, 22);

		// Draw time markers
		context.strokeStyle = "#fff";
		context.font = "14px roboto";
		context.fillStyle = "#fff";
		for (let i = 0; i < stepCount; i++) {
			context.beginPath();
			context.moveTo(i*stepSizeInPixels + LEFT_TIME_MARGIN, canvasHeight);
			context.lineTo(i*stepSizeInPixels + LEFT_TIME_MARGIN, canvasHeight - 22);
			context.stroke();
			context.fillText(Math.round(i*stepSizeInSec) + " sec", (i*stepSizeInPixels) + LEFT_TIME_MARGIN + 3, canvasHeight - 8);
		}
		// Check if there is enough gap with the end point to draw another step
		if (stepSizeInPixels * stepCount < timelineWidth - (stepSizeInPixels/2)) {
			context.moveTo((stepSizeInPixels * stepCount) + LEFT_TIME_MARGIN, canvasHeight);
			context.lineTo((stepSizeInPixels * stepCount) + LEFT_TIME_MARGIN, canvasHeight - 22);
			context.stroke();
			context.fillText(Math.round(stepCount*stepSizeInSec) + " sec", (stepSizeInPixels * stepCount) + LEFT_TIME_MARGIN + 3, canvasHeight - 8);	
		}
		context.moveTo(timelineWidth + LEFT_TIME_MARGIN, canvasHeight);
		context.lineTo(timelineWidth + LEFT_TIME_MARGIN, canvasHeight - 22);
		context.stroke();
		context.fillText(Math.round(endTime) + " sec", timelineWidth + LEFT_TIME_MARGIN + 3, canvasHeight - 8);

		setPixelsPerSecond(pixelsBySecond);
	}, [ canvasWidth, canvasHeight ]);

	// Recalculate state data on external changes and pixels per second change
	useEffect(() => {
		if (!pixelsPerSecond) {
			return;
		}

		const simTime = currentSimulation.playStatus.simTime;
		const newCurrentTimePos = Math.round(simTime * pixelsPerSecond) + LEFT_TIME_MARGIN;
		setCurrentTimePos(newCurrentTimePos);
		const sliderLeft = newCurrentTimePos - SLIDER_HALF < EVENT_LABEL_WIDTH ? EVENT_LABEL_WIDTH : newCurrentTimePos - SLIDER_HALF;
		const sliderRight = newCurrentTimePos + SLIDER_HALF > canvasWidth ? canvasWidth : newCurrentTimePos + SLIDER_HALF;
		setSliderData({
			left: sliderLeft,
			right: sliderRight
		});

		// Setup stepper data if applicable
		if (!isController || modificationsActive || !playStatus || playStatus === "playing" || !playbackSettings.steppingActive || !playbackSettings.stepSize) {
			if (stepperData) {
				setStepperData(null);
			}
			return;
		}

		const newStepperData = [];
		// We first reduce from the current time till we go beyond 0
		let currStepTime = simTime - playbackSettings.stepSize;
		while (currStepTime > 0) {
			newStepperData.splice(0, 0, {
				x: (currStepTime * pixelsPerSecond) + LEFT_TIME_MARGIN,
				time: currStepTime
			});
			currStepTime -= playbackSettings.stepSize;
		}
		// Now we process from current time till end
		currStepTime = simTime + playbackSettings.stepSize;
		while (currStepTime < endTime) {
			newStepperData.push({
				x: (currStepTime * pixelsPerSecond) + LEFT_TIME_MARGIN,
				time: currStepTime
			});
			currStepTime += playbackSettings.stepSize;
		}
		setStepperData(newStepperData);
	}, [ currentSimulation.playStatus.simTime, pixelsPerSecond, playbackSettings, playStatus, modificationsActive ]);

	// Render slider when slider state changes
	useEffect(() => {
		if (!sliderData) {
			return;
		}

		const canvas = sliderCanvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.shadowBlur = 12;
		context.shadowColor = "#000";
		context.fillStyle = "#553c4656";
		context.fillRect(sliderData.left, 6, sliderData.right - sliderData.left, canvasHeight - 6);
		context.fillStyle = "#4db5f4";
		context.fillRect(sliderData.left, 2, sliderData.right - sliderData.left, 4);

		if (dragPrevX) {
			// Draw drag pos
			context.fillStyle = "#fff";
			context.fillRect(dragPrevX - 2, 46, 4, canvasHeight - 46);
			context.font = "14px roboto";
			context.fillStyle = "#fff";
			const newSimTime = (dragPrevX - LEFT_TIME_MARGIN) / pixelsPerSecond;
			context.fillText(Math.round(newSimTime) + " sec", dragPrevX < (LEFT_TIME_MARGIN + 10) ? dragPrevX : dragPrevX - 15, 40);
		}
	}, [ sliderData, canvasWidth, canvasHeight ]);

	// Render current time marker when currentTimePos changes
	useEffect(() => {
		if (!currentTimePos) {
			return;
		}

		const canvas = currTimeCanvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 30, canvasWidth, canvasHeight - 30); // The portion on top is for steppers

		// Draw current pos
		context.fillStyle = "#4db5f4";
		context.fillRect(currentTimePos - 2, 46, 4, canvasHeight - 46);
		context.font = "14px roboto";
		context.fillStyle = "#fff";
		context.textAlign = "start";
		context.fillText(Math.round(currentSimulation.playStatus.simTime) + " sec", currentTimePos < (LEFT_TIME_MARGIN + 10) ? currentTimePos : currentTimePos - 15, 40);
	}, [ currentTimePos, canvasWidth, canvasHeight ]);

	// Render steppers when stepper data changes
	useEffect(() => {
		const canvas = currTimeCanvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvasWidth, 30);

		if (!stepperData) {
			return;
		}

		context.font = "bold 10px roboto";
		context.textAlign = "center";
		stepperData.forEach((stepperDatum, index) => {
			context.fillStyle = "#828283";
			context.beginPath();
			context.moveTo(stepperDatum.x, STEPPER_TOP);
			context.lineTo(stepperDatum.x - (STEPPER_DIMENSION/2), STEPPER_TOP + (STEPPER_DIMENSION/2));
			context.lineTo(stepperDatum.x, STEPPER_TOP + STEPPER_DIMENSION);
			context.lineTo(stepperDatum.x + (STEPPER_DIMENSION/2), STEPPER_TOP + (STEPPER_DIMENSION/2));
			context.closePath();
			context.fill();
			context.fillStyle = "#fff";
			context.fillText(index + 1, stepperDatum.x, 21);
		});
	}, [stepperData, canvasWidth, canvasHeight]);

	// Render event type labels and event bars
	useEffect(() => {
		if (!pixelsPerSecond || !events) {
			return;
		}

		const canvas = eventsCanvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvasWidth, canvasHeight);

		// Render background for event type labels and the vertical divider line
		context.fillStyle = "rgba(46, 46, 47, 0.8)"; //"#2e2e2f"
		context.fillRect(0, 0, 130, canvasHeight);
		context.strokeStyle = "#212124";
		context.shadowBlur = 2;
		context.shadowColor = "#0000009f";
		context.shadowOffsetX = 2;
		context.beginPath();
		context.moveTo(EVENT_LABEL_WIDTH, 0);
		context.lineTo(EVENT_LABEL_WIDTH, canvasHeight);
		context.stroke();
		context.shadowColor = "transparent";

		const eventBars = {};
		let eventTypeIndex = -1;
		let effectiveConfig = timelineSettings;
		if (!effectiveConfig) {
			effectiveConfig = eventUtilities.createDefaultObject(true);
		}
		const eventClassifications = eventUtilities.getEventClassifications();
		eventClassifications.forEach(ec => {
			_.keys(effectiveConfig).forEach(team => {
				if (effectiveConfig[team][ec.classification]) {
					if (!eventBars[ec.classification]) {
						eventBars[ec.classification] = { index: ++eventTypeIndex, description: ec.description, teams: [], bars: [] };
					}
					eventBars[ec.classification].teams.push(team);
				}
			});
		});

		if (eventTypeIndex < 0) {
			return;
		}

		// Render event type labels and row dividers
		context.fillStyle = "#b5b9be";
		context.font = "11px roboto";
		context.textAlign = "right";
		context.strokeStyle = "#29707070";
		_.values(eventBars).forEach(eventBar => {
			context.fillText(eventBar.description, EVENT_LABEL_WIDTH - 15, 55 + (eventBar.index * 12));
			context.beginPath();
			context.moveTo(130, 57 + (eventBar.index * 12));
			context.lineTo(canvasWidth, 57 + (eventBar.index * 12));
			context.stroke();
		});

		if (!events.length) {
			return;
		}

		const blockSizeInPixels = 6;
		const eventBlockSize = blockSizeInPixels / pixelsPerSecond; // Size of each block in seconds, each event block is of 4 pixels

		events.forEach(event => {
			if (!eventBars[event.classification]) {
				return;
			}

			const team = event.getTeam(simulationData);
			const eventBarData = eventBars[event.classification];
			if (!eventBarData.teams.includes(team)) {
				return;
			}

			let currentBarData;
			if (!eventBarData.bars.length || eventBarData.bars[eventBarData.bars.length - 1].upperTimeLimit < event.effectiveTime) {
				const eventBlock = Math.floor(event.effectiveTime / eventBlockSize) + 1;
				currentBarData = {
					lowerPixelLimit: (eventBlock * blockSizeInPixels) + LEFT_TIME_MARGIN - (eventBlock == 0 ? 0 : blockSizeInPixels - 1),
					upperPixelLimit: (eventBlock * blockSizeInPixels) + LEFT_TIME_MARGIN,
					lowerTimeLimit: (eventBlock - 1) * eventBlockSize,
					upperTimeLimit: eventBlock * eventBlockSize,
					events: {}
				};
				eventBarData.bars.push(currentBarData);
			} else {
				currentBarData = eventBarData.bars[eventBarData.bars.length - 1];
			}
			if (!currentBarData.events[team]) {
				currentBarData.events[team] = [];
			}
			currentBarData.events[team].push(event);
		});

		_.values(eventBars).forEach(eventBarData => {
			eventBarData.bars.forEach(bar => {
				let fillColor = "#800080";
				const teams = _.keys(bar.events);
				if (teams.length == 1 && teamsConfig) {
					// We have all events for the same team, so we use team color
					fillColor = teamsConfig[teams[0]].primaryColor;
				}
				context.fillStyle = fillColor;
				context.fillRect(bar.lowerPixelLimit + 1, 48 + (eventBarData.index * 12), blockSizeInPixels - 2, 6);
			});
		});

		setEventBarData(eventBars);
	}, [ events, pixelsPerSecond, canvasHeight, timelineSettings, teamsConfig ]);

	// Render event line hover
	useEffect(() => {
		const canvas = baseCanvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 45, canvasWidth, canvasHeight - 32 - 45);

		if (eventLineHoverData) {
			context.fillStyle = "#2e2e2f";
			context.fillRect(0, eventLineHoverData, canvasWidth, 12);
		}
	}, [eventLineHoverData, canvasWidth, canvasHeight]);

	const renderEvents = () => {
		const events = [];
		_.keys(eventsToDisplay.events).forEach(team => events.push(...eventsToDisplay.events[team]));
		const orderedEvents = _.orderBy(events, "effectiveTime", "desc");
		return orderedEvents.map(event => {
			return (
				<Fragment key={event.event.id}>
					<div className="timelinePopoverEvent">
						<div style={{width: 48}}>
							<TargetingIconContainer 
								entities={event.getEntityTargets(agents, simulationData)}
								geometries={event.getGeometryTargets()}
							/>
						</div>
						<div 
							className="dot" 
							style={dir == "rtl" ? {
								backgroundColor: teamsConfig[event.getTeam(simulationData)].primaryColor,
								marginRight: 3
							} : {
								backgroundColor: teamsConfig[event.getTeam(simulationData)].primaryColor,
								marginLeft: 3
							}} 
						/>
						<div className="eventText">
							<EventTextContainer eventData={event.getData(agents, simulationData)} />
						</div>
					</div>
					<Divider classes={{root: popoverClasses.divider}} />
				</Fragment>
			);
		});
	};

	return (
		<Measure
			bounds
			onResize = {contentRect => { 
				if (containerWidth !== contentRect.bounds.width) { 
					setContainerWidth(contentRect.bounds.width);
				}
			}}
		>
			{({ measureRef }) => (
				<div ref={measureRef} style={{flexGrow: 1, position: "relative", height: `${canvasHeight}px`}}>
					<canvas 
						ref={baseCanvasRef}
						className="timelineCanvas" 
						style={{zIndex: 1}} 
					/>
					<canvas 
						ref={eventsCanvasRef} 
						className="timelineCanvas" 
						style={{zIndex: 2}} 
					/>
					<canvas
						ref={currTimeCanvasRef}
						className="timelineCanvas" 
						style={{zIndex: 3}} 
					/>
					<canvas
						ref={sliderCanvasRef}
						className="timelineCanvas" 
						style={{zIndex: 4}} 
						onMouseMove={handleMouseMove} 
						onMouseLeave={handleMouseLeave}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
					/>
					{ eventsToDisplay && 
						<Popover 
							open={true}
							onClose={() => setEventsToDisplay(null)}
							anchorReference="anchorPosition"
							anchorPosition={dir == "rtl" ? {right: eventsToDisplay.x, top: eventsToDisplay.y} : {left: eventsToDisplay.x, top: eventsToDisplay.y}}
							classes={{paper: popoverClasses.paper}}
						>
							<div>
								{ renderEvents() }
							</div>
						</Popover>
					}
				</div>
			)}
		</Measure>
	);
};

Timeline.propTypes = propTypes;
export default Timeline;