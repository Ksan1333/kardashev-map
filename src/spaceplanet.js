  // ===== 惑星・衛星（GPUで模様を描く：継ぎ目なし・実際の地名の位置に合わせる） =====
  const PL_VS=`varying vec3 vP;varying vec3 vN;varying vec3 vW;void main(){vP=normalize(position);vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
  const GLN3=`
float h3(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float f3(vec3 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}
float crat(vec3 p,float sc){vec3 q=p*sc;vec3 i=floor(q),f=fract(q);float m=1.;for(int z=-1;z<=1;z++)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec3 g=vec3(float(x),float(y),float(z));vec3 o=vec3(h3(i+g),h3(i+g+11.),h3(i+g+23.));float d=length(g+o-f);m=min(m,d);}return m;}
float spot(float la,float lo,float cla,float clo,float wl,float hl){float dl=lo-clo;dl=mod(dl+3.14159,6.28318)-3.14159;vec2 d=vec2(dl*cos(cla)/wl,(la-cla)/hl);return exp(-dot(d,d));}
`;
  const PL_FS=`uniform float uKind,uOff;uniform vec3 uSun;uniform float uTime;varying vec3 vP;varying vec3 vN;varying vec3 vW;${GLN3}
const float D=0.0174533;
vec3 albedo(vec3 p,out float atm){float la=asin(clamp(p.y,-1.,1.));float lo=atan(-p.z,p.x)-uOff;atm=0.;vec3 c=vec3(.5);
 if(uKind<.5){ // 水星
  float n=f3(p*6.);float cr=crat(p,9.);float cr2=crat(p,22.);c=vec3(.55,.53,.5)*(.75+n*.45);c*=.8+.25*smoothstep(.05,.3,cr)+.12*smoothstep(.05,.25,cr2);c+=vec3(.35)*smoothstep(.12,.0,cr)*.6;
  c=mix(c,vec3(.68,.64,.58),spot(la,lo,30.5*D,170.*D,.35,.3)*.5);
 } else if(uKind<1.5){ // 金星（雲頂）
  float sw=f3(vec3(lo*2.,la*7.,uTime*.01)+p*3.);float y=sin(lo*1.+la*4.+sw*2.);c=mix(vec3(.93,.85,.62),vec3(.84,.72,.5),smoothstep(-.2,.9,y)*.55+sw*.25);atm=.6;
 } else if(uKind<2.5){ // 月（表側の海の配置）
  float n=f3(p*5.);float hi=.72+n*.3;float m=0.;
  m+=spot(la,lo,32.8*D,-15.6*D,.27,.2);m+=spot(la,lo,28.*D,17.5*D,.15,.13);m+=spot(la,lo,8.5*D,31.4*D,.2,.12);m+=spot(la,lo,17.*D,59.1*D,.1,.08);
  m+=spot(la,lo,-7.8*D,51.3*D,.12,.12);m+=spot(la,lo,-15.2*D,35.5*D,.08,.08);m+=spot(la,lo,-21.3*D,-16.6*D,.16,.12);m+=spot(la,lo,-24.4*D,-38.6*D,.08,.07);
  m+=spot(la,lo,18.4*D,-57.4*D,.42,.38);m+=spot(la,lo,56.*D,1.4*D,.4,.05);m+=spot(la,lo,13.*D,3.6*D,.06,.05);m+=spot(la,lo,-10.*D,-22.*D,.1,.08);m+=spot(la,lo,-1.*D,-60.*D,.25,.25);
  m=smoothstep(.35,.9,m+(n-.5)*.4);c=mix(vec3(.72,.7,.66)*hi,vec3(.3,.3,.32)*(.8+n*.4),m);float cr=crat(p,14.);c*=.88+.18*smoothstep(.04,.25,cr);
  vec3 ty=vec3(cos(-43.3*D)*cos(-11.2*D),sin(-43.3*D),-cos(-43.3*D)*sin(-11.2*D));float dt=acos(clamp(dot(p,ty),-1.,1.));float ang=atan(dot(cross(ty,p),vec3(0,1,0)),dot(p,vec3(0,1,0)));
  c+=vec3(.5)*smoothstep(.06,.0,dt)+vec3(.25)*smoothstep(.9,.0,dt)*pow(n3(vec3(ang*6.,0.,0.)),4.)*.8;
  vec3 co=vec3(cos(9.6*D)*cos(-20.*D),sin(9.6*D),-cos(9.6*D)*sin(-20.*D));c+=vec3(.3)*smoothstep(.04,.0,acos(clamp(dot(p,co),-1.,1.)));
 } else if(uKind<3.5){ // 火星
  float n=f3(p*4.);float n2=f3(p*16.);c=mix(vec3(.74,.4,.22),vec3(.82,.52,.3),n);float d=0.;
  d+=spot(la,lo,8.4*D,69.5*D,.13,.2);d+=spot(la,lo,45.*D,-30.*D,.3,.12);d+=spot(la,lo,-25.*D,-40.*D,.3,.12);d+=spot(la,lo,-20.*D,100.*D,.45,.1);d+=spot(la,lo,-30.*D,160.*D,.5,.12);
  d+=spot(la,lo,-25.*D,-5.*D,.3,.1);d+=spot(la,lo,-27.*D,-85.*D,.07,.06);d+=spot(la,lo,10.*D,25.*D,.18,.08);
  d=smoothstep(.3,.95,d+(n2-.5)*.5);c=mix(c,vec3(.36,.22,.15),d*.75);
  c=mix(c,vec3(.95,.8,.62),spot(la,lo,-42.4*D,70.5*D,.22,.15)*.6);
  float vm=exp(-pow((la+12.*D+sin(lo*3.)*.02)/(1.8*D),2.))*smoothstep(-110.*D,-90.*D,lo)*smoothstep(-35.*D,-55.*D,lo);c=mix(c,vec3(.3,.17,.12),vm*.85);
  float om=spot(la,lo,18.65*D,-133.8*D,.07,.07);c=mix(c,vec3(.55,.35,.25),om);c+=vec3(.12,.06,.03)*smoothstep(.55,.95,om);
  c=mix(c,vec3(.62,.38,.25),(spot(la,lo,1.5*D,-112.*D,.03,.03)+spot(la,lo,-9.*D,-121.*D,.03,.03)+spot(la,lo,12.*D,-104.*D,.03,.03))*.8);
  float cap=smoothstep(78.*D,84.*D,la+n2*.06)+smoothstep(-80.*D,-86.*D,la-n2*.06);c=mix(c,vec3(.97,.95,.93),cap);atm=.12;
 } else if(uKind<4.5){ // 木星（帯と縞・大赤斑）
  float t=f3(vec3(lo*3.,la*24.,uTime*.003));float l=la/D+(t-.5)*3.;
  vec3 zone=vec3(.93,.87,.75),belt=vec3(.62,.42,.28),polar=vec3(.62,.6,.58),eq=vec3(.88,.75,.55);
  c=zone;c=mix(c,eq,smoothstep(7.,3.,abs(l)));c=mix(c,belt,smoothstep(6.,8.,l)*smoothstep(18.,16.,l));c=mix(c,belt,smoothstep(-6.,-8.,l)*smoothstep(-21.,-18.,l));
  c=mix(c,belt*1.1,(smoothstep(24.,26.,l)*smoothstep(32.,30.,l)+smoothstep(-28.,-30.,l)*smoothstep(-36.,-34.,l))*.8);
  c=mix(c,belt*1.15,(smoothstep(36.,38.,abs(l))*smoothstep(46.,44.,abs(l)))*.6);c=mix(c,polar,smoothstep(45.,60.,abs(l)));
  float sw=f3(vec3(lo*8.,la*40.,uTime*.005));c*=.85+sw*.3;
  float gr=spot(la,lo,-22.*D,-60.*D,.16,.075);float gs=f3(vec3(lo*20.,la*20.,0.));c=mix(c,vec3(.78,.38,.22)*(.85+gs*.3),smoothstep(.25,.75,gr));c=mix(c,vec3(.9,.82,.7),smoothstep(.8,.95,gr)*.3);
  c=mix(c,vec3(.95,.92,.88),spot(la,lo,-33.*D,40.*D,.04,.025)*.8);atm=.25;
 } else if(uKind<5.5){ // 土星（淡い帯・北極の六角形）
  float t=f3(vec3(lo*2.,la*20.,0.));float l=la/D+(t-.5)*2.;c=vec3(.9,.82,.6);
  c=mix(c,vec3(.78,.66,.45),.5+.5*sin(l*.35));c=mix(c,vec3(.95,.88,.68),smoothstep(10.,0.,abs(l))*.6);c=mix(c,vec3(.6,.62,.6),smoothstep(55.,75.,abs(l)));
  float r=90.-l;float a=mod(lo+.3,1.0472)-.5236;float hx=12./cos(a);c=mix(c,vec3(.42,.48,.52),smoothstep(hx+1.,hx-1.,r)*step(0.,l)*.8);c*=.9+f3(p*20.)*.15;atm=.3;
 } else if(uKind<6.5){ // 天王星
  float t=f3(vec3(lo,la*12.,0.));c=vec3(.62,.86,.88)*(.95+t*.08);c=mix(c,vec3(.78,.93,.94),smoothstep(40.*D,80.*D,abs(la))*.5);atm=.55;
 } else if(uKind<7.5){ // 海王星（暗斑と白い雲）
  float t=f3(vec3(lo*2.,la*18.,uTime*.004));c=vec3(.25,.42,.88)*(.88+t*.25);c=mix(c,vec3(.18,.3,.72),.5+.5*sin(la*9.));
  c=mix(c,vec3(.1,.16,.45),spot(la,lo,-20.*D,-40.*D,.13,.07));c+=vec3(.7)*smoothstep(.6,.9,spot(la,lo,-25.*D,-30.*D,.12,.02)+f3(vec3(lo*6.,la*50.,0.))*.4)*.6;atm=.6;
 } else if(uKind<8.5){ // 冥王星（ハート形のトンボー領域）
  float n=f3(p*5.);c=mix(vec3(.75,.65,.52),vec3(.88,.78,.65),n);float heart=smoothstep(.4,.7,spot(la,lo,25.*D,175.*D,.3,.35)+spot(la,lo,5.*D,-170.*D,.25,.3)*.8);c=mix(c,vec3(.97,.94,.9),heart);
  float cth=smoothstep(.35,.7,spot(la,lo,-5.*D,100.*D,.7,.25));c=mix(c,vec3(.32,.16,.1),cth*.85);
 } else if(uKind<9.5){ // イオ
  float n=f3(p*5.);c=mix(vec3(.92,.86,.42),vec3(.88,.66,.3),n);c=mix(c,vec3(.95,.95,.85),smoothstep(.6,.75,f3(p*9.+4.)));c=mix(c,vec3(.15,.1,.06),smoothstep(.82,.86,f3(p*12.+9.)));c=mix(c,vec3(.7,.3,.15),smoothstep(.7,.8,f3(p*7.+2.))*.6);
 } else if(uKind<10.5){ // エウロパ
  float n=f3(p*4.);c=mix(vec3(.9,.86,.78),vec3(.78,.68,.55),n*.6);float ln=1.-abs(n3(p*14.)*2.-1.);c=mix(c,vec3(.55,.35,.2),smoothstep(.92,.99,ln)*.8);
 } else if(uKind<11.5){ // ガニメデ
  float n=f3(p*4.);c=mix(vec3(.42,.38,.33),vec3(.7,.66,.6),smoothstep(.4,.6,n));c*=.85+.2*crat(p,12.);
 } else if(uKind<12.5){ // カリスト
  float n=f3(p*5.);c=vec3(.3,.27,.23)*(.8+n*.4);c+=vec3(.5)*smoothstep(.12,.0,crat(p,16.))*.7;
 } else { // タイタン
  float n=f3(vec3(lo*2.,la*6.,0.));c=mix(vec3(.85,.6,.25),vec3(.75,.5,.2),n*.5+smoothstep(.2,.6,abs(la))*.3);atm=.9;
 }
 return c;}
