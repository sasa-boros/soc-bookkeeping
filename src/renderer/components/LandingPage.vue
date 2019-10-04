<template>
<b-container fluid>
  <div id="wrapper">
    <main>
      <app-tabs></app-tabs>
    </main>
  </div>
  </b-container>
</template>

<script>
  import AppTabs from './LandingPage/AppTabs'

  export default {
    name: 'landing-page',
    components: { AppTabs },
    methods: {
    }
  }
</script>

<style>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #wrapper {
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

</style>
