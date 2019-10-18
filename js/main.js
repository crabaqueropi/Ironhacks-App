const URL_BARRIOS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";

var response;

function getData(url){
  response = $.get(url, () =>{
  })
  .done(()=>{
    //llenar_datos_barrios();
  })
}

var DATOS_BARRIOS = new Array();
DATOS_BARRIOS.push(0);

var datosBarrios = false;
function llenar_datos_barrios(){
  if(!datosBarrios){
    var response = $.get(URL_BARRIOS, () =>{})
    .done(()=>{
      for(var i = 0; i < 299; i++){
        //numero, nombre, ciudad, localización
        var localizacion = response.responseJSON.data[i][8];
        var newlocalizacion = (localizacion.substr(7,localizacion.length)).substr(0,localizacion.length-8);
        var arregloLocalizacion = newlocalizacion.split(' ');
        var arr = [response.responseJSON.data[i][9], response.responseJSON.data[i][10], response.responseJSON.data[i][16], arregloLocalizacion];
        DATOS_BARRIOS.push(arr);
      }
      actualizarTablaBarrios();
      actualizarTablaDistancia();
      ponerGrafico();
    });
    datosBarrios = true;
  }
}

var tablaBarrios = false;
function actualizarTablaBarrios(){
  if(!tablaBarrios){
    const tableBody = $('#mainTableBody')[0];
    var newRow;
    for(var i = 1; i < 300; i++){
      newRow = tableBody.insertRow(tableBody.rows.length);
      numeroB = newRow.insertCell(0);
      nombreBarrio = newRow.insertCell(1);
      boro = newRow.insertCell(2);
      
      numeroB.innerHTML = DATOS_BARRIOS[i][0];
      nombreBarrio.innerHTML = DATOS_BARRIOS[i][1];
      boro.innerHTML = DATOS_BARRIOS[i][2];
    }
    tablaBarrios = true;
  }
}

var csvDistritos;
var tablaDistritos = false;
function actualizarTablaDistritos(){
  if(!tablaDistritos){
    
    for(var i = 0; i < crimDisCop.length; i++){
      var nuevo_e = $('<tr id="DistTr'+(i+1)+'"></tr>');
      $('#mainTableBody2').append(nuevo_e);

      //var col1 = $('<td id="td'+(i+1)+'">'+(i+1)+'</td>');
      var col1 = $('<td>'+(i+1)+'</td>');
      var col2 = $('<td>'+(crimDisCop[i][0] + "-" + crimDisCop[i][1])+'</td>');
      var col3;
      if(crimDisCop[i][5]>=40.0){
        col3 = $('<td class="text-success">'+ crimDisCop[i][5].toFixed(1)+'</td>');
      }else if(crimDisCop[i][5]>=30.0){
        col3 = $('<td class="text-secondary">'+ crimDisCop[i][5].toFixed(1)+'</td>');
      }else{
        col3 = $('<td class="text-danger">'+ crimDisCop[i][5].toFixed(1)+'</td>');
      }


      //$('#tr'+(i+1)+'').append(col1);
      $('#DistTr'+(i+1)+'').append(col1);
      $('#DistTr'+(i+1)+'').append(col2);
      $('#DistTr'+(i+1)+'').append(col3);
    }
    tablaDistritos = true;
    
    var lineArray = [];

    for(var j=0; j<crimDisCop.length;j++){
      var line = crimDisCop[j].join(",");
      lineArray.push(j == 0 ? "data:text/csv;charset=utf-8,Borough,Distrito,NumeroCrimenes,boroCD,CalificacionCrimenes,CalificacionTotal\n" + line : line);
    }
    csvDistritos = lineArray.join("\n");
  }
}

var tablaDistancia = false;
function actualizarTablaDistancia(){
  if(!tablaDistancia){
    obtenerCentrosYdistancias();
    for(var i = 0; i < 10; i++){
      var nuevo_e = $('<tr id="tr'+(i+1)+'"></tr>');
      $('#cuerpoTablaDistancia').append(nuevo_e);

      //var col1 = $('<td id="td'+(i+1)+'">'+(i+1)+'</td>');
      var col2 = $('<td>'+infoDis[i][0]+'</td>');
      var col3 = $('<td>'+infoDis[i][1]+'</td>');
      //var col4 = $('<td>'+ ArregloDistancias[i][4] +' km</td>');
      var col4 = $('<td>'+ (infoDis[i][2]/1000).toFixed(3) +' km</td>');
      
      var col5;
      if(infoDis[i][5]>=40.0){
        col5 = $('<td class="text-success">'+ infoDis[i][5].toFixed(1)+'</td>');
      }else if(infoDis[i][5]>=30.0){
        col5 = $('<td class="text-secondary">'+ infoDis[i][5].toFixed(1)+'</td>');
      }else{
        col5 = $('<td class="text-danger">'+ infoDis[i][5].toFixed(1)+'</td>');
      }
      

      //$('#tr'+(i+1)+'').append(col1);
      $('#tr'+(i+1)+'').append(col2);
      $('#tr'+(i+1)+'').append(col3);
      $('#tr'+(i+1)+'').append(col4);
      $('#tr'+(i+1)+'').append(col5);
    }
    tablaDistancia = true;   
  }
}

