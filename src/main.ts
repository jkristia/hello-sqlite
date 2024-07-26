import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'

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
export interface TableField {
	name: string;
	type: TableFieldType;
	isPrimaryKey?: boolean;
}

export class DBTable<T> {
	protected _fields: TableField[] = [];
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
	public async getAll<T>(): Promise<T[] | null> {
		const sql = await this._db.prepare(`SELECT * FROM ${this._name}`);
		const r = await sql.all();
		return r;
	}
}

export interface IMyTable1 {
	readonly id?: number;
	first_name?: string;
	last_name?: string;
	int_value?: number;
	bool_value?: boolean;
}

export class DBMyTable1 extends DBTable<IMyTable1> {
	constructor(db: Database) {
		super(db, 'my_table_1');
		this._fields = [
			{ name: 'id', type: TableFieldType.int, isPrimaryKey: true },
			{ name: 'first_name', type: TableFieldType.string },
			{ name: 'last_name', type: TableFieldType.string },
			{ name: 'int_value', type: TableFieldType.int },
			{ name: 'bool_value', type: TableFieldType.bool },
		]
	}
	public async insert(records: IMyTable1[]) {
		this._db.run('BEGIN')
		const sql = await this._db.prepare(`INSERT INTO ${this._name} (first_name, last_name, int_value, bool_value) VALUES(?, ?, ?, ?)`);
		records.forEach(async r => await sql.run(r.first_name, r.last_name, r.int_value, r.bool_value?.toString()))
		this._db.run('COMMIT')
	}
}


async function run() {
	console.log('open');
	const db = await open({ filename: './data/db1.db', driver: sqlite3.Database });
	const mytable = new DBMyTable1(db);
	await mytable.create();

	const test: IMyTable1[] = []
	for (let i = 0; i < 20; i++) {
		test.push({ first_name: `first name ${i}`, last_name: `last name ${i}`, int_value: i, bool_value: i % 2 == 0 })
	}
	await mytable.insert(test);
	await mytable.getAll();
}

run();

console.log('hello from main')