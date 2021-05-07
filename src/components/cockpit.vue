<template>
  <div class="cockpit-warapper">
    <div ref="map" class="XSDFXPage">
      <gisMap @showCard="showCard" :mapZoom="mapZoom" v-if="mapContent.sign.length>0"
              :mapContent="mapContent"></gisMap>
    </div>
    <!--  图谱放大弹框  -->
    <div class="default-popover" @click="handleCloseGraph" v-show="isGraphPopover">
      <div class="pop-content">
        <img @click="handleCloseGraph" src="../static/close.png"/>
        <div ref="bigGraph" class="big-graph">
        </div>
      </div>
    </div>
    <!--  统计弹框  -->
    <div class="default-popover statistic-fullScreen" @click="handleCloseGraph" v-show="isBarShow">
      <div class="statistic-box">
        <img class="close-icon" @click="handleCloseGraph" src="../static/close.png"/>
        <div ref="chart" class="statistic-bar-chart"></div>
      </div>
    </div>
    <!--  图片放大  -->
    <div class="default-popover image-fullScreen" @click="handleCloseGraph" v-if="isFullScreenImg">
      <div class="imagefull-box">
        <img class="close-icon" @click="handleCloseGraph" src="../static/close.png"/>
        <el-carousel :autoplay='false' :height="fullImgHeight.default">
          <el-carousel-item class="carousel-item" v-for="item in images" :key="item">
            <img class="carousel-images" :src="item"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="home-back" @click="handleClickIsback" v-if="isbackHome"></div>
    <div class="cockpit-cont">
      <div class="detail-title">
