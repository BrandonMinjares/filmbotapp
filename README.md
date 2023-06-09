# FILMBOT
Welcome to the Filmbot! This is a platform where movie lovers can review movies and get recommendations based on the ratings and preferences of similar users. The website utilizes user-based collaborative filtering to provide personalized recommendations and the Movie Database API to get the latest information on all movies.

![Filmbot Dashboard Image](https://github.com/BrandonMinjares/ImageRepo/blob/main/Screen%20Shot%202023-04-24%20at%201.36.54%20PM.png)
![Filmbot Movie Page Image](https://github.com/BrandonMinjares/ImageRepo/blob/main/Screen%20Shot%202023-04-24%20at%202.02.21%20PM.png)

# Features
* User registration and login
* Movie rating and review system
* Personalized movie recommendations based on collaborative filtering
* Watchlist feature to keep track of movies to watch
* Latest movie information from the Movie Database API

# Technologies Used
Filmbot was built using the following technologies:

* HTML/CSS
* JavaScript
* Python
* PostgreSQL (Database)
* The Movie Database API

# Installation
Clone the repository and expand into an empty folder.

Download and install node.js LTS for your operating system: https://nodejs.org/en/download/.

Download and install Docker for your operating system: https://www.docker.com/products/docker-desktop.

To setup the development environment, navigate to the folder where you extracted the starter code and run the following command:
    ```
      $ npm install
    ```

To start the database Docker container, in the backend folder run:
    ```
    $ cd backend
    $ docker-compose up -d
    $ cd ..
    ```

To start the frontend and backend dev servers, run the following command in a separate terminal:
    ```
    $ npm start
    ```

To stop the database, run:
    ```
    $ cd backend
    $ docker-compose down $ cd ..
    ```
    
You will need to create an account at https://www.themoviedb.org/ to create your own API key in order to access movie information. After doing that you will navigate to your backend folder in the program and open the 'env' file. Copy and paste the API key into a variable called 'TMDB_API_KEY'.

# Notes on Recommender System
The recommender algorith is contained in th 'RecommenderWithScheduler.py' file. To use you must have installed Python or Python3. Then open another terminal and run the command:

    $ Python3 RecommenderWithScheduler.py
    
The file will create a server that calls a Recommender script that runs every 15 seconds. It is currently set to recommend movies if the user has rated 2 or more movies, though in a real world application this would be increased to 10-15 movies, which will give the script a better representation of the user's preferences.
