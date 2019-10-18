var altoPantalla = $(window).height();
var anchoPantalla = $(window).width();

var graficoDistancia=false;
var csvDistancia;
function ponerGrafico(){
  if(!graficoDistancia){

    var lineArray = [];

    for(var j=0; j<10;j++){
      var line = infoDis[j].join(",");
      lineArray.push(j == 0 ? "data:text/csv;charset=utf-8,boro,distrito,Distancia,lat,lng,boroCD\n" + line : line);
    }
    csvDistancia = lineArray.join("\n");
    
    // Establecer Tamaño y margenes
    var ancho_svg = (anchoPantalla/3)-20,//(altoPantalla*0.30)*2,
        alto_svg = altoPantalla*0.30,
        margen = {sup: 20, dch: 20, izq: 35, inf: 20},
        ancho_graf = ancho_svg - margen.izq - margen.dch,
        alto_graf = alto_svg - margen.sup - margen.inf;


    // Definir Escala para la cantidad de precipitaciones.
    // De momento solo el rango porque para definir
    // el dominio necesitamos los datos
    var escala_y = d3.scaleLinear()
    .range([alto_graf, 0]);


    // Definir Escala para los meses.
    // De momento solo el rango porque para definir
    // el dominio necesitamos saber los meses :-)
    var escala_x = d3.scaleBand()
    .rangeRound([0, ancho_graf]);  

    // Definir la linea y los valores x e y que va a tener
    var valorlinea = d3.line()
    // El valor x viene determinado por la posición que ocupa cada mes.
    // Llamar directamente a la escala nos daría la posición x donde comeienza cada mes.
    // Step nos da el ancho de cada mes, por eso si le sumamos la mitad del ancho,
    // nos queda en el centro de cada mes.
    .x(function(d) { return (escala_x(d.boroCD) + escala_x.step()/2); })
    // El valor y lo sacamos de la cantiddad de lluvia que viene en la columna
    // Precipitaciones una vez convertido mediante su escala.          
    .y(function(d) { return escala_y(d.Distancia); });

    // Definir y agregar el svg a la página
    // Agregar un grupo y trasladar el eje de coordenadas
    var svg = d3.select("#divGraficaDistancia").append("svg")
    .attr("width", ancho_svg)
    .attr("height", alto_svg)
    .append("g")
    .attr("transform",
          "translate(" + margen.izq + "," + margen.sup + ")");

    // Obtener los datos de un csv con nombre de columnas Mes y Precipitaciones
    d3.csv(csvDistancia, function(d) {
      // Le indicamos que Precipitaciones es un numero
      // Le decimos que pase a mayusculas los meses
      d.Distancia = +d.Distancia;
      d.boroCD = d.boroCD;
      return d;
    }, function(error, datos) {
      if (error) throw error;
      // Definir el dominio de la escala de los meses
      // Lee los valores de la columna mes
      escala_x.domain(datos.map(function(d){ return d.boroCD}));

      // Definir el dominio de la escala de la lluvia
      // que va de 0 al valor máximo contenido en la columna precipitaciones.
      escala_y.domain([0, d3.max(datos, function(d) {return d.Distancia;})]);

      // Definir el eje X de los meses
      var eje_x = d3.axisBottom()
      .scale(escala_x);


      // Definir el eje Y de las precipitaciones
      var eje_y = d3.axisLeft()
      .scale(escala_y);

      // Mostrar en consola para ver las diferencias.
      // console.log(datos);
      // console.log([datos]);

      // Crear el path y añadirle los valores
      // Añadirmos un elemento path al svg
      svg.append("path")
      // Le presentamos los datos es necesario incluir cocrchetes
        .data([datos])
      // Le indicamos la clase para que le aplique el estilo definido.
        .attr("class", "linea")
      // Aqui le indicamos que va a ser una linea y sus valores.
        .attr("d", valorlinea);

      // Añadimos el eje x para ello creamos un grupo 
      svg.append("g")      // Añadir un grupo para el eje
        .attr("transform", "translate( 0 ," + alto_graf  + " )")
      // Desplazar el eje de coordenadas
        .call(eje_x);      // Llamar el eje x

      // Añadimos el eje y para ello creamos un grupo 
      svg.append("g")      // Añadir un grupo para el eje
        .attr("transform", "translate( 0 , 0 )")
        .text("Distancia (Km)")
      // No es necesarios desplazar el eje de coordenadas
        .call(eje_y);      // Llamar el eje y
    });
    
    graficoDistancia=true;
  }
}

