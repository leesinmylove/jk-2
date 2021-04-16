<template>
  <div class="form-group" style="margin-top: 20px;">
    <input type="hidden" value="0, 80" id="range"  class="slider-input"/>
<!--    <input type="hidden" class="slider-input" value="23" />-->
  </div>
</template>
<!--<script src="jquery.range.js"></script>-->
<script>
// import $ from 'jquery';
// import {jRange} from './common/js/rang.js';
export default {
name: "range",
  data(){
  return{

  }
  },
  mounted() {
    console.log('eee', $('.slider-input'))
    // $('.slider-input').jRange({
    //   from: 0,   				//滑块范围的初始值
    //   to: 80,    				//滑块范围的终止值
    //   step: 1,   				//设置步长
    //   scale: [0,20,40,60,80], //滑动条下方的尺度变标签
    //   format: '%s',  			//数值格式
    //   width: 300, 			//进度条的宽度
    //   showLabels: true,  		//是否显示滑动条下方的尺寸标签
    //   showScale: false,  		//是否显示滑块上方的数值标签
    //   isRange: true,     		//是否为选取范围
    //   onstatechange: function(e){    //滑块范围改变时触发的方法
    //     console.log(e);
    //   }
    // });
    // $('.slider-input').jRange('setValue', '25, 50');  //滑块赋值
  },
  methods:{


  }
}
</script>

<style scoped>

</style>
