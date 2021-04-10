export default function ({ store, redirect }) {
    if(!store.getters['auth/isLogin']) return redirect('/')
  }


  