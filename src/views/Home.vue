<template>
  <div>
    <loading :active.sync="isLoading" loader="dots"></loading>
    <div class="container-fluid">
      <div class="row test">
        <div class="col-12 col-lg-7 left">
          <div class="row formGroup mt-3">
            <h5 class="col-12 formTitle">
              依縣市搜尋 <i class="fas fa-search"></i>
            </h5>

            <div class="col-6 form">
              <select
                name=""
                id="city"
                class="formSelect"
                v-model="select.city"
                @change="
                  pharmacies;
                  select.area = '請選擇鄉鎮市區';
                "
              >
                <!-- <option value="">-- Select One --</option> -->
                <option
                  :value="c.CityName"
                  v-for="c in cityName"
                  :key="c.CityName"
                  >{{ c.CityName }}</option
                >
              </select>
            </div>
            <div class="col-6 form">
              <select
                name=""
                id="town"
                class="formSelect"
                v-if="select.city.length"
                v-model="select.area"
              >
                <option disabled selected>請選擇鄉鎮市區</option>
                <option
                  :value="t.AreaName"
                  v-for="t in cityName.find(
                    (city) => city.CityName === select.city
                  ).AreaList"
                  :key="t.AreaName"
                  >{{ t.AreaName }}</option
                >
              </select>
            </div>
            <p class="col-12 formText">
              - 該地區共<span> {{ pharmacies.length }} </span>
              家藥局尚有剩餘口罩 -
            </p>
          </div>
          <div class="container storeData">
            <div class="row storeGroup">
              <div
                class="col-lg-5 col-md-5 col-12 store"
                v-for="(item, key) in pharmacies"
                :key="key"
                @click="flyTo(item)"
              >
                <h3 class="storeName">
                  {{ item.properties.name }}
                  <i class="fas fa-angle-double-right"></i>
                </h3>
                <p class="storeAddress">
                  <i class="fas fa-home"></i>
                  {{ item.properties.address }}
                </p>
                <p class="storePhone">
                  <i class="fas fa-phone-alt"></i>&emsp;&emsp;{{
                    item.properties.phone
                  }}
                </p>
                <div class="row">
                  <div class="col-6">
                    <div class="adultMask">
                      <p>成人口罩</p>
                      <h4>{{ item.properties.mask_adult }}<span>個</span></h4>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="childMask">
                      <p>兒童口罩</p>
                      <h4>{{ item.properties.mask_child }}<span>個</span></h4>
                    </div>
                  </div>
                </div>
                <p class="storeUpdated">
                  最後更新時間 {{ item.properties.updated }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div id="mapContainer" class="col-12 col-lg-5 ">
          <div id="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import L from 'leaflet';
import cityName from '@/assets/cityName.json';
import $ from 'jquery';

// 引入 leaflet.markercluster
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/leaflet.markercluster';

let osmMap = {};
var markers = new L.MarkerClusterGroup();

// 創建icon圖標
const greenIcon = new L.Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default {
  name: 'Home',
  data: () => ({
    data: [],
    cityName,
    select: {
      city: '臺北市',
      area: '大安區',
    },
  }),
  methods: {
    updateMap() {
      var result = this.data.filter(function(element, index, arr) {
        return arr.indexOf(element) === index;
      });

      result.forEach((pharmacy) => {
        // console.log(pharmacy)
        const { geometry, properties } = pharmacy;
        let mes = `<strong>${properties.name}</strong> <br> 口罩剩餘:<strong>成人 - ${properties.mask_adult}個 / 兒童 - ${properties.mask_child} 個</strong> <br> 地址: <a href="https://www.google.com.tw/maps/place/${properties.address}" target="_blank">${properties.address}</a><br>電話: ${properties.phone}<br><small>最後更新時間: ${properties.updated}</small>`;
        let marker = L.marker(
          [geometry.coordinates[1], geometry.coordinates[0]],
          { icon: greenIcon }
        ).bindPopup(mes);
        markers.addLayer(marker);

        // console.log(properties);
        osmMap.addLayer(markers);
      });
    },
    removeMarker() {
      osmMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          osmMap.removeLayer(layer);
        }
      });
    },
    flyTo(item) {
      const { geometry, properties } = item;
      let mes = `<strong>${properties.name}</strong> <br> 口罩剩餘:<strong>成人 - ${properties.mask_adult}個 / 兒童 - ${properties.mask_child} 個</strong> <br> 地址: <a href="https://www.google.com.tw/maps/place/${properties.address}" target="_blank">${properties.address}</a><br>電話: ${properties.phone}<br><small>最後更新時間: ${properties.updated}</small>`;
      // console.log(item);
      console.log(properties);
      osmMap.flyTo([geometry.coordinates[1], geometry.coordinates[0]], 18);
      osmMap.openPopup(mes, [geometry.coordinates[1], geometry.coordinates[0]]);
      //  vm.markers[i].openPopup();
      // L.marker([geometry.coordinates[1], geometry.coordinates[0]]).openPopup("123")
    },
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    pharmacies() {
      return this.data.filter((pharmacy) => {
        if (!this.select.area) {
          return pharmacy.properties.county === this.select.city;
        } else if (this.select.area === '請選擇鄉鎮市區') {
          return (
            pharmacy.properties.county === this.select.city &&
            pharmacy.properties.town === this.select.area
          );
        } else {
          return (
            pharmacy.properties.town === this.select.area &&
            pharmacy.properties.county === this.select.city
          );
        }
      });
    },
  },
  mounted() {
    const api =
      'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
    // this.isLoading = true;
    this.$store.dispatch('updateLoading', true)
    this.$http.get(api).then((response) => {
      // console.log(response.data);
      // this.isLoading = false;
      this.$store.dispatch('updateLoading', false)
      this.data = response.data.features;
      this.updateMap();
    });

    // 初始化
    osmMap = L.map('map', {
      center: [25.040065, 121.523235], //台北市區的經緯度 (地圖中心)
      zoom: 8, //地圖預設尺度
      // zoom: 10, //地圖預設尺度
      // zoomControl: false, //是否顯示預設的縮放按鈕 (左上角)
    });

    // 新增圖資圖層（OSM 圖資）
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(osmUrl, {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | 資料來源：<a href="https://data.nhi.gov.tw/Datasets/DatasetResource.aspx?rId=A21030000I-D50001-001&fbclid=IwAR11LdkhQPr1nyASKg0bUCx6LnIGY7KECOeVQ2EHwc67f2iKocIMuXRIpFE">衛生福利部中央健康保險署</a> | Created by <a href="https://www.facebook.com/luffychen0715?ref=bookmarks" target="_blank">Fei</a>',
      minZoom: 8, // 最小縮法尺度
      maxZoom: 18, // 最大縮放尺度
    }).addTo(osmMap);
  },
};
</script>

<style lang="sass" scoped>
@import '@/assets/sass/home.sass'
</style>
