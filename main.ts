// BASIC INITS
let playerController = sprites.create(assets.image`PlayerSprite`, SpriteKind.Player)
let cameraController = sprites.create(assets.image`cameraSprite`, SpriteKind.CameraSprite)

playerController.z = 1

tiles.setCurrentTilemap(tilemap`level0`)
scene.setBackgroundColor(15)

let levelSet =[tilemap`level0`,
tilemap`level1`, 
tilemap`level2`]
let nextLevel: number = 0

let ppu = 16

let deltaTime: number = Delta.DELTA() //ΔT

let gravity: number = 10 * ppu
let jumpVelocity: number = -(10 * ppu)
let fallVelocity: number = 20 * ppu
let cutJumpHeight: number = -(3.5 * ppu)

let jumpPressedRemember: number = 0
let jumpPressedRememberTime: number = 5
let groundedRemember: number = 0
let groundedRememberTime: number = 5

let jumping: boolean = false
let falling: boolean = false

let maxSpeed: number = (18 * ppu) * deltaTime
let minSpeed: number = (6.5 * ppu) * deltaTime
//5.7 min
let playerFriction: number = maxSpeed / 1.2
let playerAirFriction: number = maxSpeed / 2

let playerImmobile: boolean = false

let cameraTransitioning: boolean = false

cameraController.setFlag(SpriteFlag.Invisible, true)
scene.cameraFollowSprite(cameraController)

initLevel()
namespace SpriteKind {
    export const StationaryProjectileEnemy = SpriteKind.create()
    export const DirectionalProjectileEnemy = SpriteKind.create()
    export const MovingProjectileEnemy = SpriteKind.create()
    export const MovingMeleeEnemy = SpriteKind.create()
    export const CameraSprite = SpriteKind.create()
}

//https://forum.makecode.com/t/extension-arcade-screen-transitions/23834
//https://arcade.makecode.com/S24496-97237-56961-49632
//https://arcade.makecode.com/S04393-06456-09228-87946

sprites.onCreated(SpriteKind.Player, function (sprite: Sprite) {

    tiles.placeOnRandomTile(sprite, assets.tile`blueRespawn`)
})

// Frame Update Loop
game.onUpdate(function () {
    if (!playerImmobile) {
        //coyote time
        groundedRemember -= deltaTime
        if (playerController.isHittingTile(CollisionDirection.Bottom)) {
            groundedRemember = groundedRememberTime
        }

        //apply jump
        controller.up.onEvent(ControllerButtonEvent.Released, function () {
            if (playerController.vy < -30) {
                playerController.vy = cutJumpHeight
            }
        })

        if ((jumpPressedRemember > 0) && (groundedRemember > 0)) {
            jumpPressedRemember = 0
            groundedRemember = 0
            playerController.vy = jumpVelocity

        }

        //apply gravity
        if (!playerController.isHittingTile(CollisionDirection.Bottom)) {
            if (controller.down.isPressed() && !controller.up.isPressed()) {
                playerController.ay = fallVelocity * 16
            } else {
                if (playerController.ay > 0) {
                    playerController.ay = fallVelocity
                } else {
                    playerController.ay = gravity
                }
                playerController.fx = playerAirFriction
            }
        } else {
            playerController.ay = 0
            playerController.fx = playerFriction
        }

        //control movement
            if (controller.left.isPressed() || controller.right.isPressed()) {
                (playerController.vx = minSpeed * Math.sign(controller.player1.dx())) * Delta.DELTA()
            } else {
                (playerController.ax = maxSpeed * Math.sign(controller.player1.dx())) * Delta.DELTA()
            }
            
        //jump queue
        jumpPressedRemember -= deltaTime
        if (controller.up.isPressed()) {
            jumpPressedRemember = jumpPressedRememberTime
        }

        //animate player
        characterAnimations.runFrames(playerController, [img`
        f . . . . . . . . . . . . f
        . . . . . . . . . . . . . .
        . . . . . . . . . . . . . .
        . . . . . . . . . . . . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        f . . 1 1 1 1 1 1 1 1 . . f
    `, img`
        f..............f
        ................
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        f...11111111...f
    `, img`
        f....111111....f
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        .....111111.....
        f....111111....f
    `], 100, characterAnimations.rule(Predicate.MovingUp))

        characterAnimations.runFrames(playerController, [img`
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            .....111111.....
            f....111111....f
        `, img`
        ................
        ................
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        ....11111111....
        f...11111111...f
    `, img`
        . . . . . . . . . . . . . .
        . . . . . . . . . . . . . .
        . . . . . . . . . . . . . .
        . . . . . . . . . . . . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 . . .
        f . . 1 1 1 1 1 1 1 1 . . f
    `], 100, characterAnimations.rule(Predicate.MovingDown))


        //environment interaction
        if (!controller.player1.isPressed(ControllerButton.Down)) {
            if (playerController.vy >= 0) {
                if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`PlatformMiddle`)) {
                    tileUtil.setWalls(assets.tile`PlatformMiddle`, true)
                } else {
                    tileUtil.setWalls(assets.tile`PlatformMiddle`, false)
                }
            } else {
                tileUtil.setWalls(assets.tile`PlatformMiddle`, false)
            }
        } else {
            tileUtil.setWalls(assets.tile`PlatformMiddle`, false)
        }

        if (!controller.player1.isPressed(ControllerButton.Down)) {
            if (playerController.vy >= 0) {
                if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`PlatformLeft`)) {
                    tileUtil.setWalls(assets.tile`PlatformLeft`, true)
                } else {
                    tileUtil.setWalls(assets.tile`PlatformLeft`, false)
                }
            } else {
                tileUtil.setWalls(assets.tile`PlatformLeft`, false)
            }
        } else {
            tileUtil.setWalls(assets.tile`PlatformLeft`, false)
        }

        if (!controller.player1.isPressed(ControllerButton.Down)) {
            if (playerController.vy >= 0) {
                if (playerController.tileKindAt(TileDirection.Bottom, assets.tile`PlatformRight`)) {
                    tileUtil.setWalls(assets.tile`PlatformRight`, true)
                } else {
                    tileUtil.setWalls(assets.tile`PlatformRight`, false)
                }
            } else {
                tileUtil.setWalls(assets.tile`PlatformRight`, false)
            }
        } else {
            tileUtil.setWalls(assets.tile`PlatformRight`, false)
        }
        //camera control
        timer.throttle("camTransition", 500, function() {
            if (playerController.x > cameraController.right) {
                let currentPosX: number = cameraController.x
                let targetPosX: number = currentPosX + (screen.width)
                spriteutils.moveTo(cameraController, spriteutils.pos(targetPosX, cameraController.y), 500)
            } else if (playerController.x < cameraController.left) {
                let currentPosX: number = cameraController.x
                let targetPosX: number = currentPosX - (screen.width)
                spriteutils.moveTo(cameraController, spriteutils.pos(targetPosX, cameraController.y), 500)
            }
        })
    }
    cameraController.y = playerController.y




})

