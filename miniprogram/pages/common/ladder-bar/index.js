Component({
  properties: {
    discipline: {
      type: String,
      observer(val) {
        if (!~val.indexOf('[object Object]')) {
          this.setData({
            disciplineName: val
          })
        } else {
          this.setData({
            skillName: null
          })
        }
      },
    },
    profession: {
      type: String,
      observer(val) {
        if (!~val.indexOf('[object Object]')) {
          this.setData({
            professionName: val
          })
        } else {
          this.setData({
            skillName: null
          })
        }
      },
    },
    skill: {
      type: String,
      observer(val) {
        console.log(val)
        if (!~val.indexOf('[object Object]')) {
          console.log(val)
          this.setData({
            skillName: val
          })
        } else {
          this.setData({
            skillName: null
          })
        }
      },
    },
    part: {
      type: String,
      observer(val) {
        console.log(val)
        if (!~val.indexOf('[object Object]')) {
          console.log('pard0')
          this.setData({
            partName: val
          })
        } else {
          this.setData({
            partName: null
          })
        }
      },
    },
  },
  lifetimes: {
    attached() {
    },
  },
  data: {
  },
  methods: {
    back({target: { dataset: { type }}}) {
      console.log(type)
      this.triggerEvent('back', { type })
    },
  },
})
