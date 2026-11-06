import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Check, Compass, Globe2, Heart, Leaf, Moon, Pause, Play, Plus, RefreshCw, Sparkles, Sun, Users, Wallet, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DNA_MATRIX } from "@/data/dnaMatrix";
import { cities } from "./example";
import { OrbitSky } from "./OrbitSky";
import { MapLesson } from "./MapLesson";
import "./onboarding.css";

const priorities = [
  { id: "trabalho", label: "Carreira", goal: "avançar na carreira", Icon: Briefcase },
  { id: "amor", label: "Amor", goal: "fortalecer meus vínculos", Icon: Heart },
  { id: "dinheiro", label: "Dinheiro", goal: "organizar minhas finanças", Icon: Wallet },
  { id: "saude", label: "Saúde", goal: "cuidar da minha saúde", Icon: Leaf },
  { id: "identidade", label: "Identidade", goal: "começar de novo", Icon: Sun },
  { id: "networking", label: "Conexões", goal: "ampliar minha rede", Icon: Users },
  { id: "rotina", label: "Rotina", goal: "organizar meu dia", Icon: RefreshCw },
  { id: "espiritual", label: "Propósito", goal: "encontrar meu propósito", Icon: Moon },
];
const paths = [
  { id:"cidade", title:"Já escolhi a cidade", desc:"Veja qual Casa esse lugar ativa no seu mapa.", image:"paris", Icon:Globe2 },
  { id:"casa", title:"Quero explorar uma Casa", desc:"Escolha a Casa e descubra destinos ligados a ela.", image:"stars", Icon:Sun },
  { id:"intencao", title:"Sei o que quero viver", desc:"Parta de um objetivo para encontrar a Casa correspondente.", image:"particles", Icon:Compass },
];
const titles = ["Seu próximo ciclo","Lugar e Casa","Suas prioridades","Seu caminho","O cálculo","Seu relatório"];

function Film({ file, poster, motion }: {file:string;poster:string;motion:boolean}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const el=ref.current;
    if (!el) return;
    const sync=()=>{if(motion && !document.hidden) void el.play().catch(()=>{});else el.pause();};
    sync(); document.addEventListener("visibilitychange",sync);
    return ()=>document.removeEventListener("visibilitychange",sync);
  },[motion]);
  return <video ref={ref} muted playsInline loop preload={motion?"metadata":"none"} poster={poster} aria-hidden="true" src={file}/>;
}

