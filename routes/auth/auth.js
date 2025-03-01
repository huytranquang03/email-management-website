const express = require("express");
const authController = require("../../controllers/auth");
const mysql = require("mysql2");
const dbConfig = {
	host: "localhost",
	user: "wpr",
	password: "fit2024",
	port: 3306,
	database: "wpr2101040103",
};
const db = mysql.createConnection(dbConfig);
const router = express.Router();

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

router.post("/delete-emails", (req, res) => {
	const emailIds = req.body.emailIds; 
	const sql = `DELETE FROM emails WHERE id IN (?) AND (senderid = ? OR receiverid = ?)`;

	db.query(
		sql,
		[emailIds, req.cookies.userID, req.cookies.userID],
		(error, results) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Internal Server Error" });
			}
			res.status(200).json({ message: "Emails deleted successfully" });
		}
	);
});

router.get("/inbox", function (req, res) {
	const isLogging = authController.authState.isLogging;
	const currentPage = req.query.page || 1;
	const emailsPerPage = 5;

	if (isLogging) {
		const userID = req.cookies.userID;

		getUserName(userID, (error, userName) => {
			if (error) {
				res.status(500).send("Internal Server Error");
				return;
			}

			const sql = `
            SELECT
                e.id AS email_id,
                e.subject,
                e.message,
                DATE_FORMAT(e.sent_at, '%Y-%m-%d %H:%i:%s') AS formatted_sent_at,
                u_sender.name AS sender_name
            FROM
                emails e
            JOIN
                users u_receiver ON e.receiverid = u_receiver.id
            JOIN
                users u_sender ON e.senderid = u_sender.id
            WHERE
                u_receiver.id = ?
            ORDER BY
                e.sent_at DESC;
            `;

			db.query(sql, [userID], (error, results) => {
				if (error) {
					console.log(error);
					res.status(500).send("Internal Server Error");
					return;
				}
				const numPages = Math.ceil(results.length / emailsPerPage);

				res.render("home/inbox", {
					emails: results,
					currentPage: currentPage,
					emailsPerPage: emailsPerPage,
					numPages: numPages,
					isLogging: isLogging,
					userName: userName,
				});
			});
		});
	} else {
		res.status(403).render("home/access_denied", {
			message: "You must first Sign-in to use that function",
			type: "fail",
			isLogging: isLogging,
		});
	}
});

router.get("/outbox", function (req, res) {
	const isLogging = authController.authState.isLogging;
	const currentPage = req.query.page || 1;
	const emailsPerPage = 5;

	if (isLogging) {
		const userID = req.cookies.userID;

		getUserName(userID, (error, userName) => {
			if (error) {
				res.status(500).send("Internal Server Error");
				return;
			}

			const sql = `
            SELECT
                e.id AS email_id,
                e.subject,
                e.message,
                DATE_FORMAT(e.sent_at, '%Y-%m-%d %H:%i:%s') AS formatted_sent_at,
                u_receiver.name AS receiver_name
            FROM
                emails e
            JOIN
                users u_receiver ON e.receiverid = u_receiver.id
            JOIN
                users u_sender ON e.senderid = u_sender.id
            WHERE
                u_sender.id = ?  
            ORDER BY
                e.sent_at DESC;
            `;

			db.query(sql, [userID], (error, results) => {
				if (error) {
					console.log(error);
					res.status(500).send("Internal Server Error");
					return;
				}
				const numPages = Math.ceil(results.length / emailsPerPage);

				res.render("home/outbox", {
					emails: results,
					currentPage: currentPage,
					emailsPerPage: emailsPerPage,
					numPages: numPages,
					isLogging: isLogging,
					userName: userName, 
				});
			});
		});
	} else {
		res.status(403).render("home/access_denied", {
			message: "You must first Sign-in to use that function",
			type: "fail",
			isLogging: isLogging,
		});
	}
});

router.get("/detail", (req, res) => {
	const isLogging = authController.authState.isLogging;
	if (isLogging) {
		const userID = req.cookies.userID;

		getUserName(userID, (error, userName) => {
			if (error) {
				res.status(500).send("Internal Server Error");
				return;
			}

			const sql = `
            SELECT
                subject,
                message,
                attachment_path,
                sent_at AS timestamp,
                u_receiver.name AS receiver_name,
                u_sender.name AS sender_name
            FROM
                emails e
            JOIN
                users u_receiver ON e.receiverid = u_receiver.id
            JOIN
                users u_sender ON e.senderid = u_sender.id
            WHERE
                e.id = ?;
            `;

			db.query(sql, [req.query.id], (error, results) => {
				if (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
					return;
				}

				if (results.length === 0) {
					res.status(404).send("Email not found");
					return;
				}

				const email = results[0];

				res.render("home/detail", {
					email,
					isLogging: isLogging,
					userName: userName, 
				});
			});
		});
	} else {
		res.status(403).render("home/access_denied", {
			message: "You must first Sign-in to use that function",
			type: "fail",
			isLogging: isLogging,
		});
	}
});

router.get("/logout", function (req, res) {
	authController.authState.isLogging = false;
	res.clearCookie("userID");
	res.redirect("/");
});

router.post("/sign-up", authController.register);
router.post("/sign-in", authController.login);

router.get("/compose", authController.showComposePage);
router.post("/compose", authController.sendEmail);

module.exports = router;
