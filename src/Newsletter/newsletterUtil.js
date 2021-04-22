const mjml2html = require('mjml');
const Handlebars = require('handlebars');

const transformMjmlToHtml = (mjml) => {
 return mjml2html(mjml, {})
};

const replaceVariablesToHtmlWithData = (data, html) => {  
  const template = Handlebars.compile(html);
  return template(data);
};

module.exports = {
  transformMjmlToHtml,
  replaceVariablesToHtmlWithData
};