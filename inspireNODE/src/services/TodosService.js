import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class TodosService {


    async getTodos(userId) {
        const todos = await dbContext.Todos.find({ creatorId: userId }) //only find the todos where their creatorId matches the id of the user who sent the request
        return todos
    }

    async createTodo(todoData) {
        const newTodo = await dbContext.Todos.create(todoData)
        return newTodo
    }

    async editTodo(todoData, userId, todoId) {
        const originalTodo = await dbContext.Todos.findById(todoId) //grabs the original todo using the id from the request URL
        if (!originalTodo) throw new BadRequest("There is no todo with that id") // throw error if no todo found in database

        if (originalTodo.creatorId != userId) {
            throw new Forbidden("UNAUTHORIZED TO EDIT THIS TODO")
        }
        // NOTE ^^ error handling against malicious users; this verifies that the person who sent the request has permission to edit a todo. Users should only be able to edit data that belongs to them so if the creatorId does not match the id of the person making the request we should throw an errro

        originalTodo.completed = todoData.completed // reassigns the properties of the original todo to the changes of the body we sent with the request 

        await originalTodo.save() // save the changes to the database
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