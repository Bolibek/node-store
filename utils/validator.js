const { body } = require("express-validator/check");
const User = require("../models/user");

exports.registerValidators = [
	body("email")
		.isEmail()
		.withMessage("Enter your email correctly")
		.custom(async (value, { req }) => {
			try {
				const user = await User.findOne({ email: value });
				if (user) {
					return Promise.reject("This email has been already registered");
				}
			} catch (e) {
				console.log(e);
			}
		})
		.normalizeEmail(),
	body("password", "Password should be at least 6 characters long")
		.isLength({
			min: 6,
			max: 56,
		})
		.isAlphanumeric()
		.trim(),
	body("confirm").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Passwords should match");
		}
		return true;
	}),
	body("name")
		.isLength({ min: 3 })
		.withMessage("Name must be at least 3 characters long")
		.trim(),
];

exports.notebookValidators = [
	body("title")
		.isLength({ min: 3 })
		.withMessage("Title must be at least 3 characters long")
		.trim(),
	body("price").isNumeric().withMessage("Price must be written in number"),
	body("img").isURL().withMessage("Write correct Image URL"),
	body("descr")
		.isLength({ min: 10 })
		.withMessage("Description should be minimum 10symbols"),
];
