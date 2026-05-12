const jwt = require("jsonwebtoken");



/*
|--------------------------------------------------------------------------
| protect
| Verifies JWT from Authorization header and attaches decoded payload
| { id, role } to req.user
|--------------------------------------------------------------------------
*/

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



/*
|--------------------------------------------------------------------------
| authorize(...roles)
| Must be used AFTER protect.
| Restricts route access to specific roles.
| Usage: authorize("admin"), authorize("admin", "driver")
|--------------------------------------------------------------------------
*/

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
