declare module "needle" {
	export function get(url: string, options?:any, callback?: any):string;
	export function head(url: string, options?:any, callback?: any):string;
	export function post(url: string, data:any, options?:any, callback?: any):string;
	export function put(url: string, data:any, options?:any, callback?: any):string;
}
