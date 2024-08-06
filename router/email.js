module.exports = function (app) {
  app.post('/api/email/v1/send_mail/', function (req, res) {
    let send_mail = require(__dirname + './../src/email/send_mail');
    send_mail.main(req, res)
  });

  app.get('/api/email/v1/mail_index/', function (req, res) {
    res.render("index.html")
    // let send_mail = require(__dirname + './../src/email/mail_index');
    // send_mail.main(req, res)
  });
}