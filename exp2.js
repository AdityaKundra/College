const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Load employees from file
const loadEmployees = () => {
  try {
    const data = fs.readFileSync('employees.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employees.json:', error);
    return [];
  }
};

// Save employees to file
const saveEmployees = (employees) => {
  try {
    fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2));
  } catch (error) {
    console.error('Error writing employees.json:', error);
  }
};

// Route to get employee data
app.get('/employees', (req, res) => {
  const employees = loadEmployees();
  res.json(employees);
});

// Route to handle new employee addition
app.post('/add-employee', (req, res) => {
  const { id, name, salary } = req.body;
  const employees = loadEmployees();

  if (!id || !name || !salary) {
    return res.status(400).send('Missing fields');
  }

  employees.push({ id, name, salary: parseFloat(salary) });
  saveEmployees(employees);

  res.redirect('/');
});

// Route to serve the HTML form
app.get('/', (req, res) => {
  const employees = loadEmployees();
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Employee Management</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          color: #007BFF;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #007BFF;
          color: white;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        form {
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
        }
        label {
          margin-bottom: 8px;
          font-weight: bold;
        }
        input[type="text"], input[type="number"] {
          padding: 10px;
          margin-bottom: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        input[type="submit"] {
          padding: 10px;
          background-color: #007BFF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        input[type="submit"]:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Employee List</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
  `;

  employees.forEach(emp => {
    html += `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.salary}</td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
        <h2>Add New Employee</h2>
        <form action="/add-employee" method="post">
          <label for="id">ID:</label>
          <input type="text" id="id" name="id" required>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <label for="salary">Salary:</label>
          <input type="number" id="salary" name="salary" step="0.01" required>
          <input type="submit" value="Add Employee">
        </form>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
