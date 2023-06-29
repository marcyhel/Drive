
var fs = require('fs');
const path = require('path');
var stream = {
    playing: async function (req, res, next) {
        console.log('connected');

        var music = './uploads/sounds/' + req.params["id"] + '.mp3';

        var stat = fs.statSync(music);
        range = req.headers.range;
        var readStream;

        if (range !== undefined) {
            var parts = range.replace(/bytes=/, "").split("-");

            var partial_start = parts[0];
            var partial_end = parts[1];

            if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
                return res.sendStatus(500);
            }

            var start = parseInt(partial_start, 10);
            var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
            var content_length = (end - start) + 1;

            res.status(206).header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': content_length,
                'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
            });

            readStream = fs.createReadStream(music, { start: start, end: end });
        } else {
            res.header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': stat.size
            });
            readStream = fs.createReadStream(music);
        }
        readStream.pipe(res);

        /*
        //var rand_num= Math.floor(Math.random()*Math.floor(list_video.length));
        // var random_select_file= list_video[rand_num];

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });

        var readerStream = fs.createReadStream("./uploads/sounds/molodoys.mp3");
        readerStream.pipe(res);
        console.log("playing: ");*/
    },

}

module.exports = stream;
