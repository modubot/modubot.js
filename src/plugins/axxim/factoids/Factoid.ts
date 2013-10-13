export class Factoid {

	factoid:string;
	content:string;
	owner:string;
	channel:string;
	forgotten:boolean;
	locked:boolean;
	createdAt:string;

	mongoose:any;
	database:any = false;

	constructor(database:any) {
		this.setDatabase(database);
	}

	setDatabase(database:any) {
		this.mongoose = database;

		var models = this.mongoose.modelSchemas;

		// Make sure we dont make two models
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

	generateMongooseSchema() {
		return {
			factoid: String,
			content: String,
			owner: String,
			channel: String,
			forgotten: {type: Boolean, default: false},
			locked: {type: Boolean, default: false},
			createdAt: {type: Date, default: Date.now}
		};
	}

}