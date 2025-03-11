# Pet Manager

Pet Manager is a web application designed to help pet owners manage and track their pets' information, appointments, and events. With this app, you can keep track of what your pet eats, its weight, upcoming vet appointments, and other important details. Additionally, events and appointments are displayed on the main page, ensuring you never miss an important date.

## Features

- **Pet Management**: Add pets and track their information based on their type.
- **Event & Appointment Tracking**: Create and manage vet appointments and other pet-related events.
- **Calendar Integration**: Display upcoming events using a calendar view.
- **Dynamic Tracking**: Register and monitor important pet metrics like weight and diet.
- **Notifications**: Receive pop-up notifications for different interactions with the app.

## Technologies Used

This project utilizes a modern tech stack to ensure a smooth and efficient user experience:

- **[Appwrite](https://appwrite.io/)**: Handles all backend operations, including database management, authentication, and storage. Appwrite is an open-source backend-as-a-service (BaaS) that provides developers with tools to manage databases, authentication, storage, and serverless functions without needing to set up complex backend infrastructure.
- **[Vite + React](https://vitejs.dev/)**: A fast and optimized development setup using Vite for the React front end.
- **[Tailwind CSS](https://tailwindcss.com/)** & **[DaisyUI](https://daisyui.com/)**: For styling and UI components, providing a clean and responsive design.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: A lightweight and simple state management solution.
- **[React Big Calendar](https://github.com/jquense/react-big-calendar)**: A powerful calendar library used to display and manage pet events.
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: Provides stylish and customizable toast notifications for user alerts.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/pet-manager.git
   cd pet-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Appwrite:

   - In case you can't log in or sign up, because it might out of use:
   - Create an Appwrite project and configure your database, authentication, and storage.
   - Update the `.env` file with your Appwrite credentials.

5. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

- Add your pets and input relevant details.
- Register appointments and events for your pets.
- View and manage events through the calendar.
- Receive notifications every time you interact with the app (creating a pet or event for example).


---

For any issues or feature requests, please open an issue in the repository.