var tablaCrimenes = false;
function actualizarTablaCrimenes(){
  if(!tablaCrimenes){
    //const tableBody = $('#cuerpoTablaCrimenes')[0];
    for(var i = 0; i < 10; i++){

      var nuevo_e = $('<tr id="CrimTr'+(i+1)+'"></tr>');

      $('#cuerpoTablaCrimenes').append(nuevo_e);

      //var col1 = $('<td id="CrimTd'+(i+1)+'">'+(i+1)+'</td>');
      var col2 = $('<td>'+crimDis[i][0]+'</td>');
      var col3 = $('<td>'+crimDis[i][1]+'</td>');
      var col4 = $('<td>'+crimDis[i][2]+'</td>');
      var col5;
      if(crimDis[i][4]>=40.0){
        col5 = $('<td class="text-success">'+ crimDis[i][4].toFixed(1)+'</td>');
      }else if(crimDis[i][4]>=30.0){
        col5 = $('<td class="text-secondary">'+ crimDis[i][4].toFixed(1)+'</td>');
      }else{
        col5 = $('<td class="text-danger">'+ crimDis[i][4].toFixed(1)+'</td>');
      }

      //$('#CrimTr'+(i+1)+'').append(col1);
      $('#CrimTr'+(i+1)+'').append(col2);
      $('#CrimTr'+(i+1)+'').append(col3);
      $('#CrimTr'+(i+1)+'').append(col4);
      $('#CrimTr'+(i+1)+'').append(col5);
    }
    tablaCrimenes = true;
    ponerGraficoSeguridad();
  }
}

var tablaHospedajes = false;
function actualizarTablaHospedajes(){
  if(!tablaHospedajes){
    for(var i = 0; i < 10; i++){

      var nuevo_e = $('<tr id="HospTr'+(i+1)+'"></tr>');

      $('#cuerpoTablaHospedajes').append(nuevo_e);

      //var col1 = $('<td id="HospTd'+(i+1)+'">'+(i+1)+'</td>');
      var col2 = $('<td>'+infoHous[i][0]+'</td>');
      var col3 = $('<td>'+infoHous[i][1]+'</td>');
      var col4 = $('<td>'+infoHous[i][2]+'</td>');
      var col5;
      if(infoHous[i][4]>=40.0){
        col5 = $('<td class="text-success">'+ infoHous[i][4].toFixed(1)+'</td>');
      }else if(infoHous[i][4]>=30.0){
        col5 = $('<td class="text-secondary">'+ infoHous[i][4].toFixed(1)+'</td>');
      }else{
        col5 = $('<td class="text-danger">'+ infoHous[i][4].toFixed(1)+'</td>');
      }

      //$('#HospTr'+(i+1)+'').append(col1);
      $('#HospTr'+(i+1)+'').append(col2);
      $('#HospTr'+(i+1)+'').append(col3);
      $('#HospTr'+(i+1)+'').append(col4);
      $('#HospTr'+(i+1)+'').append(col5);
    }
    tablaHospedajes = true;
  }
}

var tablaComparar = false;
function actualizarTablaComparar(){
  if(!tablaComparar){
    
    setTimeout(function(){ 
      
      for(var i = 0; i < 3; i++){
        var nuevo_e = $('<tr id="CompTr'+(i+1)+'"></tr>');
        $('#cuerpoTablaComparar').append(nuevo_e);

        //var col1 = $('<td id="td'+(i+1)+'">'+(i+1)+'</td>');
        var col1 = $('<td>'+crimDisCop[i][0]+'</td>');
        var col2 = $('<td>'+crimDisCop[i][1]+'</td>');
        var col3;
        if(crimDisCop[i][5]>=40.0){
          col3 = $('<td class="text-success">'+ crimDisCop[i][5].toFixed(1)+'</td>');
        }else if(crimDisCop[i][5]>=30.0){
          col3 = $('<td class="text-secondary">'+ crimDisCop[i][5].toFixed(1)+'</td>');
        }else{
          col3 = $('<td class="text-danger">'+ crimDisCop[i][5].toFixed(1)+'</td>');
        }

        //$('#tr'+(i+1)+'').append(col1);
        $('#CompTr'+(i+1)+'').append(col1);
        $('#CompTr'+(i+1)+'').append(col2);
        $('#CompTr'+(i+1)+'').append(col3);
      }
      tablaComparar = true;   
      graficobarras();
    }, 2100); 
  }
}

var creada=false;
function yaCrearonMarcador(){
  if(creada){
     fueCreadoDist = [false,false];
     MarcadorDistancia.setMap(null);
  }else{
    creada = true;
  }
}

function ponerRuta(index){
  yaCrearonMarcador();
  marcadorDistancia(index-1);
  mostrarRuta();
}

var ponerCrimenes = false;
var obtuvoMarcaCrimenes = false;
function marcarCrimenes() {
  //obtenerCrimenes();
  if(!obtuvoMarcaCrimenes){
    $(".loader").fadeIn(500);
  }
  ponerCrimenes=!ponerCrimenes;
  setTimeout(function functionName() {
    if (ponerCrimenes) {
      markerClusterCri.addMarkers(markersCri);
    } else {
      markerClusterCri.clearMarkers();
    }
  },!obtuvoMarcaCrimenes?500:0);
  $(".loader").fadeOut(500);
  obtuvoMarcaCrimenes = true;
}
var ponerHospedajes = false;
function marcarHospedajes() {
  ObtenerHospedajes();
  ponerHospedajes=!ponerHospedajes;
  if (ponerHospedajes) {
    markerClusterHous.addMarkers(marksHous);
  } else {
    markerClusterHous.clearMarkers();
  }
}


