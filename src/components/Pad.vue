<template>
  <div>
    <span v-if="inverted">
      <q-input :color="color" :class="{ nomargin: nomargin }" inverted v-model="data" type="textarea">{{ infoLabel }}</q-input>
    </span>
    <span v-else>
      <q-input :color="color" :class="{ nomargin: nomargin }" v-model="data" type="textarea">{{ infoLabel }}</q-input>
    </span>
  </div>
</template>
<script>
import { QInput } from 'quasar'
export default {
  props: {
    data: { required: true },
    inverted: { required: false },
    infoLabel: { required: false },
    nomargin: { required: false },
    color: { required: false }
  },
  components: {
    QInput
  },
  date () {
    return {}
  }
}
</script>

<style>
  .nomargin {
    margin: 0
  }
</style>
