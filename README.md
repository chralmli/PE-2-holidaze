# Holidaze - Accommodation Booking Application

![Holidaze Screenshot](/src/assets/media/holidaze-mockup.png)

Holidaze is a modern, accommodation booking application that allows users to search for venues, view available dates, make bookings, and manage accommodation venues. This project represents the final exam for the two-year front-end development course and showcases both the visual design and technical skills learned throughout the course.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Special Instructions for Testers](#special-instructions-for-testers)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Project Overview
Holidaze is designed to provide users with a seamless experience when searching and booking holiday venues. It features a customer-facing side for browsing venues and making bookings, as well as an admin-facing side for venue managers to create, update, and manage venues and bookings.

This project is built with React, TypeScript, and Material UI, and deployed using Vite for a fast and responsive user experience. It uses the Holidaze API for all accommodation data and booking functionality.

## Features
- **Venue Listing**: Users can browse through a list of venues and search by location or keywords.
- **Map Integration**: Users can explore venues through an interactive map, with zoom functionality that updates the venue listings.
- **Venue Details**: Users can view detailed information about a specific venue, including availability and amenities.
- **Booking**: Registered users can book available dates at their preferred venue.
- **Profile Management**: Users can update their profile information, including avatar images.
- **Admin Dashboard**: Venue managers can create new venues, manage existing venues, and handle booking information.
- **User Roles**: Users can switch from a customer to a venue manager role within their profile.

## Technology Stack
- **Frontend**: React, TypeScript
- **Styling**: Material UI (MUI)
- **Map Functionality**: React Leaflet, Leaflet MarkerCluster
- **Routing**: React Router DOM
- **API Integration**: Axios
- **State Management**: React Hooks
- **Build Tools**: Vite
- **Testing**: Cypress for end-to-end testing, ESLint for code linting

## Installation
To run this project locally, you need to clone the repository and install all dependencies. Here are the steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/holidaze.git
    cd holidaze
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Add Environment Variables**:
   - Create a `.env` file in the root of the project.
   - Add your Holidaze API key to the `.env` file:
     ```
     VITE_API_KEY=your_api_key_here
     ```

## Running the Application
- **Development Server**: To start the development server, run:
    ```bash
    npm run dev
    ```
    This will start the server on [http://localhost:5173](http://localhost:5173).

- **Production Build**: To build the project for production, run:
    ```bash
    npm run build
    ```
    After building, you can preview the production build using:
    ```bash
    npm run preview
    ```

## Running Tests
This project uses Cypress for end-to-end testing.

- **Open Cypress UI**:
    ```bash
    npm run cypress:open
    ```
    This command will open the Cypress test runner UI.

- **Run Cypress Tests in CLI**:
    ```bash
    npm run test:e2e
    ```
    This command will start the development server and then run all end-to-end tests in the command line.

## Special Instructions for Testers
- Ensure that the `.env` file is correctly set up with the required API key before running tests.
- Some tests, especially those related to bookings, require specific venues to be available. If bookings conflict, adjust the dates or select different venues to ensure successful testing.
- **Booking Process**: The booking form requires valid dates, and you may need to check available dates first to avoid conflicts during testing.

## Project Structure
- **src/components**: Contains reusable React components used across different pages.
- **src/pages**: Contains all the main pages, including the homepage, venues page, venue details, user profile, and admin dashboard.
- **src/styles**: Contains styles and custom theme settings using Material UI.
- **cypress**: Contains Cypress end-to-end tests.

## Contributing
If you want to contribute to Holidaze:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add a feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.

All contributions are welcome and appreciated!