module.exports = ({ genericErrorMessage = "An error has occurred" } = {}) => {
  return (error, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
      console.error({
        error,
        message: error.message || genericErrorMessage
      });
    }

    if (error.status) {
      return res.status(error.status).json({
        type: error.name,
        message: error.message,
        errors: error.errors
      });
    } else {
      return res.status(500).json({ message: genericErrorMessage });
    }
  };
};
