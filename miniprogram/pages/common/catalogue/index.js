const app = getApp()
import { urlPre } from '../../../js/env.js'
Component({
    properties: {
      catalogue: {
        type: Array,
      },
      skill: {
        type: String,
      }
    },
    lifetimes: {
      attached() {
        console.log('目录数据')
        console.log(this.data.catalogue)
        this.setData({
          originCatalogue: JSON.parse(JSON.stringify(this.data.catalogue))
        })
      },
    },
    data: {
      showCatalogue: true,
      inputOne: '',
      inputTwo: '',
      inputThree: '',
      currentIiindex: null,
      currentIindex: null,
      currentIndex: null,
    },
    methods: {
      // getLevel({ target: { dataset: { index } } }) {
      //   // const levelArr = index.split('-')
      //   this.triggerEvent('switchCatalogue', { index })
      // },
      confirm() {
        const { skill, catalogue, originCatalogue } = this.data

        app.request().post(`${urlPre}/api/code/basic/changeCatalogue`).query({
          skill
        }).send({
          catalogue
        })
        .end().then( ( { body: data } ) => {
          console.log(data)
          this.setData({
            currentIndex: null,
            currentIindex: null,
            currentIiindex: null,
          })
          this.triggerEvent('updateCatalogue', { skill })
        })
      },
      addCatalogue({ detail: { value }, target: { dataset: { index = null , iindex = null, iiindex = null } } }) {
        let { catalogue, addindex = null, addiindex = null, addiiindex = null } = this.data
        console.log(index, iindex, iiindex)
        if ( iiindex !== null ) {
          catalogue[addiiindex || index].children[addiindex || iindex].children[addiiindex || iiindex] = {
            name: value,
            level: 3,
            children: [],
          }
        } else if ( iindex !== null ) {
          catalogue[addindex || index].children[addiindex || iindex] = {
            name: value,
            level: 2,
            children: [],
          }
        } else {
          catalogue[addindex || index] = {
            name: value,
            level: 1,
            children: [],
          }
        }
        console.log(catalogue)
        this.setData({
          catalogue,
          addindex: addindex || index,
          addiindex: addiindex || iindex,
          addiiindex: addiiindex || iiindex,
        })
      },
      setLevel({ target: { dataset: { one = null, two = null, three = null } } }) {
        let { currentIiindex = null, currentIindex = null, currentIndex = null } = this.data
        console.log(one, two, three)
        console.log(two)
        let l3, l2
        if (currentIiindex === three && currentIindex === two && currentIndex === one || three === null ) {
          if (currentIiindex !== null) l3 = true
          currentIiindex = null
        } else {
          currentIiindex = three
        }
        if (currentIindex === two && currentIndex === one && currentIiindex === null && !l3 || two === null) {
          if (currentIindex !== null) l2 = true
          currentIindex = null
        } else {
          currentIindex = two
        }
        if (currentIndex === one && currentIiindex === null && !l2 && currentIindex === null )  {
          currentIndex = null
        } else {
          currentIndex = one
        }

        let inputOne = '', inputTwo = '', inputThree = ''
        if (currentIndex !== null) {
          let levelOne = this.data.catalogue[currentIndex]
          inputOne = levelOne.name
          if (currentIindex !== null) {
            let levelTwo = levelOne.children[currentIindex]
            inputTwo = levelTwo.name
            if (currentIiindex !== null) {
              let levelThree = levelTwo.children[currentIiindex]
              inputThree = levelThree.name
            }
          }
        }
        console.log(currentIndex, currentIindex,currentIiindex )
        this.setData({
          currentIndex,
          currentIindex,
          currentIiindex,
          inputOne,
          inputTwo,
          inputThree,
        })
        // let aa = ''
        // if (one) aa += one
        // if (two) aa += `-${two}`
        // if (three) aa =+ `-${three}`
        this.triggerEvent('switchCatalogue', { catalogueOne: inputOne, catalogueTwo: inputTwo, catalogueThree: inputThree })
      },
      addCatalogueOne({ detail: { value } }) {
        let { currentIndex, catalogue = [] } = this.data
        if (currentIndex !== null) {
          catalogue[currentIndex].name = value
        } else {
          currentIndex = catalogue.length
          catalogue[currentIndex] = {
            name: value,
            level: 1,
            time: new Date().getTime(),
            children: []
          }
        }
        this.setData({
          catalogue,
          currentIndex
        })
      },
      addCatalogueTwo({ detail: { value } }) {
        let { currentIindex, currentIndex, catalogue } = this.data
        if (currentIindex !== null) {
          catalogue[currentIndex].children[currentIindex].name = value
        } else {
          if (currentIndex !== null) {
            currentIindex = catalogue[currentIndex].children.length
            catalogue[currentIndex].children[currentIindex] = {
              name: value,
              level: 1,
              time: new Date().getTime(),
              children: []
            }
          } else {
            currentIndex = catalogue.length
            currentIindex = 0
            catalogue[currentIndex] = {
              name: '',
              level: 1,
              time: new Date().getTime(),
              children: [ {
                name: value,
                level: 2,
                time: new Date().getTime(),
                children: []
              } ]
            }
          }
        }
        this.setData({
          catalogue,
          currentIndex,
          currentIindex,
        })
      },
      addCatalogueThree({ detail: { value } }) {
        let { currentIiindex, currentIindex, currentIndex, catalogue } = this.data
        if (currentIiindex !== null) {
          catalogue[currentIndex].children[currentIindex].children[currentIiindex].name = value
        } else {
          if (currentIindex !== null) {
            currentIiindex = catalogue[currentIndex].children[currentIindex].children.length
            catalogue[currentIndex].children[currentIindex].children[currentIiindex] = {
              name: value,
              level: 3,
              time: new Date().getTime(),
              children: []
            }
          } else {
            if (currentIndex !== null) {
              currentIiindex = 0
              currentIindex = catalogue[currentIndex].children.length
              catalogue[currentIndex].children[currentIindex] = {
                name: '',
                level: 2,
                time: new Date().getTime(),
                children: [ {
                  name: value,
                  level: 3,
                  time: new Date().getTime(),
                  children: []
                } ]
              }
            } else {
              currentIiindex = 0
              currentIindex = 0
              currentIndex = catalogue.length
              catalogue[currentIndex] = {
                name: '',
                level: 1,
                time: new Date().getTime(),
                children: [ {
                  name: '',
                  level: 2,
                  time: new Date().getTime(),
                  children: [ {
                    name: value,
                    level: 3,
                    time: new Date().getTime(),
                    children: []
                  } ]
                } ]
              }
            }
          }
        }
        this.setData({
          catalogue,
          currentIndex,
          currentIindex,
          currentIiindex
        })
      },
      inputBlur({ target: { dataset: { level } }, detail: { value } }) {
        console.log(value)
        if (!value) return 
        const { originCatalogue, currentIndex, currentIindex, currentIiindex, catalogue } = this.data
        if (+level === 1) {
          if (!originCatalogue[ currentIndex ]) {
            console.log('新增1')
          } else if (originCatalogue[ currentIndex ].name !== catalogue[ currentIndex ].name) {
            console.log('name1change')
          }
        } else if (+level === 2 && currentIindex !== null) {
          if (!originCatalogue[ currentIndex ] || !originCatalogue[ currentIndex ].children[currentIindex]) {
            console.log('新增2')
          } else if (originCatalogue[ currentIndex ].children[currentIindex].name !== catalogue[ currentIndex ].children[currentIindex].name) {
            console.log('name2change')
          }
        } else if (currentIiindex !== null) {
          if (!originCatalogue[ currentIndex ] || !originCatalogue[ currentIndex ].children[currentIindex] || !originCatalogue[ currentIndex ].children[currentIindex].children[currentIiindex]) {
            console.log('新增3')
          } else if (originCatalogue[ currentIndex ].children[currentIindex].children[currentIiindex].name !== catalogue[ currentIndex ].children[currentIindex].children[currentIiindex].name) {
            console.log('name3change')
          }
        }
      },
    },
  })
  