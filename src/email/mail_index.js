module.exports = {

	main: function (req, res) {
		const path = require('path');
		let html_file = require(__dirname + "./../../views/index.html");
		console.log(path(__dirname + "./../../views/index.html"), html_file);
		res.render(html_file);
	}
}