var ponerMuseos = false;
var obtuvoMarcaMus = false;
function marcarMuseos() {
  if(!obtuvoMarcaMus){
    $(".loader").fadeIn(500);
  }
  ObtenerMuseos();
  ponerMuseos=!ponerMuseos;
  setTimeout(function functionName() {
    if (ponerMuseos) {
      markerClusterMuseos.addMarkers(marksMuseos);
    } else {
      markerClusterMuseos.clearMarkers();
    }
  },!obtuvoMarcaMus?600:0);
  $(".loader").fadeOut(500);
  obtuvoMarcaMus = true;
}

var ponerFM = false;
var obtuvoMarcaFM = false;
function marcarFM() {
  if(!obtuvoMarcaFM){
    $(".loader").fadeIn(500);
  }
  ObtenerFM();
  ponerFM=!ponerFM;
  setTimeout(function functionName() {
    if (ponerFM) {
      markerClusterFM.addMarkers(marksFM);
    } else {
      markerClusterFM.clearMarkers();
    }
  },!obtuvoMarcaFM?900:0);
  $(".loader").fadeOut(500);
  obtuvoMarcaFM = true;
}

var ponerArt = false;
var obtuvoMarcaArt = false;
function marcarArt() {
  if(!obtuvoMarcaArt){
    $(".loader").fadeIn(500);
  }
  ObtenerArt();
  ponerArt=!ponerArt;
  setTimeout(function functionName() {
    if (ponerArt) {
      markerClusterArt.addMarkers(marksArt);
    } else {
      markerClusterArt.clearMarkers();
    }
  },!obtuvoMarcaArt?600:0);
  $(".loader").fadeOut(500);
  obtuvoMarcaArt = true;
}

var ponerWF = false;
var obtuvoMarcaWF = false;
function marcarWF() {
  if(!obtuvoMarcaWF){
    $(".loader").fadeIn(500);
  }
  ObtenerWF();
  ponerWF=!ponerWF;
  setTimeout(function functionName() {
    if (ponerWF) {
      markerClusterWF.addMarkers(marksWF);
    } else {
      markerClusterWF.clearMarkers();
    }
  },!obtuvoMarcaWF?600:0);
  $(".loader").fadeOut(500);
  obtuvoMarcaWF = true;
}

var ponerLB = false;
var obtuvoMarcaLB = false;
function marcarLB() {
  if(!obtuvoMarcaLB){
    $(".loader").fadeIn(500);
  }
  ObtenerLB();
  ponerLB=!ponerLB;
  setTimeout(function functionName() {
    if (ponerLB) {
      markerClusterLB.addMarkers(marksLB);
    } else {
      markerClusterLB.clearMarkers();
    }
  },!obtuvoMarcaLB?600:0);
  $(".loader").fadeOut(500);
  obtuvoMarcaLB = true;
}

var ponerBarrios = false;
var obtuvoMarca = false;
function btnMarcarBarrios() {
  if(!obtuvoMarca){
    MarcarBarrios();
    obtuvoMarca = true;
  }
  ponerBarrios=!ponerBarrios;
  if (ponerBarrios) {
    markerClusterBarr.addMarkers(marcBarrios);
  } else {
    markerClusterBarr.clearMarkers();
  }
}

var ponerTopCrimenes = false;
var obtuvoMarcaCrim = false;
var primeraVezCrim =false;
function marcarTopCrimenes(ocultar) {
  if(!primeraVezCrim){
     primeraVezCrim=true;
     ocultar = "si"
  }
  if(ocultar=="si"){
    obtenerCrimenes();
    ponerTopCrimenes=!ponerTopCrimenes;
    setTimeout(function functionName() {
      if (ponerTopCrimenes) {
        markerClusterTopCri.addMarkers(markerTopCri);
        ocultarMarcadoresTop(1);
      } else {
        markerClusterTopCri.clearMarkers();
      }
    },!obtuvoMarcaCrim?500:0);
    obtuvoMarcaCrim = true;
  }
}

var ponerTopHospedajes = false;
var obtuvoMarcaHosp = false;
var primeraVezHosp =false;

function marcarTopHospedajes(ocultar) {
  //ObtenerHospedajes();
  if(!primeraVezHosp){
    primeraVezHosp=true;
    ocultar = "si"
  }
  if(ocultar=="si"){
    ponerTopHospedajes=!ponerTopHospedajes;
    setTimeout(function functionName() {
      if (ponerTopHospedajes) {
        markerClusterTopAseq.addMarkers(markersTopAsequ);
        ocultarMarcadoresTop(2);
      } else {
        markerClusterTopAseq.clearMarkers();
      }
    },!obtuvoMarcaHosp?500:0);
    obtuvoMarcaHosp = true;
  }
}

var ponerTopComparar = false;
var obtuvoMarcaComp = false;
var primeraVezComp =false;
var loading=true;

function marcarTopComparar(ocultar) {
  if(!primeraVezComp){
    primeraVezComp=true;
    ocultar = "si"
    if(loading){
      $(".loader").fadeIn(800);
      loading=false;
    }
  }
  if(ocultar=="si"){
    ponerTopComparar=!ponerTopComparar;
    setTimeout(function functionName() {
      if (ponerTopComparar) {
        markerClusterComp.addMarkers(markersComp);
        ocultarMarcadoresTop(3);
        $(".loader").fadeOut(800);
      } else {
        markerClusterComp.clearMarkers();
      }
    },!obtuvoMarcaComp?2500:0);
    obtuvoMarcaComp = true;
  }
}

