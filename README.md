# dataRender
dataRender 라이브러리
html 구조
<div id="wrap">
  <h2 class="">부분 랜더링이 가능한 페이지 작업</h2>
 <div class="{{list01}}">
  제목 : {{renderFun(list03)}}<br>
   제목 : 리스트 입니다 {{list03}}
 </div>
  <div class="{{class01}}">
    <button onclick="{{dataClick}}">버튼 1</button>
    <button onclick="{{dataClick}}">버튼 2</button>
    <button onclick="{{dataClick}}">버튼 3</button>
    <button onclick="{{dataClick}}">버튼 4</button>
    <button onclick="{{dataClick}}">버튼 5</button>
  </div>

  <div class="{{list01}} {{setClass}}" style="{{bg01}}">
    색상변경됩니다.
  </div>
</div>

<div id="wrap2">
  <div class="{{list01}}">
    제목 :  {{renderFun(list03)}}<br>
    제목 : 리스트 입니다 {{list03}}
  </div>
  <div class="{{class01}}">
    리스트 입니다 {{list04}}<br>
  </div>

  <div class="{{list01}} {{setClass}}" style="{{bg01}}">
    색상변경됩니다.
  </div>
</div>

js 사용방식
var dataClick = function(){
    app.setData({
      'list02' : 'dsfjkl',
      'list01' : 'app2',
      'setClass' : 'setClass',
      'bg01' : 'background-color:blue;'

    })
  };
  var dataClick2 = function(){
    app.setData({
      'list01' : 'app',
      'list02' : 'dsfjkl',
      'setClass' : 'setClass',
      'bg01' : 'background-color:blue;'

    })
  };
  var app = new dataBind({
    el:'wrap',
    data:{
      dataNone : '없음',// data없을 때 디폴트 정하기 없으면 ''
      list01 : 'app',// 데이터 수정 없이 들어갈 때
      list02 : '3333',
      list03 : 'list입니다.',
      list04 : 'list04입니다.',
      class01: 'class01',
      bg01 : 'background-color:yellow;',
      setClass :'',
      dataClick:'dataClick()'
    },
    computed:{
      renderFun: function (data) {
        return data+'render 되었습니다.';
      }
    }
  },function(data){
    // 데이터 모두 들어가고 나서 실행되는 이벤트
    console.log('완성')
  });
  
  setData로 선언한 내용 계속해서 랜더링 가능하도록 
  app..setData({
  'list02' : 'dsfjkl',
  'setClass' : 'setClass',
  'bg01' : 'background-color:blue;'
})
