// https://cloud.google.com/natural-language/docs/basics?hl=fr#interpreting_sentiment_analysis_values

const language = require('@google-cloud/language');
const firebaseAdminKey = require('../firebaseAdminKey.json')
const SUPPORTED_CLOUD_SENTIMENT_LANGUAGE = ["ar", "zh", "zh-Hant", "nl", "en", "fr", "dr", "id", "it", "ja", "ko", "pt", "es", "th", "tr", "vi"]

const client = new language.LanguageServiceClient({
    credentials: firebaseAdminKey
});

const sentimentEnum = {"positive":1, "neutral":2, "negative":3, "unknown": 4}

const THRESHOLD_POSITIVE = 0.1
const THRESHOLD_NEGATIVE = -0.1

const getTextSentiment = async (text, language) => {
    
    const isTextLanguageSupported = SUPPORTED_CLOUD_SENTIMENT_LANGUAGE.find((languageSupported) => language === languageSupported)
    if (!isTextLanguageSupported) {
        return sentimentEnum.unknown
    }
    
    const content = text
    const document = {
        language: language,
        content: content,
        type: 'PLAIN_TEXT',
    };

    const [result] = await client.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;
    const score = sentiment.score

    // var sentimentResult = null;

    if (score > THRESHOLD_POSITIVE) {
        sentimentResult = sentimentEnum.positive
    } else if (score < THRESHOLD_NEGATIVE) {
        sentimentResult = sentimentEnum.negative 
    } else {
        sentimentResult = sentimentEnum.neutral
    }

    console.log(`sentiment.score ${score} - ${text} - ${sentimentResult}`)

    return sentimentResult
}

module.exports = {
    sentimentEnum,
    getTextSentiment,
};
  
  
  