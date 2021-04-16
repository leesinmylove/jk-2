/**
 *@desc公共请求方法
 *@param{object}api 描述对象
 *@param{object}params 参数
 */
export default  function request(api,params){
  const config={
    ...api,
    headers: {
      APK: '445a793dd0314abd875b7980d7ffbbd6'
    }
  };
  if(api.method!=='PUT'&&api.method!=='POST'&&api.method!=='PATCH'){
    config.params=params;
  }else{
    config.data=params;
  }

}
