import { urlPre } from '../../../js/env.js'
import store from '../../../js/store'
const app = getApp()

Page({
  data: {
    discipline: null,
    profession: null,
    skill: null,
    part: null,
    choosed: null,
    BasicStore: null,
    showInput: false,
    title: '',
  },

  onLoad: function() {
    // this.init()
  },
  getProfession ({target:{dataset:{discipline}}}) {
    console.log(discipline)
    app.request().get(`${urlPre}/api/code/basic/getProfessionsByDiscipline`).query({
      discipline
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        discipline,
        profession: data.data,
        choosed: 'profession',
      })
    })
  },
  onShow() {
    console.log('show')
    this.init()
  },
  onHide() {
    console.log('hide')
    const { discipline, profession, skill, part } = this.data
    store.set('basicStore', {
      discipline,
      profession,
      skill,
      part,
    })
  },
  init() {
    const { discipline, profession, skill, part } = store.get('basicStore')
    if (!this.data.profession && profession) {
      let choosed = 'profession'
      if (profession) choosed = 'profession'
      if (skill) choosed = 'skill'
      if (part) choosed = 'part'
      this.setData({
        discipline,
        profession,
        skill,
        part,
        choosed,
      })
    } else if (!this.data.discipline) {
      this.getDiscipline()
    }
  },
  getSkill ({target:{dataset:{profession}}}) {
    app.request().get(`${urlPre}/api/code/basic/getSkillsByProfession`).query({
      profession
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        profession,
        skill: data.data,
        choosed: 'skill'
      })
    })
  },
  getPart ({target:{dataset:{skill}}}) {
    app.request().get(`${urlPre}/api/code/basic/getPartsBySkill`).query({
      skill
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        skill,
        part: data.data,
        choosed: 'part'
      })
    })
  },
  getDiscipline () {
    console.log('getdiscipline')
    app.request().get(`${urlPre}/api/code/basic/getDisciplines`)
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        discipline: data.data,
        choosed: 'discipline'
      })
    })
  },
  getPartDetail ({target:{dataset:{title, skill}}}) {
    wx.navigateTo({
      url: `/pages/basic/part/detail?title=${title}&skill=${skill}`,
      complete() {
        console.log('跳转成功')
      },
    });
  },
  addPart () {
    console.log('addpart')
    this.setData({
      showInput: true
    })
  },
  partTitle ({ detail: { value } }) {
    this.setData({
      title: value
    })
  },
  back({ detail: { type } }) {
    if (type === 'discipline') {
      this.getProfession({target:{dataset:{discipline: this.data.discipline}}})
      this.setData({
        part: null,
        skill: null,
        profession: null,
      })
    } else if (type === 'profession') {
      this.getSkill({target:{dataset:{profession: this.data.profession}}})
      this.setData({
        part: null,
        skill: null
      })
    } else if (type === 'skill') {
      this.getPart({target:{dataset:{skill: this.data.skill}}})
      this.setData({
        part: null
      })
    } else {
      this.getDiscipline()
      this.setData({
        part: null,
        skill: null,
        profession: null,
        discipline: null,
      })
    }
  },
  makePart () {
    console.log('makepart')
    const { title, profession, skill, discipline } = this.data
    app.request().post(`${urlPre}/api/code/basic/part/createTitle`).send({
      title,
      profession,
      discipline,
      skill,
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        skill,
        part: data.data,
        choosed: 'part'
      })
    })
  },
})
