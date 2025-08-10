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
    this.currentNoteDegree = null;
    this.noteToGuess = null;
    this.noteIndex = null;
    this.considerAnswerToScore = false;
    this.correctAnswer = false;

    document.getElementById(`${this.nameId}Title`).textContent = this.title;
  }

  #getRandomNote() {
    const possibleNotes = this.key.extendedScale;
    this.noteIndex = Math.floor(Math.random() * possibleNotes.length);
    this.noteToGuess = possibleNotes[this.noteIndex];

  }

  #getAnswerDegree() {
    if (this.noteIndex === 0 || this.noteIndex === 7 || this.noteIndex === 14) {
        this.currentNoteDegree = 'FirstDegree';
    } else if (this.noteIndex ===  1 || this.noteIndex === 8 || this.noteIndex === 15) {
        this.currentNoteDegree = 'SecondDegree';
    } else if (this.noteIndex === 2 || this.noteIndex === 9 || this.noteIndex === 16) {
        this.currentNoteDegree = 'ThirdDegree';
    } else if (this.noteIndex === 3 || this.noteIndex === 10 || this.noteIndex === 17) {
        this.currentNoteDegree = 'FourthDegree';
    } else if (this.noteIndex === 4 || this.noteIndex === 11 || this.noteIndex === 18) {
        this.currentNoteDegree = 'FifthDegree';
    } else if (this.noteIndex === 5 || this.noteIndex === 12 || this.noteIndex === 19) {
        this.currentNoteDegree = 'SixthDegree';
    } else if (this.noteIndex === 6 || this.noteIndex === 13 || this.noteIndex === 20) {
        this.currentNoteDegree = 'SeventhDegree';
    }
  }

  #endPreviousRound() {
    this.#cleanGuessResult();
    if (this.noteToGuess) {
        this.#updateScore();
    }
  }

  #selectNewNote() {
    this.#getRandomNote();
    this.#getAnswerDegree();
    this.considerAnswerToScore = true;

  }

  beginRound() {
    this.#endPreviousRound();
    this.#selectNewNote();
    this.playNoteToGuess();
  }

  checkNoteAnswer(guessedDegree) {
    this.correctAnswer = (guessedDegree === this.currentNoteDegree);

    if (this.considerAnswerToScore) {
        this.questions += 1;
        this.possibleAnswersCount[this.currentNoteDegree] += 1;
        if (this.correctAnswer) {
            if (this.correctAnswer) {
                this.possibleAnswersScore[this.currentNoteDegree] += 1;
                this.acertos += 1;
            }
        }
        this.totalPercentage = this.acertos / this.questions
        this.percentageCorrectAnswers[this.currentNoteDegree] = this.possibleAnswersScore[this.currentNoteDegree] / this.possibleAnswersCount[this.currentNoteDegree]
    }

    this.#showGuessResult();
    this.considerAnswerToScore = false;

  }

  #cleanGuessResult() {
    document.getElementById(`${this.nameId}GuessedAnswer`).textContent = ``;
  }


  #showGuessResult() {
    if (this.correctAnswer) {
        document.getElementById(`${this.nameId}GuessedAnswer`).textContent = `Resposta Correta! A nota sorteada foi ${this.noteToGuess.name}.`;
    } else {
        document.getElementById(`${this.nameId}GuessedAnswer`).textContent = `Resposta Errada!`;
    }
  }

  #updateScore() {
    document.getElementById(`${this.nameId}${this.currentNoteDegree}Score`).textContent = this.possibleAnswersScore[this.currentNoteDegree];
    document.getElementById(`${this.nameId}${this.currentNoteDegree}Total`).textContent = this.possibleAnswersCount[this.currentNoteDegree]
    document.getElementById(`${this.nameId}${this.currentNoteDegree}Percentual`).textContent = this.percentageCorrectAnswers[this.currentNoteDegree].toFixed(2) + '%';

    document.getElementById(`${this.nameId}TotalScore`).textContent = this.acertos;
    document.getElementById(`${this.nameId}TotalGuesses`).textContent = this.questions;
    document.getElementById(`${this.nameId}TotalPercentual`).textContent = this.totalPercentage.toFixed(2) + '%';
  }

  playNoteToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;
      this.noteToGuess.play(window.player, volume, duration);
  }

  playScaleUpToNoteToGuess() {
      const duration = parseFloat(document.getElementById(`${this.nameId}DurationNoteToGuess`).value);
      const volume = parseFloat(document.getElementById('volume').value)/100;
      let notes;

      if (this.noteIndex <= 6) {
        notes = this.key.extendedScale.slice(0, this.noteIndex + 1);
      } else if (this.noteIndex <= 13) {
        notes = this.key.extendedScale.slice(7, this.noteIndex + 1);
      } else {
        notes = this.key.extendedScale.slice(14, this.noteIndex + 1);
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

      if (this.noteIndex <= 6) {
        notes = this.key.extendedScale.slice(this.noteIndex, 8);
      } else if (this.noteIndex <= 13) {
        notes = this.key.extendedScale.slice(this.noteIndex, 15);
      } else {
        notes = this.key.extendedScale.slice(this.noteIndex, 22);
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

      if (this.noteIndex <= 7) {
        for (let i=this.noteIndex; i>=0; i--) {
            notes = notes.concat(this.key.extendedScale[i])
        }
      } else if (this.noteIndex <= 14) {
        for (let i=this.noteIndex; i>=7; i--) {
            notes = notes.concat(this.key.extendedScale[i])
        }
      } else {
        for (let i=this.noteIndex; i>=15; i--) {
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