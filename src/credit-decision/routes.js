const AsyncRouter = require("express-async-router").AsyncRouter;
const router = AsyncRouter();
const jsonParser = require("body-parser").json();
const validate = require("express-validation");
const schema = require("./schema");
const deserialize = require("../lib/middleware/to-camel-case");
const { getCreditDecision } = require("./controller");

router.use(jsonParser);
router.use(validate({ body: schema }));
router.use(deserialize);
router.post("/", async (req, res) => {
  const creditRequest = req.body;
  const decision = await getCreditDecision(creditRequest);
  return res.status(decision.accepted ? 201 : 200).json(decision);
});

module.exports = router;
