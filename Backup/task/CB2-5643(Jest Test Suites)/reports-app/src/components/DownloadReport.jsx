import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";

const DownloadReport = () => {
	
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		const handle = params.handle;
		const fileType = params.fileType;
		const link = document.createElement("a");
		link.setAttribute("href", `/_download?handle=${handle}`);
		link.setAttribute("download", `report.${fileType}`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		navigate("/");
	}, []);

	return (
		<div>
		</div>
	);
};

export default DownloadReport;