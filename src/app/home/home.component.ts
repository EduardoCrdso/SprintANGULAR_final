import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CardDica {
  titulo: string;
  subtitulo: string;
  descricao: string;
  status: string;
  corStatus: string;
}

interface AulaUti {
  id: number;
  titulo: string;
  url: string;
  status: 'Pendente' | 'Assistido';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  menuAberto = false;
  mostrarBoasVindas = false;
  temaClaro = false;

  slides: CardDica[] = [];
  indiceAtivo = 0;
  timerCarrossel: any;
  animandoSlide = false;

  novaAulaTitulo = '';
  novaAulaUrl = '';
  listaAulas: AulaUti[] = [];

  bgImagens = [
    '/img/bg1.jpg',
    '/img/bg2.jpg',
    '/img/bg3.jpg'
  ];
  indexBg = 0;
  timerBg: any;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem('boas_vindas_vistas')) {
      this.mostrarBoasVindas = true;
      sessionStorage.setItem('boas_vindas_vistas', 'true');
    }

    const temaSalvo = localStorage.getItem('studyflow_tema');
    if (temaSalvo === 'claro') {
      this.temaClaro = true;
    }

    this.gerarSlidesDoCarrossel();
    this.carregarAulas();
    
    this.timerCarrossel = setInterval(() => {
      this.proximoSlide();
    }, 4000);

    this.timerBg = setInterval(() => {
      this.rotacionarFundo();
    }, 6000);
  }

  ngOnDestroy() {
    if (this.timerCarrossel) {
      clearInterval(this.timerCarrossel);
    }
    if (this.timerBg) {
      clearInterval(this.timerBg);
    }
  }

  toggleTema() {
    this.temaClaro = !this.temaClaro;
    localStorage.setItem('studyflow_tema', this.temaClaro ? 'claro' : 'escuro');
  }

  rotacionarFundo() {
    this.indexBg = (this.indexBg + 1) % this.bgImagens.length;
  }

  gerarSlidesDoCarrossel() {
    const dadosSalvos = localStorage.getItem('studyflow_dados');
    let dadosREAIS = [];

    if (dadosSalvos) {
      dadosREAIS = JSON.parse(dadosSalvos);
    }

    const totalHoras = dadosREAIS.reduce((acc: number, curr: any) => acc + (curr.horas || 0), 0);
    this.slides.push({
      titulo: 'Resumo Geral do StudyFlow',
      subtitulo: `Total acumulado: ${totalHoras} horas de dedicao`,
      descricao: 'Seu ecossistema esta sincronizado com o armazenamento local. Monitore suas metricas para evoluir.',
      status: 'Sincronizado',
      corStatus: '#10b981'
    });

    if (dadosREAIS.length > 0) {
      const pioresMaterias = dadosREAIS.filter((m: any) => m.aproveitamento < 60);
      
      pioresMaterias.forEach((m: any) => {
        this.slides.push({
          titulo: `Alerta de Revisao: ${m.materia}`,
          subtitulo: `Aproveitamento critico de apenas ${m.aproveitamento}%`,
          descricao: `Voce parou no assunto de "${m.assunto}". Seu volume de erros esta alto, sugerimos focar nesta disciplina hoje.`,
          status: 'Atencao Maxima',
          corStatus: '#ef4444'
        });
      });

      if (pioresMaterias.length === 0) {
        const melhorMateria = [...dadosREAIS].sort((a, b) => b.aproveitamento - a.aproveitamento)[0];
        this.slides.push({
          titulo: `Excelente Desempenho: ${melhorMateria.materia}`,
          subtitulo: `Aproveitamento recorde de ${melhorMateria.aproveitamento}%`,
          descricao: `Continue mantendo o ritmo no assunto de "${melhorMateria.assunto}". Seu rendimento esta excelente!`,
          status: 'Alto Nivel',
          corStatus: '#10b981'
        });
      }
    } else {
      this.slides.push({
        titulo: 'Nenhum dado cadastrado',
        subtitulo: 'Seu painel esta aguardando metricas',
        descricao: 'Va ate o menu e use o Dashboard para inserir suas materias, acertos e horas de estudo.',
        status: 'Aguardando',
        corStatus: '#f59e0b'
      });
    }
  }

  carregarAulas() {
    const salvas = localStorage.getItem('studyflow_aulas');
    if (salvas) {
      this.listaAulas = JSON.parse(salvas);
    } else {
      this.listaAulas = [
        { id: 1, titulo: 'Technical English for Web Developers', url: 'https://www.youtube.com', status: 'Pendente' }
      ];
      this.salvarAulas();
    }
  }

  adicionarAula() {
    if (!this.novaAulaTitulo.trim() || !this.novaAulaUrl.trim()) {
      return;
    }
    const novoId = this.listaAulas.length > 0 ? Math.max(...this.listaAulas.map(a => a.id)) + 1 : 1;
    this.listaAulas.push({
      id: novoId,
      titulo: this.novaAulaTitulo,
      url: this.novaAulaUrl,
      status: 'Pendente'
    });
    this.salvarAulas();
    this.novaAulaTitulo = '';
    this.novaAulaUrl = '';
  }

  alternarStatusAula(id: number) {
    const aula = this.listaAulas.find(a => a.id === id);
    if (aula) {
      aula.status = aula.status === 'Pendente' ? 'Assistido' : 'Pendente';
      this.salvarAulas();
    }
  }

  removerAula(id: number) {
    this.listaAulas = this.listaAulas.filter(a => a.id !== id);
    this.salvarAulas();
  }

  salvarAulas() {
    localStorage.setItem('studyflow_aulas', JSON.stringify(this.listaAulas));
  }

  proximoSlide() {
    if (this.animandoSlide) return;
    this.animandoSlide = true;
    setTimeout(() => {
      this.indiceAtivo = (this.indiceAtivo + 1) % this.slides.length;
      this.animandoSlide = false;
    }, 220);
  }

  slideAnterior() {
    if (this.animandoSlide) return;
    this.animandoSlide = true;
    setTimeout(() => {
      this.indiceAtivo = (this.indiceAtivo - 1 + this.slides.length) % this.slides.length;
      this.animandoSlide = false;
    }, 220);
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  esconderBoasVindas() {
    this.mostrarBoasVindas = false;
  }

  logout() {
    localStorage.removeItem('logado');
    this.router.navigate(['/']);
  }
}