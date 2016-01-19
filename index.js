'use strict';

var ffmpeg = require('fluent-ffmpeg');

module.exports = function(opts, callback) {

  const input = opts.input;
  const output = opts.output;
  const splices = opts.splices;
  const tmpFolder = opts.tmpFolder;

  let jobs = [];

  for (let i=0, l=splices.length; i<l; i++) {

    (function() {

      const start = splices[i].start / 1000;
      const duration = splices[i].duration / 1000;
      const job = i;

      const split = output.split('.');
      const ext = split.pop();
      const out = `${split.join('.')}__${i}.${ext}`;

      jobs[job] = {
        output: out,
        pending: true,
      };

      ffmpeg(input).seekInput(start).duration(duration).save(out)

      .on('start', function(cmd) {
        jobs[job].pending = false;
        jobs[job].running = true;
      })

      .on('error', function(err) {
        jobs[job].running = false;
        callback(err);
      })

      .on('end', function() {
        jobs[job].running = false;
        jobs[job].complete = true;

        onJobComplete();
      })

    })();
  }

  function onJobComplete() {

    let allComplete = true;
    for (let i in jobs) {
      if (!jobs[i].complete) {
        allComplete = false;
        break;
      }
    }
    if (allComplete) {
      merge();
    }
  }

  function merge() {

    let cmd = ffmpeg();
    for (let i in jobs) {
      cmd.addInput(jobs[i].output);
    }

    cmd.mergeToFile(output, tmpFolder)

    .on('error', function(err) {
      callback(err);
    })

    .on('end', function() {
      callback(null);

      for (let i in jobs) {
        require('fs').unlink(jobs[i].output);
      }
    })
  }
}
