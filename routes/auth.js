const { Router } = require("express");
const bcrypt = require("bcryptjs");
const {body, validationResult} = require("express-validator/check")
const User = require("../models/user");
const { registerValidators } = require("../utils/validator");
const router = Router();

router.get("/login", (req, res) => {
	res.render("auth/login", {
		title: "Register",
		isLogin: true,
		registerError: req.flash("registerError"),
		loginError: req.flash("loginError"),
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
			req.flash("loginError", "This email has not been found!");
			res.redirect("/auth/login#login");
		}
	} catch (err) {
		console.log(err, "Request error!");
	}
});

router.post("/register", registerValidators, async (req, res) => {
	try {
		const { email, password, name, confirm } = req.body;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash("registerError", errors.array()[0].msg);
			return res.status(422).redirect("/auth/login#register");
		}

		const hashPass = await bcrypt.hash(password, 10);
		const user = new User({
			email,
			name,
			password: hashPass,
			cart: { items: [] },
		});
		    console.log(user)

		await user.save();
		res.redirect("/auth/login#login");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
