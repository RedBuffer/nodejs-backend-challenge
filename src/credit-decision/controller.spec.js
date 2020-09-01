const { ACCEPTED, DEBT } = require("./decision");

jest.mock("./model");
const model = require("./model");

jest.mock("./service");
const service = require("./service");

const getByEmailMock = jest.fn();
const increaseByEmailMock = jest.fn();
model.getByEmail = getByEmailMock;
model.increaseByEmail = increaseByEmailMock;
const makeCreditDecisionMock = jest.fn();
service.makeCreditDecision = makeCreditDecisionMock;

const { getCreditDecision } = require("./controller");

describe("Credit decision controller", () => {
  const email = "foo@bar.com";
  const amount = 8;
  const existingDebt = 15;

  describe("When the credit decision is approved", () => {
    beforeEach(() => {
      increaseByEmailMock.mockReset();
      getByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(existingDebt))
      );
      makeCreditDecisionMock.mockReturnValueOnce(ACCEPTED);
    });

    it("Should increase the debt of the consumer", async () => {
      const decision = await getCreditDecision({ email, amount });

      expect(increaseByEmailMock).toHaveBeenLastCalledWith(email, amount);
    });

    it("Should return an accepted credit decision", async () => {
      const decision = await getCreditDecision({ email, amount });

      expect(decision.accepted).toBe(true);
    });
  });

  describe("When the credit decision is not approved", () => {
    beforeEach(() => {
      increaseByEmailMock.mockReset();
      getByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(existingDebt))
      );
      makeCreditDecisionMock.mockReturnValueOnce(DEBT);
    });

    it("Should return the reason", async () => {
      const decision = await getCreditDecision({ email, amount });

      expect(decision.accepted).toBe(false);
      expect(decision.reason).toBe("debt");
    });

    it("Should not increase the debt of the consumer", async () => {
      const decision = await getCreditDecision({ email, amount });

      expect(increaseByEmailMock).not.toHaveBeenCalled();
    });
  });
});
