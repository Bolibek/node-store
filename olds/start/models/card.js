const path = require("path");
const fs = require("fs");

const pathToDb = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"card.json"
);

class Card {
	static async add(notebook) {
		const card = await Card.fetch();

		const index = card.notebooks.findIndex((n) => n.id === notebook.id);
		const candidate = card.notebooks[index];

		if (candidate) {
			candidate.count++;
			card.notebooks[index] = candidate;
		} else {
			notebook.count = 1;
			card.notebooks.push(notebook);
		}
		card.price += +notebook.price;

		return new Promise((resolve, reject) => {
			fs.writeFile(pathToDb, JSON.stringify(card), (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

  static async remove(id){
		const card = await Card.fetch();

		const index = card.notebooks.findIndex((n) => n.id === id)
		const notebook = card.notebooks[index]

		if(notebook.count === 1){
			card.notebooks = card.notebooks.filter((n) => n.id !== id)
		}else{
			card.notebooks[index].count--;
		}


		card.price-= notebook.price;

		return new Promise((resolve, reject) => {
			fs.writeFile(pathToDb, JSON.stringify(card), (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(card);
				}
			});
		});
	}

	static async fetch() {
		return new Promise((resolve, reject) => {
			fs.readFile(pathToDb, "utf-8", (err, content) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(content));
				}
			});
		});
	}
}

module.exports = Card;
