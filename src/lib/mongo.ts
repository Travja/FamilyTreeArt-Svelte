import * as dotenv from 'dotenv';
import type { ConnectOptions, Model } from 'mongoose';
import mongoose, { Connection, Schema } from 'mongoose';
import type { Coupon } from './conf/TreeArtConfig';


class MongoService {
  mdb: Connection;
  codes: string[] = [];
  certSchema: Schema<Coupon> = new Schema<Coupon>({
    code: String,
    expiry: Date,
    value: String,
    isCoupon: Boolean,
    target: String,
    manual: Boolean
  });
  Cert: Model<Coupon> =
    mongoose.modelNames().includes('coupons')
      ? <Model<Coupon>>mongoose.model('coupons')
      : mongoose.model('coupons', this.certSchema);

  constructor() {
    dotenv.config();
    mongoose.Promise = global.Promise;

    this.init().then(_ => {
    });
  }

  init = async (): Promise<void> => {
    this.mdb = mongoose.connection;
    this.mdb.on('error', console.error.bind(console, 'connection error'));
    this.mdb.once('open', () => {
      console.log('Connected to Mongo');
      this.Cert.find({}, (err, certs: Coupon[]) => {
        if (err) {
          console.error('Couldn\'t fetch certificates.');
          return;
        }
        for (let cert of certs) {
          this.codes.push(cert.code);
        }

        this.codes.sort();
        console.log('Valid codes:');
        console.log(this.codes);
      });
    });

    await mongoose.connect(process.env.MONGO_URL, <ConnectOptions>{
      dbName: process.env.MONGO_DB,
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  };

  findCertById = async (code: string): Promise<Coupon> => {
    return new Promise<Coupon>(resolve => {
      this.Cert.findOne({ code }, (err, cert) => {
        if (err || !cert) {
          console.error(err);
          resolve(undefined);
        }

        resolve(cert);
      }).select('-_id -__v');
    });
  };

  generateCode = () => {
    const characters = 'abcdefghjkmnpqrstuvwxyz0123456789';
    console.log('Generating random code.');

    const doGen = () => {
      //(8) = 5(1) + 2(2) + (3) + 3(4) + 5(5) + 4(6) + 4(7)
      let one = characters.charAt(getRandomInt(characters.length));
      let two = characters.charAt(getRandomInt(characters.length));
      let three = characters.charAt(getRandomInt(characters.length));
      let four = characters.charAt(getRandomInt(characters.length));
      let five = characters.charAt(getRandomInt(characters.length));
      let six = characters.charAt(getRandomInt(characters.length));
      let seven = characters.charAt(getRandomInt(characters.length));

      let sum = (5 * toNum(one) + 2 * toNum(two) + toNum(three) + 3 * toNum(four) + 5 * toNum(five) + 4 * toNum(six) + 4
        * toNum(seven));
      let checkDigit = sum % 8;

      return ''.concat(one, two, three, four, five, six, seven, checkDigit.toString());
    };

    let code;
    let iter = 0;
    do {
      code = doGen();
      iter++;
    } while (this.codes.includes(code) && iter < 100);

    if (iter == 100) {
      console.log('Couldn\'t generate code after 100 attempts');
      return '!broken!';
    }

    return code;
  };
}

// const mailer = require('nodemailer');
// const path = require('path');
// const fs = require('fs');

// const { createCanvas, loadImage } = require('canvas');

export const mongoService = new MongoService();

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

let toNum = char => {
  return parseInt(isNaN(char.charAt(0)) ? char.charCodeAt(0) : char.charAt(0));
};

export const validateCode = code => {
  let checkDigit = code.charAt(7);

  //(8) = 5(1) + 2(2) + (3) + 3(4) + 5(5) + 4(6) + 4(7)
  let one = toNum(code.charAt(0));
  let two = toNum(code.charAt(1));
  let three = toNum(code.charAt(2));
  let four = toNum(code.charAt(3));
  let five = toNum(code.charAt(4));
  let six = toNum(code.charAt(5));
  let seven = toNum(code.charAt(6));

  let sum = (5 * one + 2 * two + three + 3 * four + 5 * five + 4 * six + 4 * seven);
  let valid = sum % 8 == checkDigit;

  return valid;
};

// exports.genCode = (req, res) => {
//   let width = 700;
//   let height = 400;
//   const canvas = createCanvas(width, height);
//   const context = canvas.getContext('2d');
//
//   let code = generateCode();
//
//   if (code == '!broken!') {
//     res.status(418);
//     res.send({
//       success: false,
//       err_code: 'GEN_UNSUCCESSFUL',
//       err: 'Payment received. Code not generated.'
//     });
//     return;
//   }
//
//   let date = new Date(new Date().setFullYear(new Date().getFullYear() + 2));
//   let dateStr = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substring(2);
//   let expiration = 'Expires ' + dateStr;
//   let amount = req.body.amount;
//
//   let cert = new Cert({
//     code,
//     expiry: date.getTime(),
//     value: amount,
//     isCoupon: false,
//     target: 'all'
//   });
//
//   cert.save((err, cert) => {
//     if (err) {
//       console.error('Could not save certificate to db.');
//       console.log(JSON.stringify(cert));
//       console.error(err);
//       return;
//     }
//     console.log('Added to mongo!');
//   });
//
//   canvas.width = width;
//   canvas.height = height;
//   context.fillStyle = '#888';
//   context.fillRect(0, 0, width, height);
//   loadImage('./gift_certificate_format.png')
//     .then(image => {
//       context.drawImage(image, 0, 0, width, height);
//       context.font = '24pt Ubuntu'; //Ubuntu lite
//       context.textAlign = 'center';
//       context.fillStyle = '#77a34f';
//       context.fillText(code, 140, 357);
//
//       context.font = '12pt Ubuntu';
//       context.textAlign = 'center';
//       context.fillStyle = '#000';
//       context.fillText(expiration, 140, 380);
//
//       context.font = '35pt Liberation Serif';
//       context.textAlign = 'center';
//       context.fillStyle = '#77a34f';
//       context.fillText('$' + amount + '.00', 545, 180);
//
//       const buffer = canvas.toBuffer('image/png');
//       let loc = path.resolve(`./public/codes/${code}.png`);
//       fs.writeFile(loc, buffer, err => {
//         if (err) {
//           console.log('Failed: ' + err);
//           res.send({
//             success: false,
//             err
//           });
//         } else {
//           sendGiftCertificateEmail({
//             code,
//             expiry: dateStr,
//             name: req.body.name,
//             email: req.body.email,
//             amount
//           }).then(() => {
//             res.send({
//               success: true,
//               code
//             });
//           }).catch(err => {
//             res.send({
//               success: false,
//               err: 'Order processed. Email not sent. -> ' + err
//             });
//           });
//           sendSummaryEmail({
//             code,
//             expiry: dateStr,
//             name: req.body.name,
//             email: req.body.email,
//             amount
//           });
//         }
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.useCertificate = (req, res) => {
//   let code = req.params.code;
//   let amount = parseFloat(req.params.amount);
//
//   if (amount < 0) {
//     res.send(400, { valid: false, err: 'Can\'t be negative' });
//     return;
//   }
//
//   console.log(code + ' ' + amount);
//
//   Cert.findOne({ code: code },
//     (err, cert) => {
//       if (err || !cert) {
//         console.log(err);
//         res.status(404);
//         res.send({ valid: false, err: 'Code not found' });
//         return;
//       }
//
//       if (cert.isCoupon) {
//         res.send({ valid: true });
//         return;
//       }
//
//       cert.value = parseFloat(cert.value) - amount;
//
//       if (cert.value > 0) {
//         new Cert(cert).save((err, cert) => {
//           if (err) {
//             console.error('Could not save certificate to db.');
//             console.log(JSON.stringify(cert));
//             console.error(err);
//             res.status(500);
//             res.send({ valid: false, err: 'Could not update' });
//             return;
//           }
//           console.log('Updated cert value.');
//           res.status(200);
//           res.send({ valid: true, left: cert.value });
//         });
//       } else {
//         new Cert(cert).deleteOne(cert, (err, cert) => {
//           if (err) {
//             console.error('Could not delete certificate from db.');
//             console.log(JSON.stringify(cert));
//             console.error(err);
//             res.status(500);
//             res.send({ valid: false, err: 'Could not delete' });
//             return;
//           }
//           console.log('Deleted. Certificate was spent.');
//           res.status(200);
//           res.send({ valid: true, left: 0 });
//         });
//       }
//     }
//   );
// };

// let sendGiftCertificateEmail = async data => {
//   let transporter = mailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: 'order@customfamilytreeart.com',
//       pass: '4FamilyTreasure'
//     }
//   });
//
//
//   let name = data.name;
//   let email = data.email;
//   let amount = data.amount;
//   let code = data.code;
//   let expiry = data.expiry;
//   let attachments = [];
//   attachments.push({
//     filename: code + '.png',
//     path: path.join('public', 'codes', code + '.png'),
//     cid: code + '@customfamilytreeart.img'
//   });
//
//   attachments.push({
//     filename: 'footer.png',
//     path: 'email_footer.jpg',
//     cid: 'footer@customfamilytreeart.img'
//   });
//
//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Custom Family Tree Art" <order@customfamilytreeart.com>', // sender address
//     to: email,//"the.only.t.craft@gmail.com",//, 8013762747@pm.sprint.com", // list of receivers
//     subject: 'Your Gift Certificate Order from Custom Family Tree Art', // Subject line
//     attachments,
//     text: `${name},
//             Thank you for your order! Here is the image of your gift certificate for $${amount} with code '${code}' that expires ${expiry}. You can print or email the gift certificate to your lucky recipient. You’re about to give the perfect gift!
//             Let us know if you have any questions.
//             Custom Family Tree Art.com
//             `,
//     html: `<p>${name},</p>
//         <p>Thank you for your order! Here is the image of your gift certificate for $${amount} with code '${code}' that expires ${expiry}. You can print or email the gift certificate to your lucky recipient. You’re about to give the perfect gift!</p>
//         <img src="cid:${code}@customfamilytreeart.img"/>
//
//         <p>Let us know if you have any questions.</p>
//         <p>Custom Family Tree Art .com</p>
//         <img src="cid:footer@customfamilytreeart.img"/>`
//   });
//
//   fs.unlink(path.join('public', 'codes', code + '.png'), err => {
//     if (err) console.error(err);
//   });
//   console.log('Sent gift certificate email.');
// };

// const sendSummaryEmail = (details, res) => {
//   let transporter = mailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: 'order@customfamilytreeart.com',
//       pass: '4FamilyTreasure'
//     }
//   });
//
//   // send mail with defined transport object
//   transporter.sendMail({
//     from: '"Custom Family Tree Art" <order@customfamilytreeart.com>', // sender address
//     to: 'order@customfamilytreeart.com',// 8013686043@pm.sprint.com", // list of receivers
//     subject: 'Gift Certificate Purchased!!', // Subject line
//     text: `${details.name} bought a gift certificate for $${details.amount}.
//
// Email: ${details.email}
// Code: ${details.code}`
// //         html: ``
//   }).catch(err => {
//     console.error('Could not send gift certificate summary');
//     console.error(err);
//   });
// };