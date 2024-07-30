import { Database } from "sqlite";
import { DBTables } from "../dbtables";
import { DBMyTable } from "./mytable";
import { DBMyTable2 } from "./mytable2";

export enum MyDbVersion {
	initial = 0,
	add_2_fields,
	add_table2,
}

export class MyDB extends DBTables {

	constructor(db: Database) {
		super(db)
		this._dbVersion = MyDbVersion.add_table2;
		this._tables.push(new DBMyTable(db))
		this._tables.push(new DBMyTable2(db))
	}
}