const LIMITE = 200; //limite de índices no bucket
const IN = 900; //número de inserções lidas do arquivo

// ler o arquivo csv para a memória
const fs = require("fs");
let data = fs.readFileSync("output20.csv", "utf8");
data = data.split("\r\n");
for (let i in data) {
    data[i] = data[i].split(",");
    for (let j = 1; j < data[i].length; j++) {
        data[i][j] = parseInt(data[i][j]);
    }
}

function Tupla() {
    this.chave = 0;
    this.reg = [];
}

function Celula() {
    this.chave = '0';
    this.pnt = null; // ponteiro
}

function Bucket() {
    this.prfl = 1; // profundidade local
    this.dados = [];
}

function Diretorio() {
    this.prfg = 1; // profundidade global
    let a = new Celula();
    a.pnt = new Bucket();
    let b = new Celula();
    b.chave = '1';
    b.pnt = new Bucket();
    this.vetor = [a, b];
}

Diretorio.prototype.remover = function (key) {
    // transforma a chave em binário, pega os d últimos digitos
    let hash = key.toString(2)
    let hashed = hash.slice(-this.prfg);
    let dec = parseInt(hashed, 2);
    // percorre o vetor para encontrar o hash
    for (let i = 0; i < this.vetor.length; i++) {
        if (dec == parseInt(this.vetor[i].chave, 2)) {
            // se encontrar, percorre o bucket para encontrar e remover o registro desejado
            for (let a = 0; a < this.vetor[i].pnt.dados.length; a++) {
                if (this.vetor[i].pnt.dados[a].chave === key) {
                    this.vetor[i].pnt.dados.splice(a, 1);
                }
            }
        }
    }
    return 0;
}

Diretorio.prototype.pesquisa = function (key) {
    // transforma a chave em binário, pega os d últimos digitos
    let hash = key.toString(2)
    let hashed = hash.slice(-this.prfg);
    let dec = parseInt(hashed, 2);
    // percorre o diretório para encontrar o hash
    for (let i = 0; i < this.vetor.length; i++) {
        if (dec == parseInt(this.vetor[i].chave, 2)) {
            // se encontrar, percorre o bucket para encontrar o valor
            let j=0;
            for (q of this.vetor[i].pnt.dados) {
                if (q.chave === key) {
                    return this.vetor[i].pnt.dados[j];
                }
                j++;
            }
        }
    }
    return 0;
}
Diretorio.prototype.dobrarTamanho = function () {
    // dobrar o tamanho do vetor, duplicando as chaves
    tamanho = this.vetor.length;
    for (let i = 0; i < tamanho; i++) {
        const c = new Celula();
        c.chave = this.vetor[i].chave;
        c.pnt = this.vetor[i].pnt;
        this.vetor.push(c);
    }
    // adicionar 0 no começo das chaves na primeira metade
    tamanho = this.vetor.length / 2
    for (let i = 0; i < tamanho; i++) {
        const dec = this.vetor[i].chave.split('');
        dec.unshift('0');
        this.vetor[i].chave = dec.join('');
    }
    // adicionar 1 no começo das chaves na segunda metade
    for (let i = tamanho; i < this.vetor.length; i++) {
        const dec = this.vetor[i].chave.split('');
        dec.unshift('1');
        this.vetor[i].chave = dec.join('');
    }
}

Diretorio.prototype.dividirBucket = function (bucket, t, chave) {
    const novoBucket = []; // novo vetor para um bucket
    bucket.dados.push(t); // coloca o registro no bucket
    bucket.prfl++; // aumenta a profundidade local
    chave.replace('0', '1'); // troca o primeiro 0 por 1
    const chaveNova = parseInt(chave, 2);
    // percorre o bucket para encontrar quais registros passar para o novo bucket
    for (let i = 0; i < bucket.dados.length; i++) {
        let hashed = bucket.dados[i].chave.toString(2);
        let hash = hashed.slice(-this.prfg);
        let dec = parseInt(hash, 2);
        if (dec === chaveNova) {
            novoBucket.push(...bucket.dados.splice(i, 1));
        }
    }
    // encontra onde criar o novo bucket, e cria o novo bucket com o novo vetor
    for (let i = 0; i < this.vetor.length; i++) {
        if (chaveNova == parseInt(this.vetor[i].chave, 2)) {
            const b = new Bucket;
            b.prfl = bucket.prfl;
            b.dados = novoBucket;
            this.vetor[i].pnt = b;
        }
    }
}

Diretorio.prototype.inserir = function (t) {
    // transforma a chave em binário, pega os d últimos digitos
    // onde d é a profundidade global

    let hash = t.chave.toString(2);
    let hashed = hash.slice(-this.prfg);
    let dec = parseInt(hashed, 2);

    // percorre o diretório
    for (let i = 0; i < this.vetor.length; i++) {
        // se o hash é igual à chave do diretório no índice i
        if (dec == parseInt(this.vetor[i].chave, 2)) {
            // se o tamanho do bucket passar do limite, dobre o tamanho
            if (this.vetor[i].pnt.dados.length >= LIMITE) {
                if (this.vetor[i].pnt.prfl === this.prfg) {
                    this.prfg++;
                    this.dobrarTamanho();
                }
                this.dividirBucket(this.vetor[i].pnt, t, this.vetor[i].chave);
            // se não, coloque o registro no bucket
            } else {
                this.vetor[i].pnt.dados.push(t);
            }
        }
    }
}

const d = new Diretorio();
// rodando as inserções e remoções
for (let i = 0; i < IN; i++) {
    if (data[i][0] === '+') {
        data[i].splice(0, 1);
        const t = new Tupla();
        t.chave = data[i][0];
        data[i].shift();
        t.reg = data[i];
        d.inserir(t);
    } else {
        d.remover(data[i][1]);
    }
}

let p = d.pesquisa(1036);
console.log(p);

// for (let i = 0; i < d.vetor.length; i++) {
//     console.log(`[${d.vetor[i].chave}]`)
//     for (let k = 0; k < d.vetor[i].pnt.dados.length; k++) {
//         console.log(`        ${d.vetor[i].pnt.dados[k].chave}`);
//     }
// } 