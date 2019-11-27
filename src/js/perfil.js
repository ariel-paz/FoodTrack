//base de datos
var nombre, email, horas, storages, uid, visitas, val, direc, ref, user, local;
var usuarios={};

function refusuario(user){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;
      // traigo lo que esta en la bd
      ref = firebase.database().ref('usuarios/' + uid);
      ref.on('value',function(datos){
        usuarios = datos.val();
        local= usuarios.local;
      });
    }
    else {
      console.log("User is signed out.")
      window.location.assign("login.html");
    }
  });
  return local;
}



setTimeout( function (){
  $(".loader").css("display", "none");
  $(".container").css("display", "flex");
  user = firebase.auth().currentUser;
  local = refusuario(user);
  $("#nombrelocal").text(local);
}, 3000);


function guardar(){
  $( "#guardardatos" ).on( "click", function() {
    var newdirec = $("#direcuser").val();
    //faltan ( fotos)
    var data = {
      direccion: newdirec,
      //storages: newphotos,
    };
    firebase.database().ref('locales/' + local).update(
      data
    );
    ingresarhorarios();
    console.log("Guardado")
  });
}

$("#cargar").on("click", function(){
    ref = firebase.database().ref('locales/' + local);
    ref.on('value',function(datos){
      locales=datos.val();
      direc=locales.direccion;
      horas=locales.horarios;
      storages=locales.storages;
      val=locales.valoraciones;
      visitas=locales.visitas;
    });
    guardar();
    setTimeout(function(){
      $("#direcuser").attr("placeholder", direc);
      $("#nomlocal").attr("placeholder", local);
      hora(horas);
      gengraf(visitas, val);
  },2000);
});

$( "#cerrarsesion" ).on( "click", function() {
  firebase.auth().signOut().then(function() {
  console.log ("Sign-out successful.");
  }).catch(function(error) {
  console.log("An error happened.");
  });
  window.location.assign("login.html");
});

// Coloca horarios de bd en la pagina

function hora(horas){
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
    var diach = "#ch" + x;
    var dia = "#" + x + "1";
    var dia2 = "#" + x + "2";
    if (desde=="" || hasta=="") {
      $(diach).prop( "checked", true );
    }
    else {
      $(dia).attr("placeholder", desde);
      $(dia2).attr("placeholder", hasta);
      $(diach).prop( "checked", false );
    }
  }
}

function ingresarhorarios(){
  var semana = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  for (var i = 0; i < 7; i++) {
    var x = semana[i];
    if ($('#ch'+ x).is(":checked") == true) {
      firebase.database().ref('locales/' + local + "/horarios/" + x).update({
            desde:"",
            hasta:""
      });
    }
    else {
      var dia = x + "1";
      var dia2 = x + "2";
      val = document.getElementById(dia).value;
      val2 = document.getElementById(dia2).value;
      firebase.database().ref('locales/' + local + "/horarios/" + x).update({
            desde: val,
            hasta: val2
      });
    }
  }
}

// Graficos
function gengraf(visitas, val){

/*torta valoraciones */
var ctx = document.getElementById('torta').getContext('2d');
var v1 = val.punt1;
var v2 = val.punt2;
var v3 = val.punt3;
var v4 = val.punt4;
var v5 = val.punt5;
var myPieChart = new Chart(ctx,{
  type: 'pie',
  data: {
    datasets: [{
      data: [v1, v2, v3, v4, v5],
      backgroundColor:[
        'brown',
        '#00bada',
        '#5b5b95',
        '#ec449b',
        '#3380bf'
      ]
    }],
// These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      '1☆',
      '2☆',
      '3☆',
      '4☆',
      '5☆'
    ],
    options:{
      responsive:true,
    }
  }
});

/* lineal visitas*/
var ctx2 = document.getElementById('lineal').getContext('2d');
var m1 = visitas.mes1;
var m2 = visitas.mes2;
var m3 = visitas.mes3;
var m4 = visitas.mes4;
var m5 = visitas.mes5;
var lineal = new Chart(ctx2, {
  type: 'line',
    data: {
      labels: ['Abr', 'Mayo', 'Jun', 'Jul', 'Ago'],
      datasets: [{
        data: [m1,m2,m3,m4,m5],
        borderColor: "#3e95cd",
        fill: false
      }]
    },
    options: {
      legend:{
        display:false,
      }
    }
  });
}
