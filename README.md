# ffmpeg-splice

> Splice videos with ffmpeg

```javascript

require('ffmpeg-splice')({

  input: 'video.avi',
  splices: [
    {
      start: 10 * 1000,
      duration: 10 * 1000,
    },{
      start: 30 * 1000,
      duration: 5 * 1000,
    }
  ],
  output: 'spliced_video.avi', // will be the concatenation
                               // of the specified segments.
  tmpFolder: '/tmp',

}, function(err) {

  if(err) console.log(err)
  else console.log('done')

})

```

You need [ffmpeg](http://ffmpeg.org) up and running to use this module.
