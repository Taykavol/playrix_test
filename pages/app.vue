<template>
  <div class="container">
    <div class="form">
      <autocomplete v-model="url" :url="url" :callback="getListBrunches" />
      <div class="date">
        <div class="">
          <div class="">Начало анализа:</div>
          <input v-model="startDate" class="" type="date" />
        </div>
        <div class="">
          <div class="">Дата окончания:</div>
          <input v-model="endDate" class="" type="date" />
        </div>
      </div>
      <div class="brunch-box">
        <select v-if="this.brunches.length" v-model="brunch" class="item__data">
          <option v-for="item in brunches">{{item.name}}</option>
        </select>
      <div v-if="!brunch&&this.brunches.length" style="color:red;margin-right:-2rem;font-size:2rem;" class="">*</div>
      </div>
      <div @click="getListContributers()" class="btn--start">Start getting statistics</div>
        <div class="contributers">
            <div v-if="contributors.length" style="display:flex;justify-content:space-around;" class="">
                <div @click="sortContibutorsByDesc=true" style="border:1px solid;cursor:pointer" :class="{'btn--active':sortContibutorsByDesc==true}">
                    <svg style="width:1.25rem" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div @click="sortContibutorsByDesc=false" style="border:1px solid;cursor:pointer" :class="{'btn--active':sortContibutorsByDesc==false}">
                    <svg style="width:1.25rem" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </div>
            </div>
            <div v-if="sortContibutorsByDesc">
                <div v-for="contributor in fixContributersDesc"> 
                    {{contributor.author.login}} - {{contributor.total}} commits
                </div>
            </div>
            <div v-else>
                <div v-for="contributor in fixContributersInc"> 
                    {{contributor.author.login}} - {{contributor.total}} commits
                </div>
            </div>
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
      brunch: '',
      brunches:[],
      contributors:[],
      startDate: null,
      endDate: null,
      url: '',
      sortContibutorsByDesc:true
    }
  },
  computed: {
      fixContributersDesc() {
          return this.sortDesc.splice(0,30)
      },
      fixContributersInc() {
          return this.sortInc.splice(0,30)
      },
      sortDesc() {
          const mapped = this.contributors.map((el,i)=>{ return {index:i, value:el.total}})
          mapped.sort((a,b)=>{
              if (a.value > b.value) {
                return 1; }
              if (a.value < b.value) {
                return -1; }
              return 0;
          }) 
          return mapped.map(el=>this.contributors[el.index])
      },
      sortInc() {
          const mapped = this.contributors.map((el,i)=>{ return {index:i, value:el.total}})
          mapped.sort((a,b)=>{
              if (a.value < b.value) {
                return 1; }
              if (a.value > b.value) {
                return -1; }
              return 0;
          }) 
          return mapped.map(el=>this.contributors[el.index])
      }
  },
  methods: {
      fixContributers(contributers,limit=30) {
          return contributers.splice(0,limit)
      },
    getListBrunches() {
      fetch(`https://api.github.com/repos/${this.url}/branches`).then((res)=>res.json())
      .then(brunches=> {this.brunches=brunches})
    },
    getListContributers() {
        fetch(`https://api.github.com/repos/${this.url}/stats/contributors`).then((res)=>res.json())
        .then(contributors=> {this.contributors=contributors})
    }
  },
}
</script>

<style>
input,
select {
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
  margin: 0.4rem 0.2rem;
}

.item__data {
  display: block;
  margin-top: 0.4rem;
  width: 100%;
  height: 2rem;
}
.brunch-box {
  width: 100%;
  margin-top: 0.8rem;
  display: flex;
}
.label {
  display: flex;
}
.btn--start {
  background-color: lightblue;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  margin-top: 1rem;
  border: 1px solid white;
  cursor: pointer;
}
.btn--start:hover {
  color: white;
  background-color: rgb(113, 166, 184);
}
.btn--active {
    background: gray;
}
</style>