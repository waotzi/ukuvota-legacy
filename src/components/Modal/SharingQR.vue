<template>
  <span>
    <div class="col-1 info" @click="$refs.qr.open()">
      <q-icon color="primary" name="fa-qrcode" />
    </div>
    <q-modal ref="qr" :content-css="{padding: '50px', textAlign: 'center', maxWidth: '700px'}">
      <vue-qr :logoSrc="logopath" :text="urlpath" colorDark="#000000" colorWhite="#FFFFFF"/>
      <q-btn color="primary" @click="$refs.qr.close()">{{ $t('Close') }}</q-btn>
    </q-modal>
  </span>
</template>
<script>
  import VueQr from 'vue-qr'
  import { QBtn, QModal, QIcon } from 'quasar'
  export default {
    components: {
      VueQr,
      QBtn,
      QModal,
      QIcon
    },
    data () {
      return {
        urlpath: window.location.href,
        logopath: 'statics/logo.png'
      }
    }
  }
</script>
