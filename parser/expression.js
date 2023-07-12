
//class that holds an expression as a string
export class Expression {
	ToString() {}
}

//class that holds an abstraction, its name and body
// in the AST and can return it as a string
export class Abstraction extends Expression {
	constructor() {
		super();
		this.dak = new Dak();
		this.body = new Expression();
	}

	ToString() {
		return `(λ${this.dak.ToString()} ${this.body.ToString()})`;
	}//add parenthesis around the abstraction

}

//class for the name and type of an abstraction
//in the AST
export class Dak extends Expression {
	constructor() {
		super();
		this.name = ""; //LVAR
		this.type = ""; //UVAR
	}

	ToString() {
		return `${this.name}^${this.type.ToString()}`;
	}
}

//class that holds an application, its left and right
//child in the AST
export class Application extends Expression {
	constructor(left, right) {
		super();
		this.left = left;
		this.right = right;
	}

	ToString() {
		return `(${this.left.ToString()} ${this.right.ToString()})`;
	}//add parenthesis around the application
}

//class that holds a variable in the AST
export class Variable extends Expression {
	constructor(data) {
		super();
		this.data = data;
	}
	ToString() {
		return this.data;
	}
}

//class that holds a judgement, its left and right
export class Judgement extends Expression {
	constructor(left, right) {
		super();
		this.left = left;
		this.right = right;
	}
	ToString() {
		return `${this.left.ToString()} : ${this.right.ToString()}`;
	}
}


export class Arrow extends Expression {
	constructor (left, right) {
		super();
		this.left = left;
		this.right = right;
	}
	ToString() {
		return `(${this.left.ToString()} -> ${this.right.ToString()})`;
	}
}

