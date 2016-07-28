const twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
const facebookBaseUrl = 'https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&redirect_uri=http://www.theguardian.com&link=';
const googleBaseUrl = 'https://plus.google.com/share?url=';

function init() {

  var iframes = document.querySelectorAll('.iframe');

  [].forEach.call(iframes, function(i){
  	loadIframe(i, i.getAttribute('data-iframe-src') );
  })
}

function onLoad(){

	[].slice.apply(document.querySelectorAll('.interactive-share')).forEach(shareEl => {
	    var network = shareEl.getAttribute('data-network');
	    var url = shareEl.getAttribute('data-share-url');
	    var text = shareEl.getAttribute('data-share-text');
	    shareEl.addEventListener('click',() => share(network,url,text));
	});
}



function share(network, shareURL, message) {

        if (network === 'twitter') {
            shareWindow = twitterBaseUrl + encodeURIComponent(message + ' ') + shareURL;
        } else if (network === 'facebook') {
            shareWindow = facebookBaseUrl + shareURL;
        } else if (network === 'email') {
            shareWindow = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + shareURL;
        } else if (network === 'google') {
            shareWindow = googleBaseUrl + shareURL;
        }

        window.open(shareWindow, network + 'share', 'width=640,height=320');
}


function loadIframe(el, link){
    // Extract href of the first link in the content, if any
    var iframe;

    function _postMessage(message) {
        iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    }

    if (link) {
        iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.height = '500'; // default height
        iframe.src = link;

        // Listen for requests from the window
        window.addEventListener('message', function(event) {
            if (event.source !== iframe.contentWindow) {
                return;
            }

            // IE 8 + 9 only support strings
            var message = JSON.parse(event.data);

            // Actions
            switch (message.type) {
                case 'set-height':
                    iframe.height = message.value;
                    break;
                case 'navigate':
                    document.location.href = message.value;
                    break;
                case 'scroll-to':
                    window.scrollTo(message.x, message.y);
                    break;
                case 'get-location':
                    _postMessage({
                        'id':       message.id,
                        'type':     message.type,
                        'hash':     window.location.hash,
                        'host':     window.location.host,
                        'hostname': window.location.hostname,
                        'href':     window.location.href,
                        'origin':   window.location.origin,
                        'pathname': window.location.pathname,
                        'port':     window.location.port,
                        'protocol': window.location.protocol,
                        'search':   window.location.search
                    }, message.id);
                    break;
                case 'get-position':
                    _postMessage({
                        'id':           message.id,
                        'type':         message.type,
                        'iframeTop':    iframe.getBoundingClientRect().top,
                        'innerHeight':  window.innerHeight,
                        'innerWidth':   window.innerWidth,
                        'pageYOffset':  window.pageYOffset
                    });
                    break;
                 case 'embed-size':
                 	var x = null;
                 	break;
                default:
                   console.error('Received unknown action from iframe: ', message);
            }
        }, false);

        // Replace link with iframe
        // Note: link is assumed to be a direct child
        el.appendChild(iframe);
    }
}

init();
window.onload = onLoad;