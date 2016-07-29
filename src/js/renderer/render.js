import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates } from './renderHelpers'

Handlebars.registerPartial({
    iframe: templates["iframe"],
    copy: templates["copy"],
    footer: templates["footer"]
});

var template = Handlebars.compile(templates["main"]);

reqwest({
    url: 'https://interactive.guim.co.uk/docsdata-test/1CxnQeZxkwoNwqrq5EgrLIwBCWr-XwhNHogBidu12DEw.json',
    type: 'json',
    success: (resp) => {
    	var html = template(resp);
    	console.log(resp);
    	render(html); 
	}
});




