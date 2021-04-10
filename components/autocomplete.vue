<template>
  <div style="display:flex" class="">
    <div style="position: relative; width:100%;" class="">
      <input
        :value="url"
        @input="onInput"
        style="border:none;font-size:1.5rem;"
        class="item__data"
        type="text"
        placeholder="Insert url"
      />
      <div v-if="!isLink && url.length && !isChosen" style="" class="autocomplete">
        <div
          v-for="item in filteredDataArray"
          :key="item.full_name"
          @click="selectRepo(item.full_name)"
          class="option"
        >
          <div class=""> {{ item.full_name }}</div>
          <div style="background-color: yellowgreen;padding: 0.3rem;border-radius: 5px;" class="">
            repo
          </div>
        </div>
        <div
          v-for="item in filteredUserArray"
          :key="item.login"
          @click="selectUser(item.login) "
          class="option"
        >
          <div class=""> {{ item.login }}</div>
          <div style="background-color: pink; padding: 0.3rem; border-radius: 5px" class="">
            user
          </div>
        </div>
      </div>
      <button @click="selectRepo(url.split('github.com/')[1])" v-if="isLink" style="" class="">Create report by link </button>
     <svg v-if="this.isChosen" style="width:1.5rem;position:absolute;left:-1.5rem;top:.6rem;color:green;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
    </div>
  </div>
</template>

<script>
export default {
  props: ['url','callback'],
  data() {
    return {
      data: [],
      users: [],
      token: JSON.parse(localStorage.getItem('token')),
      showResults: 5,
      isChosen:false,
      timeOut:null,
      wasPrinted:false
    }
  },
  computed: {
    filteredDataArray() {
      if (!this.data) return
      return this.data
        .filter((option) => {
          return (
            option.full_name
              .toString()
              .toLowerCase()
              .indexOf(this.url.toLowerCase()) >= 0
          )
        })
        .slice(0, this.showResults)
    },
    filteredUserArray() {
      if (!this.users) return
      return this.users.filter((option) => {
        return (
          option.login
            .toString()
            .toLowerCase()
            .indexOf(this.url.toLowerCase()) >= 0
        )
      }).slice(0, this.showResults)
    },
    isURIcontainSlash() {
        return this.url.includes('/')
    },
    isLink() {
      // TODO: Use Regex instead.
      return (
        (this.url.indexOf('h') == 0 && this.url.length == 1) ||
        (this.url.indexOf('ht') == 0 && this.url.length == 2) ||
        (this.url.indexOf('htt') == 0 && this.url.length == 3) ||
        (this.url.indexOf('http') == 0 && this.url.length == 4) ||
        (this.url.indexOf('http') == 0 && this.url.length == 4) ||
        (this.url.indexOf('http:') == 0 && this.url.length == 5) ||
        (this.url.indexOf('http:/') == 0 && this.url.length == 6) ||
        (this.url.indexOf('http://') == 0 && this.url.length >= 7) ||
        (this.url.indexOf('https') == 0 && this.url.length == 5) ||
        (this.url.indexOf('https:') == 0 && this.url.length == 6) ||
        (this.url.indexOf('https:/') == 0 && this.url.length == 7) ||
        (this.url.indexOf('https://') == 0 && this.url.length >= 8)
      )
    },
    // isLinkWithEnd() {
    //   return this.isLink&&this.url.substring(this.url.length-4)=='.git'
    // }
  },
  methods: {
    getDataFromGithub(q) {
      if (!this.url) return
      if(this.isURIcontainSlash) 
        return fetch(`https://api.github.com/search/repositories?q=${q.split('/')[0]+'/'}`, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if(this.wasPrinted) return;
          this.data = data.items
        })
        .catch((err)=>{console.log(err)})

       fetch(`https://api.github.com/search/repositories?q=${q}`, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if(this.wasPrinted) return;
          this.data = data.items
        })
       .catch((err)=>{console.log(err)})
       
        //If contain '/' then user already found.
      fetch(`https://api.github.com/search/users?q=${q}`, {
        headers: {
          Authorization: `token ${this.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if(this.wasPrinted) return;
          this.users = data.items
        })
        .catch((err)=>{console.log(err)})
    },
    selectRepo(repo) {
        this.$emit('input', repo)
        this.isChosen = true
        this.callback()
    },
    selectUser(user) {
        this.$emit('input', user+'/')
        this.setTimer(0)
    },
    onInput(event) {
        this.isChosen = false

        // Needed for v-model
        this.$emit('input', event.target.value)
        if(this.isLink) return
        this.setTimer(400)
    },
    setTimer(time) {
        // Prevent extra request while printing
          this.wasPrinted=true;
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(()=>{this.wasPrinted=false; this.getDataFromGithub(this.url)},time)
    }
  },
}
</script>

<style>
.option {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem;
}
.option:hover {
  background: rgb(197, 190, 190);
  cursor: pointer;
}
.autocomplete {
  position: absolute;
  background: white;
  border-right: 1px solid black;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>