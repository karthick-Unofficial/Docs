import React from "react";
import { Checkbox } from "@mui/material";
import { Translate } from "orion-components/i18n";

const AlertTable = ({
	assignments,
	toggleAssignment,
	user,
	canShare,
	myOrgUsers,
	dir
}) => {

	// If toggled priority, toggle notifySystem if not already toggled
	const handlePriorityToggle = (user, assigned) => {
		const system = assignments[user.id]["notifySystem"];
		if (!assigned && !system) {
			toggleAssignment(user, "notifySystem");
		}
		toggleAssignment(user, "isPriority");
	};

	const sortedOrgUsers = myOrgUsers.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}

		return 0;
	});
	const users = canShare ? sortedOrgUsers : [user];

	return (
		<div className="row">
			<div className="row-item fullwidth">
				<div className="alert-table">
					<table>
						<thead>
							<tr className="nobg">
								<th style={dir == "rtl" ? { textAlign: "right", padding: "0 6px 0 0" } : {}}>
									<span className="gets-alerts"><Translate value="alertGenerator.alertTable.whoGetsAlert" /></span>
								</th>
								<th className="priority">
									<span className="break-icon">
										<i className="material-icons">error</i>
									</span><Translate value="alertGenerator.alertTable.priority" />
								</th>
								<th>
									<span className="break-icon">
										<i className="material-icons">laptop</i>
									</span><Translate value="alertGenerator.alertTable.system" />
								</th>
								<th>
									<span className="break-icon">
										<i className="material-icons">email</i>
									</span><Translate value="alertGenerator.alertTable.emails" />
								</th>
								{/* FIXME: Disabling until push notifications are resolved <th><span className="break-icon"><i className="material-icons">phone_iphone</i></span>Push</th> */}
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id}>
									<td style={dir == "rtl" ? { textAlign: "right", padding: "0 6px 0 0" } : {}}>{user.name}</td>
									<td>
										<Checkbox
											checked={assignments[user.id]["isPriority"]}
											onChange={() =>
												handlePriorityToggle(
													user,
													assignments[user.id]["isPriority"]
												)
											}
											sx={{ width: "auto", padding: "0px" }}
										/>
									</td>
									<td>
										<Checkbox
											checked={assignments[user.id]["notifySystem"]}
											onChange={() => toggleAssignment(user, "notifySystem")}
											disabled={assignments[user.id]["isPriority"]}
											sx={{ width: "auto", padding: "0px" }}
										/>
									</td>
									<td>
										<Checkbox
											checked={assignments[user.id]["notifyEmail"]}
											onChange={() => toggleAssignment(user, "notifyEmail")}
											sx={{ width: "auto", padding: "0px" }}
										/>
									</td>
									{/* FIXME: Disabling until push notifications are resolved <td>
												<Checkbox
													checked={this.props.assignments[(user.id)]["notifyPush"]}
													onClick={() => this.props.toggleAssignment(user, "notifyPush")}
													style={{
														width: "auto"
													}}
												/>
											</td> */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AlertTable;