function ocultarRuta(){
  directionsDisplay.setMap(null);
  map.setZoom(11);
}

function ocultarMarcadoresTop(pest){
  switch(pest) {
    case 1:
      if(ponerTopHospedajes){
        marcarTopHospedajes("si");
        primeraVezHosp =false;
      }
      if(ponerTopComparar){
        marcarTopComparar("si");
        primeraVezComp =false;
      }
      ocultarRuta();
      break;
    case 2:
      if(ponerTopCrimenes){
        marcarTopCrimenes("si");
        primeraVezCrim =false;
      }
      if(ponerTopComparar){
        marcarTopComparar("si");
        primeraVezComp =false;
      }
      ocultarRuta();
      break;
      case 3:
      if(ponerTopCrimenes){
        marcarTopCrimenes("si");
        primeraVezCrim =false;
      }
      if(ponerTopHospedajes){
        marcarTopHospedajes("si");
        primeraVezHosp =false;
      }
      ocultarRuta();
      break;
    default:
      if(ponerTopCrimenes){
        marcarTopCrimenes("si");
        primeraVezCrim =false;
      }
      if(ponerTopHospedajes){
        marcarTopHospedajes("si");
        primeraVezHosp =false;
      }
      if(ponerTopComparar){
        marcarTopComparar("si");
        primeraVezComp =false;
      }
      ocultarRuta();
      break;
  }
}



function preCargarFunciones(){
  
  setTimeout(function(){
    onGoogleMapResponse();
    setTimeout(function(){
      ponerMarcador();
      setTimeout(function(){
        llenar_datos_barrios();
        $("#msg1").fadeOut(1400,function(){
          $("#msg1 h5").remove();
          var nuevo_e = $('<h5 style="color:#EEE5E5;">You can see the Top 10 of NY Districts in Distance, Security and Affordability on the left side of the screen</h5>');
          $('#msg1').append(nuevo_e);
          $("#msg1").fadeIn(1000);
        });
        setTimeout(function(){
          obtenerCentrosYdistancias();
          setTimeout(function(){
            obtenerCrimenes();
            ObtenerHospedajes();
            llenar_datos_barrios();
            $("#msg1").fadeOut(2000,function(){
              $("#msg1 h5").remove();
              var nuevo_e = $('<h5 style="color:#EEE5E5;">You can put Markers on the right side of the screen</h5>');
              $('#msg1').append(nuevo_e);
              $("#msg1").fadeIn(1000);
            });
            setTimeout(function(){
              calificarDistritos();
              actualizarTablaComparar();
              /*setTimeout(function(){
            actualizarTablaDistritos();*/
              $(".loader").fadeOut(2500);
              $("#msg1 h5").remove();
              //$(".sk-folding-cube").fadeOut(2000);
              //$('.loader').toggle("slow");
              /*},10000);*/
            },7200);
          },4000);
        },3900);
      },3000);
    },3000);
  }, 1000);


}

var oculto=true;
function agrandarBarra(){
  map.setCenter({lat: 40.7291, lng: -73.9965});
  if(oculto){
    $("#barraDesplegable").toggleClass("col-md-4");
    $("#divMapa").toggleClass("col");
    $("#divMapa").toggleClass("col-md-8");

    $("#distancia").css({"margin-left":"0px","height":"100%"});
    $("#seguridad").css({"margin-left":"0px","height":"100%"});
    $("#asequibilidad").css({"margin-left":"0px","height":"100%"});
    $("#comparar").css({"margin-left":"0px","height":"100%"});
    $("#barrios").css({"margin-left":"0px","height":"100%"});
    
    oculto=false;
  }
}

function ocultarBarra(){
  if(!oculto){
    $("#barraDesplegable").toggleClass("col-md-4");
    $("#divMapa").toggleClass("col");
    $("#divMapa").toggleClass("col-md-8");

    $("#distancia").css({"margin-left":"500px","height":"10px"});
    $("#seguridad").css({"margin-left":"500px","height":"10px"});
    $("#asequibilidad").css({"margin-left":"500px","height":"10px"});
    $("#comparar").css({"margin-left":"500px","height":"10px"});
    $("#barrios").css({"margin-left":"500px","height":"10px"});
    
    oculto=true;
  }
}