<!--        <img class="detail-title-bg" src="../static/c-topbj.png"/>-->
        <span>{{ window.configure.homeTitle }}</span>
      </div>
      <div class="cockpit-info" :style="{ transform: !labelLeftAct ? cockpitLeftStyle.hide : cockpitLeftStyle.show  }">
        <div
          @click="handleClickLabel('left')"
          class="cockpit-left-label"
          :class="{ 'label-l-act-img': labelLeftAct, 'label-l-img': !labelLeftAct }"></div>
        <div class="data-presentation">
          <div class="enlarge-icon" @click="handleClickBarChart"><img src="../static/zoom-icon.png"></div>
          <div class="presentation">
            <div v-for="(item, index) in presentation" :key="index" class="default-flex">
              <span>{{ item.name }}</span>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div class="data-search  default-flex">
          <div class="search-case default-flex">
            <input class="input" ref="input" placeholder="台湾" type="text"/>
            <div @click="handleClickEmptyInput" class="close-img  default-flex">
              <img src="../static/close.png"/>
            </div>
          </div>
          <div class="search-btn  default-flex" @click="handleClickSearch()">
            <img src="../static/search.png"/>
          </div>
        </div>
        <div class="datasearch-list" v-if="isSearchList">
          <div class="scroll-content">
            <div class="empty" v-if="searchData.length==0">暂无数据</div>
            <ul class="list" v-if="searchData.length>0">
              <li class="" @click.stop="handleClickList(item.sourceAsMap)" v-for="(item, index) in searchData"
                  :key="index">
                <div class="li-info">
                  <div class="li-title" :class="{ 'act-sign-text': item.sourceAsMap.activate }">
                    <span class="index">{{ index + 1 }}.{{ item.sourceAsMap.name }}</span>
                  </div>
                  <div class="li-cont" :class="{'other':!item.sourceAsMap.activate}">{{ item.sourceAsMap.desc }}</div>
                  <div class="li-time">
                    <P>
                      <span>{{ item.sourceAsMap.concept_name }}</span>
                      <span>{{ item.sourceAsMap.time }}</span>
                    </P>
                    <span @click.stop="handleClickDetali(item.sourceAsMap)" class="detail-text">查看详情</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cockpit-detail" ref="cockpitDetail">
        <div class="detail-show" v-if="isDetail" :style="{'pointer-events':isDetail?'auto':'none'}">
          <div class="detail-info">
            <div class="detail-const">
              <div class="scroll-content">
                <div class="detail-padd">
                  <div class="detail-header">
                    <div class="">
                      {{ curTitle }}
                    </div>
                  </div>
                  <div class="detail-carousel" v-if="images.length>0">
                    <div v-if="images.length>3" class="prev arrow" @click="handleClickArrow(1)"></div>
                    <div class="carousel-img">
                      <div class="carouse_item" :style="{ transform: `translateX(${distanceVal}px)` }">
                        <div @click="isFullScreenImg = true" v-for="(item, index) in images" :key="index">
                          <img :src="item"/>
                        </div>
                      </div>
                    </div>
                    <div v-if="images.length>3" class="next arrow" @click="handleClickArrow(2)"></div>
                  </div>
                  <div class="detail-word">
                    <div>
                      <span class="tp">时间: </span><span>{{ currentDetailCont['时间'] || '无' }}</span>
                      <span class="tp">地点: </span><span>{{ currentDetailCont['gis地址'] || '无' }}</span>
                    </div>
                    <p>
                      <span class="tp">简介: </span> <span>{{ currentDetailCont['译文'] || '无' }}</span>
                    </p>
                    <p>
                      <span class="tp">起因: </span> <span>{{ currentDetailCont['事件起因'] || '无' }}</span>
                    </p>
                    <p>
                      <span class="tp">经过:  </span><span>{{ currentDetailCont['事件经过'] || '无' }}</span>
                    </p>
                    <p>
                      <span class="tp">结果: </span> <span>{{ currentDetailCont['事件结果、影响、损失等'] || '无' }} </span>
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="relation-info">
            <img @click="handleClickClose" src="../static/close.png"/>
            <h3>关联实体</h3>
            <h3>关联实体（{{ entityList.length }}）</h3>
            <div class="relation-text">
              <span @click="handleEntity(item.id)" v-for="(item, index) in entityList" :key="index"
                    class="default-flex">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cockpit-graph"
           :style="{transform: !labelRightAct ? cockpitRightStyle.hide : cockpitRightStyle.show }">
        <div
          @click="handleClickLabel('right')"
          class="cockpit-label"
          :class="{ 'label-act-img': labelRightAct, 'label-img': !labelRightAct }"></div>
        <div class="cockpit-r-cont">
          <div class="plandata">
            <h4 class="title"><span>知识图谱</span><span @click="handleClickEnlarge()"><img
              src="../static/zoom-icon.png"></span></h4>
            <div ref="atlasImg" class="atlas-img">
              <div ref="spaGraph" class="spa-graph"></div>
            </div>
          </div>
          <div class="events-list">
            <h4 class="title">相关事件</h4>
            <div class="content-hidden">
              <div class="scroll-content">
                <ul class="event-list-info">
                  <li v-for="(item, index) in eventData" :key="index" @click="handleClickEvent(item)">
                    {{ item.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  事件展示框  -->
    <div v-if="timePop" class="time-pop-box">
      <div @click="timePop = false" class="sm-shrink"></div>
      <div class="t-pop-cont">
        <div class="scroll-pop">
          <ul>
            <li v-for="(item, indx) in curTimeData.name" :key="indx" @click="handleClickDetali({id:curTimeData.ids[indx]})">
              <span>{{ indx + 1 }}. {{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="pop-border-triangle">
      </div>
    </div>
    <div class="cockpit-time-axis-cont time-axis-scroll">
      <div class="positon-time-line">
        <div class="time-cont" id="getScroll" @scroll="getScroll" :style="{'width': (((timeData.length - 1) * 220) + 521) + 'px'}">
          <div class="time-line"></div>
          <div v-for="(item, index) in timeData" :key="index" class="time-text">

            <div :class="{ 'time-spot': !item.activate,'time-spot-active': item.activate }">
              <p :class="{  campus: !item.activate,  'campus-active': item.activate }">
                {{ item.time }}
              </p>
              <p @click="handleClickTimeShow(item, index, $event)"
                 :class="{  'campus-icon': !item.activate, 'campus-active-icon': item.activate  }">
                <i></i>
              </p>
            </div>
            <div
              @click="handleClickTimeShow(item, index, $event)"
              class="prominent"
              :class="{
                    'prominent-text': !item.activate,
                    'prominent-active-text': item.activate
                  }"
            >
              <p v-for="(v, index) in item.name" :key="index">
                <span v-if="index<2">
                     {{ v }}
                  </span>
                <span v-if="index == 2">
                    ......
                  </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {PdSDKDcGraph} from '@plantdata/sdk/src/sdk/netchart/graph/dcgraph'
import gisMap from './gis.vue'
import qs from 'qs'
import * as echarts from 'echarts';

export default {
  components: {gisMap},
  data() {
    return {
      fullImgHeight: {
        default: '563px'
      },
      isFullScreenImg: false,
      isBarShow: false,
      isGraphPopover: false,
      inputVal: '台湾',
      timePop: false,
      curTimeData: '',
      window: window,
      mapContent: {
        sign: [],
        name: [],
        ids: [],
        time: ''
      },
      isbackHome: false,
      myMap: '',
      settings: {
        selector: '.spa-graph', // 选择器的名字
        kgName: window.kgName, // 图谱kgName,这里只是举了个例子
        ajaxSettings: {
          baseUrl: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/`,
          headers: {
            APK: '445a793dd0314abd875b7980d7ffbbd6' // 同理
          }
        },

        page: {
          enable: false
        },
        contextmenu: {
          enable: false
        },
        loaderSettings: {
          ajaxSettings: {
            queryData: {
              pageSize: 5,
              distance: 1,
              hyponymyDistance: 0
            },

          }
        },
        filter: {
          enable: false
        },
        prompt: {
          enable: false
        },
        infobox: {
          enable: false
        },
        resetLayout: {
          enable: false
        },
        history: {
          enable: false
        },
        find: {
          enable: false
        },
        wordCloud: {
          enable: false
        },
        changeLayout: {
          enable: false
        },
        visConfigure: {
          enable: false
        },
        toolbar: {
          enable: false
        },
        zoomSlider: {
          enable: false
        }

      },
      bigSettings: {
        selector: '.big-graph', // 选择器的名字
        kgName: window.kgName, // 图谱kgName,这里只是举了个例子
        ajaxSettings: {
          baseUrl: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/`,
          headers: {
            APK: '445a793dd0314abd875b7980d7ffbbd6' // 同理
          }
        },

        page: {
          enable: false
        },
        contextmenu: {
          enable: false
        },
        loaderSettings: {
          ajaxSettings: {
            queryData: {
              pageSize: 20,
              distance: 1,
              hyponymyDistance: 0
            },
          }
        },
        filter: {
          enable: false
        },
        prompt: {
          enable: false
        },
        infobox: {
          enable: false
        },
        resetLayout: {
          enable: false
        },
        history: {
          enable: false
        },
        find: {
          enable: false
        },
        wordCloud: {
          enable: false
        },
        changeLayout: {
          enable: false
        },
        visConfigure: {
          enable: false
        },
        toolbar: {
          enable: false
        },
        zoomSlider: {
          enable: false
        }

      },
      curIndex: '',
      curTitle: '',
      isSearchList: false,
      labelLeftAct: true,
      labelRightAct: true,
      isDetail: false,
      cockpitRightStyle: {
        show: "translateX(0)",
        hide: "translateX(100%)"
      },
      cockpitLeftStyle: {
        show: "translateX(0)",
        hide: "translateX(-100%)"
      },
      presentation: [],
      presentations: [],
      currentDetailCont: {index: "", data: {}},
      searchData: [],
      images: [],
      eventData: [],
      timeData: [],
      addUp: 0,
      distanceVal: 0,
      ak: '8d6OSp3a2uSZMn8tVkiRHvSG0lDqijWy',
      entityList: [],
      statistics: [],
      graph: '',
      graphs: '',
      mapNum: 0,
      token: '',
      mapZoom: '',
      bigGraph: '',
      curGraphId: ''
    }
  },
  mounted() {

    if (this.$route.params) {
      this.isbackHome = this.$route.params.isbackHome
    }
    this.graph = new PdSDKDcGraph(this.settings)
    this.graph.load({id: 9661})
    setTimeout((item) => {
      this.$refs.atlasImg.style = "opacity: 1"
    }, 500)
    this.getEntity();
    this.getEvent();
    this.getToken();
    this.queryString();
    this.handleClickSearch()

    window.addEventListener('scroll', this.getScroll,true)
  },
  created() {

  },
  methods: {
    getScroll(event){
      // 获取滚动条离顶部的距离
      let left = event.target.scrollLeft;
      // console.log(left);
      console.log(left);
    },
    // url参数字符串 转换为对象
    queryString() {
      const str = window.location.href
      let strings = decodeURIComponent(str);
      let obj = {};
      let start = strings.indexOf('?')
      if (start != -1) { // && strings.indexOf('?') === 0
        strings = strings.substr(start + 1);
      }
      let arr = strings.split("&");
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i].split("=");
        if (item[0]) {
          obj[item[0]] = item[1]
        }
      }
      return obj;
    },
    getToken() {
      this.$http({
        method: 'get',
        url: `${window.configure.baseUrl}/api/kguser/sso/login/445a793dd0314abd875b7980d7ffbbd6`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'conceptId': 5})
      }).then((res) => {
        if (res.status === 200 && res.data.errCode == 200) {
          this.token = res.data.data.token
          this.postEnetity()
        }
      })
    },
    // 时间轴-获取实体列表
    postEnetity() {
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/api/kgms/edit/entity/${this.window.kgName}/list?size=100&conceptId=5&inherit=true`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Authorization': this.token
        },
        data: {}
      }).then((res) => {
        if (res.status === 200 && res.data.errCode == 200) {
          const timeData = this.eneityTransData(res.data.data.content)
          timeData.sort(this.sortTimeAsc('timeStamp'))

          this.timeData = timeData.reverse();
          // this.timeLine(this.timeData[0].ids)
        }
      })
    },
    // 数据聚合
    eneityTransData(data) {
      const dataMap = {}
      data.forEach(item => {
        const time = item.fromTime

        if (!dataMap[time]) {
          dataMap[time] = {
            time
          }
        }
        if (!dataMap[time]['ids']) {
          dataMap[time]['ids'] = [];
        }
        if (!dataMap[time]['name']) {
          dataMap[time]['name'] = [];
        }
        if (!dataMap[time]['timeStamp']) {
          dataMap[time]['timeStamp'] = ''
        }
        const date = new Date(time)
        const timeStamp = date.getTime()

        dataMap[time]['timeStamp'] = timeStamp
        dataMap[time]['ids'].push(item.id)
        dataMap[time]['name'].push(item.name)
      })

      return Object.keys(dataMap).map((key, index) => {
        dataMap[key].activate = index === 0
        return dataMap[key]
      })
    },
    // 排序
    sortTimeAsc(k) {
      return function (a, b) {
        const one = a[k]
        const two = b[k]
        return one - two
      }
    },
    handleClickLabel(sign) {
      if (sign == 'right') {
        this.labelRightAct = !this.labelRightAct;
      } else {
        this.labelLeftAct = !this.labelLeftAct;
      }
    },
    handleClickList(item, sign) {
      this.isDetail = false
      this.addUp = 0;
      this.distanceVal = 0;
      this.currentDetailCont.data = item;
      this.curTitle = item.name
      // 点击事件更新时间轴高亮
      if (!sign) {
        this.updataTimelineData(item.time)
        this.searchData.forEach((v, index) => {
          v.sourceAsMap.activate = item.index_ == index ? true : false
        })
      }
      this.timeLine([item.id])
      this.mapZoom = window.configure.clickZoom
      this.getWisdomCard(item.id)
      this.getGraph(item.id)
      this.graph.load({id: item.id})
    },
    // 实体切换图谱
    handleEntity(id) {
      this.curGraphId = id
      this.graph.load({id: id})

    },
    getImgs(id) {
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/infobox/multi/modal?p=api&kgName=${this.window.kgName}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'id': id})
      }).then((res) => {
        if (res.status === 200) {
          const data = res.data.data
          const images = []
          if (!data.multiModals) {
            this.images = []
            return
          }
          const imgUlr = data.multiModals.map((item) => {
            const url = `${window.configure.baseUrl}${item.path}`
            images.push(url)
            return url
          })
          this.images = imgUlr
        }
      })
    },
    // 批量实体查询 事件
    getEvent(id) {
      const ids = id ? id : 5
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/graph/data/entity?kgName=${this.window.kgName}&p=api`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'conceptId': ids})
      }).then((res) => {
        if (res.status === 200) {
          this.eventData = res.data.data
        }
      })
    },
    // 知识卡片
    getWisdomCard(id) {
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/infobox?kgName=${this.window.kgName}&p=api`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'id': id})
      }).then((res) => {
        if (res.status === 200) {
          const pars = res.data.data.pars
          const data = res.data.data.self.extra
          this.curTitle = res.data.data.self.name
          this.getEvent(pars[0].classId)
          this.transCard(data)
        }
      })
    },
    transCard(data) {
      console.log(data, 'data')
      let obj = ['时间', 'gis地址', '简介', '事件起因', '事件经过', '事件结果、影响、损失等','译文']
      let cont = {}
      for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i] == data[j].k) {
            cont[obj[i]] = data[j].v
          }
        }
      }

      this.currentDetailCont = cont
    },
    // 知识图谱每个概念下的直接实例数量。
    getEntity() {
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/graph/stat/entity/count/group/by/concept`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'p': 'api', 'kgName': 'kgms_default_user_graph_176ad79dcad'})
      }).then((res) => {
        if (res.data.ActionStatus === 'OK') {
          const series = res.data.data.series
          const xaxis = res.data.data.xaxis
          const newData = []
          if (series.length && xaxis.length) {
            // this.presentation = this.presentation.map((v, index) => {
            //   const obj = {}
            //   obj.value = v.value
            //   obj.name = v.title
            //   return obj
            // })
            const firstSeries = series[0].data
            const firstXaxis = xaxis[0].data
            console.log(firstSeries,firstXaxis,'newData')
            this.presentations = firstXaxis.map((item,index)=>{
              const obj = {}
              obj.value = firstSeries[index];
              let strIndex = firstXaxis[index].indexOf('[')
              if(strIndex == -1){
                strIndex = firstSeries[index].length
              }
              console.log(strIndex,'inedx')
              const str = firstXaxis[index].substr(0, strIndex)
              obj.name = str
              return obj
            })

            for (let i = 0; i < 4; i++) {
              const obj = {}
              if (firstSeries[i]) {
                obj.value = firstSeries[i]
              }
              if (firstXaxis[i]) {
                const strIndex = firstXaxis[i].indexOf('[')
                const str = firstXaxis[i].substr(0, strIndex)
                obj.name = str
              }
              newData.push(obj)
            }
          }
          this.presentation = newData
        }
      })
    },
    // 图探索
    getGraph(id) {
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/graph?kgName=${this.window.kgName}&p=api`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'id': id})
      }).then((res) => {
        if (res.status === 200) {
          this.entityList = res.data.data.entityList
        }
      })
    },
    updataTimelineData(time) {
      let curIndex = '', isAct = false
      for (let i = 0; i < this.timeData.length; i++) {
        if (this.timeData[i].activate) {
          curIndex = i
        }
        if (this.timeData[i].time == time) {
          this.timeData[i].activate = true
          isAct = true
        } else {
          this.timeData[i].activate = false
        }
        if (i == this.timeData.length - 1 && !isAct) {
          this.timeData[curIndex].activate = true
        }

      }

    },
    // 批量 知识卡片
    timeLine(ids, sign) {
      console.log(ids, 'ids')
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/infobox/more?p=api&kgName=${this.window.kgName}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({ids: ids})
      }).then((res) => {
        if (res.status === 200) {
          const data = res.data.data || []
          const mapData = this.transData(data);
          console.log(mapData, 'get-gisArrs-')
          // 多个经纬度
          if (sign) {
            this.handleClickClose()
            const latLongData = this.allLatLongTrans(mapData);
            this.mapContent.sign = latLongData.gisArrs
            this.mapContent.name = latLongData.names
            this.mapContent.ids = latLongData.ids
            return
          }
          if (mapData[0].gisArr.length > 0) {
            this.mapContent.ids = mapData[0].ids
            this.mapContent.sign = mapData[0].gisArr
            this.mapContent.name = mapData[0].name
            this.mapContent.time = mapData[0].time
          }
        }
      })
    },
    transData(data) {
      console.log(data, 'data-transData')
      const filedMap = {
        // 'gis地址': 'gisAddress',
        'gis经度': 'gisLng',
        'gis纬度': 'gisLat'
      }
      const dataMap = {};
      data.forEach(item => {
        const extra = item.self.extra;
        const timeObj = extra.find(c => c.k === '时间');
        if (timeObj) {
          if (!dataMap[timeObj.v]) {
            dataMap[timeObj.v] = {}
          }
          if (!dataMap[timeObj.v]['name']) {
            dataMap[timeObj.v]['name'] = [];
          }
          if (!dataMap[timeObj.v]['ids']) {
            dataMap[timeObj.v]['ids'] = [];
          }
          dataMap[timeObj.v]['name'].push(item.self.name);
          dataMap[timeObj.v]['ids'].push(item.self.id);
          if (!dataMap[timeObj.v]['gisLng']) {
            dataMap[timeObj.v]['gisLng'] = [];
          }
          if (!dataMap[timeObj.v]['timeStamp']) {
            dataMap[timeObj.v]['timeStamp'] = '';
          }
          if (!dataMap[timeObj.v]['gisLat']) {
            dataMap[timeObj.v]['gisLat'] = [];
          }
        }
        for (let i = 0; i < extra.length; i++) {
          let mapFiled = filedMap[extra[i].k];
          if (mapFiled && extra[i].v) {
            const time = timeObj.v
            dataMap[timeObj.v][mapFiled].push(extra[i].v)
          }
        }
      });
      return Object.keys(dataMap).map((key, index) => {
        const date = new Date(key)
        const timeStamp = date.getTime()
        const obj = {
          time: key,
          activate: index === 0,
          timeStamp: timeStamp,
        }
        Object.keys(dataMap[key]).forEach(key2 => {
          if (key2 !== 'gisLng' && key2 !== 'gisLat' && key2 != 'timeStamp') {
            obj[key2] = dataMap[key][key2]
          } else if (key2 === 'gisLat') {
            obj.gisArr = dataMap[key][key2].map((gisItem, index) => {
              return [Number(dataMap[key]['gisLng'][index]), Number(dataMap[key][key2][index])]
            });
          }
        });
        return obj;

      });
    },
    handleClickClose() {
      this.$refs.map.style = "display:block";
      this.isDetail = false;
    },
    handleClickTimeShow(item, index, e) {
      this.timePop = true;
      this.curTimeData = item
      this.$refs.map.style = "display:block";
      this.isDetail = false;
      this.timeLine(item.ids)
      this.handleClickSearch(item.time)
      this.mapZoom = window.configure.searchZoom
      this.timeData.map((data, i) => {
        data.activate = index === i ? true : false
      });
      if(index>0){
        let move = index * 220 - 521 - 180;
        $('.cockpit-time-axis-cont').scrollLeft(move);
      }
      console.log(this.curTimeData)
    },
    handleClickArrow(step) {
      const length = this.images.length - 3;
      if (step === 1) {
        if (this.addUp === length) return;
        if (this.addUp < length) {
          this.distanceVal = this.distanceVal ?
            this.distanceVal - 200 :
            -(200 + this.addUp);
          this.addUp++;
        }
      } else {
        if (this.addUp !== 0) {
          this.distanceVal = this.distanceVal ?
            this.distanceVal + 200 :
            200 + this.addUp;
          this.addUp--;
        }
      }
    },
    handleClickSearch(time) {
      console.log('search', time)
      const _this = this
      this.inputVal = _this.$refs.input.value ? _this.$refs.input.value : this.inputVal
      if (this.inputVal || time) {
        _this.isSearchList = true;
      } else {
        return
      }
      let data
      if (time) {
        data = {
          "customQuery": "",
          "docTypeList": ["军事图谱"],
          "featureWeights": [],
          "filters": [],
          "hieghtQueryBean": [{"column": "[time]", "midd": 0, "type": 0, "value": time}],
          "isExplain": true,
          "isFilter": 0,
          "kw": "",
          "pageNo": 1,
          "pageSize": 5,
          "templateId": ""
        }
      } else {
        data = {
          kw: this.inputVal,
          docTypeList: ["军事图谱"]
        }
      }
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/api/kgsearch/sdk/simplekw`,
        data: data
      }).then((res) => {
        if (res.data.errCode === 200) {
          this.mapZoom = window.configure.searchZoom
          this.inputVal = ''
          if (time) {

            // _this.isSearchList = true
          } else {
            _this.searchData = res.data.data.rsData;
            _this.searchData.forEach((item, index) => {
              item.sourceAsMap.activate = index == 0 ? true : false
              item.sourceAsMap.index_ = index
            })
            console.log(_this.searchData,'searchData')
            _this.getIds(_this.searchData)
          }
        }
      })
    },
    getIds(data) {
      const ids = []
      data.map((item) => {
        ids.push(item.sourceAsMap.id)
        return item
      })
      this.timeLine(ids, true)
      this.handleClickList(data[0].sourceAsMap);
    },
    allLatLongTrans(data) {
      console.log(data, '显示全部')
      const vals = {};
      const gisArrs = [];
      const names = [];
      const ids = [];
      data.map(item => {
        gisArrs.push(item.gisArr[0])
        names.push(item.name[0])
        ids.push(item.ids[0])
        return item
      })
      vals.gisArrs = gisArrs
      vals.names = names
      vals.ids = ids
      return vals
    },
    handleClickEmptyInput() {
      this.$refs.input.value = ''
    },
    handleClickIsback() {
      this.$router.push({name: 'list'})
    },
    handleClickEvent(item) {
      this.handleClickList(item, true)
    },
    showCard(id) {
      this.isDetail = true;
      this.getWisdomCard(id)
      this.getImgs(id)
      this.getGraph(id)
      this.graph.load({id: id})

    },
    handleClickDetali(item) {
      this.isDetail = true;
      this.getImgs(item.id);
      this.getWisdomCard(item.id)
      this.getGraph(item.id)
      this.graph.load({id: item.id})
    },
    handleClickHide() {
      this.timePop = false
    },
    handleClickEnlarge() {
      this.settings.loaderSettings.ajaxSettings.queryData.pageSize = 10
      console.log(this.bigSettings.loaderSettings.ajaxSettings.queryData.pageSize, this.curGraphId, '-------')
      this.bigGraph = new PdSDKDcGraph(this.bigSettings)
      this.bigGraph.load({id: this.curGraphId ? this.curGraphId : 9661})
      this.isGraphPopover = true
    },
    handleCloseGraph() {
      // const bigGraphDom = this.$refs.bigGraph
      // this.$refs.atlasImg.appendChild(this.$refs.spaGraph)
      // setTimeout(() => {
      //   this.graph.netChart.resetLayout(true)
      // }, 1000)
      this.isGraphPopover = false;
      this.isFullScreenImg = false;
      this.isBarShow = false;

    },
    handleClickBarChart() {
      this.isBarShow = true;
      this.getEchartData()
    },
    getEchartData() {
      const chart = this.$refs.chart
      if (chart) {
        const myChart = echarts.init(chart, 'dark')
        const options = {
          title: {
            text: '',
            subtext: '',
            left: 'center'
          },
          itemStyle: {
            borderRadius: 5
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          label: {
            show: false
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
          },
          series: [
            {
              name: '',
              type: 'pie',
              center: ['50%', '50%'],
              radius:  [20, 200],
              roseType: 'area',
              itemStyle: {
                borderRadius: 5
              },
              data: this.presentations
            }
          ]
        };
        // const option = {...}
        myChart.setOption(options)
        setTimeout(function () {
          // window.onresize = function () {
          myChart.resize();
          console.log(chart.height, 'height')
          // }
        }, 200)
        window.addEventListener("resize", function () {
          myChart.resize()
        })
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener("resize", function () {
          myChart.resize();
        });
      })
    },

  }
}
</script>


