'use strict';
define([], function() {
    function addCSS(url) {
        var head = document.querySelector('head');
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', url);
        head.appendChild(link);
    }

    return {
        boot: function(el, context, config, mediator) {
          var iframe;
          var url = '<%= basePath %>/index.html';

          function _postMessage(message) {
              iframe.contentWindow.postMessage(JSON.stringify(message), '*');
          }

          iframe = document.createElement('iframe');
          iframe.style.width = '100%';
          iframe.style.border = 'none';
          iframe.height = '1200'; // default height
          iframe.src = url;
          el.style.margin = '0';

          // Listen for requests from the window
          window.addEventListener('message', function(event) {
              if (event.source !== iframe.contentWindow) {
                  return;
              }

              // IE 8 + 9 only support strings
              var message = JSON.parse(event.data);

              function getOffset(el) { return el ? el.offsetTop + getOffset(el.offsetParent) : 0; }

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
                          'offset':       getOffset(iframe),
                          'innerHeight':  window.innerHeight,
                          'innerWidth':   window.innerWidth,
                          'pageYOffset':  window.pageYOffset
                      });
                      break;
                  default:
                     console.error('Received unknown action from iframe: ', message);
              }
          }, false);
          el.appendChild(iframe);
        }
    };
});
