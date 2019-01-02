<template>          <b-container fluid>

                        <table class="table table-hover table-default table-sm">
                                <thead>
                                    <tr>
                                        <th>
                                            #
                                        </th>
                                        <th >
                                            <p>
                                                <input class="form-check-input table-checkbox-head" type="checkbox" value="" id="tableHeadCheckbox"/>
                                            </p>
                                        </th>
                                        <th>
                                            Product
                                        </th>
                                        <th>
                                            Payment Taken
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(person, index) in tableData">
                                    <tr>
                                        <td>
                                            {{index + 1}}
                                        </td>
                                        <td>
                                            <input class="form-check-input table-checkbox-body" type="checkbox" value="" id="defaultCheck1"/>
                                        </td>
                                        <td>
                                           {{person.name}}
                                        </td>
                                        <td>
                                            {{person.surname}}
                                        </td>
                                        <td>
                                            Default
                                        </td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm shadow-none" type="button" data-toggle="modal" data-target="#exampleModal"><img src="~@/assets/see.png" class="btn-img"></button>
                                            <button class="btn btn-secondary btn-sm shadow-none" type="button"><img src="~@/assets/delete.png" class="btn-img"></button>                                
                                        </td>
                                    </tr>
                                    </template>
                                </tbody>
                        </table>
                        </b-container fluid>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [
          {name: 'rada', surname: 'prada'},
          {name: 'jeca', surname: 'pereca'},
          {name: 'daki', surname: 'kavasaki'},
          {name: 'rada', surname: 'prada'},
          {name: 'jeca', surname: 'pereca'},
          {name: 'daki', surname: 'kavasaki'},
          {name: 'rada', surname: 'prada'}
        ],
        showCount: 0
      }
    }
  }
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
