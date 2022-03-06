const express = require("express");
const path = require("path");
const app = express();
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require("express-handlebars");
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require("./routes/home");
const notebooksRoutes = require("./routes/notebooks");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders")
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")

const varMiddleware = require ("./middleware/var")
const userMiddleware = require("./middleware/user")
const errorPage = require("./middleware/error")
const fileMiddleware = require("./middleware/file")


const password = "Hf0PJJzjioBXFbLO";
const URL = `mongodb+srv://bekkidev:${password}@cluster0.gtqvs.mongodb.net/shop`;

const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
  helpers: require("./utils"),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const store = new MongoStore({
  collection: "sessions",
  uri: URL,
})

async function start() {
	try {		
		await mongoose.connect(URL, { useNewUrlParser: true })
    const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`Server has been started on port ${PORT}...`);
		});
	} catch (err) {
		console.log(err);
	}
}

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "secret val",
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(fileMiddleware.single("avatar"))
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware)


app.use("/", homeRoutes);
app.use("/notebooks", notebooksRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes)
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);


app.use(errorPage)

start();