<template>
  <div id="search">
    <!--  图谱放大弹框  -->
    <div class="default-popover" @click="isGraphPopover = false" v-show="isGraphPopover">
      <div class="pop-content">
        <img @click="isGraphPopover = false" src="../static/close.png"/>
        <div ref="bigGraph" class="big-graph">
        </div>
      </div>
    </div>

      <div class="returnBtn" v-if="contentType == 'content'" @click="returnList()">
        返回
      </div>
      <div class="top" v-if="contentType == 'search'">
        <div class="left" @click="returnList()">
          返回
        </div>
        <div class="search">
          <input type="text" v-model="key" placeholder="请输入搜索内容">
          <div class="right" @click="search">搜索</div>
        </div>
      </div>
      <ul class="topNav" v-if="contentType == 'search'">
        <li v-for="(item,index) in navList" :key="index" :class="{on:index == navIndex}" @click="navClick(index)">
          {{item}}
        </li>
      </ul>
      <div class="content" v-if="navIndex == 0" :class="{'on':contentType == 'content'}">
        <div class="leftList" v-if="contentType == 'search'">
          <ul class="enentList">
                <li v-for="(event,index) in eventList" :key="index" @click="clickEvent(event)">
                  <!-- <img :src="event.url" alt=""> -->
                  <div class="rightContent">
                    <h4 class="overflowPoint">{{event.name}}</h4>
                    <!-- <span class="overflowMorePoint">{{event.desc}}</span> -->
                    <span class="overflowMorePoint" v-html="event.desc"></span>
                    <div class="bottom">
                      <ul class="bottomLeft">
                        <li v-for="(item,indext) in event.other" :key="indext">{{item}}</li>
                      </ul>
                      <div class="position overflowPoint" :title="event.position">{{event.position}}</div>
                      <div class="time">{{event.date.substr(0,10)}}</div>
                    </div>
                  </div>
                </li>
              </ul>
          <!-- <ul class="leftList">
            <li v-if="releventEventList.length == 0">暂无数据</li>
            <li class="overflowPoint" v-for="(item,index) in releventEventList" :key="index" :class="{on:index == eventIndex}"
                :title="item.name"
                @click="eventClick(index,item)">
              {{index+1}}.{{item.name}}
            </li>
          </ul> -->
        </div>
        <div class="center" v-if="contentType == 'search'">
          <div class="centerTop" @click="contentType = 'content'">
            <h4 class="overflowPoint">{{event.name}}</h4>
            <span>{{event.desc}}</span>
          </div>
          <div class="centerContent">
              <!-- <ul class="leftListC">
            <li v-if="showReleventEventList.length == 0">暂无数据</li>
            <li class="overflowPoint" v-for="(item,index) in showReleventEventList" :key="index" :class="{on:index == eventIndex}"
                :title="item.name"
                @click="eventClick(index,item)">
              {{index+1}}.{{item.name}}
            </li> -->
            <ul class="enentList">
                <li v-for="(event,index) in showReleventEventList" :key="index" >
                  <img :src="event.url?event.url:noData" alt="" />
                  <div class="rightContent">
                    <h4 class="overflowPoint" @click="clickEvent(event)">{{event.title}}</h4>
                    <!-- <span class="overflowMorePoint">{{event.desc}}</span> -->
                    <span class="overflowMorePoint" v-html="event.desc" @click="eventClick(index,event)"></span>
                    <div class="bottom">
                      <ul class="bottomLeft" v-if="event.other && event.other.length">
                        <li v-for="(item,indext) in event.other" :key="indext">{{item}}</li>
                      </ul>
                      <div class="position overflowPoint" v-if="event.position" :title="event.position">{{event.position}}</div>
                      <div class="time">{{event.time.substr(0,10)}}</div>
                    </div>
                  </div>
                </li>
              </ul>
          <!-- </ul> -->
              <div class="pageBottom">
                <el-pagination
                  @current-change="handleSizeChange"
                  :page-size="10"
                  :current-page="currentPage"
                  layout="prev, pager, next"
                  :total="this.total"
                >
                </el-pagination>
              </div>
          </div>
        </div>

        <div class="leftImgList"  v-if="contentType == 'content'">
          <ul class="leftImgList">
            <li v-for="(item,index) in eventRelevantImg" :key="index">
              <img :src="window.configure.baseUrl + item.path" alt="">
            </li>
          </ul>
        </div>
        <div class="detailCenter" v-if="contentType == 'content'">
          <ul class="topNav detailCenterNav">
            <li v-for="(item,index) in detailNavList" :key="index" :class="{on:index == detailNavIndex}" @click="detailNavClick(index)">
              {{item}}
            </li>
          </ul>
          <div class="detailContent">
            <h4 class="overflowPoint">{{event.name}}</h4>
            <div class="timePos">
              <span>时间：{{event.date ? event.date.substr(0,10) : '未知'}}</span>
              <span>地点：{{event.position?event.position:'未知'}}</span>
            </div>
            <div class="contenStyle">
              <div class="title" v-if="detailNavIndex==0">简介：</div>
              <!-- <span v-if="detailNavIndex==0">{{event.desc}}</span> -->
              <span v-if="detailNavIndex==0" v-html="event.desc"></span>
              <span v-if="detailNavIndex==1" v-html="event.originalText?event.originalText:event.desc"></span>
            </div>
            <div class="contenStyle">
              <div class="title" v-if="detailNavIndex==0 && event.cause">起因：</div>
              <span>{{event.cause}}</span>
            </div>
            <div class="contenStyle">
              <div class="title" v-if="detailNavIndex==0 && event.after">经过：</div>
              <span>{{event.after}}</span>
            </div>
            <div class="contenStyle">
              <div class="title" v-if="detailNavIndex==0 && event.result">结果：</div>
              <span>{{event.result}}</span>
            </div>
          </div>
        </div>
        <div class="contentRight">
          <div class="topTypeList">
            <div class="topTitle">关联实体（{{entityList.length}}）</div>
            <div class="ulList">
              <ul>
                <li class="overflowPoint" v-for="(item,index) in entityList" :key="index" @click="setEntity(item)" :class="{'on':entity == item}">
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
          <div class="imgSearch">
            <h4 class="title"><span>知识图谱</span><span @click="handleClickEnlarge()"><img
              src="../static/zoom-icon.png"></span></h4>
            <div class="imgSearchPd"></div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import qs from 'qs'
