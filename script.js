document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const navigationMenu = document.getElementById('navigation-menu');

    function showSection(hash) {
        const targetId = hash ? hash.substring(1) : 'intro';
        
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    navigationMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            if (window.innerWidth < 768) {
                navigationMenu.classList.add('hidden');
                navigationMenu.classList.remove('flex');
            }
        }
    });

    window.addEventListener('hashchange', () => showSection(window.location.hash));
    
    showSection(window.location.hash || '#intro');

    menuToggle.addEventListener('click', () => {
        navigationMenu.classList.toggle('hidden');
        navigationMenu.classList.toggle('flex');
    });

    // Add Copy Buttons to Code Blocks
    const codeBlocks = document.querySelectorAll('.code-block pre');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        block.parentElement.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        });
    });

    // Quiz Logic
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-quiz');
    const resultsContainer = document.getElementById('quiz-results');

    const quizData = [
        // Basics
        { question: "Which keyword is used to declare a variable that cannot be reassigned?", options: ["let", "var", "const", "static"], answer: "const" },
        { question: "What is the result of `typeof null`?", options: ["null", "undefined", "object", "string"], answer: "object" },
        { question: "How do you write a single-line comment in JavaScript?", options: ["// comment", "<!-- comment -->", "/* comment */", "# comment"], answer: "// comment" },
        { question: "What does the `===` operator check for?", options: ["Value only", "Type only", "Value and type", "None of the above"], answer: "Value and type" },
        { question: "What is the result of `'5' == 5`?", options: ["true", "false", "undefined", "error"], answer: "true" },
        { question: "How do you access the first element of an array named `myArray`?", options: ["myArray[1]", "myArray.first()", "myArray[0]", "myArray.get(0)"], answer: "myArray[0]" },
        { question: "Which method adds an element to the end of an array?", options: [".push()", ".pop()", ".shift()", ".unshift()"], answer: ".push()" },
        { question: "What is the logical operator for 'AND'?", options: ["||", "&&", "!", "&"], answer: "&&" },
        { question: "Which statement is used to execute code based on a condition?", options: ["if/else", "for", "while", "switch"], answer: "if/else" },
        { question: "What is the correct syntax for a `for` loop?", options: ["for (i = 0; i < 5)", "for (let i = 0; i < 5; i++)", "for i = 1 to 5", "loop (i from 0 to 5)"], answer: "for (let i = 0; i < 5; i++)" },
        { question: "Which loop is guaranteed to run at least once?", options: ["for", "while", "do...while", "for...of"], answer: "do...while" },
        { question: "How do you define a function in JavaScript?", options: ["function myFunction()", "def myFunction()", "func myFunction()", "create function()"], answer: "function myFunction()" },
        { question: "What keyword is used to return a value from a function?", options: ["return", "yield", "send", "exit"], answer: "return" },
        { question: "A variable declared with `var` has what kind of scope?", options: ["Block scope", "Global scope", "Function scope", "Lexical scope"], answer: "Function scope" },
        { question: "What is the value of a variable that has been declared but not assigned a value?", options: ["null", "0", "undefined", "false"], answer: "undefined" },
        { question: "How do you get the number of elements in an array `arr`?", options: ["arr.size", "arr.count", "arr.length", "arr.elements"], answer: "arr.length" },
        { question: "What does the `%` operator do?", options: ["Percentage", "Multiplication", "Exponentiation", "Remainder (Modulus)"], answer: "Remainder (Modulus)" },
        { question: "Which of these is NOT a primitive data type?", options: ["String", "Number", "Array", "Boolean"], answer: "Array" },
        { question: "How do you create an object literal?", options: ["let obj = {}", "let obj = new Object()", "let obj = []", "let obj = object()"], answer: "let obj = {}" },
        { question: "What method converts a string to an integer?", options: ["parseInt()", "toString()", "toFixed()", "parseFloat()"], answer: "parseInt()" },
        { question: "What is the result of `true || false`?", options: ["true", "false", "undefined", "error"], answer: "true" },
        { question: "Which is a 'falsy' value?", options: ["'0'", "[]", "{}", "0"], answer: "0" },
        { question: "How do you access a property `name` of an object `user`?", options: ["user->name", "user.name", "user(name)", "user::name"], answer: "user.name" },
        { question: "Which loop is best for iterating over the values of an array?", options: ["for...in", "while", "for...of", "for"], answer: "for...of" },
        { question: "What is the purpose of the `break` statement in a `switch`?", options: ["To end the loop", "To skip an iteration", "To exit the switch block", "To return a value"], answer: "To exit the switch block" },
        { question: "Which keyword is used to declare a modern, block-scoped variable?", options: ["var", "let", "const", "both let and const"], answer: "both let and const" },
        { question: "What is the result of `10 + '5'`?", options: ["15", "'105'", "105", "error"], answer: "'105'" },
        { question: "How do you call a function named `myFunction`?", options: ["call myFunction", "myFunction()", "run myFunction", "myFunction"], answer: "myFunction()" },
        { question: "Which is NOT a valid variable name?", options: ["_myVar", "$myVar", "1myVar", "myVar1"], answer: "1myVar" },
        { question: "What does `!true` evaluate to?", options: ["true", "false", "undefined", "null"], answer: "false" },
        { question: "Which method removes the last element from an array?", options: [".push()", ".pop()", ".shift()", ".slice()"], answer: ".pop()" },
        { question: "What is the convention for multi-word variable names in JavaScript?", options: ["snake_case", "kebab-case", "PascalCase", "camelCase"], answer: "camelCase" },
        { question: "What is the starting index of an array?", options: ["1", "0", "-1", "A"], answer: "0" },
        { question: "What does the `typeof` operator return for an array?", options: ["'array'", "'object'", "'list'", "'array_object'"], answer: "'object'" },
        { question: "Which statement will cause an error?", options: ["let a = 1; a = 2;", "const b = 1; b = 2;", "var c = 1; c = 2;", "let d; d = 1;"], answer: "const b = 1; b = 2;" },
        { question: "What is the purpose of the `default` case in a `switch` statement?", options: ["It's mandatory", "It runs if no other cases match", "It sets the default value", "It runs first"], answer: "It runs if no other cases match" },
        { question: "How do you write 'Hello World' in an alert box?", options: ["alertBox('Hello World')", "msg('Hello World')", "alert('Hello World')", "console.log('Hello World')"], answer: "alert('Hello World')" },
        { question: "Which is the correct way to write a multi-line comment?", options: ["// Comment", "/* Comment */", "<!-- Comment -->", "# Comment"], answer: "/* Comment */" },
        { question: "The external JavaScript file must contain the `<script>` tag.", options: ["True", "False"], answer: "False" },
        { question: "What is the result of `2 ** 3`?", options: ["6", "5", "8", "9"], answer: "8" },
        { question: "Which method removes the first element from an array?", options: [".pop()", ".shift()", ".unshift()", ".splice()"], answer: ".shift()" },
        { question: "Which method adds one or more elements to the beginning of an array?", options: [".push()", ".pop()", ".shift()", ".unshift()"], answer: ".unshift()" },
        { question: "What is the result of `Boolean('')`?", options: ["true", "false", "undefined", "null"], answer: "false" },
        { question: "How can you get the total number of arguments passed to a function?", options: ["arguments.length", "args.count", "this.arguments", "arguments.size"], answer: "arguments.length" },
        { question: "Which is a 'truthy' value?", options: ["0", "''", "[]", "null"], answer: "[]" },
        { question: "What is the purpose of `console.log()`?", options: ["To display a popup", "To write to the HTML document", "To write to the browser console", "To create a log file"], answer: "To write to the browser console" },
        { question: "A variable declared outside any function is in what scope?", options: ["Local Scope", "Function Scope", "Global Scope", "Block Scope"], answer: "Global Scope" },
        { question: "What is the value of `x` after `let x = 10; x += 5;`?", options: ["10", "5", "15", "error"], answer: "15" },
        { question: "Which is NOT a loop statement?", options: ["for", "while", "if", "do...while"], answer: "if" },
        { question: "What is the correct way to access the `age` property of the `person` object?", options: ["person[age]", "person('age')", "person.age", "get person.age"], answer: "person.age" },
        
        // Advanced
        { question: "What does an `async` function always return?", options: ["A callback", "An object", "An array", "A promise"], answer: "A promise" },
        { question: "What keyword is used to pause execution in an `async` function?", options: ["wait", "pause", "await", "hold"], answer: "await" },
        { question: "In a class constructor, what does the `super()` keyword do?", options: ["Calls the superclass constructor", "Initializes the object", "Returns the superclass", "Nothing"], answer: "Calls the superclass constructor" },
        { question: "What is a closure?", options: ["A type of loop", "A function that remembers its outer variables", "A way to close a file", "A built-in object"], answer: "A function that remembers its outer variables" },
        { question: "What does the `...` spread operator do in `[...arr1, ...arr2]`?", options: ["Creates a nested array", "Filters the arrays", "Combines the arrays", "Finds the difference"], answer: "Combines the arrays" },
        { question: "What syntax is used for template literals?", options: ["''", "\"\"", "``", "()"], answer: "``" },
        { question: "What is object destructuring?", options: ["Deleting an object", "Unpacking properties into variables", "Copying an object", "Comparing two objects"], answer: "Unpacking properties into variables" },
        { question: "In an object method `obj.myMethod()`, what does `this` refer to?", options: ["The global window object", "The function itself", "The `obj` object", "null"], answer: "The `obj` object" },
        { question: "What is the main benefit of using Promises over callbacks?", options: ["They run faster", "They avoid 'callback hell'", "They are older technology", "They only handle success cases"], answer: "They avoid 'callback hell'" },
        { question: "Which keyword is used to create a class?", options: ["class", "function", "struct", "object"], answer: "class" },
        { question: "What is the prototype chain?", options: ["A list of all object properties", "A way to link objects for inheritance", "A security feature", "A type of array"], answer: "A way to link objects for inheritance" },
        { question: "What does the `...` rest parameter do in a function definition `function(...args)`?", options: ["Spreads arguments", "Collects all arguments into an array", "Limits the number of arguments", "Ignores arguments"], answer: "Collects all arguments into an array" },
        { question: "Arrow functions have their own `this` context.", options: ["True", "False"], answer: "False" },
        { question: "Which method is used to handle a successful promise resolution?", options: [".then()", ".catch()", ".finally()", ".error()"], answer: ".then()" },
        { question: "What is the purpose of `export` in ES6 modules?", options: ["To run a file", "To import code", "To make variables/functions available to other files", "To hide code"], answer: "To make variables/functions available to other files" },
        { question: "What is the `constructor` method in a class?", options: ["A method to destroy objects", "A special method for creating and initializing an object", "A normal method", "A static method"], answer: "A special method for creating and initializing an object" },
        { question: "What does `Object.create(proto)` do?", options: ["Creates a copy of an object", "Creates a new object with the specified prototype", "Creates an empty object", "Deletes an object's prototype"], answer: "Creates a new object with the specified prototype" },
        { question: "What are the three states of a Promise?", options: ["pending, fulfilled, rejected", "waiting, complete, failed", "ready, set, go", "start, running, end"], answer: "pending, fulfilled, rejected" },
        { question: "The `await` keyword can be used in any function.", options: ["True", "False"], answer: "False" },
        { question: "What does `[a, b] = [10, 20]` do?", options: ["Creates an array", "Compares two arrays", "Array destructuring", "Array concatenation"], answer: "Array destructuring" },
        { question: "Which method handles promise rejection?", options: [".then()", ".catch()", ".resolve()", ".all()"], answer: ".catch()" },
        { question: "How do you inherit from a class in JavaScript?", options: ["inherits", "extends", "implements", "prototype"], answer: "extends" },
        { question: "What is the `try...catch` block used for?", options: ["To create loops", "To define functions", "To handle errors", "To schedule tasks"], answer: "To handle errors" },
        { question: "What is a 'pure function'?", options: ["A function with no parameters", "A function that always returns the same output for the same input", "A function that modifies global state", "A function inside a class"], answer: "A function that always returns the same output for the same input" },
        { question: "What does `JSON.stringify()` do?", options: ["Parses a JSON string", "Converts a JavaScript object to a JSON string", "Validates a JSON object", "Creates a new JSON object"], answer: "Converts a JavaScript object to a JSON string" },
        { question: "What does `JSON.parse()` do?", options: ["Converts a JavaScript object to a JSON string", "Creates a new JSON object", "Parses a JSON string into a JavaScript object", "Validates a JSON string"], answer: "Parses a JSON string into a JavaScript object" },
        { question: "What is the event loop?", options: ["A type of `for` loop", "A mechanism that allows JavaScript to handle async operations", "A security model", "A debugging tool"], answer: "A mechanism that allows JavaScript to handle async operations" },
        { question: "What is a higher-order function?", options: ["A function that is very complex", "A function that takes another function as an argument or returns one", "An `async` function", "A function with many parameters"], answer: "A function that takes another function as an argument or returns one" },
        { question: "Which of these is a higher-order array method?", options: [".push()", ".pop()", ".map()", ".length"], answer: ".map()" },
        { question: "What is the purpose of the `bind` method?", options: ["To link two variables", "To set the `this` value for a function", "To combine two functions", "To execute a function immediately"], answer: "To set the `this` value for a function" },
        { question: "What is a 'callback function'?", options: ["A function passed as an argument to be executed later", "A self-calling function", "A function that returns a value", "A function that stops execution"], answer: "A function passed as an argument to be executed later" },
        { question: "What does `Promise.all()` do?", options: ["Runs all promises sequentially", "Takes an iterable of promises and returns a single promise", "Returns the first promise that resolves", "Catches all promise errors"], answer: "Takes an iterable of promises and returns a single promise" },
        { question: "What is the difference between `null` and `undefined`?", options: ["They are the same", "`null` is an assigned value, `undefined` means a variable has not been assigned", "`undefined` is an object, `null` is a primitive", "There is no difference"], answer: "`null` is an assigned value, `undefined` means a variable has not been assigned" },
        { question: "What is 'hoisting' in JavaScript?", options: ["Lifting a variable to the top of the page", "A memory management feature", "The default behavior of moving declarations to the top of the current scope", "A way to prevent variable declaration"], answer: "The default behavior of moving declarations to the top of the current scope" },
        { question: "What does the `new` keyword do?", options: ["Creates a new file", "Creates an instance of an object", "Declares a new variable", "Starts a new loop"], answer: "Creates an instance of an object" },
        { question: "Which object is at the top of the scope chain?", options: ["The current function", "The `Math` object", "The global object (e.g., `window`)", "The `document` object"], answer: "The global object (e.g., `window`)" },
        { question: "What method can be used to schedule a function to run after a certain amount of time?", options: ["`setInterval()`", "`runAfter()`", "`setTimeout()`", "`delay()`"], answer: "`setTimeout()`" },
        { question: "What is the DOM?", options: ["A JavaScript library", "A data-only model", "A programming interface for web documents", "A type of variable"], answer: "A programming interface for web documents" },
        { question: "How do you select an HTML element by its id?", options: ["`document.select('#myId')`", "`document.getElementById('myId')`", "`document.querySelector('myId')`", "`getElement('myId')`"], answer: "`document.getElementById('myId')`" },
        { question: "What is an 'IIFE'?", options: ["A type of error", "A special loop", "Immediately Invoked Function Expression", "A built-in method"], answer: "Immediately Invoked Function Expression" },
        { question: "What is the `this` value in a standalone arrow function in the global scope?", options: ["The function itself", "undefined", "The global object (`window`)", "An error is thrown"], answer: "The global object (`window`)" },
        { question: "What is 'strict mode'?", options: ["A mode for faster execution", "A restricted variant of JavaScript that prevents certain actions", "A debugging tool", "A code formatting style"], answer: "A restricted variant of JavaScript that prevents certain actions" },
        { question: "What does the `map` array method do?", options: ["Filters an array", "Checks if any element passes a test", "Creates a new array by calling a function on every element", "Reduces the array to a single value"], answer: "Creates a new array by calling a function on every element" },
        { question: "What does the `filter` array method do?", options: ["Creates a new array with all elements that pass a test", "Modifies the original array", "Returns the first element that passes a test", "Maps each element to a new value"], answer: "Creates a new array with all elements that pass a test" },
        { question: "What does the `reduce` array method do?", options: ["Creates a new array", "Executes a reducer function on each element, resulting in a single output value", "Filters the array", "Sorts the array"], answer: "Executes a reducer function on each element, resulting in a single output value" },
        { question: "What is the difference between `slice` and `splice`?", options: ["They are the same", "`slice` returns a new array, `splice` modifies the original", "`splice` is for strings, `slice` is for arrays", "`slice` adds elements, `splice` removes them"], answer: "`slice` returns a new array, `splice` modifies the original" },
        { question: "What is event delegation?", options: ["Assigning an event handler to each element", "Using a single event listener on a parent element to manage events for its children", "A way to create custom events", "A JavaScript library"], answer: "Using a single event listener on a parent element to manage events for its children" },
        { question: "What is `NaN` and what is its type?", options: ["Not a Number, type 'number'", "Not a Null, type 'object'", "New Asset Number, type 'string'", "No Action Needed, type 'undefined'"], answer: "Not a Number, type 'number'" },
        { question: "How can you check if a value is `NaN`?", options: ["`value === NaN`", "`isNaN(value)`", "`value.isNan()`", "`typeof value === 'nan'`"], answer: "`isNaN(value)`" },
    ];

    function buildQuiz() {
        quizData.forEach((currentQuestion, questionNumber) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question', 'p-4', 'border', 'rounded-lg', 'transition-colors');
            
            const questionTitle = document.createElement('p');
            questionTitle.classList.add('font-semibold', 'mb-3');
            questionTitle.innerText = `${questionNumber + 1}. ${currentQuestion.question}`;
            questionDiv.appendChild(questionTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('options', 'space-y-2');
            
            currentQuestion.options.forEach(option => {
                const label = document.createElement('label');
                label.classList.add('block', 'p-3', 'border', 'rounded-md', 'cursor-pointer', 'quiz-option', 'transition-colors');
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question${questionNumber}`;
                radio.value = option;
                radio.classList.add('mr-2');
                
                label.appendChild(radio);
                label.appendChild(document.createTextNode(option));
                optionsDiv.appendChild(label);
            });
            
            questionDiv.appendChild(optionsDiv);
            quizContainer.appendChild(questionDiv);
        });
    }

    function showResults() {
        let score = 0;
        const questionDivs = quizContainer.querySelectorAll('.quiz-question');

        quizData.forEach((currentQuestion, questionNumber) => {
            const questionDiv = questionDivs[questionNumber];
            questionDiv.classList.remove('bg-green-50', 'bg-red-50', 'correct', 'incorrect');
            
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswerNode = (questionDiv.querySelector(selector) || {});
            const userAnswer = userAnswerNode.value;
            const options = questionDiv.querySelectorAll('.quiz-option');

            options.forEach(optionLabel => {
                optionLabel.classList.remove('selected', 'correct-answer');
                const radio = optionLabel.querySelector('input');
                if(radio.checked) {
                    optionLabel.classList.add('selected');
                }
                if(radio.value === currentQuestion.answer) {
                    optionLabel.classList.add('correct-answer');
                }
            });

            if (userAnswer === currentQuestion.answer) {
                score++;
                questionDiv.classList.add('correct');
            } else {
                questionDiv.classList.add('incorrect');
            }
        });

        resultsContainer.innerText = `You scored ${score} out of ${quizData.length}!`;
    }

    buildQuiz();
    submitButton.addEventListener('click', showResults);
});
