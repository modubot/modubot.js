var create_logging_table = new Migration({
	up: function () {
		this.create_table('logs', function (t) {
			t.column('id', 'integer', {'auto_increment': true});
			t.column('channel', 'string', {default_value: null});
			t.string('from');
			t.string('mentions');
			t.text('message');
			t.column('created_at', 'timestamp', {'default': 'NOW()'});

			t.primary_key('id');
			t.key('channel');
		});
	},
	down: function () {
		this.drop_table('logs');
	}
});
