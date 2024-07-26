import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'
import { DBMyTable, MyTableData, MyTableField } from './mytable';

async function run() {
	console.log('open');
	const db = await open({ filename: './data/db1.db', driver: sqlite3.Database });
	const mytable = new DBMyTable(db);
	await mytable.create();

	const test: MyTableData[] = []
	for (let i = 0; i < 10; i++) {
		test.push({ first_name: `first name ${i}`, last_name: `last name ${i}`, int_value: i, bool_value: i % 2 == 0 })
	}
	console.log('inserting ', test.length)
	await mytable.insert(test);
	let r = await mytable.getAll();
	console.log('got ', r?.length)
	r = await mytable.getAll([ MyTableField.id, MyTableField.last_name]);
	// console.log(r)
}

run();

console.log('hello from main')