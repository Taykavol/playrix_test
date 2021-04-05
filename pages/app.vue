<template>
  <div class="container">
    <div class="form">
      <autocomplete v-model="url" :url="url"/>
      <div class="date ">
          <div class="">
             <div class="">Начало анализа:</div>
            <input class="" type="date" />
          </div>
          <div class="">
             <div class="">Дата окончания:</div>
            <input class="" type="date" />
          </div>
      </div>
      <div class="brunch-box">
        <select v-model="brunch" class="item__data ">
            <option>master</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import autocomplete from '~/components/autocomplete.vue'
export default {
  components: { autocomplete },
    data() {
        return {
            brunch:'master',
            startDate:null,
            endDate:null,
            url:''
        }
    }
}
</script>

<style>
input,select {
    outline: none;
}
.form {
    display: flex;
    flex-direction: column;
    width: 40%;
}
.date {
    display: flex;
    justify-content: space-between;
    margin:  .4rem .2rem;
}

.item__data {
    display: block;
    margin-top:.4rem;
    width: 100%;
    height: 2rem;
}
.brunch-box {
    width: 100%;
    margin-top:.8rem;
    display: flex;
}
.label {
    display: flex;
}
</style>