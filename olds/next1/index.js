const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const notebooksRoutes = require("./routes/notebooks");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders")
const User = require("./models/user")


const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

async function start() {
	try {
		const password = "Hf0PJJzjioBXFbLO";
		const URL = `mongodb+srv://bekkidev:${password}@cluster0.gtqvs.mongodb.net/shop`
		await mongoose.connect(URL, { useNewUrlParser: true })
		const candidate = await User.findOne()
    if(!candidate){
      const user = new User({
        email: "bekkikimdev@gmail.com",
        name: "Bolibek",
        cart: {
          items: []
        }
      })
      await user.save()
    }
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

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("622088442a4c44e2bfa1c200")
    req.user = user;
    // req.user = user._id;
    // req.password = user.password;
    next();
  }catch (err) {
    console.log(err);
  }
  
})

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/notebooks", notebooksRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes)


start();