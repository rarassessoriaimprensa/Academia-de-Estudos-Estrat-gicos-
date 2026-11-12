export const schools = [
  { id: 'teoria', number: 'I', title: 'Teoria Militar', subtitle: 'Fundamentos, doutrina e pensamento estratégico', icon: '⌖', lessons: 18, progress: 42 },
  { id: 'filosofia', number: 'II', title: 'Filosofia Militar', subtitle: 'Guerra, ética, poder e condição humana', icon: '◈', lessons: 16, progress: 18 },
  { id: 'historia', number: 'III', title: 'História Militar', subtitle: 'Transformações, conflitos e instituições', icon: '▤', lessons: 22, progress: 0 },
  { id: 'geopolitica', number: 'IV', title: 'Geopolítica e Estratégia', subtitle: 'Território, poder e relações internacionais', icon: '◎', lessons: 14, progress: 0 },
  { id: 'politica', number: 'V', title: 'Filosofia Política', subtitle: 'Estado, soberania, liberdade e legitimidade', icon: '⚖', lessons: 15, progress: 0 },
  { id: 'ensaio', number: 'VI', title: 'Pensamento e Ensaísmo', subtitle: 'Leitura crítica e produção intelectual', icon: '✒', lessons: 12, progress: 0 }
]

export const ranks = [
  'Recruta','Soldado','Cabo','3º Sargento','2º Sargento','1º Sargento','Subtenente',
  'Aspirante','2º Tenente','1º Tenente','Capitão','Major','Tenente-Coronel','Coronel','General'
]

export const lessons = [
  { school: 'Teoria Militar', title: 'O que é teoria militar?', type: 'Aula inaugural', duration: '18 min', status: 'Em andamento' },
  { school: 'Filosofia Militar', title: 'A natureza da guerra: problema filosófico', type: 'Leitura orientada', duration: '25 min', status: 'Próxima leitura' },
  { school: 'Pensamento e Ensaísmo', title: 'Montaigne e a investigação ensaística', type: 'Seminário', duration: '32 min', status: 'Recomendado' }
]
