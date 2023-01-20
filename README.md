<h3 align="center">Speech Authentication Project</h3>

---

<p align="center"> API and Frontend UI
    <br>
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Built Using](#built_using)
- [Author](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This is a SpeechAuthentication project built using Next.js, TypeScript, and Django Rest Framework as the backend. Users can say their information to create an account and login. Modularity and DRY principles are followed. It's easy to modify speech to text for other complex fields like Select and so much more.

![image](https://user-images.githubusercontent.com/77179231/213792225-f176c120-d270-4594-9be6-9d88be991906.png)

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

For installing the project, you will need to have

- Python `3.9` installed.
- Must have PostgreSQL installed. You can use WSL2 to do this on Windows 10 and 11.
- NodeJS & NPM

### Installing

A step by step series of examples that tell you how to get a development environment running.

#### Setting Up the API:

Clone the project

Move into the cloned project root directory

Move into the `api` directory

```bash
cd api
```

Install dependencies

1. Linux

    ```bash
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2. Windows

    ```unix
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    ```

Setup the `.env` file

1. Move into the `src` directory

    ```bash
    cd src
    ```

2. Create a new file `.env`

3. Copy the contents of `env.example` file into the `.env`.

4. Make sure you create your database configurations and setup a strong random secret key.

Run app migrations

```bash
python manage.py migrate
```

To run the API on your local system.

```bash
python manage.py runserver
```

> API server will run on `http://localhost:8000/`. Visit [Swagger](http://localhost:8000/docs/) to read the Swagger API documentation.
> Make sure the API server is running on port `8000` if changed you will have to change it in the frontend.

#### Setup Frontend:

Move into the `auth_web` directory from the root directory

Install Dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

## 🔧 Running the tests <a name = "tests"></a>

Running tests is essential for guided development

Move into the `api` directory

Activate your virtual enviroment if not already activated

Move into the src directory

Run tests

```bash
pytest
```

### And coding style tests

This ensures coding style guidelines are followed

```bash
flake8
```

## 🚀 Deployment <a name = "deployment"></a>

The following method describes how to deploy the application

### Use Ngrok for API

- Install [Ngrok](https://ngrok.com/docs/getting-started) on your machine.
- Run API server
- Open CMD / CLI, Run `ngrok http 8000`. `8000` is used if that's the port the API server is listening to. Otherwise, use the listening port.
- The rest is history!

### Vercel for the Frontend

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-typescript)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-typescript&project-name=with-typescript&repository-name=with-typescript)

## ⛏️ Built Using <a name = "built_using"></a>

Notable Technologies include

- [Django](https://www.djangoproject.com/) - Web Framework
- [Django Rest Framework](https://www.django-rest-framework.org/) - Building Web APIs
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Python](https://www.python.org/) - Programming Language
- [NextJS](https://www.python.org/) - Programming Language
- [Typescript](https://www.python.org/) - Programming Language
- [RecordRTC](https://www.python.org/) - Programming Language

## ✍️ Author <a name = "authors"></a>

[@devvspaces](https://github.com/devvspaces)

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Dukka
- Inspiration
- References
