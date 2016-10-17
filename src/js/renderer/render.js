import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates, graphs } from './renderHelpers'
import request from 'request'

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
      var newarchieml = archieml;
    newarchieml.content = [];
    for (var i= 0; i < blocks.length; i++) {
        var block = blocks[i];
        block.innards = getiframe(block);
        block.guts = block.innards.body;
        console.log(block);
    }
    console.log(newarchieml);
}

function getiframe(block) {
    var output = '';
    reqwest({
        url: block.src,
        type: 'html',
        success: (resp) => {
            output = resp;
            return output;
        },
        error: (err) => {
       //     console.log(err);
        }
    });
  
}




reqwest({
    url: 'https://interactive.guim.co.uk/docsdata-test/1JikkOipmxlQv_cHWlxB31aPvSVVlil8PypDgltMhKqk.json',
    type: 'json',
    success: (resp) => {
        getinnards(resp);
        //   var html = template(resp);
        //  render(html);
    }
});

/*






















function getinnards(archieml) {
    var blocks = archieml.content;

    var p1 = new Promise(
        function (resolve, reject) {
            resolve(blocks.map(function (block) {
                block.indexvalue = blocks.indexOf(block);
                getiframe(block);
                return block;
            }));
        }
    );

    p1.then(function(hmm) {
        console.log(blocks);

    var newarchieml = archieml;
    newarchieml.content = blocks;
   var html = template(newarchieml);
//    render(html);

    })
    .catch(
        function (reason) {console.log('error!')}
    );


}

function morestuff(block,resp) {
            block.stuff = 'stuff';
            block.innards = resp;
            return block;
}

function getiframe(block) {
    //console.log(block);
    block.test = 'test';

    reqwest({
        url: block.src,
        type: 'html',
        success: (resp) => {
//            block.innards = resp;
  //          graphs(block);
        block.morestuff(block, resp);
        },
        error: (err) => {
            console.log(err);
        }

    });
 
 return block;
}

*/