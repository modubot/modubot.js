module.exports = function (grunt) {

	grunt.initConfig({
		typescript: {
			base: {
				src: ['plugins/**/*.ts'],
				dest: 'plugins',
				options: {
					module: 'commonjs', //or commonjs
					target: 'es6', //or es3
					base_path: 'plugins',
					sourcemap: true,
					fullSourceMapPath: true,
					declaration: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-typescript');

	// Default task(s).
	grunt.registerTask('default', ['typescript']);

};
