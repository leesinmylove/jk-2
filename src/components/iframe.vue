<template>
  <div class="iframe-cont">
    <div class="scroll-content">
      <iframe :src="curPageUrl" class="iframe-box" ref="iframeBox" :key="curPageUrl"></iframe>
      <div @click="handleClickBack()"
           ref="backBtn" class="back-btn"><p><i></i><span>返回</span></p></div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      curPageUrl: '',
      setting: [
        {
          background: require("@/static/public-bj.png"),
          backgroundSize: '100% 100%',
          boxShadow: 'none'
        },
        {
          background: '#fff',
          boxShadow: '0 3px 8px  rgba(1, 14, 35, 0.05)'
        }
      ]
    }
  },
  created() {
  },

  mounted() {
    if (!this.$route.params.defaultBackBg) {
      this.$refs.backBtn.style.backgroundImage = `url(${this.setting[0].background})`
      this.$refs.backBtn.style.backgroundSize = this.setting[0].backgroundSize
      this.$refs.backBtn.style.boxShadow = this.setting[0].boxShadow
    } else {
      this.$refs.backBtn.style.backgroundImage = `url(${this.setting[1].background})`
      this.$refs.backBtn.style.boxShadow = this.setting[1].boxShadow
    }
    console.log(this.$route.params.curPageUrl,'this.$route.params.curPageUrl')
    this.curPageUrl = this.$route.params.curPageUrl
  },
  methods: {
    handleClickBack() {
      this.$router.push({name: 'list'})
    },
  }

}
</script>

<style lang="scss" scoped>
@import "common/style/common.scss";

.iframe-cont {
  height: 100%;
  width: 100%;
  overflow-x: scroll;

  .back-btn {
    position: relative;
    top: 0;
    left: 0;
    height: 62px;
    display: block;

    P {
      display: flex;
      align-items: center;
      padding-left: 10px;
      height: 62px;

      i {
        width: 11px;
        height: 10px;
        background: url("../static/back-svg.svg") no-repeat;
        background-size: 100% 100%;
        margin-right: 5px;
        display: block;
      }

      span {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        cursor: pointer;
      }

    }
  }

  .scroll-content {
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    @include scroll($bg: rgba(0, 130, 255, 0.2), $thumb: #0082ff, $btn: #999, $size: 8px);
  }

  .iframe-box {
    width: 100%;
    height: 100%;
    border: none;
    vertical-align: bottom;
  }

}

</style>
