import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

interface RegistroEstudo {
  id: number;
  materia: string;
  assunto: string;
  questoes: number;
  acertos: number;
  erros: number;
  horas: number;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  aproveitamento: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  listaEstudos: RegistroEstudo[] = [];
  menuAberto = false;

  idEmEdicao: number | null = null;
  materiaInput = '';
  assuntoInput = '';
  questoesInput: number | null = null;
  acertosInput: number | null = null;
  horasInput: number | null = null;

  bgImagens = [
    '/img/dash1.jpg',
    '/img/dash2.jpg'
  ];
  indexBg = 0;
  timerBg: any;

  dicas = [
    'Dividir o estudo em blocos de 25 minutos (Pomodoro) mantém o foco e a produtividade em níveis constantes.',
    'Estudar através de questões força o aprendizado ativo, fixando o conteúdo com muito mais eficiência que apenas reler materiais.',
    'Revisar seu histórico de desempenho ajuda a identificar quais matérias exigem mais atenção antes que elas se tornem um problema.',
    'Ambiente organizado é metade da produtividade; elimine distrações visuais para melhorar sua capacidade de memorização.'
  ];
  indiceDica = 0;
  timerDicas: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const dadosSalvos = localStorage.getItem('studyflow_dados');
    if (dadosSalvos) {
      this.listaEstudos = JSON.parse(dadosSalvos);
    } else {
      this.listaEstudos = [
        { id: 1, materia: 'Lógica de Programação', assunto: 'Arrays e Loops', questoes: 20, acertos: 8, erros: 12, horas: 2, prioridade: 'Alta', aproveitamento: 40 },
        { id: 2, materia: 'Programação Front-End', assunto: 'Componentes Angular', questoes: 15, acertos: 12, erros: 3, horas: 3, prioridade: 'Baixa', aproveitamento: 80 }
      ];
      this.salvarNoStorage();
    }

    this.timerBg = setInterval(() => {
      this.rotacionarFundo();
    }, 6000);

    this.timerDicas = setInterval(() => {
      this.indiceDica = (this.indiceDica + 1) % this.dicas.length;
    }, 12000);
  }

  ngOnDestroy() {
    if (this.timerBg) {
      clearInterval(this.timerBg);
    }
    if (this.timerDicas) {
      clearInterval(this.timerDicas);
    }
  }

  rotacionarFundo() {
    this.indexBg = (this.indexBg + 1) % this.bgImagens.length;
  }

  get totalQuestoes() {
    return this.listaEstudos.reduce((acc, item) => acc + (item.questoes || 0), 0);
  }

  get totalAcertos() {
    return this.listaEstudos.reduce((acc, item) => acc + (item.acertos || 0), 0);
  }

  get totalErros() {
    return this.listaEstudos.reduce((acc, item) => acc + (item.erros || 0), 0);
  }

  get totalHoras() {
    return this.listaEstudos.reduce((acc, item) => acc + (item.horas || 0), 0);
  }

  get aproveitamentoGeral() {
    const total = this.totalQuestoes;
    return total > 0 ? Math.round((this.totalAcertos / total) * 100) : 0;
  }

  get strokeDashArray() {
    const pct = this.aproveitamentoGeral;
    return `${pct} ${100 - pct}`;
  }

  salvarEstudo() {
    if (!this.materiaInput || !this.assuntoInput || !this.questoesInput || this.acertosInput === null) {
      alert('Por favor, preencha os campos de matéria, assunto e questões.');
      return;
    }

    const questoes = Number(this.questoesInput);
    const acertos = Number(this.acertosInput);
    
    if (acertos > questoes) {
      alert('O número de acertos não pode ser maior que o de questões feitas!');
      return;
    }

    const erros = questoes - acertos;
    const aproveitamento = questoes > 0 ? Math.round((acertos / questoes) * 100) : 0;
    
    let prioridade: 'Alta' | 'Média' | 'Baixa' = 'Média';
    if (aproveitamento < 50) prioridade = 'Alta';
    else if (aproveitamento >= 75) prioridade = 'Baixa';

    if (this.idEmEdicao !== null) {
      const item = this.listaEstudos.find(e => e.id === this.idEmEdicao);
      if (item) {
        Object.assign(item, { materia: this.materiaInput, assunto: this.assuntoInput, questoes, acertos, erros, horas: Number(this.horasInput || 0), prioridade, aproveitamento });
      }
      this.idEmEdicao = null;
    } else {
      const novoId = this.listaEstudos.length > 0 ? Math.max(...this.listaEstudos.map(e => e.id)) + 1 : 1;
      this.listaEstudos.push({ id: novoId, materia: this.materiaInput, assunto: this.assuntoInput, questoes, acertos, erros, horas: Number(this.horasInput || 0), prioridade, aproveitamento });
    }

    this.salvarNoStorage();
    this.limparFormulario();
  }

  carregarEdicao(item: RegistroEstudo) {
    this.idEmEdicao = item.id;
    this.materiaInput = item.materia;
    this.assuntoInput = item.assunto;
    this.questoesInput = item.questoes;
    this.acertosInput = item.acertos;
    this.horasInput = item.horas;
  }

  excluirEstudo(id: number) {
    this.listaEstudos = this.listaEstudos.filter(e => e.id !== id);
    this.salvarNoStorage();
  }

  salvarNoStorage() {
    localStorage.setItem('studyflow_dados', JSON.stringify(this.listaEstudos));
  }

  limparFormulario() {
    this.idEmEdicao = null;
    this.materiaInput = '';
    this.assuntoInput = '';
    this.questoesInput = null;
    this.acertosInput = null;
    this.horasInput = null;
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  logout() {
    localStorage.removeItem('logado');
    this.router.navigate(['/']);
  }
}
