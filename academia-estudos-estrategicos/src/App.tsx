import { useState } from 'react'
import { Compass, GraduationCap, Library, Award, Settings, Search, Bell, ChevronRight, Menu, X, Shield, Feather, Landmark, LogIn, CircleHelp } from 'lucide-react'
import { schools, ranks, lessons } from './data'
import { supabase, isSupabaseConfigured } from './lib/supabase'

type Tab = 'visao' | 'escolas' | 'biblioteca' | 'caderno' | 'distincoes'

const nav = [
  { id: 'visao' as Tab, label: 'Observatório', icon: Compass },
  { id: 'escolas' as Tab, label: 'Escolas de conhecimento', icon: GraduationCap },
  { id: 'biblioteca' as Tab, label: 'Biblioteca estratégica', icon: Library },
  { id: 'caderno' as Tab, label: 'Caderno de estudos', icon: Feather },
  { id: 'distincoes' as Tab, label: 'Distinções', icon: Award }
]

function App() {
  const [tab, setTab] = useState<Tab>('visao')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [note, setNote] = useState('')

  async function signIn() {
    if (!supabase) {
      setNotice('Configure as credenciais do Supabase no arquivo .env para ativar o acesso.')
      return
    }
    const { error } = await supabase.auth.signInWithOtp({ email })
    setNotice(error ? error.message : 'Enviamos um link de acesso para seu e-mail.')
  }

  const title = nav.find(n => n.id === tab)?.label ?? 'Observatório'

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><Shield size={25} strokeWidth={1.4}/></div>
        <div><div className="brand-name">ACADEMIA</div><div className="brand-sub">DE ESTUDOS ESTRATÉGICOS</div></div>
        <button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={18}/></button>
      </div>
      <div className="sidebar-rule"/>
      <div className="side-label">ÁREA DE ESTUDOS</div>
      <nav>{nav.map(item => {
        const Icon = item.icon
        return <button key={item.id} className={`nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => { setTab(item.id); setMobileMenu(false) }}>
          <Icon size={17} strokeWidth={1.6}/><span>{item.label}</span>{tab === item.id && <span className="nav-marker"/>}
        </button>
      })}</nav>
      <div className="sidebar-bottom">
        <div className="quote-mark">“</div>
        <p>A disciplina do pensamento precede a excelência da ação.</p>
        <span>— CADERNO DA ACADEMIA</span>
        <button className="nav-item muted" onClick={() => setNotice('Central de orientação acadêmica: conteúdo demonstrativo do MVP.')}><CircleHelp size={17}/> Orientação</button>
        <button className="nav-item muted" onClick={() => setNotice('Área de configurações em desenvolvimento.')}><Settings size={17}/> Configurações</button>
      </div>
      <div className="sidebar-foot">EDIÇÃO INAUGURAL <span>·</span> 2026</div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setMobileMenu(true)}><Menu size={20}/></button>
        <div className="breadcrumb">ACADEMIA <span>/</span> {title.toUpperCase()}</div>
        <div className="top-actions">
          <button className="icon-button" aria-label="Notificações" onClick={() => setNotice('Você está em dia com suas atividades acadêmicas.')}><Bell size={18}/></button>
          <div className="top-divider"/>
          <button className="profile-mini" onClick={() => setShowLogin(true)}><span className="avatar">A</span><span>ACESSO DO ALUNO</span></button>
        </div>
      </header>

      <div className="content">
        {notice && <div className="notice"><span>{notice}</span><button onClick={() => setNotice('')}>×</button></div>}
        {tab === 'visao' && <Overview onOpen={setTab} onLogin={() => setShowLogin(true)}/>}
        {tab === 'escolas' && <Schools/>}
        {tab === 'biblioteca' && <LibraryView/>}
        {tab === 'caderno' && <Notebook note={note} setNote={setNote}/>}
        {tab === 'distincoes' && <Distinctions/>}
      </div>
      <footer className="footer"><span>ACADEMIA DE ESTUDOS ESTRATÉGICOS</span><span>CONHECIMENTO · DISCIPLINA · PENSAMENTO CRÍTICO</span></footer>
    </main>

    {showLogin && <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowLogin(false)}><X size={18}/></button>
        <div className="brand-mark modal-mark"><Shield size={25}/></div>
        <p className="eyebrow">PORTAL ACADÊMICO</p><h2>Ingresso na Academia</h2>
        <p className="muted-copy">Acesse sua área de estudos por um link seguro enviado ao seu e-mail.</p>
        <label>Endereço de e-mail</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="seu@email.com"/>
        <button className="gold-button full" onClick={signIn}><LogIn size={16}/> Solicitar acesso</button>
        {notice && <p className="form-notice">{notice}</p>}
        {!isSupabaseConfigured && <p className="form-hint">Modo de demonstração: autenticação será ativada após conectar o projeto Supabase.</p>}
      </div>
    </div>}
  </div>
}

function PageHeading({ kicker, title, description }: { kicker: string, title: string, description: string }) {
  return <div className="page-heading"><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{description}</p></div>
}

function Overview({ onOpen, onLogin }: { onOpen: (tab: Tab) => void, onLogin: () => void }) {
  return <>
    <section className="hero">
      <div className="hero-text">
        <div className="eyebrow light">INSTITUTO DE FORMAÇÃO INTELECTUAL</div>
        <h1>O estudo da guerra.<br/><em>A compreensão do mundo.</em></h1>
        <p>Um percurso de formação em teoria militar, filosofia, história e pensamento estratégico — orientado pela investigação rigorosa e pelo pensamento crítico.</p>
        <button className="gold-button" onClick={() => onOpen('escolas')}>Explorar as escolas <ChevronRight size={16}/></button>
      </div>
      <div className="hero-seal"><div className="seal-ring"><span>AE</span><small>STUDIUM · STRATEGIA</small></div><div className="seal-caption">SAPIENTIA ET DISCIPLINA</div></div>
      <div className="hero-index">01 <span>—</span> 06</div>
    </section>

    <section className="rank-strip">
      <div className="rank-symbol"><span>III</span></div>
      <div className="rank-info"><span className="eyebrow">DISTINÇÃO ACADÊMICA ATUAL</span><strong>Cabo <small>· Nível demonstrativo</small></strong><span className="rank-next">Próxima graduação: 3º Sargento</span></div>
      <div className="rank-progress"><div className="progress-label"><span>PROGRESSO DO CICLO</span><strong>72%</strong></div><div className="progress-track"><div style={{width:'72%'}}/></div><small>720 / 1.000 pontos ilustrativos</small></div>
      <button className="text-link" onClick={() => onOpen('distincoes')}>Ver distinções <ChevronRight size={15}/></button>
    </section>

    <div className="section-heading"><div><div className="eyebrow">CARTOGRAFIA DO CONHECIMENTO</div><h2>Seis escolas. Um percurso intelectual.</h2></div><button className="text-link" onClick={() => onOpen('escolas')}>Ver todas <ChevronRight size={15}/></button></div>
    <section className="school-grid">{schools.map((s) => <button className="school-card" key={s.id} onClick={() => onOpen('escolas')}>
      <div className="school-top"><span>{s.number}</span><span className="school-glyph">{s.icon}</span></div><h3>{s.title}</h3><p>{s.subtitle}</p><div className="school-bottom"><span>{s.lessons} estudos</span><span>{s.progress ? `${s.progress}% iniciado` : 'Disponível'}</span></div><div className="mini-track"><div style={{width:`${s.progress}%`}}/></div>
    </button>)}</section>

    <div className="section-heading lower"><div><div className="eyebrow">ROTEIRO DE ESTUDOS</div><h2>Leituras em destaque</h2></div><button className="text-link" onClick={() => onOpen('biblioteca')}>Abrir biblioteca <ChevronRight size={15}/></button></div>
    <section className="reading-list">{lessons.map((l, i) => <div className="reading-row" key={l.title}><div className="reading-no">0{i+1}</div><div className="reading-main"><span>{l.school}</span><strong>{l.title}</strong></div><div className="reading-meta">{l.type}<br/><small>{l.duration}</small></div><div className="reading-status">{l.status}</div><ChevronRight size={17}/></div>)}</section>
    <div className="callout"><div><span className="eyebrow">UM CONVITE À INVESTIGAÇÃO</span><h3>O conhecimento exige método.<br/><em>O pensamento exige liberdade.</em></h3></div><button className="outline-button" onClick={onLogin}>Ingressar na Academia</button></div>
  </>
}

function Schools() {
  return <><PageHeading kicker="ESTRUTURA CURRICULAR" title="Escolas de conhecimento" description="Seis campos de investigação organizam o percurso formativo. Cada escola reúne cursos, leituras dirigidas, seminários e avaliações."/>
    <div className="school-list">{schools.map(s => <article className="school-detail" key={s.id}><div className="detail-number">{s.number}</div><div className="detail-body"><h2>{s.title}</h2><p>{s.subtitle}</p><div className="detail-meta"><span>{s.lessons} unidades previstas</span><span>Formação progressiva</span></div></div><div className="detail-progress"><div className="mini-track"><div style={{width:`${s.progress}%`}}/></div><small>{s.progress ? `${s.progress}% iniciado` : 'Ainda não iniciado'}</small></div><ChevronRight size={18}/></article>)}</div>
    <div className="editorial-note"><Landmark size={23}/><p><strong>Princípio pedagógico.</strong> A formação privilegia a leitura de fontes, a compreensão histórica, a análise conceitual e a argumentação. Os estudos militares são tratados em perspectiva acadêmica, ética e crítica.</p></div>
  </>
}

function LibraryView() {
  const books = [
    ['Da Guerra','Carl von Clausewitz','Teoria militar · Clássico'],
    ['A Arte da Guerra','Sun Tzu','Estratégia · Antiguidade'],
    ['The Federalist Papers','Hamilton, Madison e Jay','Filosofia política · Constitucionalismo'],
    ['Ensaios','Michel de Montaigne','Ensaísmo · Filosofia'],
    ['O ensaio como forma','Theodor W. Adorno','Teoria do ensaio · Estética'],
    ['Entre o passado e o futuro','Hannah Arendt','Filosofia política · Modernidade']
  ]
  return <><PageHeading kicker="ACERVO E LEITURA" title="Biblioteca estratégica" description="Um acervo curado de obras fundamentais para compreender a guerra, o poder, as instituições e a formação do pensamento."/>
    <div className="library-tools"><div className="searchbox"><Search size={17}/><input placeholder="Pesquisar por obra, autor ou tema"/></div><span>ACERVO INAUGURAL · 06 REFERÊNCIAS</span></div>
    <div className="book-grid">{books.map((b,i) => <article className="book-card" key={b[0]}><div className={`book-cover cover-${i+1}`}><span>ACADEMIA<br/>ESTRATÉGICA</span><strong>{b[0]}</strong><small>{b[1]}</small><i>✦</i></div><div className="book-meta"><span>{b[2]}</span><strong>{b[0]}</strong><small>{b[1]}</small></div></article>)}</div>
    <p className="small-note">O catálogo inicial apresenta referências bibliográficas. Arquivos integrais serão disponibilizados somente quando houver autorização ou domínio público.</p>
  </>
}

function Notebook({ note, setNote }: { note: string, setNote: (v:string)=>void }) {
  return <><PageHeading kicker="ESCRITA E REFLEXÃO" title="Caderno de estudos" description="Um espaço para registrar perguntas, argumentos, citações e hipóteses que surgem durante a leitura."/>
    <div className="notebook"><div className="notebook-head"><span>FOLHA DE TRABALHO Nº 001</span><span>ANOTAÇÕES PESSOAIS</span></div><label>Título ou questão de investigação</label><input placeholder="Ex.: A natureza política da guerra"/><label>Notas e reflexões</label><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Registre aqui suas ideias, perguntas, argumentos e referências..."/><div className="notebook-foot"><span>Rascunho local desta demonstração</span><button className="gold-button" onClick={()=>alert('Na versão conectada, suas notas serão salvas com segurança no seu perfil.')}>Guardar anotação</button></div></div>
    <div className="editorial-note"><Feather size={22}/><p>O caderno será ampliado para permitir relacionar anotações a aulas, obras e projetos de ensaio. A persistência em nuvem será ativada na integração com o Supabase.</p></div>
  </>
}

function Distinctions() {
  return <><PageHeading kicker="PROGRESSÃO ACADÊMICA" title="Distinções e carreira de estudos" description="A hierarquia é uma metáfora educacional. Cada graduação reconhece etapas de aprendizagem e produção intelectual, sem equivalência com posto ou patente militar real."/>
    <div className="distinction-intro"><div className="large-insignia">III</div><div><span className="eyebrow">GRADUAÇÃO DEMONSTRATIVA</span><h2>Cabo</h2><p>O percurso de exemplo está no terceiro nível da carreira acadêmica.</p></div></div>
    <div className="rank-grid">{ranks.map((r,i)=><div className={`rank-card ${i<3?'earned':''}`} key={r}><span className="rank-level">NÍVEL {String(i+1).padStart(2,'0')}</span><div className="rank-emblem">{['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'][i]}</div><strong>{r}</strong><small>{i<3?'Conquista demonstrativa':'Etapa futura'}</small></div>)}</div>
    <div className="editorial-note"><Award size={23}/><p>As promoções reais dependerão de critérios publicados: conclusão de módulos, avaliações, leituras verificadas e trabalhos autorais. Pontuação isolada não substitui aprovação acadêmica.</p></div>
  </>
}

export default App
