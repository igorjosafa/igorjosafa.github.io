import { svgElements } from './svgElements.js';

class Game {
    constructor(nameId, title) {
        this.nameId = nameId;
        this.title = title;
        this.acertos = 0;
        this.questions = 0;
        this.totalPercentage = 0.0;
        this.rodadas = 0;
        this.allCorrect = true;
        this.rodadasAllCorrect = 0;
        this.rodadaAnsweredQuestions = 0;
        this.streak = 0;
        this.longestStreak = 0;
        this.harmonicProgressionGame = false;
    }

    #getRandomNotes(possibleNotes) {
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

        // inclui a fundamental se o jogo for o de progressão harmônica
        if (this.harmonicProgressionGame) {
            let changeIndex = Math.floor(Math.random() * this.howManyNotes);
            this.notesIndex[changeIndex] = 0;
            this.notesToGuess[changeIndex] = possibleNotes[0];
        }

    }

    beginRound(possibleNotes) {
        this.#endPreviousRound();
        this.#selectNewNotes(possibleNotes);
        this.#disableNewDraw();
        this.rodadas += 1;
        this.rodadaAnsweredQuestions = 0;
        this.allCorrect = true;
    }

    enableNewDraw() {
        document.getElementById(`${this.nameId}NewDraw`).disabled = false;
    }

    #disableNewDraw() {
        document.getElementById(`${this.nameId}NewDraw`).disabled = true;
    }

    #selectNewNotes(possibleNotes) {
        this.#getRandomNotes(possibleNotes);
        this.considerAnswerToScore[this.noteToCheck] = true;
    }

    #endPreviousRound() {
        this.#cleanGuessResult();
    }

    #cleanGuessResult() {
        document.getElementById(`${this.nameId}GuessedAnswer`).textContent = ``;
    }

    showStreak() {
        document.getElementById(`${this.nameId}Streak`).textContent = `Sequência de acertos atual: ${this.streak}`;
        document.getElementById(`${this.nameId}LongestStreak`).textContent = `Maior sequência de acertos: ${this.longestStreak}`;
    }

    showAllCorrect() {
        document.getElementById(`${this.nameId}AllCorrect`).textContent = `Rodadas sem erros: ${this.rodadasAllCorrect} / ${this.rodadas}`;
    }
}


class guessNoteDegree extends Game {
  constructor(nameId, title, key) {
    super(nameId, title);
    this.key = key;
    this.title = this.title + ` - ${this.key}`;
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
            const playNoteToGuessButton = document.createElement("button");
            playNoteToGuessButton.title = "Tocar a nota selecionada";
            playNoteToGuessButton.onclick = () => {
                this.playNoteToGuess();
            };

            const svgPlayNoteToGuess = new svgElements(
                "bi bi-play-fill", 
                "m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"
            ).createSvgElement();
            playNoteToGuessButton.appendChild(svgPlayNoteToGuess);
            headerContent.appendChild(playNoteToGuessButton);

            const playScaleUpToNoteToGuessButton = document.createElement("button");
            playScaleUpToNoteToGuessButton.title = "Tocar escala até a nota selecionada";
            playScaleUpToNoteToGuessButton.onclick = () => {
                this.playScaleUpToNoteToGuess();
            };

            const svgPlayScaleUpToNoteToGuess = new svgElements(
                "bi bi-chevron-bar-right", 
                "M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0M11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5"
            ).createSvgElement();
            playScaleUpToNoteToGuessButton.appendChild(svgPlayScaleUpToNoteToGuess);
            headerContent.appendChild(playScaleUpToNoteToGuessButton);

            const playScaleDownFromNoteToGuessButton = document.createElement("button");
            playScaleDownFromNoteToGuessButton.title = "Tocar escala descendente partindo da nota selecionada";
            playScaleDownFromNoteToGuessButton.onclick = () => {
                this.playScaleDownFromNoteToGuess();
            };

            const svgPlayScaleDownFromNoteToGuess = new svgElements(
                "bi bi-arrow-bar-left", 
                "M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"
            ).createSvgElement();
            playScaleDownFromNoteToGuessButton.appendChild(svgPlayScaleDownFromNoteToGuess);
            headerContent.appendChild(playScaleDownFromNoteToGuessButton);

            const playScaleUpFromNoteToGuessButton = document.createElement("button");
            playScaleUpFromNoteToGuessButton.title = "Tocar escala partindo da nota selecionada";
            playScaleUpFromNoteToGuessButton.onclick = () => {
                this.playScaleUpFromNoteToGuess();
            };

            const svgPlayScaleUpFromNoteToGuess = new svgElements(
                "bi bi-arrow-bar-right", 
                "M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
            ).createSvgElement();
            playScaleUpFromNoteToGuessButton.appendChild(svgPlayScaleUpFromNoteToGuess);
            headerContent.appendChild(playScaleUpFromNoteToGuessButton);
        }

