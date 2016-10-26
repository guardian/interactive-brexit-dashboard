import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates, graphs } from './renderHelpers'
import request from 'request'
var response;

Handlebars.registerPartial({
    navigation: templates["navigation"],
    iframe: templates["iframe"],
    includedgraph: templates["includedgraph"],
    includeddyptic: templates["included-dyptic"],
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

    console.log(archieml);

    function getiframe(block) {

        if (typeof block.src === 'string') {

            reqwest({
                url: block.src,
                type: 'html',
                success: (resp2) => {
                    block.innards = resp2.replace(/iframeMessenger.resize\(\)/g, "");

                    //        console.log(archieml);
                },
                error: (err) => {
                    console.log('plum' + err);
                }
            });
        }

        if (typeof block.leftsrc === 'string') {


            reqwest({
                url: block.leftsrc,
                type: 'html',
                success: (resp2) => {
                    block.leftinnards = resp2.replace(/iframeMessenger.resize\(\)/g, "");

                    //        console.log(archieml);
                },
                error: (err) => {
                    console.log('plum' + err);
                }
            });

        }

        if (typeof block.rightsrc === 'string') {

            reqwest({
                url: block.rightsrc,
                type: 'html',
                success: (resp2) => {
                    block.rightinnards = resp2.replace(/iframeMessenger.resize\(\)/g, "");

                    //        console.log(archieml);
                },
                error: (err) => {
                    console.log('plum' + err);
                }
            });


        }

    };


    var blocks = archieml.content;
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        getiframe(block);
        if (archieml.content.indexOf(block) == archieml.content.length - 1) {
            console.log('last one');
            setTimeout(function () {
                var html = template(archieml);
                render(html);
            }, 3000);


        }
    }
}

reqwest({
    url: 'https://interactive.guim.co.uk/docsdata-test/1JikkOipmxlQv_cHWlxB31aPvSVVlil8PypDgltMhKqk.json',
    type: 'json',
    success: (resp) => {
        getinnards(resp);
    }
});