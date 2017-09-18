let notify = require('./notify.js');

notify.init('127.0.0.1', '27017', 'newDB')
// console.log(ws.addPChannel)
wsServer.addLChannel('javascript', function (data) {
  return data;
})
// wsServer.addLChannel('Bootstrap', function (data) {
//   return data;
// })
wsServer.addPChannel('javascript');
// notify.ws.addPChannel('Bootstrap');
