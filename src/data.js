import PouchDB from 'pouchdb'

window.PouchDB = PouchDB
const BACKEND_URL = location.protocol + '//' + location.host + '/db'
let localDB = new PouchDB('topics')
let remoteDB = new PouchDB(BACKEND_URL + '/topics')

localDB.sync(remoteDB, {
  live: true,
  retry: true
}).on('change', change => {
  console.log(change)
  // yay, we're in sync!
}).on('paused', function (info) {
  // replication was paused, usually because of a lost connection
}).on('active', function (info) {
  // replication was resumed
}).on('error', err => {
  console.log('there is an error', err)
  // boo, we hit an error!
})

// set topic in db
export const setTopic = (topic) => {
  return localDB.put(topic).then().catch(() => {
    return localDB.get(topic._id).then(doc => {
      topic._rev = doc._rev
      return localDB.put(topic)
    }).then().catch(err => {
      console.log(err)
      if (err.status === 500) return 500
      return -1
    })
  })
}

export const getTopic = (id) => {
  return localDB.get(id).then(doc => {
    return doc
  }).then().catch(err => {
    console.log(err)
    return -1
  })
}

export const addProposal = (id, title, discussion) => {
  return getTopic(id).then(topic => {
    // add proposal
    let index = Object.keys(topic.proposals).length + 1
    topic.proposals[index] = {}
    topic.proposals[index].title = title
    topic.proposals[index].titleTimestamp = Date.now()
    topic.proposals[index].discussion = discussion
    topic.proposals[index].discussionTimestamp = Date.now()

    // put them back
    return localDB.put(topic)
  })
}

export const updateProposal = (id, index, title, discussion) => {
  return getTopic(id).then(topic => {
    // add proposal
    let proposal = topic.proposals[index]
    if (title !== false) {
      proposal.title = title
      proposal.titleTimestamp = Date.now()
    }

    if (discussion !== false) {
      proposal.discussion = discussion
      proposal.discussionTimestamp = Date.now()
    }

    // put them back
    return localDB.put(topic)
  })
}

export const getProposals = (id) => {
  return getTopic(id).then(topic => {
    return topic.proposals
  }).then().catch(err => {
    console.log(err)
    return -1
  })
}

export const setVotes = (id, name, emojis) => {
  return getTopic(id).then(topic => {
    // add proposal
    if (topic.votes === undefined) topic.votes = {}
    if (topic.votes[name] === undefined) topic.votes[name] = emojis
    else return -2
    // put them back
    return localDB.put(topic)
  }).then().catch(err => {
    console.log(err)
    return -1
  })
}

export const getVotes = (id) => {
  return getTopic(id).then(topic => {
    return topic.votes
  }).then().catch(err => {
    console.log(err)
    return -1
  })
}
