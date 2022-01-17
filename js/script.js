// Função para iniciar o jogo
function start() {
  // Variaveis importantes
  var game = {}
  var TECLA = {
    D: 68,
    A: 65,
    NUM1: 97
  }
  var skillActive = true
  var canMove = true
  var direction = 'right'
  var score = 0

  $('#menu-start').hide()

  $('#backGame').append("<div id='player' class='dino'>")
  $('#backGame').append(
    "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'>"
  )
  $('#backGame').append(
    "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'>"
  )
  $('#backGame').append("<div id='scoreboard'></div>")

  game.press = []
  game.timer = setInterval(loop, 35)

  $(document).keydown(function (e) {
    game.press[e.which] = true
  })

  $(document).keyup(function (e) {
    game.press[e.which] = false
  })

  function loop() {
    moveBackground()
    playerMove()
    enemyMove(canMove)
    collisions()
    scores()
  }

  // BACKGROUND
  function moveBackground() {
    var left = parseInt($('#backGame').css('background-position'))
    $('#backGame').css('background-position', left - 1)
  }

  // PLAYER
  function playerMove() {
    if (game.press[TECLA.D]) {
      var right = parseInt($('#player').css('right'))
      $('#player').css('right', right - 10)
      $('#player').css('background', 'url(images/sprites/dino-run-right.png)')
      direction = 'right'

      $('#player').addClass('run-animation-right')

      if (right <= 0) {
        $('#player').css('right', right)
      }
    }
    if (game.press[TECLA.A]) {
      var right = parseInt($('#player').css('right'))
      $('#player').css('right', right + 10)
      $('#player').css(
        'background',
        'url(images/sprites/dino-run-left.png) right'
      )
      direction = 'left'

      $('#player').addClass('run-animation-left')

      if (right >= 740) {
        $('#player').css('right', right)
      }
    }

    if (game.press[TECLA.NUM1]) {
      // Bola de Fogo
      fireball()
    }

    if (!game.press[TECLA.D]) {
      $('#player').removeClass('run-animation-right')
    }
    if (!game.press[TECLA.A]) {
      $('#player').removeClass('run-animation-left')
    }
  } // Fim do playerMove

  // Habilidades do Player

  function fireball() {
    if (skillActive == true) {
      skillActive = false

      if (direction == 'right') {
        positionTop = parseInt($('#player').css('top'))
        positionLeft = parseInt($('#player').css('left'))
        skillPositionTop = positionTop + 5
        skillPositionLeft = positionLeft + 34

        $('#backGame').append(
          "<div id='fireballRight' class='fireball-animation-right'></div>"
        )
        $('#fireballRight').css('top', skillPositionTop)
        $('#fireballRight').css('left', skillPositionLeft)

        var timeSkill = window.setInterval(fireballActive, 30)

        function fireballActive() {
          positionX = parseInt($('#fireballRight').css('left'))
          $('#fireballRight').css('left', positionX + 10)

          if (positionX > 765) {
            window.clearInterval(timeSkill)
            timeSkill = null
            $('#fireballRight').remove()
            setTimeout(() => {
              skillActive = true
            }, 200)
          }
        } // Fim da FireballActive
      } else {
        positionTop = parseInt($('#player').css('top'))
        positionRight = parseInt($('#player').css('right'))
        skillPositionTop = positionTop + 5
        skillPositionRight = positionRight + 34

        $('#backGame').append(
          "<div id='fireballLeft' class='fireball-animation-left'></div>"
        )
        $('#fireballLeft').css('top', skillPositionTop)
        $('#fireballLeft').css('right', skillPositionRight)

        var timeSkill = window.setInterval(fireballActive, 30)

        function fireballActive() {
          positionX = parseInt($('#fireballLeft').css('right'))
          $('#fireballLeft').css('right', positionX + 10)

          if (positionX > 765) {
            window.clearInterval(timeSkill)
            timeSkill = null
            $('#fireballLeft').remove()
            setTimeout(() => {
              skillActive = true
            }, 200)
          }
        } // Fim da FireballActive
      }
    } // Fim da SkillActive
  } // Fim da fireball

  // Colisoes

  function collisions() {
    var collision1 = $('#player').collision($('#zombie1Left'))
    var collision2 = $('#player').collision($('#zombie1Right'))
    var collision3 = $('#fireballRight').collision('#zombie1Left')
    var collision4 = $('#fireballRight').collision('#zombie1Right')
    var collision5 = $('#fireballLeft').collision('#zombie1Left')
    var collision6 = $('#fireballLeft').collision('#zombie1Right')

    if (collision1.length > 0) {
      canMove = false
      $('#zombie1Left').removeClass('zombie1-run-left')
      $('#zombie1Left').addClass('zombie1-attack-left')
    } else if (collision2.length > 0) {
      canMove = false
      $('#zombie1Right').removeClass('zombie1-run-right')
      $('#zombie1Right').addClass('zombie1-attack-right')
    } else {
      canMove = true
      $('#zombie1Right').addClass('zombie1-run-right')
      $('#zombie1Right').removeClass('zombie1-attack-right')

      $('#zombie1Left').addClass('zombie1-run-left')
      $('#zombie1Left').removeClass('zombie1-attack-left')
    }

    if (collision3.length > 0) {
      positionTop = parseInt($('#zombie1Left').css('top'))
      positionLeft = parseInt($('#zombie1Left').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombie1Left').remove()
      setTimeout(() => {
        $('#backGame').append(
          "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'>"
        )
      }, 1500)
    }

    if (collision4.length > 0) {
      positionTop = parseInt($('#zombie1Right').css('top'))
      positionLeft = parseInt($('#zombie1Right').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombie1Right').remove()
      setTimeout(() => {
        $('#backGame').append(
          "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'>"
        )
      }, 1500)
    }

    if (collision5.length > 0) {
      positionTop = parseInt($('#zombie1Left').css('top'))
      positionLeft = parseInt($('#zombie1Left').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombie1Left').remove()
      setTimeout(() => {
        $('#backGame').append(
          "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'>"
        )
      }, 1500)
    }

    if (collision6.length > 0) {
      positionTop = parseInt($('#zombie1Right').css('top'))
      positionLeft = parseInt($('#zombie1Right').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombie1Right').remove()
      setTimeout(() => {
        $('#backGame').append(
          "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'>"
        )
      }, 1500)
    }
  } // Fim da Collisions

  function explosion(topPosition, leftPosition) {
    score = score + 50
    $('#backGame').append(
      "<div id='explosion' class='explosion explosion-animation'></div>"
    )
    $('#explosion').css('top', topPosition)
    $('#explosion').css('left', leftPosition)
    $('#explosion').animate({ width: 50, opacity: 0 }, 'slow')

    var explosionTime = window.setInterval(removeExplosion, 500)

    function removeExplosion() {
      $('#explosion').remove()
      window.clearInterval(explosionTime)
      explosionTime = null
    }
  }

  // ENEMYS

  function enemyMove(canMove) {
    if (canMove) {
      var positionX = parseInt($('#zombie1Left').css('left'))
      $('#zombie1Left').css('left', positionX - 1)

      if (positionX <= 0) {
        $('#zombie1Left').css('left', 745)
      }

      var positionX = parseInt($('#zombie1Right').css('left'))
      $('#zombie1Right').css('left', positionX + 1)

      if (positionX > 745) {
        $('#zombie1Right').css('left', 0)
      }
    }
  } // Fim do enemyMove

  function scores() {
    $('#scoreboard').html('<h2> Scores: ' + score + ' </h2>')
  }
}
