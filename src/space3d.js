/* ---------- 宇宙ズーム（three.js） ---------- */
const SPZ=(()=>{
  if(typeof THREE==="undefined") return null;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z), C=c=>new THREE.Color(c);
  let renderer,scene,camera,root,el,lab,info,fade,running=false,t0=performance.now(),last=0;
  let LV=0, objs=[], anims=[], focus=null;
  const cam={th:.6,ph:1.1,dist:30,goal:30,target:V(0,0,0),goalT:V(0,0,0),min:1,max:100,drag:null,auto:true};
  let seed=7;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  const texCache={};
  function canvasTex(key,w,h,draw){if(texCache[key])return texCache[key];const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;texCache[key]=t;return t;}
  function noise(g,w,h,n,col,rmin,rmax,a=.15){for(let i=0;i<n;i++){g.globalAlpha=a*R();g.fillStyle=col;g.beginPath();g.arc(R()*w,R()*h,rmin+R()*(rmax-rmin),0,7);g.fill();}g.globalAlpha=1;}
  const T={
    earth:()=>canvasTex("earth",1024,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#1d3f73");gr.addColorStop(.5,"#1f5a9a");gr.addColorStop(1,"#1d3f73");g.fillStyle=gr;g.fillRect(0,0,w,h);
      g.fillStyle="#4d7a3a";g.fill(new Path2D(EARTHPATH));g.save();g.clip(new Path2D(EARTHPATH));noise(g,w,h,900,"#a88f5a",3,18,.35);noise(g,w,h,500,"#2f5f2a",3,14,.3);g.restore();
      g.fillStyle="#f2f6fa";g.fillRect(0,0,w,22);g.fillRect(0,h-40,w,40);}),
    clouds:()=>canvasTex("clouds",1024,512,(g,w,h)=>{g.clearRect(0,0,w,h);for(let i=0;i<500;i++){g.globalAlpha=.08+R()*.18;g.fillStyle="#fff";g.beginPath();g.ellipse(R()*w,h*.1+R()*h*.8,8+R()*40,3+R()*10,0,0,7);g.fill();}}),
    moon:()=>canvasTex("moon",512,256,(g,w,h)=>{g.fillStyle="#9a9a96";g.fillRect(0,0,w,h);noise(g,w,h,160,"#5f5f5c",6,40,.45);for(let i=0;i<300;i++){const x=R()*w,y=R()*h,r=1+R()*7;g.strokeStyle="#6e6e6a";g.globalAlpha=.6;g.beginPath();g.arc(x,y,r,0,7);g.stroke();}g.globalAlpha=1;}),
    mars:()=>canvasTex("mars",512,256,(g,w,h)=>{g.fillStyle="#b5562d";g.fillRect(0,0,w,h);noise(g,w,h,240,"#6e2e17",6,40,.4);noise(g,w,h,120,"#d98a5a",6,30,.3);g.fillStyle="#f3eee8";g.fillRect(0,0,w,10);g.fillRect(0,h-8,w,8);}),
    bands:(k,cols)=>canvasTex(k,512,256,(g,w,h)=>{for(let y=0;y<h;y+=2){const i=Math.floor((Math.sin(y*.09)+Math.sin(y*.23)+2)/4*cols.length);g.fillStyle=cols[Math.min(cols.length-1,i)];g.fillRect(0,y,w,2);}noise(g,w,h,200,"#ffffff",4,20,.08);
      if(k==="jupiter"){g.fillStyle="#b4573a";g.beginPath();g.ellipse(w*.6,h*.62,26,14,0,0,7);g.fill();}}),
    sun:()=>canvasTex("sun",512,256,(g,w,h)=>{g.fillStyle="#ffb13b";g.fillRect(0,0,w,h);noise(g,w,h,900,"#ff7a1a",2,10,.35);noise(g,w,h,400,"#fff1a8",2,8,.3);}),
    glow:(col)=>canvasTex("glow"+col,128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,col);r.addColorStop(.25,col);r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,w,h);}),
    ring:()=>canvasTex("ring",256,8,(g,w,h)=>{for(let x=0;x<w;x++){g.globalAlpha=x<20?0:(.35+.5*Math.abs(Math.sin(x*.13))*(x>150&&x<170?.1:1));g.fillStyle=x%7<3?"#d8c7a0":"#b8a47c";g.fillRect(x,0,1,h);}}),
    night:()=>canvasTex("night",2048,1024,(g,w,h)=>{g.fillStyle="#000";g.fillRect(0,0,w,h);g.save();g.scale(w/1024,h/512);g.clip(new Path2D(EARTHPATH));g.setTransform(1,0,0,1,0,0);
      const P=(la,lo)=>[(lo+180)/360*w,(90-la)/180*h];const dot=(x,y,r,a)=>{g.globalAlpha=a;g.beginPath();g.arc(x,y,r,0,7);g.fill();};
      const gs=()=>{let u=0,v=0;while(!u)u=R();while(!v)v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(6.283*v);};
      g.fillStyle="#ffd9a0";try{(typeof COUNTRIES!=="undefined"?COUNTRIES.list:[]).forEach(c=>{if(!c.pop||!c.area||c.area>2.4e6||!c.ll)return;const n=Math.min(260,Math.round(Math.sqrt(c.pop[1])/70));const rd=Math.sqrt(c.area)/111*.42;for(let i=0;i<n;i++){const[x,y]=P(c.ll[0]+gs()*rd,c.ll[1]+gs()*rd/Math.max(.3,Math.cos(c.ll[0]*Math.PI/180)));dot(x,y,.7+R()*.8,.25+R()*.35);}});}catch(e){}
      CITIES.forEach(([la,lo,pm])=>{const n=Math.round(25+pm*22),sd=.25+Math.sqrt(pm)*.28;const[cx,cy]=P(la,lo);const r0=1.6+Math.sqrt(pm)*1.5;const gr=g.createRadialGradient(cx,cy,0,cx,cy,r0);gr.addColorStop(0,"rgba(255,226,170,.8)");gr.addColorStop(1,"rgba(255,180,90,0)");g.globalAlpha=1;g.fillStyle=gr;g.fillRect(cx-r0,cy-r0,r0*2,r0*2);
        g.fillStyle="#ffe2b0";for(let i=0;i<n;i++){const[x,y]=P(la+gs()*sd,lo+gs()*sd/Math.max(.3,Math.cos(la*Math.PI/180)));dot(x,y,.6+R()*.9,.35+R()*.5);}});
      g.restore();g.globalAlpha=1;}),
    ocean:()=>canvasTex("ocean",1024,512,(g,w,h)=>{g.fillStyle="#fff";g.fillRect(0,0,w,h);g.fillStyle="#000";g.fill(new Path2D(EARTHPATH));}),
    cmb:()=>canvasTex("cmb",512,256,(g,w,h)=>{g.fillStyle="#3a2a60";g.fillRect(0,0,w,h);noise(g,w,h,2500,"#ff8a3a",2,9,.25);noise(g,w,h,2500,"#3a8aff",2,9,.25);}),
  };
  const smat=(o)=>new THREE.MeshStandardMaterial({roughness:.9,metalness:0,...o});
  const CITIES=[[35.68,139.69,37],[28.61,77.21,33],[31.23,121.47,29],[23.81,90.41,23],[-23.55,-46.63,22],[19.43,-99.13,22],[30.04,31.24,22],[39.9,116.4,21],[19.08,72.88,21],[34.69,135.5,19],[29.56,106.55,17],[24.86,67.01,17],[-4.44,15.27,17],[6.52,3.38,16],[41.01,28.98,16],[-34.6,-58.38,15],[22.57,88.36,15],[14.6,120.98,15],[23.13,113.26,14],[39.34,117.36,14],[31.55,74.34,14],[-22.91,-43.17,14],[12.97,77.59,13],[22.54,114.06,13],[55.76,37.62,12.6],[13.08,80.27,12],[4.71,-74.07,11],[48.86,2.35,11],[-6.21,106.85,11],[-12.05,-77.04,11],[13.76,100.5,11],[17.39,78.49,10.5],[37.57,126.98,10],[35.18,136.91,9.5],[51.51,-.13,9.6],[30.57,104.07,9.5],[32.06,118.8,9.4],[35.69,51.39,9.4],[10.82,106.63,9.3],[-8.84,13.23,9],[30.59,114.31,8.9],[34.34,108.94,8.6],[23.02,72.57,8.6],[3.14,101.69,8.4],[40.71,-74.01,18.8],[34.05,-118.24,12.5],[41.88,-87.63,8.9],[29.76,-95.37,7],[32.78,-96.8,7.5],[38.91,-77.04,6.3],[25.76,-80.19,6.1],[33.75,-84.39,6],[39.95,-75.17,6],[42.36,-71.06,4.9],[37.77,-122.42,4.7],[33.45,-112.07,4.9],[47.61,-122.33,4],[43.65,-79.38,6.4],[45.5,-73.57,4.3],[49.28,-123.12,2.6],[40.42,-3.7,6.7],[41.39,2.17,5.6],[52.52,13.4,6],[41.9,12.5,4.3],[45.46,9.19,5],[51.45,7.01,5],[52.37,4.9,2.5],[50.85,4.35,2.1],[48.21,16.37,2],[52.23,21.01,1.8],[59.93,30.36,5.4],[50.45,30.52,3],[37.98,23.73,3.2],[24.71,46.68,7.5],[21.49,39.19,4.7],[33.31,44.36,7.5],[25.2,55.27,3.5],[39.93,32.86,5.5],[-26.2,28.05,10],[-33.92,18.42,4.8],[-1.29,36.82,5],[9.03,38.74,5],[15.5,32.56,6],[-6.79,39.21,7],[5.36,-4.01,5.5],[5.6,-.19,2.6],[33.57,-7.59,3.8],[36.75,3.06,3],[-33.45,-70.67,7],[10.48,-66.9,3],[-33.87,151.21,5.3],[-37.81,144.96,5.2],[-27.47,153.03,2.6],[-31.95,115.86,2.2],[-36.85,174.76,1.7],[1.35,103.82,6],[22.32,114.17,7.5],[25.03,121.57,7],[39.04,125.76,3],[21.03,105.85,8],[16.87,96.2,5.6],[34.56,69.21,4.6],[41.3,69.24,2.9],[43.24,76.89,2],[55.01,82.93,1.6],[56.84,60.61,1.5],[45.8,126.53,6],[41.8,123.43,7],[33.59,130.4,5.5],[43.06,141.35,2.6],[35.18,129.08,3.4],[27.72,85.32,1.5],[6.93,79.86,2.5],[6.24,-75.58,4],[20.66,-103.35,5.3],[25.69,-100.32,5.3],[23.11,-82.37,2.1],[-19.92,-43.94,6],[-15.79,-47.88,4.8],[-8.05,-34.88,4],[-30.03,-51.23,4.3],[-12.97,-38.5,3.9],[-.18,-78.47,2.8],[-16.5,-68.15,2],[53.48,-2.24,2.8],[55.95,-3.19,1],[53.35,-6.26,1.4],[59.33,18.07,1.6],[55.68,12.57,1.4],[59.91,10.75,1.1],[60.17,24.94,1.3],[47.5,19.04,1.8],[50.08,14.44,1.3],[44.43,26.1,1.8],[42.7,23.32,1.3],[44.79,20.45,1.4],[38.72,-9.14,2.9],[48.14,11.58,2.6],[53.55,9.99,1.9],[50.11,8.68,2.3],[45.76,4.84,2.3],[43.3,5.37,1.9],[40.85,14.27,3.1],[31.77,35.21,1.2],[32.08,34.78,4],[33.89,35.5,2.4],[36.2,37.13,2],[29.38,47.99,3],[25.29,51.53,2.4],[23.59,58.41,1.6],[12.01,8.52,4.3],[9.06,7.49,3.8],[14.72,-17.47,3.3],[12.64,-8,2.8],[-17.83,31.05,2.2],[-15.42,28.28,3],[-25.97,32.57,1.8],[-18.88,47.51,3.6],[0.35,32.58,3.9],[-1.95,30.06,1.3],[30.27,-97.74,2.4],[39.74,-104.99,3],[36.17,-115.14,2.3],[44.98,-93.27,3.7],[42.33,-83.05,4.3],[29.95,-90.07,1.3],[35.23,-80.84,2.7],[-34.9,-56.19,1.8],[-25.26,-57.58,2.4],[10.39,-75.51,1.1],[18.47,-69.9,3.5],[14.63,-90.51,3],[9.93,-84.08,1.4],[8.98,-79.52,1.9]];
  const VS=`varying vec2 vUv;varying vec3 vN;varying vec3 vW;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
  function earthMesh(r,sun){const s=sun.clone().normalize();const m=new THREE.ShaderMaterial({uniforms:{day:{value:T.earth()},night:{value:T.night()},spec:{value:T.ocean()},sun:{value:s}},vertexShader:VS,
    fragmentShader:`uniform sampler2D day;uniform sampler2D night;uniform sampler2D spec;uniform vec3 sun;varying vec2 vUv;varying vec3 vN;varying vec3 vW;
    void main(){vec3 n=normalize(vN);float d=dot(n,sun);float k=smoothstep(-.1,.2,d);vec3 dc=pow(texture2D(day,vUv).rgb,vec3(2.2));vec3 nc=texture2D(night,vUv).rgb;float o=texture2D(spec,vUv).r;
      vec3 v=normalize(cameraPosition-vW);vec3 h=normalize(sun+v);float sp=pow(max(dot(n,h),0.),55.)*o*k;
      vec3 col=dc*(1.7*max(d,0.)+.03)+sp*vec3(1.,.9,.75)*1.3+dc*vec3(.9,.35,.08)*exp(-d*d*90.)*.35;
      col+=pow(nc,vec3(1.6))*vec3(1.,.7,.36)*2.2*(1.-k);
      float rim=pow(1.-max(dot(n,v),0.),4.);col+=vec3(.25,.5,1.)*rim*.7*(.08+k);
      gl_FragColor=vec4(col,1.);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`});return sphere(r,m,96);}
  function cloudMesh(r,sun){const m=new THREE.ShaderMaterial({uniforms:{map:{value:T.clouds()},sun:{value:sun.clone().normalize()}},vertexShader:VS,transparent:true,depthWrite:false,
    fragmentShader:`uniform sampler2D map;uniform vec3 sun;varying vec2 vUv;varying vec3 vN;varying vec3 vW;void main(){vec4 c=texture2D(map,vUv);float d=dot(normalize(vN),sun);float k=smoothstep(-.12,.25,d);
      gl_FragColor=vec4(vec3(1.,.98,.96)*(.03+1.25*max(d,0.)),c.a*(.06+.94*k));
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`});return sphere(r,m,64);}
  function atmoMesh(r,sun){const m=new THREE.ShaderMaterial({uniforms:{sun:{value:sun.clone().normalize()}},vertexShader:VS,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
    fragmentShader:`uniform vec3 sun;varying vec2 vUv;varying vec3 vN;varying vec3 vW;void main(){vec3 n=normalize(vN);vec3 v=normalize(cameraPosition-vW);float f=1.-abs(dot(n,v));float a=pow(f,3.2);float k=smoothstep(-.3,.4,dot(n,sun));
      gl_FragColor=vec4(vec3(.32,.6,1.)*a*(.08+1.25*k),1.);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`});return sphere(r*1.04,m,64);}
  function sphere(r,m,seg=48){return new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.round(seg/2)),m);}
  function sprite(col,size,op=1){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:T.glow(col),color:"#ffffff",transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.setScalar(size);return s;}
  function orbit(r,col="#5a6a90",op=.6,incl=0,seg=256,ecc=0,rot=0){const pts=[];for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2;const rr=r*(1-ecc*ecc)/(1+ecc*Math.cos(a));pts.push(V(Math.cos(a+rot)*rr,0,Math.sin(a+rot)*rr));}
    const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op}));l.rotation.x=incl;return l;}
  function points(arr,col,size,op=1,attn=true,colors){const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(new Float32Array(arr),3));
    if(colors)g.setAttribute("color",new THREE.BufferAttribute(new Float32Array(colors),3));
    return new THREE.Points(g,new THREE.PointsMaterial({color:colors?"#ffffff":col,vertexColors:!!colors,size,sizeAttenuation:attn,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,map:T.glow("#ffffff")}));}
  function sph2(r,col){const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),new THREE.MeshBasicMaterial({color:col}));scene.add(m);return m;}
  function obj(id,name,node,view,desc,dist){const o={id,name,node,view,desc,dist};objs.push(o);(window.SPZ_ALL=window.SPZ_ALL||{})[id]=name;return o;}
  function sunLight(pos=V(-1,0,0).multiplyScalar(1000)){const l=new THREE.DirectionalLight("#fff6e8",1.6);l.position.copy(pos);scene.add(l);scene.add(new THREE.AmbientLight("#334466",.35));}
  function planet(r,tex,opts={}){const m=sphere(r,smat({map:tex,...opts}));return m;}
  function iss(){const g=new THREE.Group();const tm=smat({color:"#c9ced6",metalness:.6,roughness:.4});
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.1,.03,.03),tm));
    const pm=smat({color:"#c08a2e",metalness:.5,roughness:.35,emissive:"#3a2a08"});
    for(let i=0;i<4;i++){for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.005,.42),pm);p.position.set(-.5+i*.33+(i>1?.02:0),0,s*.24);g.add(p);}}
    const mm=smat({color:"#e8e8e8",metalness:.3,roughness:.5});for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.2,12),mm);c.rotation.z=Math.PI/2;c.position.set(-.1+i*.18,-.05,0);g.add(c);}
    return g;}

__SPACEFX__
__SPACEPLANET__
  const gal=(l,b)=>{l*=Math.PI/180;b*=Math.PI/180;return V(Math.cos(b)*Math.cos(l),Math.sin(b),Math.cos(b)*Math.sin(l));};
  function diskTex(){return canvasTex("disk",256,256,(g,w,h)=>{const r=g.createRadialGradient(128,128,40,128,128,128);r.addColorStop(0,"rgba(0,0,0,0)");r.addColorStop(.32,"rgba(255,250,230,1)");r.addColorStop(.5,"rgba(255,170,60,.95)");r.addColorStop(.75,"rgba(200,70,20,.5)");r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,w,h);
    g.globalCompositeOperation="destination-out";for(let i=0;i<60;i++){g.globalAlpha=.25*R();g.beginPath();g.arc(128,128,50+R()*75,R()*6.3,R()*6.3+.6);g.lineWidth=1+R()*3;g.stroke();}});}
  function blackHole(r,name){return blackHoleFX(r*1.15);}
  function blackHoleOld(r,name){const g=new THREE.Group();g.add(sphere(r,new THREE.MeshBasicMaterial({color:"#000"}),32));
    const dm=new THREE.MeshBasicMaterial({map:diskTex(),transparent:true,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false});
    const d=new THREE.Mesh(new THREE.PlaneGeometry(r*10,r*10),dm);d.rotation.x=-Math.PI/2+.25;g.add(d);const d2=d.clone();d2.rotation.set(0,0,0);d2.scale.setScalar(.62);d2.material=dm.clone();d2.material.opacity=.55;g.add(d2);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r*1.5,r*.05,8,64),new THREE.MeshBasicMaterial({color:"#ffe2a8"}));g.add(ring);
    g.add(sprite("#ff9a40",r*14,.35));anims.push(t=>{d.rotation.z=t*.3;d2.rotation.z=-t*.2;ring.lookAt(camera.position);d2.lookAt(camera.position);});return g;}
  function nebula(kind,cols,size,n=40){const g=new THREE.Group();
    for(let i=0;i<n;i++){const c=cols[i%cols.length];let x,y,z;
      if(kind==="ring"){const a=i/n*6.283;x=Math.cos(a)*size*.4;y=Math.sin(a)*size*.4;z=(R()-.5)*size*.1;}
      else if(kind==="pillars"){const k=i%3;x=(k-1)*size*.25+(R()-.5)*size*.08;y=(R()-.5)*size*(k===1?1:.7)-size*.1;z=(R()-.5)*size*.1;}
      else if(kind==="burst"){const a=R()*6.283,u=R()*2-1,r=size*.45*Math.sqrt(R());x=Math.cos(a)*Math.sqrt(1-u*u)*r;y=u*r*.7;z=Math.sin(a)*Math.sqrt(1-u*u)*r;}
      else {x=(R()-.5)*size;y=(R()-.5)*size*.7;z=(R()-.5)*size*.6;}
      const s=sprite(c,size*(.25+R()*.45),kind==="pillars"&&i%3!==1?.18:.32);s.position.set(x,y,z);if(kind==="pillars")s.scale.y*=2.2;g.add(s);}
    if(kind==="ring"){const c=sprite("#ffffff",size*.12,1);g.add(c);}
    if(kind==="pillars"){const pm=new THREE.MeshBasicMaterial({color:"#3a2418",transparent:true,opacity:.85});[[-.25,.7],[0,1],[.25,.55]].forEach(([x,h])=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(size*.03,size*.06,size*h,8),pm);m.position.set(x*size,-size*.2,size*.05);g.add(m);});}
    if(kind==="burst"){const pts=[];for(let i=0;i<1500;i++){const a=R()*6.283,u=R()*2-1,r=size*.5*Math.pow(R(),.4);pts.push(Math.cos(a)*Math.sqrt(1-u*u)*r,u*r*.7,Math.sin(a)*Math.sqrt(1-u*u)*r);}g.add(points(pts,"#ffb070",size*.015,.8));g.add(sprite("#9fc8ff",size*.15,1));}
    return g;}
  function starlinkSat(){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(.28,.03,.14),smat({color:"#d8dbe2",metalness:.7,roughness:.3})));
    const pn=new THREE.Mesh(new THREE.BoxGeometry(.9,.006,.18),smat({color:"#3a5ad0",metalness:.4,roughness:.3,emissive:"#1a2a70"}));pn.position.set(.6,.03,0);g.add(pn);return g;}
  function hubbleSat(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.5,20),smat({color:"#c9ced6",metalness:.8,roughness:.3}));b.rotation.z=Math.PI/2;g.add(b);
    for(const s of[-1,1]){const pn=new THREE.Mesh(new THREE.BoxGeometry(.05,.005,.5),smat({color:"#3a4a8a",emissive:"#0a1230"}));pn.position.set(0,0,s*.35);g.add(pn);}return g;}
  function jwstSat(){const g=new THREE.Group();const sh=new THREE.Mesh(new THREE.PlaneGeometry(2,1.2),new THREE.MeshStandardMaterial({color:"#c9a6e0",metalness:.6,roughness:.3,side:THREE.DoubleSide}));sh.rotation.x=-Math.PI/2;g.add(sh);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.04,6),smat({color:"#d4a63a",metalness:1,roughness:.15,emissive:"#3a2a08"}));m.rotation.x=Math.PI/2;m.position.set(0,.55,.1);g.add(m);return g;}
  function constellation(id,nm,lon,stars,lines,R0,info){const g=new THREE.Group();const L=lon*Math.PI/180;const c=V(Math.cos(L),0,Math.sin(L)).multiplyScalar(R0);const t=V(-Math.sin(L),0,Math.cos(L));
    const pos=stars.map(([u,v])=>c.clone().add(t.clone().multiplyScalar(u*R0*.022)).add(V(0,v*R0*.022,0)));
    pos.forEach((q,i)=>{const s=sprite(i===0?"#fff1c8":"#dfe8ff",R0*(i===0?.03:.02),1);s.position.copy(q);g.add(s);});
    const seg=[];lines.forEach(([a,b])=>seg.push(pos[a],pos[b]));g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg),new THREE.LineBasicMaterial({color:"#7fb2ff",transparent:true,opacity:.55})));
    scene.add(g);const n=new THREE.Object3D();n.position.copy(c).add(V(0,R0*.06,0));scene.add(n);obj(id,nm,n,R0*.35,info,"黄経 約"+lon+"°");}

  const ok=y=>typeof window.KYEAR!=="number"||window.KYEAR>=y;
  // ---- Type I（もしも）の宇宙構造物 ----
  const T1=()=>typeof window.KYEAR==="number"&&window.KYEAR>=2100;
  function t1Leo(e){
    const cm=new THREE.LineBasicMaterial({color:"#9fe8ff",transparent:true,opacity:.9});
    const cab=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(6.37,0,0),V(52,0,0)]),cm);e.add(cab);
    const cw=sphere(.6,new THREE.MeshStandardMaterial({color:"#dfe6ee",emissive:"#3a6080"}),12);cw.position.set(52,0,0);e.add(cw);
    const cl=sphere(.25,new THREE.MeshBasicMaterial({color:"#7ee0ff"}),8);e.add(cl);anims.push(t=>{const k=(t*.05)%1;cl.position.set(6.4+k*45,0,0);});
    const en=new THREE.Object3D();en.position.set(20,0,0);e.add(en);obj("t1elev","軌道エレベーター（もしも）",en,40,"赤道の海上基地から静止軌道（高度約3.6万km）の先までケーブルを伸ばし、反対側のおもりで張る。昇降機で物資を運び、ロケットより打ち上げ費用を大きく下げる。必要な強さの素材（カーボンナノチューブなど）はまだ作れない。","全長 約10万km");
    const rg=new THREE.Mesh(new THREE.TorusGeometry(6.75,.035,8,256),new THREE.MeshBasicMaterial({color:"#ffd27a",transparent:true,opacity:.9}));rg.rotation.x=Math.PI/2+.12;scene.add(rg);
    const rn=new THREE.Object3D();rn.position.set(0,.8,6.75);scene.add(rn);obj("t1ring","軌道リング（もしも）",rn,6,"地球を一周する環状の構造物。高速で回る内側のリングが遠心力で全体を支え、地上からのタワーやエレベーターで出入りする。宇宙への輸送を「電車並み」にする構想。","高度 約200〜400km");
    for(let j=0;j<8;j++){const a=j/8*6.283+.2;const g=new THREE.Group();const p=new THREE.Mesh(new THREE.BoxGeometry(2.4,.02,1.2),smat({color:"#2a4aa0",metalness:.6,roughness:.3,emissive:"#10226a"}));g.add(p);
      g.position.set(Math.cos(a)*42.16,0,Math.sin(a)*42.16);g.lookAt(0,0,0);scene.add(g);
      if(j%2===0){const bm=new THREE.Line(new THREE.BufferGeometry().setFromPoints([g.position.clone(),g.position.clone().normalize().multiplyScalar(6.4)]),new THREE.LineBasicMaterial({color:"#ff9f5a",transparent:true,opacity:.35}));scene.add(bm);}}
    const sn=new THREE.Object3D();sn.position.set(42.16*Math.cos(.2),2,42.16*Math.sin(.2));scene.add(sn);obj("t1sps","宇宙太陽光発電衛星（もしも）",sn,18,"静止軌道で一日中太陽光を受けて発電し、マイクロ波で地上の受電所に送る。雲や夜の影響を受けない。","高度35,786km");
    const hb=new THREE.Group();const cyl1=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,2.6,24),smat({color:"#e6ebf2",metalness:.5,roughness:.3}));cyl1.rotation.z=Math.PI/2;hb.add(cyl1);
    for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.BoxGeometry(2.4,.02,.6),smat({color:"#9fd8ff",emissive:"#3a7ab0",transparent:true,opacity:.8}));w.position.set(0,s*.55,0);hb.add(w);}
    hb.position.set(-14,4,10);scene.add(hb);anims.push(t=>hb.rotation.x=t*.4);obj("t1hab","宇宙居住地（オニール・シリンダー型）",hb,7,"回転する円筒の内側に、遠心力で重力をつくって数万人が暮らす（もしも）。","地球の近く");
    const sd=new THREE.Object3D();scene.add(sd);const sx=[];for(let i=0;i<40;i++){const s=sphere(.07,new THREE.MeshBasicMaterial({color:"#ff7a7a"}),6);sd.add(s);sx.push([s,R()*6.28,12+R()*14,R()-.5]);}
    anims.push(t=>sx.forEach(([s,a,r,i])=>{const b=a+t*.05;s.position.set(Math.cos(b)*r,Math.sin(b)*r*i*.6,Math.sin(b)*r);}));
    const dn=new THREE.Object3D();dn.position.set(0,6,18);scene.add(dn);obj("t1def","地球防衛・デブリ回収網（もしも）",dn,16,"宇宙ごみを回収し、危険な小惑星を早めに見つけて軌道を変える体制。2022年のDART実験がその第一歩。","高度 さまざま");
  }
  function t1Moon(m){
    const lights=[];for(let i=0;i<220;i++){const la=(R()-.5)*1.2,lo=R()*6.283*.5-1.2;const r=1.745;lights.push(Math.cos(la)*Math.cos(lo)*r,Math.sin(la)*r,-Math.cos(la)*Math.sin(lo)*r);}
    const pl=points(lights,"#ffd27a",.05,1);m.add(pl);
    const md=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,1.74,0),V(0,30,0)]),new THREE.LineBasicMaterial({color:"#7ee0ff",transparent:true,opacity:.5}));m.add(md);
    const cn=new THREE.Object3D();cn.position.set(0,1.9,0);m.add(cn);obj("t1mooncity","月面都市と質量投射機（もしも）",cn,8,"南極の氷を水と燃料に変えて数万人が暮らす。電磁レールで月の資源を宇宙へ打ち出し、建設材料にする。","約384,400km");
  }
  // ---- Type II（もしも）の構造物 ----
  const T2=y=>typeof window.KYEAR==="number"&&window.KYEAR>=y;
  function t2Inner(s){const k=Math.min(1,(window.KYEAR-2500)/1500);const n=Math.floor(300+2700*k);const pos=[];const D=[];for(let i=0;i<n;i++){const u=R()*2-1,a=R()*6.283,r=24+R()*4;D.push([a,Math.asin(u),r,.05+R()*.08]);pos.push(0,0,0);}
    const g=points(pos,"#f4b942",1.6,.9,true);scene.add(g);anims.push(t=>{const p=g.geometry.attributes.position;D.forEach(([a,b,r,w],i)=>{const q=a+t*w;p.setXYZ(i,Math.cos(b)*Math.cos(q)*r,Math.sin(b)*r,Math.cos(b)*Math.sin(q)*r);});p.needsUpdate=true;});
    const m=new THREE.Object3D();m.position.set(0,26,0);scene.add(m);obj("t2swarm","ダイソン・スウォーム（もしも）",m,70,`太陽のまわりを無数の発電衛星で取り囲み、太陽の光をほぼすべて集める。完成すれば利用できるエネルギーは約3.8×10²⁶W（今の人類の約20兆倍）。この時代の完成度：約${Math.round(k*100)}%。材料には水星を解体して使う案がある（水星の全質量で、地球軌道の球を厚さ約0.5mmの膜で覆える計算）。`,"太陽から約0.2〜0.4天文単位");
    if(T2(2350)){const v=new THREE.Object3D();v.position.set(72*Math.cos(1),3,72*Math.sin(1));scene.add(v);const sh=new THREE.Mesh(new THREE.CircleGeometry(5,24),new THREE.MeshBasicMaterial({color:"#cfe6ff",transparent:true,opacity:.5,side:THREE.DoubleSide}));sh.position.set(60*Math.cos(1),3,60*Math.sin(1));sh.lookAt(0,0,0);scene.add(sh);
      obj("t2venus","金星のテラフォーミング（もしも）",v,30,"太陽と金星の間に巨大な日よけを置いて金星を冷やし、厚い二酸化炭素の大気を固定して、人が住める星に変えていく。何百年もかかる計画。","太陽から0.72天文単位");}}
  function t2Helio(){const sh=sprite("#7ee0ff",6,1);scene.add(sh);const dir=V(.6,.15,-.78).normalize();anims.push(t=>{const k=(t*.02)%1;sh.position.copy(dir).multiplyScalar(80+k*3000);});
    const n=new THREE.Object3D();n.position.copy(dir).multiplyScalar(1500);scene.add(n);obj("t2ship","世代宇宙船（もしも）",n,600,"何世代もの人が船の中で生まれ育ちながら、数百年かけて近くの恒星系へ向かう巨大な宇宙船。光帆（レーザーで押す薄い帆）の小型探査機は光速の約20%で、20年ほどでケンタウルス座α星に届く構想もある。","太陽から遠ざかる");}
  function t2Stars(){const a=14.66/24*6.283,b=-60.8*Math.PI/180;const p=V(Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)).multiplyScalar(43.7);const c=sprite("#7ee0ff",4,1);c.position.copy(p).add(V(1.2,1,0));scene.add(c);
    const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),c.position]),new THREE.LineDashedMaterial({color:"#7ee0ff",dashSize:1,gapSize:.6}));ln.computeLineDistances();scene.add(ln);
    obj("t2colony","ケンタウルス座α星の植民地（もしも）",c,12,"太陽に最も近い恒星系への最初の植民地。光でも4.4年かかるので、地球との会話は往復9年近い。文明は太陽系の外へ広がり始める。","約4.4光年");}
  // ---- Type III（もしも） ----
  function t3Galaxy(g,sn){const Y=window.KYEAR;const rly=Math.min(60000,Math.max(30,(Y-6000)*.1));const r=rly/1000;
    const b=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),new THREE.MeshBasicMaterial({color:"#7ee0ff",transparent:true,opacity:.1,depthWrite:false}));b.scale.set(r,Math.min(r,2.5),r);b.position.copy(sn.position);g.add(b);
    const n=Math.floor(Math.min(4000,40+rly*.08));const pos=[],col=[];const c1=C("#7ee0ff"),c2=C("#ff6a4a");for(let i=0;i<n;i++){const a=R()*6.283,d=Math.sqrt(R())*r;const p=sn.position.clone().add(V(Math.cos(a)*d,(R()-.5)*Math.min(.8,r),Math.sin(a)*d));if(p.length()>48)continue;pos.push(p.x,p.y,p.z);const cc=R()<Math.min(.8,(Y-6000)/600000+.15)?c2:c1;col.push(cc.r,cc.g,cc.b);}
    const pt=points(pos,null,1.8,.9,true,col);g.add(pt);const m=new THREE.Object3D();m.position.copy(sn.position).add(V(0,Math.min(r,2.5)+.5,0));g.add(m);
    obj("t3reach","人類の文明が広がった範囲（もしも）",m,Math.max(14,r*1.8),`この時代に人類が広がった範囲は半径約${Math.round(rly).toLocaleString()}光年。水色＝植民した恒星系、赤＝ダイソン構造に囲まれて赤外線で光る恒星。光速の10%前後で広がると考えると、銀河全体（直径約10万光年）に広がるには数十万〜100万年かかる。`,"太陽系を中心に");}
  // ---- スケール ----
  const SUB=[
   {id:"leo",name:"地球周回軌道",unit:"1目盛＝1000km",desc:"国際宇宙ステーション、衛星コンステレーション、GPS、静止衛星。人類が日常的に使っている宇宙。",dist:40,min:7.5,max:120,
    build(){sunLight(V(-60,10,30).multiplyScalar(20));
      const e=earthMesh(6.371,V(-60,10,30));scene.add(e);anims.push(t=>e.rotation.y=t*.02);scene.add(atmoMesh(6.371,V(-60,10,30)));
      const cl=cloudMesh(6.43,V(-60,10,30));scene.add(cl);anims.push(t=>cl.rotation.y=t*.026);
      const at=sprite("#6fb6ff",17,.22);scene.add(at);
      const kar=sphere(6.471,new THREE.MeshBasicMaterial({color:"#6fb6ff",transparent:true,opacity:.07,depthWrite:false}));scene.add(kar);
      obj("earth","地球",e,20,"半径6371km。さらにズームインすると世界地図に降りられます。","—");
      const karn=new THREE.Object3D();karn.position.set(0,6.471,0);scene.add(karn);obj("karman","カーマン線（高度100km）",karn,3,"ここから上が宇宙とされる境界。大気はここでもまだ薄く残る。","高度100km");
      if(ok(1998)){const io=orbit(6.78,"#f4b942",.8,.9);scene.add(io);const ip=new THREE.Object3D();io.add(ip);const im=iss();im.scale.setScalar(.6);ip.add(im);
      anims.push(t=>{const a=t*.25;ip.position.set(Math.cos(a)*6.78,0,Math.sin(a)*6.78);im.rotation.y=-a;});obj("iss","国際宇宙ステーション（ISS）",ip,1.6,"高度約400km、約90分で地球を1周。2000年から人が絶えず滞在している（模型の大きさは誇張）。","高度約400km");}
      if(ok(2021)){const to=orbit(6.76,"#ff8f8f",.5,.72);scene.add(to);const tp=new THREE.Object3D();to.add(tp);const tm=iss();tm.scale.setScalar(.35);tp.add(tm);anims.push(t=>{const a=t*.25+2;tp.position.set(Math.cos(a)*6.76,0,Math.sin(a)*6.76);});
      obj("tiangong","天宮（中国の宇宙ステーション）",tp,1.4,"2021年から運用。高度約400km。","高度約400km");}
      if(ok(2019)){const sl=[];for(const inc of[.93,1.22,1.69,.5])for(let i=0;i<220;i++){sl.push({a:i/220*6.283+R(),inc,r:6.92+R()*.05,raan:R()*6.28});}
      const sg=new Float32Array(sl.length*3);const stl=points(sg,"#cfe6ff",.06,.9);scene.add(stl);
      anims.push(t=>{const p=stl.geometry.attributes.position;sl.forEach((s,i)=>{const a=s.a+t*.22;const x=Math.cos(a)*s.r,z=Math.sin(a)*s.r;const y=z*Math.sin(s.inc),z2=z*Math.cos(s.inc);
        p.setXYZ(i,x*Math.cos(s.raan)-z2*Math.sin(s.raan),y,x*Math.sin(s.raan)+z2*Math.cos(s.raan));});p.needsUpdate=true;});
      const so=orbit(6.92,"#cfe6ff",.25,.93);scene.add(so);const sp=new THREE.Object3D();so.add(sp);const sm=starlinkSat();sm.scale.setScalar(.9);sp.add(sm);anims.push(t=>{const a=t*.22+1;sp.position.set(Math.cos(a)*6.92,0,Math.sin(a)*6.92);sm.rotation.y=-a;});
      obj("starlinksat","Starlink衛星（1基）",sp,1.6,"平たい本体に大きな太陽電池パネル1枚。重さ約300〜800kg。数千基で地球を覆う（模型の大きさは誇張）。","高度約550km");}
      if(ok(1990)){const ho=orbit(6.91,"#9fc8ff",.3,.5);scene.add(ho);const hp=new THREE.Object3D();ho.add(hp);const hm=hubbleSat();hm.scale.setScalar(.7);hp.add(hm);anims.push(t=>{const a=t*.23+4;hp.position.set(Math.cos(a)*6.91,0,Math.sin(a)*6.91);});
      obj("hubble","ハッブル宇宙望遠鏡",hp,1.4,"1990年打ち上げ。大気の外から宇宙を観測し、宇宙の年齢の決定などに貢献した。","高度約530km");}
      if(ok(2019)){const sln=new THREE.Object3D();sln.position.set(5,5,0);scene.add(sln);obj("starlink","衛星コンステレーション",sln,9,"数千基の小型衛星で地球全体にインターネットを届ける。稼働中の衛星は約1万6,800機（2026年10月）で、その約3分の2がスターリンク。","高度約550km");}
      if(ok(1978)){for(let k=0;k<3;k++){const o=orbit(26.56,"#7fe0c0",.45,.96,256,0,k*2.09);o.rotation.y=k*2.09;scene.add(o);for(let j=0;j<4;j++){const s=sphere(.18,new THREE.MeshBasicMaterial({color:"#7fe0c0"}),8);o.add(s);const ph=j*1.57+k;anims.push(t=>{const a=ph+t*.04;s.position.set(Math.cos(a)*26.56,0,Math.sin(a)*26.56);});}}
      const gp=new THREE.Object3D();gp.position.set(26.56,0,0);scene.add(gp);obj("gps","GPS衛星（高度約2万km）",gp,22,"約30基の衛星が電波を送り、地球上のどこでも位置がわかる。","高度約20,200km");}
      if(ok(1963)){const go=orbit(42.16,"#c99cf2",.55);scene.add(go);for(let j=0;j<14;j++){const s=sphere(.22,new THREE.MeshBasicMaterial({color:"#c99cf2"}),8);const a=j/14*6.283;s.position.set(Math.cos(a)*42.16,0,Math.sin(a)*42.16);scene.add(s);}
      const gn=new THREE.Object3D();gn.position.set(0,0,42.16);scene.add(gn);obj("geo","静止軌道（高度35,786km）",gn,30,"地球の自転と同じ速さで回るので、地上からは止まって見える。気象衛星ひまわりや放送衛星の定位置。","高度35,786km");}
      if(T1())t1Leo(e);
    }},
   {id:"moon",name:"地球と月",center:[0,0,0],unit:"1目盛＝1000km",desc:"月は約38万km先。2026年4月、アルテミスIIの4人が54年ぶりに月の近くまで行き、人類の最遠記録を更新した。",dist:1100,min:6,max:4000,
    build(){sunLight(V(-1,.1,.4).multiplyScalar(2000));
      const e=earthMesh(6.371,V(-1,.1,.4));scene.add(e);anims.push(t=>e.rotation.y=t*.02);scene.add(atmoMesh(6.371,V(-1,.1,.4)));scene.add(sprite("#6fb6ff",16,.25));obj("earth","地球",e,25,"","—");
      const mo=orbit(384.4,"#6a7aa0",.5);scene.add(mo);const m=planetGPU(1.737,"moon",V(-1,.1,.4).multiplyScalar(2000),96);m.rotation.y=Math.PI;m.position.set(384.4,0,0);scene.add(m);obj("moon","月",m,8,"直径3474km。1969〜72年に12人が月面を歩いた。2027年にアルテミスIIIで再着陸の予定。","約384,400km");if(T1())t1Moon(m);
      if(ok(2026)){const pts=[V(6.8,0,0),V(120,30,-18),V(300,30,-30),V(390,8,-10),V(392,-4,6),V(380,-12,10),V(300,-30,30),V(120,-30,18),V(6.8,0,0)];
      const cu=new THREE.CatmullRomCurve3(pts);const tl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(cu.getPoints(300)),new THREE.LineBasicMaterial({color:"#f4b942",transparent:true,opacity:.85}));scene.add(tl);
      const ori=sphere(1.2,new THREE.MeshBasicMaterial({color:"#ffd27a"}),12);scene.add(ori);anims.push(t=>ori.position.copy(cu.getPoint((t*.02)%1)));}
      const a11=new THREE.Object3D();const la=.67*Math.PI/180,lo=23.47*Math.PI/180;a11.position.set(Math.cos(la)*Math.cos(lo)*1.75,Math.sin(la)*1.75,-Math.cos(la)*Math.sin(lo)*1.75);m.add(a11);
      obj("apollo11","アポロ11号の着陸地点（静かの海）",a11,4,"1969年7月20日、アームストロングとオルドリンが人類で初めて月面に降り立った。","月面");
      const jw=new THREE.Object3D();jw.position.set(-1500,0,0);scene.add(jw);const jm=jwstSat();jm.scale.setScalar(4);jw.add(jm);jw.add(sprite("#ffd27a",14,.4));
      obj("jwst","ジェイムズ・ウェッブ宇宙望遠鏡（L2）",jw,30,"地球から約150万km、太陽と反対側のラグランジュ点L2を回る。赤外線で宇宙の最初の銀河を観測している（模型の大きさは誇張）。","約150万km");
      const far=new THREE.Object3D();far.position.copy(V(392,-4,6));scene.add(far);obj("artemis","アルテミスII（人類の最遠到達）",far,30,"2026年4月、月の裏側を回って地球から40万6771kmに達した。","40万6771km");
    }},
   {id:"inner",name:"内太陽系と黄道十二星座",unit:"1目盛＝1億5000万km（1天文単位）",desc:"太陽と、水星・金星・地球・火星。その外側に小惑星帯。遠くには、太陽が1年かけて通る道（黄道）に沿って十二星座が並ぶ（星座の距離は模式的）。惑星の大きさは誇張しています。",dist:900,min:12,max:3600,
    build(){scene.add(new THREE.PointLight("#fff3dc",2.2,0,0));scene.add(new THREE.AmbientLight("#334466",.25));
      const s=starMesh(14,"#fff0d0",48,.6,96);scene.add(s);s.add(glowBB("#ffb347",120,1));anims.push(t=>s.rotation.y=t*.03);
      for(let i=0;i<6;i++){const pr=new THREE.Mesh(new THREE.TorusGeometry(3+R()*3,.35,6,24,Math.PI),new THREE.MeshBasicMaterial({color:"#ff7a2a",transparent:true,opacity:.8}));const a=R()*6.28,b=(R()-.5)*2;pr.position.set(Math.cos(a)*Math.cos(b)*13.5,Math.sin(b)*13.5,Math.sin(a)*Math.cos(b)*13.5);pr.lookAt(0,0,0);pr.rotateY(Math.PI/2);s.add(pr);}
      obj("sun","太陽",s,90,"直径139万km、地球の109倍。表面は約6000℃、中心は約1600万℃。核融合で輝き、太陽系の質量の99.8%を占める。プロミネンス（赤い炎のアーチ）が噴き出している。","約1億5000万km（地球から）");if(T2(2500))t2Inner(s);
      const P=[["mercury","水星",39,2,null,T.moon(),"太陽に最も近い。昼は430℃、夜は−180℃。",.24],["venus","金星",72,3.6,null,T.bands("venus",["#e8c98a","#d9b46e","#f0dcae"]),"厚い二酸化炭素の大気で表面は460℃。",.62],["earth","地球",100,3.8,null,T.earth(),"生命が確認されている唯一の星。",1],["mars","火星",152,2.6,null,T.mars(),"探査車が走り回る赤い惑星。将来の有人探査の目標。",1.88]];
      const PL={};P.forEach(([id,nm,a,r,col,tex,d,per],i)=>{scene.add(orbit(a,"#4a5a80",.55));const p=id==="earth"?planet(r,tex):planetGPU(r,id,V(0,0,0),64);const g=new THREE.Group();g.add(p);const ph=i*1.7;anims.push(t=>{const q=ph+t*.25/per;g.position.set(Math.cos(q)*a,0,Math.sin(q)*a);p.rotation.y=t*.3;});scene.add(g);PL[id]=g;obj(id,nm,g,r*9,d,(a/100).toFixed(2)+"天文単位");});
      const moon=planetGPU(.9,"moon",V(0,0,0),32);PL.earth.add(moon);anims.push(t=>moon.position.set(Math.cos(t*.8)*7,0,Math.sin(t*.8)*7));
      [[.35,4.5,1.6],[.25,6.5,.9]].forEach(([r,d,sp],i)=>{const m=sphere(r,smat({color:"#8a7a6a"}),8);PL.mars.add(m);anims.push(t=>m.position.set(Math.cos(t*sp+i)*d,0,Math.sin(t*sp+i)*d));});
      const om=new THREE.Object3D();om.position.set(0,1.2,2.3);PL.mars.add(om);obj("olympus","オリンポス山（火星）",om,10,"太陽系最大の火山。高さ約2万1900m、エベレストの約2.5倍。","火星");
      const ce=sphere(1.2,smat({color:"#8f8a84"}),12);ce.position.set(277,3,-40);scene.add(ce);obj("ceres","ケレス（準惑星）",ce,14,"小惑星帯で最大の天体。ドーンが探査した。","2.8天文単位");
      const ZR=window.__SPZ_ZR||1500, Z=[
       ["aries","おひつじ座",40,[[0,0],[3,1],[5,1.6],[6.5,1.2]],[[0,1],[1,2],[2,3]],"金の毛の羊。春分点は昔ここにあった。占いの期間は3/21〜4/19ごろ。"],
       ["taurus","おうし座",68,[[0,0],[-2,1.5],[-4,3],[2,1.5],[4,3],[-7,6],[6,6.5]],[[0,1],[1,2],[0,3],[3,4],[2,5],[4,6]],"赤い1等星アルデバランとすばる（プレアデス星団）。4/20〜5/20ごろ。"],
       ["gemini","ふたご座",102,[[0,0],[2,0],[0,-3],[2,-3],[-.5,-6],[2.5,-6]],[[0,2],[2,4],[1,3],[3,5],[0,1]],"兄弟星カストルとポルックス。5/21〜6/21ごろ。"],
       ["cancer","かに座",128,[[0,0],[-2,2],[2,2],[0,-3]],[[0,1],[0,2],[0,3]],"中心にプレセペ星団。6/22〜7/22ごろ。"],
       ["leo","しし座",150,[[0,0],[-1,2],[0,4],[2,4.5],[0,-1.5],[5,1],[6,-1.5]],[[0,1],[1,2],[2,3],[0,4],[4,6],[6,5],[5,1]],"1等星レグルス。頭部は「?」を裏返した形。7/23〜8/22ごろ。"],
       ["virgo","おとめ座",190,[[0,0],[-3,2],[-6,3],[2,3],[4,5],[1,-3]],[[0,1],[1,2],[0,3],[3,4],[0,5]],"1等星スピカ。全天で2番目に大きい星座。8/23〜9/22ごろ。"],
       ["libra","てんびん座",225,[[0,0],[3,1],[2,-3],[-1,-2.5]],[[0,1],[1,2],[2,3],[3,0]],"黄道で唯一の道具の星座。9/23〜10/23ごろ。"],
       ["scorpius","さそり座",245,[[0,0],[-1,2],[-2,4],[1,-2],[2,-4],[3,-6],[5,-7],[6,-5.5]],[[1,0],[2,1],[0,3],[3,4],[4,5],[5,6],[6,7]],"赤い1等星アンタレス（さそりの心臓）。10/24〜11/22ごろ。"],
       ["sagittarius","いて座",275,[[0,0],[2,0],[2,2.5],[0,2.5],[-1.5,1.2],[1,4],[3.5,1.2]],[[0,1],[1,2],[2,3],[3,0],[0,4],[3,5],[2,5],[1,6],[2,6]],"「南斗六星」とティーポットの形。この方向に銀河の中心がある。11/23〜12/21ごろ。"],
       ["capricornus","やぎ座",305,[[0,0],[4,1],[6,-1],[3,-3]],[[0,1],[1,2],[2,3],[3,0]],"上半身がヤギ、下半身が魚の怪物。12/22〜1/19ごろ。"],
       ["aquarius","みずがめ座",335,[[0,0],[2,1],[4,0],[5,-2],[3,-4],[6,-5]],[[0,1],[1,2],[2,3],[3,4],[3,5]],"水がめから水を注ぐ姿。1/20〜2/18ごろ。"],
       ["pisces","うお座",8,[[0,0],[-3,2],[-6,3],[-7,5],[3,3],[4,6],[3.5,7.5]],[[0,1],[1,2],[2,3],[0,4],[4,5],[5,6]],"リボンで結ばれた2匹の魚。現在の春分点はここにある。2/19〜3/20ごろ。"]];
      const ec=orbit(ZR,"#f4b942",.18);scene.add(ec);Z.forEach(([id,nm,lon,st,ln,info])=>constellation(id,nm,lon,st,ln,ZR,info+"（星の並びは簡略化した模式図。占いの期間と、実際に太陽がその星座の方向にある期間は約1か月ずれている）"));
      const ophn=new THREE.Object3D();ophn.position.set(Math.cos(262*Math.PI/180)*ZR,ZR*.14,Math.sin(262*Math.PI/180)*ZR);scene.add(ophn);obj("ophiuchus","へびつかい座（13番目）",ophn,ZR*.35,"実際には太陽はへびつかい座も通る（11月末〜12月中旬）。占いの十二星座には含まれない。","黄経 約262°");
      const ab=[];for(let i=0;i<5000;i++){const a=R()*6.283,r=220+R()*100;ab.push(Math.cos(a)*r,(R()-.5)*8,Math.sin(a)*r);}const belt=points(ab,"#c9b28f",1.6,.7);scene.add(belt);anims.push(t=>belt.rotation.y=t*.02);
      const bn=new THREE.Object3D();bn.position.set(0,0,270);scene.add(bn);obj("belt","小惑星帯",bn,160,"火星と木星の間に数百万個の小天体。","2.2〜3.2天文単位");
    }},
   {id:"outer",name:"外太陽系",unit:"1目盛＝15億km（10天文単位）",desc:"木星・土星・天王星・海王星、冥王星とカイパーベルト。ボイジャー1号・2号は太陽系の外へ向かっている。",dist:1500,min:15,max:5000,
    build(){scene.add(new THREE.PointLight("#fff3dc",2.6,0,0));scene.add(new THREE.AmbientLight("#334466",.35));
      const s=starMesh(6,"#fff0d0",48,.5,64);scene.add(s);s.add(glowBB("#ffb347",70,1));obj("sun","太陽",s,60,"ここから見ると、明るい星の一つに見え始める。","—");
      const P=[["jupiter","木星",52,7,T.bands("jupiter",["#d8b48a","#c08a5a","#efe0c8","#a8724a","#e6caa2"]),"太陽系最大の惑星。地球の11倍の直径。大赤斑は地球より大きな嵐。",11.9],
        ["saturn","土星",95,6,T.bands("saturn",["#e8d6a8","#d4bd8a","#f2e6c4"]),"美しい環を持つ。環の多くは氷のかけら。",29.5],
        ["uranus","天王星",192,4,T.bands("uranus",["#9fe0e6","#8cd2dc"]),"横倒しで自転する氷の惑星。",84],["neptune","海王星",301,4,T.bands("neptune",["#3f6fe0","#5a86ee"]),"太陽系で最も強い風が吹く。",165]];
      P.forEach(([id,nm,a,r,tex,d,per],i)=>{scene.add(orbit(a,"#4a5a80",.5));const p=planetGPU(r,id,V(0,0,0),72);const g=new THREE.Group();g.add(p);
        if(id==="saturn"||id==="uranus"){const tilt=new THREE.Group();g.add(tilt);g.remove(p);tilt.add(p);tilt.rotation.z=id==="saturn"?26.7*Math.PI/180:97.8*Math.PI/180;const rg=ringsFX(r,id==="uranus"?1:0,V(0,0,0));tilt.add(rg);anims.push(()=>g.getWorldPosition(rg.material.uniforms.uC.value));}
        if(id==="jupiter"){[["イオ",11,2.4],["エウロパ",14,1.9],["ガニメデ",18,1.3],["カリスト",23,.9]].forEach(([mn,d2,sp],k)=>{const m=planetGPU(.7,["io","europa","ganymede","callisto"][k],V(0,0,0),24);g.add(m);anims.push(t=>m.position.set(Math.cos(t*sp+k)*d2,0,Math.sin(t*sp+k)*d2));});
          const rs=new THREE.Object3D();rs.position.set(4,-2.6,5.2);p.add(rs);obj("grs","大赤斑（木星）",rs,22,"地球がすっぽり入る大きさの巨大な嵐。300年以上前から観測されている。","木星");
          const gm=new THREE.Object3D();g.add(gm);anims.push(t=>gm.position.set(Math.cos(t*1.3+2)*18,0,Math.sin(t*1.3+2)*18));obj("europa","木星の衛星（イオ・エウロパなど）",gm,30,"ガリレオが1610年に発見した4つの大きな衛星。エウロパの氷の下には海があり、生命の可能性が探られている。","木星");}
        if(id==="saturn"){const ti=planetGPU(.9,"titan",V(0,0,0),24);g.add(ti);anims.push(t=>ti.position.set(Math.cos(t*.6)*20,0,Math.sin(t*.6)*20));obj("titan","タイタン（土星の衛星）",ti,12,"厚い大気とメタンの湖を持つ。2028年にドローン探査機ドラゴンフライが打ち上げ予定。","土星");}
        const ph=i*1.3;anims.push(t=>{const q=ph+t*.6/per;g.position.set(Math.cos(q)*a,0,Math.sin(q)*a);p.rotation.y=t*.4;});scene.add(g);obj(id,nm,g,r*8,d,(a/10).toFixed(1)+"天文単位");});
      // ハレー彗星（早回し）
      const ha=(350+5.9)/2,he=(350-5.9)/(350+5.9);const hor=orbit(ha,"#9fe0ff",.5,.3,512,he,Math.PI);hor.rotation.y=1.0;scene.add(hor);
      const hc=new THREE.Group();hor.add(hc);const nuc=sphere(1.2,smat({color:"#bfc8d6"}),10);hc.add(nuc);hc.add(sprite("#cfe9ff",8,.9));
      const tail=new THREE.Group();for(let k=0;k<14;k++){const s=sprite(k%2?"#9fd8ff":"#e8f6ff",10+k*3,.25);s.position.x=k*5;tail.add(s);}hc.add(tail);
      anims.push(t=>{let M=(t*.05)%6.283;let E=M;for(let k=0;k<6;k++)E=M+he*Math.sin(E);const nu=2*Math.atan2(Math.sqrt(1+he)*Math.sin(E/2),Math.sqrt(1-he)*Math.cos(E/2));
        const r=ha*(1-he*he)/(1+he*Math.cos(nu));hc.position.set(Math.cos(nu+Math.PI)*r,0,Math.sin(nu+Math.PI)*r);const w=new THREE.Vector3();hc.getWorldPosition(w);
        const k2=Math.max(0,1-r/120);tail.visible=k2>.05;tail.scale.setScalar(.3+k2*1.6);const dir=w.clone().normalize();const q=new THREE.Quaternion().setFromUnitVectors(V(1,0,0),dir);const pq=new THREE.Quaternion();hor.getWorldQuaternion(pq);tail.quaternion.copy(pq.invert().multiply(q));});
      obj("halley","ハレー彗星",hc,40,"約76年周期で太陽に近づく彗星。前回は1986年、次は2061年。太陽に近づくと、太陽と反対側に尾が伸びる（ここでは動きを早回し）。","0.6〜35天文単位");
      const pl=orbit(395,"#6a6a8a",.5,.3,256,.25);scene.add(pl);const pp=planetGPU(1.6,"pluto",V(0,0,0),32,Math.PI);pl.add(pp);pp.position.set(296,0,0);obj("pluto","冥王星",pp,25,"2006年に準惑星に分類された。2015年にニューホライズンズが接近観測。","約39天文単位");
      const kb=[];for(let i=0;i<6000;i++){const a=R()*6.283,r=300+R()*200;kb.push(Math.cos(a)*r,(R()-.5)*40,Math.sin(a)*r);}scene.add(points(kb,"#8fa0c8",2.2,.5));
      const kbn=new THREE.Object3D();kbn.position.set(-420,0,0);scene.add(kbn);obj("kuiper","カイパーベルト",kbn,250,"海王星の外側に広がる氷の小天体の帯。","30〜50天文単位");
      const vo=(id,nm,dir,dist,d)=>{const end=dir.clone().normalize().multiplyScalar(dist);const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(52,0,0),end]),new THREE.LineBasicMaterial({color:"#7fb2ff",transparent:true,opacity:.7}));scene.add(l);
        const m=sphere(4,new THREE.MeshBasicMaterial({color:"#7fb2ff"}),10);m.position.copy(end);scene.add(m);m.add(sprite("#7fb2ff",30,.6));obj(id,nm,m,120,d,(dist/10).toFixed(0)+"天文単位");};
      vo("voyager1","ボイジャー1号",V(.4,.6,.7),1690,"1977年打ち上げ。人工物で最も遠くにある。2026年11月18日に地球から1光日に達する予定。");
      vo("voyager2","ボイジャー2号",V(.5,-.55,-.65),1420,"天王星と海王星を訪れた唯一の探査機。");
    }},
   {id:"helio",name:"太陽圏とオールトの雲",unit:"1目盛＝1万5000億km（100天文単位）",desc:"太陽風が届く範囲（太陽圏）の外は恒星間空間。その外側を、彗星のふるさとオールトの雲が数万天文単位にわたって包む（存在は推定）。",dist:2400,min:3,max:5000,
    build(){scene.add(new THREE.AmbientLight("#ffffff",.6));const s=sprite("#ffd27a",6,1);scene.add(s);obj("sun","太陽",s,8,"","—");if(T2(2800))t2Helio();
      const hm=new THREE.MeshBasicMaterial({color:"#5aa0ff",transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false});const h=sphere(1.2,hm,48);h.scale.set(1,1,2.6);h.position.z=1.6;scene.add(h);
      const ts=sphere(.9,new THREE.MeshBasicMaterial({color:"#7fd3ff",transparent:true,opacity:.1,wireframe:true}),24);ts.scale.set(1,1,1.8);ts.position.z=.7;scene.add(ts);
      const hp=new THREE.Object3D();hp.position.set(0,0,-1.2);scene.add(hp);obj("heliopause","太陽圏の境界（ヘリオポーズ）",hp,5,"太陽風と恒星間の物質がぶつかる境界。ボイジャー1号は2012年、2号は2018年に越えた。","約120天文単位");
      [["voyager1","ボイジャー1号",V(.35,.55,-.76),1.69],["voyager2","ボイジャー2号",V(.45,-.55,-.7),1.42]].forEach(([id,nm,d,r])=>{const m=sprite("#9fc8ff",.35,1);m.position.copy(d.normalize().multiplyScalar(r));scene.add(m);
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),m.position]),new THREE.LineBasicMaterial({color:"#7fb2ff",transparent:true,opacity:.6})));obj(id,nm,m,3,"恒星間空間を飛び続けている。","");});
      const oc=[];for(let i=0;i<16000;i++){const u=R()*2-1,a=R()*6.283,r=20+Math.pow(R(),.6)*980;const q=Math.sqrt(1-u*u);oc.push(Math.cos(a)*q*r,u*r*(r<200?.35:1),Math.sin(a)*q*r);}
      const occ=points(oc,"#9fb4e8",6,.55);scene.add(occ);anims.push(t=>occ.rotation.y=t*.005);
      const on=new THREE.Object3D();on.position.set(600,0,0);scene.add(on);obj("oort","オールトの雲",on,1500,"太陽から2000〜10万天文単位に広がる、氷の天体の巨大な殻と考えられている。長周期彗星のふるさと。","約2000〜10万天文単位");
      const ly=orbit(632,"#f4b942",.4,0,256);scene.add(ly);const lyn=new THREE.Object3D();lyn.position.set(0,0,632);scene.add(lyn);obj("lightyear","1光年（約6.3万天文単位）",lyn,400,"光が1年かけて進む距離。約9.5兆km。","約9.5兆km");
    }},
   {id:"stars",name:"太陽の近くの恒星",unit:"1目盛＝1光年",desc:"太陽から約40光年以内の恒星。最も近いのはプロキシマ・ケンタウリ（4.24光年）。光の速さでも4年以上かかる。",dist:320,min:2,max:1200,
    build(){scene.add(new THREE.AmbientLight("#fff",1));
      const S=[["sun","太陽",0,0,0,"#ffe08a",1.2,"ここが私たちの恒星。"],["alphacen","ケンタウルス座α星A・B",14.66,-60.8,4.37,"#ffe9a8",1.2,"太陽に似た2つの恒星の連星。"],["proxima","プロキシマ・ケンタウリ",14.5,-62.7,4.24,"#ff7a5a",.6,"最も近い恒星。地球に似た大きさの惑星が見つかっている。"],
        ["barnard","バーナード星",17.96,4.7,5.96,"#ff7a5a",.6,"空を最も速く動いて見える恒星。"],["wolf359","ウルフ359",10.94,7.0,7.9,"#ff6a4a",.5,"小さく暗い赤色矮星。"],["lalande","ラランド21185",11.05,35.9,8.3,"#ff8a5a",.6,"北の空の赤色矮星。"],
        ["sirius","シリウス",6.75,-16.7,8.6,"#bfe0ff",1.6,"夜空で最も明るい恒星。白色矮星の伴星を持つ。"],["luyten","くじら座UV星",1.65,-17.9,8.7,"#ff6a4a",.5,"突然明るくなる閃光星の代表。"],["ross154","ロス154",18.83,-23.8,9.7,"#ff7a5a",.5,""],
        ["epseri","エリダヌス座ε星",3.55,-9.5,10.5,"#ffcf8a",1,"若い恒星で、ちりの円盤を持つ。"],["procyon","プロキオン",7.65,5.2,11.5,"#fff4d8",1.3,"冬の大三角の一つ。"],["tauceti","くじら座τ星",1.73,-15.9,11.9,"#ffe7a0",1,"太陽に似た恒星。SFの舞台にもよく登場する。"],
        ["altair","アルタイル（彦星）",19.85,8.9,16.7,"#f2f6ff",1.3,"夏の大三角の一つ。七夕の彦星。"],["vega","ベガ（織姫星）",18.62,38.8,25,"#cfe0ff",1.5,"夏の大三角の一つ。七夕の織姫星。約1万2000年後には北極星になる。"],
        ["trappist","TRAPPIST-1",23.1,-5.0,40.7,"#ff6a4a",.6,"地球サイズの惑星が7つ見つかった赤色矮星。そのうち3つは液体の水が存在しうる位置にある。"]];
      if(T2(5000))t2Stars();
      S.forEach(([id,nm,ra,dec,d,col,sz,ds])=>{const a=ra/24*6.283,b=dec*Math.PI/180;const p=V(Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)).multiplyScalar(d*10);
        const c=star(sz*.5,col,9);c.position.copy(p);scene.add(c);
        if(d>0){scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(p.x,0,p.z),p]),new THREE.LineBasicMaterial({color:"#4a5a80",transparent:true,opacity:.6})));}
        obj(id,nm,c,14,ds,d?d+"光年":"—");});
      [50,100,200,400].forEach(r=>scene.add(orbit(r,"#3a4a70",.6)));const g=new THREE.GridHelper(820,41,"#2a3558","#1a2240");g.material.transparent=true;g.material.opacity=.4;scene.add(g);
    }},
   {id:"nebula",iso:1,name:"星雲と近くの天体（〜1万光年）",unit:"1目盛＝100光年",desc:"太陽の周り数千光年。星が生まれる星雲、星が死んだあとの星雲、星団、恒星質量ブラックホールがある。方向はおおよそ（銀河座標）、大きさは誇張しています。",dist:180,min:2,max:420,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const bg=[];for(let i=0;i<9000;i++){const r=Math.sqrt(R())*110,a=R()*6.283;bg.push(Math.cos(a)*r,(R()-.5)*6*(1-r/130),Math.sin(a)*r);}scene.add(points(bg,"#cfd8ff",.35,.55));
      const sun=sprite("#ffe08a",3,1);scene.add(sun);obj("sun","太陽",sun,10,"ここが私たち。","—");
      const N=[
       ["orion","オリオン大星雲（M42）",209,-19,13.44,"cloud",["#ff6fa8","#7fd0ff","#ffd27a"],5,"肉眼でも見える星の誕生の現場。オリオン座の三つ星の下。"],
       ["horsehead","馬頭星雲",207,-17,13.75,"cloud",["#ff4a6a","#3a1a20"],4,"赤く光るガスの前に、馬の頭の形をした暗い雲が浮かぶ。"],
       ["pleiades","プレアデス星団（すばる）",167,-23,4.44,"cloud",["#9fc8ff","#cfe6ff"],3,"肉眼で6〜7個見える若い星の集まり。青い光は周りのちりの反射。"],
       ["betelgeuse","ベテルギウス",200,-9,5.48,"star",["#ff7a4a"],3,"オリオン座の赤い超巨星。いつ超新星爆発してもおかしくない（天文学的な時間で）。"],
       ["polaris","北極星（ポラリス）",123,27,4.33,"star",["#fff2c8"],2.5,"地球の自転軸の延長上にあり、ほとんど動かない。"],
       ["helix","らせん星雲",36,-57,6.5,"ring",["#7fd0ff","#ff7a5a","#ffd27a"],4,"太陽のような星が死ぬときに放ったガス。「神の目」とも呼ばれる。"],
       ["ring","環状星雲（M57）",63,14,25.7,"ring",["#9fe0a0","#ff8a5a","#7fb2ff"],3,"こと座のドーナツ形の惑星状星雲。"],
       ["catseye","キャッツアイ星雲",96,30,33,"ring",["#7fe0d0","#ff6fa8"],3,"複雑な殻が重なる惑星状星雲。"],
       ["crab","かに星雲（M1）",185,-6,65,"burst",["#ff8a5a","#7fb2ff","#ffd27a"],6,"1054年に日本や中国で記録された超新星の残骸。中心に高速で回る中性子星（パルサー）がある。"],
       ["eagle","わし星雲・創造の柱",17,1,57,"pillars",["#ffd27a","#7fd0a0","#ff8a5a"],8,"ハッブルが撮った「創造の柱」。ガスの柱の中で星が生まれている。"],
       ["carina","カリーナ星雲",287,-1,85,"cloud",["#ff7a8a","#ffd27a","#7fb2ff"],9,"巨大な星形成領域。超巨星エータ・カリーナがある。"]];
      const NEBC={orion:[2.2,"#ff4f7a","#7fe8d8","#ffffff"],horsehead:[2.4,"#ff3a4a","#8fb8ff"],pleiades:[2.2,"#5f8fff","#cfe0ff"],helix:[2,"#ff4a3a","#6fd8ff","#ffc070"],ring:[2,"#ff5a4a","#6fc8ff"],catseye:[2,"#ff5a6a","#7fffd0","#ff6a5a"],crab:[2,"#ff6a3a","#8fb0ff","#ffd27a"],eagle:[2.2,"#ffb070","#2f8f9a","#d8c070"],carina:[2.2,"#ff5a4a","#ffb070","#7fd0ff"]};
      N.forEach(([id,nm,l,b,d,kind,cols,sz,info])=>{sz*=window.__SPZ_NEBK||1;const p=gal(l,b).multiplyScalar(d);let o;
        if(kind==="star"){o=star(sz*(id==="betelgeuse"?.12:.06),id==="betelgeuse"?"M":"F",id==="betelgeuse"?7:10,id==="betelgeuse"?.6:0);}else{const F=NEBC[id];o=new THREE.Group();const VS2=sz*F[0]*1.15;const vol=nebVol(id,VS2,F[1],F[2],F[3]);const bb=nebFX(id,sz*F[0],F[1],F[2],F[3]);o.add(vol,bb);{const wp=new THREE.Vector3();anims.push(()=>{o.getWorldPosition(wp);const sc=o.getWorldScale(new THREE.Vector3()).x;const near=camera.position.distanceTo(wp)<VS2*sc*2.2;vol.visible=near;bb.visible=!near;});}
          if(id==="pleiades")[[.05,.02,0],[-.42,-.05,.1],[.38,.18,-.1],[.24,.34,.05],[.12,-.26,-.08],[.42,-.06,.12],[-.5,.02,-.05]].forEach(([x,y,z],k)=>{const st=star(VS2*(k?.012:.016),"B",9);st.position.set(x*VS2/2,y*VS2/2,z*VS2/2);o.add(st);});
          if(id==="orion")for(let k=0;k<4;k++){const st=star(VS2*.006,"O",10);st.position.set((-.05+(k%2)*.03)*VS2/2,(.02+(k>>1)*.03)*VS2/2,-.15*VS2/2);o.add(st);}
          if(id==="helix"||id==="ring"||id==="catseye"){const st=star(VS2*.006,"#cfe0ff",10);o.add(st);}if(id==="crab"){const st=star(VS2*.006,"#cfe0ff",14);o.add(st);}const pts=[];for(let k=0;k<160;k++){const a=R()*6.283,u=R()*2-1,rr=sz*.7*Math.cbrt(R());pts.push(Math.cos(a)*Math.sqrt(1-u*u)*rr,u*rr,Math.sin(a)*Math.sqrt(1-u*u)*rr);}o.add(points(pts.slice(0,240),"#e8f0ff",.035*sz,.85));}
        o.position.copy(p);scene.add(o);obj(id,nm,o,sz*3,info,(d*100).toLocaleString()+"光年");});
      [["gaiabh1","ブラックホール Gaia BH1",22,19,15.6,"知られている中で地球に最も近いブラックホール。太陽の約10倍の質量。"],["cygx1","はくちょう座X-1（ブラックホール）",71,3,72,"1971年に確認された、最初のブラックホール候補。青い超巨星からガスを吸い込んでいる。"]].forEach(([id,nm,l,b,d,info])=>{
        const bh=blackHole(.4);bh.position.copy(gal(l,b).multiplyScalar(d));scene.add(bh);obj(id,nm,bh,4,info+"（模型は誇張）",(d*100).toLocaleString()+"光年");});
      [10,30,60,100].forEach(r=>scene.add(orbit(r,"#2a3558",.6)));
    }},
   {id:"galaxy",name:"天の川銀河",unit:"1目盛＝1000光年",desc:"約1000億〜4000億個の恒星が直径約10万光年の円盤に集まる。太陽は中心から約2万6000光年、オリオン腕にある。",dist:150,min:4,max:500,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const MW={type:"barred",size:110,arms:4,minor:1,pitch:.24,bulge:.11,dust:.9,c1:"#ffe0b0",c2:"#c8d6ff",c3:"#ff6a9a",seed:4};
      const g=new THREE.Group();scene.add(g);g.add(galFX(MW));g.add(galStars({...MW,n:70000,ps:.32}));anims.push(t=>{g.rotation.y=t*.01;});
      const core=glowBB("#ffd9a0",22,0);scene.add(core);
      const armAt=(k,rn)=>{const th=k*Math.PI/2+Math.log(rn/.1)/MW.pitch;return V(Math.cos(th)*rn*55,0,-Math.sin(th)*rn*55);};
      [["perseus","ペルセウス腕",0,.62,"太陽系の外側を通る大きな腕。"],["scutum","たて・ケンタウルス腕",2,.55,"銀河の中心をはさんで反対側を回る、もう1本の大きな腕。"],["sagitt","いて腕",1,.5,"太陽系の内側にある細い腕。"],["norma","じょうぎ腕",3,.4,"中心の棒の先から伸びる腕。"]].forEach(([id,nm,k,rn,d])=>{const n=new THREE.Object3D();n.position.copy(armAt(k,rn));g.add(n);obj(id,nm,n,40,d,"渦巻きの腕");});
      const bh=blackHole(.35);scene.add(bh);obj("sgra","ブラックホール いて座A*（銀河の中心）",bh,5,"太陽の約400万倍の質量の超大質量ブラックホール。2022年に撮影された。周りを回る星の動きから存在が確かめられ、2020年ノーベル物理学賞（模型は誇張）。","約2万6000光年");
      const oc=[];const oc0=gal(309,15).multiplyScalar(17);for(let i=0;i<1500;i++){const r=Math.pow(R(),2)*.8,a=R()*6.28,u=R()*2-1;oc.push(oc0.x+Math.cos(a)*Math.sqrt(1-u*u)*r,oc0.y+u*r,oc0.z+Math.sin(a)*Math.sqrt(1-u*u)*r);}
      const sa=(Math.PI/2+.5*Math.PI/2)+Math.log((26/55)/.1)/MW.pitch;const sunP=V(Math.cos(sa)*26,0,-Math.sin(sa)*26);const ocg=points(oc,"#ffe9c4",.25,.9);ocg.position.copy(sunP);g.add(ocg);const ocn=new THREE.Object3D();ocn.position.copy(oc0).add(sunP);g.add(ocn);
      obj("omegacen","オメガ星団（球状星団）",ocn,6,"約1000万個の星が集まる、天の川銀河で最大の球状星団。","約1万7000光年");
      const sn=new THREE.Object3D();g.add(sn);sn.position.copy(sunP);const sm=sprite("#f4b942",3,1);sn.add(sm);obj("sunpos","太陽系の位置",sn,12,"オリオン腕の中。銀河を約2億3000万年かけて1周する。","中心から約2万6000光年");if(typeof window.KYEAR==="number"&&window.KYEAR>=6000)t3Galaxy(g,sn);
      const mw=new THREE.Object3D();mw.position.set(0,30,0);scene.add(mw);obj("mw","天の川銀河",mw,150,"夜空の天の川は、この円盤を内側から見た姿。","直径約10万光年");
      [["lmc","大マゼラン雲",V(-30,-60,140),6],["smc","小マゼラン雲",V(-50,-80,175),4]].forEach(([id,nm,p,s])=>{const pts=[];for(let i=0;i<2500;i++)pts.push(p.x+(R()-.5)*s*2,p.y+(R()-.5)*s,p.z+(R()-.5)*s*2);scene.add(points(pts,"#cfe0ff",.6,.8));const n=new THREE.Object3D();n.position.copy(p);scene.add(n);obj(id,nm,n,40,"天の川銀河を回る小さな伴銀河。南半球で肉眼で見える。",id==="lmc"?"約16万光年":"約20万光年");});
    }},
   {id:"local",name:"局部銀河群",unit:"1目盛＝1万光年",desc:"天の川銀河とアンドロメダ銀河を中心とする、80以上の銀河の集まり。約45億年後、二つの銀河は衝突・合体すると予測されている。",dist:520,min:6,max:1200,
    build(){scene.add(new THREE.AmbientLight("#fff",1));const SPEC2={mw:{type:"barred",arms:4,minor:1,pitch:.24,bulge:.11,c1:"#ffe0b0",c2:"#c8d6ff",seed:4},an:{type:"spiral",arms:2,pitch:.22,bulge:.13,ring:.62,c1:"#ffe2b8",c2:"#c8d4ff",c3:"#ff7aa0"},tr:{type:"flocculent",arms:2,pitch:.35,bulge:.06,c1:"#ffe8d0",c2:"#bcd0ff"}};
      const gal=(cx,tilt,r,n,col,rot)=>{const sp=r===5?SPEC2.mw:r===11?SPEC2.an:SPEC2.tr;const g=new THREE.Group();g.add(galFX({...sp,size:r*2,gain:1.7,ring:0}));g.add(galStars({...sp,size:r*2,n:Math.round(n*.5),ps:r*.012}));g.position.copy(cx);g.rotation.set(tilt,0,rot);scene.add(g);return g;};
      const mw=gal(V(0,0,0),.2,5,8000,"#dfe8ff",0);obj("mw","天の川銀河",mw,30,"私たちの銀河。","—");
      const an=gal(V(230,40,-90),1.1,11,16000,"#ffe7cf",.5);obj("andromeda","アンドロメダ銀河",an,60,"約1兆個の恒星。肉眼で見える最も遠い天体の一つ。秒速約110kmで近づいている。","約250万光年");if(typeof window.KYEAR==="number"&&window.KYEAR>=1000000){const pr=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0,0,0),V(230,40,-90)]),new THREE.LineDashedMaterial({color:"#7ee0ff",dashSize:6,gapSize:4}));pr.computeLineDistances();scene.add(pr);const pd=sprite("#7ee0ff",6,1);scene.add(pd);anims.push(t=>pd.position.copy(V(230,40,-90).multiplyScalar((t*.01)%1)));const pm=new THREE.Object3D();pm.position.set(115,20,-45);scene.add(pm);obj("t3andro","アンドロメダへの探査（もしも）",pm,120,"Type III文明が隣の銀河へ送る探査機。約250万光年の旅で、光速に近くても数百万年かかる。","約250万光年");}
      const tr=gal(V(250,-30,40),.6,3,4000,"#cfe2ff",1);obj("triangulum","さんかく座銀河",tr,24,"局部銀河群で3番目に大きい渦巻銀河。","約273万光年");
      const dw=[];for(let i=0;i<70;i++){const c=R()<.5?V(0,0,0):V(230,40,-90);const a=R()*6.28,u=R()*2-1,r=10+R()*60;dw.push(c.x+Math.cos(a)*r*Math.sqrt(1-u*u),c.y+u*r,c.z+Math.sin(a)*r*Math.sqrt(1-u*u));}scene.add(points(dw,"#c9d6ff",2.4,.8));
      const n=new THREE.Object3D();n.position.set(-80,60,80);scene.add(n);obj("dwarfs","矮小銀河たち",n,200,"数十個の小さな銀河が二大銀河の周りを回る。","");
    }},
   {id:"lania",name:"ラニアケア超銀河団",unit:"1目盛＝100万光年",desc:"約10万個の銀河が、重力に引かれて「グレート・アトラクター」の方向へ流れていく、直径約5億光年の構造。2014年に名付けられた（ハワイ語で「広大な天」）。",dist:780,min:10,max:1800,
    build(){const ga=V(0,0,0);const pos=[],col=[];const cA=C("#ffd9a8"),cB=C("#a8c8ff");
      const fil=[];for(let i=0;i<28;i++){const a=R()*6.283,u=R()*2-1,r=180+R()*90;fil.push(V(Math.cos(a)*r*Math.sqrt(1-u*u),u*r*.6,Math.sin(a)*r*Math.sqrt(1-u*u)));}
      fil.forEach(st=>{const mid=st.clone().multiplyScalar(.5).add(V((R()-.5)*80,(R()-.5)*50,(R()-.5)*80));const cu=new THREE.QuadraticBezierCurve3(st,mid,ga);for(let k=0;k<1400;k++){const p=cu.getPoint(R());const j=8+p.length()*.05;pos.push(p.x+(R()-.5)*j,p.y+(R()-.5)*j,p.z+(R()-.5)*j);const cc=R()<.5?cA:cB;col.push(cc.r,cc.g,cc.b);}
        const fl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(cu.getPoints(40)),new THREE.LineBasicMaterial({color:"#f4b942",transparent:true,opacity:.18}));scene.add(fl);});
      for(let i=0;i<5000;i++){const r=Math.pow(R(),2)*40;const a=R()*6.283,u=R()*2-1;pos.push(Math.cos(a)*r*Math.sqrt(1-u*u),u*r,Math.sin(a)*r*Math.sqrt(1-u*u));col.push(1,.85,.65);}
      const g=points(pos,null,2.6,.85,true,col);scene.add(g);anims.push(t=>g.rotation.y=t*.005);
      const gac=sprite("#ffd27a",60,.7);scene.add(gac);obj("ga","グレート・アトラクター",gac,120,"ラニアケアの重力の中心。天の川の向こう側に隠れて見えにくい。","約2億5000万光年");
      const mw=fil[3].clone().multiplyScalar(.85);const mws=sprite("#f4b942",12,1);mws.position.copy(mw);g.add(mws);obj("lg","局部銀河群（私たちはここ）",mws,60,"天の川銀河は超銀河団の端の方にある。","—");
      const vg=mw.clone().lerp(ga,.22);const vs=sprite("#ffffff",26,.9);vs.position.copy(vg);g.add(vs);obj("virgo","おとめ座銀河団",vs,70,"1000個以上の銀河が集まる、近くで最大の銀河団。","約5400万光年");
      const ext=(id,nm,off,kind,info,dist)=>{const p=mw.clone().add(off);let o;if(kind==="bh"){o=new THREE.Group();o.add(galFX({type:"elliptical",size:40,bb:1,c1:"#ffe2b8"}));const b=blackHole(.35);o.add(b);}else if(kind==="cluster"){const pts=[];for(let i=0;i<800;i++){const r=Math.pow(R(),1.5)*14;const a=R()*6.28,u=R()*2-1;pts.push(Math.cos(a)*Math.sqrt(1-u*u)*r,u*r,Math.sin(a)*Math.sqrt(1-u*u)*r);}o=points(pts,"#ffe0c0",2.4,.9);}else{o=new THREE.Group();const ty=id==="sombrero"?"sombrero":id==="cena"?"elliptical":"spiral";const gx=galFX({type:ty,size:22,arms:2,pitch:.28,bulge:ty==="sombrero"?.3:.1,c1:"#ffe2b8",c2:"#c0d0ff",bb:ty==="elliptical"});if(ty!=="elliptical")gx.rotation.x=id==="sombrero"?.08:-1.2;o.add(gx);if(ty==="sombrero")o.add(glowBB("#ffe0b0",12,0));}
        o.position.copy(p);g.add(o);obj(id,nm,o,kind==="bh"?14:kind==="cluster"?90:40,info,dist);};
      ext("m87","M87とブラックホールM87*",mw.clone().lerp(ga,.22).sub(mw).add(V(4,2,0)),"bh","おとめ座銀河団の中心の巨大楕円銀河。2019年に人類が初めて撮影したブラックホールM87*（太陽の約65億倍）がある。","約5500万光年");
      ext("m51","子持ち銀河（M51）",V(-14,18,6),"#cfe0ff","渦巻銀河が小さな銀河を連れている姿。","約2300万光年");
      ext("sombrero","ソンブレロ銀河（M104）",V(10,-8,-28),"#ffe8c8","つばの広い帽子のような形の銀河。","約3100万光年");
      ext("cena","ケンタウルス座A",V(-8,-6,-10),"#ffcf9a","強い電波を出す銀河。中心に巨大ブラックホール。","約1200万光年");
      ext("coma","かみのけ座銀河団",mw.clone().multiplyScalar(-1.1).add(V(0,120,0)).sub(mw),"cluster","1000個以上の銀河の集まり。ここでダークマターの存在が初めて指摘された（1933年）。","約3億2000万光年");
      const lb=sphere(270,new THREE.MeshBasicMaterial({color:"#f4b942",transparent:true,opacity:.04,side:THREE.BackSide,depthWrite:false}),32);scene.add(lb);const ln=new THREE.Object3D();ln.position.set(0,260,0);scene.add(ln);obj("laniakea","ラニアケア超銀河団",ln,780,"約10万個の銀河を含む。","直径約5億光年");
    }},
   {id:"web",name:"宇宙の大規模構造",unit:"1目盛＝1億光年",desc:"銀河は泡のような網目（宇宙の大規模構造）に沿って並び、その間には銀河のほとんどない空洞（ボイド）が広がる。観測できる宇宙の半径は約465億光年。",dist:1100,min:10,max:2400,
    build(){const nodes=[];while(nodes.length<420){const p=V((R()-.5)*900,(R()-.5)*900,(R()-.5)*900);if(p.length()<450&&nodes.every(q=>q.distanceTo(p)>40))nodes.push(p);}
      const pos=[],col=[];const c1=C("#ffcf9a"),c2=C("#9ac2ff"),c3=C("#e0d2ff");
      nodes.forEach((a,i)=>{const near=nodes.map((b,j)=>[b.distanceTo(a),j]).filter(x=>x[1]!==i).sort((x,y)=>x[0]-y[0]).slice(0,3);
        near.forEach(([d,j])=>{if(j<i)return;const b=nodes[j];const n=Math.round(d*2.2);for(let k=0;k<n;k++){const t=R();const p=a.clone().lerp(b,t);const w=3+Math.sin(t*Math.PI)*6;pos.push(p.x+(R()-.5)*w,p.y+(R()-.5)*w,p.z+(R()-.5)*w);const cc=[c1,c2,c3][k%3];col.push(cc.r,cc.g,cc.b);}});
        for(let k=0;k<70;k++){const r=Math.pow(R(),2)*14;pos.push(a.x+(R()-.5)*r,a.y+(R()-.5)*r,a.z+(R()-.5)*r);col.push(1,.9,.75);}});
      const g=points(pos,null,2.2,.75,true,col);scene.add(g);anims.push(t=>g.rotation.y=t*.004);
      const cmb=sphere(465,new THREE.MeshBasicMaterial({map:T.cmb(),side:THREE.BackSide,transparent:true,opacity:.22,depthWrite:false}),64);scene.add(cmb);
      const ed=new THREE.Object3D();ed.position.set(0,0,465);scene.add(ed);obj("edge","観測可能な宇宙の果て（宇宙背景放射）",ed,700,"138億年前、宇宙が透明になった瞬間の光。宇宙の膨張により、今その場所は約465億光年先にある。","約465億光年");
      const us=sprite("#f4b942",14,1);scene.add(us);obj("home","ラニアケア（私たちはここ）",us,90,"この網目の中の、ほんの一点。","—");
      const vd=new THREE.Object3D();vd.position.set(120,60,-80);scene.add(vd);obj("void","ボイド（空洞）",vd,200,"直径数億光年にわたって銀河がほとんどない領域。","");
      const fn=new THREE.Object3D();fn.position.copy(nodes[5]);scene.add(fn);obj("filament","フィラメントと銀河団",fn,160,"銀河が糸のように連なり、交点に巨大な銀河団ができる。","");
      const mk=(id,nm,pos,col,size,info,dist)=>{const s=sprite(col,size,.9);s.position.copy(pos);scene.add(s);obj(id,nm,s,size*6,info,dist);return s;};
      mk("shapley","シャプレー超銀河団",V(6.5,0,0),"#ffd27a",8,"近くの宇宙で最も重い銀河の集まり。","約6億5000万光年");
      const bv=sphere(1.4,new THREE.MeshBasicMaterial({color:"#000",transparent:true,opacity:.6}),16);bv.position.set(-5,4,3);scene.add(bv);obj("bootes","うしかい座ボイド",bv,14,"直径約3億光年、銀河がほとんどない巨大な空洞。","約7億光年");
      const sgw=[];for(let i=0;i<500;i++)sgw.push(-4+R()*14,-12+(R()-.5)*1.5,-6+(R()-.5)*1.5);scene.add(points(sgw,"#ffcfa0",1.2,.9));const sgn=new THREE.Object3D();sgn.position.set(3,-12,-6);scene.add(sgn);
      obj("sloan","スローン・グレートウォール",sgn,40,"長さ約14億光年の銀河の壁。","約10億光年");
      mk("herc","ヘルクレス座・かんむり座グレートウォール",V(70,60,-40),"#ffd8a8",30,"長さ約100億光年ともいわれる、知られている中で最大級の構造（存在をめぐって議論がある）。","約100億光年");
      const q=new THREE.Group();q.add(sprite("#cfe6ff",22,1));q.add(blackHole(1.2));q.position.set(-130,90,80);scene.add(q);obj("ton618","クエーサー TON 618",q,30,"太陽の約400億倍ともいわれる、知られている中で最大級のブラックホールが輝くクエーサー。","光が届くまで約108億年");
      mk("jades","最も遠い銀河（JADES-GS-z14-0）",V(250,-180,-160),"#ff8a8a",16,"ウェッブ望遠鏡が見つけた、ビッグバンから約3億年後の銀河。","光が届くまで約135億年");
    }},
   {id:"shape",name:"宇宙の形（説）",unit:"観測できる宇宙のさらに外側（想像図）",desc:"観測できる宇宙（直径約930億光年）の外側がどうなっているかは分からない。宇宙全体の形には複数の説がある。下のボタンで説を切り替えると、3Dの宇宙の形が変わります。",dist:1400,min:200,max:3000,
    build(){const sh=window.UNI_SHAPE||"flat";const gp=(n,f,col,size=2.4)=>{const p=[],c=[];const cc=C(col);for(let i=0;i<n;i++){p.push(...f(i));const k=.6+R()*.4;c.push(cc.r*k,cc.g*k,cc.b*k);}const o=points(p,null,size,.85,true,c);scene.add(o);return o;};
      const line=(pts,col,dash)=>{const g=new THREE.BufferGeometry().setFromPoints(pts);const l=new THREE.Line(g,dash?new THREE.LineDashedMaterial({color:col,dashSize:14,gapSize:8}):new THREE.LineBasicMaterial({color:col}));if(dash)l.computeLineDistances();scene.add(l);return l;};
      const here=new THREE.Object3D();scene.add(here);const obs=new THREE.Mesh(new THREE.SphereGeometry(90,32,16),new THREE.MeshBasicMaterial({color:"#f4b942",transparent:true,opacity:.12,depthWrite:false}));scene.add(obs);const me=sprite("#f4b942",40,.9);scene.add(me);
      let D="",onSurf=null;
      if(sh==="flat"){const gh=new THREE.GridHelper(2400,40,"#4a6aa8","#24365a");scene.add(gh);gp(5000,()=>[(R()-.5)*2400,(R()-.5)*160,(R()-.5)*2400],"#cfe0ff");
        const T=[V(-300,4,-200),V(320,4,-150),V(0,4,330)];line([...T,T[0]],"#f4d06a");D="平坦な宇宙：三角形の内角の和はちょうど180°。平行な光線はどこまでも平行のまま。無限に広がるか、とても大きい。今の観測（プランク衛星など）は、宇宙がほぼ完全に平坦（曲率は±0.2%程度以内）であることを示している。";}
      if(sh==="sphere"){const R0=520;const s=new THREE.Mesh(new THREE.SphereGeometry(R0,48,24),new THREE.MeshBasicMaterial({color:"#4a6aa8",wireframe:true,transparent:true,opacity:.25}));scene.add(s);
        gp(5000,()=>{const a=R()*6.283,u=R()*2-1;return [Math.cos(a)*Math.sqrt(1-u*u)*R0,u*R0,Math.sin(a)*Math.sqrt(1-u*u)*R0];},"#cfe0ff");
        const P=[V(0,1,0),V(1,0,0),V(0,0,1)].map(v=>v.multiplyScalar(R0));const arc=(a,b)=>[...Array(41)].map((_,i)=>a.clone().lerp(b,i/40).normalize().multiplyScalar(R0+2));line([...arc(P[0],P[1]),...arc(P[1],P[2]),...arc(P[2],P[0])],"#f4d06a");
        here.position.set(0,R0,0);obs.position.copy(here.position);me.position.copy(here.position);
        const ray=sph2(8,"#7ee0ff");anims.push(t=>{const a=t*.4;ray.position.set(Math.sin(a)*R0,Math.cos(a)*R0,0);});
        D="閉じた宇宙（3次元球面）：三角形の内角の和が180°より大きい（図は3つの直角を持つ270°の三角形）。有限だが果てがなく、まっすぐ進み続けると元の場所に戻ってくる（水色の点）。図は1次元低い「球の表面」で表している。";}
      if(sh==="saddle"){const g=new THREE.PlaneGeometry(1600,1600,40,40);const a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setZ(i,(x*x-y*y)/2200);}const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:"#4a6aa8",wireframe:true,transparent:true,opacity:.35}));m.rotation.x=-Math.PI/2;scene.add(m);
        const zf=(x,y)=>(x*x-y*y)/2200;gp(4500,()=>{const x=(R()-.5)*1600,y=(R()-.5)*1600;return [x,zf(x,y)+(R()-.5)*20,-y];},"#cfe0ff");
        const T=[[-260,-180],[300,-150],[20,300]];const seg=(p,q)=>[...Array(41)].map((_,i)=>{const t=i/40,x=p[0]+(q[0]-p[0])*t,y=p[1]+(q[1]-p[1])*t,bend=Math.sin(t*Math.PI)*60;const cx=x-bend*Math.sign(x||1)*.2,cy=y-bend*Math.sign(y||1)*.2;return V(cx,zf(cx,cy)+4,-cy);});
        line([...seg(T[0],T[1]),...seg(T[1],T[2]),...seg(T[2],T[0])],"#f4d06a");D="開いた宇宙（双曲空間）：三角形の内角の和が180°より小さい（辺が内側にへこむ）。無限に広がり、平行に出発した光線はだんだん離れていく。図は「鞍（くら）の形の面」で表している。";}
      if(sh==="torus"){const t=new THREE.Mesh(new THREE.TorusGeometry(480,200,32,96),new THREE.MeshBasicMaterial({color:"#4a6aa8",wireframe:true,transparent:true,opacity:.22}));t.rotation.x=Math.PI/2;scene.add(t);
        gp(5000,()=>{const u=R()*6.283,v=R()*6.283;return [(480+200*Math.cos(v))*Math.cos(u),200*Math.sin(v),(480+200*Math.cos(v))*Math.sin(u)];},"#cfe0ff");
        here.position.set(680,0,0);obs.position.copy(here.position);me.position.copy(here.position);const ray=sph2(8,"#7ee0ff");anims.push(t2=>{const u=t2*.3;ray.position.set(680*Math.cos(u),0,680*Math.sin(u));});
        for(let k=1;k<4;k++){const g2=sprite("#ff9ad0",30,.8);g2.position.set(680*Math.cos(k*2.09),0,680*Math.sin(k*2.09));scene.add(g2);}
        D="トーラス（ドーナツ型）の宇宙：平坦でも、端と端がつながっていれば有限になる。まっすぐ進むと一周して戻ってくるので、同じ銀河が空の別の方向に何度も見える（ピンクの点）。宇宙背景放射の模様から探されているが、そうした証拠は見つかっていない。";}
      if(sh==="multi"){for(let i=0;i<26;i++){const r=60+R()*240;const b=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),new THREE.MeshBasicMaterial({color:i===0?"#f4b942":["#7fb2ff","#c99cf2","#6fd2a0","#ff9ad0"][i%4],transparent:true,opacity:i===0?.25:.1,depthWrite:false}));b.position.set(i?(R()-.5)*2600:0,i?(R()-.5)*1400:0,i?(R()-.5)*2600:0);scene.add(b);
        const s0=1+R()*.1;anims.push(t=>b.scale.setScalar(s0+Math.sin(t*.3+i)*.05));}
        D="多元宇宙（永久インフレーション）：インフレーションが場所によっては終わらずに続き、私たちの宇宙（金色）のような「泡宇宙」を次々に生み出しているという仮説。泡ごとに物理定数が違うかもしれない。ほかの泡は原理的に観測できない。";}
      obj("uni_shape","宇宙の形",here,700,D,"説："+({flat:"平坦",sphere:"閉じた（球）",saddle:"開いた（双曲）",torus:"トーラス",multi:"多元宇宙"})[sh]);
      (LEVELS.find(l=>l.id==="shape")||{}).desc2=D;}},
  ];
  // ---- 画面遷移を減らすため、近いスケールをまとめた6段階（中身は元の各スケールを拡大縮小して1つの場面に重ねる） ----
  const SUBI=Object.fromEntries(SUB.map(L=>[L.id,L]));
  const MERGE=[
   {id:"em",name:"地球と月",short:"地球と月",parts:[["leo",1],["moon",1]],unit:"1目盛＝1000km",dist:150,min:7.5,max:4000,desc:"地球のまわりの人工衛星から、約38万km先の月まで。"+SUBI.leo.desc+" "+SUBI.moon.desc},
   {id:"solar",name:"太陽系",short:"太陽系",env:{__SPZ_ZR:40000},parts:[["inner",.1],["outer",1],["helio",1000]],unit:"1目盛＝1500万km（0.1天文単位）",dist:420,min:1.2,max:5e6,desc:"太陽と惑星、カイパーベルト、太陽圏、オールトの雲まで。"+SUBI.inner.desc+" "+SUBI.outer.desc+" ズームアウトを続けると太陽圏とオールトの雲（約1.6光年）まで広がる。惑星の大きさは誇張しています。"},
   {id:"near",name:"近くの恒星と星雲",short:"恒星と星雲",env:{__SPZ_NEBK:.3},parts:[["stars",1],["nebula",1000]],unit:"1目盛＝0.1光年",dist:320,min:2,max:4.2e5,iso:1,desc:SUBI.stars.desc+" ズームアウトすると数千光年先の星雲まで。"+SUBI.nebula.desc},
   {id:"galaxy",name:"天の川銀河と局部銀河群",short:"銀河",parts:[["galaxy",1],["local",10]],unit:"1目盛＝1000光年",dist:150,min:4,max:12000,desc:SUBI.galaxy.desc+" ズームアウトするとアンドロメダ銀河などの局部銀河群へ。"+SUBI.local.desc},
   {id:"lania",name:"超銀河団と大規模構造",short:"大規模構造",hide:["home"],parts:[["lania",1],["web",100]],unit:"1目盛＝100万光年",dist:780,min:10,max:240000,desc:SUBI.lania.desc+" ズームアウトすると宇宙の大規模構造へ。"+SUBI.web.desc},
   {id:"shape",name:SUBI.shape.name,short:"宇宙の形",parts:[["shape",1]],unit:SUBI.shape.unit,dist:SUBI.shape.dist,min:SUBI.shape.min,max:SUBI.shape.max,desc:SUBI.shape.desc}];
  const SUBMAP={};MERGE.forEach(M=>M.parts.forEach(([id])=>SUBMAP[id]=M.id));
  const LEVELS=MERGE.map(M=>({...M,build(){const root=scene;const seen=new Set(M.hide||[]);Object.assign(window,M.env||{});M.parts.forEach(([id,k])=>{const g=new THREE.Group();g.scale.setScalar(k);root.add(g);const n0=objs.length;scene=g;try{SUBI[id].build();}finally{scene=root;}
      g.traverse(o=>{const m=o.material;if(!m)return;if(m.isPointsMaterial&&m.sizeAttenuation!==false)m.size*=k;if(m.uniforms&&m.uniforms.uSize)m.uniforms.uSize.value*=k;});
      for(let i=n0;i<objs.length;i++){objs[i].view*=k;}});
      Object.keys(M.env||{}).forEach(k=>{delete window[k];});objs=objs.filter(o=>{if(seen.has(o.id)){o.node.visible=false;return false;}seen.add(o.id);return true;});}}));
__SPACEBR__
  // ---- 共通 ----
  function init(container,labels,infoEl,fadeEl){
    el=container;lab=labels;info=infoEl;fade=fadeEl;
    renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.outputEncoding=THREE.sRGBEncoding;
    el.insertBefore(renderer.domElement,el.firstChild);camera=new THREE.PerspectiveCamera(50,1,.01,1e6);
    const cv=renderer.domElement;const ptr=new Map();let pinch=null;
    cv.addEventListener("pointerdown",e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptr.size===1)cam.drag={x:e.clientX,y:e.clientY,th:cam.th,ph:cam.ph,m:0};else{const [a,b]=[...ptr.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);cam.drag=null;}cam.auto=false;});
    cv.addEventListener("pointermove",e=>{if(!ptr.has(e.pointerId))return;ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pinch&&ptr.size===2){const [a,b]=[...ptr.values()],d=Math.hypot(a.x-b.x,a.y-b.y);zoom(pinch/d);pinch=d;return;}
      if(cam.drag){const dx=e.clientX-cam.drag.x,dy=e.clientY-cam.drag.y;cam.drag.m=Math.max(cam.drag.m,Math.abs(dx)+Math.abs(dy));cam.th=cam.drag.th-dx*.006;cam.ph=Math.min(3.0,Math.max(.12,cam.drag.ph-dy*.005));}});
    const up=e=>{ptr.delete(e.pointerId);if(ptr.size<2)pinch=null;cam.drag=null;};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
    el.addEventListener("wheel",e=>{e.preventDefault();const r=el.getBoundingClientRect();ptrW={x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()};zoom(Math.exp(e.deltaY*.0012));},{passive:false});
    lab.addEventListener("click",e=>{const b=e.target.closest("[data-o]");if(b)focusOn(b.dataset.o);});
    new ResizeObserver(resize).observe(el);resize();
  }
  let edge=0;
  function zoom(f){const L=ALL[LV];const ng=cam.goal*f;
    if(ng>L.max&&f>1){edge+=f-1;if(edge>.6){edge=0;outward();}cam.goal=L.max;return;}
    if(ng<cam.min&&f<1){edge+=1-f;if(edge>.6){edge=0;inward(true);}cam.goal=cam.min;return;}
    edge=0;cam.goal=ng;}
  const idx=id=>ALL.findIndex(x=>x.id===id);
  function outward(){const L=ALL[LV];if(L.up){const u=idx(L.up);if(u>=0)go(u,null,"out",ALL[u].downObj);return;}if(L.top)return;
    if(L.br){const pi=idx(L.parent);if(pi>=0)go(pi,null,"out",L.pobj);return;}if(LV<LEVELS.length-1)go(LV+1,null,"out",GATE[LEVELS[LV+1].id]);else go(idx("mv"),null,"out","u_home");}
  // ズームインの行き先：注目中（またはカーソル付近）の天体を優先し、勝手に別の場所へ飛ばない
  const GATE={em:"earth",solar:"earth",near:"sun",galaxy:"sunpos",lania:"lg",shape:"uni_shape"};
  let ptrW=null;const PLMAP=new Set(["mercury","venus","mars","jupiter","saturn","uranus","neptune","pluto","moon"]);
  function pickNear(){const w=el.clientWidth,h=el.clientHeight;const fresh=ptrW&&performance.now()-ptrW.t<1500;const px=fresh?ptrW.x:w/2,py=fresh?ptrW.y:h/2;let best=null,bd=1e9;const p=new THREE.Vector3();
    objs.forEach(o=>{if(!o.node.visible)return;o.node.getWorldPosition(p);p.project(camera);if(p.z>1||p.z<-1)return;const d=Math.hypot((p.x*.5+.5)*w-px,(-p.y*.5+.5)*h-py);if(d<bd){bd=d;best=o;}});return bd<Math.min(w,h)*.3?best:null;}
  function inward(fromZoom){const L=ALL[LV];const tgt=focus||pickNear();
    if(LV===0){if(!tgt||tgt.id==="earth"){window.dispatchEvent(new CustomEvent("spz-earth"));return;}if(focus===tgt&&PLMAP.has(tgt.id)&&window.toPlanetMap){window.toPlanetMap(tgt.id);return;}focusOn(tgt.id);return;}
    if(tgt&&focus===tgt&&PLMAP.has(tgt.id)&&window.toPlanetMap&&!(!L.br&&GATE[L.id]===tgt.id)){window.toPlanetMap(tgt.id);return;}
    if(tgt){if(!L.br&&GATE[L.id]===tgt.id){go(LV-1,null,"in",GATE[LEVELS[LV-1].id]);return;}const k=BRMAP[L.id+":"+tgt.id];if(k&&focus===tgt){if(k.startsWith("in_"))window.SPZ_MAP=true;{const K=ALL[idx(k)];go(idx(k),null,"in",K&&(K.downObj||(!K.br?GATE[K.id]:null)));}return;}if(!focus||focus!==tgt)focusOn(tgt.id);return;}
    if(!L.br&&LV>0){go(LV-1,null,"in",GATE[LEVELS[LV-1].id]);return;}
    if(L.id==="mv"){go(idx("shape"),null,"in","uni_shape");return;}}
  function resize(){if(!el||!renderer)return;const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);renderer.domElement.style.width=w+"px";renderer.domElement.style.height=h+"px";camera.aspect=w/h;camera.updateProjectionMatrix();}
  function stars(){const p=[],c=[];for(let i=0;i<5000;i++){const u=R()*2-1,a=R()*6.283,q=Math.sqrt(1-u*u);p.push(Math.cos(a)*q*9e4,u*9e4,Math.sin(a)*q*9e4);const t=R();const cc=t<.15?C("#ffb38a"):t<.35?C("#bcd2ff"):C("#ffffff");const b=.4+R()*.6;c.push(cc.r*b,cc.g*b,cc.b*b);}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(new Float32Array(p),3));g.setAttribute("color",new THREE.BufferAttribute(new Float32Array(c),3));
    return new THREE.Points(g,new THREE.PointsMaterial({size:1.6,sizeAttenuation:false,vertexColors:true,transparent:true,depthWrite:false}));}
  let starfield,hidN=0;
  let anchor=null;
  go.tok=0;function go(i,oid,dir,fromId){
    if(!renderer||!ALL[i])return; const first=!scene;
    fade.classList.add("on");const tok=go.tok=(go.tok||0)+1;
    setTimeout(()=>{if(tok!==go.tok)return;
      LV=i;seed=11+i*97;objs=[];anims=[];focus=null;
      if(scene)scene.traverse(o=>{o.geometry&&o.geometry.dispose();});
      scene=new THREE.Scene();scene.background=C("#02030a");starfield=stars();scene.add(starfield);
      const L=ALL[i];L.build();hidN=0;
      if(typeof window.KYEAR==="number"&&window.SPZ_DISC){const Y=window.KYEAR,D=window.SPZ_DISC,A=window.SPZ_ART;objs=objs.filter(o=>{const d=D[o.id]??-1e12;const hide=Y< -300000?A.has(o.id):d>Y;if(hide){o.node.visible=false;hidN++;}return !hide;});}cam.min=L.min;cam.max=L.max;cam.goalT.set(...(L.center||[0,0,0]));cam.target.set(...(L.center||[0,0,0]));cam.goal=L.dist;
      cam.dist=dir==="in"?L.dist*3:dir==="out"?L.dist*.25:L.dist;cam.auto=true;cam.ph=L.ph!=null?L.ph:1.1;if(L.th!=null){cam.th=L.th;cam.auto=false;}
      lab.innerHTML=objs.map(o=>`<button class="splab" data-o="${o.id}"><i></i>${o.name}</button>`).join("");objs.forEach(o=>o.el=lab.querySelector(`[data-o="${o.id}"]`));
      renderInfo(); window.dispatchEvent(new CustomEvent("spz-level",{detail:i}));
      anchor=null;const DEFA={near:"sun",galaxy:"sunpos",lania:"lg"};if(!fromId&&!L.br&&DEFA[L.id])fromId=DEFA[L.id];if(fromId){const fo=objs.find(x=>x.id===fromId);if(fo){anchor=fo;const p=new THREE.Vector3();fo.node.getWorldPosition(p);cam.target.copy(p);cam.goalT.copy(p);if(dir==="out")cam.dist=Math.max(fo.view*.6,L.min*1.5);}}
      if(oid)setTimeout(()=>focusOn(oid),dir?500:50);
      fade.classList.remove("on");
    },first?0:220);
  }
  function isolate(o){const L=ALL[LV];if(!L||!L.iso)return;const p=new THREE.Vector3(),q=new THREE.Vector3();if(o)o.node.getWorldPosition(p);objs.forEach(x=>{if(x.hid0===undefined)x.hid0=x.node.visible;if(!o){x.node.visible=x.hid0;return;}x.node.getWorldPosition(q);x.node.visible=x===o||q.distanceTo(p)>o.view*2.2?x.hid0:false;});}
  function focusOn(id){const o=objs.find(x=>x.id===id);if(!o)return;focus=o;isolate(o);cam.goal=o.view;cam.min=Math.min(ALL[LV].min,o.view*.25);cam.auto=true;renderInfo();window.dispatchEvent(new CustomEvent("spz-obj",{detail:id}));}
  function renderInfo(){const L=ALL[LV];const bk=focus&&BRMAP[L.id+":"+focus.id];const ln=L.br?(LANES.find(x=>x.id===L.lane)||{}).name:"";const par=L.br?ALL[idx(L.parent)]:null;const SHP=L.id==="shape"?`<div class="spshape">${[["flat","平坦"],["sphere","閉じた（球）"],["saddle","開いた（双曲）"],["torus","トーラス"],["multi","多元宇宙"]].map(([k,n])=>`<button class="chip" data-shape="${k}" aria-pressed="${(window.UNI_SHAPE||"flat")===k}">${n}</button>`).join("")}</div><p class="spshd">${L.desc2||""}</p>`:"";
    info.innerHTML=(L.br?`<div class="splv">分岐：${ln}</div>`:`<div class="splv">スケール ${LV+1} / ${LEVELS.length}</div>`)+`<h3>${L.name}</h3><div class="spunit">${L.unit}</div><p>${L.desc}</p>`+(window.lvMore?(L.parts?L.parts.map(([id])=>window.lvMore(id)).join(""):window.lvMore(L.id)):"")+SHP+(typeof window.KYEAR==="number"&&window.KYEAR< -300000?`<p class="sphid">この時代にはまだ人類がいません。自然の天体だけを表示しています。</p>`:hidN?`<p class="sphid">${window.KERA?window.KERA.when:""}の時点では、まだ知られていない天体・存在しない人工物 ${hidN}件を隠しています。</p>`:"")+
      (LV===0?`<button class="chip spearth" data-earth="1">🌏 地球に降りる（世界地図へ）</button>`:"")+(L.br?`<button class="chip" data-back="1">◀ ${par?par.name:"戻る"}へ戻る</button>`:"")+((L.fic||L.id==="mv")?`<p class="sphid">ここから先は空想（SF）です。実在する天体ではありません。</p>`:"")+(bk?`<button class="chip spearth" data-map="0" data-br="${bk}">🔍 ${focus.name}の中をのぞく</button>`:"")+(focus&&PLMAP.has(focus.id)?`<button class="chip" data-pmap="${focus.id}">🗺 ${focus.name}の地図（世界地図のページ）</button>`:"")+(L.id.startsWith("in_")?`<button class="chip spearth" data-map="${window.SPZ_MAP?0:1}">${window.SPZ_MAP?"🌐 球と断面で見る":"🗺 地図（全面）で見る"}</button>`:"")+(L.id.startsWith("in_")&&PLMAP.has(L.id.slice(3))?`<button class="chip" data-pmap="${L.id.slice(3)}">🗺 世界地図のページで開く</button>`:"")+(focus?`<div class="spobj"><h4>${focus.name}</h4>${focus.dist?`<div class="spdist num">${focus.dist}</div>`:""}<p>${focus.desc||""}</p><button class="chip" data-unfocus="1">全体に戻る</button></div>`:`<p class="sphint">名前を押すとそこへ近づきます。ズームアウトを続けると1つ外のスケールへ、ズームインを続けると1つ内側へ移ります。</p>`)+
      `<div class="spobjs">${objs.map(o=>`<button class="chip" data-o2="${o.id}" aria-pressed="${focus&&focus.id===o.id}">${o.name}</button>`).join("")}</div>`;}
  function frame(now){if(!running)return;requestAnimationFrame(frame);const t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000||0);last=now;if(!scene)return;
    anims.forEach(f=>f(t));
    if(focus||anchor){const p=new THREE.Vector3();(focus||anchor).node.getWorldPosition(p);cam.goalT.copy(p);}else cam.goalT.set(...(ALL[LV].center||[0,0,0]));
    if(window.SPZ_SNAP){cam.target.copy(cam.goalT);cam.dist=cam.goal;}cam.target.lerp(cam.goalT,cam.target.distanceTo(cam.goalT)<cam.dist*.5?.35:.08);cam.dist+=(cam.goal-cam.dist)*.08;if(cam.auto&&!cam.drag)cam.th+=dt*.05;
    const d=cam.dist;camera.position.set(cam.target.x+Math.sin(cam.th)*Math.sin(cam.ph)*d,cam.target.y+Math.cos(cam.ph)*d,cam.target.z+Math.cos(cam.th)*Math.sin(cam.ph)*d);camera.lookAt(cam.target);
    camera.near=Math.max(.001,d*.01);camera.far=d*400+2e5;camera.updateProjectionMatrix();starfield.position.copy(camera.position);
    renderer.render(scene,camera);
    const w=el.clientWidth,h=el.clientHeight,p=new THREE.Vector3();
    objs.forEach(o=>{o.node.getWorldPosition(p);p.project(camera);const vis=p.z<1&&p.z>-1&&Math.abs(p.x)<1.05&&Math.abs(p.y)<1.05&&o.node.visible;o.el.style.display=vis?"":"none";if(vis)o.el.style.transform=`translate(${(p.x*.5+.5)*w}px,${(-p.y*.5+.5)*h}px)`;o.el.classList.toggle("on",focus===o);});
  }
  return {LEVELS,ALL,LANES,BRMAP,SUBMAP,BODY,planetMapURL,outward,inward,goBr(id){const i=idx(id);if(i>=0)go(i,null,i<LEVELS.length&&i<LV?"in":"in");},get levelId(){return ALL[LV]&&ALL[LV].id;},get focusId(){return focus&&focus.id;},get anchorId(){return anchor&&anchor.id;},goFrom(id,from){const i=idx(id);if(i>=0)go(i,null,"out",from);},home(){go(0,null,"in","earth");},goId(id,o,dir){id=SUBMAP[id]||id;const i=ALL.findIndex(L=>L.id===id);if(i>=0){if(i===LV&&o)focusOn(o);else go(i,o,dir||(i<LV?"in":"out"));}},init,go,focusOn,unfocus(){focus=null;isolate(null);cam.goal=ALL[LV].dist;cam.min=ALL[LV].min;renderInfo();},get level(){return LV;},
    start(){if(running||!renderer)return;running=true;last=performance.now();requestAnimationFrame(frame);},stop(){running=false;}};
})();
