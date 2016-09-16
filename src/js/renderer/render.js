import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates } from './renderHelpers'

Handlebars.registerPartial({
    iframe: templates["iframe"],
    copy: templates["copy"],
    footer: templates["footer"],
    logo: templates["logo"],
    picture: templates["picture"]
});

var template = Handlebars.compile(templates["main"]);

reqwest({
    url: 'https://interactive.guim.co.uk/docsdata-test/1Fy20I36jWz7d0lKPQJqVTpSCBJzHTJSDIeVF8YOMRBk.json',
    type: 'json',
    success: (resp) => {
    	var html = template(resp);
    	console.log(resp);
    	render(html); 
	}
});