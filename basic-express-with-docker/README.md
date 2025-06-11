# 🐳Docker

- [What is docker?](#what-is-docker)
- [Docker Engine](#docker-engine)
- [Images](#images)
- [Containers](#containers)
- [Docker Registry](#docker-registry)
- [Port mapping](#port-mapping)
- [Common Commands](#common-commands)
- [Dockerfile](#dockerfile)
- [Build docker image from Dockerfile](#build-docker-image-from-dockerfile)
- [Layers in docker](#layers-in-docker)
- [Volumes](#volumes)
- [Blind Mounts](#blind-mounts)
- [Networks](#networks)
- [Docker compose](#docker-compose)

## What is docker?

- Docker is open source tool that let’s you containerize  your application and make deployment process easier.

### Docker Engine

- Core of docker. Consist Docker Daemon (Background process that manages images, containers, networks, and volumes.) and Docker Client(CLI that allow to user to build, run and manage containers)
- For Reference, the following command starts `mongo` in all operating systems -

```bash
docker run -d -p 27017:27017 mongo
```

<aside>

> Docker cli is not the only way to talk to a docker engine. You can hit the docker REST API to do the same things.
> 
</aside>

### Images

- A lightweight. standalone executable package that contains everything like code, a runtime libraries, environment variables, and config files to run a piece of software.

### Containers

- Runnable instance of a Docker image.
- When you run a Docker image, Docker Engine creates a container from it. Encapsulates the application or service and its dependencies, running in an isolated environment.
- Allow you to package an application, along with all its dependencies and libraries, into a single unit that can be run one any machine with a container runtime, such as Docker.
- Benefits:
    - Lets you describe all config in one file
    - Runs in isolated environments
    - Makes local setup breeze
    - Makes installing services/DBs easy

### Docker Registry

- It is similar to GitHub, but it lets you push images rather than source code.

### **Port mapping**

- Since the container is isolated environment. It has its own internal network which means all the ports it uses are not directly accessible from the host machine(A machine where your Docker daemon is running) or the outside world by default.
- Port mapping creates bridges or a "tunnel" between a specific port on your **host machine** and a specific port inside your Docker container.
- Most probably we perform port mapping when we start a docker container.

```bash
docker run -p <host_port>:<container_port> <image_name>
```

### Common Commands

- To list out all the images in your machine
    
```bash
docker images
```
    

- To list out all the containers running in your machine
    
```bash
docker ps
```
    
- To start your container with options -p (port mapping) -d (run it in detached mode). There are other options too. Visit their website [docker run](https://docs.docker.com/reference/cli/docker/container/run/).

```bash
docker run -d -p 2707:2707 mongo
```

- To build your image using `Dockerfile`,

```bash
docker build [OPTIONS] PATH | URL
```

- To push your image to docker registry,

```bash
docker push
```

- To stop one or more running containers,

```bash
docker kill [ContainerId] #or
docker kill [NameOfTheConainer]
docker kill $(docker ps -q) #kill all
```

- To run command inside running container (for r debugging, inspecting),

```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
docker exec -it mongo bash #let's into shell of that container
docker exec my-nginx ls / #run ls in container
docker exec -it <container_name_or_id> /bin/bash
```

### Dockerfile

- If you want to create image from your code, show you can push to dockerhub, you need to create docker file for you application.
- A text file that contains all the commands a user could run on cli to create image.
- A docker file has 2 parts: 1. Base image 2. bunch of command to run image.

```docker
#Dockerfile
#base image
FROM node:16-alpine

#create app directory
WORKDIR /app

#copy files in to the app dir
COPY package*.json ./

#install all modules
RUN npm i

#copy all source code
COPY . .

#best practice mark our image has service which listen on this port
EXPOSE 4000

#final command that is run when the users starts container
CMD [ "npm", "start" ]
```

- Most common instruction
    - [`FROM <image>[:<tag>]` ] : specify the base image. We always use the existing one.
    - [ `WORKDIR path/to/workdir`] : sets the current work dir in the container.
    - [`COPY <src> <dest>`]: copies new files or dir into image’s filesystem.
    - [`LABEL <key>=<value>`]: adds meta data
    - [`RUN <command>`]: executes cmds inside container during build process.
    - [`EXPOSE <port>`]: to informs docker that container will listen to this port at runtime
    - [`ENV <key>=<value>`]: sets env variable inside the image.
    - [`CMD ["executable", "param1", "param2"]`]: sets the cmd to be executed when containers starts.
- Now there are some files or dir, you don’t want to copy in to an image. For ex. .env node_modules, test modules, log files, .git file. For that we need to add `.dockerignore` file in our dir which same as `.gitignore`.

```
node_modules
npm-debug.log
.env
.git
.gitignore
Dockerfile
docker-compose.yml
README.md
test
tests
coverage
*.log
```

### Build docker image from Dockerfile

- To build image from the Dockerfile run. Eventually this command reads instrcution form the dockerfile, where is instruction create new layer in docker image.

```bash
docker build [OPTIONS] PATH | URL
docker build -t <image_name>:<tag> . #dot represents current dir
docker build -t express_server:1.0 .
```

- After the build completes, you can verify your image by running this cmd (list out all the images currently in your machine):

```bash
docker images
```

- To run the image,

```bash
docker run -p 3000:3000 image_name  #or
docker run -p 3000:3000 image_id  #or
docker run -e TOKE_SECRET="secret" image_name #pass env variables
docker run --rm image_name #automatically removes the container when it exits.
docker run -d-p 4000:4000 image_name #runs container in background
docker run --env-file ./.env image #reads the env var from your host machine and passed to container
```

<aside>

> If your .env file contain TOKEN_SECRET=”secret” like this then just remove quotes (””) and then use `—env-file ./.env` . So you didn’t get any error.
> 
</aside>

- To stop the container run `docker kill containerId` , to get the container id run `docker ps`.
- Once you `stop` or `kill` container it still persist on your machine. You can check it by running,

```bash
docker ps -a
```

- So one thing is clear here `stop` or `kill` cmd actually stop the process, not remove container instance. This because may you can reuse that container again or may be it crashed so you can see the logs of it.
- You can restart stopped container again by using this cmd,

```bash
docker start <container_name_or_id>
```

- You can remove container,

```bash
docker rm <container_name_or_id>
```

- Other useful commands,

```bash
docker logs <container_name_or_id> #see logs of container at the time of execuation
docker inspect <container_name_or_id> #detailed info of container
```

### Layers in docker

- Docker image is built form multiple read-only layers. Each layer is stack upon each other, representing set of difference from the previous layer. This will make docker image build efficient, fast and portable.
- How layers are made:
    - Base layer: Stating point of image, OS like ubuntu, alpine etc.
    - Instruction Layer: Each cmd in dockerfile creates a new layer in the image, which includes `RUN`,`COPY`, which modify filesystem. This layer is on top of base layer.
    - Reusable & Shareable: Layers are cached and reusable across different, makes building & sharing images more efficient, can be reuse the same layers, reducing storage space & speeding up image
    - Immutable: Layers are read only, if changes were made, docker creates a new layers.
- You can see layers in action once you create new container again. If a layer changes, all subsequent layers also change.

### Volumes

- Volumes are way to persists data generated by and used by containers. Whenever the container is remove the data stored in it’s writable layer also lose forever. Now volumes is special dir or file that’s lived outside the container's filesystem. It’s persists data independently of the containers lifecycle.
- To create volume,

```bash
docker volume create my-app-data
```

- Now all you need to do is whenever you create container use `-v` options and provide your container name (if it’s not exist docker will create it) and followed by colon `:` provide path of the container so volume will be mount on that path.
- For ex.  here we mounts volume in postgres container

```bash
docker run -d \
  --name my-postgres-db \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -v my-app-data:/var/lib/postgresql/data \ #path where volume will be mounted
  postgres:latest
```

- Her are some common commands

```bash
docker volume ls #list out all volumes
docker volume inspect <volume_name> #get detailed info
docker volume rm <volume_name> #remove volume
```

### Blind Mounts

- When you want to mount container dir to host machine dir, docker provides another tool called blind mounts.
- So the diff between volume and blind mounts is volumes is created within docker storage dir , blind mounts mounts is let’s mountt container dir to host machine. Most of the time it is used of devloper purpose (for ex. you changes file in the host machine which directly reflects to container).
- You need to pass `-v` options and also provide both container and host machine path, whenver you start container.

```bash
docker run -d -v <host_path>:<container_path> <image_name>
```

### Networks

- Networking is way to where containers can communicate each other and with outside the world. For ex. you have postgres image in your machine and your app image. Network will allow application image to connect  with postgres image.
- Now `localhost` in the docker container is the it’s own network and not the network of the host machine.
- Here are some common commands,

```bash
docker network create my_custom_network #create network
docker network ls #get list of networks
docker network inspect <network_name_or_id> #provide detailed info of network
```

- To connect with container all you need to is while running container passed option. `—-network`with the network name.

```bash
docker run -d --network <name_or_id> <image_name>
```

- To connect or disconnect with running container,

```bash
docker network connect <network_name_or_id> <container_name_or_id>
docker network disconnect <network_name_or_id> <container_name_or_id>
```

- To remove network form host machine,

```bash
docker network rm <network_name_or_id>
```

<aside>

> Whenver you were using database container in your machine (postgres or mongo), your application in host machine need to connect with `localhost` to commnicate each other. But that thing is change when your database container and your app container uses network to connect with each other. The change is instead of `localhost` we need to provide db `container name` or `container id` . For ex. Her is you connection string for mongo when you run you app in host machine.
> 

```
DB_URL=mongodb://localhost:27017/
```

Now here if you run both app and db container in one network then your connection string (for ex your db container has name mongoAppDB).

```
DB_URL=mongodb://mongoAppDB:27017/
```

</aside>

### Docker compose

- If you want to run multiple container docker provide powerful tool for defining and running multiple docker apps. We can define entire configuration application stack in one yaml file.
- In other words it’s tool for orchestrating multiple docker containers so all the containers can work together as single application.
- You can describe application’s services, networks and volumes in `docker-compose.yaml` file. Here docker compose contains key-values pairs of services.
    - `version` : file format version
    - `services`: defines a container which is part of application
        - This service we need to define:
            - `image`: the docker mage to use (ex. `mongo`, `backend:1.0`)
            - `build`: want to build image form a dockerfile (ex. `.` or `./my-app` )
            - `ports`: port mapping (ex. `80:80`)
            - `enviroment`: env var to pass container (ex. `DATABASE_URL:”sfsdf”`)
            - `volumes`: for persist data (ex. `my-data:/var/lib/mysql`)
            - `networks`: network to connect (ex. `app-network`)
            - `depends_on`: other service that need to depends (ex. `mongodb` )
    - `networks`: custom networks that your services will use to communicate
    - `volumes`: volumes for data persistence
- Common commands:
    - To build and starts the container for all services run
    
    ```bash
    docker compose up
    docker compose up -d #deteched mode
    docker compose up --build #force build
    ```
    
    - To stop and remove containers, networks and volumes
    
    ```bash
    docker compose down
    docker compose down --volumes #removes named volumes as well
    ```
    
    - Some other useful commands
    
    ```bash
    docker compose build #build or rebuild images
    docker compose ps #list runnig services
    docker compose logs <service name> #display logs
    docker compose exec [service_name] <command> #execute command inside container
    ```
    
- Let’s build yaml file. Here is the ex. This config contains two container services, one volume and one network. The first one uses postgres image as well we added volume and network. Second in is our app service. This app service use build  instruction to build image for the docker file.

```yaml
version: "3.0"

services:
  postegresdb1.0:
    image: postgres
    container_name: postegresdb1.0
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=mysecretpassword
    volumes:
      - app-data:/var/lib/postgresql/data
    networks:
      - app-network
  app1.0:
    build: .
    container_name: app1.0
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:mysecretpassword@postegresdb1.0:5432/postgres
      - PORT=4000
      - TOKEN_SECRET=afefadkfhauefaoeibfae8a6df59ad3f1a8dfasdf
      - TOKEN_EXPIRY=1d
    networks:
      - app-network
    depends_on:
      - postegresdb1.0
networks:
  app-network:
volumes:
  app-data:
```