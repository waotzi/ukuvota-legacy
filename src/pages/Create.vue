<template>
  <main-layout>
    <q-card style="max-width: 700px; text-align: left;">
      <q-card-main>
        <q-field :error-label="$t('Topic.errorLabel')">
          <q-input v-model="topicQuestion" :float-label="$t('Topic.questionLabel')" :error="topicMissing" />
        </q-field>
        <div class="row">
          <q-select class="col-11" v-model="negativeScoreWeight" :float-label="$t('NegativeScoreMultiplier')" :options="negativeMultipliers" />
          <NegativeScoreInfo style="margin: auto; text-align: center" />
        </div>
        <p class="caption row justify-between">
          {{ $t('Proposal.time.selectLabel') }}
          <q-chip>
            Days: {{proposalDays}} Hours: {{proposalHours}} Minutes: {{proposalMinutes}}
          </q-chip>
        </p>
        <q-slider :step="1" v-model="proposalDays" :min="0" :max="62" label snap></q-slider>
        <q-slider :step="1" v-model="proposalHours" :min="0" :max="24" label snap></q-slider>
        <q-slider :step="1" v-model="proposalMinutes" :min="1" :max="60" label snap></q-slider>
  
        <p class="caption row justify-between">
          {{ $t('Voting.time.selectLabel') }}
          <q-chip>
            Days: {{votingDays}} Hours: {{votingHours}} Minutes: {{votingMinutes}}
          </q-chip>
        </p>
        <q-slider :step="1" v-model="votingDays" :min="0" :max="62" label snap></q-slider>
        <q-slider :step="1" v-model="votingHours" :min="0" :max="24" label snap></q-slider>
        <q-slider :step="1" v-model="votingMinutes" :min="1" :max="60" label snap></q-slider>
  
        <q-input type="textarea" :float-label="$t('Topic.descriptionLabel')" v-model="description" :max-height="50" :min-rows="7" />
        <div style="text-align: right">
          <q-btn @click="next()" icon="arrow forward">{{ $t('Next') }}</q-btn>
        </div>
      </q-card-main>
    </q-card>
  </main-layout>
</template>

<script>
  import MainLayout from 'layouts/MainLayout'
  import {
    date,
    uid,
    QBtn,
    QCard,
    QCardMain,
    QChip,
    QField,
    QInput,
    QSelect,
    QSlider
  } from 'quasar'
  import {
    setTopic
  } from 'src/data'
  import {
    buildOutput
  } from 'src/timer'
  import NegativeScoreInfo from '@/NegativeScoreInfo'
  const {
    addToDate
  } = date
  
  export default {
    components: {
      MainLayout,
      NegativeScoreInfo,
      QBtn,
      QCard,
      QCardMain,
      QChip,
      QField,
      QInput,
      QSelect,
      QSlider
    },
    methods: {
      next () {
        let error = false
        // error check
        if (this.topicQuestion.replace(/\s/g, '').length <= 0) {
          this.topicMissing = true
          error = true
        }
        else {
          this.topicMissing = false
        }
  
        if (!error) { // if no errors proceed
          let id = uid()
  
          let today = new Date()
          let endProposal = addToDate(today, {
            days: this.proposalDays,
            hours: this.proposalHours,
            minutes: this.proposalMinutes
          })
          let diff = date.formatDate(endProposal, 'x') - date.formatDate(today, 'x')
          let endVoting = addToDate(today, {
            days: this.votingDays,
            hours: this.votingHours,
            minutes: this.votingMinutes,
            milliseconds: diff
          })
          // create a new Topic object
          let newTopic = {
            'question': this.topicQuestion,
            'proposalTime': endProposal,
            'votingTime': endVoting,
            'votingInterval': buildOutput(this.votingDays, this.votingHours, this.votingMinutes, 0),
            'description': this.description,
            'id': id,
            'proposals': {
              'Change nothing': 'keep things the way they are',
              'Repeat process': 'reapeat the process and look for other options'
            },
            'negativeScoreWeight': this.negativeScoreWeight,
            'emojis': {
              'Change nothing': 0,
              'Repeat process': 0
            },
            'votes': {},
            'results': {}
          }
          let tmp = this
          setTopic(newTopic).then(function () {
            // go to collect vue after saving topic data
            tmp.$router.push({
              name: 'collect',
              params: {
                id: id
              }
            })
          })
        }
      }
    },
    data () {
      return {
        description: '',
        topicQuestion: '',
        topicMissing: false,
        visible: false,
        proposalMinutes: 1,
        proposalHours: 0,
        proposalDays: 2,
        votingMinutes: 1,
        votingHours: 0,
        votingDays: 1,
        negativeScoreWeight: 3,
        negativeMultipliers: [{
          label: 'x1',
          value: 1
        },
        {
          label: 'x2',
          value: 2
        },
        {
          label: 'x3',
          value: 3
        },
        {
          label: 'x4',
          value: 4
        },
        {
          label: 'x5',
          value: 5
        },
        {
          label: 'x6',
          value: 6
        },
        {
          label: 'x7',
          value: 7
        },
        {
          label: 'x8',
          value: 8
        }
        ]
      }
    }
  }
</script>