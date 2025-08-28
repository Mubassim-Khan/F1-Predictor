# F1 Predictive Insights Platform ⚡️ (Race Lap Time & Position Prediction)

![Preview Image 1](https://github.com/Mubassim-Khan/F1-Predictor/blob/main/static/images/preview.png)

<div align="center">
    <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="sklearn" />
    <img src="https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue" alt="python" />
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="flask" />
    <img src="https://img.shields.io/badge/FastF1-FF4B4B?style=for-the-badge" alt="fastf1" />
    <img src="https://img.shields.io/badge/Matplotlib-3F4F75?style=for-the-badge&logo=matplotlib&logoColor=white" alt="matplotlib" /> <br />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="html5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="css3" />
    <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="javascript" />
</div>

## 📋 <a name="table">Table of Contents</a>





1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#quick-start)
5. [License](#license)
6. [Contributing](#contributing)
7. [Acknowledgements](#acknowledgements)
8. [Contact](#contact)

## <a name="introduction">Introduction</a>

This project is a Formula 1 data science and machine learning dashboard that predicts driver race lap times and finishing positions based on Q3 (Qualifying data) data. It uses real-time telemetry data powered by FastF1 and displays insights with a custom-built Flask backend and a modern, dynamic frontend using vanilla JavaScript, HTML, and CSS.

## <a name="features">Features</a>

🔍 **Predictive Insights**: Predicts qualifying lap time & race position using a trained machine learning model.

🌍 **Real-Time Telemetry**: Utilizes real FastF1 data from qualifying sessions.

📊 **Graphical Analysis**: Displays circuit maps and gear shift plots per race track.

🔹 **Interactive Driver Cards**: Clickable drivers show detailed stats, images, and team logos.

🌟 **Dark F1 Theme**: A clean, bold, Formula 1-inspired dark theme with red/yellow accents (Red Bull style).

🌐 **Frontend Caching**: Optimized with in-browser caching to avoid duplicate predictions.

🚗 **Responsive Layout**: Fully responsive design for desktop and mobile use.

## <a name="tech-stack">Tech Stack 🛠️</a>




* [**Python**](https://www.python.org/) – Backend language powering predictions and data handling
* [**Flask**](https://flask.palletsprojects.com/) – Web framework for REST API and serving assets
* [**FastF1**](https://docs.fastf1.dev/) – Real-time F1 data access (telemetry, laps, sectors)
* [**Scikit-Learn**](https://scikit-learn.org/) – Machine learning Model (RandomForestRegressor)
* [**Matplotlib**](https://matplotlib.org/) – Data visualizations (gear shift heatmaps, corner maps)
* [**HTML5**](https://developer.mozilla.org/en-US/docs/Web/HTML) + [**CSS3**](https://developer.mozilla.org/en-US/docs/Web/CSS) – Frontend structure and styling
* [**Vanilla JavaScript**](https://developer.mozilla.org/en-US/docs/Web/JavaScript) – Frontend logic and API integration
* [**GitHub Codespaces**](https://github.com/features/codespaces) – Cloud development environment

## <a name="#quick-start">Getting Started</a>

To get started with this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Mubassim-Khan/F1-Predictor.git
```

2. Open the project in your preferred code editor.

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Run the Flask server:

```bash
python api/app.py
```

5. Open `index.html` in your browser (or serve via a local static server like Live Server)

## <a name="license">License</a>

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## <a name="contributing">Contributing</a>

Feel free to open issues, suggest improvements, or contribute with a pull request – contributions are always welcome.

## <a name="acknowledgements">Acknowledgements</a>

* [FastF1](https://github.com/theOehrly/Fast-F1) for telemetry and lap data
* Scikit-learn for powering the predictive model
* Formula 1 community and resources for inspiration and data insights

## <a name="contact">Contact</a>

For questions or collaboration, contact the project maintainer:

* LinkedIn : [Mubassim Ahmed Khan](https://www.linkedin.com/in/mubassim)
* Email: [mubassimkhan@gmail.com](mailto:mubassimkhan@gmail.com)
