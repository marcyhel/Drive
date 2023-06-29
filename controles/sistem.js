const Os = require('os')
var Sistem = {
    getSistem: async function (req, res, next) {

        try {
            const response = { memori: (Os.freemem() / 1024) / 1024 }
            res.json(response);
        } catch (err) {
            next(err)
        }
    },

}

module.exports = Sistem;
