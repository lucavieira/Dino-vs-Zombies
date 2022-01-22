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
  var gameOver = false
  var direction = 'right'
  var score = 0
  var velocidade = 1

  // Esconde o menu inicial
  $('#menu-start').hide()

  // Criação dos Sprites do jogador, dos inimigos e do placar
  $('#backGame').append("<div id='player' class='dino'>")
  $('#backGame').append(
    "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'>"
  )
  $('#backGame').append(
    "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'>"
  )
  $('#backGame').append("<div id='scoreboard'></div>")

  // Barra de vida do jogador
  $('#backGame').append("<div id='lifeBar'></div>")

  game.press = []
  game.timer = setInterval(loop, 35)

  $(document).keydown(function (e) {
    game.press[e.which] = true
  })

  $(document).keyup(function (e) {
    game.press[e.which] = false
  })

  // Função que fica em um loop para sempre executar as funcionalidades do jogo
  function loop() {
    moveBackground()
    playerMove()
    enemyMove(canMove)
    collisions()
    scores()
  }

  // BACKGROUND

  // Função responsavel pelo movimento do fundo
  function moveBackground() {
    var left = parseInt($('#backGame').css('background-position'))
    $('#backGame').css('background-position', left - 1)
  }

  // PLAYER

  // Função responsavel pela movimentação do Jogador
  function playerMove() {
    // Quando pressionado a tecla D o jogador caminha para a Direita
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

    // Quando pressionado a tecla A o jogador caminha para a Esquerda
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

    // Quando pressionado a tecla NUM1, o jogador lança uma habilidade
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

  // Função que cria a habilidade
  function fireball() {
    if (skillActive == true) {
      skillActive = false

      if (direction == 'right') {
        // Posição onde o sprite será adicionado
        positionTop = parseInt($('#player').css('top')) + 5
        positionLeft = parseInt($('#player').css('left')) + 34

        // Criando o sprite
        $('#backGame').append(
          "<div id='fireballRight' class='fireball-animation-right'></div>"
        )
        // Adicionado as posições onde irá aparecer
        $('#fireballRight').css('top', positionTop)
        $('#fireballRight').css('left', positionLeft)

        var timeSkill = window.setInterval(fireballActive, 30)

        // Função para movimentar o sprite da habilidade
        function fireballActive() {
          // Pega a posição atual
          positionX = parseInt($('#fireballRight').css('left'))
          // Movimenta o sprite
          $('#fireballRight').css('left', positionX + 10)

          // Verifica se o sprite chegou no limite da tela
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
        positionTop = parseInt($('#player').css('top')) + 5
        positionRight = parseInt($('#player').css('right')) + 34

        $('#backGame').append(
          "<div id='fireballLeft' class='fireball-animation-left'></div>"
        )
        $('#fireballLeft').css('top', positionTop)
        $('#fireballLeft').css('right', positionRight)

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

  // Função responsavel para verificar todas colisões do jogo
  function collisions() {
    var collision1 = $('#player').collision($('#zombie1Left'))
    var collision2 = $('#player').collision($('#zombie1Right'))
    var collision3 = $('#fireballRight').collision('#zombie1Left')
    var collision4 = $('#fireballRight').collision('#zombie1Right')
    var collision5 = $('#fireballLeft').collision('#zombie1Left')
    var collision6 = $('#fireballLeft').collision('#zombie1Right')

    // Verifica se está tendo colisão entre dois elementos
    if (collision1.length > 0) {
      damage()
      canMove = false
      $('#zombie1Left').removeClass('zombie1-run-left')
      $('#zombie1Left').addClass('zombie1-attack-left')
    } else if (collision2.length > 0) {
      damage()
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
      speedUp()
      score = score + 50
      positionTop = parseInt($('#zombie1Left').css('top'))
      positionLeft = parseInt($('#zombie1Left').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombie1Left').remove()
      repositionEnemy('zombieLeft')
    }

    if (collision4.length > 0) {
      speedUp()
      score = score + 50
      positionTop = parseInt($('#zombie1Right').css('top'))
      positionLeft = parseInt($('#zombie1Right').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombie1Right').remove()
      repositionEnemy('zombieRight')
    }

    if (collision5.length > 0) {
      speedUp()
      score = score + 50
      positionTop = parseInt($('#zombie1Left').css('top'))
      positionLeft = parseInt($('#zombie1Left').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombie1Left').remove()
      repositionEnemy('zombieLeft')
    }

    if (collision6.length > 0) {
      speedUp()
      score = score + 50
      positionTop = parseInt($('#zombie1Right').css('top'))
      positionLeft = parseInt($('#zombie1Right').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombie1Right').remove()
      repositionEnemy('zombieRight')
    }
  } // Fim da Collisions

  // Aumenta a velocidade do inimigo cada vez que um inimigo é eliminado
  function speedUp() {
    if (velocidade < 3) {
      velocidade = velocidade + 0.3
    }
  }

  // Função que diminui a vida do personagem quando for atacado
  function damage() {
    // Acessando a variavel css que contém o valor total da barra de vida
    life = String(
      getComputedStyle(document.querySelector('#lifeBar')).getPropertyValue(
        `--life`
      )
    ).trim()

    // Verifica se a vida chegou a 0
    if (life != 0) {
      // Se for diferente de 0 e estiver em contato com o zumbi, irá diminuir
      document.querySelector('#lifeBar').style.setProperty(`--life`, life - 1)
    }
    if (life == 0) {
      // Game Over
      game_over()
    }
  }

  // Reposiciona o inimigo
  function repositionEnemy(enemy) {
    if (!gameOver) {
      if (enemy == 'zombieRight') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'>"
          )
        }, 1500)
      } else if (enemy == 'zombieLeft') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'>"
          )
        }, 1500)
      }
    }
  }

  // Função responsavel para executar a animação da explosão ao eliminar um inimigo
  function explosion(topPosition, leftPosition) {
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

  // Função responsavel pela movimentação dos inimigos
  function enemyMove(canMove) {
    // Verifica se pode se movimentar
    if (canMove) {
      // Posição do sprite
      var positionX = parseInt($('#zombie1Left').css('left'))
      // Movimentando o sprite
      $('#zombie1Left').css('left', positionX - velocidade)

      // Verifica se o sprite chegar no limite da tela será reposicionado
      if (positionX <= 0) {
        $('#zombie1Left').css('left', 745)
      }

      var positionX = parseInt($('#zombie1Right').css('left'))
      $('#zombie1Right').css('left', positionX + velocidade)

      if (positionX > 745) {
        $('#zombie1Right').css('left', 0)
      }
    }
  } // Fim do enemyMove

  // Função responsavel por mostrar o placar do jogo, a quantidade de pontos até o momento
  function scores() {
    $('#scoreboard').html('<h2> Scores: ' + score + ' </h2>')
  } // Fim da função Scores

  // Função fim de jogo
  function game_over() {
    gameOver = true
    window.clearInterval(game.timer)
    game.timer = null

    $('#player').remove()
    $('#zombie1Right').remove()
    $('#zombie1Left').remove()
    $('#lifeBar').remove()

    $('#backGame').append("<div id='over'></div>")
    $('#over').html(
      "<h2 id='gameOverTitle'>Game Over</h2><p id='scores'>Score: " +
        score +
        '</p>' +
        "<div id='restart' onClick=restartGame()><h3>Try Again</h3></div>"
    )
  } // Fim da função game Over
}

// Função que reinicia o jogo
function restartGame() {
  $('#over').remove()
  start()
} // Fim da função restart Game

function instructions() {
  $('#menu-start').hide()
  $('#backGame').append(
    "<div id='gameInstructions'>" +
      "<h3 id='objective'>Objective</h3>" +
      "<p class='gameObjective'>Score the most points by eliminating enemies.</p>" +
      "<h3 id='controls'>Controls</h3>" +
      "<p class='controlKey'>A -> Move to Left</p>" +
      "<p class='controlKey'>D -> Move to Right</p>" +
      "<p class='controlKey'>NUM1 -> Ability</p>" +
      '</div>'
  )
}
