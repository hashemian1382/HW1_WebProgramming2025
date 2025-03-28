class FormulaElement {
    static FORMULA_REGEX = /^[a-zA-Z0-9+\-*\/()\s.]+$/;

    constructor(element) {
        this.element = element;
        this.formula = element.getAttribute('evaluator');
        this.inputs = this.findInputElements();
        this.setupEventListeners();
        this.calculate();
    }

    findInputElements() {
        const operators = new Set(['+', '-', '*', '/', '(', ')']);
        const inputIds = [...new Set(this.formula.match(/([a-zA-Z0-9]+)/g) || [])]
            .filter(id => !operators.has(id));
        return inputIds.map(id => document.getElementById(id)).filter(Boolean);
    }

    setupEventListeners() {
        this.inputs.forEach(input => input.addEventListener('input', () => this.calculate()));
    }

    calculate() {
        if (!this.isValidFormula(this.formula)) {
            this.element.textContent = 'Invalid Formula';
            return;
        }

        let hasInvalidInput = false;
        const values = this.inputs.reduce((acc, input) => {
            const isValid = input.value.trim() !== '' && /^-?\d*\.?\d+$/.test(input.value);
            if (!isValid) hasInvalidInput = true;
            acc[input.id] = isValid ? parseFloat(input.value) : 0;
            return acc;
        }, {});

        if (hasInvalidInput) {
            this.element.textContent = 'Unknown';
            return;
        }

        try {
            const evalFunction = new Function(...Object.keys(values), `return ${this.formula};`);
            const result = evalFunction(...Object.values(values));
            
            this.element.textContent = 
                typeof result === 'number' && !isNaN(result) ? result.toFixed(2) : 'Invalid Formula';
        } catch (error) {
            this.element.textContent = 'Invalid Formula';
        }
    }

    isValidFormula(formula) {
        return FormulaElement.FORMULA_REGEX.test(formula);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[evaluator]').forEach(element => new FormulaElement(element));
});