void main(){vec3 n=normalize(vN);vec3 L=normalize(uSun-vW);vec3 v=normalize(cameraPosition-vW);float atm;vec3 a=albedo(normalize(vP),atm);
 float dif=max(dot(n,L),0.);float mu=max(dot(n,v),0.);float limb=mix(1.,.55+.45*pow(mu,.5),step(.2,atm));
 vec3 col=a*(dif*1.35+.07)*limb;float rim=pow(1.-mu,3.)*atm;col+=a*rim*smoothstep(-.2,.3,dot(n,L))*.6;
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  const PLK={mercury:0,venus:1,moon:2,mars:3,jupiter:4,saturn:5,uranus:6,neptune:7,pluto:8,io:9,europa:10,ganymede:11,callisto:12,titan:13};
  function planetMat(kind,sun=V(0,0,0),off=0){const m=new THREE.ShaderMaterial({uniforms:{uKind:{value:PLK[kind]},uOff:{value:off},uSun:{value:sun.clone()},uTime:{value:0}},vertexShader:PL_VS,fragmentShader:PL_FS});anims.push(t=>m.uniforms.uTime.value=t);return m;}
  function planetGPU(r,kind,sun,seg=72,off=0){return sphere(r,planetMat(kind,sun,off),seg);}
  // 土星の環（実際の環の位置：C環・B環・カッシーニの間隙・A環・エンケの間隙・F環）＋土星の影
  const RING_FS=`uniform float uR;uniform vec3 uC,uSun;uniform float uKind;varying vec3 vW;varying vec3 vL;${GLN3}
void main(){float r=length(vL)/uR;float op=0.;vec3 c=vec3(.85,.78,.62);
 if(uKind<.5){
  if(r>1.239&&r<1.527){op=.12+.08*n3(vec3(r*300.,0.,0.));c=vec3(.6,.55,.48);}
  else if(r>=1.527&&r<1.951){op=.75+.2*n3(vec3(r*500.,0.,0.));c=vec3(.92,.85,.68)*(.85+.25*n3(vec3(r*120.,0.,0.)));}
  else if(r>=1.951&&r<2.027){op=.05;}
  else if(r>=2.027&&r<2.269){op=.55+.15*n3(vec3(r*400.,0.,0.));c=vec3(.85,.78,.62);if(abs(r-2.214)<.006||abs(r-2.265)<.002)op=.02;}
  else if(abs(r-2.326)<.004){op=.6;c=vec3(.9);}
 } else { if(abs(r-1.64)<.006||abs(r-1.67)<.004||abs(r-1.73)<.004||abs(r-1.85)<.004){op=.28;c=vec3(.32,.33,.36);} if(abs(r-2.0)<.012){op=.45;c=vec3(.38,.39,.42);} }
 if(op<.01)discard;vec3 d=normalize(uSun-vW);vec3 o=vW-uC;float b=dot(o,d),cc=dot(o,o)-uR*uR;float sh=(b<0.&&b*b-cc>0.)?.12:1.;
 gl_FragColor=vec4(c*sh*1.1,op);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  function ringsFX(r,kind,sun,center){const inner=kind?1.6:1.2,outer=kind?2.05:2.36;const m=new THREE.ShaderMaterial({uniforms:{uR:{value:r},uC:{value:center||V(0,0,0)},uSun:{value:sun.clone()},uKind:{value:kind||0}},
      vertexShader:"varying vec3 vW;varying vec3 vL;void main(){vL=position;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:RING_FS,transparent:true,side:THREE.DoubleSide,depthWrite:false});
    const g=new THREE.RingGeometry(r*inner,r*outer,256,4);const me=new THREE.Mesh(g,m);me.rotation.x=-Math.PI/2;return me;}
  // ---- 断面（中をのぞく）：4分の1を切り取った球と、層ごとの半円 ----
  function cutaway(r,shellMat,layers,group){const g=group||new THREE.Group();
    const geo=new THREE.SphereGeometry(r,128,64,0,Math.PI*1.5);const sh=new THREE.Mesh(geo,shellMat);g.add(sh);
    let prev=0;layers.forEach(([f,nm,col,emi])=>{const ri=r*f;const mat=emi?new THREE.MeshBasicMaterial({color:C(col).lerp(C(emi),.25),side:THREE.DoubleSide}):new THREE.MeshBasicMaterial({color:C(col).multiplyScalar(.82),side:THREE.DoubleSide});
      const a=new THREE.Mesh(new THREE.RingGeometry(r*prev,ri,96,1,Math.PI/2,Math.PI),mat);g.add(a);const b=a.clone();b.rotation.y=-Math.PI/2;g.add(b);
      const lm=new THREE.MeshBasicMaterial({color:"#000",transparent:true,opacity:.35,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2});const l1=new THREE.Mesh(new THREE.RingGeometry(ri*.996,ri*1.004,96,1,Math.PI/2,Math.PI),lm);g.add(l1);const l2=l1.clone();l2.rotation.y=-Math.PI/2;g.add(l2);
      prev=f;});
    return g;}

  // 惑星の地図（正距円筒図法）：球と同じ模様の関数を平面に広げる
  const MAP_FS="varying vec2 vUv;\n"+PL_FS.slice(0,PL_FS.indexOf("void main(){vec3 n=normalize(vN);"))+`void main(){float lo=(vUv.x-.5)*6.28318+uOff;float la=(vUv.y-.5)*3.14159;vec3 p=vec3(cos(la)*cos(lo),sin(la),-cos(la)*sin(lo));float atm;vec3 a=albedo(p,atm);gl_FragColor=vec4(pow(a,vec3(1.25))*.85,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  function mapMat(kind,off=0){const m=new THREE.ShaderMaterial({uniforms:{uKind:{value:PLK[kind]},uOff:{value:off},uSun:{value:V(0,0,1)},uTime:{value:0}},vertexShader:"varying vec3 vP;varying vec3 vN;varying vec3 vW;varying vec2 vUv;void main(){vUv=uv;vP=vec3(1.,0.,0.);vN=vec3(0.,0.,1.);vW=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:MAP_FS});anims.push(t=>m.uniforms.uTime.value=t);return m;}
