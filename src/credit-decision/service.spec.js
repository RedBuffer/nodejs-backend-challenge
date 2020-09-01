const { makeCreditDecision } = require("./service");
const { MAX_AMOUNT_BREACH, DEBT, ACCEPTED } = require("./decision");

describe("Credit decision service", () => {
  it("Should not allow purchases over the purchase amount limit", () => {
    const purchaseAmount = 11;
    const customerDebt = 0;
    expect(makeCreditDecision(purchaseAmount, customerDebt)).toBe(
      MAX_AMOUNT_BREACH
    );
  });

  it("Should not allow purchases that would breech the customer debt limit", () => {
    const purchaseAmount = 1;
    const customerDebt = 100;
    expect(makeCreditDecision(purchaseAmount, customerDebt)).toBe(DEBT);
  });

  it("Should allow purchases under the purchase amount limit within the allowed debt amount", () => {
    const purchaseAmount = 1;
    const customerDebt = 99;
    expect(makeCreditDecision(purchaseAmount, customerDebt)).toBe(ACCEPTED);
  });
});
