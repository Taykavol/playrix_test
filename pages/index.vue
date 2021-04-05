<template>
  <div class="container">
      <div @click="auth_github" class="auth--btn">Auth with GitHub</div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  methods:{
    auth_github() {
      console.log(this.$store.state)
      this.$store.dispatch('auth/authGithub')
    }
  },
  created() {
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
  border:1px solid gray;
  padding: .2rem .5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: .5s all ease;
}
.auth--btn:hover {
  background: #f5f5f5;
  /* color:white; */
}

</style>
