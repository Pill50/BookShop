import { Controller, Post, Body } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';

@Controller('payment')
export class PaymentController {
  @Post('create')
  async createPayment(@Body() requestBody: any) {
    const { orderInfo, redirectUrl, ipnUrl, requestType, amount, extraData } =
      requestBody;

    const accessKey = process.env.PAYMENT_ACCESS_KEY.replace(
      /^'|'$/g,
      '',
    ).trim();
    const secretKey = process.env.PAYMENT_SECRET_KEY.replace(
      /^'|'$/g,
      '',
    ).trim();

    const orderId = 'MOMO' + Date.now().toString();

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=MOMO&redirectUrl=${redirectUrl}&requestId=${orderId}&requestType=payWithMethod`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestData = JSON.stringify({
      partnerCode: 'MOMO',
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      lang: 'vi',
      requestId: orderId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      signature,
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(responseData));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(requestData);
      req.end();
    });
  }
}
