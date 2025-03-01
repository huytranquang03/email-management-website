const mysql = require("mysql2/promise");

const dbConfig = {
	host: "localhost",
	user: "wpr",
	password: "fit2024",
	port: 3306,
	database: "wpr2101040103",
};

const users = [
	{ email: "a@a.com", name: "User A", password: "123" },
	{ email: "b@b.com", name: "User B", password: "123" },
	{ email: "c@c.com", name: "User C", password: "123" },
];

const emails = [
	{
		senderID: 1,
		receiverID: 2,
		subject: "Hello B",
		message:
			"I hope things are going well. Let me know if you need anything.",
	},
	{
		senderID: 2,
		receiverID: 1,
		subject: "Hi A",
		message: "Thanks for the update. I’ve attached the changes for review.",
	},
	{
		senderID: 2,
		receiverID: 1,
		subject: "Hello A",
		message: "I’ve added some notes to the document. Please review.",
	},
	{
		senderID: 1,
		receiverID: 2,
		subject: "Hello B",
		message:
			"Just checking in to see if you need help with the meeting prep.",
	},
	{
		senderID: 1,
		receiverID: 2,
		subject: "Hello B",
		message: "Here’s the draft for your review. Let me know your thoughts.",
	},
	{
		senderID: 2,
		receiverID: 1,
		subject: "Hi A",
		message: "I’ve made the changes. Please review and let me know.",
	},
	{
		senderID: 2,
		receiverID: 1,
		subject: "Hello A",
		message: "I’ve attached the revised document for your review.",
	},
	{
		senderID: 1,
		receiverID: 2,
		subject: "Hello B",
		message: "Please confirm if the schedule works for you.",
	},
	{
		senderID: 1,
		receiverID: 2,
		subject: "Hello B",
		message:
			"I’ve sent the final report. Let me know if anything else is needed.",
	},
	{
		senderID: 3,
		receiverID: 1,
		subject: "Hello A",
		message: "Here’s the task update. Let me know if you need further info.",
	},
	{
		senderID: 3,
		receiverID: 2,
		subject: "Hi B",
		message:
			"I need some clarification on the timeline. Let’s schedule a quick call.",
	},
	{
		senderID: 3,
		receiverID: 1,
		subject: "Hello A",
		message: "I’ve attached the data you requested.",
	},
	{
		senderID: 3,
		receiverID: 2,
		subject: "Hello B",
		message: "Progress is good. A few adjustments are needed.",
	},
	{
		senderID: 3,
		receiverID: 1,
		subject: "Hi A",
		message: "I’ve added some suggestions to the proposal. Let’s discuss.",
	},
	{
		senderID: 3,
		receiverID: 2,
		subject: "Hello B",
		message: "I’ve reviewed your work and made some updates.",
	},
	{
		senderID: 1,
		receiverID: 3,
		subject: "Hello C",
		message: "Just checking if you need any help with the project.",
	},
	{
		senderID: 2,
		receiverID: 3,
		subject: "Hi C",
		message: "The materials are ready. Let me know if you need anything.",
	},
	{
		senderID: 3,
		receiverID: 1,
		subject: "Hello A",
		message:
			"I’ve completed the task. Let me know if you need anything else.",
	},
	{
		senderID: 3,
		receiverID: 2,
		subject: "Hi B",
		message:
			"I’ve reviewed the meeting notes. Let me know if you have feedback.",
	},
	{
		senderID: 3,
		receiverID: 1,
		subject: "Hello A",
		message: "Here’s the final version of the presentation.",
	},
	{
		senderID: 3,
		receiverID: 2,
		subject: "Hello B",
		message:
			"I’ve sent the updated files. Please confirm if everything is good.",
	},
];

async function setupDatabase() {
	const connection = await mysql.createConnection({
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
		port: dbConfig.port,
	});

	try {
		await connection.query(
			`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`
		);
		console.log(`Database ${dbConfig.database} created successfully.`);

		const db = await mysql.createConnection(dbConfig);

		console.log("Connected to the database");

		await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

		for (const user of users) {
			await db.query(
				"INSERT IGNORE INTO users (email, name, password) VALUES (?, ?, ?)",
				[user.email, user.name, user.password]
			);
		}
		console.log("Users inserted");

		await db.execute(`
      CREATE TABLE IF NOT EXISTS emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        senderid INT,
        receiverid INT,
        subject VARCHAR(255),
        message TEXT,
        attachment_path VARCHAR(25),
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderid) REFERENCES users(id),
        FOREIGN KEY (receiverid) REFERENCES users(id)
      );
    `);

		for (const email of emails) {
			await db.query(
				"INSERT INTO emails (senderid, receiverid, subject, message) VALUES (?, ?, ?, ?)",
				[email.senderID, email.receiverID, email.subject, email.message]
			);
		}
		console.log("Emails inserted");

		await db.end();
		console.log("Database setup completed");
	} finally {
		await connection.end();
		console.log("Initial connection closed");
	}
}

setupDatabase();
