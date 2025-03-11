# Massachusetts Bay Transportation Authority (MBTA) Social App
The MBTA Social Media App is an interactive social media platform designed for students, commuters, and residents from Boston and its surrounding communities. This app will connect all its users whether at home or in transit through real-time updates and posts. From sharing art and graffiti pictures to rating station safety and cleanliness, and crazy encounters you will never forget, this app will have it all. Users can interact with each other by posting photos, videos, comments, and ratings. “Liking” posts allow for uninterrupted communication, helping users stay engaged and share their experiences instantly. Even an unregistered user can browse content and view posts to stay informed. Finding specific information is easier than ever with an option to search, hashtag, and tag other users. This app is powered by the people who ride the MBTA every day, and with great power comes great responsibility. All content will be monitored to maintain a respectful environment as offensive language and violent media are strictly prohibited.  

Configuration
-------------
Under users/server/create .env file that looks similar to this:
DB_URL = mongodb+srv://admin:<your admin password>@cluster<some  number>.<some unique id>.mongodb.net/<some database name>
ACCESS_TOKEN_SECRET = xb3tim8rnIdoMMJfGNaqMxHX6zyWGBrR
To do this, you need to create an MongoDB Atlas account, a collection, and a database.

The DB_URL comes from signing up for an MongoDB Atlas account and creating a cluster.  Under database select the cluster (likely
cluster0 if it is your first one) and select Connect. Select connect your application, driver=Node.js.  You will see
the database connection string in this window.

Generate a unique JWT access token for ACCESS_TOKEN_SECRET

Start Up
---------
  Start the back end by going to users/server and executing npm start.
  Start the front end by going to ui and executing npm start.
  
Front End
---------
  The Front End runs on port 8096 which is specified in ui/.env
  The land page is at http://localhost:8096/
  
Back End
--------
  The back end runs on port 8081.
  This is specified in user/server/server.js
  The back provides access to user information through a RESTful API.
