const verify = async (req, res) => {
    res.status(200).json({error: "false", message: "User Logged"});
};

module.exports = verify;