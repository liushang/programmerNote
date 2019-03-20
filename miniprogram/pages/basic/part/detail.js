import { urlPre } from '../../../js/env.js'
import store from '../../../js/store'
let WxParse = require('../../../wxParse/wxParse.js')
const app = getApp()
const nodeArr = [
  {
    name: 'text',
    expand: false,
  }, { 
    name: 'div',
    expand: true,
    choose: false,
  }, { 
    name: 'p',
    expand: true,
    choose: false,
  }, { 
    name: 'img',
    expand: false,
    choose: false,
  }, { 
    name: 'code',
    expand: true,
    choose: false,
  // }, { 
  //   name: 'h',
  //   expand: false,
  //   choose: false,
  // }, { 
  //   name: 'span',
  //   expand: false,
  //   choose: false,
  }
]
const styleMap = {
  'font-size': {
    sName: 'f-z',
    unit: 'px',
  },
  'width': {
    sName: 'w-t',
    unit: 'px',
  },
  'margin': {
    sName: 'm-g',
    unit: '',
  },
  'line-height': {
    sName: 'l-h',
    unit: 'px',
  },
  'color': {
    sName: 'color',
    unit: '',
  },
  'height': {
    sName: 'height',
    unit: 'px',
  },
  'font-weight': {
    sName: 'f-w',
    unit: '',
  }
}
const styleArr = [
  {
    name: 'font-size',
    value: '16px',
    sName: 'f-s',
    unit: 'px',
    choose: false
  },
  {
    name: 'width',
    value: '0',
    sName: 'width',
    unit: 'px',
    choose: false
  },
  {
    name: 'margin',
    value: '0',
    sName: 'm-g',
    unit: 'px',
    choose: false
  },
  {
    name: 'margin',
    value: '0',
    sName: 'm-g',
    unit: 'px',
    choose: false
  },
  {
    name: 'line-height',
    value: '0px',
    sName: 'l-h',
    unit: 'px',
    choose: false
  },
  {
    name: 'color',
    value: 'black',
    sName: 'color',
    unit: '',
    choose: false
  },
]
const funcMap = {
  text: {
    type: 'text',
    text: '',
    attrs: {
      class: '',
      style: 'font-size: 20px;line-height: 20px;color:black;font-weight:500'
    },
    styleInput: '',
    styleKey:'',
  },
  img: {
    name: 'img',
    attrs: {
      class: 'rich-text-img',
      style: 'margin:0 auto;width: 300px;height: 200rpx',
      src: '',
    },
    styleInput: '',
    styleKey:'',
  },
  div: {
    name: 'div',
    expandd: true,
    attrs: {
      class: 'rich-text-div',
      style: 'font-size: 20px;line-height: 20px;color:black'
    },
    styleInput: '',
    styleKey:'',
    children: [{
      type: 'text',
      text: '',
      attrs: {
        class: '',
        style: 'font-size: 20px;line-height: 20px;color:black'
      },
      styleInput: '',
      styleKey:'',
    }]
  },
  p: {
    name: 'p',
    expandd: true,
    attrs: {
      class: 'rich-text-p',
      style: 'font-size: 20px;line-height: 20px;color:black'
    },
    styleInput: '',
    styleKey:'',
    children: [{
      type: 'text',
      text: '',
      attrs: {
        class: '',
        style: 'font-size: 20px;line-height: 20px;color:black'
      },
      styleInput: '',
      styleKey:'',
    }]
  },
  code: {
    name: 'code',
    expandd: true,
    expandArr: [ 'text' ],
    attrs: {
      class: 'rich-text-code',
      style: 'font-size: 14px;line-height: 20px;color:black'
    },
    styleInput: '',
    styleKey:'',
    children: [{
      type: 'text',
      text: '',
      attrs: {
        class: '',
        style: 'font-size: 20px;line-height: 20px;color:black'
      },
      styleInput: '',
      styleKey:'',
    }]
  },
  // h: {
  //   name: 'h',
  //   attrs: {
  //     class: '',
  //     style: 'line-height: 20rpx;color:black;font-weight: 700'
  //   },
  //   styleInput: '',
  //   styleKey:'',
  //   children: [{
  //     type: 'text',
  //     text: '',
  //     attrs: {
  //       class: '',
  //       style: 'font-size: 20rpx;line-height: 20rpx;color:black'
  //     },
  //     styleInput: '',
  //     styleKey:'',
  //   }]
  // },
  // span: {
  //   name: 'span',
  //   attrs: {
  //     class: '',
  //     style: ''
  //   },
  //   children: []
  // }
}
Page({
  data: {
    detail: [],
    showEditModal: false,
    nodeArr,
    funcMap,
    styleArr,
    styleMap,
    chooseFirst: 0,
    chooseSec: 0,
  },
  onLoad({ title, skill }) {
    this.getPartDetail({ title, skill })
  },
  onShow() {
    console.log('show')
  },
  onHide() {
    console.log('hide')
  },
  getPartDetail ({ title, skill }) {
    app.request().post(`${urlPre}/api/code/basic/part/getPartDetailByTitle`).send({
      title, skill
    })
    .end().then( ( { body: { data: data } } ) => {
      console.log(data)
      const { discipline, profession, skill, title: part, content } = data[0]
      // WxParse.wxParse('makeDown', 'md', content, this, 20)
      this.setData({
        profession,
        discipline,
        skill,
        part,
        detail: JSON.parse(content),
        partDetail: data[0],
        choosed: 'part'
      })
    })
  },
  edit() {
    this.setData({
      showEditModal: true,
      originText: JSON.stringify(this.data.detail)
    })
  },
  inputText({ detail: { value }, target: { dataset: { index } } }) {
    console.log(value)
    let { detail } = this.data
    let obj = this.getObj(detail, index)
    if (obj.text !== undefined) {
      obj.text = value
    } else if (obj.attrs.src !== undefined) {
      obj.attrs.src = value
    }
    this.setData({
      detail
    })
  },
  getObj (detail, index) {
    let indexArr = index.toString().split('-')
    let obj = detail[indexArr[0]]
    if (indexArr.length > 1) obj = detail[indexArr[0]].children[indexArr[1]]
    return obj
  },
  getNode({ target: { dataset: { name, index } } }) {
    console.log(name)
    console.log(index)
    const detail = this.data.detail
    let detailItem
    let indexArr = index.toString().split('-')
    if (indexArr.length === 2) detailItem = detail[indexArr[0]].children[indexArr[1]]
    if (indexArr.length === 3) detailItem = detail[indexArr[0]].children[indexArr[1]].children[indexArr[2]]
    if (indexArr.length === 1) detailItem = detail[indexArr[0]]
    let originName = detailItem.name || ''
    if ( name === originName ) {
      originName = ''
    } else {
    originName = name
    }
    console.log(funcMap)
    // let setItem
    if (indexArr.length === 2) detail[indexArr[0]].children[indexArr[1]] = originName ? JSON.parse(JSON.stringify(funcMap[name])) : {}
    if (indexArr.length === 3) detail[indexArr[0]].children[indexArr[1]].children[indexArr[2]] = originName ? JSON.parse(JSON.stringify(funcMap[name])) : {}
    if (indexArr.length === 1) detail[indexArr[0]] = originName ? JSON.parse(JSON.stringify(funcMap[name])) : {}
    this.setData({
      detail
    })
  },
  addChildren({ target: { dataset: { index } } }) {
    console.log(index)
    const detail = this.data.detail
    let indexArr = index.toString().split('-')
    let setItem
    if (indexArr.length === 2) setItem = 'detail[' + indexArr[0] + '].children[' + indexArr[1] + '].children'
    if (indexArr.length === 3) setItem = 'detail[' + indexArr[0] + '].children[' + indexArr[1] + '].children[' + indexArr[2] + '].children'
    if (indexArr.length === 1) setItem = 'detail[' + indexArr[0] + '].children'
    this.setData({
      [setItem] : [{
        type: 'text',
        text: ''
      }]
    })
  },
  addNode({ target: { dataset: { index, type } } }) {
    console.log(index)
    let detail = this.data.detail
    let indexArr = index.toString().split('-')
    // let { name: originName } = detailItem
    if (indexArr.length === 1) {
      if (type === 'add') {
        if (indexArr[0] > 0) {
          let { type, name } = detail[indexArr[0] - 1]
          let typeObj = this.data.funcMap[type || name]
          let delObj = JSON.parse(JSON.stringify(typeObj))
          detail[indexArr[0]] = Object.assign({}, delObj)
        } else {
          detail[indexArr[0]] = {
            type: 'text',
            text: ''
          }
        }
      } else{
        detail.splice(indexArr[0], 1)
      }
    }
    if (indexArr.length === 2) {
      if (type === 'add') {
        if (indexArr[1] > 0) {
          let { type, name } = detail[indexArr[0]].children[indexArr[1] - 1]
          let typeObj
          let delObj
          // let delObj = JSON.parse(JSON.stringify(detail[indexArr[0]].children[indexArr[1] - 1]))
          // delete delObj.children
          // 如果是二级text文本节点 根据第一级计算样式
          if (type) {
            name = detail[indexArr[0]].name
            delObj = JSON.parse(JSON.stringify(this.data.funcMap[name]))
            detail[+indexArr[0] + 1] = Object.assign({}, delObj)
            // 针对code标签做缩进处理
            let codes = detail
            if (name === 'code') {
              let tier = 0
              for (let i = 0; i < codes.length-1; i++ ) {

                if (codes[i].name && codes[i].name === 'code') {
                  let str = codes[i].children[0].text.split('')
                  let right = str.filter(x => x === '{').length
                  let left = str.filter(x => x === '}').length
                  console.log(right, left)
                  if ((right - left) % 2 !== 0 ) {
                    if (right > left) {
                      tier++
                      let result = `padding-left:${30 + tier * 20 }px;`
                      let newVal = codes[i + 1].attrs.style.replace(/padding-left.*?(;|$)/, result)
                      codes[i + 1].attrs.style = newVal
                    } else {
                      tier--
                      let result = `padding-left:${30 + tier * 20 }px;`
                      let newVal = codes[i].attrs.style.replace(/padding-left.*?(;|$)/, result)
                      codes[i].attrs.style = newVal
                    }
                  } else {
                    let result = `padding-left:${30 + tier * 20 }px;`
                    let newVal = codes[i].attrs.style.replace(/padding-left.*?(;|$)/, result)
                    codes[i].attrs.style = newVal
                  }
                } else {
                  tier = 0
                }
              }
            }
          } else {
            typeObj = this.data.funcMap[name]
            console.log(typeObj)
            delObj = JSON.parse(JSON.stringify(typeObj))
            detail[indexArr[0]].children[indexArr[1]] = Object.assign({}, delObj)
          }
        } else {
          detail[indexArr[0]].children[indexArr[1]] = {
            type: 'text',
            text: ''
          }
        }
      } else{
        console.log(detail[indexArr[0]].children[indexArr[1]])
        detail[indexArr[0]].children.splice(indexArr[1], 1)
      }
    }
    // if (indexArr.length === 2) type === 'add' ? detail[indexArr[0]].children[indexArr[1]] = {} : detail[indexArr[0]].children.splice(indexArr[1], 1)
    if (indexArr.length === 3) type === 'add' ? detail[indexArr[0]].children[indexArr[1]].children[indexArr[2]] = {} : detail[indexArr[0]].children[indexArr[1]].children.splice(indexArr[2], 1)
    // detail[indexArr[0]] = {}
    // console.log(setItem)
    this.setData({
      detail,
    })
  },
  huiche({ target: { dataset: { index } } }) {
    console.log('huiche')
    const { detail } = this.data
    let indexArr = index.toString().split('-')
    let newIndex = index + 1
    if (indexArr.length > 1) {
      newIndex = indexArr[0] + '-' + (Number(indexArr[1]) + 1)
      setTimeout(() => {
        this.setData({
          chooseSec: Number(indexArr[1]) + 1
        })
      }, 200)
    } else {
      setTimeout(() => {
        this.setData({
          chooseFirst: index + 1
        })
      }, 200)
    }
    this.addNode({ target: { dataset: { index: newIndex, type: 'add' } } })
  },
  inputStyle({ detail: { value }, target: { dataset: { index, key, val } } }) {
    let { detail } = this.data
    let obj = this.getObj(detail, index)
    let rep = new RegExp(`${key}.*?(;|$)`)
    console.log(rep)
    let result = `${key}:${value}${this.data.styleMap[key].unit};`
    let newVal = obj.attrs.style.replace(rep, result).replace(/[;]$/, '')
    obj.attrs.style = newVal
    this.setData({
      detail
    })
  },
  chooseStyle({ target: { dataset: { name, index, val } } }) {
    let styleKey
    let styleInput
    let indexArr = index.toString().split('-')
    let setItem
    if (indexArr.length === 1){
      styleKey = 'detail[' + indexArr[0] + '].styleKey'
      styleInput = 'detail[' + indexArr[0] + '].styleInput'
    }
    if (indexArr.length === 2){
      styleKey = 'detail[' + indexArr[0] + '].children[' + indexArr[1] + '].styleKey'
      styleInput = 'detail[' + indexArr[0] + '].children[' + indexArr[1] + '].styleInput'
    }
    if (indexArr.length === 3) {
      styleKey = 'detail[' + indexArr[0] + '].children[' + indexArr[1] + '].children[' + indexArr[2] + '].styleKey'
      styleInput = 'detail[' + indexArr[0] + '].children[' + indexArr[1] + '].children[' + indexArr[2] + '].styleInput'
    }
    this.setData({
      [styleKey]: name,
      [styleInput]: val
    })
  },
  catchFirst({ target: { dataset: { index } } }) {
    console.log(index)
    let firstNum = Number(index.toString().split('-')[0])
    this.setData({
      chooseFirst: firstNum,
    })
  },
  catchSec({ target: { dataset: { index } } }) {
    console.log(index)
    let indexArr = index.toString().split('-')
    let secNum = Number(indexArr[1])
    // if (this.data.detail[indexArr[0]].children.length - 1 <= secNum) {
    //   secNum = this.data.detail[indexArr[0]].children.length - 1
    // }
    this.setData({
      chooseSec: secNum,
    })
  },
  confimEdit() {
    const { detail: content, title, skill } = this.data
    console.log(content)
    app.request().post(`${urlPre}/api/code/basic/part/savePartDetailByTitle`).send({
      title, skill, content
    })
    .end().then( ( { body: { data: data } } ) => {
      console.log(data)
      const { discipline, profession, skill, title: part, content } = data[0]
      // WxParse.wxParse('makeDown', 'md', content, this, 20)
      this.setData({
        profession,
        discipline,
        skill,
        part,
        detail: content,
        partDetail: data[0],
        choosed: 'part'
      })
    })
    this.setData({
      showEditModal: false,
    })
  },
  canncel() {
    this.setData({
      detail: JSON.parse(this.data.originText),
      showEditModal: false,
    })
  }
})
