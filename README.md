
# 📧 Email Management System

A simple web-based email system built with Node.js and EJS, developed for the **61FIT3WPR - Web Programming** course.

---

## 📂 Project Structure

```
/
├── controllers/         # Handles business logic (authentication, email processing)
├── routes/               # Defines app routes (sign-in, sign-up, inbox, etc.)
├── views/                # EJS templates for rendering pages
├── public/               # Static assets (CSS, JS, images)
├── dbsetup.js            # Database creation and initialization script
├── index.js              # Main application entry point
├── package.json          # Lists project dependencies
├── README.md             # Project documentation
└── .env                  # Environment configuration file (excluded from repository)
```

---

## 🛠️ Installation and Setup

Follow these steps to get the project up and running:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/huytranquang03/email-management-website.git
    ```
2. **Move into the project folder:**
    ```bash
    cd email-management-website
    ```
3. **Install required dependencies:**
    ```bash
    npm install
    ```
4. **Set up the database (create tables and insert initial data):**
    ```bash
    node dbsetup.js
    ```
5. **Start the application:**
    ```bash
    npm start
    ```
6. **Access the application at:**
    [http://localhost:8000/](http://localhost:8000/)

---

## 💻 Technologies Used

- Node.js
- Express.js
- EJS
- MySQL
- Cookies (Session Management)

---

## ✨ Features

- ✅ User Registration (Sign-up)
- ✅ User Authentication (Sign-in/Sign-out)
- ✅ Inbox (Received Emails with Pagination)
- ✅ Outbox (Sent Emails with Pagination)
- ✅ Compose and Send Emails
- ✅ File Attachment (optional)
- ✅ Delete Emails using AJAX (Advanced)

---


## 📜 License

This project is created for **educational purposes only**. Commercial use is strictly prohibited.

---

## ⚠️ Notes

- ❗ No external CSS/JS libraries are allowed.
- ❗ All HTML templates must be self-written.
- ❗ Ensure **MySQL service is running** before initializing the database.

---
