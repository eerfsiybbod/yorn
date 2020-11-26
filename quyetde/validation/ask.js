module.exports.valid = (req, res, next) => {
  let errors = [];
  if (req.body.ask === "") {
    errors.push("Content ask is required");
    res.render("ask", {
      errors: errors,
    });
    return;
  } else {
    next();
  }
};
