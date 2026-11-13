// Garaje 64: los datos del idioma se publican como texto base64 (eng-traineddata.txt).
// Este envoltorio los entrega a Tesseract como si fueran el archivo eng.traineddata.gz.
(function(){
  var realFetch = self.fetch.bind(self);
  self.fetch = function(url, opts){
    var s = String(url);
    if(/eng\.traineddata(\.gz)?$/.test(s)){
      return realFetch(s.replace(/eng\.traineddata(\.gz)?$/, "eng-traineddata.txt")).then(function(r){
        if(!r.ok) return r;
        return r.text().then(function(t){
          var bin = atob(t.trim()), a = new Uint8Array(bin.length);
          for(var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
          return new Response(a, {status: 200});
        });
      });
    }
    return realFetch(url, opts);
  };
  importScripts("worker.min.js");
})();
