# Magic: The Gathering Card Viewer
This is a simple card display and search tool for Magic: The Gathering. It was built using vanilla JavaScript, HTML, and CSS.

This is available on GitHub Pages [here](https://jytrowbridge.github.io/mtg-card-viewer/).

## Goal
I wanted to create a fast, easy-to-use card search tool for use during my draft games. My original idea was to be able to see what cards my opponent could play at any time. This is particularly useful when they are holding an instant spell; by picking the colors and maximum mana cost, I can have a better idea of what cards they may have.

I did not make this with constructed in mind, so the card display is limited to one set at a time.

## Notes
This page uses Scryfall's REST API to pull the cards for each set. It takes a second or two to receive a response and display the cards.

## Screenshots
![No Filter](screenshots/screenshot0.png "No Filter")

---

![Filter](screenshots/screenshot2.png "Filter")

---

![Card View](screenshots/screenshot3.png "Card View")