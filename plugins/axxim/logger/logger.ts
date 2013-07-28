///<reference path='../../.ts/node.d.ts' />

export class Plugin {
	name: string;
	title: string;
	version: string;
	author: string;

	irc: any;

	constructor(client) {
		this.name = 'factoids';
		this.title = 'Factoids';
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.irc = client;
	}

	onMessage(from, to, message) {
		console.log(from, to, message);
	}


}
