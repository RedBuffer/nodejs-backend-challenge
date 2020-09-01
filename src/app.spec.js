const request = require("supertest");
const app = require("./app");

const DECISION_PATH = "/decision";
const MAX_ALLOWED_DEBT = 100;
const MAX_ALLOWED_AMOUNT = 10;

const requestFixture = req =>
  Object.assign(
    {},
    {
      first_name: "Test",
      last_name: "Testsson",
      email: "test@gmail.com",
      amount: MAX_ALLOWED_AMOUNT
    },
    req
  );

const requestCreditDecision = (entity = requestFixture()) =>
  request(app)
    .post(DECISION_PATH)
    .set("Accept", "application/json")
    .send(entity)
    .expect("Content-Type", /json/);

describe("Credit decision app", () => {
  describe("When called with a credit application", () => {
    describe("When the customer should be accepted", () => {
      it("Responds with an accepted credit decision", async () => {
        return requestCreditDecision()
          .expect(201)
          .then(response => {
            expect(response.body.accepted).toBe(true);
          });
      });
    });

    describe("When the purchase amount is too high", () => {
      it("Should respond with an error", async () => {
        return requestCreditDecision(
          requestFixture({ amount: MAX_ALLOWED_AMOUNT + 1 })
        )
          .expect(200)
          .then(response => {
            expect(response.body.accepted).toBe(false);
            expect(response.body.reason).toBe("amount");
          });
      });
    });

    describe("When the total debt is too high", () => {
      it("Should respond with an error", async () => {
        for (
          let index = 1;
          index < MAX_ALLOWED_DEBT / MAX_ALLOWED_AMOUNT;
          index++
        ) {
          await requestCreditDecision()
            .expect(201)
            .then(response => expect(response.body.accepted).toBe(true));
        }
        return requestCreditDecision()
          .expect(200)
          .then(response => {
            expect(response.body.accepted).toBe(false);
            expect(response.body.reason).toBe("debt");
          });
      });
    });
  });

  describe("When the request is invalid", () => {
    ["first_name", "last_name", "email", "amount"].forEach(field => {
      describe(`When the ${field} is missing`, () => {
        it("Should return an error", async () => {
          const requestEntity = requestFixture();
          requestEntity[field] = undefined;
          return requestCreditDecision(requestEntity)
            .expect(400)
            .then(response => {
              expect(response.body.message).toBe("validation error");
              expect(response.body.errors[0].field[0]).toBe(field);
            });
        });
      });
    });

    describe("When the amount is negative", () => {
      it("Should return an error", async () =>
        requestCreditDecision(requestFixture({ amount: -1 }))
          .expect(400)
          .then(response => {
            expect(response.body.errors[0].field[0]).toBe("amount");
            expect(response.body.errors[0].messages[0]).toBe(
              '"amount" must be larger than or equal to 0'
            );
          }));
    });

    describe("When the email is invalid", () => {
      it("Should return an error", async () =>
        requestCreditDecision(requestFixture({ email: "invalidemail" }))
          .expect(400)
          .then(response => {
            expect(response.body.errors[0].field[0]).toBe("email");
            expect(response.body.errors[0].messages[0]).toBe(
              '"email" must be a valid email'
            );
          }));
    });
  });
});
