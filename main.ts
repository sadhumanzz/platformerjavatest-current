// BASIC INITS
let playerController = sprites.create(assets.image`myImage1`, SpriteKind.Player)
let cameraController = sprites.create(assets.image`cameraSprite`, SpriteKind.CameraSprite)

playerController.z = 300

tiles.setCurrentTilemap(tilemap`level2`)
scene.setBackgroundColor(15)

let levelSet = [tilemap`level0`,
tilemap`level2`]

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
let minSpeed: number = (5.7 * ppu) * deltaTime

let playerFriction: number = maxSpeed / 1.2
let playerAirFriction: number = maxSpeed / 2

let playerDied: boolean = false

let cameraTransitioning: boolean = false

cameraController.setFlag(SpriteFlag.Invisible, true)
scene.cameraFollowSprite(cameraController)

namespace SpriteKind {
    export const StationaryProjectileEnemy = SpriteKind.create()
    export const DirectionalProjectileEnemy = SpriteKind.create()
    export const CameraSprite = SpriteKind.create()
}

//https://forum.makecode.com/t/extension-arcade-screen-transitions/23834
//https://arcade.makecode.com/S24496-97237-56961-49632
//https://arcade.makecode.com/S04393-06456-09228-87946

tileUtil.createSpritesOnTiles(img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . 4 4 . . . . . . .
    . . . . . . . 4 4 . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`, img`
    ................................
    ................................
    ................................
    ................................
    ...............11...............
    ...............11...............
    ..............1241..............
    ..............1241..............
    ........111..122441..111........
    ........14411ffffff11441........
    ........12244ffffff24441........
    .........122ffffff5f241.........
    .........12ffffffff5f21.........
    ........1ffffff11ffffff1........
    ......114fffff1441fffff411......
    ....11444ffff124441ffff44411....
    ....11222ffff122441ffff22211....
    ......112fffff1221fffff211......
    ........1ffffff11ffffff1........
    .........14ffffffffff41.........
    .........144ffffffff441.........
    ........14422ffffff22441........
    ........14211ffffff11241........
    ........111..122441..111........
    ..............1241..............
    ..............1241..............
    ...............11...............
    ...............11...............
    ................................
    ................................
    ................................
    ................................
`, SpriteKind.Enemy)

tileUtil.createSpritesOnTiles(assets.image`myImage2`,
    img`
        . . . . . . 1 1 1 1 1 . . . . . .
        . . . . 1 1 f f f f f 1 1 . . . .
        . . . 1 f f f f f f f f f 1 . . .
        . . 1 f f f f f f f f f f f 1 . .
        . 1 f f f f 1 1 1 1 1 f f f f 1 .
        . 1 f f f 1 1 1 1 1 1 1 f f f 1 .
        1 f f f 2 1 1 1 1 1 1 1 2 f f f 1
        1 f f f 2 f f 1 1 1 f f 2 f f f 1
        1 f f f f f 2 f 1 f 2 f f f f f 1
        2 f f f f 1 f f 1 f f 1 f f f f 2
        1 f f f 1 f f 1 1 1 f f 1 f f f 1
        . 2 f f f 2 1 1 1 1 1 2 f f f 2 .
        . 2 f f f f 1 f 1 f 1 f f f f 2 .
        . . 2 f f f f f f f f f f f 2 . .
        . . . 2 f f f f f f f f f 2 . . .
        . . . . 2 2 f f f f f 2 2 . . . .
        . . . . . . 2 2 2 2 2 . . . . . .
    `, SpriteKind.StationaryProjectileEnemy)

tileUtil.createSpritesOnTiles(assets.image`myImage4`,
    img`
        . . . . . . 1 1 1 1 1 . . . . . .
        . . . . 1 1 f f f f f 1 1 . . . .
        . . . 1 f f f f f f f f f 1 . . .
        . . 1 f f f f f f f f f f f 1 . .
        . 1 f f f f 1 1 1 1 1 f f f f 1 .
        . 1 f f f 1 1 1 1 1 1 1 f f f 1 .
        1 f f f 2 1 1 1 1 1 1 1 2 f f f 1
        1 f f f 2 f f 1 1 1 f f 2 f f f 1
        1 f f f f f 2 f 1 f 2 f f f f f 1
        2 f f f f 1 f f 1 f f 1 f f f f 2
        1 f f f 1 f f 1 1 1 f f 1 f f f 1
        . 2 f f f 2 1 1 1 1 1 2 f f f 2 .
        . 2 f f f f 1 f 1 f 1 f f f f 2 .
        . . 2 f f f f f f f f f f f 2 . .
        . . . 2 f f f f f f f f f 2 . . .
        . . . . 2 2 f f f f f 2 2 . . . .
        . . . . . . 2 2 2 2 2 . . . . . .
    `, SpriteKind.StationaryProjectileEnemy)

sprites.onCreated(SpriteKind.Player, function (sprite: Sprite) {

    tiles.placeOnRandomTile(sprite, assets.tile`blueRespawn`)
})

// Frame Update Loop
game.onUpdate(function () {

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
    if (!playerDied) {
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
    }
    //animate player


    //environment interaction
    if (!controller.player1.isPressed(ControllerButton.Down)) {
        if (playerController.vy >= 0) {
            if (playerController.tileKindAt(TileDirection.Bottom, img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `)) {
                tileUtil.setWalls(img`
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, true)
            } else {
                tileUtil.setWalls(img`
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    f f f f f f f f f f f f f f f f
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, false)
            }
        } else {
            tileUtil.setWalls(img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `, false)
        }
    } else {
        tileUtil.setWalls(img`
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            f f f f f f f f f f f f f f f f
            f f f f f f f f f f f f f f f f
            f f f f f f f f f f f f f f f f
            f f f f f f f f f f f f f f f f
            f f f f f f f f f f f f f f f f
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, false)
    }

    if (!controller.player1.isPressed(ControllerButton.Down)) {
        if (playerController.vy >= 0) {
            if (playerController.tileKindAt(TileDirection.Bottom, img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `)) {
                tileUtil.setWalls(img`
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, true)
            } else {
                tileUtil.setWalls(img`
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 f f f f f f f f f f f f f f
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, false)
            }
        } else {
            tileUtil.setWalls(img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 f f f f f f f f f f f f f f
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `, false)
        }
    } else {
        tileUtil.setWalls(img`
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 f f f f f f f f f f f f f f
            1 1 f f f f f f f f f f f f f f
            1 1 f f f f f f f f f f f f f f
            1 1 f f f f f f f f f f f f f f
            1 1 f f f f f f f f f f f f f f
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, false)
    }

    if (!controller.player1.isPressed(ControllerButton.Down)) {
        if (playerController.vy >= 0) {
            if (playerController.tileKindAt(TileDirection.Bottom, img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `)) {
                tileUtil.setWalls(img`
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, true)
            } else {
                tileUtil.setWalls(img`
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    f f f f f f f f f f f f f f 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, false)
            }
        } else {
            tileUtil.setWalls(img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                f f f f f f f f f f f f f f 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `, false)
        }
    } else {
        tileUtil.setWalls(img`
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            f f f f f f f f f f f f f f 1 1
            f f f f f f f f f f f f f f 1 1
            f f f f f f f f f f f f f f 1 1
            f f f f f f f f f f f f f f 1 1
            f f f f f f f f f f f f f f 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, false)
    }
    //camera control

    if (!playerDied) {

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
        cameraController.y = playerController.y

    }


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
        characterAnimations.runFrames(playerController, [img`
            ................
            ................
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
            f...11111111...f
        `, img`
            ................
            ................
            ................
            ................
            ................
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            f..1111111111..f
        `, img`
            ................
            ................
            ................
            ................
            ................
            ................
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            ..111111111111..
            f.111111111111.f
        `, img`
            ................
            ................
            ................
            ................
            ................
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            ...1111111111...
            f..1111111111..f
        `, img`
        ................
        ................
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
        f...11111111...f
    ` ], 50, characterAnimations.rule(Predicate.HittingWallDown))

    }

    if (!playerDied) {
        for (let value of sprites.allOfKind(SpriteKind.StationaryProjectileEnemy)) {

            if (spriteutils.distanceBetween(value, playerController) < 80) {

                timer.throttle("StationaryProjectileEnemy_Fire", 2000, function () {
                    let enemy_projectile = sprites.createProjectileFromSprite(img`
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . 4 4 . . . . . . .
                        . . . . . . 4 4 4 4 . . . . . .
                        . . . . . . 4 4 4 4 . . . . . .
                        . . . . . . . 4 4 . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                    `, value, 0, 0)

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
    playerDied = true

    let bloodEffect = extraEffects.createSingleColorSpreadEffectData(2, ExtraEffectPresetShape.Spark)
    bloodEffect.gravity = 200
    sprites.destroy(playerController)

    timer.throttle("Die_Splat", 500, function () {
        extraEffects.createSpreadEffectAt(bloodEffect, playerController.x, playerController.y, 100, 80, 30)

        scene.cameraShake(5, 200)
    })

    timer.after(750, function () {
        playerController = sprites.create(assets.image`myImage1`, SpriteKind.Player)
        tiles.placeOnRandomTile(playerController,assets.tile`blueRespawn`)
        playerDied = false

        scene.cameraFollowSprite(cameraController)

    })

}

if (!playerDied) {
    scene.onOverlapTile(SpriteKind.Player, img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 4 4 . . . . . . .
        . . . . . . 4 4 4 4 . . . . . .
        . . . . . 4 4 4 4 4 4 . . . . .
        . . . . 4 4 4 f f 4 4 4 . . . .
        . . . 4 4 4 f f f f 4 4 4 . . .
        . . 4 4 4 f f f f f f 4 4 4 . .
        . 4 4 4 f f f f f f f f 4 4 4 .
        4 4 4 f f f f f f f f f f 4 4 4
        4 4 f f f f f f f f f f f f 4 4
    `, function (sprite: Sprite, location: tiles.Location) {
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

scene.onOverlapTile(SpriteKind.Player, img`
    . . . . . . . 9 9 . . . . . . .
    . . . . . . 9 9 9 9 . . . . . .
    . . . . . 9 9 9 9 9 9 . . . . .
    . . . . 9 9 9 f f 9 9 9 . . . .
    . . . 9 9 9 f f f f 9 9 9 . . .
    . . 9 9 9 f f 9 9 f f 9 9 9 . .
    . 9 9 9 f f 9 9 9 9 f f 9 9 9 .
    9 9 9 f f 9 9 9 9 9 9 f f 9 9 9
    9 9 f f 9 9 9 f f 9 9 9 f f 9 9
    f f f 9 9 9 f f f f 9 9 9 f f f
    f f 9 9 9 f f f f f f 9 9 9 f f
    f 9 9 9 f f f f f f f f 9 9 9 f
    9 9 9 f f f f f f f f f f 9 9 9
    9 9 f f f f f f f f f f f f 9 9
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
`, function (sprite: Sprite, location: tiles.Location) {
    let jumpEffect = extraEffects.createSingleColorSpreadEffectData(9, ExtraEffectPresetShape.Twinkle)

    playerController.vy = jumpVelocity * 1.5

    jumpEffect.extraVY = -40

    timer.throttle("action", 600, function () {
        extraEffects.createSpreadEffectAt(jumpEffect, playerController.x, playerController.y, 1000)
    })
})

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

scene.onOverlapTile(SpriteKind.Player, assets.tile`redRespawn`
    , function (sprite: Sprite, location: tiles.Location) {
        tileUtil.replaceAllTiles(assets.tile`blueRespawn`, assets.tile`redRespawn`)

        tiles.setTileAt(tiles.getTileLocation(location.col, location.row), assets.tile`blueRespawn`)

        timer.throttle("projectileExplode", 100, function () {
            scene.cameraShake(2, 100)
            extraEffects.createSpreadEffectAt(extraEffects.createSingleColorSpreadEffectData(9, ExtraEffectPresetShape.Spark), sprite.x, sprite.y, 15)

        })
    })

