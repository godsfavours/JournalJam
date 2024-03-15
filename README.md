# Team 37 (JournalJam)

Welcome to [JournalJam](https://tinyurl.com/journallm) -- a journaling app built for CS194 Winter 2024, the Senior Project capstone class at Stanford University.
An instance of our project is hosted on a custom Ubuntu Server at [https://tinyurl.com/journallm](https://tinyurl.com/journallm).

## Project Synopsis

Our innovative web application redefines daily journaling by integrating a fine-tuned Language Learning Model (LLM), providing personalized prompts and insights based on users’ previous entries. This AI-enhanced platform not only facilitates deeper reflection and consistency in journaling but implicitly features mood tracking and thematic analysis for comprehensive emotional and mental well-being monitoring. Designed with a focus on user experience and data security, this app offers an intuitive interface and secure environment, making it an essential tool for anyone seeking to enrich their self-care routine through thoughtful, AI-guided journaling.

## Installing and Running a Local Instance
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
Prerequisites:
 - A valid OpenAI API Key set as an environment variable under `OPENAI_API_KEY` (see "Important" note above for more details)
 - [Python3.10.X](https://www.python.org/downloads/release/python-31011/) installed 
 - The `jupyter` and `openai` Python packages, which you may install using `python3,10 -m pip install openai jupyter`

JournalJam uses a fine-tuned instance of GPT 3.5 as its current LLM. However, because OpenAI does not support sharing fine-tuned instances of GPT between different organizational accounts, you must fine-tune your own instance of GPT 3.5 using the training data we make available in our repo. To do this, first navigate to the dataset folder: `cd dataset`

From here, step through the `format_validation.ipynb` Python Notebook to ensure that the cloned instance of [fine-tuning dataset](/dataset/fine_tuning_dataset.jsonl) is properly formatted. The last cell should print out `No errors found.`

Next, step through the `fine_tune.ipynb` Python Notebook to submit for a fine-tuning job of GPT 3.5 under the account that your OpenAI API Key is tied to. Once the fine-tuning job is submitted, it may take some time for an instance of GPT 3.5 to be fine-tuned. The Python Notebook will walk you through on checking the status of your fine-tuning job. Once your fine-tuning job is completed, **copy to your clipboard / note down the fine-tuned model ID**. 

Finally, navigate to the [configs.py](/backend/journal_app/configs.py) file under `backend/journal_app/configs.py`, and replace the value of the `MODEL_ID` string with the fine-tuned model ID that you noted/copied earlier.

:star: Congrats! You have successfully fine-tuned an instance of OpenAI's GPT 3.5 :star:


### Installation Using Docker (Recommended)
> [!TIP]
> Installing using Docker  
>
> Please ensure that you have the [correct version of Docker installed](https://docs.docker.com/engine/install/) per your host machine's OS.


## TODO:
 - Add instructions for generating OpenAI key, adding key to environment variable, and finetuning model (if user wants to run through this process themselves)
 - push instructions for dockerizing to main (consider uploading base images to docker hub)

[About Us](https://github.com/StanfordCS194/Win24-Team37/wiki)

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
pip install openai
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

## Tech Stack

Our tech stack is a React frontend, with Django backend and SQLite database. We chose a React frontend since it is a popular framework for good reason. React code is seen as easier to maintain due to its emphasis on modularity thus developers can reuse components, React has fast rendering time, and it can be easily extended for both web applications and mobile. Additionally, since React is popular and has many forums and resources online for its learning, we expect a smoother onboarding process for new team members.

As our application is a journalling app, we need a backend that works well in tandem with a database fixture to store our user's entries. We chose Django since it has support for an Object-relational mapper (ORM) which allows us to interact with our database using code rather raw SQL, which is much easier for maintaining and debugging. We chose SQLite DB as it is a lightweight and easy to use database connection that by default ports with the Django backend. Django is also user-friendly, coming with many libraries, modules, online documentation. Thus, Django allows for an easy onoarding experience for any team member who joins.

We separate our codebase into a backend directory and frontend directory. In our backend we have APIs that interact with the SQLite database, and these APIs are accessible from defined [URLs](https://github.com/StanfordCS194/Win24-Team37/blob/main/backend/journal_app/urls.py). These APIs are then used by the frontend.