export default function OnboardingV2() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [paused,setPaused] = useState(false);
  const motion = !reduced && !paused;
  const [step,setStep] = useState(1);
  const [chosen,setChosen] = useState<string[]>([]);
  const [path,setPath] = useState("");
  const [lesson,setLesson] = useState(false);
  const [focus,setFocus] = useState("");
  const heading=useRef<HTMLHeadingElement>(null);
  const selected=chosen.map(id=>priorities.find(p=>p.id===id)!);
  const current=selected.find(p=>p.id===focus) || selected[0] || priorities[1];
  useEffect(()=>{
    window.scrollTo(0,0); heading.current?.focus({preventScroll:true});
  },[step]);
  const advance=()=>{
    if(step<6){setStep(step+1);return;}
    localStorage.setItem("ps_onboarding_completed","true");
    if(user) navigate(`/?mode=futuro&path=${path}`);
    else {
      sessionStorage.setItem("ps_pending_mode","futuro");
      sessionStorage.setItem("ps_onboarding_v2_path",path);
      navigate("/auth?setup=true");
    }
  };
  const toggle=(id:string)=>setChosen(previous=>previous.includes(id)?previous.filter(x=>x!==id):previous.length<3?[...previous,id]:previous);
  const title=(text:string)=><h1 tabIndex={-1} ref={heading}>{text}</h1>;
  const nextDisabled=(step===3 && !chosen.length)||(step===4 && !path);
  return <main className={`solar-v2 solar-step-${step} ${motion?"":"solar-still"}`}>
    {step===1 && <div className="solar-earth"><Film motion={motion} file="/assets/vecteezy-earth.mp4" poster="/assets/earth-blue.jpg"/></div>}
    <header className="solar-top"><img className="solar-brand" src="/brand/protocolo-solar-logo-horizontal-4096.png" alt="Protocolo Solar"/>
      <div className="solar-top-actions">{!reduced && <button className="solar-round" aria-label={paused?"Ativar movimento":"Pausar movimento"} title={paused?"Ativar movimento":"Pausar movimento"} onClick={()=>setPaused(!paused)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>}
        <button className="solar-round" aria-label="Sair da prévia" title="Sair da prévia" onClick={()=>navigate("/")}><X size={17}/></button></div>
    </header>
    <div className="solar-stage" key={step}>
      {step===1 && <div className="solar-intro"><p className="solar-label"><Sun size={14}/> Revolução solar</p>
        {title("O que você quer viver depois do seu próximo aniversário?")}
        <p className="solar-lead">Explore como a cidade do seu aniversário muda o foco da sua leitura para o ano.</p></div>}
      {step===2 && <><div className="solar-heading"><p className="solar-label">O aniversário de Ana</p>{title("Uma pessoa. Três cidades.")}
        <p className="solar-lead">A data e a hora são as mesmas nas três leituras de Ana. O que muda é onde ela passa o aniversário.</p></div>
        <button className="solar-link" aria-expanded={lesson} onClick={()=>setLesson(!lesson)}><Play size={15}/> Ver como a cidade muda o mapa</button>
        {lesson && <MapLesson motion={motion} close={()=>setLesson(false)}/>}
        <div className="solar-cards">{cities.map(c=><article className="solar-card" key={c.name}><div className="solar-photo">
          <Film file={`/assets/${c.cover}.mp4`} poster={`/images/abertura/${c.cover}.jpg`} motion={motion&&!lesson}/>
          <span>{c.name}</span></div><div className="solar-card-copy"><div className="solar-label">Casa {c.house}</div><h2>{c.topic}</h2><p>{c.text}</p></div></article>)}</div></>}
      {step===3 && <div className="solar-picker"><p className="solar-label">Suas prioridades</p>{title("O que merece mais espaço no seu ano?")}
        <p className="solar-lead">Escolha de uma a três áreas. Você pode trocar suas escolhas antes de continuar.</p>
        <div className="solar-choices">{priorities.map(({id,label,Icon})=><button key={id} aria-pressed={chosen.includes(id)} disabled={chosen.length===3&&!chosen.includes(id)} onClick={()=>toggle(id)}><Icon size={21}/><span>{label}</span>{chosen.includes(id)?<Check size={16}/>:<Plus size={16}/>}</button>)}</div>
        <p className="solar-count" aria-live="polite">{chosen.length} de 3 selecionadas</p></div>}
      {step===4 && <><div className="solar-heading"><p className="solar-label">Seu ponto de partida</p>{title("Como você quer começar?")}<p className="solar-lead">Os três caminhos chegam ao mapa. Escolha pelo que você já sabe.</p></div>
        <div className="solar-cards">{paths.map(({id,title:label,desc,image,Icon})=><button className="solar-card solar-path" aria-pressed={id===path} onClick={()=>setPath(id)} key={id}>
          <div className="solar-photo"><Film file={`/assets/${image}.mp4`} poster={`/images/abertura/${image}.jpg`} motion={motion}/><i>{id===path?<Check size={18}/>:<Icon size={18}/>}</i></div>
          <div className="solar-card-copy"><h2>{label}</h2><p>{desc}</p>{id==="intencao"&&<small>Por exemplo, {current.goal}.</small>}</div></button>)}</div></>}
      {step===5 && <div className="solar-cosmos"><div><p className="solar-label"><Sparkles size={14}/> O cálculo</p>{title("Seu mapa começa com um instante.")}
        <p className="solar-lead">A cada ano, o Sol volta à posição que ocupava no seu nascimento. O horário é o mesmo em todo o planeta quando expresso em UTC.</p>
        <p className="solar-lead">O horizonte visto de cada cidade é diferente. É essa diferença que o Protocolo cruza com seu mapa natal para identificar a Casa em destaque.</p></div>
        <OrbitSky playing={motion}/></div>}
      {step===6 && <div className="solar-finale"><div className="solar-final-copy"><p className="solar-label">Exemplo de relatório</p>{title("E se Ana escolhesse Roma?")}
        <p className="solar-lead">Para Ana, Roma ativa a Casa 7, ligada a parcerias. Veja como o relatório interpreta essa mesma Casa pelo foco que você escolheu.</p>
        {selected.length>1 && <div className="solar-tabs" aria-label="Focos do exemplo">{selected.map(p=><button key={p.id} aria-pressed={p.id===current.id} onClick={()=>setFocus(p.id)}>{p.label}</button>)}</div>}
        <p className="solar-next">Ao começar seu mapa, usaremos os seus dados de nascimento.</p></div>
        <article className="solar-report"><div className="solar-photo"><Film file="/assets/roma.mp4" poster="/images/abertura/roma.jpg" motion={motion}/><span>Roma, Itália</span></div>
        <div className="solar-report-body"><div className="solar-orbit-line"><i/> Casa 7 · Parcerias</div><p className="solar-label">Foco em {current.label}</p><h2>Sua Essência</h2><p>{DNA_MATRIX[7][current.id].essencia}</p></div></article></div>}
    </div>
    <footer className="solar-nav"><div className="solar-nav-inner"><div className="solar-position">
      {step>1 && <button className="solar-round" onClick={()=>setStep(step-1)} aria-label="Voltar"><ArrowLeft size={17}/></button>}
      <div><div className="solar-counter">{step} de 6 <span>· {titles[step-1]}</span></div><div className="solar-progress" aria-hidden="true">{titles.map((t,i)=><i key={t} className={i<step?"on":""}/>)}</div></div></div>
      <button className="solar-primary" disabled={nextDisabled} onClick={advance}>{step===1?"Explorar":step===6?"Começar meu mapa":"Continuar"} <ArrowRight size={17}/></button></div></footer>
  </main>;
}
