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
			forgotten: false
		}, cb);
	}

	forgetActive(factoid:string, cb:any) {
		var database = this.database;
		this.active(factoid, function forgetFactoid(err, factoid) {
			if(factoid.locked) {
				return;
			}

			database.update(factoid, {
				forgotten: true
			}, cb);

		});
	}

	save(cb:any):any {
		// Create a new database entry for this factoid
		var factoid = new this.database({
			factoid: this.factoid,
			content: this.content,
			owner: this.owner
		});
		factoid.save(cb);
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
