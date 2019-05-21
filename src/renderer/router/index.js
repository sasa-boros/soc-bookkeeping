import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/annualReportPrint',
      name: 'annual-report-print-page',
      component: require('@/components/AnnualReportPrintPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
