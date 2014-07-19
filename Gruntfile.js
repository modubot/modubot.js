module.exports = function (grunt) {

	grunt.initConfig({
		typescript: {
			base: {
				src: ['src/**/*.ts'],
				dest: 'bin',
				options: {
					module: 'commonjs', //or commonjs
					target: 'es5', //or es3
					basePath: 'src',
					sourcemap: false,
					fullSourceMapPath: false,
					declaration: false
				}
			}
		},
        coffee: {
            glob_to_multiple: {
                expand: true,
                cwd: 'src',
                src: ['**/*.coffee'],
                dest: 'bin',
                ext: '.js'
            }
        },
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/plugins',
						src: ['**', '!**/*.ts', '!**/*.coffee'],
						dest: 'bin/plugins/'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
	grunt.registerTask('default', ['typescript', 'coffee', 'copy']);

};