<style lang="less" >
@import "~@plantdata/sdk/src/sdk/index";
@import "~@zc/netchart/netchart";

.plantdata-ns .pdvis-legend .pdvis-legend-item {
  color: #ffffff !important;
}
.plandata .plantdata-ns .pd-panel-main > .pd-panel-tabs {
  border: 0 !important;
}
</style>
<style scoped lang="scss">
@import "common/style/common.scss";

.spa-graph {
  width: 100%;
  height: 100%;
  //background: #0b153a;
  background: rgba(0,0,0,0);
}

.scroll-pop {
  max-height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll($bg: rgba(0, 130, 255, 0.2), $thumb: #0082ff, $btn: #999, $size: 8px);
  li{
    cursor: pointer;
  }
}

.scroll-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll($bg: rgba(0, 130, 255, 0.2), $thumb: #0082ff, $btn: #999, $size: 8px);
}

.cockpit-warapper {
  width: 100%;
  height: 100%;
  position: relative;

  .time-axis-scroll {
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    @include scroll($bg: rgba(0, 130, 255, 0.2), $thumb: #0082ff, $btn: #999, $size: 8px);
  }

  .home-back {
    z-index: 9;
    cursor: pointer;
    position: absolute;
    left: 35px;
    top: 22px;
    width: 136px;
    height: 58px;
    background: url("../static/back-img.png");
    background-size: 100% 100%;
  }

  .cockpit-cont {
    pointer-events: none;
    display: flex;
    height: calc(100% - 195px);
    width: 100%;
    border-bottom: 1px solid #3db8ff;
    position: relative;
    overflow: hidden;

    .detail-title {
      width: 60%;
      height: 94px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      position: absolute;
      //top: 40px;
      background: url("../static/LOGO_BG.svg") no-repeat;
      background-size: 100%;
      margin-left: 20%;

      .detail-title-bg {
        width: 938px;
        height: 73px;
        position: absolute;
        top: 0;

      }

      span {
        font-size: 38px;
        font-weight: 400;
        color: #06F3FF;
        position: absolute;
        height: 73px;
        width: 938px;
        top: 16px;
        text-align: center;
      }

    }

    .cockpit-info {
      width: 380px;
      height: calc(100% - 94px);
      //height: 812px;
      //padding-top: 113px;
      margin-right: 30px;
      z-index: 2;
      pointer-events: auto;
      position: absolute;
      left: 0;
      transform: translateX(0);
      transition: 1s;
      top: 94px;

      .label-l-act-img {
        background: url("../static/left-lab-act-icon.png") no-repeat;
        background-size: 100% 100%;
      }

      .label-l-img {
        background: url("../static/left-lab-icon.png") no-repeat;
        background-size: 100% 100%;
      }

      .cockpit-left-label {
        width: 32px;
        height: 38px;
        position: absolute;
        left: 379px;
        cursor: pointer;
      }

      .data-presentation {
        height: 182px;
        background: url("../static/presentationBg.png") no-repeat;
        background-size: 100% 100%;
        position: relative;

        .enlarge-icon {
          cursor: pointer;
          position: absolute;
          right: 20px;
          top: 20px;

          img {
            width: 14px;
            height: 14px;
          }
        }

        .presentation {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
          padding-top: 10px;

          div {
            flex-direction: column;
            width: 129px;
            margin: 10px;
            text-align: center;

            span:nth-child(1) {
              font-size: 18px;
              font-weight: 400;
              color: #ffffff;
            }

            span:nth-child(2) {
              font-size: 24px;
              font-weight: 400;
              color: #06f3ff;
            }
          }
        }
      }

      .data-search {
        width: 380px;
        margin: 10px 0 04px 0;
        height: 40px;
        background: rgba(11, 21, 58, 0.95);
        border: 1px solid #3db8ff;
        box-shadow: 0px 0px 5px #3db8ff;

        .search-case {
          width: 320px;
          height: 40px;

          .input {
            width: 290px;
            height: 40px;
            background: transparent;
            border: none;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            text-indent: 10px;
          }

          .close-img {
            width: 30px;
            border-left: 1px solid #fff;
            cursor: pointer;

            img {
              width: 16px;
              height: 16px;
            }
          }
        }

        .search-btn {
          width: 60px;
          height: 40px;
          background: #0082ff;
          cursor: pointer;

          img {
            width: 20px;
            height: 20px;
          }
        }
      }

      .datasearch-list {
        width: 380px;
        height: calc(100% - 260px);
        border: 1px solid #3db8ff;
        box-shadow: 0px 0px 10px #3db8ff;
        background: rgba(11, 21, 58, 0.6);

        .empty {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          height: 100%;
          opacity: 0.5;
        }

        .list {
          //background: rgba(11, 21, 58, 0.95);

          li:hover {
            background: rgba(233, 255, 254, 0.1);
          }

          li {
            display: flex;
            align-items: center;
            color: #ffffff;
            margin: 10px;
            cursor: pointer;

            .li-info {
              padding: 20px 21px 20px 20px;
              width: 100%;

              .li-title {
                font-size: 24px;
                font-weight: 400;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #06f3ff;

                .index {
                }
              }

              .li-cont {
                font-size: 18px;
                font-weight: 400;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-top: 15px;
              }

              .other {

                //color: #7CA1D2;
              }

              .li-time {
                margin-top: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                p {
                  span:nth-child(1) {
                    padding: 3px 6px;
                    background: rgba(6, 243, 255, 0);
                    border: 1px solid #06F3FF;
                    border-radius: 4px;

                  }

                  span:nth-child(2) {
                    font-size: 18px;
                    font-weight: 400;
                    color: #FFFFFF;
                    opacity: 0.8;
                    margin-left: 20px;

                  }

                }

                .detail-text {
                  font-size: 18px;
                  font-weight: bold;
                  color: #06F3FF;
                }

              }
            }
          }
        }
      }
    }

    .cockpit-detail {
      //margin-top: 21px;
      width: calc(100% - 820px);
      text-align: center;
      position: relative;
      left: 410px;
      top: 94px;
      height: calc(100% - 94px);
      padding-bottom: 20px;

      .detail-show {
        width: 100%;
        //height: 660px;
        height: 100%;
        background: rgba(11, 21, 58, 0.95);
        border: 1px solid #3db8ff;
        border-radius: 12px;
        display: flex;
        //margin-top: 40px;
        box-shadow: 0px 0px 10px #3db8ff;
        z-index: 9999;

        .detail-info {
          //width: 731px;
          //height: 660px;

          .detail-const {
            padding: 0 0 0 20px;
            height: 100%;

            .detail-padd {
              padding: 0 10px 0 0;
              width: 731px;

              .detail-header {
                margin-top: 20px;
                display: flex;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                color: #06f3ff;
                line-height: 14px;
                margin-bottom: 25px;
              }

              .detail-carousel {
                display: flex;
                align-items: center;
                margin-bottom: 39px;

                .prev {
                  background: url("../static/prev.png") no-repeat;
                  background-size: 100% 100%;
                  margin-right: 21px;
                }

                .prev:hover {
                  background: url("../static/prev-act.png") no-repeat;
                  background-size: 100% 100%;
                }

                .next {
                  background: url("../static/next.png") no-repeat;
                  background-size: 100% 100%;
                  margin-left: 21px;
                }

                .next:hover {
                  background: url("../static/next-act.png") no-repeat;
                  background-size: 100% 100%;
                  margin-left: 21px;
                }

                .arrow {
                  width: 26px;
                  height: 26px;
                  cursor: pointer;
                }

                .carousel-img {
                  width: 585px;
                  overflow: hidden;

                  .carouse_item {
                    width: 100%;
                    display: flex;
                    margin: 2px 0 0 2px;
                    transition: 1s;
                    cursor: pointer;
                  }

                  .carouse_item-img {
                    width: 200px;
                  }

                  img {
                    width: 180px;
                    height: 135px;
                    border-radius: 20px;
                    margin-right: 20px;
                    box-shadow: 0px 0px 5px #fff;
                  }
                }
              }

              .detail-word {
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;


                div {
                  display: flex;
                  align-items: center;
                  color: #ffffff;

                  span {
                    margin-right: 20px;
                  }
                }

                .tp {
                  font-size: 16px;
                  font-weight: 600;
                }

                p {
                  color: #ffffff;
                  display: flex;
                  flex-wrap: wrap;
                  flex-direction: column;


                  span {
                    margin-right: 20px;
                    text-align: left;
                    color: #ffffff;
                    margin-top: 10px;
                  }

                  span:nth-child(2) {
                    text-indent: 20px;
                    font-size: 18px;
                  }
                }
              }
            }
          }
        }

        .relation-info {
          border-left: 1px solid #3db8ff;
          padding: 13px 0 0 20px;
          position: relative;

          h3 {
            height: 15px;
            font-size: 14px;
            font-weight: 400;
            color: #06f3ff;
            position: absolute;
            top: 25px;
          }

          img {
            width: 16px;
            height: 16px;
            position: absolute;
            right: 10px;
            cursor: pointer;
          }

          .relation-text {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 40px;

            span {
              margin: 10px 10px 10px 0;
              padding: 8px 14px;
              background: rgba(6, 243, 255, 0);
              border: 1px solid #06f3ff;
              border-radius: 4px;
              font-size: 16px;
              font-weight: 400;
              color: #06f3ff;

            }

            span:hover {
              background: #06f3ff;
              color: #ffffff;
              cursor: pointer;
            }
          }
        }
      }
    }

    .cockpit-graph {
      width: 380px;
      height: calc(100% - 94px - 20px);
      //height: 870px;
      //padding-top: 113px;
      position: absolute;
      right: 0;
      transform: translateX(100%);
      transition: 1s;
      pointer-events: auto;
      top: 94px;

      .cockpit-label {
        width: 32px;
        height: 38px;
        position: absolute;
        left: -31px;
        cursor: pointer;

      }


      .label-act-img {
        background: url("../static/close-icon.png") no-repeat;
        background-size: 100% 100%;
      }

      .label-img {
        background: url("../static/open-icon.png") no-repeat;
        background-size: 100% 100%;
      }

      .cockpit-r-cont {
        position: absolute;
        width: 380px;
        height: 100%;
        //background: #0b153a;
        border: 1px solid #3db8ff;
        box-shadow: 0px 0px 10px #3db8ff;
        background: rgba(11,21,58,0.6);

        .title {
          border-left: #06f3ff 4px solid;
          //margin-top: 14px;
          text-indent: 10px;
          //margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #06f3ff;
          font-weight: bold;
          font-size: 16px;

          span:nth-child(1) {
            font-size: 16px;
            font-weight: bold;
            color: #06f3ff;

          }

          span:nth-child(2) {
            cursor: pointer;

            img {
              width: 14px;
              height: 14px;
            }
          }
        }

        .plandata {
          width: 100%;
          height: 388px;
          border-bottom: 1px solid #012657;
          padding: 20px;
          padding-bottom: 0;

          .atlas-img {
            width: 332px;
            height: calc(100% - 24px);
            overflow: hidden;
            opacity: 0;
            .pd-panel-tabs{
              border: 0 !important;
            }
          }

        }

        .events-list {
          height: calc(100% - 388px);
          padding-left: 20px;
          padding-top: 12px;

          .content-hidden {
            height: calc(100% - 24px);
            overflow: hidden;
            padding-top: 12px;

            .event-list-info {
              li {
                width: 340px;
                height: 38px;
                line-height: 38px;
                text-indent: 12px;
                font-size: 18px;
                font-weight: 400;
                color: #ffffff;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              li:nth-child(2n+1) {
                background: #012657;
              }
            }
          }


        }
      }
    }

    .act-sign {
      background: url("../static/location-one.png") no-repeat;
      background-size: 100% 100%;
    }

    .act-sign-text {
      color: #06f3ff;
    }

    .sign {
      background: url("../static/location.png") no-repeat;
      background-size: 100% 100%;
    }

    .numlocation {
      color: #06f3ff;
    }

    .location {
      width: 22px;
      height: 31px;
      font-size: 12px;
      font-weight: bold;
      color: #ffffff;
      margin-right: 6px;
      text-align: center;

      span {
        display: block;
        line-height: 22px;
      }
    }
  }

  .cock-pop {
    position: relative;
    height: 45px;
    width: 100%;
    top: 0;

    .time-cont {
      position: absolute;
      top: -35px;
      display: flex;

      .time-text {
        display: flex;
        align-items: center;
        flex-direction: column;
        flex: 1;

        .time-spot {
          text-align: center;
          align-items: center;
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }

        .time-spot-active {
          text-align: center;
          align-items: center;
          display: flex;
          flex-direction: column;

          p:nth-child(2) {
            cursor: pointer;
          }

        }
      }
    }
  }

  .time-pop-box {
    position: absolute;
    left: calc(50% - 240px);
    bottom: 196px;
    width: 480px;
    background: rgba(11, 21, 58, 0.9);
    border: 1px solid #3DB8FF;
    border-radius: 12px;
    -webkit-box-shadow: 0px 0px 10px #3db8ff;
    box-shadow: 0px 0px 10px #3db8ff;

    .sm-shrink {
      position: absolute;
      top: 10px;
      right: 12px;
      width: 14px;
      height: 9px;
      background: url("../static/shrink.png") no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }

    .t-pop-cont {
    }

    .pop-border-triangle {
      position: absolute;
      bottom: 0;
    }

    ul {
      padding: 20px;

      li {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 400;
        color: #FFFFFF;
      }

      li:last-child {
        margin-bottom: 0

      }
    }
  }

  .cockpit-time-axis-cont {
    width: 100%;
    height: 195px;
    padding-top: 48px;
    box-shadow: 0px 0px 10px #3db8ff;
    background: #01183E;

    .positon-time-line {
      position: relative;
      height: 45px;
      width: 100%;
      top: 0;

      .time-cont-active {
      }

      .time-cont {
        position: absolute;
        top: -44px;
        //display: flex;

        .time-text {
          //display: flex;
          align-items: center;
          float: left;
          //flex-direction: column;
          //flex: 1;

          .time-spot {
            text-align: center;
            align-items: center;
            display: flex;
            flex-direction: column;
            margin-top: 5px;
          }

          .time-spot-active {
            text-align: center;
            align-items: center;
            display: flex;
            flex-direction: column;

            p:nth-child(2) {
              cursor: pointer;
            }

          }
        }

        .campus {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }

        .campus-active {
          font-size: 16px;
          font-weight: bold;
          color: #06f3ff;
        }

        .campus-icon {
          width: 12px;
          height: 12px;
          background: url("../static/circle.png") no-repeat;
          background-size: 100% 100%;
        }

        .campus-active-icon {
          width: 20px;
          height: 20px;
          background: url("../static/circle-act.png") no-repeat;
          background-size: 100% 100%;
          z-index: 1;
        }

        .prominent {
          margin: 5px 20px;
          //background: #0082ff;
          border-radius: 20px;
          cursor: pointer;
          background: rgba(0,130,255,.8);

        }

        .prominent-text {
          padding: 20px;
          width: 180px;
          //opacity: 0.5;
          text-align: center;

          h4 {
            font-size: 16px;
            font-weight: bold;
            color: #f8f8f8;
          }

          p {
            font-size: 16px;
            font-weight: bold;
            color: #f8f8f8;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .prominent-active-text {
          padding: 19px 8px 20px 15px;

          p {
            text-align: center;
            width: 458px;
            font-size: 20px;
            font-weight: 400;
            color: #f8f8f8;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          }
        }
      }

      .time-line {
        position: absolute;
        width: 100%;
        height: 2px;
        top: 34px;
        background: #dddddd;
      }
    }
  }

  .default-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .XSDFXPage {
    width: 100%;
    height: calc(100% - 8px);
    position: absolute;
    top: 0;
    left: 0;
  }

  .XSDFXPage-map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    z-index: 1;
    border-radius: 12px;
  }

  .statistic-fullScreen {

    .statistic-box {
      width: 60%;
      height: 80%;
      position: relative;
      background: #0B153A;
      box-shadow: 0px 0px 10px #3db8ff;
      overflow: hidden;
      border-radius: 10px;

      .close-icon {
        z-index: 3;
        cursor: pointer;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 20px;
        top: 30px;
      }

      .statistic-bar-chart {
        width: 100%;
        height: 100%;
      }
    }

  }

  .image-fullScreen {
    .imagefull-box {
      width: 60%;
      height: 60%;
      position: relative;
      background: #0B153A;
      box-shadow: 0px 0px 10px #3db8ff;
      overflow: hidden;
      border-radius: 10px;

      .close-icon {
        z-index: 3;
        cursor: pointer;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 20px;
        top: 30px;
      }

      .carousel-images {
        width: 100%;
        height: 100%;
      }
    }
  }

  .default-popover {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);

    .pop-content {
      width: 100%;
      height: 100%;
      position: relative;

      .big-graph {
        background: rgba(0, 0, 0, 0.7);

        width: 100%;
        height: 100%;
      }

      img {
        z-index: 2;
        cursor: pointer;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 20px;
        top: 30px;
      }
    }
  }

}

</style>
