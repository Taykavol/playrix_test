export const state = () =>({
    token:localStorage.getItem('token')||null
})

export const mutations = {
    setToken(state, token) {
        if(!token) return;

        state.token = token
        localStorage.setItem('token',JSON.stringify(token))
    }
}

export const actions = {
    authGithub() {
        const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
        window.location.href = url
    },
    logout() {
        localStorage.removeItem('token')
    }
}