import { Abstraction, Application, Arrow, Variable } from "./expression.js";

//simply typed lambda calculus checker
export class checker {
    Check(judgement) {
        var gamma = [];
        var type = this.Inference(judgement.left, gamma);
        if (type.ToString() != judgement.right.ToString()) {//if the type of the expression is not the same as the type of the judgement
            console.error("error: type does not match judgement");
            process.exit(1);
        }
    }

    //infers the type of an expression
    Inference(expression, gamma) {
        if (expression instanceof Abstraction) {//if the expression is an abstraction
            gamma.push(expression.dak);//add the abstraction to the context
            return new Arrow (expression.dak.type, this.Inference(expression.body, gamma))
        } else if (expression instanceof Variable) {//if the expression is an application
            //get the index of the variable in the context
            var lastGamma = gamma.findLastIndex((element) => JSON.stringify(element.name) == JSON.stringify(expression.data));
            if (lastGamma != -1) {//if the variable is in the context
                //if the type of the variable is not the same as the type of the judgement
                if (JSON.stringify(gamma[lastGamma].name) != JSON.stringify(expression.data)) {
                    console.error("error: variable type mismatch");
                    process.exit(1);
                }
                return gamma[lastGamma].type;
            } else {//if the variable is not in the context
                console.error("error: variable not in context");
                process.exit(1);
            }
        } else if (expression instanceof Application) {//if the expression is an application
            var gammacopy = [...gamma];//copy the context
            var left = this.Inference(expression.left, gamma);//infer the type of the left child
            var right = this.Inference(expression.right, gammacopy);//infer the type of the right child
            if (left instanceof Arrow) {//if the type of the left child is an arrow
                //if the right type of the arrow is not the same as the type of the right child
                if (JSON.stringify(left.left) != JSON.stringify(right)) {
                    console.error("error: application type mismatch");
                    process.exit(1);
                }
                return left.right;
            } else {
                console.error("error: application cannot be applied to non-arrow left-type");
                process.exit(1);
            }
        } else {
            console.error("error: unknown expression");
            process.exit(1);
        }
    }
}
