'use strict';

module.exports = function (grunt) {

	grunt.registerMultiTask('typedoc', 'Generate TypeScript docs', function () {
		var options = this.options({});

		var args = [];
		for (var key in options) {
			if (options.hasOwnProperty(key) && (typeof options[key] !== 'boolean' || options[key])) {
				args.push('--' + key);
				if (typeof options[key] !== 'boolean' && !!options[key]) {
					args.push(options[key]);
				}
			}
		}
		for (var i = 0; i < this.filesSrc.length; i++) {
			args.push(this.filesSrc[i]);
		}

		// lazy init
		var path = require('path');
		var child_process = require('child_process');
		var typedoc = path.resolve(__dirname, '..', 'bin', 'typedoc');

		var done = this.async();
		var child = child_process.spawn(typedoc, args, {
			stdio: 'inherit',
			env: process.env
		}).on('exit', function (code) {
			if (code !== 0) {
				done(false);
			}
			if (child) {
				child.kill();
			}
			done();
		});
	});
};