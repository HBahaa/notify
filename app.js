let notify = require('./notify.js');

notify.init('127.0.0.1', '27017', 'newDB')
// console.log(ws.addPChannel)
notify.rest.addLChannel('Bootstrap', function (data) {
  return data;
})
notify.ws.addLChannel('javascript', function (data) {
  return data;
})
notify.rest.addPChannel('javascript');
notify.ws.addPChannel('Bootstrap');
