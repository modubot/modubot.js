var create_factoids_table = new Migration({
	up: function() {
        this.create_table('factoids', function(t) {
            t.integer('id');
            t.string('factoid');
            t.text('content');
            t.string('owner');
            t.column('channel', 'string', {default_value: null})
            t.boolean('forgotten');
            t.boolean('locked');
            t.primary_key('id');
        });
	},
	down: function() {
        this.drop_table('factoids');
	}
});