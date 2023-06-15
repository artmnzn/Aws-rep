import * as cheerio from "cheerio";
import axios from "axios";
import AWS from "aws-sdk";

async function requestPage() {
  const axiosResponse = await axios.request({
    method: "GET",
    url: "https://www.walmart.com.sv/yogurt-yoplait-griego-natural-1000gr/p",
  });
  const $ = cheerio.load(axiosResponse.data);

  const span = $("span.vtex-store-components-3-x-listPriceValue.strike");

  if (!!span.text()) {
    const ses = new AWS.SES();
    const sender = "artmnznatwork@gmail.com";
    const recipient = "artmnznatwork@gmail.com";
    const subject = "Hello from AWS Lambda!";
    const body = span.text();

    const params = {
      Source: sender,
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    };

    try {
      const result = await ses.sendEmail(params).promise();
      console.log("Email sent:", result.MessageId);
      return {
        statusCode: 200,
        body: "Email sent successfully!",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        statusCode: 500,
        body: "Error sending email",
      };
    }
  } else {
    console.log("Item is not in offer");
  }
}

export async function handler(event, context) {
  await requestPage();
}
