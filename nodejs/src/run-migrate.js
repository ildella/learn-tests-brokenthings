const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})
const {promisify} = require('util')
const {DateTime} = require('luxon')
const __ = require('highland')
const mongoutils = require('./mongoutils')

const prepareQuery = (transform) => {
  // tracer.debug(transform.options)
  const options = transform.options || {}
  const begin = options.begin || DateTime.local().minus({minutes: 60}).toISO()
  const end = options.end || DateTime.local().toISO()
  const timeRange = mongoutils.rangeQuery(begin, end)
  // const query = {_id: {
  //   $gte: mongoutils.objectIdfromISO(begin),
  //   $lte: ObjectId.createFromTime(DateTime.fromISO(end).ts / 1000)
  // }}
  tracer.trace(`Import: ${transform.source.collection} --> ${transform.sink.collection}`)
  return Object.assign({}, transform, {query: timeRange})
}

const imports = async (job, done) => {
  const requestOptions = job.data.options
  const transforms = _.map(allTransformations, transform =>
    Object.assign({}, transform, {options: requestOptions || transform.options})
  )
  // const timeChunks = createTimeChunks(options)
  // const transforms = _.map(timeChunks, chunk => Object.assign({}, remap, {query: query}, {options: options}))
  // const adsVideos = _.flatten(_.map(transforms, options => {
  //   const result = []
  //   for (const video of campaign.videos) {
  //     result.push({video: video, start: campaign.start, end: campaign.end, name: campaign.name})
  //   }
  //   return result
  // }))
  __(transforms)
    // .map(__.wrapCallback(createTimeChunks)).sequence()
    // .map(logger)
    .filter(transform => {
      return job.data.flow ? job.data.flow === transform.name : true
    })
    .map(prepareQuery)
    // .map(__.wrapCallback(cleanupSink)).sequence()
    .map(__.wrapCallback(importCollection)).sequence()
    .toArray(results => done(null, results))
}

const allTransformations = [
  {
    name: 'users',
    description: 'import users',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'users'
    },
    sink: {
      datastore: 'views',
      collection: 'users'
    },
    mapping: {
      _id: '_id',
      e: 'email',
      fn: 'first_name',
      ln: 'last_name',
      s: 'gender',
      rem: 'removed',
      opt_out_tracking: 'opt_out_tracking',
      opt_out_marketing: 'opt_out_marketing',
      lcty: 'last_city',
      lrgn: 'last_region',
      lrgnn: 'last_region_name',
      lctr: 'last_country',
      lctrn: 'last_country_name',
      inf: 'influencer',
    }
  },
  // {
  //   description: 'index users to ElasticSearch (now on Mongodb temp folder)',
  //   source: {
  //     datastore: 'views',
  //     collection: 'users'
  //   },
  //   sink: {
  //     datastore: 'views',
  //     collection: 'temp_users_index'
  //   }
  // },
  {
    name: 'videos',
    description: 'import videos to legacy_videos',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'photos'
    },
    sink: {
      datastore: 'views',
      collection: 'legacy_videos'
    },
    // options: {
    //   begin: DateTime.local().minus({day: 1}).toISO()
    // },
    // skipCleanupSink: true,
    // subfield: 'video',
    mapping: {
      _id: '_id',
      _u: 'owner',
      ctg: 'category',
      cap: 'caption',
      attr_cap: 'attributed_caption',
      mu: 'soundtrack',
      rem: 'removed',
      skd_t: 'publish_time',
      sms: 'slowmo_start',
      sme: 'slowmo_end',
      src: 'acquisition_source',
      usst: 'screenshot_time',
      vid_raw: 'raw_filename',
      vid_h: 'slowmo_filename',
    },
    valueMapping: require('../api/legacy/categories').mapping
  },
  // {
  //   description: 'transform legacy videos in new uploads',
  //   source: {
  //     datastore: 'views',
  //     collection: 'legacy_videos'
  //   },
  //   sink: {
  //     datastore: 'views',
  //     collection: 'uploads'
  //   },
  //   subfield: 'video'
  // },
  {
    name: 'playlists',
    description: 'import playlists',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'playlists'
    },
    sink: {
      datastore: 'views',
      collection: 'playlists'
    },
    options: {
      begin: '2014-01-01'
    }
  },
  {
    name: 'campaigns',
    description: 'import campaigns',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'adcampaigns'
    },
    sink: {
      datastore: 'views',
      collection: 'campaigns'
    },
    options: {
      begin: '2014-01-01'
    }
  },
  {
    name: 'likes',
    description: 'import likes',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'likes'
    },
    sink: {
      datastore: 'views',
      collection: 'likes'
    },
    mapping: {
      _id: '_id',
      _u: 'user',
      _p: 'video',
      vo: 'video_owner',
      rem: 'removed',
    }
  },
  {
    name: 'comments',
    description: 'import comments',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'comments'
    },
    sink: {
      datastore: 'views',
      collection: 'comments'
    },
    mapping: {
      _id: '_id',
      _u: 'user',
      _p: 'video',
      vo: 'video_owner',
      rem: 'removed',
      text: 'text'
    }
  },
  {
    name: 'shares',
    description: 'import shares',
    source: {
      datastore: 'legacyProdReadOnly',
      collection: 'shares'
    },
    sink: {
      datastore: 'views',
      collection: 'shares'
    },
    mapping: {
      _id: '_id',
      _u: 'user',
      _p: 'video',
      vo: 'video_owner',
      text: 'text'
    }
  },
]

module.exports = promisify(imports)
