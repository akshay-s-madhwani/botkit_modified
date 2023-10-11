
                exports.threadDefault2NdqrtestFb = function threadDefault2NdqrtestFb(template, vars, ocArr, c, controller) {
                  return [{"title":"from qrpayload.js dynfunc_qrpayloaddefault_2ndqrtest","payload":"hello","content_type":"text"}];
                };
                
                exports.threadDefaultTestqrpayloadFb = function threadDefaultTestqrpayloadFb(template, vars, ocArr, c, controller) {
                  return [{"title":"Titlefrom qrpayload.js dynfunc_qrpayloaddefault_testqrpayload","payload":"TITLEPAYLOADURL_PAYLOAD","content_type":"text","image_url":"https://l-sera-webhook-php-helper.herokuapp.com/picture/logo-orange.jpg"},{"title":"TitleUrlRepeat","payload":"TitleUrlRepeat","content_type":"text","image_url":"https://l-sera-webhook-php-helper.herokuapp.com/picture/logo-sortiratana.jpg"},{"content_type":"user_email","title":"{{vars.str_sample_user_email}}"},{"title":"HelloTitle","payload":"hellopayload","content_type":"text"}];
                };
                