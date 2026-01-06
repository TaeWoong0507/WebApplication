// 1. 지도 생성 (초기 중심 좌표: ERICA 캠퍼스 중앙)
var map = L.map('map', {
    zoomControl: false // 줌 버튼 위치 커스텀을 위해 일단 끔
}).setView([37.2985, 126.8347], 17);

// 줌 컨트롤 오른쪽 상단으로 이동 (사이드바에 가리지 않게)
L.control.zoom({ position: 'topright' }).addTo(map);

// 2. 오픈스트릿맵 불러오기 (건물 이름이 보이는 기본 버전)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// --------------------------------------------------------
// 데이터 정의 (건물 정보)
const buildings = {
    "eng2": {
        name: "제2공학관",
        floors: {
            "1": "images/eng2_1f.png",
            "2": "images/eng2_2f.png",
            "3": "images/eng2_3f.png",
            "4": "images/eng2_4f.png",
            "5": "images/eng2_5f.png"
        }
    }
    // 여기에 건물 계속 추가 가능
};

var mapLayers = {}; 
var searchMarker = null;
var myLocationMarker = null;

// --------------------------------------------------------
// 제2공학관 투명 영역 그리기 (클릭 가능 영역)
var eng2Polygon = L.polygon([
    [37.296582, 126.832907], 
    [37.296832, 126.833307], 
    [37.297339, 126.832974], 
    [37.297245, 126.832486]  
], {
    color: 'transparent', 
    fillColor: '#0E4D9C', // 한양대 블루
    fillOpacity: 0
}).addTo(map);

mapLayers["eng2"] = eng2Polygon;

// 마우스 호버 효과
eng2Polygon.on('mouseover', function() { 
    this.setStyle({ color: '#0E4D9C', fillOpacity: 0.3 }); 
});
eng2Polygon.on('mouseout', function() { 
    this.setStyle({ color: 'transparent', fillOpacity: 0 }); 
});

// 클릭 시 모달 열기
eng2Polygon.on('click', function() { openModal("eng2"); });


// --------------------------------------------------------
// 검색 기능
function searchBuilding() {
    var input = document.getElementById('search-input').value.trim();
    if (input === "") { alert("검색어를 입력하세요."); return; }

    var foundId = null;
    for (var key in buildings) {
        if (buildings[key].name.includes(input)) {
            foundId = key;
            break;
        }
    }

    if (foundId) {
        var layer = mapLayers[foundId];
        var center = layer.getBounds().getCenter(); 

        map.flyTo(center, 18); // 지도 이동

        // 기존 검색 마커 삭제
        if (searchMarker) map.removeLayer(searchMarker);
        
        // 검색된 위치에 마커 표시
        searchMarker = L.marker(center).addTo(map);
        searchMarker.bindPopup("<b>" + buildings[foundId].name + "</b>").openPopup();
        
    } else {
        alert("검색된 건물이 없습니다.");
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') searchBuilding();
}

// --------------------------------------------------------
// 내 위치 찾기 (Geolocation)
function findMyLocation() {
    if (!navigator.geolocation) {
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
        return;
    }
    
    // 위치 요청
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latlng = [lat, lng];

        // 지도 이동
        map.flyTo(latlng, 18);

        if (myLocationMarker) map.removeLayer(myLocationMarker);

        // 파란색 점으로 내 위치 표시
        myLocationMarker = L.circleMarker(latlng, {
            color: 'white', 
            fillColor: '#0E4D9C', 
            fillOpacity: 1, 
            radius: 8, 
            weight: 2
        }).addTo(map);
        
        // 반경 원 표시 (선택사항)
        L.circle(latlng, { radius: 20, color: '#0E4D9C', fillOpacity: 0.1, weight: 0 }).addTo(map);

    }, function() {
        alert("위치 정보를 가져올 수 없습니다.");
    });
}

// --------------------------------------------------------
// 모달 관련 함수
function openModal(id) {
    var data = buildings[id];
    var modal = document.getElementById('modal');
    var nav = document.getElementById('floor-nav');
    
    document.getElementById('modal-title').innerText = data.name;
    nav.innerHTML = "";
    
    // 층 버튼 생성
    Object.keys(data.floors).forEach(function(floor) {
        var btn = document.createElement('button');
        btn.innerText = floor + "F";
        btn.className = "floor-btn";
        btn.onclick = function() { changeFloor(id, floor, btn); };
        nav.appendChild(btn);
        
        // 1층을 기본으로 선택
        if(floor === "1") changeFloor(id, floor, btn);
    });

    modal.classList.remove('hidden');
}

function changeFloor(buildingId, floor, btnElement) {
    document.getElementById('floor-image').src = buildings[buildingId].floors[floor];
    
    // 버튼 활성화 스타일 처리
    var buttons = document.querySelectorAll('.floor-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// 모달 배경 클릭 시 닫기 기능 추가
document.querySelector('.modal-overlay').addEventListener('click', closeModal);