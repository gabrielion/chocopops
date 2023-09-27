var bulletTime1 = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
    }

}

function collisions()
{
    bullet_collision();
    player_collision();
    player_falling();
    // Assuming `enemy` is your enemy mesh.
    // moveEnemy(player2);

}

// function moveEnemy(enemy) {
//     var moveTo = new THREE.Vector3(
//         enemy.speed * Math.cos(0.2) + enemy.position.x,
//         enemy.speed * Math.sin(0.2) + enemy.position.y,
//         enemy.graphic.position.z
//     );

//     enemy.position = moveTo;

//     if (enemy.speed > 0) {
//         enemy.speed -= 0.04;
//     } else if (enemy.speed < 0) {
//         enemy.speed += 0.04;
//     }

//     enemy.graphic.position.x = enemy.position.x;
//     enemy.graphic.position.y = enemy.position.y;
// }


function bullet_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }
    //collision with player 2
    if (player2.life > 0){
        for (var i = 0; i < player1.bullets.length; i++)
        {
            if (Math.abs(player1.bullets[i].position.x) - player2.position.x <= 1.5 &&
                Math.abs(player1.bullets[i].position.y) - player2.position.y <= 1.5)
            {
                scene.remove(player1.bullets[i]);
                player1.bullets.splice(i, 1);
                i--;
                player2.life--;
                if (player2.life <= 0) {
                    scene.remove(player2.graphic)
                    showMessage("You Win!");
                }
                console.log("player 2 lost a life!", player2.life)
            }
        }
    }
}

function showMessage(message) {
    // Create a div element to hold the win message using jQuery
    var winMessageDiv = $('<div>')
        .attr('id', 'win-message')
        .html(`<strong>${message}</strong>`)
        .css({
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            marginTop: '50px'
        });

    // Append the win message div to the body of the HTML
    $('body').append(winMessageDiv);

    // Schedule the removal of the win message after 3 seconds using jQuery
    setTimeout(function () {
        $('#win-message').remove();
        $("#container").html("");
        init();
    }, 3000); // 3000 milliseconds = 3 seconds
}


function player_collision()
{
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if ( x > WIDTH ){
        player1.graphic.position.x -= x - WIDTH;
        player1.position.x -= x - WIDTH;
    }
    if ( x < 0 ){
        player1.graphic.position.x -= x;
        player1.position.x -= x;
    }
    if ( y < 0 ){
        player1.graphic.position.y -= y;
        player1.position.y -= y;
    }
    if ( y > HEIGHT ){
        player1.graphic.position.y -= y - HEIGHT;
        player1.position.y -= y - HEIGHT;
    }


    if (!player1.isInvincible &&
        Math.abs(player1.position.x) - player2.position.x <= 0.4 &&
        Math.abs(player1.position.y) - player2.position.y <= 0.5){
        player1.life--;
        if (player1.life <= 0){
            scene.remove(player1.graphic)
            showMessage("You Lost!");
        }
        console.log("you lost a life! life count:", player1.life);
        player1.isInvincible = true;
        setTimeout(function(){
            player1.isInvincible = false;
        }, 3000);
    }

}

function player_falling()
{
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];
        // if (element == null) {
        //    element = [0, 0];
        // } 

        var tileX = (element[0] - sizeOfTileX / 2) | 0;
        var tileY = (element[1] - sizeOfTileY / 2) | 0;
        var mtileX = (element[0] + sizeOfTileX / 2) | 0;
        var mtileY = (element[1] + sizeOfTileY / 2) | 0;

        if ((x > tileX)
            && (x < mtileX)
            && (y > tileY) 
            && (y < mtileY))
        {
           player1.dead();
        }
    }

}
