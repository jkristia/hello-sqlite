import { Database } from 'sqlite'
import { DBTable, TableFieldType } from "../dbtable";
import { MyDbVersion } from './mydb';

export enum MyTableField {
	id = 'id',
	first_name = 'first_name',
	last_name = 'last_name',
	int_value = 'int_value',
	bool_value = 'bool_value',
	fieldv1_1_value = 'fieldv1_1_value',
	fieldv1_2_value = 'fieldv1_2_value',
}
export interface MyTableData {
	readonly id?: number;
	first_name?: string;
	last_name?: string;
	int_value?: number;
	bool_value?: boolean;
	fieldv1_1_value?: string;
	fieldv1_2_value?: string;
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
			{ name: MyTableField.fieldv1_1_value, type: TableFieldType.string },
			{ name: MyTableField.fieldv1_2_value, type: TableFieldType.string },
		]
	}
	public async migrate(toVersion: number): Promise<void> {
		if (toVersion === MyDbVersion.initial) {
			await this.create()
		}
		if (toVersion === MyDbVersion.add_2_fields) {
			const fields = this._fields.filter( f =>
				f.name === MyTableField.fieldv1_1_value ||
				f.name === MyTableField.fieldv1_2_value
			)
			await this.addColumnsToTable(fields);
		}
	}

}