        th.appendChild(headerContent);
        headerRow.appendChild(th);

        // input radio
        const td = document.createElement("td");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `${this.nameId}NoteToCheck`;
        radio.id = `${this.nameId}NoteToCheck${i}`;
        radio.onclick = () => this.updateNoteToCheck(i);
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


  #getAnswerDegrees() {
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


  beginRound() {
    if (this.notesToGuess.length > 0) {
        this.#updateScore();
    }
    super.beginRound(this.key.extendedScale);
    this.#getAnswerDegrees();
    this.playNotesToGuess();
  }

  checkNoteAnswer(guessedDegree) {
    this.correctAnswer = (guessedDegree === this.notesDegrees[this.noteToCheck]);

    if (this.considerAnswerToScore[this.noteToCheck]) {
        this.questions += 1;
        this.rodadaAnsweredQuestions += 1;
        this.possibleAnswersCount[this.notesDegrees[this.noteToCheck]] += 1;
        if (this.correctAnswer) {
            this.possibleAnswersScore[this.notesDegrees[this.noteToCheck]] += 1;
            this.acertos += 1;
        } else {
            this.allCorrect = false;
        }
        this.totalPercentage = this.acertos / this.questions * 100;
        this.percentageCorrectAnswers[this.notesDegrees[this.noteToCheck]] = (
            this.possibleAnswersScore[this.notesDegrees[this.noteToCheck]] / this.possibleAnswersCount[this.notesDegrees[this.noteToCheck]]) * 100;

        if (this.rodadaAnsweredQuestions === this.notesToGuess.length) {
            this.enableNewDraw()

            if (this.allCorrect) {
                this.rodadasAllCorrect += 1;
                this.streak += 1;
                if (this.streak > this.longestStreak) {
                    this.longestStreak = this.streak;
                }
            } else {
                this.streak = 0;
            }

            this.showAllCorrect()
        }
    }

    this.#showGuessResult();
    this.showStreak();
    this.considerAnswerToScore[this.noteToCheck] = false;
    this.#changeToNextNote();

  }

  #changeToNextNote() {
    if (this.correctAnswer && this.noteToCheck < this.notesToGuess.length - 1) {
        document.getElementById(`${this.nameId}NoteToCheck${this.noteToCheck + 1}`).click();
    } else if (this.correctAnswer) {
        document.getElementById(`${this.nameId}NoteToCheck0`).click();
    }
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
        document.getElementById(`${this.nameId}${degree}Total`).textContent = this.possibleAnswersCount[degree];
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

