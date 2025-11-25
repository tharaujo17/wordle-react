export class Player {
  constructor(id, nome, socketId) {
    this.id = id;
    this.nome = nome;
    this.socketId = socketId;
    this.pontos = 0;
    this.palavrasAcertadas = [];
    this.acertou = false;
    this.connected = true;
  }

  adicionarVitoria(palavra) {
    this.pontos++;
    this.palavrasAcertadas.push(palavra);
    this.acertou = true;
  }

  resetRodada() {
    this.acertou = false;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      pontos: this.pontos,
      palavrasAcertadas: this.palavrasAcertadas,
      acertou: this.acertou,
      connected: this.connected,
    };
  }
}