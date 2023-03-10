import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => System.import(`pages/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [

    // redirect routes
    { name: 'index', path: '/', redirect: { name: 'home' } },
    { name: 'app', path: '/app', redirect: { name: 'create' } },
    { path: '/create', redirect: { name: 'create' } },

    // routes that load components
    { name: 'home', path: '/', component: load('Home') },
    { name: 'manual', path: '/manual', component: load('Manual') },
    { name: 'create', path: '/app/create', component: load('Create') },
    { name: 'collect', path: '/app/:id/collect', component: load('Collect') },
    { name: 'vote', path: '/app/:id/vote', component: load('Vote') },
    { name: 'results', path: '/app/:id/results', component: load('Results') },
    { name: 'notfound', path: '/:id/notfound', component: load('NotFound') },

    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
