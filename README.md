# TypeChecker
3rd Assignment of Concepts of Programming Languages 
Created by Ashraf El Madkouki (s2869365) and Mirza Kuraesin (s3278395)  
Tested in Node v19.0.1, Ubuntu  

Our program can type check expressions in the simply-typed lambda calculus (for the examples in the 'tst' file).  

We did not deviate as far as we know from the assignment. Our assignment was built off of the base structure
for assignment 1, uploaded to brightspace.  

First of all, we modified the original parser from assignment 1 to be able to parse judgements.
We had to create an extra function that parses the function type with associativity to the right.
When the AST is created, the colon is at the top, on the right the given expression, and on the
left the given type that the expression should match.
To check if the given type is correct we first infer the type of the given expression and at
the end, we match the AST of the two types. If they are the same the judgement is correct else,
the judgement is incorrect and the program terminates.  

We have approached the top-down method to infer the type of the expression.
When it sees an abstraction in the AST it will push the variable and its type into the gamma.
It will also create a new arrow object for the creation of the AST, on its left having the variable and its type,
and on its right the AST of the body of the abstraction, because of right associativity.
If it is at a variable it will search in the gamma for the same variable.
If it does, return the type of the last pushed variable in the gamma, else it terminates the program.
When an application is seen, it will infer the right and left sides of the application with the current gamma.
When the inferred type of the right side is the same as the inferred type of
the left side left type(assuming the top of the AST is an arrow) it will return the AST of the right side,
else it terminates the program.
