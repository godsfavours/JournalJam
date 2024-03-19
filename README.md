# Team 37 (JournalJam)

Welcome to [JournalJam](https://tinyurl.com/journallm) -- a journaling app built for CS194 Winter 2024, the Senior Project capstone class at Stanford University.
An instance of our project is hosted on a custom Ubuntu Server at [https://tinyurl.com/journallm](https://tinyurl.com/journallm).

:star: [About The Team](https://github.com/StanfordCS194/Win24-Team37/wiki) :star:

## Table of Contents
- [Project Synopsis](#project-synopsis)
- [Installing & Deploying a Local Instance of JournalJam](#installing--deploying-a-local-instance-of-journaljam)
    - [Fine-Tuning an Instance of GPT 3.5](#fine-tuning-an-instance-of-gpt-35)
    - [Option 1: Installation & Deployment Using Docker (Highly Recommended)](#option-1-installation--deployment-using-docker-highly-recommended)
    - [Option 2: Local Installation & Deployment](#option-2-local-installation--deployment)
        - [Deploying the Backend](#deploying-the-backend)
        - [Deploying the Frontend](#deploying-the-frontend)
- [Tech Stack](#tech-stack)

## Project Synopsis

Our innovative web application redefines daily journaling by integrating a fine-tuned Language Learning Model (LLM), providing personalized prompts and insights based on users’ previous entries. This AI-enhanced platform not only facilitates deeper reflection and consistency in journaling but implicitly features mood tracking and thematic analysis for comprehensive emotional and mental well-being monitoring. Designed with a focus on user experience and data security, this app offers an intuitive interface and secure environment, making it an essential tool for anyone seeking to enrich their self-care routine through thoughtful, AI-guided journaling.

## Installing & Deploying a Local Instance of JournalJam
> [!IMPORTANT]
> Regardless of the installation method, you need to have a valid OpenAI API Key and have this key set as an environment variable under `OPENAI_API_KEY`
>
> Feel free to visit [OpenAI's official documentation](https://platform.openai.com/docs/quickstart?context=python) for instructions on creating an OpenAI account, creating an API key, and setting your API key as an environment variable.

Please ensure that you have cloned the repository:
```
git clone https://github.com/StanfordCS194/Win24-Team37.git
```

And that your current-working-directory is within the the cloned repository:
```
cd Win24-Team37
```

### Fine-Tuning an Instance of GPT 3.5

JournalJam uses a fine-tuned instance of GPT 3.5 as its current LLM. However, because OpenAI does not support sharing fine-tuned instances of GPT between different organizational accounts, you must fine-tune your own instance of GPT 3.5 using the training data we make available in our repo.

**Prerequisites**:
 - A valid OpenAI API Key set as an environment variable under `OPENAI_API_KEY` (see "Important" note above for more details)
 - [Python3.10.X](https://www.python.org/downloads/release/python-31011/) installed 
 - The `jupyter` and `openai` Python packages, which you may install using:
 ```
 python3.10 -m pip install openai jupyter
 ```

 To do this, first navigate to the dataset folder: 
```
cd dataset
```

From here, step through the `format_validation.ipynb` Python Notebook to ensure that the cloned instance of [fine-tuning dataset](/dataset/fine_tuning_dataset.jsonl) is properly formatted. The last cell should print out `No errors found.`

Next, step through the `fine_tune.ipynb` Python Notebook to submit for a fine-tuning job of GPT 3.5 under the account that your OpenAI API Key is tied to. Once the fine-tuning job is submitted, it may take some time for an instance of GPT 3.5 to be fine-tuned. The Python Notebook will walk you through on checking the status of your fine-tuning job. Once your fine-tuning job is completed, **copy to your clipboard / note down the fine-tuned model ID**. 

Finally, navigate to the [configs.py](/backend/journal_app/configs.py) file under `backend/journal_app/configs.py`, and replace the value of the `MODEL_ID` string with the fine-tuned model ID that you noted/copied earlier.

:star: Congrats! You have successfully fine-tuned an instance of OpenAI's GPT 3.5 :star:


### Option 1: Installation & Deployment Using Docker (Highly Recommended)
> [!TIP]
> Docker streamlines the installation and deployment of JournalJam on a local instance, significantly reducing setup efforts for both backend and frontend, while eliminating version mismatches and missing dependencies in your development environment.

**Prerequisites**:
 - Docker (please ensure that you have the [correct version of Docker installed](https://docs.docker.com/engine/install/) per your host machine's OS.)
 - Make sure that you followed the above steps for [fine-tuning an instance of GPT 3.5](#fine-tuning-an-instance-of-gpt-35)

First, please ensure that your current-working-directory is within the `Win24-Team37`. To ensure you're in the right place, make sure that you get something along the lines of the following output when running the `ls` command:
```
ashley_git_assignment  docker-compose.yml   frontend/                  package.json       team_member_images/
backend/               Dockerfile.backend   godsfavour_git_assignment  package-lock.json
dataset/               Dockerfile.frontend  janice_git_assignment      README.md
```

Next, run the following command to automatically build one Docker image for the frontend, one Docker image for the backend, spawn containers for each image, and ensure proper port-forwarding between the frontend and backend:
```
docker-compose up
```

Optionally, you can run it with the `-d` flag (i.e. `docker-compose up -d`) to ensure that the containers persist after you exit out of the shell. However, this is not recommended for the first time you build the Docker images so that you can view the status of the image-building in real-time without having to view logs. 

Once the Docker containers are successfully spawned, you may navigate to your local instance of JournalJam at [http://localhost:3000](http://localhost:3000)

### Option 2: Local Installation & Deployment
> [!TIP]
> Ensure that you are aware of how to simultaneously open and run multiple terminal windows/shells on your OS!

**Prerequisites**:
 - [Python3.10.X](https://www.python.org/downloads/release/python-31011/) installed
 - Make sure that you followed the above steps for [fine-tuning an instance of GPT 3.5](#fine-tuning-an-instance-of-gpt-35)
 - Valid versions of `node` and `npm` installed. You may validate this by running `node -v` and `npm -v`. If you encounter any errors in either of these commands, then [please ensure that you have both installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).


#### Deploying the Backend:

First, please ensure that your current-working-directory is within the `Win24-Team37`. To ensure you're in the right place, make sure that you get something along the lines of the following output when running the `ls` command:
```
ashley_git_assignment  docker-compose.yml   frontend/                  package.json       team_member_images/
backend/               Dockerfile.backend   godsfavour_git_assignment  package-lock.json
dataset/               Dockerfile.frontend  janice_git_assignment      README.md
```

Next, you will want to navigate to the [backend folder](/backend/) by running:
```
cd backend
```

Here, you will want to install all the necessary Python package dependencies:
```
python3.10 -m pip install -r requirements.txt
```

Finally, you can deploy the backend by running the following two commands in succession:
```
python3.10 manage.py migrate
python3.10 manage.py runserver
```

By default, the backend will listen to API calls on port 8000 (which is where the frontend expects the backend to be listening). 

>[!IMPORTANT]
> Closing out of this shell will terminate the currently running backend process -- try to avoid closing out of this shell while deploying the frontend!
>
> If you do accidentally close out of this shell, then you may redeploy the backend simply by running `python3.10 manage.py runserver` while the backend folder is your current-working-directory.


#### Deploying the Frontend:

Without closing out of shell running the backend deployment, open up a new shell. 

First, navigate to the folder where you cloned the Github repo and ensure that your current-working-directory is within the `Win24-Team37` folder. To ensure you're in the right place, make sure that you get something along the lines of the following output when running the `ls` command:
```
docker-compose.yml     frontend/            package.json        team_member_images/
backend/               Dockerfile.backend   package-lock.json
dataset/               Dockerfile.frontend  README.md
```

Next, you'll want to navigate to the [frontend folder](/frontend/) by running:
```
cd frontend
```

Here, you will want to install all the necessary package dependencies:
```
npm install
```

Then, you can deploy the frontend by running the following:
```
npm start
```

Once this is completed, it should automatically open a browser window to your local instance of JournalJam. If this is not the case, then you can access JournalJam at [http://localhost:3000](http://localhost:3000)

>[!IMPORTANT]
> Closing out of this shell will terminate the currently running frontend process!
>
> If you do close out of this shell unintentionally, then you may redeploy the frontend simply by running `npm start` while the frontend folder is your current-working-directory.

## Tech Stack

Our tech stack is a React frontend, with Django backend and SQLite database. We chose a React frontend since it is a popular framework for good reason. React code is seen as easier to maintain due to its emphasis on modularity thus developers can reuse components, React has fast rendering time, and it can be easily extended for both web applications and mobile. Additionally, since React is popular and has many forums and resources online for its learning, we expect a smoother onboarding process for new team members.

As our application is a journalling app, we need a backend that works well in tandem with a database fixture to store our user's entries. We chose Django since it has support for an Object-relational mapper (ORM) which allows us to interact with our database using code rather raw SQL, which is much easier for maintaining and debugging. We chose SQLite DB as it is a lightweight and easy to use database connection that by default ports with the Django backend. Django is also user-friendly, coming with many libraries, modules, online documentation. Thus, Django allows for an easy onoarding experience for any team member who joins.

We separate our codebase into a backend directory and frontend directory. In our backend we have APIs that interact with the SQLite database, and these APIs are accessible from defined [URLs](/backend/journal_app/urls.py). These APIs are then used by the frontend.

