import sqlite3 from 'sqlite3';
import { Database } from 'sqlite'

/*
	https://sqldocs.org/sqlite/introduction/
	https://www.npmjs.com/package/sqlite#getting-a-single-row
	https://github.com/TryGhost/node-sqlite3/wiki/API
*/
export enum TableFieldType {
	string = 'TEXT',
	int = 'INTEGER',
	bool = 'INTEGER',
	float = 'REAL'
}
export interface TableField<TFieldEnum> {
	name: TFieldEnum;
	type: TableFieldType;
	isPrimaryKey?: boolean;
}

export class DBTable<TData extends object, TFieldEnum> {
	protected _fields: TableField<TFieldEnum>[] = [];
	constructor(protected _db: Database, protected _name: string) {
	}
	public async exists(): Promise<boolean> {
		const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${this._name}'`;
		const table = await this._db.get<{ name: string }>(sql);
		return table !== undefined;
	}
	public async create() {
		const fields: string[] = []
		this._fields.forEach(f => {
			if (f.isPrimaryKey) {
				fields.push(`${f.name} ${f.type} PRIMARY KEY`)
			} else {
				fields.push(`${f.name} ${f.type}`)
			}
		})
		const sql = `CREATE TABLE IF NOT EXISTS ${this._name} ( ${fields.join(', ')} )`
		await this._db.exec(sql);
	}
	public async getAll<TData>(fields?: TFieldEnum[]): Promise<TData[] | null> {
		const fieldNames = fields ? fields.join(', ') : '*';
		const sql = await this._db.prepare(`SELECT ${fieldNames} FROM ${this._name}`);
		const r = await sql.all();
		return r;
	}
	public async insert(drecords: TData[], fields?: TFieldEnum[]) {
		
		let fieldsToInsert: TableField<TFieldEnum>[] = [];
		if (!fields) {
			fieldsToInsert = [...this._fields]
		}
		fields?.forEach( fieldType => {
			const field = this._fields.find( field => field.name === fieldType ) 
			if (field) {
				fieldsToInsert.push(field)
			}
		})
		// const fieldNames = fieldsToInsert.map(f => f.name).join(', ');
		// const valuesString = fieldsToInsert.map(f => '?').join(', ');
		// const queryString = `INSERT INTO ${this._name} (${fieldNames}) VALUES(${valuesString})`
		// console.log('queryString', queryString)
		// await this._db.run('BEGIN')
		// const sql = await this._db.prepare(queryString);
		// records.forEach(async (r: any) => {
		// 	const values: any[] = [];
		// 	fieldsToInsert.forEach( f => values.push(r[f.name]))
		// 	await sql.run(values)
		// })
		// await this._db.run('COMMIT')
		const tableName = this._name;

		let records: any[] = [];
		for (let i = 0; i < 20; i++) {
			records.push({ first_name: 'a', last_name: 'b'})
		}
		console.log('insert', records.length)

		await this._db.run('BEGIN')
		let sql = await this._db.prepare(`INSERT INTO ${tableName} (first_name, last_name) VALUES(?, ?)`);
		records.forEach(async (r: any) => await sql.run([r.first_name, r.last_name]));
		await this._db.run('COMMIT')

		sql = await this._db.prepare(`SELECT * FROM ${tableName}`);
		let r = await sql.all();
		console.log('got', r.length)
		setTimeout( async () => {
			let r = await sql.all();
			console.log('got', r.length)
				
		}, 100);

	}
}
