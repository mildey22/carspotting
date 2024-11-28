# Carspotting mobile application

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)

## Description

- The Carspotting app is designed to save exotic/rare/interesting cars you've spotted.
- Designed with a user-friendly UI in mind, the app is developed for iOS.
- The most important features are the ability to save the cars to a database as well as view a list of the cars you've spotted.
- Latest updates can be found at https://github.com/mildey22/carspotting.
- The project is being developed by a student for a Mobile Programming course at Haaga-Helia University of Applied Sciences.

## Features

- Ability to add the details of the car as well as a photo and a location
- Data is uploaded to Firebase realtime database and images to Firebase storage
- Ability to view the car's details after saving, as well as the photo and location
- Hand-translated app-wide language support for select languages
- Modern and fine tuned UI designed with a native iOS experience in-mind

## Technologies

- React Native
- Expo
- Firebase realtime database
- Firebase storage
- i18next and react-i18next
- TypeScript
- JavaScript
- NPM

## Prerequisites

- Firebase realtime database setup
- Firebase storage setup
- Node Package Manager
- Node.js

## Installation

- Clone or download the repository from https://github.com/mildey22/carspotting.git
- Navigate to the project directory
- Run `npm install` in your system console to install the required dependencies

## Usage

- Please note, that you'll need to create a `.env` file with the required API keys to save data to Firebase. Also ensure that you've correctly set up Firebase realtime database and storage.
- The .env file should be constructed as following:

```.env
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
EXPO_PUBLIC_FIREBASE_DATABASE_URL=your-firebase-database-url
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

- To start the development environment, run `npx expo start`. The application can then be viewed in the Expo Go app, or an emulator of your choice.

## Known issues

- Changing language moves the user to the main screen of the application. This is due to the settings text at the bottom nvaigator being translated as well.
- `App.jsx` should be converted into a `.tsx` file, but there's an problem with the `<Tab.Navigator>` component when doing so.
- Most functions should be decentralized into a seperate `components` directory, but this requires extensive reworking of the logic.
- Opening the map in `AddCar.tsx` should scroll the user to the bottom of the page, revealing the map fully, but this doesn't happen.
- The [throbber](https://en.wikipedia.org/wiki/Throbber) that displays when an image is loading in `CarList.tsx` should be centered where the photo is, but this doesn't happen.

## Credits

- Special thanks to Chris and Samuel for the French and Hungarian translations, respectively.
