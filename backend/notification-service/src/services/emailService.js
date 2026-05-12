const sendEmail = async (to, subject, text) => {

  console.log("=================================");
  console.log("📧 MOCK EMAIL NOTIFICATION");
  console.log("TO:", to);
  console.log("SUBJECT:", subject);
  console.log("MESSAGE:", text);
  console.log("=================================");

  return true;
};

module.exports = sendEmail;