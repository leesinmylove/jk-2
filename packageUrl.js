window.configure = {
  baseUrl: 'http://kg101.plantdata.cn:10019',
  homeTitle: 'XXXX可视化数据平台',
  listTitle: '知识服务应用群',
  searchZoom: 1,
  clickZoom: 5,
  footerTitle: 'XXXX信息科技有限公司版权支持    北京网关备案'
}


window.URL_MAP = {
  ZSJSC: `${window.configure.baseUrl}/index.html#/`, // 知识驾驶舱
  YYJS: `${window.configure.baseUrl}/kgms/kg/project/main/storage/dataSearch?username=default_user`, // 语义检索
  TTS: `${window.configure.baseUrl}/spa/container/kgms_default_user_graph_176ad79dcad/445a793dd0314abd875b7980d7ffbbd6/graph?hideHeader=true`, // 图探索
  ZSTPFLDH: `${window.configure.baseUrl}/spa/container/kgms_default_user_graph_176ad79dcad/445a793dd0314abd875b7980d7ffbbd6/graph?username=default_user&params=0&hideHeader=true&customSettings=%7B%22loaderSettings%22%3A%7B%22ajaxSettings%22%3A%7B%22formData%22%3A%7B%22hyponymyDistance%22%3A6%7D%7D%7D,%22changeLayout%22%3A%7B%22enable%22%3Afalse,%22settings%22%3A%7B%22layout%22%3A%22leftTree%22%7D%7D,%22page%22%3A%7B%22enable%22%3Afalse%7D,%22prompt%22%3A%7B%22enable%22%3Afalse%7D,%22wordCloud%22%3A%7B%22enable%22%3Afalse%7D,%22find%22%3A%7B%22enable%22%3Afalse%7D,%22history%22%3A%7B%22enable%22%3Afalse%7D,%22advancedPrompt%22%3A%7B%22enable%22%3Afalse%7D,%22attValueRule%22%3A%7B%22enable%22%3Afalse%7D,%22infobox%22%3A%7B%22enable%22%3Afalse%7D,%22filter%22%3A%7B%22enable%22%3Afalse%7D,%22relativeFiles%22%3A%7B%22enable%22%3Afalse%7D,%22businessAlgorithm%22%3A%7B%22enable%22%3Afalse%7D,%22snapshot%22%3A%7B%22enable%22%3Afalse%7D,%22snapshotAsnyc%22%3A%7B%22enable%22%3Afalse%7D,%22toolbar%22%3A%7B%22enable%22%3Afalse%7D,%22visConfigure%22%3A%7B%22enable%22%3Afalse%7D,%22tagView%22%3A%7B%22enable%22%3Afalse%7D%7D`, // 知识图谱分类导航
  ZNWD: `${window.configure.baseUrl}/bot/pc.html?sysNum=16092935023318989`, // 智能问答
  KFPT: `${window.configure.baseUrl}/kgms/ApiExplain/platform/frame?username=default_user&postfix=index&title=%E6%8E%A5%E5%85%A5%E8%AF%B4%E6%98%8E`, //  开放平台

};

window.kgName = 'kgms_default_user_graph_178c4ad60df'

window.kgNameArr = [
  {
    label: '驾驶舱应用',
    value: 'kgms_default_user_graph_176e0853be8'
  },
  {
    label: '驾驶舱应用20210412',
    value: 'kgms_default_user_graph_178c4ad60df'
  },
]

window.settingData = {
  listData: [
    [
      {
        title: "知识驾驶舱",
        span: 14,
        image: 'JSC',
        href: window.URL_MAP.ZSJSC,
        isHome: true,
      },
      {
        title: "语义检索",
        image: `./src/static/`,
        span: 10,
        defaultBackBg: true,
        href: `${window.configure.baseUrl}/kgms/kg/project/main/storage/dataSearch?username=default_user`,
      },
      {
        title: "路径查找",
        image: './src/static/LJCZ.png',
        span: 10,
        defaultBackBg: true,
        href: `${window.configure.baseUrl}/kgms/kg/project/main/storage/dataSearch?username=default_user`,
      },
    ],
    [
      {
        title: "图探索",
        image: './src/static/TSS.png',
        span: 8,
        defaultBackBg: false,
        href: `${window.configure.baseUrl}/spa/container/kgms_default_user_graph_176ad79dcad/445a793dd0314abd875b7980d7ffbbd6/graph?hideHeader=true`,
      },
      {
        title: "知识图谱分类导航",
        image: './src/static/FLDH.png',
        span: 8,
        defaultBackBg: false,
        href: `${window.configure.baseUrl}/spa/container/kgms_default_user_graph_176ad79dcad/445a793dd0314abd875b7980d7ffbbd6/graph?username=default_user&params=0&hideHeader=true&customSettings=%7B%22loaderSettings%22%3A%7B%22ajaxSettings%22%3A%7B%22formData%22%3A%7B%22hyponymyDistance%22%3A6%7D%7D%7D,%22changeLayout%22%3A%7B%22enable%22%3Afalse,%22settings%22%3A%7B%22layout%22%3A%22leftTree%22%7D%7D,%22page%22%3A%7B%22enable%22%3Afalse%7D,%22prompt%22%3A%7B%22enable%22%3Afalse%7D,%22wordCloud%22%3A%7B%22enable%22%3Afalse%7D,%22find%22%3A%7B%22enable%22%3Afalse%7D,%22history%22%3A%7B%22enable%22%3Afalse%7D,%22advancedPrompt%22%3A%7B%22enable%22%3Afalse%7D,%22attValueRule%22%3A%7B%22enable%22%3Afalse%7D,%22infobox%22%3A%7B%22enable%22%3Afalse%7D,%22filter%22%3A%7B%22enable%22%3Afalse%7D,%22relativeFiles%22%3A%7B%22enable%22%3Afalse%7D,%22businessAlgorithm%22%3A%7B%22enable%22%3Afalse%7D,%22snapshot%22%3A%7B%22enable%22%3Afalse%7D,%22snapshotAsnyc%22%3A%7B%22enable%22%3Afalse%7D,%22toolbar%22%3A%7B%22enable%22%3Afalse%7D,%22visConfigure%22%3A%7B%22enable%22%3Afalse%7D,%22tagView%22%3A%7B%22enable%22%3Afalse%7D%7D`,

      },
      {
        title: "智能问答",
        image: './src/static/ZNWD.png',
        span: 8,
        defaultBackBg: true,
        href: `${window.configure.baseUrl}/bot/pc.html?sysNum=16092935023318989`,
      },
    ],


  ]
}
