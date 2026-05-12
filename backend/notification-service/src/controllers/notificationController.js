const sendEmail = require("../services/emailService");



exports.sendNotification = async (req, res) => {
  try {
    const { email, subject, message } = req.body;



    await sendEmail(email, subject, message);



    res.status(200).json({
      success: true,
      message: "Notification Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};