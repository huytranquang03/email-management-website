const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth");

router.get("/", function (req, res) {
	const isLogging = authController.authState.isLogging;
	if (isLogging) res.redirect("/auth/inbox");
	else
		res.render("home/home", {
			isLogging: isLogging,
		});
});
router.get("/sign-in", function (req, res) {
	const isLogging = authController.authState.isLogging;
	if (isLogging) res.redirect("/auth/inbox");
	else if (req.query.message !== null) {
		const message = req.query.message;
		const type = req.query.type;
		res.render("home/sign-in", { message, type, isLogging });
	} else res.render("home/sign-in", { isLogging: isLogging });
});
router.get("/sign-up", function (req, res) {
	const isLogging = authController.authState.isLogging;
	if (isLogging) res.redirect("/auth/inbox");
	else res.render("home/sign-up", { isLogging: isLogging });
});

module.exports = router;
