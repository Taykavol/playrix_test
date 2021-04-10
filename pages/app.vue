<template>
  <div class="container">
    <div style="width:50rem;display:flex;flex-direction:column;" class="">
      <div @click="logout()" style="width:5rem;align-self:flex-end;margin-bottom:2rem;" class="btn--logout">Logout</div>
      
      <div style="padding:2rem 1.5rem;border:1px dashed gray;margin-bottom:2rem;" class="">
        <Autocomplete v-model="url" :url="url" :callback="onAutoCompleteFinnish" />
      
        <div class="branch-box">
          <select @input="onChangeBranch(branch)" v-if="this.branches.length" v-model="branch" class="item__data">
            <option class="">master</option>
            <option  v-for="item in branches">{{item.name}}</option>
          </select>
          <div v-if="!branch&&this.branches.length" style="color:red;margin-right:-2rem;font-size:2rem;" class="">*</div>
        </div>

        <div  class="date">
          <div class="">
            <div class="">Start date:</div>
            <input v-model="startDate" class="" type="date" />
          </div>
          <div class="">
            <div class="">End date:</div>
            <input v-model="endDate" class="" type="date" />
          </div>
        </div>
      </div>

        <div v-if="contributors.length" class="contributers">
            <h1 class="">Contributers</h1>
            <div  style="display:flex;justify-content:space-around;margin:2rem 0;" class="">
                <div @click="sortContibutorsByDesc=true" style="cursor:pointer;padding:.4rem 1rem;"  :class="{'btn--active':sortContibutorsByDesc==true,'btn--users':sortContibutorsByDesc==false}">
                    Passive users:
                    <svg style="width:1.25rem" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div @click="sortContibutorsByDesc=false" style="cursor:pointer;padding:.4rem 1rem;" :class="{'btn--active':sortContibutorsByDesc==false,'btn--users':sortContibutorsByDesc==true}">
                    Active users:
                    <svg style="width:1.25rem" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </div>
            </div>
            <div v-if="sortContibutorsByDesc">
                <Contributers-table v-if="contributors.length" :startDate="startDate" :endDate="endDate" :contributors="contributors" type="DEC"/>
            </div>
            <div v-else>
                <Contributers-table v-if="contributors.length" :startDate="startDate" :endDate="endDate" :contributors="contributors" type="INC"/>
            </div>
        </div>
        <div v-if="isAllRequestGot" class="">
          <div v-if="pulls.length" style="margin-top:2rem;" class="">
            <div @click="currentPulls=filterPulls(openPullReq,startDate,endDate);mode='OPEN'"  style="margin-right:1rem; background:green; padding:.4rem 1rem;  color:white; cursor:pointer;" class="">Open pull requests: {{filterPulls(openPullReq,startDate,endDate).length}}</div>
            <div @click="currentPulls=filterPulls(closedPullReq,startDate,endDate);mode='CLOSED'" style="margin-right:1rem;margin-top:.2rem; background:teal; padding:.4rem 1rem;  color:white; cursor:pointer;" class="">Closed pull requests: {{filterPulls(closedPullReq,startDate,endDate).length}}</div>
            <div @click="currentPulls=filterPulls(oldPullReq,startDate,endDate);mode='OLD'" style="margin-right:1rem;margin-top:.2rem; background:#c1c2c3; padding:.4rem 1rem;  color:white; cursor:pointer;" class="">"Old" pull requests: {{filterPulls(oldPullReq,startDate,endDate).length}} </div>
          </div>
          <Request-table v-if="currentPulls" style="margin-top:2rem;" :pulls="currentPulls" :mode="mode"/>
        </div>
        <div v-else-if="pulls.length" style="margin-top:2rem;" class="">Loading pulls...plz wait</div>
    </div>
  </div>
</template>

<script>
import Autocomplete from '~/components/autocomplete.vue'
import ContributersTable from '~/components/contributersTable.vue'
import RequestTable from '~/components/requestTable.vue'
export default {
  components: { Autocomplete, RequestTable, ContributersTable },
  data() {
    return {
      isAllRequestGot:false,
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
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$nextTick(()=>{
          this.$router.push('/')
        })
    },
    timeStamp(date) {
        return new Date(date).getTime()/1000
    },
    onAutoCompleteFinnish() {
      this.resetPulls()
      this.resetBrunchs()
      this.resetContributors()
      this.getListBranches()
      this.getListContributers();
      this.getPullRequests(this.branch)
    },
    filterPulls(array,start,end) {
      if(!start) {start=0} else {start = new Date(start).getTime()}
      if(!end) {end=Math.floor(new Date().getTime())} else {end = new Date(end).getTime()}
     return array.filter(item=>{ return new Date(item.created_at).getTime()>=start&&new Date(item.created_at).getTime()<=end})
    },
    resetPulls() {
      this.pulls=[]
      this.currentPulls=null
    },
    resetBrunchs() {
      this.branch = 'master';
      this.branches = [];
    },
    resetContributors() {
      this.contributors = []
    },
    onChangeBranch(name) {
      // this.resetContributors()
      this.resetPulls()
      this.getPullRequests(name)
    },
    getListBranches() {
      fetch(`https://api.github.com/repos/${this.url}/branches`,{
        headers: {
          Authorization: `token ${this.token}`,
        },
      }).then((res)=>res.json())
      .then(branches=> {this.branches=branches})
      .catch((err)=>{console.log(err)})
    },
    getListContributers() {
        fetch(`https://api.github.com/repos/${this.url}/stats/contributors`,{
          headers: {
          Authorization: `token ${this.token}`,
        },
        }).then((res)=>res.json())
        .then(contributors=> { console.log('contr got:',this.contributors); this.contributors=contributors})
        .catch((err)=>{console.log(err)})
    },
    getPullRequests(base='master',page=1) {
      this.isAllRequestGot = false;
      fetch(`https://api.github.com/repos/${this.url}/pulls?base=${base}&state=all&per_page=100&page=${page}`, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }).then((res)=>res.json())
        .then(pulls=> { 
          // &&pulls.length>0
          if(page>=1) {
            this.pulls=[...this.pulls,...pulls]; 
            console.log('pulls longs:',this.pulls,page,'page');
            if(pulls.length==100) 
              this.getPullRequests(base,page+1)
            else { this.isAllRequestGot=true}
              } 
          if(page==0) {this.pulls=[...pulls]} 
          })
        .catch((err)=>{console.log(err)})
    },
    getCommits(sha) {
      fetch(`https://api.github.com/repos/${this.url}/commits?per_page=100&sha=${sha}`,{
        headers: {
          Authorization: `token ${this.token}`,
        },
      }).then((res)=>res.json())
        .then(commits => {this.commits=commits})
        .catch((err)=>{console.log(err)})
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
.btn--logout {
  background-color: lightblue;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  margin-top: 1rem;
  border: 1px solid white;
  cursor: pointer;
}
.btn--logout:hover {
  color: white;
  background-color: rgb(113, 166, 184);
}
.btn--active {
    background: gray;
}
.btn--users {
  background: #f5f5f5;
}

</style>