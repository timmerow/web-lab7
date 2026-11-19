// Приоритет умножения и деления выше, чем сложения и вычитания.
function priority(operation) {
    if (operation === '+' || operation === '-') {
        return 1;
    }
    return 2;
}

function isNumeric(value) {
    return /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(value);
}

function isOperation(value) {
    return /^[+*/-]$/.test(value);
}

// Делим выражение на числа, операторы и скобки.
function tokenize(expression) {
    const tokens = [];
    let number = '';

    for (const char of expression) {
        const previous = tokens[tokens.length - 1];
        const isSign = (char === '+' || char === '-') && number === '' &&
            (previous === undefined || previous === '(' || isOperation(previous));

        if (/^[\d.]$/.test(char) || isSign) {
            number += char;
        } else {
            if (number !== '') {
                tokens.push(number);
                number = '';
            }
            if (isOperation(char) || char === '(' || char === ')') {
                tokens.push(char);
            }
        }
    }

    if (number !== '') {
        tokens.push(number);
    }
    return tokens;
}

// Алгоритм сортировочной станции переводит выражение в ОПН.
function compile(expression) {
    const output = [];
    const operators = [];

    for (const token of tokenize(expression)) {
        if (isNumeric(token)) {
            output.push(token);
        } else if (isOperation(token)) {
            while (isOperation(operators[operators.length - 1]) &&
                priority(operators[operators.length - 1]) >= priority(token)) {
                output.push(operators.pop());
            }
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop();
        }
    }

    while (operators.length > 0) {
        output.push(operators.pop());
    }
    return output.join(' ');
}

// В ОПН сначала идут числа, затем операция над ними.
function evaluate(expression) {
    const numbers = [];

    for (const token of expression.split(' ')) {
        if (isNumeric(token)) {
            numbers.push(Number(token));
        } else {
            // С верхушки стека первым снимается правый операнд.
            const right = numbers.pop();
            const left = numbers.pop();

            switch (token) {
                case '+':
                    numbers.push(left + right);
                    break;
                case '-':
                    numbers.push(left - right);
                    break;
                case '*':
                    numbers.push(left * right);
                    break;
                case '/':
                    numbers.push(left / right);
                    break;
            }
        }
    }
    return numbers.pop();
}

const screen = document.querySelector('.screen');
const display = screen.querySelector('span');

function clickHandler(event) {
    const button = event.target;

    if (button.matches('.digit, .operation, .bracket')) {
        display.textContent += button.textContent;
    } else if (button.matches('.clear')) {
        display.textContent = '';
    } else if (button.matches('.result') && display.textContent !== '') {
        const result = evaluate(compile(display.textContent));
        if (result !== undefined) {
            display.textContent = result.toFixed(2);
        }
    }

    screen.scrollLeft = screen.scrollWidth;
}

// Один обработчик принимает клики со всех кнопок.
document.querySelector('.buttons').addEventListener('click', clickHandler);