$(document).ready(function(){
  var height = $(window).height();
  var width = $(window).width();
  $('#googleMapContainer').height(height*0.85);
  $('.tablaDistritos').height(height*0.38);
    
  //$('.cardposition').width(width*0.2);
  
  
  $('#distancia-tab').on('click', ()=>{agrandarBarra();/*llenar_datos_barrios();obtenerCentrosYdistancias();*/ocultarMarcadoresTop(-1);$('.nav-item').tooltip('hide');});
  $('#seguridad-tab').on('click', () =>{agrandarBarra();/*obtenerCrimenes();*/marcarTopCrimenes("no");$('.nav-item').tooltip('hide');});
  $('#asequibilidad-tab').on('click', ()=>{agrandarBarra();/*ObtenerHospedajes();*/marcarTopHospedajes("no");$('.nav-item').tooltip('hide');});
  $('#comparar-tab').on('click', ()=>{agrandarBarra();/*calificarDistritos();actualizarTablaComparar();*/marcarTopComparar("no");$('.nav-item').tooltip('hide');});
  $('#barrios-tab').on('click', ()=>{agrandarBarra();/*llenar_datos_barrios();*/ocultarMarcadoresTop(-1);$('.nav-item').tooltip('hide');});
  $('#volver-tab').on('click', ()=>{ocultarBarra();ocultarMarcadoresTop(-1);$('.nav-item').tooltip('hide');});
  
  $("#marcarBarrios").on("click", btnMarcarBarrios);
  $("#marcarCrimenes").on("click", marcarCrimenes);
  $("#marcarHospedajes").on("click", marcarHospedajes);
  
  //$("#marcador").on("click", ponerMarcador);
  $(document).on("click", "#tr1", function(){ponerRuta(1);});
  $(document).on("click", "#tr2", function(){ponerRuta(2);});
  $(document).on("click", "#tr3", function(){ponerRuta(3);});
  $(document).on("click", "#tr4", function(){ponerRuta(4);});
  $(document).on("click", "#tr5", function(){ponerRuta(5);});
  $(document).on("click", "#tr6", function(){ponerRuta(6);});
  $(document).on("click", "#tr7", function(){ponerRuta(7);});
  $(document).on("click", "#tr8", function(){ponerRuta(8);});
  $(document).on("click", "#tr9", function(){ponerRuta(9);});
  $(document).on("click", "#tr10", function(){ponerRuta(10);});
  
  $('[data-toggle="tooltip"]').tooltip();  
  
  $("#descargarTablaDistancia").on("click", descDist);
  $("#descargarTablaSeguridad").on("click", descSeg);
  $("#descargarTablaAsequibilidad").on("click", descAseq);
  $("#descargarTablaComparar").on("click", descComp);
  $("#descargarTablaDistritos").on("click", descDistritos);  
});

function descDist(){
  var encodedUri = encodeURI(csvDistancia);

  link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Distancia_A_NYU.csv');
  link.click();
}

function descSeg(){
  var encodedUri = encodeURI(csvSeguridad);

  link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Crimenes_Por_Distritos_De_NY.csv');
  link.click();
}

function descAseq(){
  var encodedUri = encodeURI(csvAsequibilidad);

  link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Asequibilidad_Por_Distritos_De_NY.csv');
  link.click();
}

function descComp(){
  var encodedUri = encodeURI(csvComparar);

  link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Comparar_Distritos_De_NY.csv');
  link.click();
}

function descDistritos(){
  var encodedUri = encodeURI(csvDistritos);

  link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Districts_Of_NYU.csv');
  link.click();
}


var poligonosPorBoro=[[],[],[],[],[]];
var yaSeGuardaron=false;
function guardarPoligonosArray() {
  if (!yaSeGuardaron) {
    for (var i = 0; i < feat.length; i++) {
      //reviso distritos habitables
      if (feat[i].l.BoroCD%100 < 19) {
        //arreglo para guardar los límites del poligono
        var bounds = [];
        //Si es un solo poligono o es multipoligonos("islas")
        if(feat[i].j.j.length == 1){
          for (k = 0; k < feat[i].j.j[0].j.length; k++) {
            //guardo los límites del poligono
            bounds.push(feat[i].j.j[0].j[k]);
          }

          var pol= new google.maps.Polygon({
            paths:bounds
          });
          //saco valor del borough
          var b = parseInt(feat[i].l.BoroCD/100);
          //almaceno BoroCD y pol
          poligonosPorBoro[b-1].push([feat[i].l.BoroCD,pol]);

        }else {
          //por cada poligono
          for (var u = 0; u < feat[i].j.j.length; u++) {
            for (k = 0; k < feat[i].j.j[u].j[0].j.length; k++) {
              bounds.push(feat[i].j.j[u].j[0].j[k]);
            }
            var pol= new google.maps.Polygon({
              paths:bounds
            });
            var b = parseInt(feat[i].l.BoroCD/100);
            poligonosPorBoro[b-1].push([feat[i].l.BoroCD,pol]);
          }
        }
      }
    }
    yaSeGuardaron = true;
  }
}

//const UrlCrimenes = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000";
const UrlCrimenes = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$where=cmplnt_fr_dt=%222015-12-31T00:00:00%22&$limit=50000";
var infoCri = [];
var criPoints = [];
var yaObtuvoCrim = false;
var crimDis = [];
var bcd = [];
var markersCri = [];
var markerClusterCri;

