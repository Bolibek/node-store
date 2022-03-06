const { Router } = require("express");
const Notebook = require("../models/notebook");
const auth = require("../middleware/auth");
const router = Router();


router.get("/", (req, res) => {
	res.render("add", { title: "Add Notebook", isAdd: true });
});

router.post("/", auth,async (req, res) => {
	const notebook = new Notebook({
		title: req.body.title,
		price: req.body.price,
		img: req.body.img,
		descr: req.body.descr,
		userId: req.user,
	});

	try {
		await notebook.save();
		res.redirect("/notebooks");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
