# Spotify Clone

This is a spotify clone made with Next js v12, Tailwind, Spotify API, Recoil

## Project

- The playlists are got from your spotify user
- Spotify premium is required
- It works along with a spotify player app or web
- Responsive

## Getting started

- Install the dependencies with `yarn` or `npm i`

- Go to [developers spotify](https://developer.spotify.com/dashboard) and create a new app. Add the following to the Redirect URIs in Edit Settings (http://localhost:3000/api/auth/callback/spotify)

- Create a new file in root called `.env.local` and copy the values from `.env.sample`.

- Run `(yarn|npm) run dev` to start server in `http://localhost:3000`

- Log in with your spotify account and allow to use Spotify Api rules.

- It's necessary to start a spotify player app or web. (Just start a song with spotify an then you can control the playlists and songs with the app)
