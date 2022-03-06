const { Router } = require("express");
const Notebook = require("../models/notebook");
const auth = require("../middleware/auth");
const router = Router();

function mapCart(cart, options) {
	return cart.items.map((n) => ({
		...n.notebookId._doc,
		id: n.notebookId.id,
		count: n.count,
	}));
}

function computePrice(notebooks) {
	return notebooks.reduce((total, notebook) => {
		return (total += notebook.price * notebook.count);
	}, 0);
}

router.post("/add", auth, async (req, res) => {
	const notebook = await Notebook.findById(req.body.id);
	await req.user.addToCard(notebook);
	// await Card.add(notebook)
	res.redirect("/card");
});

router.delete("/remove/:id", auth, async (req, res) => {
	await req.user.removeFromCart(req.params.id);
	const user = await req.user.populate("cart.items.notebookId");
	const notebooks = mapCart(user.cart);
	const cart = {
		notebooks,
		price: computePrice(notebooks),
	};
	res.status(200).json(cart);
});

router.get("/", auth, async (req, res) => {
	const user = await req.user.populate("cart.items.notebookId");
	// const card = await Card.fetch()
	const notebooks = mapCart(user.cart);
	res.render("card", {
		title: "Basket",
		isCard: true,
		notebooks: notebooks,
		price: computePrice(notebooks),
	});
});

module.exports = router;
