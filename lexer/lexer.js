import { Token } from "./token.js";

function isWS(c) {//whitespace
	return (c == ' ' || c == '\t');
}

function isNL(c) {//new line
	return (c == '\r' || c == '\n');
}

function isLvar(c) {//kleine letter
	return (/[a-z]/.test(c));
}

function isUvar(c){//grote letter
	return (/[A-Z]/.test(c));
}

function isNotVar(c){//regex for unicode
	return (/[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007F]/gm).test(c);
}

//lexer class
export class lexer {
	//enum for token types
	static TYPE_UNKNOWN = 0;
	static TYPE_VAR = 1;
	static TYPE_OPEN_PAREN = 2;
	static TYPE_CLOSE_PAREN = 3;
	static TYPE_LAMBDA = 4;
	static TYPE_DOT = 5;
	static TYPE_WS = 6;
	static TYPE_NL = 7;
	static TYPE_DAK = 8;
	static TYPE_UVAR = 9;
	static TYPE_ARROW = 10;
	static TYPE_COLON = 11;

	static Tokenize(input) {
		var tokens = [];//array of tokens
		var length = input.length;

		for (var i = 0; i < length; i++) {
			var token = new Token();//create new token
			var c = input[i];

			switch (c) {
				case '('://if open paren
					token.Type = this.TYPE_OPEN_PAREN;break;
				case ')'://if close paren
					token.Type = this.TYPE_CLOSE_PAREN;break;
				case '\\': case 'λ'://if lambda
					token.Type = this.TYPE_LAMBDA;break;
				case '.'://if dot
					token.Type = this.TYPE_DOT;break;
				case '^'://if dakje
					token.Type = this.TYPE_DAK;break;
				case '-':
					if (input[i + 1] == '>') {
						token.Type = this.TYPE_ARROW;
					}
					i++;
					break;
				case ':':
					token.Type = this.TYPE_COLON;break;
			}
			if (token.Type != this.TYPE_UNKNOWN) {//if token type is not unknown
				tokens.push(token);//add token to array
				continue;
			}

			if (isLvar(c)) {//if it starts with a letter
				var lexeme = c;
				token.Type = this.TYPE_VAR;//set token type to var
				for (; i+1 < length; i++) {
					c = input[i+1];//get next char
					if (isNotVar(c)) {//if not part of the regex
						break;
					}
					lexeme += c;//add to lexeme
				}
				token.String = lexeme;//set token string to lexeme
				tokens.push(token);//add token to array
				continue;
			}

			if (isUvar(c)) {//if it starts with a letter
				var lexeme = c;
				token.Type = this.TYPE_UVAR;//set token type to var
				for (; i+1 < length; i++) {
					c = input[i+1];//get next char
					if (isNotVar(c)) {//if not part of the regex
						break;
					}
					lexeme += c;//add to lexeme
				}
				token.String = lexeme;//set token string to lexeme
				tokens.push(token);//add token to array
				continue;
			}

			if (isWS(c)) {//if whitespace
				token.Type = this.TYPE_WS;
				for (; i+1 < length; i++) {
					c = input[i+1];
					if (!isWS(c)) {
						break;
					}
				}
				continue;
			}

			if (isNL(c)) {//if new line
				token.Type = this.TYPE_NL;
				for (; i+1 < length; i++) {
					c = input[i+1];
					if (!isNL(c)) {
						break;
					}
				}
				tokens.push(token);
				continue;
			}
			console.error("error: undefined character: '" + c + "'");
			process.exit(1);//exit if undefined character
		}
		return tokens;
	}
	// returns a list(a line) of a list of tokens
	static Split(tokens) {
		var output = [];
		var run = []; // the list of tokens

		for (var t of tokens) {
			if (t.Type == lexer.TYPE_NL) {
				output.push(run);
				run = [];
			} else {
				run.push(t);
			}
		}
		if (run.length > 0) output.push(run);
		return output;
	}
}