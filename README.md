# WorkBox-Frontend
A web application for enhancing employee management and internal process automation within IT companies and related industries.


## Basic project information:
 * **Project title**: WorkBox
 * **Autor**: Brčaninović Hasan, Mujkić Ajna, Peljto Emina
 * **Project type**: Spring Boot React Web Application
 * **Version**: 0.1
 * **Year of production**: 2025 


## Project overview
### Project description
WorkBox is an information system designed as a microservice web application to improve the organization and management of employees within an IT company. It is a universal web application primarily focused on the IT sector but can be applied to other related industries. The system aims to improve internal communication and automate typical processes such as generating financial reports, processing work hours and organizing human resources within the company and its projects.

### System actors and business processes
The system defines 3 types of actors that are organized into 3 microservices:
1. Financial manager - an actor operating in the Financial Microservice
2. HR - actor in charge of processes in the HR Microservice
3. Business manager - in charge of processes in Business Microservice
Each microservice represents a different sector that makes up the WorkBox information system.

### Functionalities
Funkcionalnosti pojedinih mikroservisa u okviru WorkBox aplikacije su navedene u nastavku.

**Financial Microservice:**
* **Benefits management** – Financial managers can update employee benefits, including adding new ones or modifying existing ones.
* **Payroll** – Allows financial managers to generate payroll lists for employees. 
* **Report generation** – Enables the creation of two types of reports: work hours and employee status.

**HR Microservice**
* **Openings management** - HR officers can create and publish job listings on the company’s platform.
* **Openings evaluation** - HR can close job postings and automatically evaluate candidates who have applied within the deadline, generating a final ranking list.
* **Record Management** - Enables the management of employee file records.

**Business Microservice**
* **Project registration** - Allows analysts to register projects that have been agreed upon with clients, making them available for implementation by development teams.
* **Project management** - Team leads can organize, assign tasks, and track the progress of projects, including updating project data and closing completed projects.
* **Task submission** - Team members can submit completed tasks, which updates the status of the project.

### Demo video and documentation
Visit the link below for a demo of WorkBox:<br>
https://drive.google.com/drive/folders/1E9YD5gGxO9Ka-4IJ9Kf9j-dZJ4RxEugM?usp=sharing

Complete documentation can be found at the following link:<br>
https://drive.google.com/drive/folders/1E9YD5gGxO9Ka-4IJ9Kf9j-dZJ4RxEugM?usp=drive_link
<br>

### Backend repository
The backend repository is located at the following link:<br>
https://github.com/amujkic1/WorkBox
<br>
<br>


## Startup instructions

### 🛠️ Prerequisites
- Java 21+
- Maven
- Docker
- Docker Desktop
- Git

### 📂 Step 1: Clone project
Clone backend and frontend repositories:
```bash
git clone git@github.com:amujkic1/WorkBox.git
```
```bash
git clone git@github.com:amujkic1/WorkBox-Frontend.git
```


### 🔧 Step 2: Build Each Microservice
Each microservice is an independent Maven project and must be built separately. Run the following commands from the root directory:

```bash
cd Auth
mvn clean install

cd ../Business
mvn clean install

cd ../Finance
mvn clean install

cd ../HR
mvn clean install

cd ../SystemEventsServer
mvn clean install

cd ../EurekaServer
mvn clean install

cd ../api-gateway
mvn clean install

cd ../config
mvn clean install
```

### 📦 Step 3: Navigate to the Root Folder
Ensure you are in the root folder that contains the `docker-compose.yml` file:

```bash
cd ..
```

### 🐳 Step 4: Start All Services with Docker Compose
Run the following command:

```bash
docker build -t workbox-frontend-dev .
docker run -p 5173:5173 workbox-frontend-dev
```

This will start all services (including Eureka, Gateway, and all microservices) in Docker container.

### ✅ Accessing the Application
- **Eureka Server**: [http://localhost:8761](http://localhost:8761)
- **API Gateway**: [http://localhost:8080](http://localhost:8080)

### 🛑 Stop All Services
To stop and remove all containers:

```bash
docker-compose down
```







