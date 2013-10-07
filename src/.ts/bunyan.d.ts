declare module "bunyan" {
	export function createLogger(options?);
	export function log(type: string, options?);
	export function info(msg?);
	export function debug(msg?);
	export function error(msg?);
}
