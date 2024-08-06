module.exports = {
	main: async function (req, res) {
		const Joi = require('joi');
		res.setHeader("content-type", "application/json");
		let request_body = JSON.parse(JSON.stringify(req.body));
		const schema = Joi.object({
			email: Joi.string().min(5).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }).required(),
			email_2: Joi.string().min(5).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
			subject: Joi.string().optional(),
			mail_body: Joi.string().required(),

		});

		try {
			let x = schema.validate(request_body);
			//console.log(JSON.stringify(x));

			if (x.hasOwnProperty("error")) {
				res.send(x.error.details);
				return;
			}
		}
		catch (err) {
			//console.log(err)
			res.send(err.stack);
			return;
		}

		const { Client } = require('pg');

		const client = new Client({
			user: 'postgres',
			password: 'Satvik@1234',
			host: '127.0.0.1',
			port: 5432,
			database: 'mail_sender_db',
		});

		await client.connect();

		const nodemailer = require("nodemailer");
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, // Use `true` for port 465, `false` for all other ports
			auth: {
				user: "satvikkambli@gmail.com",
				pass: "afhcgezhnfygsuhd",
			},
		});
		//console.log(JSON.parse(JSON.stringify(request_body)))


		// async..await is not allowed in global scope, must use a wrapper
		async function main() {
			let temp_attachments = [];
			if (request_body.hasOwnProperty("attachments")) {
				for (i = 0; i < request_body.attachments.length; i++) {
					temp_attachments.push({
						path: __dirname + "./../public/" + request_body.attachments[i]
					})
				}
			}
			try {// send mail with defined transport object
				let mail = request_body.email;
				let mail2 = request_body.email;
				const info = await transporter.sendMail({
					from: '"Maddison Foo Koch 👻" <satvikkambli@gmail.com>', // sender address
					to: mail + "," + mail2, // list of receivers
					subject: request_body.subject, // Subject line
					text: request_body.mail_body, // plain text body
					html: request_body.html, // html body
					attachments: temp_attachments
				});
				console.log(info);
				let status = "pass"
				if (info.rejected.length > 0) {
					status = "fail"
				}
				const response = await client.query('INSERT into email_logs (subject,status,message_id,sender,receiver) VALUES($1,$2,$3,$4,$5)', [request_body.subject, status, info.messageId, "satvikkambli@gmail.com", mail]);

				//console.log("Message sent: %s", info.messageId);
				res.send("Mail send sucessfully");
				return;
				// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
			} catch (err) {
				//console.log(err);
				res.send(err);
				return;
			}
		}

		main().catch(console.error);
		//res.send("done");

	}
}