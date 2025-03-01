const mysql = require("mysql2");
const multer = require("multer");
const upload = multer().single("attachment");
const dbConfig = {
	database: "wpr2101040103",
	host: "localhost",
	user: "wpr",
	password: "fit2024",
	port: 3306,
};
const db = mysql.createConnection(dbConfig);
const authState = {
	isLogging: false,
};
function getUserName(userID, callback) {
	db.query(
		"SELECT name FROM users WHERE id = ?",
		[userID],
		(error, userResults) => {
			if (error) {
				console.log(error);
				callback(error, null);
				return;
			}

			if (userResults.length === 0) {
				callback(new Error("User not found"), null);
				return;
			}

			const userName = userResults[0].name;
			callback(null, userName);
		}
	);
}
exports.register = (req, res) => {
	const { name, email, password, passwordConfirm } = req.body;
	if (password.length < 6) {
		return res.render("home/sign-up", {
			message: "Password is too short! Must be at least 6 characters.",
		});
	}
	db.query(
		"SELECT email FROM users WHERE email = ?",
		[email],
		(error, results) => {
			if (error) console.log(error);

			const rows = results;

			if (rows.length > 0)
				return res.render("home/sign-up", {
					message: "That email is already taken!",
				});
			else if (password !== passwordConfirm)
				return res.render("home/sign-up", {
					message: "Password do not match!",
				});
			else
				db.query(
					"INSERT INTO users SET ?",
					{ name: name, email: email, password: password },
					(error, results) => {
						if (error) console.log(error);
						else {
							console.log("user registered");
							res.redirect(
								"/sign-in?message=User+registered!&type=success"
							);
						}
					}
				);
		}
	);
};

exports.login = (req, res) => {
	db.query(
		"SELECT * FROM users WHERE email = ? AND password = ?",
		[req.body.email, req.body.password],
		(error, results) => {
			if (error) {
				res.status(500).send("Internal Server Error");
				return;
			}

			const rows = results;
			if (rows.length > 0) {
				authState.isLogging = true;
				res.cookie("userID", rows[0].id);
				res.redirect("/auth/inbox");
			} else {
				res.render("home/sign-in", {
					message: "Wrong Email or Password",
					type: "fail",
				});
			}
		}
	);
};

exports.showComposePage = (req, res) => {
	if (authState.isLogging === true) {
		const userID = req.cookies.userID;

		const sql = `SELECT id, email FROM users WHERE id != ?;`;

		db.query(sql, [userID], (error, results) => {
			if (error) {
				console.log(error);
				res.status(500).send("Internal Server Error");
				return;
			}

			getUserName(userID, (err, userName) => {
				if (err) {
					console.log(err);
					res.status(500).send("Internal Server Error");
					return;
				}

				res.render("home/compose", {
					users: results,
					isLogging: authState.isLogging,
					userName: userName,
				});
			});
		});
	} else {
		res.status(403).render("home/access_denied", {
			message: "You must first sign in to use that function",
			type: "fail",
			isLogging: authState.isLogging,
		});
	}
};

exports.sendEmail = (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			console.log("File upload error:", err);
			res.status(500).send("Internal Server Error");
			return;
		}

		const { recipient, customEmail, subject, body } = req.body;
		const senderID = req.cookies.userID;

		getUserName(senderID, (err, userName) => {
			if (err) {
				console.log(err);
				res.status(500).send("Internal Server Error");
				return;
			}

			let finalRecipient = recipient || customEmail;

			if (!finalRecipient) {
				const sql = `SELECT id, email FROM users WHERE id != ?;`;
				return db.query(sql, [senderID], (error, results) => {
					if (error) {
						console.log(error);
						res.status(500).send("Internal Server Error");
						return;
					}
					return res.render("home/compose", {
						users: results,
						errorMessage:
							"Please select a recipient or enter an email manually.",
						isLogging: authState.isLogging,
						userName: userName,
					});
				});
			}

			const emailSubject = subject || "(no subject)";
			const sqlFindRecipient = `SELECT id FROM users WHERE email = ?;`;

			db.query(sqlFindRecipient, [finalRecipient], (error, results) => {
				if (error) {
					console.log(error);
					res.status(500).send("Internal Server Error");
					return;
				}

				if (results.length === 0) {
					return res.render("home/compose", {
						users: [],
						errorMessage: "Recipient email not found in the system.",
						isLogging: authState.isLogging,
						userName: userName,
					});
				}

				const receiverID = results[0].id;

				const sqlInsertEmail = `
                   INSERT INTO emails (senderid, receiverid, subject, message, sent_at) 
                   VALUES (?, ?, ?, ?, NOW());
               `;

				db.query(
					sqlInsertEmail,
					[senderID, receiverID, emailSubject, body],
					(error) => {
						if (error) {
							console.log(error);
							res.status(500).send("Internal Server Error");
							return;
						}

						const sql = `SELECT id, email FROM users WHERE id != ?;`;
						db.query(sql, [senderID], (error, results) => {
							if (error) {
								console.log(error);
								res.status(500).send("Internal Server Error");
								return;
							}
							res.render("home/compose", {
								users: results,
								successMessage: "Email sent successfully!",
								isLogging: authState.isLogging,
								userName: userName,
							});
						});
					}
				);
			});
		});
	});
};

exports.authState = authState;
