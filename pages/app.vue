<template>
  <div class="container">
    <div class="">
      <autocomplete v-model="url" :url="url" :callback="onAutoCompleteFinnish" />
      
      <div class="branch-box">
        <select @input="getPullRequests(branch)" v-if="this.branches.length" v-model="branch" class="item__data">
          <option class="">master</option>
          <option @click="colLog()" v-for="item in branches">{{item.name}}</option>
        </select>

        <!-- {{this.branches}} -->
      <div v-if="!branch&&this.branches.length" style="color:red;margin-right:-2rem;font-size:2rem;" class="">*</div>
      </div>
      <div  class="date">
        <div class="">
          <div class="">Начало анализа:</div>
          <input v-model="startDate" class="" type="date" />
        </div>
        <div class="">
          <div class="">Дата окончания:</div>
          <input v-model="endDate" class="" type="date" />
        </div>
      </div>
      <!-- <div @click="getListContributers();getPullRequests()" class="btn--start">Start getting statistics</div> -->
        <div class="contributers">
            <div v-if="contributors.length" style="display:flex;justify-content:space-around;" class="">
                <div @click="sortContibutorsByDesc=true" style="border:1px solid;cursor:pointer" :class="{'btn--active':sortContibutorsByDesc==true}">
                    Passive users:
                    <svg style="width:1.25rem" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div @click="sortContibutorsByDesc=false" style="border:1px solid;cursor:pointer" :class="{'btn--active':sortContibutorsByDesc==false}">
                    Active users:
                    <svg style="width:1.25rem" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </div>
            </div>
            <div v-if="sortContibutorsByDesc">
                <div v-for="contributor in fixContributers(sortDesc(contributors),30)" :key="contributor.author.login"> 
                    {{contributor.author.login}} - {{countCommits(filterArrayByDate(contributor.weeks,startDate,endDate))}} commits 
                </div>
            </div>
            <div v-else>
                <div v-for="contributor in fixContributers(sortInc(contributors),30)" :key="contributor.author.login"> 
                    {{contributor.author.login}} - {{ countCommits(filterArrayByDate(contributor.weeks,startDate,endDate)) }} commits 
                </div>
            </div>
        </div>
        <div v-if="pulls.length" style="display:flex;justify-content:center;" class="">
          <div @click="currentPulls=filterPulls(openPullReq,startDate,endDate);mode='OPEN'"  style="margin-right:1rem; background:green; padding:.4rem 1rem;  color:white; cursor:pointer;" class="">Open pull requests: {{filterPulls(openPullReq,startDate,endDate).length}}</div>
          <div @click="currentPulls=filterPulls(closedPullReq,startDate,endDate);mode='CLOSED'" style="margin-right:1rem; background:teal; padding:.4rem 1rem;  color:white; cursor:pointer;" class="">Closed pull requests: {{filterPulls(closedPullReq,startDate,endDate).length}}</div>
          <div @click="currentPulls=filterPulls(oldPullReq,startDate,endDate);mode='OLD'" style="margin-right:1rem; background:#c1c2c3; padding:.4rem 1rem;  color:white; cursor:pointer;" class="">"Old" pull requests: {{filterPulls(oldPullReq,startDate,endDate).length}} </div>
        </div>
        <request-table v-if="currentPulls" style="margin-top:2rem;" :pulls="currentPulls" :mode="mode"/>
        <!-- <div v-if="pulls.length" class="pulls">
            <div class="">{{filterArrayPullsByDate(pulls).length}}</div>
        </div> -->
    </div>
  </div>
</template>

