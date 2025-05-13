/**
 * Code Beautifier Tool
 *
 * This tool allows users to format and beautify code in various programming languages.
 * It supports JavaScript, HTML, CSS, JSON, XML, SQL, and more.
 */

// Sample code for different languages
const sampleCodes = {
    javascript: `function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

// Example usage
const number = 5;
const factorial = calculateFactorial(number);
console.log(\`The factorial of \${number} is \${factorial}\`);

// Object example
const person = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    zipCode: "12345"
  },
  hobbies: ["reading", "coding", "hiking"]
};`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample HTML</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home">
      <h2>Home Section</h2>
      <p>This is the home section of the website.</p>
    </section>

    <section id="about">
      <h2>About Us</h2>
      <p>Learn more about our company and team.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2023 My Website. All rights reserved.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,

    css: `/* Reset some default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

header {
  background-color: #35424a;
  color: white;
  padding: 20px;
  text-align: center;
}

nav ul {
  display: flex;
  justify-content: center;
  list-style: none;
}

nav ul li {
  margin: 0 15px;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

main {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

footer {
  text-align: center;
  padding: 20px;
  background-color: #35424a;
  color: white;
}`,

    json: `{
  "name": "Code Beautifier",
  "version": "1.0.0",
  "description": "A tool to format and beautify code in various programming languages",
  "author": {
    "name": "Latest Online Tools",
    "url": "https://latestonlinetools.com"
  },
  "features": [
    "JavaScript formatting",
    "HTML formatting",
    "CSS formatting",
    "JSON formatting",
    "XML formatting",
    "SQL formatting"
  ],
  "settings": {
    "indentSize": 2,
    "preserveNewlines": true,
    "braceStyle": "collapse",
    "endWithNewline": true
  },
  "statistics": {
    "users": 10000,
    "averageRating": 4.8,
    "totalFormattings": 50000
  }
}`,

    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="Fiction">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>12.99</price>
  </book>
  <book category="Science Fiction">
    <title>Dune</title>
    <author>Frank Herbert</author>
    <year>1965</year>
    <price>14.95</price>
  </book>
  <book category="Mystery">
    <title>The Hound of the Baskervilles</title>
    <author>Arthur Conan Doyle</author>
    <year>1902</year>
    <price>9.99</price>
  </book>
  <book category="Non-Fiction">
    <title>A Brief History of Time</title>
    <author>Stephen Hawking</author>
    <year>1988</year>
    <price>18.50</price>
  </book>
</bookstore>`,

    sql: `-- Create a new database
CREATE DATABASE online_store;

-- Use the database
USE online_store;

-- Create tables
CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(200),
  city VARCHAR(50),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code)
VALUES
  ('John', 'Doe', 'john.doe@example.com', '555-123-4567', '123 Main St', 'Anytown', 'CA', '12345'),
  ('Jane', 'Smith', 'jane.smith@example.com', '555-987-6543', '456 Oak Ave', 'Somewhere', 'NY', '67890');

-- Select data with join
SELECT c.first_name, c.last_name, p.name, p.price
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE p.price > 50.00
ORDER BY p.price DESC;`,

    php: `<?php
// Define a class
class Person {
    // Properties
    private $name;
    private $age;
    private $email;

    // Constructor
    public function __construct($name, $age, $email) {
        $this->name = $name;
        $this->age = $age;
        $this->email = $email;
    }

    // Getters
    public function getName() {
        return $this->name;
    }

    public function getAge() {
        return $this->age;
    }

    public function getEmail() {
        return $this->email;
    }

    // Method to display person info
    public function displayInfo() {
        echo "Name: " . $this->name . "<br>";
        echo "Age: " . $this->age . "<br>";
        echo "Email: " . $this->email . "<br>";
    }
}

// Create a new person
$person = new Person("John Doe", 30, "john.doe@example.com");

// Display person info
$person->displayInfo();

