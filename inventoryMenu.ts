//basic inits
let inventoryVisible: boolean = false
let holdingOrgan: boolean = false

namespace SpriteKind {
    export const MenuItem = SpriteKind.create()
    export const Organ = SpriteKind.create()
}

sprites.onCreated(SpriteKind.MenuItem, function(sprite: Sprite) {
    sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite.setFlag(SpriteFlag.Invisible, true)
})

sprites.onCreated(SpriteKind.Organ, function (sprite: Sprite) {
    sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite.setFlag(SpriteFlag.Invisible, true)
    sprite.z = 99
    sprites.setDataBoolean(sprite, "Selected", false)
})

let menuBackground = sprites.create(assets.image`menuBackground`, SpriteKind.MenuItem)
let cursorSprite = sprites.create(assets.image`cursorSprite`, SpriteKind.MenuItem)

menuBackground.z = 97
cursorSprite.z = 99

let head = sprites.create(assets.image`Brain`, SpriteKind.Organ)
let body = sprites.create(assets.image`Stomach`, SpriteKind.Organ)

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {

    if (inventoryVisible) {
        closeInventory()
    } else {
        openInventory()
    }

})

function openInventory() {
    inventoryVisible = true
    menuBackground.setFlag(SpriteFlag.Invisible, false)
    head.setFlag(SpriteFlag.Invisible, false)
    body.setFlag(SpriteFlag.Invisible, false)
    cursorSprite.setFlag(SpriteFlag.Invisible, false)

    grid.place(cursorSprite, tiles.getTileLocation(1, 2))
    grid.place(head, tiles.getTileLocation(6, 2))
    grid.place(body, tiles.getTileLocation(6, 3))

    playerImmobile = true
    grid.moveWithButtons(cursorSprite)
}

function closeInventory() {
    inventoryVisible = false
    menuBackground.setFlag(SpriteFlag.Invisible, true)
    cursorSprite.setFlag(SpriteFlag.Invisible, true)
    head.setFlag(SpriteFlag.Invisible, true)
    body.setFlag(SpriteFlag.Invisible, true)
    playerImmobile = false
    grid.moveWithButtons(null)

}

controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function() {
    if (inventoryVisible && grid.getLocation(cursorSprite) == tiles.getTileLocation(6, 3)) {

        body.setImage(assets.image`Selected Stomach`)
    }
})