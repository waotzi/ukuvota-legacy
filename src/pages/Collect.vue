<template>
  <process-layout>
    <div style="max-width: 700px; text-align: left; padding: 1em;">
      <h5><q-field :label="$t('Proposals')"></q-field></h5>
      <br/>
      <div v-for="(obj, index) in proposals" :key="index">
        <div v-if="obj.title !== '_'">
          <q-input @change="updateProposalTitle(obj.title, index)" v-model="obj.title" color="deep-orange-4" class="nomargin" inverted type="text"/>
          <Pad nomargin="true" :data="obj.discussion" :infoLabel="$t('Discussion')"></Pad>
        </div>
        </br>
      </div>
      <br/>
      <div style="position: fixed; bottom: 1em; right: 1em;">
        <q-btn color="primary" round @click="addProposal">
          <q-icon name="add"/>
        </q-btn>
      </div>
    </div>
  </process-layout>
</template>
<script>
import ProcessLayout from 'layouts/ProcessLayout'
import { QBtn, QField, QIcon, QInput, QTooltip } from 'quasar'
import { getProposals, addProposal, updateProposal } from 'src/data'
import Pad from '@/Pad'

export default {
  components: {
    Pad,
    ProcessLayout,
    QBtn,
    QField,
    QIcon,
    QInput,
    QTooltip
  },
  mounted () {
    this.id = this.$route.params.id
    this.updateProposals()
  },
  methods: {
    updateProposals () {
      getProposals(this.id).then((proposals) => {
        for (let index in proposals) {
          if (this.proposals[index] === undefined) {
            this.proposals[index] = {
              'title': '',
              'titleTimestamp': 0,
              'description': '',
              'descriptionTimestamp': 0
            }
          }
          if (this.proposals[index].titleTimestamp < proposals[index].titleTimestamp) {
            this.proposals[index].title = proposals[index].title
            this.proposals[index].titleTimestamp = proposals[index].titleTimestamp
          }
          if (this.proposals[index].discussionTimestamp < proposals[index].discussionTimestamp) {
            this.proposals[index].discussion = proposals[index].discussion
            this.proposals[index].discussionTimestamp = proposals[index].discussionTimestamp
          }
        }
        this.$forceUpdate()
      })
    },
    updateProposal (index, title, discussion) {
      updateProposal(this.id, index, title, discussion).then(() => {
        this.updateProposals()
      })
    },
    updateProposalTitle (newVal, index) {
      this.updateProposal(index, newVal, false)
    },
    updateProposalDiscussion (newVal, index) {
      this.updateProposal(index, false, newVal)
    },
    getProposalError () {
      if (this.proposalExists) return this.$t('Proposal.exists')
      else if (this.proposalEmpty) return this.$t('Proposal.empty')
    },
    addProposal () {
      addProposal(this.id, '', '').then(() => {
        this.updateProposals()
      })
    }
  },
  data () {
    return {
      proposals: {},
      urlpath: window.location.href
    }
  }
}

</script>
<style lang="stylus">
  .nomargin {
    margin: 0
  }
</style>
