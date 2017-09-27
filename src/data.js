import PouchDB from 'pouchdb'

const BACKEND_URL = location.protocol + '//' + location.host + '/db'
let db = new PouchDB(BACKEND_URL + '/topics')
window.PouchDB = PouchDB

// set topic in db
export const setTopic = (topic) => {
  return db.put(topic).then().catch(() => {
    return db.get(topic._id).then(doc => {
      topic._rev = doc._rev
      return db.put(topic)
    }).then().catch(err => {
      console.log(err)
      return -1
    })
  })
}

export const getTopic = (id) => {
  return db.get(id).then(doc => {
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
    return db.put(topic)
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
    return db.put(topic)
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
    return db.put(topic)
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
