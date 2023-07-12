import {lexer} from "./lexer.js"

//Token class
export class Token {
	constructor() {//constructor
		this.Type = lexer.TYPE_UNKNOWN;
		this.String = "";
	}

	ToString() {//returns a string representation of the token
		switch (this.Type) {
			case lexer.TYPE_VAR:
				return "(var:\"" + this.String + "\")"
			case lexer.TYPE_OPEN_PAREN:
				return "(open)"
			case lexer.TYPE_CLOSE_PAREN:
				return "(close)"
			case lexer.TYPE_LAMBDA:
				return "(lambda)"
			case lexer.TYPE_DOT:
				return "(dot)"
			case lexer.TYPE_WS:
				return "(ws)"
			case lexer.TYPE_NL:
				return "(nl)"
			case lexer.TYPE_DAK:
				return "(dak)";
			case lexer.TYPE_UVAR:
				return "(uvar:\"" + this.String + "\")";
			case lexer.TYPE_ARROW:
				return "(arrow)";
			case lexer.TYPE_COLON:
				return "(colon)";
			default:
				return "(?)"
		}
	}
}