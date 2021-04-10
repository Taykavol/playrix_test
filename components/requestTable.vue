<template>
  <div class="">
      <!-- goo;sdfsadfdasfgsdf -->
      <div style="margin-bottom:.8rem;" class="flex-center">
        <div style="text-transform:capitalize; " class="">{{mode}} requests </div>
        <div v-if="mode=='OLD'" style="margin-left:8px;border:1px solid;padding:.3rem;cursor:pointer;" :class="{'pagination-item-active':isSortedByAuthor}" @click="isSortedByAuthor=!isSortedByAuthor"  class=" ">Group by Author</div>
      </div>
      <div style="font-weight:bold;padding:.3rem;" :class="{'grid-3':mode=='OPEN'||mode=='CLOSED', 'grid-4':mode=='OLD'} ">
          <div class="">PR title</div>
          <div class="">Github Login <span></span> </div>
          <div class="">Date</div>
          <div v-if="mode=='OLD'" class="">Days since open</div>
      </div>
      <a :href="pull.html_url" target="_blank" v-for="pull in paginatedPulls" :class="{'grid-3':mode=='OPEN'||mode=='CLOSED','grid-4':mode=='OLD'} ">
          <div style="word-break: break-all;"  class="flex-center ">{{pull.title}}</div>
          <div style="   " class="flex-center">{{pull.user.login}}</div>
          <div class="flex-center">{{pull.created_at.split('T')[0]}}</div>
          <div v-if="mode=='OLD'" class="flex-center">{{  Math.floor((new Date()-new Date(pull.created_at.split('T')[0]))/(60*60*24*1000))}}</div>
      </a>
      <div style="flex-wrap: wrap;margin-top:1rem;" class="pagination flex-center">
        <div @click="page=item-1" style="width:2rem; height:2rem; cursor:pointer; " :class="{'pagination-item-active':page==item-1}"  v-for="item in Math.ceil(pulls.length/25) " class="pagination-item flex-center">
                {{item}}
        </div>
      </div>
  </div>
</template>

<script>
export default {
    props:{
        pulls:{
            type:Array
        },
        mode:{
            type:String,
            default:'OPEN'
        }
    },
    data() {
        return {
            page:0,
            isSortedByAuthor:false
        }
    },
    computed: {
        paginatedPulls() {
            if(!this.isSortedByAuthor||this.mode!='OLD')
                return this.pulls.slice(this.page*25,this.page*25+24)
            else 
                return this.sort(this.pulls).slice(this.page*25,this.page*25+24)
        },
       
    },
    methods:{
        sort(array) {
          const mapped = array.map((el,i)=>{ return {index:i, value: el.user.login.toLowerCase()}})
          mapped.sort((a,b)=>{
              if (a.value > b.value) {
                return 1; }
              if (a.value < b.value) {
                return -1; }
              return 0;
          }) 
          return mapped.map(el=>array[el.index])
      },
    }
}
</script>

<style>
a {
    text-decoration: none;
    color: black;
}


.flex-center {
    display:flex; 
    justify-content:center;
    align-items: center;
    padding:.3rem 0;
}
.grid-3 {
    cursor: pointer;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    
}
.grid-4 {
    cursor: pointer;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
}
.grid-3:nth-child(2n) {
    background: #f5f5f5;
}
.grid-3:nth-child(2n+1) {
    background: #c5c3c3;
}
.grid-3:hover:not(:nth-child(1)) {
    background: rgb(84, 114, 2);
}
.grid-4:nth-child(2n) {
    background: #f5f5f5;
}
.grid-4:nth-child(2n+1) {
    background: #c5c3c3;
}
.grid-4:hover:not(:nth-child(1)) {
    background: rgb(84, 114, 2);
}
.pagination-item:hover {
    background: cadetblue;
}
.pagination-item-active {
    background: cadetblue;
}
</style>