function obtenerCrimenes() {
  guardarPoligonosArray();
  if (!yaObtuvoCrim) {
    yaObtuvoCrim =true;
    //obtengo los datos
    var data = $.get(UrlCrimenes, () =>{})
    //si todo salió bien
    .done(function(){
      //guardo lo recibido en dataR
      var dataR = data.responseJSON;
      //para cada crimen
      for (var i = 0; i < dataR.length; i++) {
        //guardo coordenadas(lat,lng)
        var coor = new google.maps.LatLng(parseFloat(dataR[i].latitude),parseFloat(dataR[i].longitude));
        //guardo en el arreglo [boro,queFue,coordenadas]
        infoCri.push([dataR[i].boro_nm,dataR[i].ofns_desc,coor]);
        //creo marcador
        //funcion
        //
        var numero;

        if(infoCri[i][0]!=undefined){
          if (infoCri[i][0].toUpperCase()=="BROOKLYN") {
            numero = 2;
            infoCri[i][0]="Brooklyn";
          } else if (infoCri[i][0].toUpperCase()=="MANHATTAN") {
            numero = 0;
            infoCri[i][0]="Manhattan";
          } else if (infoCri[i][0].toUpperCase()=="BRONX") {
            numero = 1;
            infoCri[i][0]="Bronx";
          } else if (infoCri[i][0].toUpperCase()=="QUEENS") {
            numero = 3;
            infoCri[i][0]="Queens";
          } else if (infoCri[i][0].toUpperCase()=="STATEN ISLAND") {
            numero = 4;
            infoCri[i][0]="Staten Island";
          }
        }else{
          numero = 3;
          infoCri[i][0]="Queens"; // Revise manualmente la ubicación
        }
        
        //reviso en todos los polígonos del boro 
        for (var j = 0; j < poligonosPorBoro[numero].length; j++) {
          //el polígono contiene las coordenadas?
          if (google.maps.geometry.poly.containsLocation(infoCri[i][2], poligonosPorBoro[numero][j][1])) {
            var ind = bcd.indexOf(poligonosPorBoro[numero][j][0]);
            if (ind != -1) {
              //incrementa un crimen es es boro
              crimDis[ind][2]++;
            } else {
              //agrega a crimDis [boro, (numero para evaluar si es habitable), 1(para llevar cuenta crimenes)]
              crimDis.push([infoCri[i][0],poligonosPorBoro[numero][j][0]%100,1,poligonosPorBoro[numero][j][0]]);
              //controlo que boroCD ha llegado
              bcd.push(poligonosPorBoro[numero][j][0]);
            }
            //Como ya lo encontró, rompe el ciclo
            break;
          }
        }
      }      
      //ordena, e invierte dejando menor a mayor criminalidad
      crimDis = crimDis.sort(compare).reverse();
      
      //Calcular Calificaciones
      var min = crimDis[0][2];
      var max = crimDis[crimDis.length-1][2];
      var m = -50.0/(max-min);
      var b = 50.0 - (m*min);
      var aux = 0;
      for(var i = 0; i<crimDis.length; i++){
        aux=(m*crimDis[i][2])+b;
        if(aux<0){
          crimDis[i][4]=0;
        }else{  
          crimDis[i][4]=aux;
        }
      }
      //ordena
      bcd = bcd.sort();
      
      actualizarTablaCrimenes();
      markSeg();
      
    })

    .fail(function error(){
      console.log(error);
    })
  }
}

function compare(a, b) {
  return (a[2] >= b[2]) ? -1 : 1;
}

