<template>
  <div class="">
    <div class="table--contributers">
      <div style="display:flex;" class="" v-for="(contributor,index) in fixContributers(sortedArray, displayUsers)" :key="contributor.author.login">
        <div style="" class="">{{ contributor.author.login }}</div>
        <div style="margin-left:auto; margin-right:1rem;"  class="">{{ countCommits(filterArrayByDate(contributor.weeks, startDate, endDate))}} commits</div>
      </div>
    </div>
    <div v-if="type == 'DEC'" class=""></div>
  </div>
</template>

<script>
export default {
  props: {
    contributors: {
      type: Array,
    },
    startDate: {
      default: null,
    },
    endDate: {
      default: null,
    },
    type: {
      type: String,
    },
  },
  created() {
    console.log('Contributer:', this.contributors)
  },
  data() {
    return {
        displayUsers:30
    }
  },
  computed: {
    sortedArray() {
      if (this.type == 'DEC') return this.sortDesc(this.contributors)
      if (this.type == 'INC') return this.sortInc(this.contributors)
    },
  },
  methods: {
    countCommits(array) {
      return array.reduce((prev, curr) => {
        return prev + curr.c
      }, 0)
    },
    filterArrayByDate(array, start, end) {
      // 604800 milisecond between weeks
      // array.weeks[0].w - way to play.

      // Finding start index
      if (!start) {
        start = array[0].w
      } else {
        start = new Date(start).getTime() / 1000
      }
      if (!end) {
        end = Math.floor(new Date().getTime() / 1000)
      } else {
        end = new Date(end).getTime() / 1000
      }
      let deltaStart = start - array[0].w
      let indexStart
      if (deltaStart <= 0) {
        indexStart = 0
      } else {
        indexStart = Math.floor(deltaStart / 604800)
      }

      // Finding end index
      const lastIndex = array.length - 1
      let deltaEnd = end - array[lastIndex].w
      let indexEnd
      if (deltaEnd > 0) {
        indexEnd = lastIndex
      } else {
        indexEnd = Math.floor(deltaEnd / 604800)
      }

      return array.slice(indexStart, indexEnd)
    },
    sortDesc(array) {
      const mapped = array.map((el, i) => {
        return {
          index: i,
          value: this.countCommits(
            this.filterArrayByDate(el.weeks, this.startDate, this.endDate)
          ),
        }
      })
      mapped.sort((a, b) => {
        if (a.value > b.value) {
          return 1
        }
        if (a.value < b.value) {
          return -1
        }
        return 0
      })
      return mapped.map((el) => array[el.index])
    },
    sortInc(array) {
      const mapped = array.map((el, i) => {
        return {
          index: i,
          value: this.countCommits(
            this.filterArrayByDate(el.weeks, this.startDate, this.endDate)
          ),
        }
      })
      mapped.sort((a, b) => {
        if (a.value < b.value) {
          return 1
        }
        if (a.value > b.value) {
          return -1
        }
        return 0
      })
      return mapped.map((el) => array[el.index])
    },
    fixContributers(array, limit) {
      return array.splice(0, limit)
    },
  },
}
</script>

<style >
.table--contributers {
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 640px) {
  .table--contributers {
    cursor: pointer;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    margin: 0 1rem;
  }
}
</style>