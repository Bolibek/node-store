const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = Router();

router.get("/login", (req, res) => {
	res.render("auth/login", {
		title: "Register",
		isLogin: true,
		error: req.flash("error"),
		loginError: req.flash("loginError")
	});
});

router.get("/logout", async (req, res) => {
	req.session.destroy(() => {
		res.redirect("/auth/login#login");
	});
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const candidate = await User.findOne({ email });
		if (candidate) {
			const samePsw = bcrypt.compare(password, candidate.password);		
			if (samePsw) {
				req.session.user = candidate;
				req.session.isAuthenticated = true;
				req.session.save((err) => {
					if (err) throw err;
					res.redirect("/");
				});
			} else {
				console.log("Password mismatched");				
			}
		} else {
			// req.flash("loginError", "Wrong password")
			req.flash("loginError", "This email has not been found!")
			res.redirect("/auth/login#login");
		}
	} catch (err) {
		// req.flash("loginError", "This email has not been found!")
		console.log(err, "Request error!");
	}
});

router.post("/register", async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const candidate = await User.findOne({ email });
		if (candidate) {
			req.flash("error", "This email has already been registered!")
			res.redirect("/auth/login#register");
		} else {
      const hashPass = await bcrypt.hash(password, 10);
			const user = new User({
				email,
				name,
				password: hashPass,
				cart: { items: [] },
			});
			await user.save();
			res.redirect("/auth/login#login");
		}
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
