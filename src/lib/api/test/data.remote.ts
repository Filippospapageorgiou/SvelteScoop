import { query, form, command } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { task } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import * as z from 'zod';

// query test get tasks
export const getTasks = query(async () => {
	const tasks = await db.select().from(task);

	return {
		success: true,
		message: 'Successful loaded tasks',
		tasks: tasks ?? []
	};
});

//form create task
const createTaskSchema = z.object({
	title: z.string(),
	priority: z.number().positive()
});

export const createTask = form(createTaskSchema, async (data) => {
	const result = await db.insert(task).values({
		title: data.title,
		priority: data.priority
	});

	console.log('result insert query: ', result);
	return {
		success: true,
		message: 'task insert success'
	};
});

const deleteTaskSchema = z.object({
	id: z.uuid()
});

export const deleteTask = command(deleteTaskSchema, async ({ id }) => {
	await db.delete(task).where(eq(task.id, id));
	return {
		success: true,
		message: 'Task delete success'
	};
});