<script>
import autocomplete from '~/components/autocomplete.vue'
import RequestTable from '~/components/requestTable.vue'
export default {
  components: { autocomplete, RequestTable },
  data() {
    return {
      branch: 'master',
      branches:[],
      contributors:[],
      pulls:[],
      mode:'',
      currentPulls:null,
      commits:[],
      startDate: null,
      endDate: null,
      url: '',
      sortContibutorsByDesc:true,
      token: JSON.parse(localStorage.getItem('token')),
    }
  },
  computed: {
      openPullReq() {
        return this.pulls.filter(pull=>pull.state=='open')
      },
      closedPullReq() {
        return this.pulls.filter(pull=>pull.state=='closed')
      },
      oldPullReq() {
       return this.pulls.filter(pull=>{
         if(pull.closed_at)
          return (new Date(pull.closed_at).getTime()/1000-new Date(pull.created_at).getTime()/1000)>2592000
         return (new Date().getTime()/1000 - new Date(pull.created_at).getTime()/1000)>2592000
        })
      }
  },
  watch: {
    bruch() {

    }
  },
  methods: {
    colLog() {
    },
    timeStamp(date) {
        return new Date(date).getTime()/1000
    },
    onAutoCompleteFinnish() {
      this.getListBranches()
      this.getListContributers();
      this.getPullRequests(this.branch)
    },
    filterPulls(array,start,end) {
      if(!start) {start=0} else {start = new Date(start).getTime()}
      if(!end) {end=Math.floor(new Date().getTime())} else {end = new Date(end).getTime()}
     return array.filter(item=>{ return new Date(item.created_at).getTime()>=start&&new Date(item.created_at).getTime()<=end})
    },
    filterArrayByDate(array, start, end) {
      // 604800 milisecond between weeks
      // array.weeks[0].w - way to play.

      // Finding start index
      if(!start) {start=array[0].w} else {start = new Date(start).getTime()/1000}
      if(!end) {end=Math.floor(new Date().getTime()/1000)} else {end = new Date(end).getTime()/1000}
      let deltaStart = start - array[0].w
      let indexStart;
      if(deltaStart<=0) {
        indexStart=0
      } else {
        indexStart = Math.floor(deltaStart/604800)
      }

      // Finding end index
      const lastIndex = array.length-1
      let deltaEnd = end - array[lastIndex].w
      let indexEnd;
      if(deltaEnd>0) {
        indexEnd=lastIndex
      } else {
        indexEnd = Math.floor(deltaEnd/604800)
      }

      return array.slice(indexStart,indexEnd)
    },
    countCommits(array) {
      return array.reduce((prev,curr)=>{  return (prev+curr.c)}, 0)
    },
    onChangeBranch(name) {
      // let sha =''
      // this.branches.forEach((branch)=>{
      //   if(branch.name==branchToFind) return sha = branch.commit.sha
      // })
      // console.log(sha)
      // this.getListContributers();
      // this.getPullRequests()
      // this.getCommits(sha)

      this.getPullRequests(name)
    },
    getListBranches() {
      fetch(`https://api.github.com/repos/${this.url}/branches`,{
        headers: {
          Authorization: `token ${this.token}`,
        },
      }).then((res)=>res.json())
      .then(branches=> {this.branches=branches})
    },
    getListContributers() {
        fetch(`https://api.github.com/repos/${this.url}/stats/contributors`,{
          headers: {
          Authorization: `token ${this.token}`,
        },
        }).then((res)=>res.json())
        .then(contributors=> {this.contributors=contributors})
    },
    getPullRequests(base='master',page=1) {
      fetch(`https://api.github.com/repos/${this.url}/pulls?base=${base}&state=all&per_page=100&page=${page}`, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }).then((res)=>res.json())
        .then(pulls=> { if(page>=1&&pulls.length>0) {this.pulls=[...this.pulls,...pulls]; console.log('pulls longs:',this.pulls,page,'page'); this.getPullRequests(base,page+1)} if(page==0) {this.pulls=[...pulls]} })
    },
    getCommits(sha) {
      fetch(`https://api.github.com/repos/${this.url}/commits?per_page=100&sha=${sha}`,{
        headers: {
          Authorization: `token ${this.token}`,
        },
      }).then((res)=>res.json())
        .then(commits => {this.commits=commits})
    },
    sortDesc(array) {
          const mapped = array.map((el,i)=>{ return {index:i, value:this.countCommits(this.filterArrayByDate(el.weeks,this.startDate,this.endDate))}})
          mapped.sort((a,b)=>{
              if (a.value > b.value) {
                return 1; }
              if (a.value < b.value) {
                return -1; }
              return 0;
          }) 
          return mapped.map(el=>array[el.index])
      },
      sortInc(array) {
          const mapped = array.map((el,i)=>{ return {index:i, value:this.countCommits(this.filterArrayByDate(el.weeks,this.startDate,this.endDate))  }})
          mapped.sort((a,b)=>{
              if (a.value < b.value) {
                return 1; }
              if (a.value > b.value) {
                return -1; }
              return 0;
          }) 
          return mapped.map(el=>array[el.index])
      },
        fixContributers(array, limit) {
          return array.splice(0,limit)
      },


  },
}
</script>

<style>
input,
select {
  outline: none;
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
.branch-box {
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