const { ACCEPTED, DEBT, MAX_AMOUNT_BREACH } = require("./decision");

const CUSTOMER_DEBT_LIMIT = 100;
const PURCHASE_AMOUNT_LIMIT = 10;

const makeDecisionUsingPreliminaryConditions = purchaseAmount =>
  purchaseAmount > PURCHASE_AMOUNT_LIMIT ? MAX_AMOUNT_BREACH : undefined;

const makeDecisionBasedOnCustomerDebt = (purchaseAmount, currentCustomerDebt) =>
  isDebtLimitGoingToBeExceeded(purchaseAmount, currentCustomerDebt)
    ? DEBT
    : ACCEPTED;

const isDebtLimitGoingToBeExceeded = (purchaseAmount, currentCustomerDebt) =>
  currentCustomerDebt + purchaseAmount > CUSTOMER_DEBT_LIMIT;

module.exports.makeCreditDecision = (purchaseAmount, currentCustomerDebt) =>
  makeDecisionUsingPreliminaryConditions(purchaseAmount) ||
  makeDecisionBasedOnCustomerDebt(purchaseAmount, currentCustomerDebt);
