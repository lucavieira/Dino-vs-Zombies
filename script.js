// Função para iniciar o jogo
function start() {
  var background = document.querySelector('.game-background')
  var game = {}
  var TECLA = {
    D: 68,
    A: 65,
    NUM1: 97
  }
  var skillActive = true
  var direction = 'right'

  $('#menu-start').hide()

  $('#back-game').append("<div id='player' class='dino'>")
  $('#back-game').append(
    "<div id='enemy' class='enemys enemyRun-animation-left'>"
  )

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
    enemyMove()
  }

  function moveBackground() {
    var left = parseInt($('#back-game').css('background-position'))
    $('#back-game').css('background-position', left - 1)
  }

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

  function enemyMove() {
    var positionX = parseInt($('#enemy').css('left'))
    $('#enemy').css('left', positionX - 2)

    if (positionX <= 0) {
      $('#enemy').css('left', 745)
    }
  } // Fim do enemyMove

  // Habilidades

  function fireball() {
    if (skillActive == true) {
      skillActive = false

      if (direction == 'right') {
        positionTop = parseInt($('#player').css('top'))
        positionLeft = parseInt($('#player').css('left'))
        skillPositionTop = positionTop + 5
        skillPositionLeft = positionLeft + 34

        $('#back-game').append("<div id='fireball-right' class='fireball-animation-right'></div>")
        $('#fireball-right').css('top', skillPositionTop)
        $('#fireball-right').css('left', skillPositionLeft)

        var timeSkill = window.setInterval(fireballActive, 30)

        function fireballActive() {
          positionX = parseInt($('#fireball-right').css('left'))
          $('#fireball-right').css('left', positionX + 10)

          if (positionX > 765) {
            window.clearInterval(timeSkill)
            timeSkill = null
            $('#fireball-right').remove()
            skillActive = true
          }
        } // Fim da FireballActive
      } else {
        positionTop = parseInt($('#player').css('top'))
        positionRight = parseInt($('#player').css('right'))
        skillPositionTop = positionTop + 5
        skillPositionRight = positionRight + 34

        $('#back-game').append("<div id='fireball-left' class='fireball-animation-left'></div>")
        $('#fireball-left').css('top', skillPositionTop)
        $('#fireball-left').css('right', skillPositionRight)

        var timeSkill = window.setInterval(fireballActive, 30)

        function fireballActive() {
          positionX = parseInt($('#fireball-left').css('right'))
          $('#fireball-left').css('right', positionX + 10)

          if (positionX > 765) {
            window.clearInterval(timeSkill)
            timeSkill = null
            $('#fireball-left').remove()
            skillActive = true
          }
        } // Fim da FireballActive
      }
    } // Fim da SkillActive
  } // Fim da fireball
}
