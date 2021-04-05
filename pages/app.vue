<template>
  <div class="container">
    <div class="form">
      <input class="item__data" type="text" placeholder="url" />
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
        <select class="item__data ">
            <option>Super</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
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