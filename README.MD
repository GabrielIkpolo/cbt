## This is a Computer Based Testing (CBT) Application under development

## Requirements for Installation

Clone the repository if you are using ssh by running:

    `git clone git@github.com:GabrielIkpolo/cbt.git`   

or using https:

    `git clone https://github.com/GabrielIkpolo/cbt.git`


cd into the cbt/server and run:
    `npm install`

cd into ui and run: 
    `npm install`


The application used mongodb and prisma, so if you intend to run the application locally, you must install mongodb and setup at least a replica set. if you intent to run this online, there is no need for setting up a replicaset since mongo db online has that by default.

In the root directory for ui create an .env file and configure your environment variable base url:
    
    VITE_REACT_APP_API_BASE_URL=http://localhost:3000

In the root directory of server, also add a .env file and modify your configuration for your environment variable. Eg:

    DATABASE_URL=`mongodb://localhost:27017/cbt`
    PORT=3000
    JWT_SECRETE=`hdksddowncocwhateveryoufgeellike;@`
    ALLOWED_ORIGINS="http://localhost:5000"



### For the Window users, here is a basic steps to install setup and stat a replicaset locally

Step 1: Install MongoDB

Visit the MongoDB download page: https://www.mongodb.com/try/download/community

Scroll down to the "Community Server" section.

Choose the version and edition of MongoDB you want to install. Select "Windows" as the operating system.

Click the "Download" button to download the installer.

Once the installer is downloaded, run it. Follow the installation instructions to complete the installation. You can leave the default settings unless you want to change the installation path.

Step 2: Create MongoDB Data Directory

Create a directory where MongoDB will store its data. For example, create a folder named "data" in the root of your C drive: C:\data
Step 3: Start MongoDB

Open a Command Prompt as Administrator.

Navigate to the MongoDB installation directory. By default, it's in "C:\Program Files\MongoDB\Server<version>".

Start MongoDB with the following command, replacing <data_directory_path> with the path to the "data" directory you created:


mongod --dbpath C:\data

MongoDB will start, and you should see it listening on a specific port.

Step 4: Install MongoDB Compass

### Download MongoDB Compass from the MongoDB download page: https://www.mongodb.com/try/download/compass

Run the installer and follow the installation instructions.

Step 5: Configure Replica Set

### create these directory in C:\data\db1, C:\data\db2, C:\data\db3

Open a new Command Prompt

Then run this:
 
mongod --dbpath C:\data\db1 --port 27017 --replSet rs0
mongod --dbpath C:\data\db2 --port 27018 --replSet rs0
mongod --dbpath C:\data\db3 --port 27019 --replSet rs0

### 3 replica set is the standared, but you can trauncate it to 2 or 1 in your dev environment.

Initialize Replica Set: Connect to one of the MongoDB instances (e.g., on port 27017) using the MongoDB shell:


mongo --port 27017 ( Or just type mongo)

Then, initiate the replica set by running the rs.initiate() command:

   ` rs.initiate(
    {
        _id: "rs0",
        members: [
            { _id: 0, host : "localhost:27017" },
            { _id: 1, host : "localhost:27018" },
            { _id: 2, host : "localhost:27019" }
        ]
    }
    )`
This command will configure the replica set with the specified members.

rs.initiate()

Verify Replica Set Status: You can verify the status of the replica set by running the rs.status() command in the MongoDB shell:

rs.status()

## To start up mongodb on windows with replicaset enabled run this on cmd:

mongod --dbpath C:\data\db1 --port 27017 --replSet rs0


## Activating your Prisma Schema

install prisma globally on your machine:
    `npm install -g prisma`

cd into server and run
    `prisma format`
    `prisma generate`
    `prisma db push`

If there are no errors you can then start your application.

## Running the application

cd into server and run:
    `npm run dev`


cd into ui and run
    `npm run dev`

## Testing your application

you can test the appliction by sending this on your rest client or postman:

    {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "registrationNumber": "123456",
    "department": "Engineering",
    "role": 2
    }

to `localhost:3000/api/register` with a post request. If you get a response with token, you are good to go.


