import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'
import { DBMyTable, MyTableData, MyTableField } from './mytable';

/*
	install sqlite browser
	https://sqlitebrowser.org/dl/

	install in wsl
	```
	sudo add-apt-repository -y ppa:linuxgndu/sqlitebrowser
	sudo apt-get update
	sudo apt-get install sqlitebrowser
	```
	run it from windows statment where it shows as 'db broser sqlite (ubuntu)'
	must'run as admin'

*/


async function run() {
	console.log('open');
	const db = await open({ filename: './data/db1.db', driver: sqlite3.Database });
	const mytable = new DBMyTable(db);
	await mytable.create();

	// const test: MyTableData[] = []
	// for (let i = 0; i < 10; i++) {
	// 	test.push({ first_name: `first name ${i}`, last_name: `last name ${i}`, int_value: i, bool_value: i % 2 == 0 })
	// }
	// console.log('inserting ', test.length)
	// await mytable.insert(test);
	const info = await mytable.describe();
	console.log('info', info)

	let r = await mytable.getAll();
	console.log('got ', r?.length)
	// r = await mytable.getAll([ MyTableField.id, MyTableField.last_name]);
	// console.log(r)
}

run();

console.log('hello from main')