      if (this.notesIndex[this.noteToCheck] <= 7) {
        notes = this.key.extendedScale.slice(0, this.notesIndex[this.noteToCheck] + 1);
      } else if (this.notesIndex[this.noteToCheck] <= 14) {
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

      if (this.notesIndex[this.noteToCheck] <= 7) {
        notes = this.key.extendedScale.slice(this.notesIndex[this.noteToCheck], 8);
      } else if (this.notesIndex[this.noteToCheck] <= 14) {
        notes = this.key.extendedScale.slice(this.notesIndex[this.noteToCheck], 15);
      } else {
        notes = this.key.extendedScale.slice(this.notesIndex[this.noteToCheck]);
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
        for (let i=this.notesIndex[this.noteToCheck]; i>=14; i--) {
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

class guessChordNotesGame extends Game {
    constructor(nameId, title, key) {
        super(nameId, title);
        this.key = key;
        this.title = this.title + ` - ${this.key}`;
        this.howManyNotes = 1;
        this.noteToCheck = 0;
        this.acertos = 0;
        this.questions = 0;
        this.considerAnswerToScore = [];
        this.notesToGuess = [];
        this.totalPercentage = 0.0;

        this.possibleNotes = [];
        this.updatePossibleNotes();
        this.possibleIndexes = [
            1, 2, 3, 4, 5, 6, 7, 8, 10, 12
        ]

        this.possibleAnswersScore = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            10: 0,
            12: 0
        };
        this.possibleAnswersCount = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            10: 0,
            12: 0
        };
        this.percentageCorrectAnswers = {
            1: 0.00,
            2: 0.00,
            3: 0.00,
            4: 0.00,
            5: 0.00,
            6: 0.00,
            7: 0.00,
            8: 0.00,
            10: 0.00,
            12: 0.00
        };

        document.getElementById(`${this.nameId}Title`).textContent = this.title;
    }

    updatePossibleNotes() {
        this.possibleNotes = [];
        const checkboxes = document.querySelectorAll(`.${this.nameId}Degrees`);
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                let possibleIndex = parseInt(checkbox.name);
                this.possibleNotes.push(this.key.extendedScale[possibleIndex]);
            }
        });
    }

    beginRound() {
        if (this.notesToGuess.length > 0) {
            this.#updateScore();
        }
        super.beginRound(this.possibleNotes);
        this.notesToGuess = [... new Set(this.notesToGuess)];
        this.notesToGuess = this.notesToGuess.sort((a, b) => a.frequency - b.frequency);
        this.playChordToGuess();
        this.#updateSelectNoteToCheckElements()
    }

    updateNumberOfNotes(howManyNotes) {
        this.howManyNotes = howManyNotes;
    }

    updateNoteToCheck(noteToCheck) {
        this.noteToCheck = noteToCheck;
        this.#updateSelectNoteToCheckElements();
    }

    playChordToGuess() {
        const duration = parseFloat(document.getElementById(`${this.nameId}DurationChordToGuess`).value);
        const volume = parseFloat(document.getElementById('volume').value)/100;

        this.key.scale.firstNote.play(window.player, volume, duration);
        this.notesToGuess.forEach((note, index) => {
            note.play(window.player, volume, duration);
        });
    }

    playChordToGuessAscending() {
        const duration = parseFloat(document.getElementById(`${this.nameId}DurationChordToGuess`).value);
        const volume = parseFloat(document.getElementById('volume').value)/100;

        this.key.scale.firstNote.play(window.player, volume, duration);
        this.notesToGuess.forEach((note, index) => {
            setTimeout(() => {
                note.play(window.player, volume, duration);
            }, (index + 1) * duration * 1000);
        });
    }
    
    playBaseChord() {
        const duration = parseFloat(document.getElementById(`${this.nameId}DurationBaseChord`).value);
        const volume = parseFloat(document.getElementById('volume').value)/100;
        this.key.harmonicField.chords[0].play(window.player, volume, duration);
        }

    checkNoteAnswer(guessedIndex) {
        this.correctAnswer = (this.notesToGuess[this.noteToCheck] === this.key.extendedScale[guessedIndex]);
        let correctIndex = this.key.extendedScale.indexOf(this.notesToGuess[this.noteToCheck])

        if (this.considerAnswerToScore[this.noteToCheck]) {
            this.questions += 1;
            this.rodadaAnsweredQuestions += 1;
            this.possibleAnswersCount[correctIndex] += 1;
            if (this.correctAnswer) {
                this.possibleAnswersScore[correctIndex] += 1;
                this.acertos += 1;
            } else {
                this.allCorrect = false;
            }
            this.totalPercentage = this.acertos / this.questions * 100;
            this.percentageCorrectAnswers[correctIndex] = (
                this.possibleAnswersScore[correctIndex] / this.possibleAnswersCount[correctIndex]) * 100;

            
            if (this.rodadaAnsweredQuestions === this.notesToGuess.length) {
                this.enableNewDraw()

                if (this.allCorrect) {
                    this.rodadasAllCorrect += 1;
                    this.streak += 1;
                    if (this.streak > this.longestStreak) {
                        this.longestStreak = this.streak;
                    }
                } else {
                    this.streak = 0;
                }

                this.showAllCorrect()
            }
        }

        this.#showGuessResult();
        this.showStreak();
        this.considerAnswerToScore[this.noteToCheck] = false;
        this.#changeToNextNote();

    }

    #changeToNextNote() {
        if (this.correctAnswer && this.noteToCheck < this.notesToGuess.length - 1) {
            document.getElementById(`${this.nameId}NoteToCheck${this.noteToCheck + 1}`).click();
        } else if (this.correctAnswer) {
            document.getElementById(`${this.nameId}NoteToCheck0`).click();
        }
    }

    #showGuessResult() {
        if (this.correctAnswer) {
            document.getElementById(`${this.nameId}GuessedAnswer`).textContent = `Resposta Correta! A nota está presente no acorde.`;
        } else {
            document.getElementById(`${this.nameId}GuessedAnswer`).textContent = `Resposta Errada!`;
        }
    }


    #updateScore() {
        this.possibleIndexes.forEach((index) => {
            document.getElementById(`${this.nameId}${index}Score`).textContent = this.possibleAnswersScore[index];
            document.getElementById(`${this.nameId}${index}Total`).textContent = this.possibleAnswersCount[index];
            document.getElementById(`${this.nameId}${index}Percentage`).textContent = this.percentageCorrectAnswers[index] .toFixed(2) + "%";

            document.getElementById(`${this.nameId}Score`).textContent = this.acertos;
            document.getElementById(`${this.nameId}Total`).textContent = this.questions;
            document.getElementById(`${this.nameId}Percentage`).textContent = this.totalPercentage.toFixed(2) + '%';
        });
    }


  #updateSelectNoteToCheckElements() {
    const container = document.getElementById(`${this.nameId}SelectNoteToCheck`);
    container.innerHTML = '';
    const table = document.createElement("table");
    table.border = 1;
    
    const headerRow = document.createElement("tr");
    const radioRow = document.createElement("tr");

    for (let i = 0; i < this.notesToGuess.length; i++) {
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
        label.innerText = `${i + 2}ª Nota`;
        headerContent.appendChild(label);

        th.appendChild(headerContent);
        headerRow.appendChild(th);

        // input radio
        const td = document.createElement("td");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `${this.nameId}NoteToCheck`;
        radio.id = `${this.nameId}NoteToCheck${i}`;
        radio.onclick = () => this.updateNoteToCheck(i);
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
    
}

