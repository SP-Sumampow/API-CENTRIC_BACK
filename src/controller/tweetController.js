'use strict';
const authMiddleware = require('../auth.middleware.js');
const analyzeSentimentUtil = require('../utils/analyzeSentimentUtil')
const firebase = require('../firebaseConfig');
const tweetKey = require('../tweetKey');
const Twit = require('twit');
const emailUtil = require('../utils/emailUtil')
const newsletterUtil = require('../utils/newsletterUtil')
const requireText = require('require-text');
const mjmlNewsletter = requireText('../index.mjml', require);
const templateHTMLGenerated = newsletterUtil.transformMjmlToHtml(mjmlNewsletter).html
const moment = require('moment');
const Tweet = new Twit(tweetKey)
const NUMBER_OF_TWEETS = 10


const getTweetFromKeyword = async (req, res) => {

  const token = req.cookies.token
  console.log(req.cookies)
  if (!token) return res.status(401).send("cookie not found");
  const userpayload = await authMiddleware.decodeFirebaseIdToken(token)
  if (userpayload.error) return res.status(400).json({"error": userpayload.error});
  const user = userpayload.payload.user
  const uid = user.uid

  const keyword = req.param("keyword")
  const today = moment();
  const yesterday = today.clone().subtract(1, 'days');
  const yesterdayDateString = yesterday.format("YYYY-MM-DD")
  let keywordTweetAnalyzes = {positive: [], negative: []} 

  console.log(`Display tweets since ${yesterdayDateString} ${keyword} since:${yesterdayDateString}}`)

  let result = await Tweet.get('search/tweets', { q: `${keyword} since:${yesterdayDateString}}`, count: NUMBER_OF_TWEETS });
   if (result) {
       let tweets = result.data.statuses
       for(let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i]
        const tweetText = tweet.text
        const lang = tweet.lang
        if (!tweetText && !lang) {
            continue;
        }
        const textSentimemt = await analyzeSentimentUtil.getTextSentiment(tweetText, lang)
        
        switch (textSentimemt) {
            case analyzeSentimentUtil.sentimentEnum.positive:
                keywordTweetAnalyzes.positive.push(generateKeywordTweetAnalyze(tweet))
                break;
            case analyzeSentimentUtil.sentimentEnum.neutral:
                continue;
            case analyzeSentimentUtil.sentimentEnum.negative:
                keywordTweetAnalyzes.negative.push(generateKeywordTweetAnalyze(tweet))
            default:
                continue;
          }
       }
       res.status(200).json(keywordTweetAnalyzes);
   } else {
       res.json(404).json({"error": `No tweet for ${yesterdayDateString}`})
   }
};

const generateTweetAnalyze = async (req, res) => {
    const today = moment();
    const yesterday = today.clone().subtract(1, 'days');
    const yesterdayDateString = yesterday.format("YYYY-MM-DD")

    const db = firebase.admin.firestore();
    const snapshot = await db.collection('users').get()
    const docs = snapshot.docs
    
    for (const userindex in docs) {
        let userData = docs[userindex].data()
        let uid = userData.uid
        let email = userData.email
        let keywords = userData.keywords
        for (const keywordIndex in userData.keywords) {
            let keyword = userData.keywords[keywordIndex]
            let keywordTweetAnalyzes = await getKeywordTweetAnalyzes(keyword)

            userData.keywords[keywordIndex] = {
                ...keyword,
                ...keywordTweetAnalyzes,
                nbOfPositive: keywordTweetAnalyzes.positive.length,
                nbOfNegavtive: keywordTweetAnalyzes.negative.length
            }
            console.log(uid)
            console.log(keywords)


            const newsletterHtml = newsletterUtil.replaceVariablesToHtmlWithData({
                compagnyName: "hetic",
                keyword: keyword.name,
                nbPositive: keywordTweetAnalyzes.positive.length,
                nbNegative: keywordTweetAnalyzes.negative.length
            }, templateHTMLGenerated)

            await emailUtil.sendEmailWithParam(email, "contact@apicentric.fr", "Groupe 4 - WEB2", newsletterHtml, "Daily tweet report", ["dailytweetreport"]);
        }   
        await db.collection('users').doc(uid).set({...userData}, {merge: true});
    }

    res.json(200).send("coucou")
};

module.exports = {
    getTweetFromKeyword,
    generateTweetAnalyze
};

const generateKeywordTweetAnalyze = (tweetExtract) => {
 return {
     createdAt: tweetExtract.created_at,
     tweetUrl: `https://twitter.com/${tweetExtract.user.screen_name}/status/${tweetExtract.id}`,
     tweet: tweetExtract.text,
     name: tweetExtract.user.name,
     location: tweetExtract.user.location,
     description: tweetExtract.user.description,
     avatar: tweetExtract.user.profile_image_url_https
 }
}

 const getKeywordTweetAnalyzes = async (keywordParam) => {
    const keyword = keywordParam
    const today = moment();
    const yesterday = today.clone().subtract(1, 'days');
    const yesterdayDateString = yesterday.format("YYYY-MM-DD")
    let keywordTweetAnalyzes = {positive: [], negative: []} 
  
    console.log(`Display tweets since ${yesterdayDateString} ${keyword} since:${yesterdayDateString}}`)
  
    let result = await Tweet.get('search/tweets', { q: `${keyword} since:${yesterdayDateString}}`, count: NUMBER_OF_TWEETS });
     if (result) {
         let tweets = result.data.statuses
         for(let i = 0; i < tweets.length; i++) {
          const tweet = tweets[i]
          const tweetText = tweet.text
          const lang = tweet.lang
          if (!tweetText && !lang) {
              continue;
          }
          const textSentimemt = await analyzeSentimentUtil.getTextSentiment(tweetText, lang)
          
          switch (textSentimemt) {
              case analyzeSentimentUtil.sentimentEnum.positive:
                  keywordTweetAnalyzes.positive.push(generateKeywordTweetAnalyze(tweet))
                  break;
              case analyzeSentimentUtil.sentimentEnum.neutral:
                  continue;
              case analyzeSentimentUtil.sentimentEnum.negative:
                  keywordTweetAnalyzes.negative.push(generateKeywordTweetAnalyze(tweet))
              default:
                  continue;
            }
         }
         return keywordTweetAnalyzes
     } else {
        return null
     }
}