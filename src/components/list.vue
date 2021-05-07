<template>
  <div class="list-container">
    <div class="wrapper">
      <div class="position-kfpt" @click="handleClickKfpt"></div>
      <div class="logo">
        <img src="../static/graphTiltle.png"/>
        <span>{{ window.configure.listTitle }}</span>
      </div>
      <div class="search">
          <input type="text" v-model="key" placeholder="请输入搜索内容">
          <div class="right" @click="search">搜索</div>
          <div class="outRight" @click="handleClickSpqrQl()">SpqrQl检索</div>
      </div>
      <div class="selectKgName">
        <el-select v-model="kgName" filterable placeholder="请选择图谱名称">
          <el-option
            v-for="item in kgNameArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectMap">
        <el-select v-model="mapName" filterable placeholder="请选择图谱名称">
          <el-option
            v-for="item in mapArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="contentList">
        <ul class="listBg">
          <li v-for="(item,index) in contentListData" :key="index">
            <div class="div1"></div>
            <div class="div2"></div>
            <div class="div3"></div>
            <div class="div4"></div>
            <p>{{item.name}}</p>
            <p>拥有实体数</p>
            <p class="num">{{item.num}}</p>
          </li>
        </ul>
      </div>
      <div class="constent">
        <ul class="listBg">
          <li v-for="(item,index) in listData" :key="index">
            <div class="grid-content bg-purple">
              <div
                :class="{
                  'movse-show': indx != index,
                  'movse-hide': 'index' == indx,
                }"
                class="mantle"
                @mouseover="indx = index"
                @mouseout="index = -1"
                @click="handleClick(item)"
              >
                {{ item.title }}
              </div>
              <img
                :class="{ 'act-img': indx == index, 'img': index != indx }"
                :src="item.image"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="footer">
        {{window.configure.footerTitle}}
      </div>
    </div>
  </div>
</template>
<script>
import qs from 'qs'

