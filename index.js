const express = require("express");
const app = express();
const port = 8000;
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./.env" });

const dbConfig = {
	database: "wpr2101040103",
	host: "localhost",
	user: "wpr",
	password: "fit2024",
	port: 3306,
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/", require("./routes/web"));
app.use("/auth", require("./routes/auth"));

app.listen(port, function () {
	console.log("Server started at port " + port);
});
