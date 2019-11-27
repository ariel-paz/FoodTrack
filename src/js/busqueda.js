var cant, local, i = 0;
var childData = {};
var locales = {};
var imagen = {};
$(document).ready(function() {
  busca();
})

function busca(){
  var ref2 = firebase.database().ref("usuarios");
  ref2.once("value", function(snapshot){
    snapshot.forEach(function(childSnapshot){
      childData = childSnapshot.val();
      locales[i] = childData.local;
      i++;
    });
  });
  var nomlocales = locales[i];
  imagen[i] = traerfoto(nomlocales);
  setTimeout(function(){
    var ref = firebase.database().ref("locales");
    i=0;
    ref.once('value', function(snapshot) {
      var data = snapshot.val();
      snapshot.forEach(function(childSnapshot) {
        childData = childSnapshot.val();
        var direc = childData.direccion;
        var horarios = childData.horarios;
          var html = [
            '<a class="local" id="' + i + '">',
                  '<div class="col-6 col-md-3 mb-4 mt-md-2">',
                    '<div class="card mdb-color text-center z-depth-2">',
                      '<img class="img-fluid" src="images/imagen.jpg">',
                      '<div class="card-body p-0">',
                        '<h5 class="card-title nombrelocal">'+ locales[i] + '</h5>',
                        '<h5 class="card-title">Comida Rapida</h5>',
                        '<h5 class="card-title">Distancia</h5>',
                      '</div>',
                    '</div>',
                  '</div>',
                '</a>'
          ].join("\n");
        $("#locales").append(html);
        $(".local").click(function(){
          var id = $(this).attr('id');
          var x = document.getElementsByClassName("nombrelocal");
          var n = x[id].innerText;
          $("#showlocal").css("display", "block");
          $("#busqueda").css("display", "none");
          console.log(n);
          // traer info de locales/local
          var ref = firebase.database().ref("locales/" + n);
          ref.on('value', function(snapshot) {
            var datos = snapshot.val();
            direc = datos.direccion;
            horarios = datos.horarios;
            visitas = datos.visitas;
            val = datos.valoraciones;
            traervisitas(visitas);
            traerval(val);
            $("#direccion").text(direc);
            $("#nombretxt").text(n);
            hora(horarios);
            $("#to").val(direc);
          });
        });
        i++;
      });
    });
    $(".lds-default").css("display","none");
  },4000);

}
function hora(horas){
  var d = new Date().getDay(); //0-dom 1-lun ...
  $("#" + d).css("font-weight", "bold");
  var semana = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  for (var i = 0; i < 7; i++) {
    var x = semana[i];
    switch (x) {
      case "lun":
        var desde = horas.lun.desde;
        var hasta = horas.lun.hasta;
        break;
      case "mar":
        var desde = horas.mar.desde;
        var hasta = horas.mar.hasta;
      break;
      case "mie":
        var desde = horas.mie.desde;
        var hasta = horas.mie.hasta;
      break;
      case "jue":
        var desde = horas.jue.desde;
        var hasta = horas.jue.hasta;
      break;
      case "vie":
        var desde = horas.vie.desde;
        var hasta = horas.vie.hasta;
      break;
      case "sab":
        var desde = horas.sab.desde;
        var hasta = horas.sab.hasta;
      break;
      case "dom":
        var desde = horas.dom.desde;
        var hasta = horas.dom.hasta;
      break;
    }
    if (desde=="" || hasta=="") {
      $("#" + x).text( "Cerrado" );
    }
    else {
      $("#" + x).text(desde + " a " + hasta + " Hs");
    }
  }
}
function traervisitas(visitas){
  var m1 = visitas.mes1;
  var m2 = visitas.mes2;
  var m3 = visitas.mes3;
  var m4 = visitas.mes4;
  var m5 = visitas.mes5;
  var total = m1+m2+m3+m4+m5;
  $("#visitastxt").text(total + " visitas");
}
function traerval(val){
  var v1 = val.punt1;
  var v2 = val.punt2;
  var v3 = val.punt3;
  var v4 = val.punt4;
  var v5 = val.punt5;
  var prom = (v1 + v2 + v3 + v4 + v5) / 5;
  $(".rating").css("color" ,"gold");
}

function traerfoto(nombrelocal){
  var storageService = firebase.storage();
  var referencia = storageService.ref('galeria/' + nombrelocal);
  referencia.child("foto 1.jpg").getDownloadURL().then(function(url) {
    var test = url;
    console.log(url);
    return url;
  }).catch(function(error) {
    console.log(url);
  });
}