game.onUpdateInterval(50, function () {

    if (!playerController.isHittingTile(CollisionDirection.Bottom)) {


        if (playerController.vy > 0) {
            jumping = true
            falling = false
        } else if (playerController.vy < 0) {
            jumping = false
            falling = true
        } else if (playerController.vy == 0) {
            jumping = false
            falling = false
        }

    }

    if (!jumping && falling && (playerController.vx != 0)) {
        characterAnimations.runFrames(playerController, 
        [assets.image`HittingWallDown_01`,
         assets.image`Hitting_Wall_Down_02`, 
         assets.image`HittingWallDown_03`,
         assets.image`HittingWallDown_04`,
         assets.image`HittingWallDown_05`], 50, characterAnimations.rule(Predicate.HittingWallDown))

    }

    if (!playerImmobile) {
        for (let value of sprites.allOfKind(SpriteKind.StationaryProjectileEnemy)) {

            if (spriteutils.distanceBetween(value, playerController) < 80) {

                timer.throttle("StationaryProjectileEnemy_Fire", 2000, function () {
                    let enemy_projectile = sprites.createProjectileFromSprite(assets.image`EnemyProjectile`, value, 0, 0)

                    scene.cameraShake(3, 100)
                    spriteutils.setVelocityAtAngle(enemy_projectile, spriteutils.angleFrom(value, playerController), 100)
                    scaling.scaleByPixels(value, 4, ScaleDirection.Horizontally, ScaleAnchor.Middle)
                    scaling.scaleByPixels(value, 4, ScaleDirection.Vertically, ScaleAnchor.Middle)
                    timer.after(1000, function () {
                        scaling.scaleToPixels(value, 17, ScaleDirection.Horizontally, ScaleAnchor.Middle)
                        scaling.scaleToPixels(value, 17, ScaleDirection.Vertically, ScaleAnchor.Middle)
                    })
                })
            }
        }

    } else {
        for (let value of sprites.allOfKind(SpriteKind.Projectile)) {
            sprites.destroy(value)
        }
    }

})

function playerDie() {
    playerImmobile = true
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.CameraSprite)


    let bloodEffect = extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Spark)
    bloodEffect.gravity = 200
    timer.throttle("Die_Splat", 750, function () {
        extraEffects.createSpreadEffectAt(bloodEffect, playerController.x, playerController.y, 100, 80, 30)

        scene.cameraShake(5, 200)
    })

    timer.after(750, function () {
        sprites.destroyAllSpritesOfKind(SpriteKind.CameraSprite)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        cameraController.setFlag(SpriteFlag.Invisible, true)

        playerController = sprites.create(assets.image`PlayerSprite`, SpriteKind.Player)
        tiles.placeOnRandomTile(playerController,assets.tile`blueRespawn`)
        playerImmobile = false

        scene.cameraFollowSprite(cameraController)

    })

}