export default {
  filters: {},
  data() {
    return {
      window:window,
      indx: -1,
      indx1: -1,
      listData:[],
      key: '',
      contentListData:[],
      kgName: 'kgms_default_user_graph_178c4ad60df',
      kgNameArr: [
        {
          label:'驾驶舱应用',
          value:'kgms_default_user_graph_176e0853be8'
        },
        {
          label:'驾驶舱应用20210412',
          value:'kgms_default_user_graph_178c4a3c1c5'
        },
        {
          label:'驾驶舱应用new',
          value:'kgms_default_user_graph_178c4ad60df'
        },
      ],
      mapName: '经典',
      mapArr: [
        {
          label:'蓝色',
          value:'blue'
        },
        {
          label:'绿色',
          value:'green'
        },
        {
          label:'经典',
          value:'das'
        },
      ],
    };
  },
  created() {
  },
  watch: {
    kgName: {
      handler(newVal, oldVal){
        console.log(newVal);
        window.kgName = newVal;
        this.getconceptList();
      },
      deep: true
    }
  },
  mounted() {
    console.log(window,this.window);
    this.kgName = this.window.kgName;
    this.listData.push(window.settingData.listData[0][0])
    this.listData.push(...window.settingData.listData[1])
    console.log(this.listData);
    this.getconceptList();
    // this.getKgNameArr()
    // console.log(window,'window')
  },
  methods: {
    search(){
      this.$router.push({name: 'search', params: {key: this.key}})
    },
    handleMouse(index) {
      this.indx = index;
      console.log(1);
    },
    // handleMouse1(step, indx) {
    //   this.indx1 = `${index}${indexT}` == this.indx1 ? -1 : `${index}${indexT}`;
    //   console.log(2);
    // },
    handleClick(item) {
        if (item.isHome) {
          this.$router.push({name: 'cockpit', params: {isbackHome: true}})
        } else{
            this.$router.push({name: 'iframe', params: {curPageUrl: item.href, defaultBackBg: item.defaultBackBg}})
        }


    },
    handleClickSpqrQl(){
      window.open(window.URL_MAP.YYJS)
    },
    handleClickKfpt() {
      window.open(window.URL_MAP.KFPT)
    },
    getconcept(){
      this.$http({
        method: 'get',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/graph/data/concept?p=api&kgName=${this.window.kgName}`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        console.log(res.data);
        if (res.data.data) {
          console.log(res.data);
          for(let i in res.data.data){
            if(i == 5){
              break;
            }
            this.getEntityNum(res.data.data[i],i)
          }
        }
      })
    },
    getconceptList(){
      this.$http({
        method: 'post',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/graph/stat/entity/count/group/by/concept`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:  qs.stringify({p:'api',kgName:this.window.kgName})
      }).then((res) => {
        console.log(res.data);
        if (res.data.data) {
          console.log(res.data);
          this.contentListData = [];
          for(let i in res.data.data.series[0].data){
            if(i == 5){
              break;
            }
            this.contentListData.push({
              name: res.data.data.series[0].data[i],
              num: res.data.data.xaxis[0].data[i]
            })
          }
        }
      })
    },
    getKgNameArr(){
      this.$http({
        method: 'POST',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/app/get/kgname?p=api`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:  qs.stringify({})
      }).then((res) => {
        console.log();
        if(res.data.data){
          
        }
      })
    },
    getEntityNum(concept,index){
      this.$http({
        method: 'POST',
        url: `${window.configure.baseUrl}/plantdata-sdk/api/sdk/graph/data/entity?p=api&kgName=${this.window.kgName}`,
        headers: {
          APK: '445a793dd0314abd875b7980d7ffbbd6',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({'conceptId': concept.id})
      }).then((res) => {
        if(res.data.data){
          concept.num = res.data.data.length;
          this.contentListData.push(concept);
          console.log(this.contentListData);
        }
      })
    }
  },
};
</script>
<style scoped lang="scss">
.list-container {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #084550, #021829);

  .wrapper {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #084550, #021829);

    .position-kfpt {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 80px;
      background: url("../static/kfpt.png") no-repeat;
      background-size: 100% 100%;
      width: 190px;
      height: 72px;
    }

    .logo {
      color: #00CCFF;
      font-size: 26px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      height:172px;
      img {
        position: absolute;
        width: 597px;
        height: 132px;
      }
      span{
        font-size: 42px;
        font-weight: bold;
        color: #00FFF6;

      }
    }

    .selectKgName{
      position: fixed;
      top: 40px;
      left: 40px;
    }

    .selectMap{
      position: fixed;
      top: 80px;
      left: 40px;
    }

    .search{
      margin: 20px 30%;
      width: 40%;
      height: 70px;
      background: #043B50;
      border: 2px solid #00FFF6;
      border-radius: 8px;
      position: relative;
      color: rgba(255,255,255,.8);
      input{
        list-style: none;
        border: 0;
        width: calc(100% - 128px);
        height: 66px;
        line-height: 66px;
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
        height: 66px;
        background: #006965;
        border-left: 2px solid #00FFF6;
        border-radius: 8px;
        float: right;
        text-align: center;
        line-height: 66px;
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

    .constent {
      margin-top: 40px;
      padding: 0 20%;
      height: 240px;
      .listBg{
        width: 100%;
        height: 100%;
        li{
          height: 100%;
          width: 22%;
          margin-right: 4%;
          float: left;
          &:last-child{
            margin-right: 0;
          }
        }
      }


      .bg-purple {
        height: 240px;
        cursor: pointer;
        position: relative;
        box-shadow: 0 0 5px #3db8ff;
        overflow: hidden;

        .mantle {
          width: 100%;
          height: 100%;
          font-size: 26px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          position: absolute;
          z-index: 1;
        }

        .img {
          width: 100%;
          height: 100%;
          transition: all 1s;
          transform: scale(1);
        }
      }

      .movse-show {
        opacity: 1;
      }

      .movse-hide {
        color: #fff !important;
        background: transparent !important;
      }

      .act-img {
        width: 100%;
        height: 100%;
        transform: scale(1.2);
        transition: all 1s;
      }

      .p-act {
        transform: scale(1);
        transition: all 1s;
      }

      .p-default {
        transform: scale(0.85);
        transition: all 1s;
      }

      .grid-content {
        border-radius: 4px;
        min-height: 36px;
      }

      .el-row {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .el-col {
        border-radius: 4px;
      }
    }

    .contentList {
      padding: 0 20%;
      height: 115px;
      margin-top: 80px;
      .listBg{
        width: 100%;
        height: 100%;
        li{
          height: 100%;
          width: 16%;
          margin-right: 5%;
          float: left;
          position: relative;
          padding: 20px;
          box-shadow: 0px 0px 10px #3993a9 inset;
          div{
            width:12px;
            height: 12px;
            border-color: #00FFF6;
            position: absolute;
            border-style: solid;
          }
          .div1{
            border-width: 1px 0 0 1px;
            top: 0;
            left: 0;
          }
          .div2{
            border-width: 1px 1px 0 0;
            top: 0;
            right: 0;
          }
          .div3{
            border-width: 0 1px 1px 0;
            bottom: 0;
            right: 0;
          }
          .div4{
            border-width: 0 0 1px 1px;
            bottom: 0;
            left: 0;
          }
          p{
            text-align: center;
            color: #FFFFFF;
            font-size: 16px;
          }
          .num{
            line-height: 30px;
            font-size: 28px;
            color: #06F3FF;
          }
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .footer{
      width: 100%;
      height: 82px;
      background: #001B23;
      box-shadow: 0px 0px 12px 0px #042225;
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 0;
    }
  }
}


</style>
