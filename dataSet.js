/**
 * 데이터 바인딩 2018.08.21
 * License: 없음
 */

// vue 방식으로 render하고 데이터 변경 가능한 object
var dataBind = function(obj, endFun){
  this.el = obj.el;
  this.dom = document.getElementById(this.el).innerHTML;
  this.data = obj.data;
  this.computed = obj.computed;
  this.endReturn = endFun;
  this.render=function(){
    var domList,
        sliceText,
        sliceFirst,
        sliceLast,
        renderFun,
        renderData,
        renderList,
        dom = document.getElementById(this.el), domHtml = dom.innerHTML;
    this.data['dataNone'] = this.data['dataNone'] ? this.data['dataNone'] : '';
    if(this.dom.indexOf('{{') > 0){
      domList = this.dom.split('{{');
      for(var i = 0;i<domList.length ; i++){
        if(domList[i].indexOf('}}') > 0){
          // 객체명과 text 분리
          sliceText = domList[i].split('}}');
          sliceFirst = sliceText[0].trim();
          sliceLast = sliceText[1];
          this.computed.normalFun = function(data){return data};
          if(sliceFirst.indexOf('(') > 0 ){
            renderList = sliceFirst.split('(')
            renderData = renderList[1].replace(')','').trim();
            renderFun = renderList[0].trim();
          }else{
            renderFun = 'normalFun';
            renderData = sliceFirst;
          }
          domList[i] = this.data[renderData] ? this.computed[renderFun](this.data[renderData]) + sliceLast :this.data['dataNone'] + sliceLast;
        }
      }
      dom.innerHTML = domList.join('');
      if(typeof(this.endReturn) =='function'){
        this.endReturn();
      }
    }
  }
  this.render();
}
// data render
//데이터 받기
dataBind.prototype.getData = function(name){
  var returnObj = {};
  if(Array.isArray(name) ){
    for(var i = 0 ;i< name.length; i++){
      returnObj[name[i]] = typeof(this.data[name[i]]) == 'object' ? this.data[name[i]].data : this.data[name[i]];
    }
    return returnObj;
  }
  if(!name){
    for(var objName in this.data){
      if(objName !== 'dataNone'){
        returnObj[objName] = typeof(this.data[objName]) == 'object' ? this.data[objName].data: this.data[objName];
      }
    }
    return returnObj;
  }
  return this.data[name];
}

// 데이터 넣기
dataBind.prototype.setData = function(obj){
  for(var item in obj){
    this.data[item] = obj[item];
  }
  this.render();
  return this.data;
}
