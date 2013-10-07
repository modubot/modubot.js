declare module "js-yaml" {
	export function load(yaml: string, options?:{
		filename?: string;
		strict?: boolean;
		schema?: string;
	}):string;
}
