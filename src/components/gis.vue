<template>
  <div id="pd-gis-map-example">
  </div>
</template>

<script>
import Vue from 'vue'
import {Map as olMap} from 'ol';
import View from 'ol/View';
import {XYZ, Cluster, OSM} from 'ol/source';
import {fromLonLat, getTransform} from 'ol/proj';
import {Tile, Vector as VectorLayer} from "ol/layer";
import VectorSource from "ol/source/Vector";
import Overlay from "ol/Overlay";
import OverlayPositioning from "ol/OverlayPositioning";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import * as _ from 'lodash';

export default {
  props: ['mapContent', 'mapZoom'],
  name: 'components',
  data() {
    return {
      window: window,
      bind: {
        inject: {
          axios: this.$http,
          eventBus: new Vue(),
          store: this.$store,
        },
        extraProperties: {
          api: {
            baseUrl: window.configure.baseUrl,
            APK: '445a793dd0314abd875b7980d7ffbbd6',
            token: ''
          },
          isPreview: true,
        },
        componentId: 'map',
        componentSettingsValue: {
          style: {
            settings: {
              config: {
                // theme: 'light',
                // sourceUrl: 'http://192.169.4.22/roadmap/{z}/{x}/{y}.png', // 瓦片信息资源地址 可不填,用默认
                // sourceUrl: 'http://192.168.200.166/roadmap_1/{z}/{x}/{y}.png', // 瓦片信息资源地址 可不填,用默认
                // sourceUrl: 'http://192.169.4.22/roadmap/{z}/{x}/{y}.png', // 瓦片信息资源地址 可不填,用默认
                windLayer: false, // 是否开启风流图
                zoom: 4,
              },
              graph: {  //  人物  国家  岛屿 的 颜色配置
                colorArray: ['rgb(192,128,251)', 'rgb(255,113,90)', 'rgb(87,122,233)', '#fcd970', '#ffa974', '#577ae9', '#9672fe', '#32ccde', '#ba64e2', '#49a9ea'],
              },
              marker: {
                labelColor: '#999',
                size: 24,
              },
              section: {
                fill: 'rgba(162,234,241,0.66)',
                stroke: 'rgba(92,151,224,0.85)',
                width: 2
              },
              cluters: {
                fill: '#3399CC',
                radius: 30,
                strokeColor: '#3399CC',
                strokeWidth: 0,
              },

            },
            // todo 自己调用schema数据
            data: {
              settings: {
                source: {
                  dataSource: 'graph',
                  graph: {
                    kgName: 'kgms_default_user_graph_175f4a8e98d'
                  }
                }
              }
            },
          },
        },
      },
      marker: '',
      newViewMap: '',
      curDom: '',
      list: []
    }
  },
  watch: {
    mapContent: {
      // 数据变化时执行的逻辑代码
      handler(newVal, oldVal) {
        this.mapContent = newVal
        this.removeGisNode()
        this.gisMapInit(this.mapContent)
      },
      // 开启深度监听
      deep: true,
    },
  },
  mounted() {
    const {section, config} = this.bind.componentSettingsValue.style.settings;
    this.nodeLayerSource = new VectorSource({
      features: [],
    });
    this.nodeLayer = new VectorLayer({
      source: this.nodeLayerSource,
    });
    this.chart = new olMap({
      target: 'pd-gis-map-example',
      view: new View({
        center: fromLonLat([108.666411, 34.256686]),
        zoom: 2,
        maxZoom: 10,
        minZoom: 2,
      }),

      layers: [
        new Tile({
          source: new XYZ({
            // url: 'http://192.168.5.179:8089/arcgis/{z}/{y}/{x}.png'
            // url: `${window.configure.baseUrl}/arcgis/{z}/{y}/{x}.png`,
            url: `${window.configure.baseUrl}/${window.localStorage.mapName}`,
          }),
        }),
        this.nodeLayer,
      ],
    });
    this.gisMapInit(this.mapContent);
    this.pointermove();
    this.pointerClickCur()
  },
  methods: {
    pointermove() {
      this.chart.on('pointermove', (evt) => {
        const allDomNameLen = this.mapContent.sign.length
        const feature = this.chart.forEachFeatureAtPixel(evt.pixel,
          (f) => {
            return f;
          });
        if (feature) {
          if (this.list.length > 0) {
            for (let i = 0; i < this.list.length; i++) {
              const doms = document.getElementsByClassName(this.list[i])[0]
              doms.style = "display:none"
            }
          }
          this.chart.getTargetElement().style.cursor = "pointer"
          const dom = feature.get('className');
          this.list.push(dom)
          this.curDom = dom
          const doms = document.getElementsByClassName(dom)[0]
          doms.style = "display:block"
          doms.style.backgroundColor = 'rgba(255, 255, 255,1)';
          doms.style.borderColor = '#333';
          doms.style.borderRadius = '4px';
          doms.style.padding = '20px';
          doms.style.fontSize = '14px';
        } else {
          const dom = document.getElementsByClassName(this.curDom)[0]
          if (dom) {
            dom.style = "display:none"
            this.chart.getTargetElement().style.cursor = "auto"

          }
        }
      });
    },
    pointerClickCur() {
      const  _this =  this
      _this.chart.on('click', (evt) => {
        const feature = _this.chart.forEachFeatureAtPixel(evt.pixel,
          (f) => {
            return f;
          });
        if (feature) {
          const id = feature.get('id')
          console.log('click-id',id)
          _this.$emit('showCard', id)
        }
      })
    },
    removeGisNode() {
      const features = this.nodeLayerSource.getFeatures();
      features.forEach((item) => {
        this.nodeLayerSource.removeFeature(item);
        this.chart.removeOverlay(item.get('label'));
      })
    },
    gisMapInit(data) {
      console.log(data,'data-gis')

      data.sign.forEach((v, indx) => {
        const marker = this.addMarkers(v, data.name[indx], data.ids[indx], data.time, indx)
        this.nodeLayerSource.addFeature(marker);
        this.chart.getView().setCenter(fromLonLat(v))
      })
      if (this.mapZoom) {
        this.chart.getView().setZoom(this.mapZoom)
      }
    }
    ,
    /**
     * 捕获事件
     */
    catchEvent(e) {
      console.log(e)
    }
    ,
    /**
     * 添加标记
     */
    addMarkers(lntlat, nodeData, id, time, indx) {
      const className = `pdvis-gis-node-label${indx}`
      const div = document.createElement('div');
      // div.innerHTML = (`<h5 class="title">${time}</h5>`)
      div.className = className
      div.style.display = 'none'
      const subDiv = document.createElement('div');
      subDiv.innerText = nodeData;
      div.appendChild(subDiv);
      const label = new Overlay({
        element: div,
        positioning: OverlayPositioning.BOTTOM_LEFT,
        stopEvent: true,
        offset: [10, -6],
        position: fromLonLat(lntlat),
      });
      const marker = new Feature({
        type: 'icon',
        geometry: new Point(fromLonLat(lntlat)),
        label,
        nodeData,
        className,
        id
      });
      this.chart.addOverlay(label);
      const iconStyle = this.createMarkerStyle('data:image/svg+xml;charset=UTF-8,' + this.locationIcon(24, {
        fill: 'red',
      }));
      marker.id = id
      marker.indx = indx
      marker.setStyle(iconStyle);
      return marker;
    }
    ,
    locationIcon(size, atts, svgStr) {
      if (!svgStr) {
        svgStr = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7
            -7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>`
      }
      return this.createSVGStr(svgStr, Object.assign({
        viewBox: '0 0 24 24',
        width: size,
        height: size
      }, atts));
    }
    ,
    createSVGStr(content, atts) {
      atts = Object.assign({
        height: 24,
        width: 24,
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg'
      }, atts);
      let str = '';
      for (const key in atts) {
        if (Object.hasOwnProperty.call(atts, key)) {
          str += ' ' + key + '="' + atts[key] + '"';
        }
      }
      return '<svg' + str + '>' + content + '</svg>';
    }
    ,
    /**
     * 生成节点图标样式
     * @param src 图标的路径
     */
    createMarkerStyle(src) {
      const icon = new Icon({
        anchor: [0.5, 1],
        src
      });
      return new Style({
        image: icon,
      });
    }
  }
}

</script>

<style scoped lang="scss">
#pd-gis-map-example {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .pd-filter-graph {
    width: 240px;
  }

  .graph-legend {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 999;
    background: #ffffffcc;
    padding: 10px;
  }
}
</style>
