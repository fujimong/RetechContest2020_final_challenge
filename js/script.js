// current value
var elem = document.getElementsByClassName("slider");
var rangeValue = function (elem, target) {
  return function(evt){
    target.innerHTML = elem.value;
  }
}
for(var i = 0, max = elem.length; i < max; i++){
  bar = elem[i].getElementsByTagName("input")[0];
  target = elem[i].getElementsByTagName("span")[0];
  bar.addEventListener("input", rangeValue(bar, target));
}
 
// 1. Base map
var t_std = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
var t_pale = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
var t_ort = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
var o_std = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
var baseMaps = {
    "地理院地図 標準": t_std,
    "地理院地図 淡色": t_pale,
    "地理院地図 オルソ": t_ort,
    "OpenStreetMap 標準": o_std
};

// 2. Initial map settings
var options = {
    // 初期位置は柏駅
    center: [35.8620322, 139.9709241],
    zoom: 15,
    minZoom: 12,
    maxZoom: 18,
    layers: [t_ort],
    zoomsliderControl: true,
    zoomControl: false
  },
  map = L.map('map', options);
L.control.scale({ position: 'bottomleft' }).addTo(map);

/* Legend specific */
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>価格</h4>";
  div.innerHTML += '<i style="background: #CB0017"></i><span>高：４千万～</span><br>';
  // div.innerHTML += '<i style="background: #F99E50"></i><span>High</span><br>';
  div.innerHTML += '<i style="background: #FFFF34"></i><span>中：２千万～</span><br>';
  // div.innerHTML += '<i style="background: #9CD893"></i><span>Low</span><br>';
  div.innerHTML += '<i style="background: #246FAB"></i><span>低：～２千万</span><br>';
  // div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  return div;
};
legend.addTo(map);

/* Control OSM Geocoder */
// var option = {
//   position: 'topright',
//   text: '検索',
//   placeholder: '検索条件を入力してください。'
// }
// var osmGeocoder = new L.Control.OSMGeocoder(option);
// map.addControl(osmGeocoder);

// Coordinates
var options = {
  position:"bottomleft",
  decimals:5,
  labelTemplateLat:"緯度: {y}",
  labelTemplateLng:"経度: {x}",
}
L.control.coordinates(options).addTo(map);
var mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];

//Add an empty geojson layer for the google sheet points
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Ntv5LsbtytAJ8KZ8BaKKLRM_mBglKXYSCQQW558D10c/edit?usp=sharing';
var entities = [];

function init() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: showStation ,
    simpleSheet: true 
  })
}
function showStation(data, tabletop) {
  for (var row in data) {
    if (data[row].name == "住宅") {
      options = {
        prefix: 'fa'
       ,icon: 'fa-home'
       ,shape: 'circle'
       ,markerColor: getColorHome(data[row].price)
      };
      var marker = L.marker([
          data[row].lat,
          data[row].lon
      ], {
        icon: L.ExtraMarkers.icon(options)
      }).addTo(map).bindPopup("Font Awesome<br>circle");
      marker.bindPopup('<strong>' + data[row].time + '分/' + data[row].area + '㎡/' + data[row].floors + '階<br>' + '：' + data[row].price + '万円</strong>');
    } else {
      options = {
        prefix: 'fa'
       ,icon: 'fa-train'
       ,shape: 'circle'
      //  ,markerColor: getColorStation(data[row].users)
       ,markerColor: 'black'
      };
      var marker = L.marker([
          data[row].lat,
          data[row].lon
      ], {
        icon: L.ExtraMarkers.icon(options)
      }).addTo(map).bindPopup("Font Awesome<br>circle");
      marker.bindPopup('<strong>' + data[row].name + "駅 日平均乗降客数: " + data[row].users + '人</strong>');
    }
  } 
}
window.addEventListener('DOMContentLoaded', init)

function score(input) {
  return ((((((14016651.380502468) + ((input[0]) * (4545.55114053975))) + ((input[1]) * (198889.21981449862))) + ((input[2]) * (-370185.41949104343))) + ((input[3]) * (-144604.31558139162))) + ((input[4]) * (1449643.762955173))) + ((input[5]) * (-1763789.196944742));
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btn').addEventListener('click', function () {
      // class="input-box"の要素を全て抽出
      let features = document.getElementsByClassName('input-box');
      let data = [];
    
      // 1. 敷地面積
      var area1 = Number(features[4].value);  
      data.push(area1);

      // 2. 延べ面積
      var floors = Number(features[5].value);  
      var area2 = area1 * 0.55 * floors
      data.push(area2);

      // 3. 築年数
      var element = document.getElementById("age1") ;
      if ( element.checked ) {
        var age = 0.5
      } else {
        var age = 20
      }
      data.push(age);

      // 4. 補正所要時間
      var stationInfo = document.getElementById("station").value;
      var station = stationInfo.split(" ")[0];
      let lat = stationInfo.split(" ")[1];
      let lon = stationInfo.split(" ")[2];
      var r = stationInfo.split(" ")[3];
      var time = Number(features[3].value);  
      data.push(time * r);
      
      // 5. 縦横比
      data.push(floors);

      // // 6. 間取り指数
      var madori = 5.5
      data.push(madori);
      
      let pred = score(data);
      let output = document.getElementById("output");
      // output.textContent = Math.round(pred / 10000) + "万円";
      let predStr = Math.round(pred / 10000) + "万円"
      output.innerHTML = predStr;
      
      var rand = Math.random()*2;
      lat = Number(newPoint(lat, lon, time, rand).lat2);
      lon = Number(newPoint(lat, lon, time, rand).lon2);
      console.log(lat, lon)
      
      console.log(pred / 10000)

      map.panTo(new L.LatLng(lat, lon));
      options_train = {
        prefix: 'fa'
       ,icon: 'fa-home'
       ,shape: 'star'
       ,markerColor: getColorHome(pred / 10000)
      };
      L.marker([lat, lon], {
        icon: L.ExtraMarkers.icon(options_train)}).addTo(map).bindPopup('<strong>' + time + '分/' + area1 + '㎡/' + floors + '階<br>' + '：' + predStr + '</strong>');
  });
});

function getColorStation(d) {
	return d >= 50000
		? "green-dark"
		: "green";
}
function getColorHome(d) {
	return d > 4000
		? "red"
		: d > 2000
		? "yellow"
		: "blue";
}
function newPoint(lat1, lon1, wt, rand) {
  const u = 0.01
  const uwt = 80 * 0.8
  const ud = 1400

  var x = u * (Math.cos( Math.PI * rand ) / ( 11 / 14 ) ) * ( uwt*wt / ud )
  var y = u * (Math.sin( Math.PI * rand ) / ( 9 / 14 ) ) * ( uwt*wt / ud )

  var lat2 = Number(lat1) + x;
  var lon2 = Number(lon1) + y;
  return {lat2, lon2}
}

