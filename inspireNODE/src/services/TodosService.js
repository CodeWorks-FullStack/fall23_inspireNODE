import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class TodosService {


    async getTodos(userId) {
        const todos = await dbContext.Todos.find({ creatorId: userId })
        return todos
    }

    async createTodo(todoData) {
        const newTodo = await dbContext.Todos.create(todoData)
        return newTodo
    }

    async editTodo(todoData, userId, todoId) {
        const originalTodo = await dbContext.Todos.findById(todoId)
        if (!originalTodo) throw new BadRequest("There is no todo with that id")

        if (originalTodo.creatorId != userId) {
            throw new Forbidden("UNAUTHORIZED TO EDIT THIS TODO")
        }

        originalTodo.completed = todoData.completed

        await originalTodo.save()
        return originalTodo

    }

    async deleteTodo(userId, todoId) {
        const todo = await dbContext.Todos.findById(todoId)
        if (!todo) throw new BadRequest("No todo to be found")

        if (todo.creatorId != userId) throw new Forbidden("Unauthorized to delete that todo")

        await todo.remove()
    }


}

export const todosService = new TodosService()