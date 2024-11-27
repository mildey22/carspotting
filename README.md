# Carspotting mobile application

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

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
- TypeScript
- JavaScript
- Vite
- NPM

## Prerequisites

- Firebase realtime database setup
- Firebase storage setup
- Node Package Manager
- Node.js
- Vite

## Installation

- Clone the repository from https://github.com/mildey22/carspotting.git
- Navigate to the project directory
- Run ```npm install``` in your system console to install the required dependencies

## Usage

- Please note, that you'll need to create a .env file with the required API keys to save data to Firebase. ALso ensure that you've correctly set up Firebase realtime database and storage.
- To start the development environment, run ```npx expo start```. The application can then for example be viewed in the Expo Go app, or your chosen emulator.