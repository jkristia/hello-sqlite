import { Database } from 'sqlite'
import { DBTable, TableFieldType } from "../dbtable";

export enum MyTableField {
	id = 'id',
	first_name = 'first_name',
	last_name = 'last_name',
	int_value = 'int_value',
	bool_value = 'bool_value',
}
export interface MyTableData {
	readonly id?: number;
	first_name?: string;
	last_name?: string;
	int_value?: number;
	bool_value?: boolean;
}

export class DBMyTable extends DBTable<MyTableData, MyTableField> {
	constructor(db: Database) {
		super(db, 'my_table');
		this._fields = [
			{ name: MyTableField.id, type: TableFieldType.int, isPrimaryKey: true },
			{ name: MyTableField.first_name, type: TableFieldType.string },
			{ name: MyTableField.last_name, type: TableFieldType.string },
			{ name: MyTableField.int_value, type: TableFieldType.int },
			{ name: MyTableField.bool_value, type: TableFieldType.bool },
		]
	}
	public async migrate(toVersion: number): Promise<void> {
	}

}
