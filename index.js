// Lite vs. Dark Theme switching
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  themeSwitch.checked = true;
}
themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

// Handle button clicks
const keys = document.querySelector('.calculator-buttons');
keys.addEventListener('click', event => {
  const { target } = event;
  if (!target.matches('button')) return;
  const { value } = target;
  calculator.parseInput(value);
  calculator.outputText(calculator.displayText);
});

// Handle key presses for desktop devices
document.addEventListener('keydown', event => {
  // Normalize key to lowercase for consistency
  const key = event.key.toLowerCase();
  // Allowed keys include numbers, operators, and additional variants
  const allowedKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '*', '/', '.', '=', 'enter', 'backspace', 'escape', 'x'
  ];
  if (allowedKeys.includes(key)) {
    event.preventDefault();
    handleKeyPress(key);
  }
});

function handleKeyPress(key) {
  if (key === 'enter' || key === '=') {
    calculator.parseInput('=');
  } else if (key === 'backspace') {
    calculator.parseInput('backspace');
  } else if (key === 'escape') {
    calculator.parseInput('AC');
  } else if (key === 'x') {
    calculator.parseInput('*');
  } else {
    calculator.parseInput(key);
  }
  calculator.outputText(calculator.displayText);
}

// Calculator object
const calculator = {
  displayText: '0',
  prevTotal: null,

  parseInput(value) {
    // If display shows '0', clear it before appending new value
    if (this.displayText === '0') {
      this.displayText = '';
    }
    switch (value) {
      case '=':
        this.displayText = this.evaluate(this.displayText).toString();
        this.prevTotal = this.displayText;
        this.outputText(this.displayText);
        break;
        
      case 'AC':
        this.displayText = '0';
        this.prevTotal = null;
        this.outputText(this.displayText);
        break;

        case '.':
            // Split the current displayText by operators to get the current number segment
            const tokens = this.displayText.split(/[+\-*/]/);
            const currentNumber = tokens[tokens.length - 1];
        
            // If the current number already contains a '.', prevent adding another one
            if (currentNumber.includes('.')) {
                break;
            }
        
            // Ensure proper decimal formatting
            if (this.displayText === '' || this.displayText.endsWith(' ')) {
                this.addText('0.');
            } else {
                this.addText('.');
            }
        
            this.outputText(this.displayText);
            break;
        

      case 'backspace':
        this.displayText = this.displayText.slice(0, -1) || '0';
        this.outputText(this.displayText);
        break;

      case '+':
        this.displayText += '+';
        this.outputText(this.displayText);
        break;

      default:
        this.displayText += value;
        this.outputText(this.displayText);
        break;
    }
  },

  addText(value) {
    if (this.displayText === '0') {
      this.displayText = '';
    } else if (this.prevTotal !== null) {
      this.displayText = this.prevTotal;
      this.prevTotal = null;
    }
    // Prevent multiple operators in a row
    if (isNaN(+(value)) && isNaN(+(this.displayText.slice(-1)))) {
      return;
    }
    this.displayText += value;
    this.outputText(this.displayText);
  },

  outputText(text) {
    const display = document.querySelector('.calculator-screen');

    // Check for numbers over 15 digits
    let formattedText = text;

    if (formattedText.length > 15) {
        formattedText = "why you calculating such giant numbers?!";
        display.style.fontSize = '1rem'; // Smaller font size for the message
    } else {
        // Format number with commas every three digits from the right
        formattedText = formattedText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Adjust font size for large numbers
        if (formattedText.length > 12) {
            display.style.fontSize = '3rem'; // Shrink font size for large numbers
        } else {
            display.style.fontSize = '5rem'; // Regular font size
        }
    }

    // Ensure "0" is shown for empty or null values
    display.value = formattedText === '' || formattedText === null ? '0' : formattedText;
},

  evaluate(equation) {
    try {
      return new Function("return " + equation)();
    } catch {
      return "Error";
    }
  }
};
