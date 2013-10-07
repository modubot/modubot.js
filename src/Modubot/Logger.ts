export class Logger {

	debugFile:string;
	errorFile:string;

	constructor() {

	}

	error(...args) {
		this.log('error', args);
	}

	debug(...args) {
		this.log('info', args);
	}

	info(...args) {
		this.log('info', args);
	}

	log(type:string, ...args) {
		var timestamp = Math.round((new Date()).getTime() / 1000);

		console[type]('[' + timestamp + ']', args);
	}

}
