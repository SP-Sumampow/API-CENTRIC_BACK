'use strict';

const postKeyword = async (req, res) => {
  const keyword = req.body.keyword;
  
  if (keyword === undefined || keyword === '') {
    res.status(400).json({'error': 'keyword not found'});
  }

  console.log("add to firestore the keyword of the user");


  res.status(200).json({ "keyword": keyword});
};

module.exports = {
    postKeyword,
};
