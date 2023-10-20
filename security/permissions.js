const role_permissions = require("./role_permissions");
const {
  AuthenticationError,
  AuthorizationError,
} = require("../helpers/errors");
// const Farms = require("../../services/farms");

function isAllowed(service, action, roles) {
  var allowed = false;
  var permission_level = -1;
  var permission = "none";

  roles.forEach((role) => {
    permission = role_permissions[role];
    permission =
      service && permission[service] ? permission[service] : permission;
    permission = action && permission[action] ? permission[action] : permission;

    if (permission !== "none")
      if (
        role_permissions["permission_level"].indexOf(permission) >
        permission_level
      )
        permission_level =
          role_permissions["permission_level"].indexOf(permission);
  });
  return permission_level;
}

const permit = function (args) {
  return async function (req, res, next) {
    console.log(req)
    if (!req.tokenPayload)
      next(
        new AuthenticationError("REQUEST", "No authentication token payload")
      );

    if (!req.isAuthenticated)
      next(new AuthenticationError("REQUEST", "User not authenticated"));

    const roles = ['admin']

    var permission = isAllowed(args.service, args.action, ['admin']);
    if (permission < 0) {
      next(
        new AuthorizationError(
          "REQUEST",
          "User isn't allowed to access this service"
        )
      );
    } else {
      if (
        (roles.includes("admin") || roles.includes("coordenador")) &&
        (req.path === "/farms" || req.path === "/api/v1/farm")
      ) {
				req.includeForced = true;
			}
        

      permission = role_permissions["permission_level"][permission];

      if (permission !== "Any") {
        let filterFarms;
        if (permission !== "None"){}
          // filterFarms = await Farms.getByUser(req.tokenPayload.id);

        // req.filter_farms = filterFarms.length ? filterFarms : [999999999999]; // NO FARM ACCESS
      }
    }

    next();
  };
};

const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated) {
    next(new AuthenticationError("REQUEST", "User not authenticated"));
  } else next();
};

const metricsPermission = function (req, res, next) {
  if (!req.tokenPayload)
    next(new AuthenticationError("REQUEST", "No authentication token payload"));

  const roles = req.tokenPayload.roles.map((r) => {
    return r.scope.toUpperCase();
  });

  if (
    roles.indexOf("ADMIN") >= 0 ||
    roles.indexOf("COORDENADOR") >= 0 ||
    roles.indexOf("SOLUBIO") >= 0 ||
    roles.indexOf("CLIENTE") >= 0
  ) {
    next();
  } else {
    next(new AuthenticationError("Permissions", "User not permitted"));
  }
};

module.exports = { permit, isLoggedIn, metricsPermission };