// Using arrays
$fruits = array("Apple", "Banana", "Orange", "Mango");

// Loop through array
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}
?>`,

    python: `import math
from datetime import datetime

# Define a class
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def circumference(self):
        return 2 * math.pi * self.radius

    def __str__(self):
        return f"Circle with radius {self.radius}"

# Create a circle instance
my_circle = Circle(5)
print(f"Area: {my_circle.area():.2f}")
print(f"Circumference: {my_circle.circumference():.2f}")

# List comprehension example
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [num for num in numbers if num % 2 == 0]
squared_numbers = [num ** 2 for num in numbers]

print(f"Even numbers: {even_numbers}")
print(f"Squared numbers: {squared_numbers}")

# Function with default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))
print(greet("Bob", "Hi"))

# Current date and time
now = datetime.now()
print(f"Current date and time: {now.strftime('%Y-%m-%d %H:%M:%S')}")`,

    java: `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        // Create a list of numbers
        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            numbers.add(i);
        }

        // Filter even numbers using streams
        List<Integer> evenNumbers = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());

        System.out.println("Even numbers: " + evenNumbers);

        // Map numbers to their squares
        List<Integer> squaredNumbers = numbers.stream()
            .map(n -> n * n)
            .collect(Collectors.toList());

        System.out.println("Squared numbers: " + squaredNumbers);

        // Create a Person object
        Person person = new Person("John Doe", 30);
        person.displayInfo();
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
    }
}`,

    csharp: `using System;
using System.Collections.Generic;
using System.Linq;

namespace CodeBeautifierExample
{
    class Program
    {
        static void Main(string[] args)
        {
            // Create a list of numbers
            List<int> numbers = Enumerable.Range(1, 10).ToList();

            // Filter even numbers using LINQ
            var evenNumbers = numbers.Where(n => n % 2 == 0).ToList();

            Console.WriteLine("Even numbers: " + string.Join(", ", evenNumbers));

            // Map numbers to their squares
            var squaredNumbers = numbers.Select(n => n * n).ToList();

            Console.WriteLine("Squared numbers: " + string.Join(", ", squaredNumbers));

            // Create a Person object
            var person = new Person("John Doe", 30);
            person.DisplayInfo();

            // Using a dictionary
            var fruitInventory = new Dictionary<string, int>
            {
                { "Apple", 10 },
                { "Banana", 15 },
                { "Orange", 8 },
                { "Mango", 12 }
            };

            foreach (var item in fruitInventory)
            {
                Console.WriteLine($"{item.Key}: {item.Value}");
            }
        }
    }

    class Person
    {
        public string Name { get; private set; }
        public int Age { get; private set; }

        public Person(string name, int age)
        {
            Name = name;
            Age = age;
        }

        public void DisplayInfo()
        {
            Console.WriteLine($"Name: {Name}");
            Console.WriteLine($"Age: {Age}");
        }
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& name, int age) : name(name), age(age) {}

    std::string getName() const {
        return name;
    }

    int getAge() const {
        return age;
    }

    void displayInfo() const {
        std::cout << "Name: " << name << std::endl;
        std::cout << "Age: " << age << std::endl;
    }
};

