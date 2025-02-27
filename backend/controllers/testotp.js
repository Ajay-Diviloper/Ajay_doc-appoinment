const testotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: true,
        message: "erro test api",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { testotp };
