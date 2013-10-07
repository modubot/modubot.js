declare module "mongoose" {

	export var connection: any;

	export function connect(uris: string, options?:any, callback?: any):string;

}
