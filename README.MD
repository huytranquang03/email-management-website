project:
  name: "Email Management System"
  description: "A simple web-based email system built with Node.js and EJS, developed for the 61FIT3WPR - Web Programming (Fall 2024) course."

  student_info:
    full_name: "Tran Quang Huy"
    student_id: "2101040103"
    course: "61FIT3WPR - Web Programming (Fall 2024)"

  system_requirements:
    node_version: "18 or higher"
    mysql:
      host: "localhost"
      port: 3306
      user: "wpr"
      password: "fit2024"
      database_name: "wpr2101040103"

  folder_structure:
    - controllers/: "Handles business logic (authentication, email processing)"
    - routes/: "Defines app routes (sign-in, sign-up, inbox, etc.)"
    - views/: "EJS templates for rendering pages"
    - public/: "Static assets (CSS, JS, images)"
    - dbsetup.js: "Database creation and initialization script"
    - index.js: "Main application entry point"
    - package.json: "Lists project dependencies"
    - README.md: "Project documentation"
    - .env: "Environment configuration file (excluded from repository)"

  installation_and_run_steps:
    - step 1: "Clone the repository"
      command: "git clone https://github.com/huytranquang03/email-management-website.git"
    - step 2: "Move into project folder"
      command: "cd repo-name"
    - step 3: "Install required dependencies"
      command: "npm install"
    - step 4: "Set up the database (creates tables and inserts initial data)"
      command: "node dbsetup.js"
    - step 5: "Start the application"
      command: "npm start"
    - step 6: "Access the application in your browser"
      url: "http://localhost:8000/"

  technologies_used:
    - Node.js
    - Express.js
    - EJS
    - MySQL
    - Cookies (Session Management)

  features:
    - User Registration (Sign-up)
    - User Authentication (Sign-in/Sign-out)
    - Inbox (Received Emails with Pagination)
    - Outbox (Sent Emails with Pagination)
    - Compose and Send Emails
    - File Attachment (optional)
    - Delete Emails using AJAX (Advanced)

  environment_variables:
    - DB_HOST: "localhost"
    - DB_PORT: "3306"
    - DB_USER: "wpr"
    - DB_PASS: "fit2024"
    - DB_NAME: "wpr2101040103"
    - PORT: "8000"

  license: "This project is created for educational purposes only. Commercial use is prohibited."

  notes:
    - "No external CSS/JS libraries are allowed."
    - "All HTML templates must be self-written."
    - "Ensure MySQL service is running before initializing the database."
