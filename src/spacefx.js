  // ===== 忠実な描写のためのシェーダー（星雲・銀河・恒星・ブラックホール） =====
  const GLN=`
float hh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float nn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hh(i),hh(i+vec2(1.,0.)),f.x),mix(hh(i+vec2(0.,1.)),hh(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<6;i++){v+=a*nn(p);p=m*p;a*=.5;}return v;}
float rdg(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){float k=1.-abs(nn(p)*2.-1.);v+=a*k*k;p=m*p;a*=.5;}return v;}
vec2 rot(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x-s*p.y,s*p.x+c*p.y);}
float sdCap(vec2 p,vec2 a,vec2 b,float ra,float rb){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-mix(ra,rb,h);}
float sdEl(vec2 p,vec2 c,vec2 r,float a){vec2 q=rot(p-c,-a)/r;return (length(q)-1.)*min(r.x,r.y);}
float pil(vec2 pp){float d1=sdCap(pp,vec2(-.42,-1.05),vec2(-.22,.5),.19,.06),d2=sdCap(pp,vec2(.02,-1.05),vec2(.06,-.1),.13,.05),d3=sdCap(pp,vec2(.4,-1.05),vec2(.43,-.42),.11,.04);float d=min(d1,min(d2,d3));return min(d,sdEl(pp,vec2(-.16,.47),vec2(.13,.07),.6));}
`;
  const BBVS=`uniform float uSize;varying vec2 vUv;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(0.,0.,0.,1.);mv.xy+=position.xy*uSize;gl_Position=projectionMatrix*mv;}`;
  const NEBFS=`uniform float uKind,uSeed,uTime,uRot,uGain;uniform vec3 uC1,uC2,uC3;varying vec2 vUv;${GLN}
void main(){vec2 p=rot((vUv-.5)*2.,uRot);vec2 s=vec2(uSeed*3.1,uSeed*1.7);float r=length(p);vec3 col=vec3(0.);float a=0.;
 vec2 q=vec2(fbm(p*2.+s),fbm(p*2.+s+5.2));vec2 w=p+.32*(q-.5)*2.;float tt=uTime*.004;
 if(uKind<.5){ // オリオン大星雲 M42（+M43）
  vec2 c=p-vec2(-.04,.02);float d=fbm(w*2.6+s+tt);float body=exp(-dot(c*vec2(1.,1.3),c*vec2(1.,1.3))*2.6);float ang=atan(c.y,c.x);
  float wing=exp(-dot(c,c)*1.3)*pow(.5+.5*sin(ang*2.+1.2),2.);float den=(body*1.25+wing*.6)*(.25+d*1.1);
  vec2 m=p-vec2(-.12,.6);float m43=exp(-dot(m,m)*26.)*(.5+fbm(w*7.+s));den+=m43*.7;
  float lane=exp(-pow((c.y-.3-c.x*.4+(fbm(w*5.)-.5)*.12)*8.,2.))*smoothstep(.75,-.1,c.x)*smoothstep(-.7,0.,c.x);
  float dust=clamp(lane*1.1+smoothstep(.55,.82,fbm(w*3.6+s+3.))*.6*smoothstep(.15,.8,length(c)),0.,1.);
  float core=exp(-dot(c,c)*22.);vec3 cc=mix(uC1,uC2,smoothstep(.05,.8,core*1.8+body*.25));cc=mix(cc,vec3(1.,.97,.92),core*.85);
  col=cc*den*2.1;col*=1.-dust*.85;a=clamp(den*1.5,0.,1.);a=max(a,dust*.8*smoothstep(1.1,.35,length(c)));
 } else if(uKind<1.5){ // カリーナ星雲（暗黒帯・鍵穴・エータカリーナ）
  float d=fbm(w*2.2+s+tt);float body=exp(-dot(p*vec2(.85,1.2),p*vec2(.85,1.2))*1.6);float den=body*(.2+d*1.3);
  float ridge=rdg(w*3.+s);float vlane=exp(-pow((abs(p.x+.05)-(p.y+.25)*.55)*6.,2.))*smoothstep(-.35,.6,p.y);
  float dust=clamp(smoothstep(.5,.8,ridge)*.8+vlane*.9+smoothstep(.6,.85,fbm(w*4.+9.))*.5,0.,1.);
  vec2 k=p-vec2(.08,-.02);float key=smoothstep(.14,.08,length(k*vec2(1.,1.6)))*smoothstep(.03,.07,length(k-vec2(0.,.05)));
  vec3 cc=mix(uC1,uC2,smoothstep(.3,.8,d));cc=mix(cc,uC3,smoothstep(.65,.95,d)*.6);col=cc*den*2.;col*=1.-dust*.8;
  vec2 e=rot(p-vec2(.11,.03),.6);float lobes=exp(-pow(length(e*vec2(4.,1.)-vec2(0.,.06)),2.)*900.)+exp(-pow(length(e*vec2(4.,1.)+vec2(0.,.06)),2.)*900.);
  col+=vec3(1.,.75,.45)*lobes*1.4+vec3(1.)*exp(-dot(p-vec2(.11,.03),p-vec2(.11,.03))*4000.)*3.;col*=1.-key*.9;
  a=clamp(den*1.6,0.,1.);a=max(a,(dust*.75+key)*smoothstep(1.,.4,r));
 } else if(uKind<2.5){ // 環状星雲 M57
  vec2 e=p*vec2(1.,1.28);float re=length(e);float n=fbm(w*5.+s);float ring=exp(-pow((re-.5)/.15,2.));float hole=exp(-pow(re/.42,2.))*.32;
  float halo=exp(-pow((re-.8)/.1,2.))*.22*(.5+n)*(.6+.4*sin(atan(e.y,e.x)*9.+n*6.));
  vec3 cc=mix(uC2,uC1,smoothstep(.36,.66,re));float den=ring*(.55+n*.9)+hole*(.6+n*.5);
  col=cc*den*2.3+uC1*halo*1.5+vec3(.9,.95,1.)*exp(-re*re*1500.)*2.;a=clamp(den*1.3+halo,0.,1.);
 } else if(uKind<3.5){ // らせん星雲（二重の輪と彗星状のこぶ）
  float n=fbm(w*4.+s);float r1=length(p);vec2 p2=rot(p,.7)*vec2(1.,1.2)+vec2(.04,-.03);float r2=length(p2);
  float ring1=exp(-pow((r1-.44)/.13,2.)),ring2=exp(-pow((r2-.66)/.1,2.))*.8;float ang=atan(p.y,p.x);
  float knots=pow(nn(vec2(ang*38.+s.x,r1*9.)),5.)*smoothstep(.28,.42,r1)*smoothstep(.62,.44,r1);
  vec3 cin=uC2,cmid=uC3,cout=uC1;vec3 cc=mix(cin,cmid,smoothstep(.2,.45,r1));cc=mix(cc,cout,smoothstep(.45,.7,r1));
  float fillc=exp(-r1*r1*5.)*.55*(.4+n);float den=ring1*(.5+n)+ring2*(.4+n*.8)+fillc;col=cc*den*2.1+cin*fillc*1.2+vec3(1.,.7,.45)*knots*1.2+vec3(.85,.9,1.)*exp(-r1*r1*2500.)*2.5;
  a=clamp(den*1.25+knots,0.,1.);
 } else if(uKind<4.5){ // キャッツアイ星雲（同心の殻＋入れ子の泡）
  float n=fbm(w*5.+s);float shells=pow(.5+.5*sin(r*48.+n*3.),6.)*smoothstep(.95,.35,r)*smoothstep(.2,.4,r)*.35;
  float b1=abs(sdEl(p,vec2(0.),vec2(.18,.34),.35)),b2=abs(sdEl(p,vec2(.02,0.),vec2(.3,.16),-.5)),b3=abs(sdEl(p,vec2(0.),vec2(.11,.12),0.));
  float edges=exp(-b1*b1*900.)+exp(-b2*b2*900.)+exp(-b3*b3*1400.)*.8;float fill=exp(-r*r*14.)*.6;
  vec3 cc=mix(uC2,uC1,smoothstep(.1,.35,r));float lob=exp(-pow(length(rot(p,.35)*vec2(3.2,1.)-vec2(0.,.52)),2.)*20.)+exp(-pow(length(rot(p,.35)*vec2(3.2,1.)+vec2(0.,.52)),2.)*20.);
  col=cc*(edges*(.6+n)+fill*n)*2.+uC1*lob*.9*n+uC3*shells;col+=vec3(1.)*exp(-r*r*3000.)*2.;a=clamp((edges+fill)*n*1.4+shells+lob*.6,0.,1.);
 } else if(uKind<5.5){ // かに星雲（フィラメントの網とシンクロトロン放射）
  vec2 e=p*vec2(1.,1.4);float re=length(e);float shell=smoothstep(.98,.72,re+(fbm(w*3.)-.5)*.25);
  float fil=smoothstep(.55,.88,rdg(w*4.6+s))*shell;float syn=exp(-re*re*2.4)*shell*(.4+fbm(w*3.+s+2.)*.8);
  vec3 fc=mix(uC1,uC3,nn(w*3.+s));col=fc*fil*2.2+uC2*syn*1.1+vec3(.9,.95,1.)*exp(-re*re*1200.)*2.;a=clamp(fil*1.3+syn*.9,0.,1.);
 } else if(uKind<6.5){ // わし星雲・創造の柱
  vec2 pp=p+(vec2(fbm(p*5.+s),fbm(p*5.+s+3.))-.5)*.1;float d=pil(pp);float e=.012;vec2 gr=vec2(pil(pp+vec2(e,0.))-d,pil(pp+vec2(0.,e))-d)/e;
  float bg=fbm(w*2.+s+tt);vec3 bc=mix(uC2,uC3,smoothstep(.2,.9,p.y*.5+.5+(bg-.5)*.6));bc*=.35+bg*1.1;
  float inside=smoothstep(.01,-.01,d);float depth=clamp(-d*6.,0.,1.);float lit=clamp(.55+.45*dot(normalize(gr+1e-4),normalize(vec2(-.3,1.))),0.,1.);
  float tex=fbm(pp*10.+s);float rim=exp(-pow(max(d,0.)*30.,2.))*(.4+.6*lit);
  vec3 pc=mix(uC1*.9,vec3(.16,.08,.04),smoothstep(0.,.6,depth))*(.45+tex*.9)*(.35+lit*.9);float tops=exp(-pow(max(-d,0.)*25.,2.))*lit*smoothstep(-.6,.3,pp.y);pc+=uC1*tops*.9;
  col=mix(bc,pc,inside)+uC1*rim*1.1*(1.-inside);float bga=smoothstep(1.15,.25,r)*(.3+bg*.9);a=max(bga,inside*.97);
 } else if(uKind<7.5){ // 馬頭星雲（IC434の赤い光と暗黒星雲B33）
  float edge=-.12+(fbm(vec2(p.x*3.,0.)+s)-.5)*.12;float strat=fbm(vec2(p.x*2.2,p.y*7.)+s+tt);float red=smoothstep(edge-.02,edge+.2,p.y)*(.35+strat*1.1)*smoothstep(1.,.2,abs(p.x)*.8+max(0.,p.y-.6));
  vec2 hp=p+(vec2(fbm(p*9.+s),fbm(p*9.+s+4.))-.5)*.05;float neck=sdEl(hp,vec2(.05,-.02),vec2(.1,.24),.15),head=sdEl(hp,vec2(-.06,.2),vec2(.17,.1),-.55),ear=sdEl(hp,vec2(.08,.33),vec2(.04,.08),.3),snout=sdEl(hp,vec2(-.2,.12),vec2(.07,.06),0.);
  float horse=min(min(neck,head),min(ear,snout));float dark=max(smoothstep(edge+.01,edge-.04,p.y),smoothstep(.01,-.01,horse));
  vec2 g=p-vec2(-.55,-.6);float ngc=exp(-dot(g,g)*14.)*(.5+fbm(w*5.+s));
  col=uC1*red*1.8*(1.-dark)+uC2*ngc*1.5;col=mix(col,vec3(.05,.03,.03),dark*.92);col+=vec3(.9,.95,1.)*exp(-dot(p-vec2(.48,.78),p-vec2(.48,.78))*2500.)*3.;
  a=clamp(red*1.2+ngc,0.,1.)*smoothstep(1.2,.6,r);a=max(a,dark*.95*smoothstep(1.,.5,r));
 } else if(uKind>8.5){ // うすい霧
  float den=fbm(w*1.4+s+tt)*smoothstep(1.05,.15,r);col=mix(uC1,uC2,den)*den*1.5;a=clamp(den*.9,0.,1.);
 } else { // プレアデス（反射星雲のすじ）
  float den=0.;vec2 st[7];st[0]=vec2(.05,.02);st[1]=vec2(-.42,-.05);st[2]=vec2(.38,.18);st[3]=vec2(.24,.34);st[4]=vec2(.12,-.26);st[5]=vec2(.42,-.06);st[6]=vec2(-.5,.02);
  float cores=0.;for(int i=0;i<7;i++){vec2 d=p-st[i];den+=exp(-dot(d,d)*7.);float k=i<1?1.:.7;cores+=k*(exp(-dot(d,d)*2500.)*3.+exp(-dot(d,d)*120.)*.25+(exp(-abs(d.x)*260.)+exp(-abs(d.y)*260.))*exp(-length(d)*14.)*.5);}
  float stri=fbm(vec2(rot(p,.35).x*2.5,rot(p,.35).y*14.)+s+tt);den*=.25+stri*1.1;col=mix(uC1,uC2,stri)*den*1.4+vec3(.85,.92,1.)*cores;a=clamp(den*.9+cores,0.,1.)*smoothstep(1.1,.5,r);
 }
 a*=smoothstep(1.02,.86,max(abs(vUv.x-.5),abs(vUv.y-.5))*2.)*smoothstep(1.4,1.,length((vUv-.5)*2.));
 gl_FragColor=vec4(col*uGain,a);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  const NEBK={orion:0,carina:1,ring:2,helix:3,catseye:4,crab:5,eagle:6,horsehead:7,pleiades:8,fog:9};
  function nebFX(kind,size,c1,c2,c3,rot=0){const m=new THREE.ShaderMaterial({uniforms:{uSize:{value:size},uKind:{value:NEBK[kind]},uSeed:{value:R()*10},uTime:{value:0},uRot:{value:rot},uGain:{value:.62},uC1:{value:C(c1).convertSRGBToLinear()},uC2:{value:C(c2).convertSRGBToLinear()},uC3:{value:C(c3||c2).convertSRGBToLinear()}},
      vertexShader:BBVS,fragmentShader:NEBFS,transparent:true,depthWrite:false});
    const me=new THREE.Mesh(new THREE.PlaneGeometry(1,1),m);me.frustumCulled=false;anims.push(t=>m.uniforms.uTime.value=t);return me;}
  // 星（色温度・周辺減光・粒状斑）
  const STARFS=`uniform vec3 uCol;uniform float uTime,uGran,uSpots;varying vec2 vUv;varying vec3 vN;varying vec3 vW;${GLN}
