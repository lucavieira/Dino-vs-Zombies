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
  var canMoveZombie1Right = true
  var canMoveZombie1Left = true
  var canMoveZombieArmorRight = true
  var canMoveZombieArmorLeft = true
  var canMoveGiantZombieLeft = true
  var canMoveGiantZombieRight = true
  var gameOver = false
  var direction = 'right'
  var score = 0
  var speed = 1
  var enemyDeaths = 0
  var hit

  // Variaveis que controlam o surgimento dos inimigos
  var zombieArmorAppearence = true
  var giantZombieAppearence = true

  // Esconde o menu inicial
  $('#menu-start').hide()

  // Criação dos Sprites do jogador, dos inimigos e do placar
  $('#backGame').append("<div id='player' class='dino'></div>")
  $('#backGame').append(
    "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'></div>"
  )
  $('#backGame').append(
    "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'></div>"
  )
  $('#backGame').append("<div id='scoreboard'></div>")

  // Barra de vida do jogador
  $('#backGame').append("<div id='lifeBar'></div>")
  $('#backGame').append("<div id='powerBar'></div>")

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
    enemyMove(
      canMoveZombie1Right,
      canMoveZombie1Left,
      canMoveZombieArmorRight,
      canMoveZombieArmorLeft,
      canMoveGiantZombieLeft,
      canMoveGiantZombieRight
    )
    collisions()
    scores()
  }

  // Controls

  $('#controls').append("<div id='moveLeft-button'></div>")
  $('#controls').append("<div id='moveRight-button'></div>")
  $('#controls').append("<div id='fireball-button'></div>")

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

  $('#moveRight-button').on('tap', function () {
    var right = parseInt($('#player').css('right'))
    $('#player').css('right', right - 10)
    $('#player').css('background', 'url(images/sprites/dino-run-right.png)')
    direction = 'right'

    $('#player').addClass('run-animation-right')

    if (right <= 0) {
      $('#player').css('right', right)
    }
  })

  $('#moveLeft-button').on('tap', function () {
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
  })

  $('#fireball-button').on('tap', function () {
    fireball()
  })

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
    var collision7 = $('#fireballRight').collision('#zombieArmorLeft')
    var collision8 = $('#fireballRight').collision('#zombieArmorRight')
    var collision9 = $('#fireballLeft').collision('#zombieArmorLeft')
    var collision10 = $('#fireballLeft').collision('#zombieArmorRight')
    var collision11 = $('#player').collision($('#zombieArmorLeft'))
    var collision12 = $('#player').collision($('#zombieArmorRight'))
    var collision13 = $('#fireballRight').collision('#zombieGiantLeft')
    var collision14 = $('#fireballRight').collision('#zombieGiantRight')
    var collision15 = $('#fireballLeft').collision('#zombieGiantLeft')
    var collision16 = $('#fireballLeft').collision('#zombieGiantRight')
    var collision17 = $('#player').collision($('#zombieGiantLeft'))
    var collision18 = $('#player').collision($('#zombieGiantRight'))

    // Verifica se está tendo colisão entre dois elementos
    if (collision1.length > 0) {
      hit = 1
      damage()
      canMoveZombie1Left = false
      $('#zombie1Left').removeClass('zombie1-run-left')
      $('#zombie1Left').addClass('zombie1-attack-left')
    } else {
      canMoveZombie1Left = true
      $('#zombie1Left').addClass('zombie1-run-left')
      $('#zombie1Left').removeClass('zombie1-attack-left')
    }

    if (collision2.length > 0) {
      hit = 1
      damage()
      canMoveZombie1Right = false
      $('#zombie1Right').removeClass('zombie1-run-right')
      $('#zombie1Right').addClass('zombie1-attack-right')
    } else {
      canMoveZombie1Right = true
      $('#zombie1Right').addClass('zombie1-run-right')
      $('#zombie1Right').removeClass('zombie1-attack-right')
    }

    if (collision3.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 50
      positionTop = parseInt($('#zombie1Left').css('top'))
      positionLeft = parseInt($('#zombie1Left').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombie1Left').remove()
      repositionEnemy('zombieLeft', 800)
    }

    if (collision4.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 50
      positionTop = parseInt($('#zombie1Right').css('top'))
      positionLeft = parseInt($('#zombie1Right').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombie1Right').remove()
      repositionEnemy('zombieRight', 800)
    }

    if (collision5.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 50
      positionTop = parseInt($('#zombie1Left').css('top'))
      positionLeft = parseInt($('#zombie1Left').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombie1Left').remove()
      repositionEnemy('zombieLeft', 800)
    }

    if (collision6.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 50
      positionTop = parseInt($('#zombie1Right').css('top'))
      positionLeft = parseInt($('#zombie1Right').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombie1Right').remove()
      repositionEnemy('zombieRight', 800)
    }

    if (collision7.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 100
      positionTop = parseInt($('#zombieArmorLeft').css('top'))
      positionLeft = parseInt($('#zombieArmorLeft').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombieArmorLeft').remove()
      repositionEnemy('zombieArmorLeft', 850)
    }

    if (collision8.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 100
      positionTop = parseInt($('#zombieArmorRight').css('top'))
      positionLeft = parseInt($('#zombieArmorRight').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombieArmorRight').remove()
      repositionEnemy('zombieArmorRight', 850)
    }

    if (collision9.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 100
      positionTop = parseInt($('#zombieArmorLeft').css('top'))
      positionLeft = parseInt($('#zombieArmorLeft').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombieArmorLeft').remove()
      repositionEnemy('zombieArmorLeft', 850)
    }

    if (collision10.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 100
      positionTop = parseInt($('#zombieArmorRight').css('top'))
      positionLeft = parseInt($('#zombieArmorRight').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('right', 780)

      $('#zombieArmorRight').remove()
      repositionEnemy('zombieArmorRight', 850)
    }

    if (collision11.length > 0) {
      hit = 2
      damage()
      canMoveZombieArmorLeft = false
      $('#zombieArmorLeft').removeClass('zombieArmor-run-left')
      $('#zombieArmorLeft').addClass('zombieArmor-attack-left')
    } else {
      canMoveZombieArmorLeft = true
      $('#zombieArmorLeft').addClass('zombieArmor-run-left')
      $('#zombieArmorLeft').removeClass('zombieArmor-attack-left')
    }

    if (collision12.length > 0) {
      hit = 2
      damage()
      canMoveZombieArmorRight = false

      $('#zombieArmorRight').removeClass('zombieArmor-run-right')
      $('#zombieArmorRight').addClass('zombieArmor-attack-right')
    } else {
      canMoveZombieArmorRight = true
      $('#zombieArmorRight').addClass('zombieArmor-run-right')
      $('#zombieArmorRight').removeClass('zombieArmor-attack-right')
    }

    if (collision13.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 200

      positionTop = parseInt($('#zombieGiantLeft').css('top'))
      positionLeft = parseInt($('#zombieGiantLeft').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombieGiantLeft').remove()
      repositionEnemy('zombieGiantLeft', 1000)
    }

    if (collision14.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 200

      positionTop = parseInt($('#zombieGiantRight').css('top'))
      positionLeft = parseInt($('#zombieGiantRight').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballRight').css('left', 780)

      $('#zombieGiantRight').remove()
      repositionEnemy('zombieGiantRight', 1000)
    }

    if (collision15.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 200

      positionTop = parseInt($('#zombieGiantLeft').css('top'))
      positionLeft = parseInt($('#zombieGiantLeft').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('left', 780)

      $('#zombieGiantLeft').remove()
      repositionEnemy('zombieGiantLeft', 1000)
    }

    if (collision16.length > 0) {
      speedUp()
      dificultyUp()
      powerUp()
      enemyDeaths = enemyDeaths + 1
      score = score + 200

      positionTop = parseInt($('#zombieGiantRight').css('top'))
      positionLeft = parseInt($('#zombieGiantRight').css('left'))

      explosion(positionTop, positionLeft)
      $('#fireballLeft').css('left', 780)

      $('#zombieGiantRight').remove()
      repositionEnemy('zombieGiantRight', 1000)
    }

    if (collision17.length > 0) {
      hit = 4
      damage()
      canMoveGiantZombieLeft = false
      $('#zombieGiantLeft').removeClass('zombieGiant-run-left')
      $('#zombieGiantLeft').addClass('zombieGiant-attack-left')
    } else {
      canMoveGiantZombieLeft = true
      $('#zombieGiantLeft').addClass('zombieGiant-run-left')
      $('#zombieGiantLeft').removeClass('zombieGiant-attack-left')
    }

    if (collision18.length > 0) {
      hit = 4
      damage()
      canMoveGiantZombieRight = false
      $('#zombieGiantRight').removeClass('zombieGiant-run-right')
      $('#zombieGiantRight').addClass('zombieGiant-attack-right')
    } else {
      canMoveGiantZombieRight = true
      $('#zombieGiantRight').addClass('zombieGiant-run-right')
      $('#zombieGiantRight').removeClass('zombieGiant-attack-right')
    }
  } // Fim da Collisions

  // Aumenta a velocidade do inimigo cada vez que um inimigo é eliminado
  function speedUp() {
    if (speed < 3) {
      speed = speed + 0.3
    }
  }

  // Função que aumenta a barra de poder
  function powerUp() {
    power = parseInt(
      getComputedStyle(document.querySelector('#powerBar')).getPropertyValue(
        `--power`
      )
    )

    document.querySelector('#powerBar').style.setProperty(`--power`, power + 10)

    if(power == 100) {
      console.log('MAX')
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
    if (life >= 0) {
      // Se for diferente de 0 e estiver em contato com o zumbi, irá diminuir
      document.querySelector('#lifeBar').style.setProperty(`--life`, life - hit)
    }
    if (life <= 0) {
      // Game Over
      game_over()
    }
  }

  // Reposiciona o inimigo
  function repositionEnemy(enemy, time = 1500) {
    if (!gameOver) {
      if (enemy == 'zombieRight') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombie1Right' class='zombie-1-right zombie1-run-right'>"
          )
        }, time)
      } else if (enemy == 'zombieLeft') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombie1Left' class='zombie-1-left zombie1-run-left'>"
          )
        }, time)
      } else if (enemy == 'zombieArmorLeft') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombieArmorLeft' class='zombieArmor-left zombieArmor-run-left'></div>"
          )
        }, time)
      } else if (enemy == 'zombieArmorRight') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombieArmorRight' class='zombieArmor-right zombieArmor-run-right'></div>"
          )
        }, time)
      } else if (enemy == 'zombieGiantLeft') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombieGiantLeft' class='zombieGiant-left zombieGiant-run-left'></div>"
          )
        }, time)
      } else if (enemy == 'zombieGiantRight') {
        setTimeout(() => {
          $('#backGame').append(
            "<div id='zombieGiantRight' class='zombieGiant-right zombieGiant-run-right'></div>"
          )
        }, time)
      }
    }
  }

  function dificultyUp() {
    if (zombieArmorAppearence) {
      if (enemyDeaths >= 2) {
        repositionEnemy('zombieArmorLeft')
        repositionEnemy('zombieArmorRight')
        zombieArmorAppearence = false
      }
    } else if (giantZombieAppearence) {
      // Invoca o zombie gigante
      if (enemyDeaths >= 5) {
        repositionEnemy('zombieGiantLeft')
        repositionEnemy('zombieGiantRight')
        giantZombieAppearence = false
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

    var explosionTime = window.setInterval(removeExplosion, 300)

    function removeExplosion() {
      $('#explosion').remove()
      window.clearInterval(explosionTime)
      explosionTime = null
    }
  }

  // ENEMYS

  // Função responsavel pela movimentação dos inimigos
  function enemyMove(
    canMoveZombie1Right,
    canMoveZombie1Left,
    canMoveZombieArmorRight,
    canMoveZombieArmorLeft,
    canMoveGiantZombieLeft,
    canMoveGiantZombieRight
  ) {
    // Verifica se pode se movimentar e qual inimigo
    if (canMoveZombie1Right) {
      var positionX = parseInt($('#zombie1Right').css('left'))
      $('#zombie1Right').css('left', positionX + speed)

      if (positionX > 745) {
        $('#zombie1Right').css('left', 0)
      }
    }

    if (canMoveZombie1Left) {
      // Posição do sprite
      var positionX = parseInt($('#zombie1Left').css('left'))
      // Movimentando o sprite
      $('#zombie1Left').css('left', positionX - speed)

      // Verifica se o sprite chegar no limite da tela será reposicionado
      if (positionX <= 0) {
        $('#zombie1Left').css('left', 745)
      }
    }
    if (canMoveZombieArmorLeft) {
      var positionX = parseInt($('#zombieArmorLeft').css('left'))
      $('#zombieArmorLeft').css('left', positionX - speed)

      if (positionX <= 0) {
        $('#zombieArmorLeft').css('left', 745)
      }
    }
    if (canMoveZombieArmorRight) {
      var positionX = parseInt($('#zombieArmorRight').css('left'))
      $('#zombieArmorRight').css('left', positionX + speed)

      if (positionX > 745) {
        $('#zombieArmorRight').css('left', 0)
      }
    }
    if (canMoveGiantZombieLeft) {
      var positionX = parseInt($('#zombieGiantLeft').css('left'))
      $('#zombieGiantLeft').css('left', positionX - speed)

      if (positionX <= 0) {
        $('#zombieGiantLeft').css('left', 745)
      }
    }
    if (canMoveGiantZombieRight) {
      var positionX = parseInt($('#zombieGiantRight').css('left'))
      $('#zombieGiantRight').css('left', positionX + speed)

      if (positionX > 745) {
        $('#zombieGiantRight').css('left', 0)
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
    $('#zombieArmorRight').remove()
    $('#zombieArmorLeft').remove()
    $('#zombieGiantLeft').remove()
    $('#zombieGiantRight').remove()
    $('#moveLeft-button').remove()
    $('#moveRight-button').remove()
    $('#fireball-button').remove()
    $('#lifeBar').remove()

    $('#backGame').append("<div id='over'></div>")
    $('#over').html(
      "<h2 id='gameOverTitle'>Game Over</h2><p id='scores'>Score: " +
        score +
        '<br /><p id="deathsEnemys">Enemy Deaths: ' +
        enemyDeaths +
        '</p>' +
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

// Função que cria a tela de instruções
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
      "<button id='btnBack' onClick=backMenu()>Back Menu</button>" +
      '</div>'
  )
} // Fim da função instructions

// Função de voltar para o menu
function backMenu() {
  $('#gameInstructions').remove()
  $('#menu-start').show()
} // Fim da função backMenu
