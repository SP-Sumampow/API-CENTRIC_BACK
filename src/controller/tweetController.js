'use strict';
const authMiddleware = require('../auth.middleware.js');
const analyzeSentimentUtil = require('../utils/analyzeSentimentUtil')
const tweetKey = require('../tweetKey');
const Twit = require('twit');
const moment = require('moment');
const { text } = require('express');
const Tweet = new Twit(tweetKey)
const NUMBER_OF_TWEETS = 10


const getTweetFromKeywords = async (req, res) => {

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
                keywordTweetAnalyzes.positive.push(tweet)
                break;
            case analyzeSentimentUtil.sentimentEnum.neutral:
                continue;
            case analyzeSentimentUtil.sentimentEnum.negative:
                keywordTweetAnalyzes.negative.push(tweet)
            default:
                continue;
          }
       }
       res.status(200).json(keywordTweetAnalyzes);
   } else {
       res.json(404).json({"error": `No tweet for ${yesterdayDateString}`})
   }

};

module.exports = {
    getTweetFromKeywords,
};