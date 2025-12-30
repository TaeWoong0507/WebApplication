// 1. 지도 만들기 (좌표: 한양대 ERICA 본관 근처)
// setView([위도, 경도], 확대레벨)
var map = L.map('map').setView([37.2985, 126.8347], 16);

// 2. 오픈스트릿맵 그림 가져오기
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

