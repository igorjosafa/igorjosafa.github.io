class Game {
  constructor(nameId, title, key) {
    this.nameId = nameId;
    this.key = key;
    this.title = title + ` - ${this.key}`;
    this.acertos = 0;
    this.questions = 0;
    this.totalPercentage = 0.0;
    this.possibleAnswersScore = {
        'FirstDegree': 0,
        'SecondDegree': 0,
        'ThirdDegree': 0,
        'FourthDegree': 0,
        'FifthDegree': 0,
        'SixthDegree': 0,
        'SeventhDegree': 0
    };
    this.possibleAnswersCount = {
        'FirstDegree': 0,
        'SecondDegree': 0,
        'ThirdDegree': 0,
        'FourthDegree': 0,
        'FifthDegree': 0,
        'SixthDegree': 0,
        'SeventhDegree': 0
    };
    this.percentageCorrectAnswers = {
        'FirstDegree': 0.0,
        'SecondDegree': 0.0,
        'ThirdDegree': 0.0,
        'FourthDegree': 0.0,
        'FifthDegree': 0.0,
        'SixthDegree': 0.0,
        'SeventhDegree': 0.0
    };
    this.notesDegrees = [];
    this.notesToGuess = [];
    this.notesIndex = [];
    this.considerAnswerToScore = [];
    this.howManyNotes = 1;
    this.noteToCheck = 0;
    this.correctAnswer = false;
    this.#updateSelectNoteToCheckElements();

    document.getElementById(`${this.nameId}Title`).textContent = this.title;
  }

  updateNoteToCheck(noteToCheck) {
    this.noteToCheck = noteToCheck;
    this.#updateSelectNoteToCheckElements();
  }

  updateNumberOfNotes(howManyNotes) {
    this.howManyNotes = howManyNotes;
    this.#updateSelectNoteToCheckElements();
  }

  #updateSelectNoteToCheckElements() {
    const container = document.getElementById(`${this.nameId}SelectNoteToCheck`);
    container.innerHTML = '';
    const table = document.createElement("table");
    table.border = 1;
    
    const headerRow = document.createElement("tr");
    const radioRow = document.createElement("tr");

    for (let i = 0; i < this.howManyNotes; i++) {
        // cabeçalho
        const th = document.createElement("th");

        // wrapper flexível
        const headerContent = document.createElement("div");
        headerContent.style.display = "flex";
        headerContent.style.alignItems = "center";
        headerContent.style.justifyContent = "space-between";
        headerContent.style.gap = "6px"; // espaço entre texto e botão
        headerContent.style.whiteSpace = "nowrap"; // evita quebrar linha

        const label = document.createElement("span");
        label.innerText = `${i + 1}ª Nota`;
        headerContent.appendChild(label);

        if (i === this.noteToCheck) {
            const playNoteButton = document.createElement("button");
            playNoteButton.innerText = "Tocar";
            playNoteButton.onclick = () => {
                this.playNoteToGuess();
            };
            headerContent.appendChild(playNoteButton);
        }

        th.appendChild(headerContent);
        headerRow.appendChild(th);

        // input radio
        const td = document.createElement("td");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "how-many-notes";
        radio.onclick = () => guessNoteDegreeGame.updateNoteToCheck(i);
        if (i === this.noteToCheck) {
            radio.checked = true;
        }
        td.appendChild(radio);
        radioRow.appendChild(td);
    }


    table.appendChild(headerRow);
    table.appendChild(radioRow);
    container.appendChild(table);
    }

  #getRandomNote() {
    const possibleNotes = this.key.extendedScale;
    let leastNote = 0;
    let mostNote = 20;
    let index = Math.floor(Math.random() * possibleNotes.length);
    if (index < 7) {
        leastNote = 0;
        mostNote = 6;
    } else if (index < 14) {
        leastNote = 7;
        mostNote = 13;
    } else if (index < 21) {
        leastNote = 14;
        mostNote = 20;
    }

    this.notesIndex = [index];
    this.notesToGuess = [possibleNotes[index]];
    this.considerAnswerToScore = [true];
    for (let i=1; i<this.howManyNotes; i++) {
        let index = Math.floor(Math.random() * possibleNotes.length)
        while (index < leastNote || index > mostNote) {
            index = Math.floor(Math.random() * possibleNotes.length);
        }
        this.notesIndex.push(index);
        this.notesToGuess.push(possibleNotes[index]);
        this.considerAnswerToScore.push(true);
    }
  }

  #getAnswerDegree() {
    this.notesDegrees = []
    this.notesIndex.forEach((noteIndex) => {
        if (noteIndex === 0 || noteIndex === 7 || noteIndex === 14 || noteIndex === 21) {
            this.notesDegrees = this.notesDegrees.concat(['FirstDegree']);
        } else if (noteIndex ===  1 || noteIndex === 8 || noteIndex === 15) {
            this.notesDegrees = this.notesDegrees.concat(['SecondDegree']);
        } else if (noteIndex === 2 || noteIndex === 9 || noteIndex === 16) {
            this.notesDegrees = this.notesDegrees.concat(['ThirdDegree']);
        } else if (noteIndex === 3 || noteIndex === 10 || noteIndex === 17) {
            this.notesDegrees = this.notesDegrees.concat(['FourthDegree']);
        } else if (noteIndex === 4 || noteIndex === 11 || noteIndex === 18) {
            this.notesDegrees = this.notesDegrees.concat(['FifthDegree']);
        } else if (noteIndex === 5 || noteIndex === 12 || noteIndex === 19) {
            this.notesDegrees = this.notesDegrees.concat(['SixthDegree']);
        } else if (noteIndex === 6 || noteIndex === 13 || noteIndex === 20) {
            this.notesDegrees = this.notesDegrees.concat(['SeventhDegree']);
        }
        
    });
  }

  #endPreviousRound() {
    this.#cleanGuessResult();
    if (this.notesToGuess.length > 0) {
        this.#updateScore();
    }
  }

  #selectNewNote() {
    this.#getRandomNote();
    this.#getAnswerDegree();
    this.considerAnswerToScore[this.noteToCheck] = true;

  }

  beginRound() {
    this.#endPreviousRound();
    this.#selectNewNote();
    this.playNotesToGuess();
  }

  checkNoteAnswer(guessedDegree) {
    this.correctAnswer = (guessedDegree === this.notesDegrees[this.noteToCheck]);

    if (this.considerAnswerToScore[this.noteToCheck]) {
        this.questions += 1;
        this.possibleAnswersCount[this.notesDegrees[this.noteToCheck]] += 1;
        if (this.correctAnswer) {
            if (this.correctAnswer) {
                this.possibleAnswersScore[this.notesDegrees[this.noteToCheck]] += 1;
                this.acertos += 1;
            }
        }
        this.totalPercentage = this.acertos / this.questions
        this.percentageCorrectAnswers[this.notesDegrees[this.noteToCheck]] = (
            this.possibleAnswersScore[this.notesDegrees[this.noteToCheck]] / this.possibleAnswersCount[this.notesDegrees[this.noteToCheck]])
    }

    this.#showGuessResult();
    this.considerAnswerToScore[this.noteToCheck] = false;

  }

  #cleanGuessResult() {
    document.getElementById(`${this.nameId}GuessedAnswer`).textContent = ``;
  }


  #showGuessResult() {
    if (this.correctAnswer) {
        document.getElementById(`${this.nameId}GuessedAnswer`).textContent = `Resposta Correta! A nota sorteada foi ${this.notesToGuess[this.noteToCheck].name}.`;
    } else {
        document.getElementById(`${this.nameId}GuessedAnswer`).textContent = `Resposta Errada!`;
    }
  }

  #updateScore() {
    this.notesDegrees.forEach((degree) => {
        document.getElementById(`${this.nameId}${degree}Score`).textContent = this.possibleAnswersScore[degree];
        document.getElementById(`${this.nameId}${degree}Total`).textContent = this.possibleAnswersCount[degree]
        document.getElementById(`${this.nameId}${degree}Percentual`).textContent = this.percentageCorrectAnswers[degree].toFixed(2) + '%';

        document.getElementById(`${this.nameId}TotalScore`).textContent = this.acertos;
        document.getElementById(`${this.nameId}TotalGuesses`).textContent = this.questions;
        document.getElementById(`${this.nameId}TotalPercentual`).textContent = this.totalPercentage.toFixed(2) + '%';
    });
    
  }

  playNoteToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;

      this.notesToGuess[this.noteToCheck].play(player, volume, duration);
  }

  playNotesToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;

      this.notesToGuess.forEach((note, index) => {
        setTimeout(() => {
            note.play(player, volume, duration);
        }, index * duration * 1000);
      });
  }

  playScaleUpToNoteToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;
      let notes;

      if (this.notesIndex[this.noteToCheck] <= 6) {
        notes = this.key.extendedScale.slice(0, this.notesIndex[this.noteToCheck] + 1);
      } else if (this.notesIndex[this.noteToCheck] <= 13) {
        notes = this.key.extendedScale.slice(7, this.notesIndex[this.noteToCheck] + 1);
      } else {
        notes = this.key.extendedScale.slice(14, this.notesIndex[this.noteToCheck] + 1);
      }
      notes.forEach((note, index) => {
        setTimeout(() => {
            note.play(player, volume, duration);
        }, index * duration * 1000);
      });
  }

  playScaleUpFromNoteToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;
      let notes;

      if (this.notesIndex[this.noteToCheck] <= 6) {
        notes = this.key.extendedScale.slice(this.notesIndex[this.noteToCheck], 8);
      } else if (this.notesIndex[this.noteToCheck] <= 13) {
        notes = this.key.extendedScale.slice(this.notesIndex[this.noteToCheck], 15);
      } else {
        notes = this.key.extendedScale.slice(this.notesIndex[this.noteToCheck], 22);
      }
      notes.forEach((note, index) => {
        setTimeout(() => {
            note.play(player, volume, duration);
        }, index * duration * 1000);
      });
  }

  playScaleDownFromNoteToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;
      let notes = [];

      if (this.notesIndex[this.noteToCheck] <= 7) {
        for (let i=this.notesIndex[this.noteToCheck]; i>=0; i--) {
            notes = notes.concat(this.key.extendedScale[i])
        }
      } else if (this.notesIndex[this.noteToCheck] <= 14) {
        for (let i=this.notesIndex[this.noteToCheck]; i>=7; i--) {
            notes = notes.concat(this.key.extendedScale[i])
        }
      } else {
        for (let i=this.notesIndex[this.noteToCheck]; i>=15; i--) {
            notes = notes.concat(this.key.extendedScale[i])
        }
      }
      notes.forEach((note, index) => {
        setTimeout(() => {
            note.play(player, volume, duration);
        }, index * duration * 1000);
      });
  }

  playBaseChord() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationBaseChord`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;
      this.key.harmonicField.chords[0].play(window.player, volume, duration);
    }
}

export { Game }