import {PdSDKDcGraph} from "@plantdata/sdk/src/sdk/netchart/graph/dcgraph";
import noData from "../static/noData.png"

export default {
  filters: {},
  data() {
    return {
      window:window,
      key: this.$route.params.key?this.$route.params.key:'',
      navIndex: 0,
      navList: ['相关事件'],
      detailNavIndex: 0,
      detailNavList: ['查看详情','查看原文'],
      eventIndex: 0,
      releventEventList:[],
      showReleventEventList: [],
      eventList: [],
      event: {},
      entityList:[],
      total: 0,
      currentPage: 1,
      entity:'',
      noData: noData,
      contentType:'search',//search content
      eventRelevantImg: [],
      curGraphId: '',
      isGraphPopover: false,
      settings: {
        selector: '.imgSearchPd', // 选择器的名字
        kgName: window.kgName, // 图谱kgName,这里只是举了个例子
        ajaxSettings: {
          baseUrl: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/`,
          headers: {
            APK: '445a793dd0314abd875b7980d7ffbbd6' // 同理
          }
        },
        dcOverview: {
          enable: false,
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
              isRelationMerge: true,
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
              isRelationMerge: true,
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
      bigGraph: ''
    };
  },
  created() {
  },
  mounted() {
    console.log(this.window.kgName);
    if(this.key){
      this.getSearch();
    }
    this.graph = new PdSDKDcGraph(this.settings)
  },
  methods: {
    search(){
      this.getSearch();
    },
    handleClickEnlarge() {
      this.settings.loaderSettings.ajaxSettings.queryData.pageSize = 10
      console.log(this.bigSettings.loaderSettings.ajaxSettings.queryData.pageSize, this.curGraphId, '-------')
      this.bigGraph = new PdSDKDcGraph(this.bigSettings)
      this.bigGraph.load({id: this.curGraphId ? this.curGraphId : 9661})
      this.isGraphPopover = true
    },
    navClick(index){
      this.navIndex = index;
    },
    detailNavClick(index){
      this.detailNavIndex = index;
    },
    eventClick(index,item){
      this.eventIndex = index;
      this.getEventDetail(item);
    },
    handleSizeChange(page){
      this.currentPage = page;
      this.setReleventEventList();
    },
    setEntity(item){
      console.log(item);
      // this.key = item.name;
      // this.search();
      this.entity = item;
      this.curGraphId = item.id;
      this.graph.load({id:item.id})
    },
    clickEvent(event){
      this.event = event;
      console.log(event);
      this.contentType = 'content';
      this.getRelevantImg(event);
    },
    returnList(){
      if(this.contentType == 'content'){
        this.contentType = "search"
      }else{
        this.$router.push('list')
      }
    },
    getSearch(){
      // this.$http({
      //   method: 'post',
      //   url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/graph/prompt?p=api&kgName=${this.window.kgName}`,
      //   headers: {
      //     APK: '445a793dd0314abd875b7980d7ffbbd6',
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   data: qs.stringify({'kw': this.key,'isFuzzy': true})
      // }).then((res) => {
      //   if (res.data.ErrorCode === 0) {
      //     this.releventEventList = res.data.data;
      //     this.entityList = [];
      //     for(let i in this.releventEventList){
      //       if(this.releventEventList[i].type == 1){
      //         this.entityList.push(this.releventEventList[i].name);
      //       }
      //     }
      //     if(this.releventEventList.length>0){
      //       this.getEventDetail(this.releventEventList[0]);
      //     }
      //   }
      // })

      let data = {
        kw: this.key,
        docTypeList: ["军事图谱"],
        pageSize: 1000
      }

      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/api/kgsearch/sdk/simplekw`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
      }).then((res) => {
        if (res.data.errCode === 200) {
          this.releventEventList = [];
          for(let i in res.data.data.rsData){
            this.releventEventList.push({
              ...res.data.data.rsData[i].sourceAsMap
            });
          }
          this.total = res.data.data.rsCount;
          this.setReleventEventList();
          this.getEventDetail(this.releventEventList[0]);
        }
      })
    },
    setReleventEventList(){
      this.showReleventEventList = [];
      for(let i in this.releventEventList){
        if(i>=(this.currentPage-1) * 10 && i<this.currentPage * 10){
           this.showReleventEventList.push(this.releventEventList[i])
        }
      }
    },
    //批量知识卡片
    getMoreEvent(){
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/infobox/more?p=api&kgName=${this.window.kgName}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({ids: this.ids})
      }).then((res) => {
        console.log(res)
        let relEventList = [];
        if (res.data.data && res.data.data.length) {
          for(let j in res.data.data){
              let event = {
                name:res.data.data[j].self.name,
                url: res.data.data[j].self.img?res.data.data.self.img:'',
                id: res.data.data[j].self.id,
                classId: res.data.data[j].self.classId,
                date:'',
                position:'',
                desc:'',
                cause:'',
                after:'',
                result:'',
                relevant:res.data.data[j].self.multiModals
              };
              for(let i in res.data.data[j].self.extra){
                if(res.data.data[j].self.extra[i].k == '开始时间'){
                  event.date = res.data.data[j].self.extra[i].v;
                }
                if(res.data.data[j].self.extra[i].k == 'gis地址'){
                  event.position = res.data.data[j].self.extra[i].v;
                }
                if(res.data.data[j].self.extra[i].k == '简介'){
                  event.desc = res.data.data[j].self.extra[i].v;
                }
                if(!event.desc && res.data.data[j].self.extra[i].k == '译文'){
                  event.desc = res.data.data[j].self.extra[i].v.replace(/<br\/>/g,'');
                  event.desc = event.desc.replace(/<br>/g,'');
                  this.entityList.forEach(item => {
                    event.desc = event.desc.replace(new RegExp(item.name,'g'),`<heightLight class="heightLight">${item.name}</heightLight>`)
                  });
                }
                if(res.data.data[j].self.extra[i].k == '事件起因'){
                  event.cause = res.data.data[j].self.extra[i].v;
                }
                if(res.data.data[j].self.extra[i].k == '事件经过'){
                  event.after = res.data.data[j].self.extra[i].v;
                }
                if(res.data.data[j].self.extra[i].k == '事件结果、影响、损失等'){
                  event.result = res.data.data[j].self.extra[i].v;
                }
            }
            relEventList.push(event)
          }
        }

        this.eventList = relEventList;
        console.log(this.eventList);
      })
    },
    //相关事件
    // getEntityNum(event,index){
    //   this.$http({
    //     method: 'POST',
    //     url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/graph/data/entity?p=api&kgName=${this.window.kgName}`,
    //     headers: {
    //       APK: '445a793dd0314abd875b7980d7ffbbd6',
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     data: qs.stringify({'conceptId': event.classId})
    //   }).then((res) => {
    //     this.eventList = [];
    //     if(res.data.data && res.data.data.length){
    //         for(let i in res.data.data){
    //           let event = {
    //             id: res.data.data[i].id,
    //             name:res.data.data[i].name,
    //             url: res.data.data[i].imageUrl,
    //             classId: res.data.data[i].conceptId,
    //             date: res.data.data[i].attributes[17],
    //             position: res.data.data[i].attributes[1],
    //             desc: res.data.data[i].abs?res.data.data[i].abs:res.data.data[i].attributes[82],
    //             cause: res.data.data[i].attributes[23],
    //             after: res.data.data[i].attributes[27],
    //             result: res.data.data[i].attributes[28],
    //             originalText: res.data.data[i].attributes[69]
    //           };
    //           this.eventList.push(event);
    //         }
    //     }
    //   })
    // },
    getEventDetail(event){
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/infobox?p=api&kgName=${this.window.kgName}`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({'id': event.id})
      }).then((res) => {
        if (res.data.ErrorCode === 0) {
          let event = {
            name:res.data.data.self.name,
            url: res.data.data.self.img?res.data.data.self.img:'',
            id: res.data.data.self.id,
            classId: res.data.data.self.classId,
            date:'',
            position:'',
            desc:'',
            cause:'',
            after:'',
            result:'',
            relevant:res.data.data.self.multiModals
          };
          for(let i in res.data.data.self.extra){
            if(res.data.data.self.extra[i].k == '开始时间'){
              event.date = res.data.data.self.extra[i].v;
            }
            if(res.data.data.self.extra[i].k == 'gis地址'){
              event.position = res.data.data.self.extra[i].v;
            }
            if(res.data.data.self.extra[i].k == '简介'){
              event.desc = res.data.data.self.extra[i].v;
            }
            if(!event.desc && res.data.data.self.extra[i].k == '译文'){
              event.desc = res.data.data.self.extra[i].v.replace('<br/>','');
              console.log(res.data.data.self.extra[i].v.replace('<br/>',''));
            }
            if(res.data.data.self.extra[i].k == '事件起因'){
              event.cause = res.data.data.self.extra[i].v;
            }
            if(res.data.data.self.extra[i].k == '事件经过'){
              event.after = res.data.data.self.extra[i].v;
            }
            if(res.data.data.self.extra[i].k == '事件结果、影响、损失等'){
              event.result = res.data.data.self.extra[i].v;
            }
          }
          this.event = event;
          // this.eventList.push(this.event);
          // this.getEntityNum(event);
          this.getGraph(event);
          this.graph.load({id: event.id})
          this.getRelevantImg(event);
        }
      })
    },
    setIds(){
      this.ids = [];
      let idsList = [];
      for(let i in this.entityList){
        if(this.entityList[i].conceptId == 5){
           idsList.push(this.entityList[i].id)
        }
      }
      this.ids = idsList;
      // for(let i in idsList){
      //   if(i>=(this.currentPage-1) * 10 && i<=this.currentPage * 10){
      //      this.ids.push(idsList[i])
      //   }
      // }
      console.log(this.ids);
      this.getMoreEvent();
    },
    //相关实体
    getGraph(eventDet) {
      this.curGraphId = eventDet.id;
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/graph?kgName=${this.window.kgName}&p=api`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({
          'id': eventDet.id,
          isRelationMerge: true
          })
      }).then((res) => {
        if (res.status === 200) {
          this.entityList = res.data.data.entityList;
          // this.graph.load({id:this.entityList[0].id})
          // this.total = this.entityList.length - 1;
          this.entity = this.entityList[0];
          this.releventEventList.forEach( event => {
            event.desc = event.desc.replace(/<br\/>/g,'');
            event.desc = event.desc.replace(/<br>/g,'');
            this.entityList.forEach(item => {
              event.desc = event.desc.replace(new RegExp(item.name,'g'),`<heightLight class="heightLight">${item.name}</heightLight>`)
            });
          })
          this.setIds();
        }
      })
    },
    //相关图片
    getRelevantImg(event) {
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/infobox/multi/modal?kgName=${this.window.kgName}&p=api`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          APK: '445a793dd0314abd875b7980d7ffbbd6'
        },
        data: qs.stringify({'id': event.id})
      }).then((res) => {
        console.log(res)
        if (res.status === 200) {
            this.eventRelevantImg = res.data.data.multiModals;
          // this.eventRelevantImg = this.event.relevant;
            console.log(this.event);
        }
      })
    },
  },
};
</script>
<style scoped lang="scss">
#search {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #084550, #021829);
  padding: 20px;
  .default-popover {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
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
        >>> .pd-panel-float{
          display: none;
        }
        >>> .pd-panel-tabs{
          display: none;
        }
        >>> svg{
            height: 900px;
          }
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
  >>> .heightLight{
      color: #06F3FF;
      display: contents;
    }
  .returnBtn{
      text-align: center;
      line-height: 48px;
      float: left;
      color: #06F3FF;
      border-radius: 8px;
      padding: 0 20px;
      width: 120px;
      border: 1px solid #06F3FF;
      cursor: pointer;
      position: fixed;
      top: 20px;
      left: 40px;
  }
  .top{
    height: 62px;
    padding: 0 20px;
    .left{
      text-align: center;
      line-height: 48px;
      float: left;
      color: #06F3FF;
      border-radius: 8px;
      padding: 0 20px;
      width: 120px;
      border: 1px solid #06F3FF;
      cursor: pointer;
    }
    .search{
      width: 40%;
      height: 62px;
      background: #043B50;
      border: 2px solid #00FFF6;
      border-radius: 8px;
      position: relative;
      color: rgba(255,255,255,.8);
      float: right;
      input{
        list-style: none;
        border: 0;
        width: calc(100% - 128px);
        height: 58px;
        line-height: 58px;
        background: #043B50;
        outline: none;
        border-radius: 8px;
        padding: 0 20px;
        color: rgba(255,255,255,.8);
        font-size: 18px;
        &::-webkit-input-placeholder {
          color: rgba(255,255,255,.8);
        }
      }
      .right{
        width: 128px;
        height: 58px;
        background: #006965;
        border-left: 2px solid #00FFF6;
        border-radius: 8px;
        float: right;
        text-align: center;
        line-height: 58px;
        box-sizing: border-box;
        overflow: hidden;
        font-size: 20px;
        cursor: pointer;
      }
      .outRight{
        width: 128px;
        height: 66px;
        position: absolute;
        text-align: center;
        line-height: 66px;
        font-size: 16px;
        top: 0;
        text-decoration: underline;
        right: -128px;
        color: #00FFF6;
        cursor: pointer;
      }

    }
  }
  .topNav{
    border-bottom: 1px solid #06F3FF;
    width: 100%;
    height: 52px;
    margin-top: 20px;
    li{
      width: 144px;
      height: 52px;
      background: rgba(6, 243, 255, 0.1);
      border: 1px solid #06F3FF;
      border-bottom: 0;
      border-radius: 8px 8px 0 0;
      margin-right: 20px;
      line-height: 52px;
      text-align: center;
      color: #06F3FF;
      font-size: 22px;
      cursor: pointer;
      float: left;
      &:first-child{
        margin-left: 60px;
      }
      &.on{
        color: #02141E;
        background: #06F3FF;
      }
    }
  }
  .content{
    height: calc(100% - 62px - 80px);
    padding-top: 20px;
    &.on{
      height: calc(100% - 20px);
    }
    .leftList{
      width: 390px;
      height: 100%;
      overflow-y: auto;
      float: left;
      &::-webkit-scrollbar-thumb {
        background: #006965;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-corner {
        background: rgba(0,130,255,0.2);
      }
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background: transparent;
      }
      .enentList{
          width: 100%;
          // height: calc(100% - 32px - 16px);
          // overflow-y: auto;
          // &::-webkit-scrollbar-thumb {
          //   background: #006965;
          //   border-radius: 10px;
          // }
          // &::-webkit-scrollbar-corner {
          //   background: rgba(0,130,255,0.2);
          // }
          // &::-webkit-scrollbar {
          //   width: 8px;
          //   height: 8px;
          //   background: transparent;
          // }
          //&
          >li{
            height: 270px;
            padding: 10px;
            cursor: pointer;
            img{
              display: block;
              width: 268px;
              height: 250px;
              float: left;
            }
            .rightContent{
              width: 100%;
              // width: calc(100% - 268px - 20px);
              float: right;
              h4{
                height: 38px;
                line-height: 38px;
                color: #06F3FF;
                font-size: 18px;
              }
              span{
                height: 178px;
                display: flex;
                color: #fff;
                line-height: 22px;
              }
              .overflowMorePoint{
                overflow:hidden;
                text-overflow:ellipsis;
                // width:200px; //指定宽度
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:8; //指定显示多少行
              }
              .bottom{
                height: 32px;
                line-height: 32px;
                color: #fff;
                .bottomLeft{
                  width: 240px;
                  float: left;
                  height: 32px;
                  li{
                    height: 32px;
                    width: 84px;
                    border: 1px solid #06F3FF;
                    float: left;
                    margin-right: 20px;
                    color: #06F3FF;
                    line-height: 32px;
                    text-align: center;
                  }
                }
                .time{
                  width: 86px;
                  float: right;
                  //margin-right: 20px;
                }
                .position{
                  width: calc(100% - 240px - 130px);
                  float: right;
                  text-align: right;
                }
              }
            }

          }
        }
      // .leftList{
      //   border: 1px solid #00FFF6;
      //   padding: 8px 30px 8px 8px;
      //   width: 390px;
      //   float: left;
      //   background: rgba(3, 34, 50, 0.95);
      //   li{
      //     height: 62px;
      //     font-size: 22px;
      //     line-height: 62px;
      //     color: #06F3FF;
      //     padding-left: 6px;
      //     cursor: pointer;
      //     &.on{
      //       background: rgba(233, 255, 254, .1);
      //       font-weight: bold;
      //     }
      //   }
      // }
    }
    .leftImgList{
      width: 340px;
      height: calc(100% - 90px);
      margin-top: 40px;
      float: left;
      overflow-y: auto;
      &::-webkit-scrollbar-thumb {
        background: #006965;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-corner {
        background: rgba(0,130,255,0.2);
      }
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background: transparent;
      }
      .leftImgList{
        width: 340px;
        height: 100%;
        float: left;
        margin-top: 0;
        li{
          width: 100%;
          height: 146px;
          padding: 0 40px;
          margin-top: 40px;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .detailCenter{
      width: calc(100% - 340px - 370px - 40px);
      padding: 0 20px;
      margin: 0 20px;
      float: left;
      height: 100%;
      border-left: 1px solid #006965;
      border-right: 1px solid #006965;
      .detailCenterNav{
        height: 38px;
        li{
          height: 38px;
          line-height: 38px;
          font-size: 18px;
        }
      }
      .detailContent{
        height: calc(100% - 58px);
        overflow-y: auto;
        &::-webkit-scrollbar-thumb {
          background: #006965;
          border-radius: 10px;
        }
        &::-webkit-scrollbar-corner {
          background: rgba(0,130,255,0.2);
        }
        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          background: transparent;
        }
        h4{
          color: #06F3FF;
          font-size: 24px;
          height: 60px;
          line-height: 80px;
          text-align: center;
        }
        .timePos{
          height: 28px;
          line-height: 28px;
          span{
            margin-right: 60px;
            color: #fff;
          }
        }
        .contenStyle{
          margin-top: 20px;
          .title{
            color: #06F3FF;
          }
          span{
            display: flex;
            text-indent: 2em;
            color: #fff;
          }
        }
      }
    }
    .center{
      width: calc(100% - 390px - 370px - 40px);
      float: left;
      margin: 0 20px;
      height: 100%;
      .centerTop{
        border: 1px solid #00FFF6;
        padding: 0 10px 10px;
        background: rgba(3, 34, 50, 0.95);
        height: 160px;
        cursor: pointer;
        h4{
          color: #06F3FF;
          font-size: 24px;
          line-height: 60px;
        }
        span{
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;  /*行数*/
          -webkit-box-orient: vertical;
        }
      }
      .centerContent{
        height: calc(100% - 160px - 20px);
        border: 1px solid #00FFF6;
        margin-top: 20px;
        padding-right: 4px;
        background: rgba(3,34,50,0.95);
        .leftListC{
        // border: 1px solid #00FFF6;
        // padding: 8px 30px 8px 8px;
        // width: 390px;
        // width: 100%;
        // float: left;
        // background: rgba(3, 34, 50, 0.95);
        height: calc(100% - 32px - 16px);
          overflow-y: auto;
          &::-webkit-scrollbar-thumb {
            background: #006965;
            border-radius: 10px;
          }
          &::-webkit-scrollbar-corner {
            background: rgba(0,130,255,0.2);
          }
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background: transparent;
          }
        li{
          height: 62px;
          font-size: 22px;
          line-height: 62px;
          color: #06F3FF;
          padding-left: 6px;
          cursor: pointer;
          &.on{
            background: rgba(233, 255, 254, .1);
            font-weight: bold;
          }
        }
      }
        .enentList{
          width: 100%;
          height: calc(100% - 32px - 16px);
          overflow-y: auto;
          &::-webkit-scrollbar-thumb {
            background: #006965;
            border-radius: 10px;
          }
          &::-webkit-scrollbar-corner {
            background: rgba(0,130,255,0.2);
          }
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background: transparent;
          }
          //&
          >li{
            height: 270px;
            padding: 10px;
            // cursor: pointer;
            img{
              display: block;
              width: 268px;
              height: 250px;
              float: left;
            }
            .rightContent{
              width: calc(100% - 268px - 20px);
              float: right;
              h4{
                height: 38px;
                line-height: 38px;
                color: #06F3FF;
                cursor: pointer;
                font-size: 18px;
              }
              span{
                height: 178px;
                display: flex;
                color: #fff;
                line-height: 22px;
              }
              .overflowMorePoint{
                overflow:hidden;
                text-overflow:ellipsis;
                // width:200px; //指定宽度
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:8; //指定显示多少行
                cursor: pointer;
              }
              .bottom{
                height: 32px;
                line-height: 32px;
                color: #fff;
                .bottomLeft{
                  width: 240px;
                  float: left;
                  height: 32px;
                  li{
                    height: 32px;
                    width: 84px;
                    border: 1px solid #06F3FF;
                    float: left;
                    margin-right: 20px;
                    color: #06F3FF;
                    line-height: 32px;
                    text-align: center;
                  }
                }
                .time{
                  width: 130px;
                  float: right;
                  //margin-right: 20px;
                }
                .position{
                  width: calc(100% - 240px - 130px);
                  float: right;
                  text-align: right;
                }
              }
            }

          }
        }
        .pageBottom{
          height: 32px;
          width: 100%;
          display: flex;
          margin-top: 16px;
          >>> .el-pagination{
            margin: 0 auto;
            button{
              background: rgba(0,255,246,0.15);
              border: 1px solid #00FFF6;
              border-radius: 4px;
              color: #00FFF6;
            }
            .el-pager li{
              background: rgba(0, 255, 246, 0.15);
              border: 1px solid #00FFF6;
              border-radius: 4px;
              color: #00FFF6;
              padding: 0;
              margin: 0 5px;
              &.active{
                background: #00FFF6;
                color: #003F42;
              }
            }
          }
        }
      }
    }
    .contentRight{
      width: 370px;
      float: right;
      height: 100%;
      .topTypeList{
        height: 250px;
        .topTitle{
          height: 38px;
          line-height: 38px;
          color: #06F3FF;
        }
        .ulList{
          width: 100%;
          height: calc(100% - 38px);
          overflow-y: auto;
          &::-webkit-scrollbar-thumb {
            background: #006965;
            border-radius: 10px;
          }
          &::-webkit-scrollbar-corner {
            background: rgba(0,130,255,0.2);
          }
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background: transparent;
          }
          ul{

            li{
              height: 28px;
              line-height: 28px;
              padding: 0 6px;
              margin: 10px 0;
              float: left;
              border: 1px solid #06F3FF;
              color: #06F3FF;
              margin-right: 20px;
              border-radius: 4px;
              cursor: pointer;
              max-width: 350px;
              &.on{
                color: #fff;
                border: 0;
                background: #06F3FF;
              }
            }
          }
        }
      }
      .imgSearch{
        height: calc(100% - 250px);
        // max-height: 500px;
        border: 1px solid #00FFF6;
        background: rgba(3,34,50,0.95);
        .title {
          //margin-top: 14px;
          text-indent: 10px;
          //margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #06f3ff;
          font-weight: bold;
          font-size: 16px;
          padding: 10px;

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
        .imgSearchPd{
          width: 100%;
          height: calc(100% - 40px);
          background: none;
          >>> .pd-panel-float-item{
            display: none;
          }
          >>> .plantdata-ns.pd-container{
            background: none;
          }
          >>> .pd-panel-tabs{
            display: none;
          }
          >>> svg{
            height: 442px;
          }
        }
      }
    }
  }
}


</style>
