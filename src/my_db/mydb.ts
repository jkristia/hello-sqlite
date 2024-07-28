import { Database } from "sqlite";
import { DBTables } from "../dbtables";
import { DBMyTable } from "./mytable";


export class MyDB extends DBTables {

	constructor(db: Database) {
		super(db)
		this._dbVersion = 1;
		this._tables.push(new DBMyTable(db))
	}
}