int main() {
    // Create a vector of numbers
    std::vector<int> numbers;
    for (int i = 1; i <= 10; i++) {
        numbers.push_back(i);
    }

    // Filter even numbers
    std::vector<int> evenNumbers;
    std::copy_if(numbers.begin(), numbers.end(), std::back_inserter(evenNumbers),
                [](int n) { return n % 2 == 0; });

    std::cout << "Even numbers: ";
    for (const auto& num : evenNumbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    // Map numbers to their squares
    std::vector<int> squaredNumbers;
    std::transform(numbers.begin(), numbers.end(), std::back_inserter(squaredNumbers),
                  [](int n) { return n * n; });

    std::cout << "Squared numbers: ";
    for (const auto& num : squaredNumbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    // Create a Person object
    Person person("John Doe", 30);
    person.displayInfo();

    return 0;
}`,

    typescript: `interface Person {
  name: string;
  age: number;
  email?: string;
}

class Employee implements Person {
  name: string;
  age: number;
  email?: string;
  department: string;
  salary: number;

  constructor(name: string, age: number, department: string, salary: number, email?: string) {
    this.name = name;
    this.age = age;
    this.department = department;
    this.salary = salary;
    this.email = email;
  }

  displayInfo(): void {
    console.log(\`Name: \${this.name}\`);
    console.log(\`Age: \${this.age}\`);
    console.log(\`Department: \${this.department}\`);
    console.log(\`Salary: \${this.salary}\`);
    if (this.email) {
      console.log(\`Email: \${this.email}\`);
    }
  }

  giveRaise(amount: number): void {
    this.salary += amount;
    console.log(\`\${this.name} received a raise of \${amount}. New salary: \${this.salary}\`);
  }
}

// Create an employee
const employee = new Employee("John Doe", 30, "Engineering", 75000, "john.doe@example.com");
employee.displayInfo();
employee.giveRaise(5000);

// Generic function example
function getFirstElement<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

const numbers: number[] = [1, 2, 3, 4, 5];
const firstNumber = getFirstElement(numbers);
console.log(\`First number: \${firstNumber}\`);

const names: string[] = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names);
console.log(\`First name: \${firstName}\`);`
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the code beautifier
    initCodeBeautifier();
});

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Reset classes
    notification.classList.remove('success', 'error', 'info');

    // Add appropriate class based on type
    notification.classList.add(type);

    // Set message
    notificationMessage.textContent = message;

    // Show notification
    notification.classList.add('show');

    // Hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Initialize the code beautifier
 */
function initCodeBeautifier() {
    // DOM elements
    const languageSelect = document.getElementById('language-select');
    const inputCode = document.getElementById('input-code');
    const outputCode = document.getElementById('output-code');
    const beautifyBtn = document.getElementById('beautify-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Options elements
    const indentSize = document.getElementById('indent-size');
    const preserveNewlines = document.getElementById('preserve-newlines');
    const braceStyle = document.getElementById('brace-style');
    const endWithNewline = document.getElementById('end-with-newline');
    const wrapLineLength = document.getElementById('wrap-line-length');
    const maxLineLength = document.getElementById('max-line-length');

    // Event listeners
    beautifyBtn.addEventListener('click', beautifyCode);
    pasteBtn.addEventListener('click', pasteCode);
    clearBtn.addEventListener('click', clearCode);
    sampleBtn.addEventListener('click', loadSampleCode);
    copyBtn.addEventListener('click', copyCode);
    downloadBtn.addEventListener('click', downloadCode);
    languageSelect.addEventListener('change', updateSampleCode);

    // Initial sample code
    loadSampleCode();

    /**
     * Beautify code based on selected language and options
     */
    function beautifyCode() {
        const code = inputCode.value;
        const language = languageSelect.value;

        if (!code) {
            showNotification('Please enter code to beautify', 'error');
            return;
        }

        try {
            // Get options
            const options = getBeautifyOptions();

            // Beautify code based on language
            let beautified = '';

            switch (language) {
                case 'javascript':
                case 'typescript':
                    beautified = js_beautify(code, options);
                    break;
                case 'html':
                    beautified = html_beautify(code, options);
                    break;
                case 'css':
                    beautified = css_beautify(code, options);
                    break;
                case 'json':
                    beautified = js_beautify(code, options);
                    break;
                case 'xml':
                    beautified = html_beautify(code, options);
                    break;
                case 'sql':
                    beautified = sqlFormatter.format(code, {
                        language: 'sql',
                        indent: options.indent_char.repeat(options.indent_size)
                    });
                    break;
                default:
                    // For other languages, use js-beautify as fallback
                    beautified = js_beautify(code, options);
                    break;
            }

            // Update output
            outputCode.textContent = beautified;

            // Apply syntax highlighting
            outputCode.className = 'code-output hljs language-' + language;
            hljs.highlightElement(outputCode);

            showNotification('Code beautified successfully', 'success');
        } catch (error) {
            console.error('Error beautifying code:', error);
            showNotification('Error beautifying code: ' + error.message, 'error');
        }
    }

    /**
     * Get beautify options based on user selections
     * @returns {Object} - Options object for beautifier
     */
    function getBeautifyOptions() {
        return {
            indent_size: indentSize.value === 'tab' ? 1 : parseInt(indentSize.value),
            indent_char: indentSize.value === 'tab' ? '\t' : ' ',
            max_preserve_newlines: preserveNewlines.checked ? 2 : 0,
            preserve_newlines: preserveNewlines.checked,
            brace_style: braceStyle.checked ? 'expand' : 'collapse',
            end_with_newline: endWithNewline.checked,
            wrap_line_length: wrapLineLength.checked ? parseInt(maxLineLength.value) : 0,
            indent_empty_lines: false,
            jslint_happy: false
        };
    }

    /**
     * Paste code from clipboard
     */
    async function pasteCode() {
        try {
            const text = await navigator.clipboard.readText();
            inputCode.value = text;
            showNotification('Code pasted from clipboard', 'success');
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            showNotification('Failed to paste from clipboard', 'error');
        }
    }

    /**
     * Clear code input
     */
    function clearCode() {
        inputCode.value = '';
        outputCode.textContent = '// Beautified code will appear here';
        showNotification('Input cleared', 'error');
    }

    /**
     * Copy beautified code to clipboard
     */
    function copyCode() {
        const code = outputCode.textContent;

        if (!code || code === '// Beautified code will appear here') {
            showNotification('No beautified code to copy', 'error');
            return;
        }

        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    showNotification('Code copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(code);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(code);
        }
    }

    /**
     * Fallback method to copy text to clipboard
     * @param {string} text - Text to copy
     */
    function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('Code copied to clipboard', 'success');
            } else {
                showNotification('Failed to copy text', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy text', 'error');
        }

        document.body.removeChild(textarea);
    }

    /**
     * Download beautified code as a file
     */
    function downloadCode() {
        const code = outputCode.textContent;
        const language = languageSelect.value;

        if (!code || code === '// Beautified code will appear here') {
            showNotification('No beautified code to download', 'error');
            return;
        }

        // Determine file extension based on language
        let extension = '.txt';
        switch (language) {
            case 'javascript':
                extension = '.js';
                break;
            case 'typescript':
                extension = '.ts';
                break;
            case 'html':
                extension = '.html';
                break;
            case 'css':
                extension = '.css';
                break;
            case 'json':
                extension = '.json';
                break;
            case 'xml':
                extension = '.xml';
                break;
            case 'sql':
                extension = '.sql';
                break;
            case 'php':
                extension = '.php';
                break;
            case 'python':
                extension = '.py';
                break;
            case 'java':
                extension = '.java';
                break;
            case 'csharp':
                extension = '.cs';
                break;
            case 'cpp':
                extension = '.cpp';
                break;
        }

        const fileName = `beautified_code_${new Date().getTime()}${extension}`;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);

        showNotification(`Downloaded as ${fileName}`, 'success');
    }

    /**
     * Load sample code based on selected language
     */
    function loadSampleCode() {
        const language = languageSelect.value;
        inputCode.value = sampleCodes[language] || '';
        showNotification(`Sample ${language} code loaded`, 'info');
    }

    /**
     * Update sample code when language changes
     */
    function updateSampleCode() {
        // Only update if the input is empty or contains a sample code
        const currentCode = inputCode.value.trim();
        if (!currentCode || Object.values(sampleCodes).some(sample => currentCode === sample.trim())) {
            loadSampleCode();
        }
    }
}
