'use strict';

const subscribePlanGet = async (req, res) => {
  const subscribePlans = [
    { plan: 'a' },
    { plan: 'b' },
    { plan: 'c' }
  ]
  
  res.status(200).json({ 'plan': 'this is the plan' });
}
  

const subscribeConfirmPost = async (req, res) => {
  res.status(200).json({ 'planConfirm': 'ok' });
};


module.exports = {
  subscribePlanGet,
  subscribeConfirmPost,
};