function initLevel() {
    
    tiles.setCurrentTilemap(levelSet[nextLevel])
    if (nextLevel == (levelSet.length)) {
        game.over(true)
    }

    timer.after(500, function () {
        color.startFadeFromCurrent(color.originalPalette, 500)
        tiles.placeOnRandomTile(playerController, assets.tile`blueRespawn`)
        playerController.vy += 1 * ppu
        timer.after(1000, function () {
            playerImmobile = false
        })
    })

    cameraController.x = 80
    cameraController.y = 60

    tileUtil.createSpritesOnTiles(assets.tile`SpikeAxle`,
        assets.image`SpikeBall`, SpriteKind.Enemy)
    
    tileUtil.createSpritesOnTiles(assets.tile`MovingSpikeAxle`,
        assets.image`SpikeBall`, SpriteKind.MovingMeleeEnemy)

    tileUtil.createSpritesOnTiles(assets.tile`StationaryProjectileAxle`,
        assets.image`ProjectileEnemy`, SpriteKind.StationaryProjectileEnemy)
    
    tileUtil.createSpritesOnTiles(assets.tile`MovingProjectileAxle`,
        assets.image`MovingProjectileEnemy`, SpriteKind.MovingProjectileEnemy)


    nextLevel += 1
}

if (!playerImmobile) {
    scene.onOverlapTile(SpriteKind.Player, assets.image`GroundSpike`, function (sprite: Sprite, location: tiles.Location) {
        playerDie()
    })

    scene.onOverlapTile(SpriteKind.Player, assets.tile`spikeLeft`, function (sprite: Sprite, location: tiles.Location) {
        playerDie()
    })

    scene.onOverlapTile(SpriteKind.Player, assets.tile`spikeTop`, function (sprite: Sprite, location: tiles.Location) {
        playerDie()
    })

    scene.onOverlapTile(SpriteKind.Player, assets.tile`spikeRight`, function (sprite: Sprite, location: tiles.Location) {
        playerDie()
    })



    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite) {
        playerDie()
    })

    sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite: Sprite, otherSprite: Sprite) {
        playerDie()
    })

    scene.onHitWall(SpriteKind.Projectile, function (sprite: Sprite, location: tiles.Location) {
        timer.throttle("projectileExplode", 100, function () {
            extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Spark), sprite.x, sprite.y, 30)

        })
    })

}

scene.onOverlapTile(SpriteKind.Player,assets.image`JumpBoost`, function (sprite: Sprite, location: tiles.Location) {
    let jumpEffect = extraEffects.createSingleColorSpreadEffectData(9, ExtraEffectPresetShape.Twinkle)

    playerController.vy = jumpVelocity * 1.5

    jumpEffect.extraVY = -40

    timer.throttle("action", 600, function () {
        extraEffects.createSpreadEffectAt(jumpEffect, playerController.x, playerController.y, 1000)
    })
})



scene.onOverlapTile(SpriteKind.Player, assets.tile`redRespawn`
    , function (sprite: Sprite, location: tiles.Location) {
        tileUtil.replaceAllTiles(assets.tile`blueRespawn`, assets.tile`redRespawn`)

        tiles.setTileAt(tiles.getTileLocation(location.col, location.row), assets.tile`blueRespawn`)

        timer.throttle("projectileExplode", 100, function () {
            scene.cameraShake(2, 100)
            extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(9, ExtraEffectPresetShape.Spark), sprite.x, sprite.y, 15)

        })
    })

scene.onOverlapTile(SpriteKind.Player, assets.tile`ConnectorRight_1`, function(sprite: Sprite, location: tiles.Location) {
    color.startFadeFromCurrent(color.Black, 500)
    playerImmobile = true
    initLevel()
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
    color.startFadeFromCurrent(color.Black, 500)
    playerImmobile = true
    timer.after(500, function() {
        playerDie()
        initLevel()
    })

})

sprites.onCreated(SpriteKind.MovingProjectileEnemy, function(sprite: Sprite) {
    
})

sprites.onCreated(SpriteKind.MovingMeleeEnemy, function (sprite: Sprite) {
    sprite.setVelocity(32, 0)
})

scene.onOverlapTile(SpriteKind.MovingMeleeEnemy, assets.tile`RedirectBlock`, function(sprite: Sprite, location: tiles.Location) {
    sprite.setVelocity(sprite.vx * -1, 0)
})