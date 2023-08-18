import React, { Component } from "react";
import Checkbox from "material-ui/Checkbox";
import { Translate } from "orion-components/i18n/I18nContainer";

class AlertTable extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// If toggled priority, toggle notifySystem if not already toggled
	handlePriorityToggle = (user, assigned) => {
		const { assignments, toggleAssignment } = this.props;
		const system = assignments[user.id]["notifySystem"];
		console.log("system", system);
		if (!assigned && !system) {
			toggleAssignment(user, "notifySystem");
		}
		toggleAssignment(user, "isPriority");
	};

	render() {
		const {
			user,
			canShare,
			myOrgUsers,
			assignments,
			toggleAssignment
		} = this.props;
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
									<th>
										<span className="gets-alerts"><Translate value="createEditRule.components.alertTable.whoGetsAlert"/></span>
									</th>
									<th className="priority">
										<span className="break-icon">
											<i className="material-icons">error</i>
										</span><Translate value="createEditRule.components.alertTable.priority"/>
									</th>
									<th>
										<span className="break-icon">
											<i className="material-icons">laptop</i>
										</span><Translate value="createEditRule.components.alertTable.system"/>
									</th>
									<th>
										<span className="break-icon">
											<i className="material-icons">email</i>
										</span><Translate value="createEditRule.components.alertTable.emails"/>
									</th>
									{/* FIXME: Disabling until push notifications are resolved <th><span className="break-icon"><i className="material-icons">phone_iphone</i></span>Push</th> */}
								</tr>
							</thead>
							<tbody>
								{users.map(user => (
									<tr key={user.id}>
										<td>{user.name}</td>
										<td>
											<Checkbox
												checked={assignments[user.id]["isPriority"]}
												onClick={() =>
													this.handlePriorityToggle(
														user,
														assignments[user.id]["isPriority"]
													)
												}
												style={{
													width: "auto"
												}}
											/>
										</td>
										<td>
											<Checkbox
												checked={assignments[user.id]["notifySystem"]}
												onClick={() => toggleAssignment(user, "notifySystem")}
												style={{
													width: "auto"
												}}
												disabled={assignments[user.id]["isPriority"]}
											/>
										</td>
										<td>
											<Checkbox
												checked={assignments[user.id]["notifyEmail"]}
												onClick={() => toggleAssignment(user, "notifyEmail")}
												style={{
													width: "auto"
												}}
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
	}
}

export default AlertTable;
