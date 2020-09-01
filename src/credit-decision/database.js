module.exports = (persistence = {}) => {
  const findByEmail = async email =>
    await new Promise(resolve => resolve(persistence[email]));

  const setByEmail = async (email, amount) =>
    new Promise(resolve => {
      persistence[email] = amount;
      resolve();
    });

  return {
    findByEmail,
    setByEmail
  };
};
