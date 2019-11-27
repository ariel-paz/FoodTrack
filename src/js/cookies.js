

$(".circulo").click(function() {
  Cookies.set("lugar", "Posicion Actual", { path: '/' });
  window.location.assign("busca.html");
});
