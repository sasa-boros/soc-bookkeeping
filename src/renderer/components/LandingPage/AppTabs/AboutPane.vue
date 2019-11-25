<template>
  <b-container fluid>
    <h4 align="center">Техничка подршка</h4>
    <br>
    <p align="center"><b>daxon.tech@outlook.com</b></p>
    <p align="center"><b>+381642750071</b></p>
    <br>
    <h4 align="center">Пречице</h4>
    <br>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>s</b>&nbsp;&nbsp;&nbsp;сачувај</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>e</b>&nbsp;&nbsp;&nbsp;обриши унето</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>p</b>&nbsp;&nbsp;&nbsp;штампај</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>d</b>&nbsp;&nbsp;&nbsp;преузми</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>=</b>&nbsp;&nbsp;&nbsp;зумирај</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>-</b>&nbsp;&nbsp;&nbsp;одзумирај</p>
    <hr>
    <br>
    <p align="center">Апликација је лиценцирана од стране агенције DAXON TECH и на њу полаже ауторска права. &copy;</p>
  </b-container>
</template>

<script>
  const i18n = require('../../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          commandOrControl: 'ctrl'
        }
      }
    },
    created () {
       if (process.platform == 'darwin') {
        this.phrases.commandOrControl = 'cmd'
      }
    }
  }
</script>
