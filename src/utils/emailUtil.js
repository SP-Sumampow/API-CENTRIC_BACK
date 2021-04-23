const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
const sendInbLUEapiKey = require("../sendInBlueKey.json")
const API_KEY_DEV = sendInbLUEapiKey.key;

apiKey.apiKey = API_KEY_DEV;

// toEmail = "sentianyPriska@hetic.net"
// fromSender = "contact@HolyOwly.fr"
// fromName = "api-centric"
// htmlContent newsletter html
// titleEmail = "newsletter title" 
const sendEmailWithParam = async (toEmail, fromSender, fromName, htmlContent, titleEmail, tags) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  
  sendSmtpEmail.to = [{ "email": toEmail}];
  sendSmtpEmail.sender = { "email":fromSender, "name": fromName};
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.tags = tags
  sendSmtpEmail.subject = titleEmail;

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log(`API called successfully. to send email at ${toEmail} Returned data: ${data}`);
  }, function(error) {
    console.error(error);
  });
};

module.exports = {
  sendEmailWithParam,
};