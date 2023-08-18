import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import Dropzone from "react-dropzone";
import { fileStorageService } from "client-app-core";
import T2DialogBox from "../../../shared/components/T2DialogBox";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	guardOrderData: PropTypes.object.isRequired,
	close: PropTypes.func.isRequired,
	handleApiError: PropTypes.func.isRequired,
	displayGuardOrders: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const UploadGuardOrders = ({
	guardOrderData,
	close,
	handleApiError,
	displayGuardOrders,
	dir
}) => {
	const getFileName = () => {
		const formattedGuardName = guardOrderData.name.replace(/ /g, "_").toLowerCase();
		const fileName = `${guardOrderData.orgId}_${formattedGuardName}.pdf`;
		return fileName;
	};
	const [file, setFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState(null);
	const [guardOrdersExist, setGuardOrdersExist] = useState(false);
	const [fileName] = useState(getFileName());

	const bucketName = "tabletop-guard-orders";

	useEffect(() => {
		const checkGuardOrdersExist = async () => {
			try {
				const result = await fileStorageService.fileExists(bucketName, fileName);
				if (result.exists) {
					setGuardOrdersExist(true);
				}
			} catch (err) {
				console.log("Error occurred when checking if guard orders exist: " + err);
			}
		};

		checkGuardOrdersExist();
	}, []);

	const deleteOrders = async () => {
		try {
			await fileStorageService.deleteFile(bucketName, fileName);
			setGuardOrdersExist(false);
		} catch (err) {
			handleApiError(err);
		}
	};

	const handleUpload = async (files) => {
		setFile(files[0]);

		try {
			await fileStorageService.uploadFile(bucketName, fileName, files[0]);
			setUploadStatus(<Translate value="tableopSession.mapBase.contextMenu.uploadGuardOrders.uploadComplete"/>);
		} catch (err) {
			handleApiError(err);
			setUploadStatus(<Translate value="tableopSession.mapBase.contextMenu.uploadGuardOrders.uploadFailed"/>);
		}
	};

	const renderDialogContent = () => {
		return (
			<div style={{ minWidth: 400 }}>
				{guardOrdersExist &&
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ flexGrow: 1 }} className="b1-white"><Translate value="tableopSession.mapBase_contextMenu.uploadGuard.order" /></div>
						<Button onClick={() => displayGuardOrders(guardOrderData.orgId, guardOrderData.name)}><Translate value="tableopSession.mapBase_contextMenu.uploadGuard.view" /></Button>
						<Button onClick={deleteOrders}><Translate value="tableopSession.mapBase_contextMenu.uploadGuard.delete" /></Button>
					</div>
				}
				{!file && (
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ flexGrow: 1 }} className="b1-white"><Translate value="tableopSession.mapBase_contextMenu.uploadGuard.select" /> {guardOrderData.name}</div>
						<Dropzone
							accept="application/pdf"
							onDrop={acceptedFiles => handleUpload(acceptedFiles)}
						>
							{({ getRootProps, getInputProps }) => (
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<Button color="primary"><Translate value="tableopSession.mapBase_contextMenu.uploadGuard.upload" /></Button>
								</div>
							)}
						</Dropzone>
					</div>
				)}
				{uploadStatus &&
					<div className="b1-white">{uploadStatus}</div>
				}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginTop: 20,
						marginBottom: 20
					}}
				>
					<Button style={dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }} onClick={close}>
						<Translate value="tableopSession.mapBase_contextMenu.uploadGuard.cancel" />
					</Button>
					{uploadStatus &&
						<Button color="primary" onClick={close}><Translate value="tableopSession.mapBase_contextMenu.uploadGuard.close" /></Button>
					}
				</div>
			</div>
		);
	};

	return (
		<T2DialogBox
			open={true}
			headline={<Translate value="tableopSession.mapBase_contextMenu.uploadGuard.headline" />}
			onClose={close}
			content={renderDialogContent()}
			dir={dir}
		/>
	);
};

UploadGuardOrders.propTypes = propTypes;

export default UploadGuardOrders;
