import { Auth0Provider } from "@bcwdev/auth0provider";
import { todosService } from "../services/TodosService.js";
import BaseController from "../utils/BaseController.js";

export class TodosController extends BaseController {
    constructor() {
        super('api/todos')
        this.router
            .use(Auth0Provider.getAuthorizedUserInfo)
            .get('', this.getTodos)
            .post('', this.createTodo)
            .put('/:todoId', this.editTodo)
            .delete('/:todoId', this.deleteTodo)
    }

    async getTodos(request, response, next) {
        try {
            const userId = request.userInfo.id // get the id of the user who sent the request...auth0 grabs this from the bearer token sent with the request
            const todos = await todosService.getTodos(userId) // passes the userId to the service to query the database
            response.send(todos)
        } catch (error) {
            next(error)
        }
    }

    async createTodo(request, response, next) {
        try {
            const todoData = request.body // grabs the object that is sent with the request; the 'payload'
            const userId = request.userInfo.id // grab id of user who sent the POST req
            todoData.creatorId = userId // assign the creatorId of the request object to the id of the person who sent it
            // NOTE  ^^^ this protects from malicious users and prevents people from manually assigning their creatorId when sending the POST request; instead we assign it from the authenticated user
            const newTodo = await todosService.createTodo(todoData) //pass the formatted object to the service to insert into database
            response.send(newTodo)
        } catch (error) {
            next(error)
        }
    }

    async editTodo(request, response, next) {
        try {
            const todoData = request.body // the body of the edit to assign changes in the database
            const userId = request.userInfo.id //grab id of person sending req for later error handling in service
            const todoId = request.params.todoId //grabs the id of the todo from the parameters of the request URL
            const editedTodo = await todosService.editTodo(todoData, userId, todoId)
            return response.send(editedTodo)
        } catch (error) {
            next(error)
        }
    }

    async deleteTodo(request, response, next) {
        try {
            const userId = request.userInfo.id
            const todoId = request.params.todoId
            await todosService.deleteTodo(userId, todoId)
            return response.send(`Todo at ${todoId} successfully deleted`)
        } catch (error) {
            next(error)
        }
    }



}