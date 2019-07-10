---
layout: post
title: Some Ionic v3 to v4 Gotchas
date: '2019-07-10'
author: Michael Callaghan
tags: ionic,angular,typescript
layout: post
feature: assets/img/ionic-logo.png
thumbnail: https://walkingriver.com/assets/img/ionic-logo.png
cover_image: https://walkingriver.com/assets/img/ionic-logo.png
canonical_url: https://walkingriver.com/ionic-3-to-4-gotchas/
published: true
---

Not long ago I posted an [article about upgrading an app from Ionic v3 to v4](https://walkingriver.com/ionic-3-to-4/). While adding some more features, I found that there are some gotchas that aren not entirely intuitive, particularly when updating the UI after dismissing things like alerts. The issue is easy enough to work around, but it took me some time to figure it out. This post describes one solution I discovered.

<!--more-->

# The Issue
The code shown below is a simple confirmation dialog, as written with Ionic v3. The user is being asked "are you sure you want to delete this?" If the user selects `Cancel`, nothing happens. However, if the user selects `Delete`, the delete happens in the handler function, which uses `async` and `await` to wait for the delete to finish. The delete function returns the updated list of games, and the list is bound to the component's markup with an `*ngFor`. 

```ts
async deleteGame(game: Game) {
  let alert = this.alertCtrl.create({
    header: 'Confirm delete',
    message: 'Are you really sure you want to delete this game?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        handler: async () => {
          console.log('Delete clicked');
          await this.games = this.gameService.delete(game.id);
        }
      }
    ]
  });

  alert.present();
}
```

In Ionic v3, this function worked properly. Clicking the `Delete` button caused the game to be deleted and the UI to refresh as expected. 

However, as soon as I dropped it into my Ionic v4 project, I immediately started having problems. First, I got a type error in the `create` line. With v4, the AlertController's `create` function returns `Promise<AlertController>` rather than the object directly. Fixing that was as simple as adding an `await` to the front of the `create` line.

# No UI Updates
Once the compiler error was addressed, it seemed like everything would just work. Unfortunately, it did not. Though it compiled just fine, the UI would not refresh after the game was deleted. At first, I thought there was an error with my delete code, but that was not the case. 

What I discovered was that the delete was happening and the games array was being updated properly, but somehow outside of the rendering process. I had immediate flashbacks to the Angular 1.x digest cycle. 

My first thought was to add a `window.setTimeout` to `Delete` button's handler function. Two things stopped me. First, it felt like a kludge; and second, I was not sure it would even work. 

# The Fix
I looked around online for others having the same problem, but it seemed I was the only one. That is never encouraging. So obviously I was missing some subtlety with the code, and maybe it working in v3 was a happy accident.

The clue to my fix came from the fact that almost all of the `AlertController` functions return promises, and not just its `create` function. What if I have to await more of them. I added an `await` to the `present` function, but the behavior did not change. 

From there, I reviewed the `AlertController` API docs a little more closely, and noticed it has some extra functions I could call. The one that seemed relevant is `onDidDismiss`, which returns a promise that resolves (surprise!) after the alert has been dismissed. 

The updated code is below. I added three lines and changed two.

```ts
async deleteGame(game: Game) {
  let updatedGames: Game[];   // NEW 

  let alert = await this.alertCtrl.create({
    header: 'Confirm delete',
    message: 'Are you really sure you want to delete this game? This cannot be undone.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        handler: async () => {
          console.log('Delete clicked');
          updatedGames = await this.gameService.delete(game.id); // CHANGE
        }
      }
    ]
  });

  await alert.present();  // CHANGE
  await alert.onDidDismiss(); // NEW 
  this.games = updatedGames || this.games; // NEW 
}
```

Instead of immediately updating my component's `games` array, I created a local array to hold the results of the `delete` function. From there, I decided to `await` the `present` function, and then immediately `await onDidDismiss()`. After it returns, the code sets the component's `games` array to either the new list, if it exists, or itself. Yes, I could have used a conditional, but I prefer the more concise syntax.

# Conclusion
Is this the right solution? Are there better or cleaner solutions? Maybe. This approach seemed simple enough, and it works. Thus, I am sharing with the world in the hope that it might help someone else. If you find a better solution, feel free to let me know.

I ran into the same problem with the `PickerController`. It, too, has a similar API, and the solution was the same.

# References
- [Ionic Framework Alert Controller](https://ionicframework.com/docs/api/alert)
- [Ionic Framework Picker Controller](https://ionicframework.com/docs/api/picker)

# Feedback Appreciated
Do you have any comments or questions? Did I make any mistakes in this post? Let me know on Twitter. I'm [@walkingriver](https://twitter.com/walkingriver).
