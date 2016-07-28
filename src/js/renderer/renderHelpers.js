var fs = require('fs');

function getTemplates(dir) {
    return fs.readdirSync("src/js/renderer/" + dir)
}

function loadTemplates(dir) {
		var templates = getTemplates(dir).map((name) => {
			return [name, fs.readFileSync("./src/js/renderer/" + dir + "/" + name).toString()];
		});

		var templatesObject = {};

		templates.forEach((template) => {
			templatesObject[template[0].replace(/.html/,"")] = template[1];
		});

		return templatesObject;
}

export var templates = loadTemplates('templates');

export function render(content) {
	var css = fs.readFileSync("./build/main.css").toString();
	var page = templates.page.replace(/{{mainContent}}/, content).replace(/{{css}}/, css);

	fs.writeFile("build/index.html", page, function (err) {
		console.log("Rendered");
	});
}