function iconoTopSeguridad(index){
  var aux;
  switch(index) {
    case 1:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29585_icon-a-icon-search-engine_27x27.png";
      break;
    case 2:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29587_red_27x27.png";
      break;
    case 3:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29588_red_27x27.png";
      break;
    case 4:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29590_red_27x27.png";
      break;
    case 5:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29589_red_27x27.png";
      break;
    case 6:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29592_red_27x27.png";
      break;
    case 7:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29591_red_27x27.png";
      break;
    case 8:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29594_red_27x27.png";
      break;
    case 9:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29593_red_27x27.png";
      break;
    case 10:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29596_red_27x27.png";
      break;
    default:
      aux = "";
      break;
  }
  return aux;
}

var graficoSeguridad=false;
var csvSeguridad;
var markerTopCri = [];
var markerClusterTopCri;

function ponerGraficoSeguridad(){
  if(!graficoSeguridad){
    
    var lineArray = [];
    
    var distrAux; 
    for(var j=0; j<10;j++){
      var line = crimDis[j].join(",");
      lineArray.push(j == 0 ? "data:text/csv;charset=utf-8,boro,distrito,Ncrimenes,boroCD\n" + line : line);
      
      distrAux = infoDis.find(function(element) {
        return element[4]==crimDis[j][3];
      });
      
      var marker = new google.maps.Marker({
        position: distrAux[3],
        map: map,
        //label: (j + 1).toString(),
        icon: iconoTopSeguridad(j+1),
        title: (crimDis[j][0] + '-' + crimDis[j][1]).toString()
      });
    
      markerTopCri.push(marker);
    }
    
    markerClusterTopCri = new MarkerClusterer(map, markerTopCri,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    markerClusterTopCri.clearMarkers();
    
    csvSeguridad = lineArray.join("\n");

    // Establecer Tamaño del lienzo, tamaño a ampliar el sector y radio.
    var ancho_svg = altoPantalla*0.30,
        alto_svg = altoPantalla*0.30,
        ampliar = 30,
        radio = ( Math.min(ancho_svg, alto_svg) / 2 ) - ampliar ;

    // Definir Escala para los colores.
    // Previamente hemos cargado el modulo necesario.
    // Consultar en https://github.com/d3/d3-scale-chromatic
    // Existen multiples escalas cromáticas.
    var color = d3.scaleOrdinal(d3.schemeSet3); 

    // Definimos el arco
    var arco = d3.arc()
    .outerRadius(radio)
    .innerRadius(0);

    var arco_sel = d3.arc()
    .outerRadius(radio + ampliar)
    .innerRadius(ampliar);

    // Definimos la tarta
    // Esta función nos devuelve los datos necesarios para
    // posteriormente dibujar con path.
    var tarta = d3.pie()
    //-- No está ordenado
    .sort( null ) 
    //.sort(function compare(a, b) {
    //  return b.Ncrimenes - a.Ncrimenes;})
    .value(function(d) { return d.Ncrimenes; });

    // Definir y agregar el svg a la página
    // Agregar un grupo y trasladar el eje de coordenadas
    // donde va ir el centro de la tarta.
    var svg = d3.select("#divGraficaSeguridad").append("svg")
    .attr("width", ancho_svg)
    .attr("height", alto_svg)
    .append("g")
    .attr("transform",
          "translate(" + ancho_svg / 2 + "," + alto_svg / 2 + ")");

    // Obtener los datos de un csv con nombre de columnas Mes y Precipitaciones
    d3.csv(csvSeguridad, function(d) {
      // Le indicamos que Precipitaciones es un numero
      d.Ncrimenes = +d.Ncrimenes;
      return d;
    }, function(error, datos) {
      if (error) throw error;

      // Mostrar en consola para ver los datos
      //console.log(datos);

      // Al lienzo svg le presentamos los datos.
      // Los datos que necesitamos nos lo da la función
      // tarta que hemos definido anteriormente a la que
      // le pasamos los datos.
      // Generamos un grupo con la clase arco por cada sector.
      var g_arco = svg.selectAll(".arco")
      .data(tarta(datos))
      .enter()
      .append("g")
      .attr("class", "arco");


      // A cada grupo le añadimos el elemento path
      // que es quien genera los sectores o arcos.
      // Para ello le pasamos tres cosas:
      // Con el atributo d le indicamos que es un arco,
      // que ademas hemos definido su radio interior y
      // exterior antes con la variable arco.
      // Tambien le estamos pasando los angulos que calcula pie.
      // Para el color usatemos la variable color,
      // fijarnos que le llamamos con data por medio
      g_arco.append("path")
        .attr("d", arco)
        .style("fill", function(d) { 
        //console.log(d); // Se muestra consola para ver la parte de data.
                                    return color(d.data.boroCD); })
      // Al pasar el ratón por encima
      // cambiar de arco y camiar el color
        .on('mouseover', function(d){
        //console.log(d.data);
        //console.log(this);
        cambiarTex(d.data.boro,d.data.distrito,d.data.Ncrimenes);
        d3.select(this).style('fill', '#101548');
        d3.select(this) 
          .transition().duration(100)
          .attr("d", arco_sel);
      })
      // Al salir el ratón de la zona
      // volver al arco y la color original
        .on('mouseout', function(d){
        d3.select(this).style('fill', color(d.data.boroCD));
        d3.select(this) 
          .transition().duration(200)
          .attr("d", arco);
      });

    });

    graficoSeguridad=true;
  } 
}

function cambiarTex(boro,dist,crim){
   $('#textoCrimenes').text("District: "+boro+"-"+dist+"     Number of Crimes: "+crim);
}

function iconoTopAsequibilidad(index){
  var aux;
  switch(index) {
    case 1:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29449_brown_27x27.png";
      break;
    case 2:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29446_brown_27x27.png";
      break;
    case 3:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29450_brown_27x27.png";
      break;
    case 4:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29448_brown_27x27.png";
      break;
    case 5:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29452_brown_27x27.png";
      break;
    case 6:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29451_brown_27x27.png";
      break;
    case 7:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29454_brown_27x27.png";
      break;
    case 8:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29453_brown_27x27.png";
      break;
    case 9:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29456_brown_27x27.png";
      break;
    case 10:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29455_brown_27x27.png";
      break;
    default:
      aux = "";
      break;
  }
  return aux;
}

var graficoAsequibilidad=false;
var csvAsequibilidad;
var markersTopAsequ = [];
var markerClusterTopAseq;

function ponerGradicoAsequibilidad(){
  
  if(!graficoAsequibilidad){
    // Declarar las variables del contenedor SVG  
    ancho = (anchoPantalla/3)-20,//(altoPantalla*0.40)*450/300; // 
    alto = (altoPantalla*0.40);  // 
    margen= 70; // Cada margen 50 px
    dist_barras = 2; // Distancia entre barras 2 px

    // Declarar los datos
    var datos = infoHous.slice(0, 10);

    var lineArray = [];
    
    var distrAux; 
    for(var j=0; j<10;j++){
      var line = datos[j].join(",");
      lineArray.push(j == 0 ? "data:text/csv;charset=utf-8,boro,distrito,Nhospedajes\n" + line : line);
      
      distrAux = infoDis.find(function(element) {
        return element[4]==datos[j][3];
      });
      
      var marker = new google.maps.Marker({
        position: distrAux[3],
        map: map,
        //label: (j + 1).toString(),
        icon: iconoTopAsequibilidad(j+1),
        title: (datos[j][0] + '-' + datos[j][1]).toString()
      });
    
      markersTopAsequ.push(marker);
    }
    
    markerClusterTopAseq = new MarkerClusterer(map, markersTopAsequ,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    markerClusterTopAseq.clearMarkers();
    
    csvAsequibilidad = lineArray.join("\n");

    // Declarar los colores
    colores = ["#8DD3C7", "#FFFFB3", "#BEBADA", "#FB7D72", "#80B1D3", "#FDB462", 
               "#B3DE69", "#FCCDE5", "#D9D9D9", "#BC80BD"];

    // Crear el contenedor SVG    
    var svg = d3.select("#divGraficaAsequibilidad")
    .append("svg")
    .attr("width", ancho)
    .attr("height", alto-60);

    // Definir la escala X Escala Lineal
    // domain es el intervalo de valores sin escalar
    // Para calcular el valor maximo usamos d3.max
    // y como datos es una matriz con dos columnas 
    // empleamos d[1] para referirnos a los valores de lluvia
    // d[0] son los meses.
    // range es el intervalo de valores escalado
    // los pixeles sobre los que vamos a dibujarlo.
    var escala_X = d3.scaleLinear()
    .domain([0, d3.max(datos, function(d) {return d[2];})])
    .range([0, ancho - 2 * margen]);

    // Definir la escala Y Escala de Banda
    // domain es el intervalo de valores sin escalar
    // en este caso son los meses
    // range es el intervalo de valores escalado
    // el numero de pixeles donde se dibuja
    var escala_Y = d3.scaleBand()
    .domain(datos.map(function(d){ return (d[0]+"-"+d[1])}))
    .rangeRound([0, alto - 2 * margen])
    .paddingInner(0.05);

    // Dejado a proposito para ver como mostrar los valores en la consola
    //console.log("Dominio " + escala_Y.domain());
    //console.log("Rango " + escala_Y.range());
    //console.log("Bandwidth " + escala_Y.bandwidth());

    // Definir la escala Z Escala Ordinal
    // A cada mes se le asigna un color
    // Dominio los meses
    // Rango los colores
    var escala_Z = d3.scaleOrdinal()
    .domain(datos.map(function(d){ return (d[0]+"-"+d[1])}))
    .range(colores.map(function(d){ return d;}));

    // Crear las barras
    svg.append("g")       // Se crea un grupo para las barras
      .attr("transform", "translate( " + margen + ",10)")
      .selectAll("rect") // Se traslada el eje de coordenadas
      .data(datos)        // Presentamos los datos
      .enter()            // Seleccionamos los datos que no tienen objetos
      .append("rect")   // Añadimos los rectangulos 
      .attr("x", 0)      // Las barras comienzan en x = 0
      .attr("y", function (d,i) {
      return i * escala_Y.step();
    })                // La posición y se aumenta el ancho de cada barra
      .attr("width", function (d) {
      return escala_X(d[2]);
    })                 // La longitud es la cantidad de lluvia escalada
      .attr("height", function (d) {
      return escala_Y.bandwidth();
    })                 // La anchura de la barra se calcula con la escala
      .attr("fill", function(d) {
      return escala_Z((d[0]+"-"+d[1]));
    });                // Con la Escala Z mapeamos el color a cada barra


    // Definir eje X y asignarle su escala
    // Eje inferior en base a la escala escala_X
    // Asignamos el numero de divisiones
    var eje_X = d3.axisBottom()
    .scale(escala_X)
    .tickValues(d3.range( 0, d3.max(datos, function(d) {return d[2];}), 100 ));

    // Insertar el eje Horizontal
    svg.append("g")      // Añadir un grupo para el eje
      .attr("transform", "translate( " + margen + "," + (alto - margen -60) + " )")
    // Desplazar el eje de coordenadas
      .call(eje_X)      // Llamar el eje X
      .append("text")   // Añadirle una leyenda
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("x", (ancho/2) - margen)
      .attr("y", 40)
      .attr("fill", "black")
      .text("Number of Housings");

    // Definir eje Y y asignarle su escala
    // Eje Vertical Izquierdo en base a la escala_Y
    var eje_Y = d3.axisLeft()
    .scale(escala_Y);

    // Insertar el eje Vertical
    svg.append("g")     // Añadir un grupo para el eje
      .attr("transform", "translate( " + margen + ",10)")
    // Desplazar el eje de coordenadas
      .call(eje_Y);    // Llamar el eje Y
    
    graficoAsequibilidad=true;
  }
}

function iconoTopComparar(index){
  var aux;
  switch(index) {
    case 1:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29507_green_27x27.png";
      break;
    case 2:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29508_green_27x27.png";
      break;
    case 3:
      aux = "https://www.shareicon.net/data/128x128/2015/04/27/29509_green_27x27.png";
      break;
    default:
      aux = "";
      break;
  }
  return aux;
}

var ArrayComparar=[[],[],[]];
var csvComparar;
var calfDis0,calfDis1,calfDis2,calfHous0,calfHous1,calfHous2;
function graficobarras(){
  
  calfDis0 = infoDisCop.find(function(element) {
  return element[4]==crimDisCop[0][3];
  });
  
  calfDis1 = infoDisCop.find(function(element) {
  return element[4]==crimDisCop[1][3];
  });
  
  calfDis2 = infoDisCop.find(function(element) {
  return element[4]==crimDisCop[2][3];
  });
  
  calfHous0 = infoHousCop.find(function(element) {
  return element[3]==crimDisCop[0][3];
  });
  
  calfHous1 = infoHousCop.find(function(element) {
  return element[3]==crimDisCop[1][3];
  });
  
  calfHous2 = infoHousCop.find(function(element) {
  return element[3]==crimDisCop[2][3];
  });
  
  ArrayComparar[0] =[(crimDisCop[0][0]+"-"+crimDisCop[0][1]),
                    calfDis0[5],
                    crimDisCop[0][4],
                    calfHous0[4]];
  
  ArrayComparar[1] =[(crimDisCop[1][0]+"-"+crimDisCop[1][1]),
                    calfDis1[5],
                    crimDisCop[1][4],
                    calfHous1[4]];
  
  ArrayComparar[2] =[(crimDisCop[2][0]+"-"+crimDisCop[2][1]),
                    calfDis2[5],
                    crimDisCop[2][4],
                    calfHous2[4]]; 
  
  var lineArray = [];

  for(var j=0; j<3;j++){
    var line = ArrayComparar[j].join(",");
    lineArray.push(j == 0 ? "data:text/csv;charset=utf-8,distrito,Qualification of Distance,Qualification of Security,Qualification of Housing\n" + line : line);
  }
  csvComparar = lineArray.join("\n");
  
  d3.csv(csvComparar, function (d, i, columns) {
    // += "Suma a t el valor d[columns[j]]"
    // Agregamos una columna total y otra del orden de las paradas
      for (j = 1, t = 0; j < columns.length; ++j) 
      t += d[columns[j]] = +d[columns[j]]; // t = t + d[columns[j]]
      d.total = t;
      d.ordenCalificacion = i + 1;
      return d;
      },
    // La función de dibujar el gráfico.
         function (datos) {
    dibujar(datos);
  });  
  
  MarcarComparar();

/*
  ArrayComparar[0] =[crimDisCop[0][0],crimDisCop[0][1],crimDisCop[0][3],
                    infoDisCop[5][2],infoDisCop[5][5],
                    crimDisCop[0][2],crimDisCop[0][4],
                    infoHousCop[6][2],infoHousCop[6][4],
                    (infoDisCop[5][5]+crimDisCop[0][4]+infoHousCop[6][4]),
                    crimDisCop[0][5]];
  ArrayComparar[1] =[crimDisCop[1][0],crimDisCop[1][1],crimDisCop[1][3],
                    infoDisCop[43][2],infoDisCop[43][5],
                    crimDisCop[1][2],crimDisCop[1][4],
                    infoHousCop[44][2],infoHousCop[44][4],
                    (infoDisCop[43][5]+crimDisCop[1][4]+infoHousCop[44][4]),
                    crimDisCop[1][5]];
  ArrayComparar[2] =[crimDisCop[2][0],crimDisCop[2][1],crimDisCop[2][3],
                    infoDisCop[25][2],infoDisCop[25][5],
                    crimDisCop[2][2],crimDisCop[2][4],
                    infoHousCop[27][2],infoHousCop[27][4],
                    (infoDisCop[25][5]+crimDisCop[2][4]+infoHousCop[27][4]),
                    crimDisCop[2][5]]; 
  dibujar(ArrayComparar);*/
}


function dibujar(datos){
  // Definir el tamaño del area dentro del svg y el grupo. 
  // Ademas se trasladar el eje de cordenadas los margenes.
  var svg = d3.select("#divGraficaComparar")
  .append("svg:svg")
  .attr("id", "svgComparar")   
  .attr("width", (anchoPantalla/3)-20)//(altoPantalla*0.30)*600/323)          
  .attr("height", (altoPantalla*0.30)) // Porque aquí no lleva una coma?
  margin = {top: 10, right: 20, bottom: 80, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Definir el eje x como una escala por bandas y distribuirla
  var x = d3.scaleBand()
  .rangeRound([0, width/2])
  .paddingInner(0.05)
  .align(0.1);

  // Definir el eje y como una escala lineal y distribuirla
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  // Definir el eje y como una escala ordinal se definen una serie de colores
  var z = d3.scaleOrdinal()
  .range(["#80B1D3", "#FDB462","#B3DE69"]);
 

  // Con la función js slice, sacamos las claves que son los años que están en la cabecera menos la parada.
  var claves = datos.columns.slice(1);
  //console.log(claves);

  // Usamos la función map para que devuelva las Paradas en x
  //x.domain([(datos[0][0]+"-"+datos[0][1]),(datos[1][0]+"-"+datos[1][1]),(datos[2][0]+"-"+datos[2][1])]);
  x.domain(datos.map(function(d) { return d.distrito; }));
  // Aquí usamos el valor máximo del total para el y
  //y.domain([0, datos[0][9]]);
  y.domain([0, d3.max(datos, function(d) { return d.total; })]).nice();
  // Usamos la escala z donde para clave año hay un color.
  z.domain(claves);

  // Generamos el grupo g para las barrar apiladas
  g.append("g")
    .selectAll("g")
  // Generamos el stack a partir de los datos y diciendole las keys
  // Genera un array con un elemento por serie que tiene a su vez elementos 
    .data(d3.stack().keys(claves)(datos))
  // Se genera un grupo por cada uno de los años y se le asigna el color correspondiente
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .attr("class", "año")
  // Y se generan los rectangulos
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.distrito); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth());
  // Se genera un grupo para el eje x  
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("dx", "1em")
    .attr("dy", "-0.7em")
    .attr("transform", "rotate(90)");
  //
  // Se genera un grupo para el eje y  
  g.append("g")
    .attr("class", "axis")
    //.call(d3.axisLeft(y).ticks(null, "s"))
    .call(d3.axisLeft(y).tickValues(d3.range( 0, d3.max(datos, function(d) { return d.total; }), 30 )))
    //.call(eje_y)
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("Rating by Qualification");
  // Se genera la leyenda
  var legend = g.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(claves.slice().reverse())
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });

  // Botones
  var botones = d3.select("div#botonesComparar");
  botones.append("button")
    .attr("class", "boton")
    .attr("id", "botonBorrar1")
    .attr("class", "btn btn-secondary btn-sm")
    .on("click", function() { sort("porDistancia");}) 
    .text("Order by Distance");


  botones.append("button")
    .attr("class", "boton")
    .attr("id", "botonBorrar2")
    .attr("class", "btn btn-light btn-sm")
    .on("click", function() { sort("porSeguridad");})
    .text("Order for Security");

  botones.append("button")
    .attr("class", "boton")
    .attr("id", "botonBorrar3")
    .attr("class", "btn btn-secondary btn-sm")
    .on("click", function() { sort("porUltimo");}) 
    .text("Order by Housing");

  // Funciones Ordenar Qualification of Distance,Qualification of Security,Qualification of Housing
  function sort(orden){
    if (orden == "porDistancia"){
      datos = datos.sort(function (a, b) {
        return b["Qualification of Distance"] - a["Qualification of Distance"];
      });
    }
    else if (orden == "porSeguridad"){
      datos = datos.sort(function (a, b) {
        return b["Qualification of Security"] - a["Qualification of Security"];
      });

    }
    else {
      datos = datos.sort(function (a, b) {
        return b["Qualification of Housing"] - a["Qualification of Housing"];
      });
    }

    d3.select("#svgComparar").remove();
    d3.selectAll("#botonBorrar1").remove();
    d3.selectAll("#botonBorrar2").remove();
    d3.selectAll("#botonBorrar3").remove();
    dibujar(datos);
  } 
} 