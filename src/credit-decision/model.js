const db = require("./database")();

const getByEmail = async email => (await db.findByEmail(email)) || 0;

const increaseByEmail = async (email, amount) => {
  const customerDebt = await getByEmail(email);
  const newCustomerDebt = customerDebt + amount;
  return await db.setByEmail(email, newCustomerDebt);
};

module.exports.getByEmail = getByEmail;
module.exports.increaseByEmail = increaseByEmail;
