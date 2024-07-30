import sqlite3 from 'sqlite3';
import { Database } from 'sqlite'

/*
	https://sqldocs.org/sqlite/introduction/
	https://sqldocs.org/sqlite/sqlite-nodejs/
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

export abstract class DBTable<TData extends object, TFieldEnum> {
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
	public async describe(): Promise<{ name: string, type: TableFieldType }[]> {
		return await this._db.all(`pragma table_info(${this._name})`)
	}
	public async getAll<TData>(fields?: TFieldEnum[]): Promise<TData[] | null> {
		const fieldNames = fields ? fields.join(', ') : '*';
		const sql = await this._db.prepare(`SELECT ${fieldNames} FROM ${this._name}`);
		const r = await sql.all();
		return r;
	}
	public async insert(records: TData[], fields?: TFieldEnum[]) {

		let fieldsToInsert: TableField<TFieldEnum>[] = [];
		if (!fields) {
			fieldsToInsert = [...this._fields]
		}
		fields?.forEach(fieldType => {
			const field = this._fields.find(field => field.name === fieldType)
			if (field) {
				fieldsToInsert.push(field)
			}
		})
		const fieldNames = fieldsToInsert.map(f => f.name).join(', ');
		const valuesString = fieldsToInsert.map(f => '?').join(', ');
		const queryString = `INSERT INTO ${this._name} (${fieldNames}) VALUES(${valuesString})`
		const sqlStatement = await this._db.prepare(queryString);
		records.forEach(async (r: any) => {
			const values: any[] = [];
			fieldsToInsert.forEach(f => values.push(r[f.name]))
			await sqlStatement.run(values)
		})
		await sqlStatement.finalize();
	}
	public abstract migrate(toVersion: number): Promise<void>;

	protected async addColumnsToTable(columns: TableField<TFieldEnum>[]) {
		const info = await this.describe();
		for (const column of columns) {
			const exist = info.find( i => i.name === column.name);
			if (exist) {
				continue;
			}
			await this._db.exec(`alter table ${this._name} add column ${column.name} ${column.type}`);
		}
	}
}
