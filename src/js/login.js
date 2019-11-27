//https://daneden.github.io/animate.css/
var nombre, uid, div, div2, cont1, btn, direc, local, url;
var ban=0;

$( "#btningreso" ).on( "click", function() {
  iniciarsesion();
});

firebase.auth().onAuthStateChanged(function(user) {
  if (firebase.auth().currentUser && ban==0) {
    console.log("Cuenta logeada.");
    window.location.assign("perfil.html");
  };
});


function registro(){
  var email = document.getElementById('emailreg').value;
  var password = document.getElementById("passwordreg").value;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
    uid = firebase.auth().currentUser.uid;
  }).catch(function(error) {
  // Handle Errors here.
    $("#error3").css("display", "none");
  document.getElementById('error2').style.display='inherit';
  var errorCode = error.code;
  var errorMessage = error.message;
  });
}

function iniciarsesion() {
        var idEmail = document.getElementById('emailing').value;
        var idContraseña = document.getElementById('passwording').value;
        firebase.auth().signInWithEmailAndPassword(idEmail, idContraseña)
        .then(function(resuelto){
          window.location.assign("perfil.html");})
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          document.getElementById('error').style.display='inherit';
          console.log("Inicio fracasado");
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }


// boton para tiempo de guardado en bd
function btncarga(){
  $('#txtregistro').text("Creando Cuenta...");
  //$('#tercer').addClass('spinning');
  setTimeout(
    function (){
    //  $('#tercer').removeClass('spinning');
      $('#txtregistro').text("Ingresando");
    }, 3000);
}
// ingreso imgs
$(document).ready(function() {
  /* ingreso foto */
  if (window.File && window.FileList && window.FileReader) {
    $("#files").on("change", function(e) {
      var files = e.target.files,
        filesLength = files.length;
      for (var i = 0; i < filesLength; i++) {
        var f = files[i]
        var fileReader = new FileReader();
        fileReader.onload = (function(e) {
          file = e.target;
          $("<span class=\"pip\">" +
            "<img class=\"imageThumb\" id=\"imgprinc\" src=\"" + e.target.result + "\"/>" +
            "<br/><span class=\"remove\">Eliminar foto</span>" +
            "</span>").insertAfter("#files");
          $(".remove").click(function(){
            $(this).parent(".pip").remove();
            document.getElementById('ingfot').style.display="inherit";
          });
          document.getElementById('ingfot').style.display="none";
        });
        fileReader.readAsDataURL(f);
      }
    });
  } else {
    alert("Error de ingreso, intenta con otra imagen");
  }
});

//Animaciones de registro
$( "#btnregistro" ).on( "click", function() {
  var x = 1;
//  x = validar();
  if(x==1){
    ban=1;
    document.getElementById('anima').style.display='flex';
    document.getElementById('login').style.display='none';
    document.getElementById('prireg').style.display='inline';
    $('#prireg').addClass('animated slideInRight');
    //registro();
  }else {
    $("#error2").css("display", "none");
    $("#error3").css("display", "inherit");
  }
});
$( "#primer" ).on( "click", function() {
  direc = document.getElementById("direccion").value;
  document.getElementById('segreg').style.display='inline';
  $('#prireg').addClass('animated slideOutLeft');
  $('#segreg').addClass('animated slideInRight');
  document.getElementById('prireg').style.display='none';
  direc = document.getElementById("direccion").value;
  local = document.getElementById("local").value;
  nombre = document.getElementById("namereg").value;
/*  firebase.database().ref('usuarios/' + uid).set({
    nombre:nombre,
    local:local
  })
  firebase.database().ref('locales/' + local).set({
    direccion:direc,
    visitas: {
      mes1:0,
      mes2:0,
      mes3:0,
      mes4:0,
      mes5:0
    },
    valoraciones:{
      punt1:0,
      punt2:0,
      punt3:0,
      punt4:0,
      punt5:0
    }
  });
*/
});
$( "#segundo" ).on( "click", function() {
  /*$( "#back" ).on( "click", function() {
    document.getElementById('prireg').style.display='inline';
    $('#segreg').addClass('animated slideInRight');
    $('#prireg').addClass('animated slideOutLeft');
    document.getElementById('segreg').style.display='none';
  });*/
  document.getElementById('terreg').style.display='inline';
  $('#segreg').addClass('animated slideOutLeft');
  $('#terreg').addClass('animated slideInRight');
  document.getElementById('segreg').style.display='none';
  //ingresarhorarios();
});
$( "#tercer" ).on( "click", function() {
/*  $( "#back" ).on( "click", function() {
    document.getElementById('segreg').style.display='inline';
    $('#segreg').addClass('animated slideInRight');
    $('#terreg').addClass('animated slideOutLeft');
    document.getElementById('terreg').style.display='none';
  });*/
  var imagen = document.getElementById("files");
  var file = imagen.files[0];
    var storageService = firebase.storage();
    var referencia = storageService.ref('galeria/' + local);
    var uploadTask = referencia.put(file);
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
          }
        }, function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
          });
        });
  btncarga();
  setTimeout(function(){
  //window.location.assign("perfil.html");
  },3000);
});

function ingresarhorarios(){
  var semana = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  for (var i = 0; i < 7; i++) {
    var x = semana[i];
    if ($('#ch'+ x).is(":checked") == true) {
      firebase.database().ref('locales/' + local + "/horarios/" + x).set({
            desde:"",
            hasta:""
      });
    }
    else {
      var dia = x + "1";
      var dia2 = x + "2";
      val = document.getElementById(dia).value;
      val2 = document.getElementById(dia2).value;
      firebase.database().ref('locales/' + local + "/horarios/" + x).set({
            desde: val,
            hasta: val2
      });
    }
  }
}

/* omitir */
$( "#omitir" ).on( "click", function() {
  nombre = document.getElementById("namereg").value;
  firebase.database().ref('usuarios/' + uid).set({
    nombre:nombre,
  })
  setTimeout(function(){
    window.location.assign("perfil.html");
  },2500)
});

/* validar*/
function validar(){
  $('#formulario :input:visible[required="required"]').each(function()
  {
      if(!this.validity.valid)
      {
          console.log("error");
          $(this).focus();
          return 0;
      }
  });
}
