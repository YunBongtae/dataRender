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
  this.template = obj.template;

  // render
  this.dataRender = function(sliceText,repeatObj){
    var renderFun,
        renderFunSet,
        renderData,
        renderList,
        sliceFirst,
        sliceLast,
        setRenderData,
        repeatRenderObj=repeatObj, repeatObjIndex,repeatObjIndex,repeatObjName;
    sliceText = sliceText.split('}}');
    sliceFirst = sliceText[0].trim();
    sliceLast = sliceText[1];
    this.computed.normalFun = function(data){return data};

    if(sliceFirst.indexOf('(') > 0 ){
      renderList = sliceFirst.split('(')
      renderData = renderList[1].replace(')','').trim();
      renderFun = renderList[0].trim();
      setRenderData = this.data[renderData];
    }else if(typeof (repeatRenderObj) =='object'){
      repeatObjName = repeatRenderObj['name'];
      repeatObjIndex = repeatRenderObj['index'];
      setRenderData = this.data[repeatObjName]['data'][repeatObjIndex][sliceFirst];
      renderFunSet = this.data[repeatObjName]['render'][sliceFirst];
      renderFun =  renderFunSet?renderFunSet :'normalFun';
    }else{
      renderFun = 'normalFun';
      setRenderData = this.data[sliceFirst]
    }
    return setRenderData || String(setRenderData) === 'false' ? this.computed[renderFun](setRenderData) + sliceLast : this.data['dataNone'] + sliceLast;
  }
  this.watchSet = function(){
    var watchList = document.querySelectorAll('[data-watch]');
    var root= this,dataName;
    for(var i = 0 ;i < watchList.length; i++){
      watchList[i].addEventListener('change',function(){
        dataName = this.getAttribute('data-watch');
        var radioName = this.getAttribute('name');
        if(this.type =='radio'){
          radioList = document.querySelectorAll('[name="'+radioName+'"]');
          for(var i = 0 ;i<radioList.length ; i++){
            root.data[radioList[i].getAttribute('data-watch')] = false;
          }
        }
        if(this.type =='checkbox' || this.type =='radio'){
          root.data[dataName]= this.checked ?  'checked':'';
        }else{
          root.data[dataName]= this.value;
        }
      });
    }
  }
  this.repeatRender = function(dataObj, templateName,renderSet){
    var data = this['data'][dataObj]['data'],
        dataRender = this['data'][dataObj]['render'],
        template = this.template[templateName],itemObj,dataString,renderArr,renderDataObj,returnArr=[],
        i = renderSet && typeof(renderSet.start) =='number' ? renderSet.start : 0,
        dataLength = renderSet && typeof(renderSet.length) =='number' ? i+renderSet.length : data.length ;
    for(i ;i<dataLength; i++){
      itemObj = data[i];
      renderArr = [];
      templateList = template.indexOf('}}')>0 ?  template.split('{{') : template;
      for(var j = 0 ;j<templateList.length; j++){
        renderDataObj ={ name:dataObj };
        renderDataObj.index = i;
        if(templateList[j].indexOf('}}')>0){
          templateList[j] = this.dataRender(templateList[j],renderDataObj)
        }
      }
      returnArr.push(templateList.join(''))
    }
    return returnArr.join('');
  }

  this.render=function(){
    var domList,
        sliceText,
        sliceFirst,
        sliceLast,
        repeatRenderObj,
        dom = document.getElementById(this.el), domHtml = dom.innerHTML;
    this.data['dataNone'] = this.data['dataNone'] ? this.data['dataNone'] : '';
    if(this.dom.indexOf('{{') > 0){
      domList = this.dom.split('{{');

      for(var i = 0;i<domList.length ; i++){
        if(domList[i].indexOf('}}') > 0){
          // 객체명과 text 분리
          if(domList[i].indexOf('[for]') > 0 ){
            repeatRenderObj = domList[i].split('[for]');
            domList[i] = domList[i].replace('>','>'+this.repeatRender(repeatRenderObj[0],repeatRenderObj[1].split('}}')[0],this.data[repeatRenderObj[0]].setting));
          }else {
            domList[i] = this.dataRender(domList[i]);
          }
        }
      }
      dom.innerHTML = domList.join('');
      if(typeof(this.endReturn) =='function'){
        this.endReturn();
      }
    }
  }
  this.render();
  this.watchSet();
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
dataBind.prototype.setData = function(obj,endFun){
  for(var item in obj){
    this.data[item] = obj[item];
  }
  this.endReturn = endFun;
  this.render();
  this.watchSet();
  return this.data;
}
