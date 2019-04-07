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
    type: [],
    choosedType: {},
    catalogue: {},
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
        catalogue: null,
      })
    })
  },
  onShow() {
    console.log('show')
    this.init()
  },
  onHide() {
    console.log('hide')
    const { discipline, profession, skill, part, type } = this.data
    store.set('basicStore', {
      discipline,
      profession,
      skill,
      part,
      type
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
      console.log(data.data)
      this.setData({
        profession,
        skill: data.data,
        choosed: 'skill',
        catalogue: null,
      })
    })
  },
  getPart ({ target: { dataset: { skill, type, catalogue } } }) {
    store.set('basicCatalogue', {
      catalogue
    })
    wx.navigateTo({
      url: `/pages/basic/part/detail?refer=basicIndex&skill=${skill}&profession=${this.data.profession}`,
      complete() {
        console.log('跳转成功')
      },
    });
    // app.request().get(`${urlPre}/api/code/basic/getPartsBySkill`).query({
    //   skill
    // })
    // .end().then( ( { body: data } ) => {
    //   console.log(data)
    //   this.setData({
    //     skill,
    //     part: data.data,
    //     choosed: 'part',
    //     type,
    //     catalogue: catalogue,
    //   })
    // })
  },
  getDiscipline () {
    console.log('getdiscipline')
    app.request().get(`${urlPre}/api/code/basic/getDisciplines`)
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        discipline: data.data,
        choosed: 'discipline',
        catalogue: null,
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
  chooseType({target:{dataset:{ type }}}) {
    const choosedType = this.data.choosedType
    choosedType[type] = choosedType[type] ? null : type
    this.setData({
      choosedType,
    })
  },
  cancelInput() {
    console.log(this.data.showInput)
    this.setData({
      showInput: false
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
      console.log('跳转到详情页')
      // this.getPart({target:{dataset:{skill: this.data.skill}}})
      this.setData({
        part: null
      })
      // 直接跳转到详情页面
      wx.navigateTo({
        url: `/pages/basic/part/detail`,
        complete() {
          console.log('跳转成功')
        },
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
    const { title, profession, skill, discipline, choosedType } = this.data
    console.log(Object.keys(choosedType))
    app.request().post(`${urlPre}/api/code/basic/part/createTitle`).send({
      title,
      profession,
      discipline,
      skill,
      type: choosedType,
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        skill,
        part: data.data,
        choosed: 'part',
        choosedType: {}
      })
    })
  },
  delPart( { target: { dataset: { skill, title } } } ) {
    app.request().post(`${urlPre}/api/code/basic/part/deletePart`).send({
      title,
      skill,
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        skill,
        part: data.data,
        choosed: 'part',
        choosedType: {}
      })
    })
  },
  modPart( { target: { dataset: { skill, title, type } } } ) {
    this.setData({
      showInput: true,
      title,
      originTitle: title,
      choosedType: type
    })
    // app.request().post(`${urlPre}/api/code/basic/part/modPartInfo`).send({
    //   title,
    //   skill,
    // })
    // .end().then( ( { body: data } ) => {
    //   console.log(data)
    //   this.setData({
    //     skill,
    //     part: data.data,
    //     choosed: 'part',
    //     choosedType: {}
    //   })
    // })
  },
  modPartTitle() {
    const { title, skill, originTitle } = this.data
    app.request().post(`${urlPre}/api/code/basic/part/modPartInfo`).send({
      title,
      skill,
      originTitle
    })
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        skill,
        part: data.data,
        choosed: 'part',
        choosedType: {},
        originTitle: title,
      })
    })
  },
})
