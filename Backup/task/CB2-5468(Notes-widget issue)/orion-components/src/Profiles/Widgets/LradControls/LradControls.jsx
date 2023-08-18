import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { lradService } from "client-app-core";
import { FormControlLabel, Checkbox, MenuItem, Slider } from "@mui/material";
import { SelectField } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
	camera: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const LradControls = ({ camera, dir }) => {
	const [ volume, setVolume ] = useState(0);
	const [ tempVolume, setTempVolume ] = useState(0); // Only for purpose of displaying intermediate state on slider
	const [ beamOn, setBeamOn ] = useState(false);
	const [ strobeOn, setStrobeOn ] = useState(false);
	const [ audioFiles, setAudioFiles ] = useState([]);
	const [ selectedAudioFile, setSelectedAudioFile ] = useState("");
	const [ playStatus, setPlayStatus ] = useState("stopped");
	
	const playStatusIntHandleRef = useRef(null);

	const logError = (err, response) => {
		if (err) {
			console.log("Error: " + err);
		} else if (response && response.reason) {
			console.log("Error: " + response.reason.message);
		}
	};

	const handleFetchVolume = (err, response) => {
		if (err || !response || !response.success) {
			logError(err, response);
			return;
		}
		const vol = Math.round(response.volume);
		setVolume(vol);
		setTempVolume(vol);
	};

	const handleFetchBeamInfo = (err, response) => {
		if (err || !response || !response.success) {
			logError(err, response);
			return;
		}
		const { beam, strobe } = response.beamInfo;
		setBeamOn(beam);
		setStrobeOn(strobe);
	};

	const handleFetchAudioFiles = (err, response) => {
		if (err || !response || !response.success) {
			logError(err, response);
			return;
		}
		setAudioFiles(response.files);
	};

	const playAudio = () => {
		if (selectedAudioFile) {
			lradService.playAudio(camera.id, selectedAudioFile, (err, response) => {
				if (err || !response || !response.success) {
					logError(err, response);
					return;
				}
				setPlayStatus("playing");
				const handle = setInterval(checkIfPlaying, 1000);
				playStatusIntHandleRef.current = handle;
			});
		}
	};

	const stopAudio = () => {
		lradService.stopAudio(camera.id, (err, response) => {
			if (err || !response || !response.success) {
				logError(err, response);
				return;
			}
			setPlayStatus("stopped");
			if (playStatusIntHandleRef.current) {
				clearInterval(playStatusIntHandleRef.current);
				playStatusIntHandleRef.current = null;
			}
		});
	};

	const checkIfPlaying = () => {
		lradService.getAudioPlayStatus(camera.id, (err, response) => {
			if (err || !response || !response.success) {
				logError(err, response);
				if (playStatusIntHandleRef.current) {
					clearInterval(playStatusIntHandleRef.current);
					playStatusIntHandleRef.current = null;
				}
				return;
			}
			if (response.playStatus === "stopped") {
				setPlayStatus(response.playStatus);
				if (playStatusIntHandleRef.current) {
					clearInterval(playStatusIntHandleRef.current);
					playStatusIntHandleRef.current = null;
				}
			}
		});
	};

	const updateVolume = (value) => {
		lradService.setVolume(camera.id, value, (err, response) => {
			if (err || !response || !response.success) {
				logError(err, response);
				return;
			}
			setVolume(value);
			setTempVolume(value);
		});
	};

	const toggleBeam = () => {
		if (beamOn) {
			lradService.setBeamOff(camera.id, (err, response) => {
				if (err || !response || !response.success) {
					logError(err, response);
					return;
				}
				setBeamOn(false);
				// Beam off also means strobe off
				setStrobeOn(false);
			});
		} else {
			lradService.setBeamOn(camera.id, (err, response) => {
				if (err || !response || !response.success) {
					logError(err, response);
					return;
				}
				setBeamOn(true);
			});
		}
	};

	const toggleStrobe = () => {
		if (strobeOn) {
			lradService.setStrobeOff(camera.id, (err, response) => {
				if (err || !response || !response.success) {
					logError(err, response);
					return;
				}
				setStrobeOn(false);
				// Strobe off also means beam off
				setBeamOn(false);
			});
		} else {
			lradService.setStrobeOn(camera.id, (err, response) => {
				if (err || !response || !response.success) {
					logError(err, response);
					return;
				}
				setStrobeOn(true);
				// Strobe on also means beam on
				setBeamOn(true);
			});
		}
	};

	useEffect(() => {
		lradService.getVolume(camera.id, handleFetchVolume);
		lradService.getBeamInfo(camera.id, handleFetchBeamInfo);
		lradService.getAudioFiles(camera.id, handleFetchAudioFiles);
	}, []);

	return (
		<div>
			<h5><Translate value="global.profiles.widgets.lradControls.title"/></h5>
			<div style={{display: "flex"}}>
				<div style={dir == "rtl" ? {display: "flex", flexDirection: "column", minWidth: 250, paddingLeft: 10} : {display: "flex", flexDirection: "column", minWidth: 250, paddingRight: 10}}>
					<SelectField
						id="playAudioSelect"
						label={getTranslation("global.profiles.widgets.lradControls.playAudio")}
						handleChange={(e) => setSelectedAudioFile(e.target.value)}
						value={selectedAudioFile}
						underlineShow={false}
						style={{ minWidth: 250 }}
					>
						{audioFiles.map(audioFile => {
							return (
								<MenuItem key={audioFile} value={audioFile}>
									{audioFile}
								</MenuItem>
							);
						})}
					</SelectField>
					{selectedAudioFile && 
						<div style={{display: "flex", marginTop: 20, alignItems: "center"}}>
							{playStatus === "stopped" && // Display Play button
								<svg 
									style={{ margin: 5, cursor: "pointer" }} 
									width={35} 
									height={35} 
									viewBox="0 0 35 35" 
									onClick={() => playAudio()}
								>
									<circle cx="17.5" cy="17.5" r="17.5" fill="#4DB5F4" />
									<path d="M13,11L13,25L24,18Z" fill="#fff" />
								</svg>
							}
							{playStatus === "playing" && // Display Stop button
								<svg 
									style={{ margin: 5, cursor: "pointer" }} 
									width={35} 
									height={35} 
									viewBox="0 0 35 35" 
									onClick={() => stopAudio()}
								>
									<circle cx="17.5" cy="17.5" r="17.5" fill="#4DB5F4" />
									<path d="M12,11L12,25L24,25L24,11Z" fill="#fff" />
								</svg>
							}
							<div style={dir == "rtl" ? { flexGrow: 1, marginRight: 15, display: "flex", flexDirection: "column" } : { flexGrow: 1, marginLeft: 15, display: "flex", flexDirection: "column" }}>
								<div className="b2-bright-gray"><Translate value="global.profiles.widgets.lradControls.volume"/></div>
								<Slider
									value={tempVolume}
									min={0}
									max={100}
									step={1}
									onChange={(e, value) => setTempVolume(value)}
									onChangeCommitted={(e, value) => updateVolume(value)}
									marks={[
										{
										  value: 0,
										  label: "0"
										},
										{
										  value: 100,
										  label: "100"
										}
									]}
									valueLabelDisplay="auto"
								/>
							</div>
						</div>
					}
				</div>
				<div style={{ display: "flex", flexDirection: "column", marginLeft: 50, marginRight: 50 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={beamOn}
								color="primary"
								onChange={() => toggleBeam()}
							/>
						}
						label={getTranslation("global.profiles.widgets.lradControls.beam")}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={strobeOn}
								color="primary"
								onChange={() => toggleStrobe()}
							/>
						}
						label={getTranslation("global.profiles.widgets.lradControls.strobe")}
					/>
				</div>
			</div>
		</div>
	);
};

LradControls.propTypes = propTypes;
export default LradControls;
