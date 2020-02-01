# Preparation

- install the desired database, this example is made with **MariaDB** [link to a youtube tutorial](https://www.youtube.com/watch?v=hDKnsUrz0nM&t=195s)

- install Pachet Sender (like Postman for TCP) [download link](https://packetsender.com/)

- download the code and run `npm i`

# Write your .env variables

Now is time to write your configuration for this project. Create two files: _.env.development_ and _.env.test_.

**!** Both will be ignored with _.gitignore_

**!** In production instead of these two, create a new file on your server named _.env.production_

This is an example for _.env.development_
**! Replace with your config**

```
DB_SERVER_PORT=3306
DB_SERVER_HOST=localhost
DB_SERVER_USERNAME=root
DB_SERVER_PASSWORD=root
DATABASE=users

ERROR_CODE_NAMESPACE=users-microservice
```

# Microservice Port

**:8875**

# Response Format

```
{
  "status":ResponseStatus
  "data":any -> '' when no data is found
  "error":CustomError
}
```

**ResponseStatus** - "success" or "fail"

**CustomError** - consist of 3 parts: an error code, a message and a namespace. Codes are universal, but messages can vary. Here is the error JSON payload:

```
{
  "code":number,
  "msg":string || string[]
  "namespace":string
}
```

# Error codes

## 10xx - General Server or Network issues

**1000 UNKNOWN**

- An unknown error occured while processing the request.

**1001 DATABASE_ERROR**

- An unknown error occured on database.

## 11xx - Request issues

**1100 BAD_PARAMETERS**

- Bad parameters send to endpoint
- The validation pipe will return the error as message
