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
            const userId = request.userInfo.id
            const todos = await todosService.getTodos(userId)
            response.send(todos)
        } catch (error) {
            next(error)
        }
    }

    async createTodo(request, response, next) {
        try {
            const todoData = request.body
            const userId = request.userInfo.id
            todoData.creatorId = userId
            const newTodo = await todosService.createTodo(todoData)
            response.send(newTodo)
        } catch (error) {
            next(error)
        }
    }

    async editTodo(request, response, next) {
        try {
            const todoData = request.body
            const userId = request.userInfo.id
            const todoId = request.params.todoId
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