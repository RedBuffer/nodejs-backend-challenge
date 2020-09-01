jest.mock("./database");
const db = require("./database");
const findByEmailMock = jest.fn();
const setByEmailMock = jest.fn();
db.mockImplementation(() => ({
  findByEmail: async (...args) => findByEmailMock(...args),
  setByEmail: async (...args) => setByEmailMock(...args)
}));

const { getByEmail, increaseByEmail } = require("./model");

describe("Credit debt model", () => {
  describe("Get by email", () => {
    it("Should return 0 when the customer does not exist", async () => {
      findByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(undefined))
      );
      expect(await getByEmail("newcustomer@gmail.com")).toBe(0);
    });

    it("Should return the amount when the customer exists", async () => {
      findByEmailMock.mockReturnValueOnce(new Promise(resolve => resolve(500)));
      expect(await getByEmail("existingcustomer@gmail.com")).toBe(500);
    });
  });

  describe("Increase by email", () => {
    it("Should add the amount on top of the existing debt", async () => {
      const email = "existingcustomer@gmail.com";
      const existingDebt = 200;
      const amount = 100;
      findByEmailMock.mockReturnValueOnce(
        new Promise(resolve => resolve(existingDebt))
      );

      await increaseByEmail(email, amount);

      expect(findByEmailMock).toHaveBeenLastCalledWith(email);
      expect(setByEmailMock).toHaveBeenLastCalledWith(
        email,
        existingDebt + amount
      );
    });
  });
});
