# Yuan Bian_ybia0747

## Instructions
### Move your mouse
Move the mouse and the apple tree will follow the mouse sideways
### Click your mouse
Each mouse click will launch an apple from the tree, and this apple will bounce back in the screen range
### Game Over
The game will end when all apples are out of the screen range

## Details
### Method
User Input
### Animated properties
#### Size
In order to leave more space for the flying apples, I adjusted the position and size of the original apple tree
#### Mouse-follow effect
The apple tree and base will follow the mouse movement
#### Launch apples
When mouse clicked, the original code apples are reduced and new apples are created to show an effect similar to the firing of apples from apple trees
### Inspiration
Inspired by the most common Arkanoid game as a child
![Arkanoid game](https://images-eu.ssl-images-amazon.com/images/I/91KvSEjoGhL.png)
### Technical explanation
I've added a FlyingBicolorCircle class that inherits from the original BicolorCircle class
Added some code that uses mouse clicks to increase the number of flying balls and decrease the code for the balls on the tree