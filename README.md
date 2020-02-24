
feat: Una nueva caracteristica.

fix: Se soluciono un bug.

docs: Se realizaron cambios en la documentacion.

style: Se aplico formato, comas y puntos faltantes, etc; Sin cambios en el codigo.

refactor: Refactorizacion del codigo en produccion.

test: Se añadieron pruebas, refactorizacion de pruebas; Sin cambios en el codigo.

chore: Actualizacion de tareas de build, configuracion del admin. de paquetes; Sin cambios en el codigo.




# BACKEND GAEL SOFT

## API V1 --> localhost:3000/api/v1 + 


## --------------- USERS --------------------------

### Register new user /register
[POST] : {userModel}

### Login user /login
[POST] : {userModel}

### Capture users /users
[GET] : {} 


## --------------- TASKS --------------------------

### Capture Tasks /tasks
[GET] : {}

### Create new task /tasks
[POST] : {taskModel}

### Update task state /task
[PUT] : {taskState}

### Delete task  /task/:id
[PUT] : {taskState}

### Capture task comments /tasks/:id/comments
[GET] : {}

### Update task comments /tasks/:id/comments
[POST] : {message}


## --------------- PROJECTS --------------------------

### Capture Projects /projects
[GET] : {}

### Create Project /project
[POST] : {projectModel}

### Capture project /project/:id
[GET] : {}