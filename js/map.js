var map;

var directionsService;
var directionsDisplay;
var feat = [];

function onGoogleMapResponse(){
    
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
      center: {lat: 40.7291, lng: -73.9965},
      zoom: 11,
      gestureHandling: 'greedy'
    });

    directionsDisplay.setMap(map);

    map.data.loadGeoJson(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');

    var n = 0;
    map.data.setStyle(function(feature) {
      
      if (feature.getProperty('BoroCD')%100 < 19) {
        feat[n++] = feature;
        return {
          fillColor:strokeDis(parseInt(feature.getProperty('BoroCD')/100)),
          fillOpacity:0.2,
          strokeColor:strokeDis(parseInt(feature.getProperty('BoroCD')/100)),
          strokeWeight: 1.5
        };
      } else {
        return {
          fillOpacity:0,
          strokeWeight: 0
        };
      }
    });
    map.data.addListener('mouseover', function(event) {
      map.data.revertStyle();
      map.data.overrideStyle(event.feature,fDis(event.feature));
    });
}

function fDis(a) {
  if (a.getProperty('BoroCD')%100 < 19) {
    return {fillOpacity:0};
  } else {
    return {fillOpacity:0};
  }
}

function strokeDis(n) {
    switch (n) {
      case 1:
        //azul
      return "#0A2DC6";
      break;
      case 2:
        //morado
      return "#C60A9E";
      break;
      case 3:
        //rojo
      return "#E63D3D";
      break;
      case 4:
        //verde
      return "#74C60A";
      break;
      case 5:
        //azul claro
      return "#0AB8C6";
      break;
      default:
      return "black";
    }
  }

var MarcadorU;

var fueCreadoU = [false,false]; //[creado, visible]
function ponerMarcador(){
    
    if(!fueCreadoU[0]){ //Si no fue creado
      //#1761d1
      var image = "https://www.shareicon.net/data/128x128/2015/04/27/29378_school_32x37.png";
      MarcadorU = new google.maps.Marker({
        position: {lat: 40.7291, lng: -73.9965}, // Se la cambio con geocoder
        map: map,
        icon: image,
        title: 'NYU Stern School of Business'
        //opacity: 0.8
      });
      // var country = "NYU Stern School of Business";
      // var geocoder = new google.maps.Geocoder();
      // geocoder.geocode( { 'address' : country}, function(results, status){
      //  if(status == google.maps.GeocoderStatus.OK){
      //    Marcador.setPosition(results[0].geometry.location);
      //    map.setZoom(14);
      //  };
      // });
      map.setCenter({lat: 40.7291, lng: -73.9965});
      fueCreadoU=[true,true];
    }else if(fueCreadoU[1]){ //Si es visible
      MarcadorU.setMap(null);
      fueCreadoU=[true,false];
    }else{ //Si NO es visible
      MarcadorU.setMap(map);
      fueCreadoU=[true,true];
      map.setCenter({lat: 40.7291, lng: -73.9965});
    }
  
}


var fueCreadoB = [false,false]; //[creado, visible]
var marcBarrios = [];
var markerClusterBarr;
function MarcarBarrios() {
 // if(!fueCreadoB[0]){ //Si no fue creado
    var marcador;
    for (var i = 1; i < DATOS_BARRIOS.length; i++) {
        marcador = new google.maps.Marker({
        position: {lat: parseFloat(DATOS_BARRIOS[i][3][1]), lng: parseFloat(DATOS_BARRIOS[i][3][0])},
        map: map,
        title: DATOS_BARRIOS[i][1],
        icon: "https://www.shareicon.net/data/128x128/2015/06/19/56414_blue_32x32.png"
        });
        marcBarrios.push(marcador);
    }
    
    markerClusterBarr = new MarkerClusterer(map, marcBarrios,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    markerClusterBarr.clearMarkers();
    /*
    fueCreadoB=[true,true];
  }else if(fueCreadoB[1]){ //Si es visible
    for (var i = 0; i < marcBarrios.length; i++) {
      marcBarrios[i].setMap(null);
    }
    fueCreadoB=[true,false];
  }else{ //Si NO es visible
    for (var i = 0; i < marcBarrios.length; i++) {
        marcBarrios[i].setMap(map);
    }
    fueCreadoB=[true,true];
  }*/
}

function medirDistancias(){
  var latf = 40.7291, lngF= -73.9965;
  var rlatf = (latf*Math.PI)/180;
  var rlngf = (lngF*Math.PI)/180;
  var distance, latDelta, lonDelta, rlat0, rlng0;
  for (var i = 1; i < DATOS_BARRIOS.length; i++) {
    var lat0 = parseFloat(DATOS_BARRIOS[i][3][1]);
    var lng0 = parseFloat(DATOS_BARRIOS[i][3][0]);
    rlat0 = (lat0*Math.PI)/180;
    rlng0 = (lng0*Math.PI)/180;
    latDelta = rlatf - rlat0;
    lonDelta = rlngf - rlng0;
    //distancia en km
    distance = (6371 *Math.acos(Math.cos(rlat0) * Math.cos(rlatf) * Math.cos(lonDelta) + Math.sin(rlat0) * Math.sin(rlatf)));
    DATOS_BARRIOS[i].push(distance);
  }
    ordenarDistancias();
}

var ArregloDistancias;
function ordenarDistancias(){
  ArregloDistancias=DATOS_BARRIOS.slice();
  ArregloDistancias.sort(function (a, b) {
    if (a[4] > b[4]) {
      return 1;
    }
    if (a[4] < b[4]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
 
}

var fueCreadoDist = [false,false]; //[creado, visible]
var MarcadorDistancia;

function marcadorDistancia(index) {
  if(!fueCreadoDist[0]){ //Si no fue creado
        MarcadorDistancia = new google.maps.Marker({
          position: infoDis[index][3],
          //position: {lat: parseFloat(DATOS_BARRIOS[index][3][1]), lng: parseFloat(DATOS_BARRIOS[index][3][0])},
          map: map,
          title: infoDis[index][0]
        });

    fueCreadoDist=[true,true];
    //no aparezca doble
    MarcadorDistancia.setMap(null);
    
  }else if(fueCreadoDist[1]){ //Si es visible
      MarcadorDistancia.setMap(null);
    fueCreadoDist=[true,false];
  }else{ //Si NO es visible
        MarcadorDistancia.setMap(map);
    fueCreadoDist=[true,true];
  }
}

function mostrarRuta() {
  directionsService.route({
    origin: MarcadorDistancia.getPosition(),
    destination: MarcadorU.getPosition(),
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
      var route = response.routes[0];
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
  //map.setZoom(11);
}

var markersComp = [];
var markerClusterComp;

function MarcarComparar() {  
  
  var marker = new google.maps.Marker({
    position: calfDis0[3],
    map: map,
    //label: '1',
    icon: iconoTopComparar(1),
    title: ArrayComparar[0][0]
  });

  markersComp.push(marker);

  marker = new google.maps.Marker({
    position: calfDis1[3],
    map: map,
    //label: '2',
    icon: iconoTopComparar(2),
    title: ArrayComparar[1][0]
  });
  markersComp.push(marker);

  marker = new google.maps.Marker({
    position: calfDis2[3],
    map: map,
    //label: '3',
    icon: iconoTopComparar(3),
    title: ArrayComparar[2][0]
  });
  markersComp.push(marker);

  markerClusterComp = new MarkerClusterer(map, markersComp,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  markerClusterComp.clearMarkers();
}

