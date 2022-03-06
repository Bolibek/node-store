const { Router } = require("express");
const Order = require("../models/order");
const router = Router();

router.get("/", async (req, res) => {
	try {
    const orders = await Order.find({"user.userId": req.user._id}).populate(
      "user.userId"
    )
		res.render("orders", {
			isOrder: true,
			title: "Orders",
      orders: orders.map((n) => ({
        ...n._doc,
        price: n.notebooks.reduce((total, b) => {
          return (total += b.count * b.notebook.price) 
        }, 0)

      }))
		});
	} catch (err) {
		console.log(err);
	}
});

router.post("/", async (req, res) => {
	try {
		const user = await req.user.populate("cart.items.notebookId");
		const notebooks = user.cart.items.map((n) => ({
			count: n.count,
			notebook: { ...n.notebookId._doc },
		}));
		const order = new Order({
			user: {
				name: req.user.name,
				userId: req.user,
			},
			notebooks,
		});
		await order.save();
		await req.user.cleanCart();
		res.redirect("/orders");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