class harmonicProgressionGame extends Game {
  constructor(nameId, title, key, keyFactory) {
    super(nameId, title);
    this.keyFactory = keyFactory;
    this.key = key;
    this.pureTitle = title;
    this.howManyNotes = Math.floor(Math.random() * 5) + 3;
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
    this.noteToCheck = 0;
    this.correctAnswer = false;
    this.harmonicProgressionGame = true;
    this.#updateSelectNoteToCheckElements();

    this.#updateTitleElement();
  }

  updateNoteToCheck(noteToCheck) {
    this.noteToCheck = noteToCheck;
    this.#updateSelectNoteToCheckElements();
  }

  updateNumberOfNotes(howManyNotes) {
    this.howManyNotes = howManyNotes;
    this.#updateSelectNoteToCheckElements();
  }

  #updateTitleElement() {
    this.title = this.pureTitle + ` - ${this.key}`;
    document.getElementById(`${this.nameId}Title`).textContent = this.title;
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
            const playChordToGuessButton = document.createElement("button");
            playChordToGuessButton.title = "Tocar o acorde selecionado";
            playChordToGuessButton.onclick = () => {
                this.playChordToGuess();
            };

            const svgPlayChordToGuess = new svgElements(
                "bi bi-play-fill", 
                "m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"
            ).createSvgElement();
            playChordToGuessButton.appendChild(svgPlayChordToGuess);
            headerContent.appendChild(playChordToGuessButton);

        }

        th.appendChild(headerContent);
        headerRow.appendChild(th);

        // input radio
        const td = document.createElement("td");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `${this.nameId}NoteToCheck`;
        radio.id = `${this.nameId}NoteToCheck${i}`;
        radio.onclick = () => this.updateNoteToCheck(i);
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


  #getAnswerDegrees() {
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


  beginRound() {
    let possibleKeys = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    this.key = new this.keyFactory(possibleKeys[Math.floor(Math.random() * possibleKeys.length)], 'ionian', [1, 3, 5], 4)
    this.title = this.title + ` - ${this.key}`;
    this.#updateTitleElement();
    this.howManyNotes = Math.floor(Math.random() * 5) + 3;
    this.#updateSelectNoteToCheckElements();
    if (this.notesToGuess.length > 0) {
        this.#updateScore();
    }
    super.beginRound(this.key.extendedScale);
    this.#getAnswerDegrees();
    this.playChordsToGuess();
  }

  checkNoteAnswer(guessedDegree) {
    this.correctAnswer = (guessedDegree === this.notesDegrees[this.noteToCheck]);

    if (this.considerAnswerToScore[this.noteToCheck]) {
        this.questions += 1;
        this.rodadaAnsweredQuestions += 1;
        this.possibleAnswersCount[this.notesDegrees[this.noteToCheck]] += 1;
        if (this.correctAnswer) {
            this.possibleAnswersScore[this.notesDegrees[this.noteToCheck]] += 1;
            this.acertos += 1;
        } else {
            this.allCorrect = false;
        }
        this.totalPercentage = this.acertos / this.questions * 100;
        this.percentageCorrectAnswers[this.notesDegrees[this.noteToCheck]] = (
            this.possibleAnswersScore[this.notesDegrees[this.noteToCheck]] / this.possibleAnswersCount[this.notesDegrees[this.noteToCheck]]) * 100;

        if (this.rodadaAnsweredQuestions === this.notesToGuess.length) {
            this.enableNewDraw()

            if (this.allCorrect) {
                this.rodadasAllCorrect += 1;
                this.streak += 1;
                if (this.streak > this.longestStreak) {
                    this.longestStreak = this.streak;
                }
            } else {
                this.streak = 0;
            }

            this.showAllCorrect()
        }
    }

    this.#showGuessResult();
    this.showStreak();
    this.considerAnswerToScore[this.noteToCheck] = false;
    this.#changeToNextNote();

  }

  #changeToNextNote() {
    if (this.correctAnswer && this.noteToCheck < this.notesToGuess.length - 1) {
        document.getElementById(`${this.nameId}NoteToCheck${this.noteToCheck + 1}`).click();
    } else if (this.correctAnswer) {
        document.getElementById(`${this.nameId}NoteToCheck0`).click();
    }
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
        document.getElementById(`${this.nameId}${degree}Total`).textContent = this.possibleAnswersCount[degree];
        document.getElementById(`${this.nameId}${degree}Percentual`).textContent = this.percentageCorrectAnswers[degree].toFixed(2) + '%';

        document.getElementById(`${this.nameId}TotalScore`).textContent = this.acertos;
        document.getElementById(`${this.nameId}TotalGuesses`).textContent = this.questions;
        document.getElementById(`${this.nameId}TotalPercentual`).textContent = this.totalPercentage.toFixed(2) + '%';
    });
    
  }

    playBaseChord() {
        const duration = parseFloat(document.getElementById(`${this.nameId}DurationPerChord`).value);
        const volume = parseFloat(document.getElementById('volume').value)/100;
        this.key.harmonicField.chords[0].play(window.player, volume, duration);
        }

  playChordToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationPerChord`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;

      this.key.harmonicField.chords.forEach(element => {
        if (this.notesToGuess[this.noteToCheck].name === element.notes[0].name) {
          element.play(window.player, volume, duration);
        }
      });
  }

  playChordsToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationPerChord`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;

      const octaveShifter = document.querySelector('.octaveShifter:checked');

      this.notesIndex.forEach((index, time) => {
        if (time === 1 && octaveShifter) {
            setTimeout(() => {
                this.key.harmonicField.chords[index % 7].play(window.player, volume, duration, 2);
            }, time * duration * 1000);
        } else if (time === 3 && octaveShifter) {
            setTimeout(() => {
                this.key.harmonicField.chords[index % 7].play(window.player, volume, duration, 0.5);
            }, time * duration * 1000);
        } else {
            setTimeout(() => {
                this.key.harmonicField.chords[index % 7].play(window.player, volume, duration);
            }, time * duration * 1000);
        }
      });
  }

}

export { guessNoteDegree, guessChordNotesGame, harmonicProgressionGame }