void main(){vec3 n=normalize(vN);vec3 v=normalize(cameraPosition-vW);float mu=max(dot(n,v),0.);float limb=.35+.65*pow(mu,.55);
 vec2 uv=vUv*vec2(2.,1.);float g=fbm(uv*uGran+uTime*.02);float cell=1.-abs(nn(uv*uGran*1.7+uTime*.05)*2.-1.);
 float spot=uSpots*smoothstep(.72,.8,fbm(uv*6.+3.))*smoothstep(.45,.2,abs(vUv.y-.5));
 vec3 c=uCol*(.6+g*.6+cell*.3)*limb;c*=1.-spot*.85;c+=uCol*pow(1.-mu,3.)*.12;gl_FragColor=vec4(c*1.05,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  function starMesh(r,col,gran=40,spots=0,seg=64){const m=new THREE.ShaderMaterial({uniforms:{uCol:{value:C(col).convertSRGBToLinear()},uTime:{value:0},uGran:{value:gran},uSpots:{value:spots}},vertexShader:VS,fragmentShader:STARFS});anims.push(t=>m.uniforms.uTime.value=t);return sphere(r,m,seg);}
  // コロナ・光芒（ビルボード）
  const GLOWFS=`uniform vec3 uCol;uniform float uTime,uRays;varying vec2 vUv;${GLN}
void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float ang=atan(p.y,p.x);float st=pow(fbm(vec2(ang*3.,r*2.-uTime*.05)),2.)*uRays;
 float g=exp(-r*5.)*1.2+exp(-r*r*40.)*.8+st*exp(-r*2.5)*.8;float spike=uRays>.5?(exp(-abs(p.y)*90.)+exp(-abs(p.x)*90.))*exp(-r*2.)*.35:0.;
 gl_FragColor=vec4(uCol*(g+spike),clamp(g+spike,0.,1.)*smoothstep(1.,.7,r));
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  function glowBB(col,size,rays=1){const m=new THREE.ShaderMaterial({uniforms:{uSize:{value:size},uCol:{value:C(col).convertSRGBToLinear()},uTime:{value:0},uRays:{value:rays}},vertexShader:BBVS,fragmentShader:GLOWFS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
    const me=new THREE.Mesh(new THREE.PlaneGeometry(1,1),m);me.frustumCulled=false;anims.push(t=>m.uniforms.uTime.value=t);return me;}
  // 恒星：本体＋光芒（スペクトル型の色）
  const SPEC={O:"#9bb0ff",B:"#aabfff",A:"#cad7ff",F:"#f8f7ff",G:"#fff4ea",K:"#ffd2a1",M:"#ffb070"};
  function star(r,cls,glow=8,spots=0){const g=new THREE.Group();const c=SPEC[cls]||cls;g.add(starMesh(r,c,cls==="M"?14:40,spots));g.add(glowBB(c,r*glow,1));return g;}
  // ブラックホール：降着円盤（ドップラー効果で片側が明るい）＋重力レンズで回り込む円盤の像＋光子リング
  const DISKFS=`uniform float uTime,uIn,uOut;varying vec2 vUv;${GLN}
void main(){vec2 p=(vUv-.5)*2.;float r=length(p);if(r<uIn||r>uOut)discard;float ang=atan(p.y,p.x);float k=(r-uIn)/(uOut-uIn);
 float tex=fbm(vec2(ang*3.+uTime*(.6/(r+.2)),r*14.));float temp=pow(1.-k,1.6);vec3 hot=mix(vec3(1.,.42,.12),vec3(1.,.93,.82),temp);
 float beam=.45+.55*(.5+.5*sin(ang));float I=temp*(.4+tex*.9)*beam*smoothstep(0.,.08,k)*smoothstep(1.,.6,k);gl_FragColor=vec4(hot*I*2.6,clamp(I*1.6,0.,1.));
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  const LENSFS=`uniform float uTime,uIn,uOut;varying vec2 vUv;${GLN}
void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float ang=atan(p.y,p.x);float pr=exp(-pow((r-uIn*1.02)*90.,2.))*1.2;
 float arc=smoothstep(uIn*1.03,uIn*1.15,r)*smoothstep(uOut*.7,uIn*1.4,r)*(.35+.65*abs(sin(ang)));float tex=fbm(vec2(ang*4.-uTime*.4,r*12.));
 vec3 c=vec3(1.,.75,.45)*arc*(.3+tex)*1.4+vec3(1.,.92,.8)*pr;gl_FragColor=vec4(c,clamp(arc*.8+pr,0.,1.));
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  function blackHoleFX(r){const g=new THREE.Group();const sh=sphere(r,new THREE.MeshBasicMaterial({color:"#000"}),48);g.add(sh);
    const dm=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uIn:{value:.24},uOut:{value:1}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:DISKFS,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
    const disk=new THREE.Mesh(new THREE.PlaneGeometry(r*12,r*12),dm);disk.rotation.x=-Math.PI/2;g.add(disk);
    const lm=new THREE.ShaderMaterial({uniforms:{uSize:{value:r*5.6},uTime:{value:0},uIn:{value:.48},uOut:{value:1}},vertexShader:BBVS,fragmentShader:LENSFS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
    const lens=new THREE.Mesh(new THREE.PlaneGeometry(1,1),lm);lens.frustumCulled=false;lens.renderOrder=2;g.add(lens);
    anims.push(t=>{dm.uniforms.uTime.value=t;lm.uniforms.uTime.value=t;});return g;}
  // 銀河（円盤の面に、対数らせんの腕・棒・バルジ・暗黒帯・HII領域を描く）
  const GALFS=`uniform float uType,uArms,uPitch,uBulge,uDust,uSeed,uTime,uGain,uMinor,uRing;uniform vec3 uC1,uC2,uC3;varying vec2 vUv;${GLN}
void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float th=atan(p.y,p.x);vec2 s=vec2(uSeed*2.3,uSeed*1.1);float n=fbm(p*5.+s),n2=fbm(p*16.+s+3.);
 float bulge=exp(-pow(r/uBulge,2.));float core=exp(-pow(r/(uBulge*.3),2.));vec3 col=vec3(0.);float a=0.;
 if(uType<1.5){float rr=max(r,.02);float ph=th-log(rr/.1)/uPitch+uTime*.003;float w=(n-.5)*1.3;
  float arm=pow(.5+.5*cos(uArms*ph+w),3.);if(uMinor>.5)arm*=.5+.5*(.5+.5*cos(uArms*.5*ph+w));
  arm*=smoothstep(.04,.22,r)*smoothstep(1.,.5,r);
  if(uType>.5){vec2 bp=rot(p,.47);float bar=exp(-pow(bp.x/(uBulge*2.3),2.)-pow(bp.y/(uBulge*.6),2.));bulge=max(bulge,bar*.85);arm*=smoothstep(uBulge*1.5,uBulge*2.6,r);}
  float ring=uRing>0.?exp(-pow((r-uRing)/.07,2.))*(.5+n2):0.;
  float disk=exp(-r/.33)*smoothstep(1.,.75,r);float dust=pow(.5+.5*cos(uArms*ph+.85+(n2-.5)*2.4),7.)*smoothstep(.07,.3,r)*smoothstep(1.,.45,r)*uDust;dust=max(dust,ring*.0);
  float hii=smoothstep(.68,.88,n2)*(arm+ring)*1.2;
  vec3 st=uC1*(bulge*1.3+core*1.2)+uC2*disk*(.2+arm*1.5+ring*1.2)*(.55+n*.8);st+=uC3*hii*1.3;st*=1.-dust*.8;
  col=st;a=clamp(bulge+disk*(.35+arm)+hii+ring*disk,0.,1.);a=max(a,dust*disk*2.5);
 } else if(uType<2.5){float re=length(p*vec2(1.,1.18));float I=exp(-7.67*(pow(max(re,.001)/.3,.25)-1.))*.03;col=uC1*I*(.92+n*.12)+uC1*core*.6;a=clamp(I*1.6,0.,1.)*smoothstep(1.,.55,re);
 } else if(uType<3.5){float ring=exp(-pow((r-.62)/.13,2.));float dl=exp(-pow((r-.6)/.045,2.));col=uC1*(bulge*1.5+core)+uC2*ring*(.35+n*.6);col*=1.-dl*.85*uDust;a=clamp(bulge+ring*.55+dl*.7,0.,1.);
 } else if(uType<4.5){vec2 bp=rot(p,.3);float bar=exp(-pow(bp.x/.45,2.)-pow(bp.y/.13,2.));float pa=smoothstep(.35,.75,fbm(p*3.+s))*smoothstep(1.,.3,r);float hii=smoothstep(.72,.9,n2)*pa;vec2 tr=p-vec2(-.38,.18);float ta=exp(-dot(tr,tr)*50.);
  col=uC1*bar*1.2+uC2*pa*(.45+n)+uC3*(hii*1.4+ta*2.2);a=clamp(bar+pa*.7+hii+ta,0.,1.);
 } else {float rr=max(r,.02);float ph=th-log(rr/.1)/uPitch;float flo=smoothstep(.45,.8,fbm(vec2(ph*3.,r*8.)+s))*smoothstep(.05,.2,r)*smoothstep(1.,.45,r);float disk=exp(-r/.35);float hii=smoothstep(.72,.9,n2)*flo;
  vec2 g=p-vec2(.42,.25);float big=exp(-dot(g,g)*120.);col=uC1*(bulge*.6+core*.5)+uC2*disk*(.35+flo*1.3)+uC3*(hii*1.3+big*2.5);a=clamp(disk*(.5+flo)+hii+big+bulge*.5,0.,1.);}
 gl_FragColor=vec4(col*uGain,a*smoothstep(1.,.8,r));
 #include <tonemapping_fragment>
 #include <encodings_fragment>
}`;
  const GALT={spiral:0,barred:1,elliptical:2,sombrero:3,irregular:4,flocculent:5};
  function galFX(o){const m=new THREE.ShaderMaterial({uniforms:{uSize:{value:o.size},uType:{value:GALT[o.type]},uArms:{value:o.arms||2},uPitch:{value:o.pitch||.3},uBulge:{value:o.bulge||.12},uDust:{value:o.dust??.8},uSeed:{value:o.seed??R()*10},uTime:{value:0},uGain:{value:o.gain||1},uMinor:{value:o.minor||0},uRing:{value:o.ring||0},
      uC1:{value:C(o.c1||"#ffe2b8").convertSRGBToLinear()},uC2:{value:C(o.c2||"#b8ccff").convertSRGBToLinear()},uC3:{value:C(o.c3||"#ff6a9a").convertSRGBToLinear()}},
      vertexShader:o.bb?BBVS:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:GALFS,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:o.add?THREE.AdditiveBlending:THREE.NormalBlending});
    const me=new THREE.Mesh(o.bb?new THREE.PlaneGeometry(1,1):new THREE.PlaneGeometry(o.size,o.size),m);if(!o.bb)me.rotation.x=-Math.PI/2;me.frustumCulled=false;anims.push(t=>m.uniforms.uTime.value=t);return me;}
  // 銀河の星（腕に沿った点）
  function galStars(o){const N=o.n||20000,pos=[],col=[];const cA=C(o.c1||"#ffe2b8"),cB=C(o.c2||"#b8ccff"),cH=C(o.c3||"#ff6a9a");const Rr=o.size/2;
    for(let i=0;i<N;i++){let x,y,z,c;const u=R();
      if(o.type==="elliptical"){const r=Rr*.55*Math.pow(R(),2.2),a=R()*6.283,v=R()*2-1;x=Math.cos(a)*Math.sqrt(1-v*v)*r;z=Math.sin(a)*Math.sqrt(1-v*v)*r;y=v*r*.85;c=cA;}
      else if(u<.22){const r=Rr*(o.bulge||.12)*1.4*Math.pow(R(),1.6),a=R()*6.283,v=R()*2-1;x=Math.cos(a)*Math.sqrt(1-v*v)*r;z=Math.sin(a)*Math.sqrt(1-v*v)*r;y=v*r*.6;c=cA;}
      else{const k=Math.floor(R()*(o.arms||2));const rr=.12+Math.pow(R(),.8)*.82;let a=k*6.283/(o.arms||2)+Math.log(rr/.1)/(o.pitch||.3)+(R()-.5)*(o.type==="irregular"||o.type==="flocculent"?3:.55);
        if(o.type==="barred"&&rr<(o.bulge||.12)*2.4){const t=(R()*2-1);x=t*Rr*(o.bulge||.12)*2.3;z=(R()-.5)*Rr*(o.bulge||.12)*.9;const c0=Math.cos(.47),s0=Math.sin(.47);[x,z]=[x*c0+z*s0,-x*s0+z*c0];}
        else{x=Math.cos(a)*rr*Rr;z=Math.sin(a)*rr*Rr;}y=(R()-.5)*Rr*.02*(1+3*Math.exp(-rr*6));c=R()<.12?cH:R()<.55?cB:cA;}
      pos.push(x,y,-z);const b=.45+R()*.55;col.push(c.r*b,c.g*b,c.b*b);}
    return points(pos,null,o.ps||Rr*.012,.9,true,col);}
