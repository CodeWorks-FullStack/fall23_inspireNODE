import mongoose, { Schema, SchemaType } from 'mongoose'

export const TodoSchema = new mongoose.Schema(
    {
        description: { type: String, required: true, maxLength: 50 },
        completed: { type: Boolean, default: false },
        creatorId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' }
    },
    { timestamps: true }
)