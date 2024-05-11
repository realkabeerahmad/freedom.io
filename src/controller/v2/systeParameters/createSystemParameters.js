async function createUserApi(req, res) {
  try {
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