function markSeg() {
  
  var icono = "https://www.shareicon.net/data/128x128/2015/06/19/56419_red_32x32.png";
  for (var i = 0; i < infoCri.length; i++) {
    var marcador = new google.maps.Marker({
          position: infoCri[i][2],
          map:map,
          icon:icono,
          title: infoCri[i][1]
        })
        //guardo todos los marcadores
    markersCri.push(marcador);
  }
  markerClusterCri = new MarkerClusterer(map, markersCri,
                                         {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  markerClusterCri.clearMarkers();
}

  const UrlHospedajes = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
  var infoHous=[];
  var housPoints = [];
  var brDis = [];
  var yaObtuvoCrimHosp=false;

  function ObtenerHospedajes() {
    if (!yaObtuvoCrimHosp) {
      var data = $.get(UrlHospedajes, function() {})

      .done(function() {
        var dataR = data.responseJSON.data;
        var distrito;
        var boroCD;
        for (var i = 0; i < dataR.length; i++) {
          distrito = dataR[i][19].split("-")[1];
          
          if(dataR[i][23] != null){
            housPoints.push({lat: parseFloat(dataR[i][23]),lng:parseFloat(dataR[i][24])});
          }

          var ind=brDis.indexOf(dataR[i][19]);

          if(ind != -1){
            infoHous[ind][2] = Math.max(infoHous[ind][2], parseInt(dataR[i][33]));
          }else{
            brDis.push(dataR[i][19]);
            boroCD=boroNumero(dataR[i][15])*100+(distrito%100);
            infoHous.push([dataR[i][15],distrito%100,parseInt(dataR[i][33]),boroCD]);
          }
        }
        
        infoHous = infoHous.sort(compare);
        infoHous.splice(45,1);

        //Calcular Calificaciones
        var max = infoHous[0][2];
        var min = infoHous[infoHous.length-1][2];
        var m = 50.0/(max-min);
        var b = 50.0 - (m*max);
        var aux = 0;
        for(var i = 0; i<infoHous.length; i++){
          aux=(m*infoHous[i][2])+b;
          if(aux<0){
            infoHous[i][4]=0;
          }else{  
            infoHous[i][4]=aux;
          }
        }
        
        markHous();
        actualizarTablaHospedajes();
        ponerGradicoAsequibilidad();
        
        yaObtuvoCrimHosp =true;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }

var markerClusterHous;
var marksHous=[];

function markHous() {
  for (var i = 0; i < housPoints.length; i++) {
    var marcador = new google.maps.Marker({
      position: housPoints[i],
      map:map,
      icon:"https://www.shareicon.net/data/32x32/2015/06/19/56421_yellow_32x32.png"
    })
    marksHous.push(marcador);
  }
  markerClusterHous = new MarkerClusterer(map, marksHous,
                                          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  markerClusterHous.clearMarkers();
  //ObtenerMuseos();
}

const UrlMuseos = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
var markerClusterMuseos;
var marksMuseos=[];
var yaObtuvoMuseos=false;
function ObtenerMuseos() {
    if (!yaObtuvoMuseos) {
      var data = $.get(UrlMuseos, function() {})

      .done(function() {
        var dataR = data.responseJSON.data;
        //8 y 9 (coor, nombre)
        var localizacion;
        var newlocalizacion;
        var arregloLocalizacion;
        
        for (var i = 0; i < dataR.length; i++) {
          localizacion = dataR[i][8];
          newlocalizacion = (localizacion.substr(7,localizacion.length)).substr(0,localizacion.length-8);
          arregloLocalizacion = newlocalizacion.split(' ');

          var marcador = new google.maps.Marker({
            position: {lat: parseFloat(arregloLocalizacion[1]), lng: parseFloat(arregloLocalizacion[0])},
            map:map,
            icon:"https://www.shareicon.net/data/128x128/2015/04/26/29207_court_32x37.png",
            title: dataR[i][9]
          })
          marksMuseos.push(marcador);
        }
        markerClusterMuseos = new MarkerClusterer(map, marksMuseos,
                                                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        markerClusterMuseos.clearMarkers();      

        yaObtuvoMuseos =true;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }

//const UrlFM = "https://data.ny.gov/api/views/xjya-f8ng/rows.json?accessType=DOWNLOAD";
const UrlFM = "https://data.ny.gov/resource/7jkw-gj56.json?$where=city%20in(%27New%20York%27,%27Staten%20Island%27,%27Manhattan%27,%27Bronx%27,%27Brooklyn%27,%27Queens%27)";
var markerClusterFM;
var marksFM=[];
var yaObtuvoFM=false;
function ObtenerFM() {
    if (!yaObtuvoFM) {
      var data = $.get(UrlFM, function() {})

      .done(function() {
        var dataR = data.responseJSON;
        //9 y 22,23 (nombre, coor)
        
        for (var i = 0; i < dataR.length; i++) {
          var marcador = new google.maps.Marker({
            position: {lat: parseFloat(dataR[i].latitude), lng: parseFloat(dataR[i].longitude)},
            map:map,
            icon:"https://www.shareicon.net/data/128x128/2015/04/26/29163_flower_32x37.png",
            title: (dataR[i].market_name + " (" + dataR[i].operation_hours + ")")
          })
          marksFM.push(marcador);
        }
        markerClusterFM = new MarkerClusterer(map, marksFM,
                                                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        markerClusterFM.clearMarkers();      

        yaObtuvoFM =true;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }

const UrlArt = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
var markerClusterArt;
var marksArt=[];
var yaObtuvoArt=false;
function ObtenerArt() {
    if (!yaObtuvoArt) {
      var data = $.get(UrlArt, function() {})

      .done(function() {
        var dataR = data.responseJSON.data;
        //8 y 9 (coor, nombre)
        var localizacion;
        var newlocalizacion;
        var arregloLocalizacion;
        
        for (var i = 0; i < dataR.length; i++) {
          localizacion = dataR[i][8];
          newlocalizacion = (localizacion.substr(7,localizacion.length)).substr(0,localizacion.length-8);
          arregloLocalizacion = newlocalizacion.split(' ');

          var marcador = new google.maps.Marker({
            position: {lat: parseFloat(arregloLocalizacion[1]), lng: parseFloat(arregloLocalizacion[0])},
            map:map,
            icon:"https://www.shareicon.net/data/128x128/2015/04/26/29238_museum_32x37.png",
            title: (dataR[i][9] + " (" + dataR[i][12] + ")")
          })
          marksArt.push(marcador);
        }
        markerClusterArt = new MarkerClusterer(map, marksArt,
                                                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        markerClusterArt.clearMarkers();      

        yaObtuvoArt =true;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }

const UrlWF = "https://data.cityofnewyork.us/api/views/varh-9tsp/rows.json?accessType=DOWNLOAD";
var markerClusterWF;
var marksWF=[];
var yaObtuvoWF=false;
function ObtenerWF() {
  if (!yaObtuvoWF) {
    var data = $.get(UrlWF, function() {})

    .done(function() {
      var dataR = data.responseJSON.data;
      //8 y 9 (coor, nombre)

      for (var i = 0; i < dataR.length; i++) {

        var marcador = new google.maps.Marker({
          position: {lat: parseFloat(dataR[i][14]), lng: parseFloat(dataR[i][16])},
          map:map,
          icon:"https://www.shareicon.net/data/128x128/2015/04/27/29394_wifi_32x37.png",
          title: (dataR[i][10] + " (" + dataR[i][15] + ")")
        })
        marksWF.push(marcador);
      }
      markerClusterWF = new MarkerClusterer(map, marksWF,
                                             {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      markerClusterWF.clearMarkers();      

      yaObtuvoWF =true;
    })

    .fail(function error(){
      console.log(error);
    })
    }
}

const UrlLB = "https://data.cityofnewyork.us/api/views/feuq-due4/rows.json?accessType=DOWNLOAD";
var markerClusterLB;
var marksLB=[];
var yaObtuvoLB=false;
function ObtenerLB() {
    if (!yaObtuvoLB) {
      var data = $.get(UrlLB, function() {})

      .done(function() {
        var dataR = data.responseJSON.data;
        //8, 9 y 10 (coor, nombre, direcc)
        var localizacion;
        var newlocalizacion;
        var arregloLocalizacion;
        
        for (var i = 0; i < dataR.length; i++) {
          localizacion = dataR[i][8];
          newlocalizacion = (localizacion.substr(7,localizacion.length)).substr(0,localizacion.length-8);
          arregloLocalizacion = newlocalizacion.split(' ');

          var marcador = new google.maps.Marker({
            position: {lat: parseFloat(arregloLocalizacion[1]), lng: parseFloat(arregloLocalizacion[0])},
            map:map,
            icon:"https://www.shareicon.net/data/128x128/2015/04/26/29216_books_32x37.png",
            title: (dataR[i][9] + " (" + dataR[i][10] + ")")
          })
          marksLB.push(marcador);
        }
        markerClusterLB = new MarkerClusterer(map, marksLB,
                                                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        markerClusterLB.clearMarkers();      

        yaObtuvoLB =true;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }


var infoDis = [];
var yaObtuvoCenDis = false;
var md =[];
var bcdCenter=[];
function obtenerCentrosYdistancias() {
  if (!yaObtuvoCenDis) {
    for (var i = 0; i < feat.length; i++) {
      if (feat[i].h.BoroCD%100 < 19) {
        var bounds = new google.maps.LatLngBounds();
        if(feat[i].g.g.length == 1){
          for (k = 0; k < feat[i].g.g[0].g.length; k++) {
            var pos = new google.maps.LatLng(40.7291, -73.9965);
            bounds.extend(pos);
            if(bounds.contains(pos)){
              console.log('siiii');
            }else{
              console.log('noooo')
            }
          }
        }else {
          for (var u = 0; u < feat[i].g.g.length; u++) {
            for (k = 0; k < feat[i].g.g[u].g[0].g.length; k++) {
              bounds.extend(feat[i].g.g[u].g[0].g[k]);
            }
          }
        }
        bcdCenter.push([feat[i].h.BoroCD,bounds.getCenter()]);
        /*
        var marcador = new google.maps.Marker({
          position: bounds.getCenter(),
          label:(feat[i].l.BoroCD%100).toString(),
          map:map,
        })*/

        /*marcador.addListener('mouseover',function() {
              polys[parseInt(feat[i].f.BoroCD/100)-1][];
            });*/
        //md.push(marcador);
        console.log('ttttt');
        console.log(bounds.getCenter());
        var distancia = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(40.7291, -73.9965), bounds.getCenter());
        infoDis.push([boroName(parseInt(feat[i].h.BoroCD/100)),feat[i].h.BoroCD%100,distancia,bounds.getCenter(),feat[i].h.BoroCD]);  
      }
    }
    yaObtuvoCenDis = true;
    //marksDis();
    //titleDisMar();
  }
  
  infoDis = infoDis.sort(compare).reverse();

  //Calcular Calificaciones
  var min = infoDis[0][2];
  var max = infoDis[infoDis.length-1][2];
  var m = -50.0/(max-min);
  var b = 50.0 - (m*min);
  var aux = 0;
  for(var i = 0; i<infoDis.length; i++){
    aux=(m*infoDis[i][2])+b;
    if(aux<0){
      infoDis[i][5]=0;
    }else{  
      infoDis[i][5]=aux;
    }
  }
  //Cambiar coordenadas 1  de Brooklyn
  /*infoDis[7][3]={};
  infoDis[7][3]={lat:40.7118914, lng:-74.0126129};*/
}

function boroName(num) {
  if(num==1){
    return "Manhattan";
  }else if (num==2) {
    return "Bronx";
  }else if (num==3) {
    return "Brooklyn";
  }else if (num==4) {
    return "Queens";
  }else if (num==5) {
    return "Staten Island";
  }
}

function boroNumero(nombre) {
  if(nombre=="Manhattan"){
    return 1;
  }else if (nombre=="Bronx") {
    return 2;
  }else if (nombre=="Brooklyn") {
    return 3;
  }else if (nombre=="Queens") {
    return 4;
  }else if (nombre=="Staten Island") {
    return 5;
  }
}


var infoDisCop,crimDisCop,infoHousCop;

function calificarDistritos(){
  llenar_datos_barrios();
  obtenerCentrosYdistancias();
  obtenerCrimenes();
  ObtenerHospedajes();
  
  setTimeout(function(){
    infoDisCop=infoDis.slice(0);
    crimDisCop=crimDis.slice(0);
    infoHousCop=infoHous.slice(0);

    infoDisCop = infoDisCop.sort(compareBoroDist).reverse();
    crimDisCop = crimDisCop.sort(compareBoro).reverse();
    infoHousCop = infoHousCop.sort(compareBoro).reverse();
    
    var prom=0;
    var aux=0;

    for(var i=0; i<24; i++){ //hasta 23
      prom = (infoDisCop[i][5]+crimDisCop[i][4]+infoHousCop[i+1][4])/3;
      crimDisCop[i][5]=prom;
    }
    for(var i=24; i<37; i++){ //del 24 al 36
      prom = (infoDisCop[i][5]+crimDisCop[i][4]+infoHousCop[i+2][4])/3;
      crimDisCop[i][5]=prom;
    }
    for(var i=37; i<infoDisCop.length; i++){ //del 36 al 59
      prom = (infoDisCop[i][5]+crimDisCop[i][4]+infoHousCop[i+1][4])/3;
      crimDisCop[i][5]=prom;
    }
 

    crimDisCop = crimDisCop.sort(compareCalificacion);   
    actualizarTablaDistritos();
  }, 2000);  
}

function compareBoro(a, b) {
  return (a[3] >= b[3]) ? -1 : 1;
}

function compareBoroDist(a, b) {
  return (a[4] >= b[4]) ? -1 : 1;
}

function compareCalificacion(a, b) {
  return (a[5] >= b[5]) ? -1 : 1;
}