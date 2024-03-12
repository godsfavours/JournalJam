# Team 37 (JournalJam)

[About Us](https://github.com/StanfordCS194/Win24-Team37/wiki)

## Tech Stack

Our tech stack is a React frontend, with Django backend and SQLite database. We chose a React frontend since it is a popular framework for good reason. React code is seen as easier to maintain due to its emphasis on modularity thus developers can reuse components, React has fast rendering time, and it can be easily extended for both web applications and mobile. Additionally, since React is popular and has many forums and resources online for its learning, we expect a smoother onboarding process for new team members.

As our application is a journalling app, we need a backend that works well in tandem with a database fixture to store our user's entries. We chose Django since it has support for an Object-relational mapper (ORM) which allows us to interact with our database using code rather raw SQL, which is much easier for maintaining and debugging. We chose SQLite DB as it is a lightweight and easy to use database connection that by default ports with the Django backend. Django is also user-friendly, coming with many libraries, modules, online documentation. Thus, Django allows for an easy onoarding experience for any team member who joins. 

We separate our codebase into a backend directory and frontend directory. In our backend we have APIs that interact with the SQLite database, and these APIs are accessible from defined [URLs](https://github.com/StanfordCS194/Win24-Team37/blob/main/backend/journal_app/urls.py). These APIs are then used by the frontend. 

The website is hosted at [https://tinyurl.com/journallm](https://tinyurl.com/journallm).

## Local Development

The first time we set up the backend, we create an environment "shell" to use in future development. 
In one terminal you can set up the backend.
### Create backend environment


```
pip install pipenv
pipenv shell
pip install django
pip install djangorestframework
pip install django-cors-headers
```

### Launch backend 


```
pipenv shell
cd backend
python manage.py migrate
python manage.py runserver
```
Then in another terminal launch the frontend.

### Set up frontend

```
cd frontend
npm install
npm start
```

Then go to http://localhost:3000
