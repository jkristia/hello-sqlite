import { Database } from 'sqlite'
import { DBTable, TableFieldType } from "../dbtable";
import { MyDbVersion } from './mydb';

export enum MyTable2Field {
	id = 'id',
	json_data = 'json_data',
}
export interface MyTable2Data {
	readonly id?: number;
	json_data?: string;
}

export class DBMyTable2 extends DBTable<MyTable2Data, MyTable2Field> {
	constructor(db: Database) {
		super(db, 'my_table2');
		this._fields = [
			{ name: MyTable2Field.id, type: TableFieldType.int, isPrimaryKey: true },
			{ name: MyTable2Field.json_data, type: TableFieldType.string },
		]
	}
	public async migrate(toVersion: number): Promise<void> {
		if (toVersion === MyDbVersion.add_table2) {
			await this.create()
		}
	}
}
