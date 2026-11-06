import { useEffect, useState } from "react";
import { Play, Pause, X } from "lucide-react";
import { cities } from "./example";

export function MapLesson({ motion, close }: {motion: boolean; close: () => void}) {
  const [index,setIndex] = useState(0);
  const [play,setPlay] = useState(motion);
  const city = cities[index];
  useEffect(() => {
    if (!motion) setPlay(false);
  }, [motion]);
  useEffect(() => {
    if (!play) return;
    const timer = window.setTimeout(() => {
      if (index === cities.length-1) setPlay(false);
      else setIndex(index+1);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, [index,play]);
  return <section className="solar-lesson" aria-label="Demonstração da mudança de Casa">
    <div className="solar-row"><strong>Mesmo instante, outro horizonte</strong><button className="solar-round" onClick={close} aria-label="Fechar explicação"><X size={17}/></button></div>
    <p>Ana nasceu em São Paulo em 9 de agosto de 1987, à 1h. Neste exemplo, o retorno solar acontece em 8 de agosto de 2026, às 14h12 UTC. Ao trocar a cidade, o horizonte local muda. O Protocolo calcula em qual Casa natal cai o ascendente do retorno.</p>
    <div className="solar-diagram">
      <div className="solar-world"><img src="/earth-texture.jpg" alt="Mapa do mundo"/><i style={{left:((city.lon+180)/3.6)+"%",top:((90-city.lat)/1.8)+"%"}}/></div>
      <div className="solar-wheel" aria-hidden="true"><svg viewBox="-60 -60 120 120"><circle r="52" fill="none" stroke="#887752"/>{Array.from({length:12},(_,i)=><line key={i} x1="0" y1="-41" x2="0" y2="-52" transform={`rotate(${i*30})`} stroke="#ad9b77"/>)}<circle className="solar-marker" cx="0" cy="-46" r="5" style={{transform:`rotate(${(city.house-1)*30}deg)`}} fill="#ffe4a1"/></svg><b>{city.house}</b></div>
      <div><span className="solar-label">{city.name}</span><h3>Casa {city.house} · {city.topic}</h3><p>{city.text}</p></div>
    </div>
    <div className="solar-tabs">{cities.map((c,i)=><button key={c.name} aria-pressed={i===index} onClick={()=>{setIndex(i);setPlay(false);}}>{c.name}</button>)}
      {motion && <button onClick={()=>{if(!play && index===2)setIndex(0);setPlay(!play);}}>{play?<Pause size={15}/>:<Play size={15}/>} {play?"Pausar":"Reproduzir"}</button>}
    </div>
  </section>;
}
