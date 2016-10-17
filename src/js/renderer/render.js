import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates, graphs } from './renderHelpers'

Handlebars.registerPartial({
    navigation: templates["navigation"],
    iframe: templates["iframe"],
    copy: templates["copy"],
    footer: templates["footer"],
    logo: templates["logo"],
    picture: templates["picture"],
    dyptic: templates["iframe-dyptic"],
    icon1: templates["icons-01"],
    icon2: templates["icons-02"],
    icon3: templates["icons-03"],
    icon4: templates["icons-04"],
    better: templates["icons-no-label-01"],
    worse: templates["icons-no-label-02"],
    same: templates["icons-no-label-03"],
    shrug: templates["icons-no-label-04"],
    key: templates["key"],
    note: templates["note"]
});

Handlebars.registerHelper('get_last_of', function (context) {
    return context[context.length - 1];
});

var template = Handlebars.compile(templates["main"]);


function getinnards(archieml) {
    var blocks = archieml.content;
    blocks.map(function(block) {
    block.indexvalue = blocks.indexOf(block);
    getiframe(block);
    });
}

function getiframe(block) {
    //console.log(block);
            block.test = 'test';

    reqwest({
        url: block.src,
        type: 'html',
        success: (resp) => {
//            console.log();
            block.innards = resp;
            graphs(block);
  //  console.log(block.innards);
        },
        error: (err) => {
            console.log(err);
        return;} 
            
    });

}
/*
function completerender(archieml) {
  //  console.log('finaloutput');
   // console.log(archieml);
    var html = template(archieml);
    render(html);
};
*/

reqwest({
    url: 'https://interactive.guim.co.uk/docsdata-test/1JikkOipmxlQv_cHWlxB31aPvSVVlil8PypDgltMhKqk.json',
    type: 'json',
    success: (resp) => {
        getinnards(resp);
      var html = template(resp);
     render(html);
    }
});