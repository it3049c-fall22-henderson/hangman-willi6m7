class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty, next) {
    // get word and set it to the class's this.word
    this.word = await this.getRandomWord(difficulty);
    // clear canvas
    this.clearCanvas();
    // draw base
    this.drawBase();
    // reset this.guesses to empty array
    this.guesses = [];
    // reset this.isOver to false
    this.isOver = false;
    // reset this.didWin to false
    this.didWin = false;

    this.wrongGuesses = 0;
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    const specChars = /[ 1234567890`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    // Check if nothing was provided and throw an error if so
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    // Check if more than one letter was provided. throw an error if it is.
    // if it's a letter, convert it to lower case for consistency.
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    // add the new letter to the guesses array.
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
    if(letter != "" && specChars.test(letter) == false && letter.length == 1 && !this.guesses.includes(letter)){
      letter = letter.toLowerCase();
      this.guesses.push(letter);
      if(this.word.includes(letter)){
        this.checkWin();
      }else{
        this.onWrongGuess();
      }
    }else{
      if(letter == ""){
        alert("Invalid input. Please include a letter.");
      }
      else if(specChars.test(letter) == true){
        alert("Invalid input. Please include a valid letter.");
      }
      else if(letter.length != 1){
        alert("Invalid input. Please include a single letter.");
      }
      else if(this.guesses.includes(letter)){
        alert("Invalid input. Please include a letter that has already been included.");
      }else{
        alert("Error");
      }
    }
    
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
    var unknowns = this.word.length;
    for(var i = 0; i < this.word.length; i++){
      //wordLetter = this.word.charAt(i);
      if(this.guesses.includes(this.word.charAt(i))){
        unknowns--;
      }
    }
    if(unknowns == 0){
      this.didWin = true;
      this.isOver = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    this.wrongGuesses++;
    if(this.wrongGuesses == 1){
      this.drawHead();
    }
    else if(this.wrongGuesses == 2){
      this.drawBody();
    }
    else if(this.wrongGuesses == 3){
      this.drawLeftArm();
    }
    else if(this.wrongGuesses == 4){
      this.drawRightArm();
    }
    else if(this.wrongGuesses == 5){
      this.drawLeftLeg();
    }
    else if(this.wrongGuesses == 6){
      this.drawRightLeg();
      this.isOver = true;
      this.didWin = false;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    if(this.word != undefined){
      var wordHolder = [];
      var wordLetter;
        for(var i = 0; i < this.word.length; i++){
          wordLetter = this.word.charAt(i);
          if(this.guesses.includes(wordLetter)){
            wordHolder.push(wordLetter);
          }else{
            wordHolder.push("_");
          }
        }
      return wordHolder.join(' ');
    }
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    if(this.guesses != undefined){
      var guessesString = this.guesses.toString();
      return guessesString;
    }else{
      return "";
    }

  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.fillRect(230, 60, 40, 40);
  }

  drawBody() {
    this.ctx.fillRect(245, 60, 10, 200);
  }

  drawLeftArm() {
    this.ctx.fillRect(155, 120, 90, 10);
  }

  drawRightArm() {
    this.ctx.fillRect(245, 120, 90, 10);
  }

  drawLeftLeg() {
    this.ctx.fillRect(155, 250, 90, 10);
  }

  drawRightLeg() {
    this.ctx.fillRect(245, 250, 90, 10);
  }
}
