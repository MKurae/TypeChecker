import * as fs from 'node:fs/promises';
import {lexer} from './lexer/lexer.js';
import {checker} from './parser/checker.js';
import {parser} from './parser/parser.js';
function check(err) {//when an error occurs or not enough arg, print it and exit
	if (err != null) {
		if (err.code=="ENOENT") {
			console.error("Error: file does not exist.");
		} else {
			console.error(`error: ${err}`);
		}
		process.exit(1);
	}
}
// this function actually processes the data, and will work
// both in browser, as well as Node.JS, or whatever JavaScript
// runtime is given
export function processDataAsString(data) {
	var exps = lexer.Split(lexer.Tokenize(data));//split the data into lines, and tokenize each line
	for (var exp of exps){
		//for (var token of exp){//print tokens
			//console.log(token.ToString());
		//}
		var p = new parser(exp);//get only one expression
		var e = p.Parse();//parse the line
		var q = new parser(lexer.Tokenize(e.ToString()));
		var f = q.Parse();//parses the output of the previous parse
		if (!(e.ToString() == f.ToString())) {//if the two parses are not equal
			console.error("error: parsing output results in different string");
			process.exit(1);
		}
		var Checker = new checker();
		Checker.Check(e);
		console.log(e.ToString());//print the output
	}
}


// this function is executed in the Node.JS environment
export function main() {
   var commandlinearguments = process.argv.splice(2);
	if (commandlinearguments.length < 1) {
		console.error("error: please provide a filename as parameter");
		process.exit(1);
	}
	fs.readFile(commandlinearguments[0], {encoding: 'utf8'}).then(processDataAsString).catch(check);

}
