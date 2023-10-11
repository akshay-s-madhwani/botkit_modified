const nock = require('nock')
//const request = require('request')


/* const botiumEndpoint = 'http://127.0.0.1:45100/'

var path = require('path');
var fs = require('fs-extra');

var options = {};
var test_folder = options.test_folder || 'test';
var fixtures_folder = options.fixtures_folder || 'fixtures';
var fp = path.join(test_folder, fixtures_folder, 'just_a_name' + '.js');

let fixtures; */
nock.recorder.rec({
    dont_print: false
});

/* fixtures = nock.recorder.play();
var text = "var nock = require('nock');\n" + fixtures.join('\n');
fs.writeFile(fp, text); */
// nock('https://graph.facebook.com')
//   .post(/.*/)
//   .reply((uri, requestBody, cb) => {
//     request.post({
//       uri: botiumEndpoint,
//       json: requestBody
//     }, (err, response, body) => {
//       if (err) cb(err)
//       else cb(null, [response.statusCode, body])
//     })
//   })
//   .persist()
