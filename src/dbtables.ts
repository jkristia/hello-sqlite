
/*
	collection of tables, used for table data migration
*/

import { Database } from "sqlite";
import { DBTable } from "./dbtable";

export abstract class DBTables {
	protected _tables: DBTable<any, any>[] = [];
	protected _dbVersion: number = 0;
	constructor(protected _db: Database) {}

	public async migrate(): Promise<void> {
		this._db.run('BEGIN TRANSACTION')
		let version = await this.getVersion();
		while (version < this._dbVersion) {
			this._tables.forEach( table => table.migrate(version))
			version++;
		}
		await this.setVersion(version);
		this._db.run('COMMIT')
	}
	private async getVersion(): Promise<number> {
		const r = await this._db.get('pragma user_version')
		return r.user_dbVersion || 0;
	}
	private async setVersion(version: number) {
		console.log('>> set version ', version)
		await this._db.run(`pragma user_version = ${version}`);
		console.log('<< set version ', version)
	}

}