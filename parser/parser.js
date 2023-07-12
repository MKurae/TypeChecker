import {lexer} from "../lexer/lexer.js";
import { Abstraction, Application, Arrow, Judgement, Variable } from "./expression.js";

//Parser class
export class parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;//position in the token array
    }

    hasNext() {//returns true if there are more tokens to parse
        return this.current < this.tokens.length;
    }

    peek() {//returns the next token without consuming it
        if (this.current >= this.tokens.length) {
            return null;//end of file
        }
        return this.tokens[this.current];
    }

    consume() {//consumes the next token and returns it
        this.current++;
        return this.tokens[this.current-1];
    }

    Parse() {//parses the tokens and returns an expression
        var judgement = new Judgement;
        judgement.left = this.expr();
        this.consume();
        judgement.right = this.type();
        if (this.hasNext()) {//if there are more tokens, and it has ended with parsing, there is an error
            console.error("error: remaining unparsed tokens");
            process.exit(1);
        }
        
        return judgement;
    }

    expr() {
        var result = this.lexpr();//go to lexpr
        while (this.hasExpr() && this.peek().Type != lexer.TYPE_COLON) {//while there are more expressions
            //result is the left child of the application, and the next expression is the right child
            var app = new Application(result, this.lexpr());
            result = app;//set the result to the further expressed 
        }
        return result;
    }

    hasExpr() {//returns true if there is an expression after the current token
        return this.hasNext() && (this.peek().Type == lexer.TYPE_VAR ||
            this.peek().Type == lexer.TYPE_OPEN_PAREN ||
            this.peek().Type == lexer.TYPE_LAMBDA);
    }

    lexpr() {
        if (this.hasNext() && this.peek().Type == lexer.TYPE_LAMBDA) {//if the next token is a lambda
            this.consume();//consume the lambda
            var a = new Abstraction();//create a new abstraction
            if (this.hasNext() && this.peek().Type == lexer.TYPE_VAR) {
                a.dak.name = this.consume().String;//set the name of the abstraction to the next token
            } else {//if there is no variable after the lambda
                console.error("error: expected variable");
                process.exit(1);
            } 
            //Every abstraction has a type
            if (this.hasNext() && this.peek().Type == lexer.TYPE_DAK) {
                this.consume();
                var parenthesis = false;
                if (this.hasNext() && this.peek().Type == lexer.TYPE_OPEN_PAREN) {
                    parenthesis = true;
                    this.consume();
                }

                if(this.hasNext() && this.peek().Type == lexer.TYPE_UVAR){
                    a.dak.type = this.type();//parse the type
                } else {
                    console.error("error: expected type");
                    process.exit(1);
                }

                if (this.hasNext() && this.peek().Type == lexer.TYPE_CLOSE_PAREN) {
                    this.consume();
                } else if (parenthesis) {
                    console.error("error: missing closing parenthesis");
                    process.exit(1);
                }
            } else {//if there is no dak after the lambda
                console.error("error: expected dak");
                process.exit(1);
            }

            if (this.hasNext() && this.peek().Type == lexer.TYPE_DOT) {
                this.consume();//consume the dot
                a.body = this.expr();//set the body of the abstraction to expr
            } else {
                a.body = this.lexpr();//set the body of the abstraction to lexpr
            }
            return a;
        } else {
            return this.pexpr();//go to pexpr if there is no lambda
        }
    }

    pexpr() {
        if (this.hasNext() && this.peek().Type == lexer.TYPE_VAR) {
            var v = new Variable(this.consume().String);//create a new variable with the next token
            return v;
        } else if (this.hasNext() && this.peek().Type == lexer.TYPE_OPEN_PAREN) {
            this.consume();//consume the open parenthesis
            var e = this.expr();//set the expression to expr
            if (this.hasNext() && this.peek().Type == lexer.TYPE_CLOSE_PAREN) {
                this.consume();//consume the close parenthesis
                return e;
            } else {//if there is no close parenthesis
                console.error("error: missing closing parenthesis");
                process.exit(1);
            }
        }
        else {//if there is no variable or open parenthesis
            console.error("error: expected expression");
            process.exit(1);
        }
    }

    //type = etype -> type | etype
    type(){// A -> (B -> C) 
        var t = this.etype(); //go to etype
        while(this.hasNext() && this.peek().Type == lexer.TYPE_ARROW){ //while there is an arrow
            this.consume();//(B -> C)
            //create new arrow with the left child being t and the right child being the rest of the type
            var a = new Arrow(t, this.type());
            t = a;
        }
        return t;
    }

    etype(){ //UVAR | (type)
        if (this.hasNext() && this.peek().Type == lexer.TYPE_UVAR) {
            var v = new Variable(this.consume().String);//create a new variable with the next token
            return v;
        } else if (this.hasNext() && this.peek().Type == lexer.TYPE_OPEN_PAREN) {
            this.consume();//consume the open parenthesis
            var t = this.type();//set the expression to expr
            if (this.hasNext() && this.peek().Type == lexer.TYPE_CLOSE_PAREN) {
                this.consume();//consume the close parenthesis
                return t;
            } else {//if there is no close parenthesis
                console.error("error: missing closing parenthesis");
                process.exit(1);
            }
        }
        else {
            console.error("error: expected type");
            process.exit(1);
        }
    }
}
