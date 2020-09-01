const {
  getByEmail: getCustomerDebt,
  increaseByEmail: increaseCustomerDebt
} = require("./model");
const { makeCreditDecision } = require("./service");

module.exports.getCreditDecision = async ({ amount, email }) => {
  const customerDebt = await getCustomerDebt(email);
  const decision = makeCreditDecision(amount, customerDebt);

  if (decision.accepted) {
    await increaseCustomerDebt(email, amount);
  }

  return decision;
};
