const createDatabase = require("./database");

describe("Credit decision database", () => {
  describe("Find by email", () => {
    const db = createDatabase({
      ["emailThatExists@gmail.com"]: 500
    });

    it("Should return undefined if the email does not exist", async () => {
      const customerDebt = await db.findByEmail(
        "emailthatdoesnotexist@gmail.com"
      );
      expect(customerDebt).toBeUndefined();
    });

    it("Should return the customer debt when the email exists", async () => {
      const customerDebt = await db.findByEmail("emailThatExists@gmail.com");
      expect(customerDebt).toBe(500);
    });
  });

  describe("Set by email", () => {
    const db = createDatabase();

    it("Should set the customer debt for the email", async () => {
      await db.setByEmail("newCustomer@gmail.com", 200);
      expect(await db.findByEmail("newCustomer@gmail.com")).toBe(200);
    });
  });
});
