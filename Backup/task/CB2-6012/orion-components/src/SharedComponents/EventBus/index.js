//The event bus facilitates decoupling and efficient communication between components that are unaware of each other's existence.
//We can make use of this when context is not supported for communication or when a reducer is not necessary.
class EventBus {
	constructor() {
		this.eventHandlers = {};
	}

	subscribe(event, handler) {
		if (!this.eventHandlers[event]) {
			this.eventHandlers[event] = [];
		}
		this.eventHandlers[event].push(handler);
	}

	publish(event, data) {
		const handlers = this.eventHandlers[event];
		if (handlers) {
			handlers.forEach((handler) => handler(data));
		}
	}
}

export default new EventBus();
