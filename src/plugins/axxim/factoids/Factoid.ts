export class Factoid {

	factoid:string;
	content:string;
	owner:string;
	channel:string;
	forgotten:boolean;
	locked:boolean;
    hits:Date[];
	createdAt:string;

	mongoose:any;
	database:any = false;

	constructor(database:any) {
		this.setDatabase(database);
	}

	setDatabase(database:any) {
		this.mongoose = database;

		var models = this.mongoose.modelSchemas;

		// Make sure we don't make two models
		if (models['Factoid'] === undefined) {
			var factoidSchema = this.mongoose.Schema(this.generateMongooseSchema());
			this.database = this.mongoose.model('Factoid', factoidSchema);
		} else {
			this.database = this.mongoose.model('Factoid');
		}
	}

	findAll(cb: any) {
		this.database.find({forgotten: false}, null, {sort: { factoid: 1 }}, cb);
	}

    search(query:string, cb: (err: any, results: any) => any) {
        // Escape "query" for usage in a regex pattern
        var query = query.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

        this.database.find({
            forgotten: false,
            $or: [
                // Search by name
                {
                    factoid: new RegExp(query, 'i')
                },
                // Search by contents
                {
                    content: new RegExp(query, 'i')
                }
            ]
        }, 'factoid', {
            sort: {
                factoid: 1
            }
        }, cb);
    }

	active(factoid:string, cb:any) {
		var query = this.database.findOne({
			factoid: factoid,
			forgotten: false
		}).sort({createdAt: -1});

		query.exec(cb);
	}

	history(factoid:string, cb:any) {
		this.database.find({
			factoid: factoid,
			forgotten: true
		}, cb);
	}

    // Example usage of the hits array.
    // Could be rendered as a graph and would look very cool.
    hitsPerDay(_id:any, cb:any) {
        this.database.findOne({
            _id: _id
        }, function(err, result) {
            if (err)
                cb(err, null);

            var hits = {};
            result.hits.map(function(hit) {
                // Group hits by day
                var day = new Date(hit.setHours(0, 0, 0));

                if(!hits[day])
                    hits[day] = 1;
                else
                    hits[day]++;
            });

            cb(null, hits);
        });
    }

	forgetActive(factoid:string, cb:any, lockedOverride:boolean = false) {
		var database = this.database;
		this.active(factoid, function forgetFactoid(err, factoid) {
			if (!factoid) {
				// No results
				err = 'Factoid was not found';
			}
			if (err) {
				cb(err, null);
				return;
			}

			if(!lockedOverride && factoid.locked) {
				cb('Factoid is locked.', null);
				return;
			}

			database.update(factoid, {
				$set: { forgotten: true }
			}, cb);

		});
	}

	save(cb:any, lockedOverride:boolean = false):any {
		// Create a temporary ORM object for the factoid
		var factoid = new this.database({
			factoid: this.factoid,
			channel: this.channel,
			content: this.content,
			owner: this.owner
		});

		// Set existing factoids of the same name to forgotten: true
		this.forgetActive(this.factoid, function(err, numAffected){
			if(err && err != 'Factoid was not found'){
				// Delete the temporary object
				delete factoid;

				cb(null, err, null);
				return;
			}

			factoid.save(cb.bind(this, numAffected));
		}, lockedOverride);
	}

    static hit(factoid:any, cb:any) {
        factoid.hits.addToSet(Date.now());
        factoid.save();
    }

	generateMongooseSchema() {
		return {
			factoid: String,
			content: String,
			owner: String,
			channel: String,
			forgotten: {type: Boolean, default: false},
			locked: {type: Boolean, default: false},
            hits: {type: [Date], default: []},
			createdAt: {type: Date, default: Date.now}
		};
	}

}