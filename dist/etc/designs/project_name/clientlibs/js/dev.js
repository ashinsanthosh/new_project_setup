snqs.renderTemplate=function(e,n,t){var r=($(document,'link[href="'+e+'"]'),"components/"),o='document, link[href="'+e+'"]',a=[],c=e,u=n||"/index.json",l=t||"";if(l=l.replace(/\s+/g,""),l.indexOf(",")>=-1){var f=l.split(",");for(i=0;i<f.length;i++)a.push(f[i])}else a.push(l);$.get(r+c+u,function(e){var n=e;$.get(r+c,function(e){var s=Mustache.render(e,n);$(o).before(s),$(o).remove()})});var p=$.unique(a);for(p=jQuery.grep(p,function(e){return e}),s=0;s<p.length&&($.getScript("./dist/etc/designs/"+pro_name+"/clientlibs/js/"+p[s]+".js"),s!=p.length-1);s++);},snqs.loadTemplates=function(){var e=$('link[class="component"]'),n="components/",t=[];$.each(e,function(e,s){var r=$(s),i=r.attr("href"),o=r.data("json")||"/index.json",a=r.data("script")||"";if(a=a.replace(/\s+/g,""),a.indexOf(",")>=-1){var c=a.split(",");for(e=0;e<c.length;e++)t.push(c[e])}else t.push(a);$.get(n+i+o,function(e){var t=e;$.get(n+i,function(e){var n=Mustache.render(e,t);$(s).before(n),$(s).remove()})})});var r=$.unique(t);for(r=jQuery.grep(r,function(e){return e}),s=0;s<r.length&&($.getScript("./dist/etc/designs/"+pro_name+"/clientlibs/js/"+r[s]+".js"),s!=r.length-1);s++);snqs.loaded=!0};