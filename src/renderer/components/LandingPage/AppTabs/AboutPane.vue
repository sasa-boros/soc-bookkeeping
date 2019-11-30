<template>
  <b-container fluid>
    <h4 align="center">Упутство за коришћење</h4>
      <br>
      <p style="text-align:center">
        1) Поставке
      </p>
      <p style="text-align:justify">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Поставке апликације се врше у секцији ”Подешавања”. Пре почетка употребе потребно је подесити партије и позиције примања и издавања, као и назива црквене општине и места у коме се црква налази. 
        Поставком ових подешавања аутоматски се попуњавају одговарајућа поља уплатница, признаница и дневника благајне, што апликацију чини спремном за унос података дневника за жељену годину.
        Опција ”Подразумевано зумирање” омогућава вам да подесите жељени ниво зумирања.
      </p>
      <p style="text-align:center">
        2) Подаци
      </p>
      <p style="text-align:justify">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Унети подаци се приказују у одговарајућим табелама које омогућавају једноставан преглед и могу се филтрирати по години, као и сортирати кликом на заглавље колона које могу бити сортиране. 
        Уклањање сортирања врши се кликом на било које заглавље које то нема омогућено. Податке можете додавати, мењати и брисати у њима одговарајућим табелама. Брисање је омогућено за више уноса одједном означавањем више ставки табеле, или појединачно. Генерални подаци дневника се уносе у секцији ”Дневник благајне”, након избора године књижења.
       </p>
       <p style="text-align:center">
        3) Функционалности
      </p>
      <p style="text-align:justify">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Свака унета уплатница и признаница се може по чувању преузети и штампати. Исто важи и за странице дневника благајне, а постоји и опција да се преузме и штампа цео дневник. Преглед дневника благајне се може извршити у сваком тренутку на дну секције ”Дневник благајне”.
        Битно је нагласити да се дневник благајне генерише на основу унетих података, што значи да се свака измена над њима аутоматски рефлектује на дневник.
      </p>
    <br>
    <h4 align="center">Пречице</h4>
    <br>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>s</b>&nbsp;&nbsp;&nbsp;сачувај</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>e</b>&nbsp;&nbsp;&nbsp;обриши унето</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>p</b>&nbsp;&nbsp;&nbsp;штампај</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>d</b>&nbsp;&nbsp;&nbsp;преузми</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>=</b>&nbsp;&nbsp;&nbsp;зумирај</p>
    <p align="center"><b>{{phrases.commandOrControl}}</b> + <b>-</b>&nbsp;&nbsp;&nbsp;одзумирај</p>
    <br>
    <h4 align="center">Техничка подршка</h4>
    <br>
    <p align="center"><b>daxon.tech@outlook.com</b></p>
    <p align="center"><b>+381642750071</b></p>
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
