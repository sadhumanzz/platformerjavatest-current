//basic inits
let inventoryVisible: boolean = false

namespace SpriteKind {
    export const MenuItem = SpriteKind.create()
}

sprites.onCreated(SpriteKind.MenuItem, function(sprite: Sprite) {
    sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite.setFlag(SpriteFlag.Invisible, true)
})

let menuBackground = sprites.create(assets.image`menuBackground`, SpriteKind.MenuItem)
let cursorSprite = sprites.create(assets.image`cursorSprite`, SpriteKind.MenuItem)

menuBackground.z = 99
cursorSprite.z = 99


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
    cursorSprite.setFlag(SpriteFlag.Invisible, false)

    playerImmobile = true
    grid.moveWithButtons(cursorSprite)
}

function closeInventory() {
    inventoryVisible = false
    menuBackground.setFlag(SpriteFlag.Invisible, true)
    cursorSprite.setFlag(SpriteFlag.Invisible, true)
    playerImmobile = false
    grid.moveWithButtons(null)

}
