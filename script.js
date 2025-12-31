// 1. 지도 생성 (한양대 ERICA 전체가 보이도록 좌표와 줌 레벨 수정)
// 좌표: [37.2985, 126.8347] (캠퍼스 중앙)
// 줌 레벨: 16 (전체가 적당히 보이는 수준)
var map = L.map('map').setView([37.2985, 126.8347], 17);

// (이 아래 코드는 그대로 두시면 됩니다)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// ...
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// --------------------------------------------------------
// 데이터: 건물 정보 및 이미지 경로
// (이미지 파일명이 images 폴더 안의 파일명과 똑같아야 합니다!)
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
};

// --------------------------------------------------------
// ★ [수정 완료] 제2공학관 클릭 영역 만들기 (찾아내신 좌표 적용)
var eng2Polygon = L.polygon([
    [37.296582, 126.832907], // 사용자가 찾은 좌표 1
    [37.296832, 126.833307], // 사용자가 찾은 좌표 2
    [37.297339, 126.832974], // 사용자가 찾은 좌표 3
    [37.297245, 126.832486]  // 사용자가 찾은 좌표 4
], {
    color: 'transparent', // 평소에는 투명해서 지도 건물이 보임
    fillColor: '#3388ff', // 마우스 올리면 파란색
    fillOpacity: 0.2      // 약간 투명하게
}).addTo(map);

// 마우스 올렸을 때 효과 (파랗게 변함)
eng2Polygon.on('mouseover', function() {
    this.setStyle({ color: 'blue', fillOpacity: 0.4 });
});
// 마우스 뗐을 때 효과 (원래대로)
eng2Polygon.on('mouseout', function() {
    this.setStyle({ color: 'transparent', fillOpacity: 0.2 });
});

// ★ 건물을 클릭하면 -> 설계도 창 열기
eng2Polygon.on('click', function() {
    openModal("eng2");
});

// --------------------------------------------------------
// (선택 사항) 다른 건물 좌표를 또 찾으려면 아래 주석(//)을 지우세요.
/*
map.on('click', function(e) {
    console.log("클릭한 위치: " + e.latlng);
});
*/
// --------------------------------------------------------

// --- 아래는 모달(팝업창) 관련 기능입니다 (수정할 필요 없음) ---

function openModal(id) {
    var data = buildings[id];
    var modal = document.getElementById('modal');
    var nav = document.getElementById('floor-nav');
    
    // 제목 설정
    document.getElementById('modal-title').innerText = data.name;
    
    // 버튼 초기화
    nav.innerHTML = "";

    // 층별 버튼 생성 (1F ~ 5F)
    Object.keys(data.floors).forEach(function(floor) {
        var btn = document.createElement('button');
        btn.innerText = floor + "F";
        btn.className = "floor-btn";
        
        // 버튼 클릭 기능
        btn.onclick = function() { changeFloor(id, floor, btn); };
        
        nav.appendChild(btn);

        // 창이 열릴 때 1층을 기본으로 보여줌
        if(floor === "1") changeFloor(id, floor, btn);
    });

    // 모달 보여주기
    modal.classList.remove('hidden');
}

function changeFloor(buildingId, floor, btnElement) {
    var imgPath = buildings[buildingId].floors[floor];
    
    // 이미지 교체
    document.getElementById('floor-image').src = imgPath;

    // 버튼 색상 변경 (누른 것만 파랗게)
    var buttons = document.querySelectorAll('.floor-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}