var http=require("http");
http.createServer((req,res)=>{
  if(req.url=="/"){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('<!DOCTYPE html5><html><head><title>Proxy Cors</title><meta name="viewport" content="width=device-width,initial-scale:1.0"/></head><body><h1>Proxy Cors</h1><p>Activați CORS (partajarea resurselor încrucișate) pentru orice adresă URL cu această API simplă și converentă!</p><p>Pentru a utiliza, pur și simplu plasați adresa URL dorită la sfârșitul acestei adrese URL!</p><p>... SAU folosești caseta de mai jos!</p><input type="url" placeholder="Introduceți adresa URL aici!"/><br><button onclick="document.querySelector(\'pre\').textContent=window.location.href+(window.location.href.endsWith(\'/\')?\'\':\'/\')+document.querySelector(\'input\').value;">Obțineți URL-ul activat CORS!</button><br><pre></pre></body></html>');
    res.end();
  }else if(req.url=="/favicon.ico"){res.end();}else{
    if(req.url.startsWith("/about:")){
      res.writeHead(200,{'Content-Type':'text/html','Access-Control-Allow-Origin':'*','Access-Control-Request-Method':'*','Access-Control-Allow-Methods':'OPTIONS, GET','Access-Control-Allow-Headers':'*'});
      res.write('<!DOCTYPE html><html><head></head><body></body></html>');
      return res.end();
    }
    (req.url.substr(1,5).endsWith("s")?require("https"):http).get(req.url.slice(1),(resp)=>{
      var headers={};
      Object.keys(resp.headers).forEach(e=>{
        var newKey='';
        e.split('-').forEach(i=>newKey+=(i==e.slice(0,e.includes('-')?e.indexOf('-'):undefined)?'':'-')+i[0].toUpperCase()+i.slice(1).toLowerCase());
        headers[newKey]=resp.headers[e];
      });
      headers['Access-Control-Allow-Origin']='*';
      headers['Access-Control-Request-Method']='*';
      headers['Access-Control-Allow-Methods']='OPTIONS, GET';
      headers['Access-Control-Allow-Headers']='*';
      if(headers['Location'])headers['Location']='https://ro-proxy-cors.glitch.me/'+headers['Location'];
      if(headers['Refresh']&&headers['Refresh'].toLowerCase().includes('url'))headers['Refresh']=headers['Refresh'].substr(0,headers['Refresh'].substr(headers['Refresh'].toLowerCase().indexOf('url')).indexOf('=')+3)+'https://ro-proxy-cors.glitch.me/'+headers['Refresh'].substr(headers['Refresh'].substr(headers['Refresh'].toLowerCase().indexOf('url')).indexOf('=')+3);
      res.writeHead(resp.statusCode,headers);
      resp.on("end",()=>res.end());
      resp.pipe(res);
    }).on('error',e=>console.log(e)).end(()=>res.end());
  }
}).listen(8080);