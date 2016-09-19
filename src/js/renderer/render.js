import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates } from './renderHelpers'

Handlebars.registerPartial({
    iframe: templates["iframe"],
    copy: templates["copy"],
    footer: templates["footer"],
    logo: templates["logo"],
    picture: templates["picture"],
    dyptic: templates["iframe-dyptic"]
});

Handlebars.registerHelper('get_last_of', function(context) {
  return context[context.length -1];
});

var template = Handlebars.compile(templates["main"]);

reqwest({
    url: 'https://interactive.guim.co.uk/docsdata-test/1CkfDnSoj4Lhhv0gWtiyS5mNnVE7AFAlnlQ8EafbuXow.json',
    type: 'json',
    success: (resp) => {
    	var html = template(resp);
    	console.log(resp);
    	render(html); 
	}
});