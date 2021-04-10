<template>
  <div class="container">
      <div style="mt-8" v-if="$route.query.code" class="">Loading...</div>
      <div v-else @click="auth_github" style="display:flex;" class="auth--btn">
        <div style="magrin:2rem; height:2rem;margin-right:.4rem;" class="flex-center">Auth with GitHub</div>
        <img style="width:2rem; height:2rem;" src="/github-brands.svg" alt="">
      </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  data() {
    return {
      env:process.env.GITHUB_CLIENT_ID,
      token:localStorage.getItem('token')||null
    }
  },
  methods:{
    auth_github() {
      console.log(this.$store.state)
      this.$store.dispatch('auth/authGithub')
    }
  },
  created() {
    if(this.token) {
      this.$nextTick(()=>{
          this.$router.push('/app')
        })
    }
    if(this.$route.query.code) {
      const params = {code:this.$route.query.code}
      Axios.post(process.env.GET_ACCESS_TOKEN_URI,params)
      .then((data)=>{
        // Store token globally to be authenticated.
        this.$store.commit('auth/setToken',data.data.token)
        this.$nextTick(()=>{
          this.$router.push('/app')
        })
      })
      .catch((err)=>{
        console.log(err)
        //Something display
      })
  
      console.log('code: ',this.$route.query.code)
    }
  }
}
</script>

<style>

.auth--btn {
  background: #f5f5f5;
  /* border:1px solid gray; */
  padding: .6rem 1rem;
  cursor: pointer;
  transition: .5s all ease;
}
.auth--btn:hover {
  color: white;
  background: #949494;
  /* color:white; */
}
.flex-center {
    display:flex; 
    justify-content:center;
    align-items: center;
    padding:.3rem 0;
}
</style>
