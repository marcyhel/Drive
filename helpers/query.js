const { Op } = require("sequelize");
// const ForcedAccess = require("../models/forced_access");
// const { Territory } = require("../models/territory");
// const Farms = require("../services/farms");

var skip_where_params = [
  "limit",
  "offset",
  "order",
  "orderby",
  "attr",
  "like",
  "start_date",
  "end_date",
  "user_id",
  "regional_id",
  "pagination",
  "biofactory",
];

function QueryParams() {
  this.where_params = [];
  this.query = { include: [] };
}

QueryParams.prototype.getQuery = function () {
  if (this.where_params.length == 1) {
    this.query["where"] = this.where_params[0];
  } else if (this.where_params.length > 1) {
    this.query["where"] = { [Op.and]: this.where_params };
  }
  return this.query;
};

QueryParams.prototype.BuildWhere = function (params) {
  for (const [key, value] of Object.entries(params)) {
    if (skip_where_params.indexOf(key.toLowerCase()) < 0) {
      let where = {};
      if (value) {
        where[key] = value;
        this.where_params.push(where);
      }
    }
  }
};

// QueryParams.prototype.FilterByRegion = function (req) {
//   const params = req.query;
//   if (Object.keys(params).indexOf("regional_id") >= 0) {
//     this.where_params.push({
//       "$territory.regional_id$": parseInt(
//         Object.values(params)[Object.keys(params).indexOf("regional_id")]
//       ),
//     });
//   }
//   if (req.path === "/farms") {
//     this.query.include.push({ model: Territory });
//   }
// };

QueryParams.prototype.Limit = function (params) {
  if (Object.keys(params).indexOf("limit") >= 0) {
    this.query["limit"] = parseInt(
      Object.values(params)[Object.keys(params).indexOf("limit")]
    );
  }
};

QueryParams.prototype.Offset = function (params) {
  if (Object.keys(params).indexOf("offset") >= 0) {
    this.query["offset"] = parseInt(
      Object.values(params)[Object.keys(params).indexOf("offset")]
    );
  }
};

QueryParams.prototype.Order = function (params) {
  if (Object.keys(params).indexOf("orderby") >= 0) {
    var orderby = Object.values(params)[Object.keys(params).indexOf("orderby")];
    var order = "ASC";

    if (Object.keys(params).indexOf("order") >= 0) {
      order =
        Object.values(params)[
          Object.keys(params).indexOf("order")
        ].toUpperCase() == "DESC"
          ? "DESC"
          : order;
    }
    this.query["order"] = [[orderby, order]];
  }
};

// QueryParams.prototype.FilterByUser = async function (params) {
//   if (Object.keys(params).indexOf("user_id") >= 0) {
//     const user_id = parseInt(
//       Object.values(params)[Object.keys(params).indexOf("user_id")]
//     );

//     var farms = await Farms.getForcedByUser(user_id);

//     if (!farms || !farms.length) farms = [999999999]; // if there is no farm for user_id, we need the farm_id query to Find nothing

//     this.where_params.push({ id: { [Op.or]: farms } });
//   }
// };

QueryParams.prototype.FilterByLike = function (params) {
  if (
    Object.keys(params).indexOf("attr") >= 0 &&
    Object.keys(params).indexOf("like") >= 0
  ) {
    const attr = Object.values(params)[Object.keys(params).indexOf("attr")];
    const like =
      "%" + Object.values(params)[Object.keys(params).indexOf("like")] + "%";

    var q = {};
    q[attr] = { [Op.like]: like };
    this.where_params.push(q);
  }
};

QueryParams.prototype.FilterByPeriod = function (params) {
  if (
    Object.keys(params).indexOf("start_date") >= 0 &&
    Object.keys(params).indexOf("end_date") >= 0
  ) {
    this.where_params.push({
      created_at: {
        [Op.gte]:
          Object.values(params)[Object.keys(params).indexOf("start_date")],
        [Op.lt]: Object.values(params)[Object.keys(params).indexOf("end_date")],
      },
    });
  } else if (Object.keys(params).indexOf("start_date") >= 0) {
    this.where_params.push({
      created_at: {
        [Op.gte]:
          Object.values(params)[Object.keys(params).indexOf("start_date")],
      },
    });
  } else if (Object.keys(params).indexOf("end_date") >= 0) {
    this.where_params.push({
      created_at: {
        [Op.lt]: new Date(
          Object.values(params)[Object.keys(params).indexOf("end_date")]
        ),
      },
    });
  }
};

QueryParams.prototype.filterFarms = function (farm_ids) {
  if (farm_ids && farm_ids.length > 0) {
    if (this.query["where"]) {
      if (this.query["where"].id) {
        if (farm_ids.includes(parseInt(this.query["where"].id))) {
          this.query = { where: { id: -1 } }; // Must not access requested farm
        }
      } else if (this.query["where"][Op.and]) {
        this.query["where"][Op.and].push({ id: farm_ids });
      } else {
        this.query["where"].id = farm_ids;
      }
    } else {
      this.query.where = { id: farm_ids };
    }
  }
};

// QueryParams.prototype.includeForcedFarms = function (includeForced) {
//   if (includeForced) {
//     this.query.include.push({ model: ForcedAccess });
//   }
// };

var BuildQuery = async function (request) {
  var query = new QueryParams();

  if (request.query) {
    query.BuildWhere(request.query);
    // query.FilterByRegion(request);
    // await query.FilterByUser(request.query);
    query.Limit(request.query);
    query.Offset(request.query);
    query.Order(request.query);
    query.FilterByLike(request.query);
    query.FilterByPeriod(request.query);
    query.filterFarms(request.filter_farms);
    // query.includeForcedFarms(request.includeForced);
  }

  return query.getQuery();
};

module.exports = BuildQuery;
